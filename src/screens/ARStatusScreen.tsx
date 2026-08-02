/**
 * @file src/screens/ARStatusScreen.tsx
 * @description AR Status & 3D Spatial Tracking Dashboard Screen.
 *
 * Displays real-time telemetry from the AR Foundation Engine:
 *  - Tracking status & quality badge
 *  - 3D spatial position (X, Y, Z meters)
 *  - Phone orientation (Pitch, Roll, Yaw degrees & Quaternions)
 *  - Real-time frame rate (FPS) and uptime
 *  - Hardware & sensor capability diagnostics
 *  - Controls: Start, Pause/Resume, Reset World Origin $(0,0,0)$, Stop Session
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppTheme } from '../hooks/useAppTheme';
import { useARSession } from '../hooks/useARSession';
import { useARTracking } from '../hooks/useARTracking';
import {
  ScreenContainer,
  SectionHeader,
  PrimaryButton,
  ARStatusBadge,
  ARPoseCard,
  ARCapabilitiesCard,
} from '../components';
import type { MainStackParamList } from '../types';

type ARStatusScreenProps = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'ARStatus'>;
};

/**
 * AR Engine status and real-time tracking dashboard.
 */
const ARStatusScreen: React.FC<ARStatusScreenProps> = ({ navigation }) => {
  const { theme } = useAppTheme();
  const { colors, spacing, typography, borderRadius } = theme.custom;

  const {
    status,
    capabilities,
    isLoading,
    start,
    pause,
    resume,
    stop,
    resetOrigin,
  } = useARSession();

  const metrics = useARTracking();

  // Auto-start tracking on screen mount
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
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.md,
    },
    controlsGroup: {
      gap: spacing.sm,
      marginTop: spacing.md,
      marginBottom: spacing.xl,
    },
    buttonFlex: {
      flex: 1,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    noteBox: {
      backgroundColor: colors.surfaceVariant,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.xl,
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
    <ScreenContainer scrollable padding={spacing.md} testID="ar-status-screen">
      {/* Header */}
      <View style={styles.headerRow}>
        <SectionHeader
          title="AR Tracking Engine"
          subtitle="Real-time 6-DOF spatial pose & device telemetry"
          style={{ marginBottom: 0, flex: 1, marginRight: spacing.xs }}
        />
        <ARStatusBadge quality={metrics.trackingQuality} status={status} />
      </View>

      {/* 1. Real-Time 6-DOF Pose Telemetry */}
      <ARPoseCard metrics={metrics} />

      {/* 2. Device & Hardware Capability Check */}
      <ARCapabilitiesCard capabilities={capabilities} isLoading={isLoading} />

      {/* 3. Session Controls */}
      <View style={styles.controlsGroup}>
        <PrimaryButton
          label={isTracking ? 'Pause AR Tracking' : isPaused ? 'Resume AR Tracking' : 'Start AR Tracking'}
          icon={isTracking ? 'pause' : 'play'}
          onPress={handleToggleSession}
          testID="btn-ar-toggle-session"
        />

        <View style={styles.buttonRow}>
          <View style={styles.buttonFlex}>
            <PrimaryButton
              label="Reset Origin (0,0,0)"
              icon="target"
              mode="outlined"
              onPress={resetOrigin}
              disabled={!isTracking}
              testID="btn-ar-reset-origin"
            />
          </View>
          <View style={styles.buttonFlex}>
            <PrimaryButton
              label="Stop Session"
              icon="stop"
              mode="outlined"
              onPress={stop}
              disabled={status === 'STOPPED' || status === 'UNINITIALIZED'}
              testID="btn-ar-stop-session"
            />
          </View>
        </View>
      </View>

      {/* Information Note */}
      <View style={styles.noteBox}>
        <Text style={styles.noteTitle}>Phase 4 Architecture</Text>
        <Text style={styles.noteText}>
          The AR Tracking Engine computes device motion, 3D spatial velocity integration, orientation angles, and tracking quality at 60Hz. Scanning and 3D mesh mapping will be integrated in Phase 5.
        </Text>
      </View>
    </ScreenContainer>
  );
};

export default ARStatusScreen;
