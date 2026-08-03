/**
 * @file src/screens/ARDiagnosticsScreen.tsx
 * @description AR Diagnostics Screen — Phase 5A Native AR Session Foundation.
 *
 * Full diagnostic telemetry dashboard displaying:
 *  - Native AR Session Status & FPS counter
 *  - Live 6-DOF camera pose, 3D position (X,Y,Z), orientation Euler angles, Quaternions
 *  - Plane Detection breakdown (Horizontal floors vs Vertical walls & total surface area m²)
 *  - Active Test Spatial Anchors management (Create test anchor, list active anchors, clear)
 *  - Hardware & system capability diagnostics (ARCore / ARKit version, IMU sensors)
 *  - Full session lifecycle control suite (Start, Pause, Resume, Reset Origin, Stop, Dispose)
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppTheme } from '../hooks/useAppTheme';
import {
  useARNativeSession,
  useARNativeTracking,
  useARNativePlanes,
  useARNativeAnchors,
  useARNativeDiagnostics,
} from '../hooks/arNativeHooks';
import {
  ScreenContainer,
  SectionHeader,
  PrimaryButton,
  ARDiagnosticsHeader,
  ARPoseCard,
  ARPlanesSummaryCard,
  ARAnchorsTestCard,
  ARSystemDiagnosticsCard,
} from '../components';
import type { MainStackParamList } from '../types';

type ARDiagnosticsScreenProps = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'ARDiagnostics'>;
};

/**
 * AR Session Diagnostics Screen.
 */
const ARDiagnosticsScreen: React.FC<ARDiagnosticsScreenProps> = () => {
  const { theme } = useAppTheme();
  const { colors, spacing, typography, borderRadius } = theme.custom;

  const { status, start, pause, resume, stop, reset, dispose } = useARNativeSession();
  const metrics = useARNativeTracking();
  const { planes, horizontalCount, verticalCount, totalSurfaceAreaM2 } = useARNativePlanes();
  const { anchors, createTestAnchor, removeAnchor, clearAnchors } = useARNativeAnchors();
  const diagnostics = useARNativeDiagnostics();

  // Auto-start session on mount
  useEffect(() => {
    start();
    return () => {
      stop();
    };
  }, [start, stop]);

  const isTracking = status === 'TRACKING';
  const isPaused = status === 'PAUSED';

  const handleToggleSession = () => {
    if (isTracking) {
      pause();
    } else if (isPaused) {
      resume();
    } else {
      start();
    }
  };

  const styles = StyleSheet.create({
    header: {
      marginBottom: spacing.md,
    },
    controlsGroup: {
      gap: spacing.sm,
      marginTop: spacing.md,
      marginBottom: spacing.xl,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    buttonFlex: {
      flex: 1,
    },
    noteBox: {
      backgroundColor: colors.surfaceVariant,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.xxl,
    },
    noteTitle: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.bold,
      color: colors.onSurface,
      marginBottom: 2,
    },
    noteText: {
      fontSize: typography.fontSize.xs,
      color: colors.onSurfaceVariant,
      lineHeight: typography.fontSize.xs * 1.5,
    },
  });

  return (
    <ScreenContainer scrollable padding={spacing.md} testID="ar-diagnostics-screen">
      <SectionHeader
        title="AR Diagnostics & Telemetry"
        subtitle="Native AR Session Foundation diagnostics & 6-DOF monitoring"
        style={styles.header}
      />

      {/* 1. Header with Session Status & FPS */}
      <ARDiagnosticsHeader
        status={status}
        quality={metrics.trackingQuality}
        fps={metrics.fps}
      />

      {/* 2. Real-Time 6-DOF Pose Telemetry */}
      <ARPoseCard metrics={metrics} />

      {/* 3. Plane Detection & Surface Extents */}
      <ARPlanesSummaryCard
        planes={planes}
        horizontalCount={horizontalCount}
        verticalCount={verticalCount}
        totalSurfaceAreaM2={totalSurfaceAreaM2}
      />

      {/* 4. Spatial Anchors Testing & Management */}
      <ARAnchorsTestCard
        anchors={anchors}
        onCreateAnchor={() => createTestAnchor()}
        onRemoveAnchor={removeAnchor}
        onClearAnchors={clearAnchors}
      />

      {/* 5. System & Hardware Diagnostics */}
      <ARSystemDiagnosticsCard diagnostics={diagnostics} />

      {/* 6. Session Lifecycle Controls */}
      <View style={styles.controlsGroup}>
        <PrimaryButton
          label={isTracking ? 'Pause Session' : isPaused ? 'Resume Session' : 'Start Session'}
          icon={isTracking ? 'pause' : 'play'}
          onPress={handleToggleSession}
          testID="btn-ar-native-toggle"
        />

        <View style={styles.buttonRow}>
          <View style={styles.buttonFlex}>
            <PrimaryButton
              label="Reset Origin (0,0,0)"
              icon="target"
              mode="outlined"
              onPress={reset}
              disabled={!isTracking}
              testID="btn-ar-native-reset"
            />
          </View>
          <View style={styles.buttonFlex}>
            <PrimaryButton
              label="Dispose Session"
              icon="stop-circle-outline"
              mode="outlined"
              onPress={dispose}
              disabled={status === 'UNINITIALIZED'}
              testID="btn-ar-native-dispose"
            />
          </View>
        </View>
      </View>

      <View style={styles.noteBox}>
        <Text style={styles.noteTitle}>Phase 5A Native AR Foundation</Text>
        <Text style={styles.noteText}>
          Native AR Session, World Tracking, Plane Detection (floors/walls), Spatial Anchors, and Diagnostics are running. Building scanning, point cloud mesh creation, and 3D mapping will be added in Phase 5B.
        </Text>
      </View>
    </ScreenContainer>
  );
};

export default ARDiagnosticsScreen;
