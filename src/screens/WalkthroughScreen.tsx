/**
 * @file src/screens/WalkthroughScreen.tsx
 * @description Building Walkthrough Engine Screen — Phase 5C.4.
 *
 * Full building walkthrough controller screen displaying:
 *  - Header Card: Building name, floor, elapsed timer (`MM:SS`), and spatial coverage % bar
 *  - Live AR User Guidance Card (`WalkthroughGuidanceCard`) with live prompts ("Walk Slowly", "Keep Camera Stable")
 *  - Movement Telemetry Card (`WalkthroughTelemetryCard`): Speed (m/s), Heading direction, Planes, Vertices
 *  - 6-DOF Pose Card (`ARPoseCard`)
 *  - Lifecycle Operations Suite: Start Walkthrough, Pause, Resume, Cancel, Finish
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppTheme } from '../hooks/useAppTheme';
import { useBuildingStore } from '../store';
import { useWalkthrough, useWalkthroughControl } from '../hooks/useWalkthrough';
import { useARTracking } from '../hooks/useARTracking';
import {
  ScreenContainer,
  SectionHeader,
  PrimaryButton,
  WalkthroughHeaderCard,
  WalkthroughGuidanceCard,
  WalkthroughTelemetryCard,
  ARPoseCard,
} from '../components';
import type { MainStackParamList, BuildingState, Building } from '../types';

type WalkthroughScreenProps = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'Walkthrough'>;
  route: RouteProp<MainStackParamList, 'Walkthrough'>;
};

const WalkthroughScreen: React.FC<WalkthroughScreenProps> = ({ navigation, route }) => {
  const { theme } = useAppTheme();
  const { colors, spacing, typography, borderRadius } = theme.custom;

  const targetBuildingId = route.params?.buildingId;
  const building = useBuildingStore((state: BuildingState) =>
    targetBuildingId ? state.buildings.find((b: Building) => b.id === targetBuildingId) : null,
  );

  const { session, validation } = useWalkthrough();
  const metrics = useARTracking();
  const {
    startWalkthrough,
    pauseWalkthrough,
    resumeWalkthrough,
    cancelWalkthrough,
    completeWalkthrough,
    resetWalkthrough,
  } = useWalkthroughControl();

  const status = session?.status || 'IDLE';
  const isWalking = status === 'WALKING';
  const isPaused = status === 'PAUSED';
  const isCompleted = status === 'COMPLETED';
  const isCancelled = status === 'CANCELLED';

  const handleStartOrPause = () => {
    const bId = building?.id || targetBuildingId || 'demo_building_1';
    const bName = building?.name || route.params?.buildingName || 'Sample Building';
    const floor = route.params?.floor || 1;

    if (isWalking) {
      pauseWalkthrough();
    } else if (isPaused) {
      resumeWalkthrough();
    } else {
      startWalkthrough(bId, bName, floor);
    }
  };

  const styles = StyleSheet.create({
    header: {
      marginBottom: spacing.sm,
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
    <ScreenContainer scrollable padding={spacing.md} testID="walkthrough-screen">
      <SectionHeader
        title="Walkthrough Engine"
        subtitle="Indoor walking analysis & live AR user guidance controller"
        style={styles.header}
      />

      {/* 1. Header Card (Building Name, Floor, Timer, Coverage %) */}
      {session && <WalkthroughHeaderCard session={session} />}

      {/* 2. Live AR User Guidance Prompt Banner */}
      {session && (
        <WalkthroughGuidanceCard
          quality={session.walkingQuality}
          guidanceMessage={session.guidanceMessage}
        />
      )}

      {/* 3. Movement Telemetry Card */}
      {session && <WalkthroughTelemetryCard session={session} />}

      {/* 4. Real-time 6-DOF Pose Card */}
      <ARPoseCard metrics={metrics} />

      {/* 5. Controls */}
      <View style={styles.controlsGroup}>
        <PrimaryButton
          label={
            isWalking
              ? 'Pause Walkthrough'
              : isPaused
              ? 'Resume Walkthrough'
              : isCompleted
              ? 'Walkthrough Completed'
              : 'Start Walkthrough'
          }
          icon={isWalking ? 'pause' : isCompleted ? 'check' : 'walk'}
          onPress={handleStartOrPause}
          disabled={!validation?.canStartWalkthrough && !isWalking && !isPaused}
          testID="btn-walkthrough-toggle"
        />

        <View style={styles.buttonRow}>
          <View style={styles.buttonFlex}>
            <PrimaryButton
              label="Finish Session"
              icon="check-circle-outline"
              mode="outlined"
              onPress={completeWalkthrough}
              disabled={!isWalking && !isPaused}
              testID="btn-walkthrough-finish"
            />
          </View>
          <View style={styles.buttonFlex}>
            <PrimaryButton
              label={isCompleted || isCancelled ? 'Reset Session' : 'Cancel Session'}
              icon={isCompleted || isCancelled ? 'refresh' : 'close-circle-outline'}
              mode="outlined"
              onPress={isCompleted || isCancelled ? resetWalkthrough : cancelWalkthrough}
              disabled={status === 'IDLE'}
              testID="btn-walkthrough-cancel"
            />
          </View>
        </View>
      </View>

      <View style={styles.noteBox}>
        <Text style={styles.noteTitle}>Phase 5C.4 Building Walkthrough Engine</Text>
        <Text style={styles.noteText}>
          Monitors Administrator movement velocity (m/s), compass heading direction, environmental readiness, and issues live guidance instructions. No 3D mesh reconstruction or navigation pathfinding is performed in this phase.
        </Text>
      </View>
    </ScreenContainer>
  );
};

export default WalkthroughScreen;
