/**
 * @file src/screens/ScanSessionScreen.tsx
 * @description Scan Session Controller & Scan Point Capture Screen — Phase 5B.2.
 *
 * Full building scan session dashboard displaying:
 *  - Building Name, Floor #, and Session Status Badge
 *  - Pre-scan validation checklist (Building, Camera Permission, AR Ready, Device Compatibility)
 *  - Real-time Scan Progress %, Stage indicator, Elapsed & Est. Remaining timers
 *  - Live Scan Point Capture Telemetry Card (`ScanPointLiveCard`)
 *  - Recent Scan Points Feed Card (`ScanPointFeedCard`)
 *  - Real-time 6-DOF Pose & Tracking Card (`ARPoseCard`)
 *  - Session Operations Suite: Start Scan, Pause, Resume, Cancel, Finish, Reset
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppTheme } from '../hooks/useAppTheme';
import { useBuildingStore } from '../store';
import { useScanSession, useScanSessionControl } from '../hooks/useScanSession';
import { useScanPoints, useScanPointStats, useScanPointCapture } from '../hooks/useScanPoint';
import { useARTracking } from '../hooks/useARTracking';
import {
  ScreenContainer,
  SectionHeader,
  PrimaryButton,
  StatusBadge,
  ScanProgressCard,
  ScanValidationCard,
  ScanPointLiveCard,
  ScanPointFeedCard,
  ARPoseCard,
} from '../components';
import type { MainStackParamList, BuildingState, Building } from '../types';

type ScanSessionScreenProps = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'ScanSession'>;
  route: RouteProp<MainStackParamList, 'ScanSession'>;
};

const ScanSessionScreen: React.FC<ScanSessionScreenProps> = ({ navigation, route }) => {
  const { theme } = useAppTheme();
  const { colors, spacing, typography, borderRadius } = theme.custom;

  const targetBuildingId = route.params?.buildingId;
  const building = useBuildingStore((state: BuildingState) =>
    targetBuildingId ? state.buildings.find((b: Building) => b.id === targetBuildingId) : null,
  );

  const {
    createSession,
    startSession,
    pauseSession,
    resumeSession,
    cancelSession,
    completeSession,
    resetSession,
  } = useScanSessionControl();

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const { session, validation } = useScanSession(activeSessionId || undefined);
  const metrics = useARTracking();

  // Scan Point Engine hooks
  const points = useScanPoints(activeSessionId || undefined);
  const { pointCount, totalFeaturePoints, lastCaptureStatus } = useScanPointStats();
  const { startLoop, stopLoop, captureManualPoint, clearPoints } = useScanPointCapture();

  // Create session on mount if building is selected and no session active
  useEffect(() => {
    async function initSession() {
      const bId = building?.id || targetBuildingId || 'demo_building_1';
      const bName = building?.name || route.params?.buildingName || 'Sample Building';
      const floor = route.params?.floor || 1;

      if (!activeSessionId) {
        const newSession = await createSession(bId, bName, floor);
        setActiveSessionId(newSession.sessionId);
      }
    }
    initSession();
  }, [building, targetBuildingId, route.params, createSession, activeSessionId]);

  const status = session?.currentStatus || 'CREATED';
  const isScanning = status === 'SCANNING';
  const isPaused = status === 'PAUSED';
  const isCompleted = status === 'COMPLETED';
  const isCancelled = status === 'CANCELLED';

  // Toggle scan point capture loop on status changes
  useEffect(() => {
    if (isScanning) {
      startLoop();
    } else {
      stopLoop();
    }
    return () => {
      stopLoop();
    };
  }, [isScanning, startLoop, stopLoop]);

  const handleStartOrPause = () => {
    if (!session) return;
    if (isScanning) {
      pauseSession(session.sessionId);
    } else if (isPaused) {
      resumeSession(session.sessionId);
    } else {
      startSession(session.sessionId);
    }
  };

  const handleCancel = () => {
    if (session) {
      cancelSession(session.sessionId);
    }
  };

  const handleFinish = () => {
    if (session) {
      completeSession(session.sessionId);
    }
  };

  const handleReset = () => {
    if (session) {
      resetSession(session.sessionId);
      clearPoints();
    }
  };

  const styles = StyleSheet.create({
    header: {
      marginBottom: spacing.sm,
    },
    infoBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.surface,
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.md,
    },
    buildingNameText: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.bold,
      color: colors.onSurface,
    },
    floorText: {
      fontSize: typography.fontSize.xs,
      color: colors.onSurfaceVariant,
      marginTop: 2,
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
    <ScreenContainer scrollable padding={spacing.md} testID="scan-session-screen">
      <SectionHeader
        title="Building Scan Engine"
        subtitle="Live spatial scan point capture & session controller"
        style={styles.header}
      />

      {/* Building Info & Status */}
      <View style={styles.infoBar}>
        <View>
          <Text style={styles.buildingNameText}>{session?.buildingName || 'Building Session'}</Text>
          <Text style={styles.floorText}>Floor {session?.currentFloor || 1}</Text>
        </View>
        <StatusBadge status={isCompleted ? 'completed' : isScanning ? 'in_progress' : 'not_started'} />
      </View>

      {/* 1. Pre-Scan Validation Checklist */}
      <ScanValidationCard validation={validation} />

      {/* 2. Progress & Timers Card */}
      {session && <ScanProgressCard session={session} />}

      {/* 3. Live Scan Point Capture Telemetry */}
      <ScanPointLiveCard
        metrics={metrics}
        pointCount={pointCount}
        totalFeaturePoints={totalFeaturePoints}
        lastCaptureStatus={lastCaptureStatus}
      />

      {/* 4. Captured Scan Points Feed List */}
      <ScanPointFeedCard
        points={points}
        onManualCapture={() => captureManualPoint()}
        onClearPoints={clearPoints}
      />

      {/* 5. Real-time 6-DOF Pose Telemetry */}
      <ARPoseCard metrics={metrics} />

      {/* 6. Session Controls */}
      <View style={styles.controlsGroup}>
        <PrimaryButton
          label={
            isScanning
              ? 'Pause Scan'
              : isPaused
              ? 'Resume Scan'
              : isCompleted
              ? 'Scan Completed'
              : 'Start Building Scan'
          }
          icon={isScanning ? 'pause' : isCompleted ? 'check' : 'radar'}
          onPress={handleStartOrPause}
          disabled={!validation?.canStartScan && !isScanning && !isPaused}
          testID="btn-scan-toggle"
        />

        <View style={styles.buttonRow}>
          <View style={styles.buttonFlex}>
            <PrimaryButton
              label="Finish Scan"
              icon="check-circle-outline"
              mode="outlined"
              onPress={handleFinish}
              disabled={!isScanning && !isPaused}
              testID="btn-scan-finish"
            />
          </View>
          <View style={styles.buttonFlex}>
            <PrimaryButton
              label={isCompleted || isCancelled ? 'Reset Session' : 'Cancel Scan'}
              icon={isCompleted || isCancelled ? 'refresh' : 'close-circle-outline'}
              mode="outlined"
              onPress={isCompleted || isCancelled ? handleReset : handleCancel}
              disabled={status === 'CREATED' || status === 'READY'}
              testID="btn-scan-cancel"
            />
          </View>
        </View>
      </View>

      <View style={styles.noteBox}>
        <Text style={styles.noteTitle}>Phase 5B.2 Scan Point Capture Engine</Text>
        <Text style={styles.noteText}>
          Spatial scan points are captured continuously during walk (1m movement, 25° rotation, or 2.5s interval). Point cloud triangulation and mesh generation will occur in future phases.
        </Text>
      </View>
    </ScreenContainer>
  );
};

export default ScanSessionScreen;
