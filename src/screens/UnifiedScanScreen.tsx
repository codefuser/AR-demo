/**
 * @file src/screens/UnifiedScanScreen.tsx
 * @description Unified Building Scan Workflow Screen — Material Design 3.
 *
 * Provides a seamless administrator scanning interface:
 *  - Automatic engine startup (AR Session, Walkthrough, Planes, Point Cloud, Pose Tracking)
 *  - Large spatial coverage progress percentage indicator
 *  - Live status badge & AR guidance prompt banner
 *  - Real-time telemetry grid (Planes, Vertices, Speed, Health Score)
 *  - Minimal action buttons (Pause/Resume, Finish Scan, Cancel)
 *  - Scan Summary Preview Modal (Save Scan, Discard Scan, Resume Scan)
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../hooks/useAppTheme';
import { useBuildingStore } from '../store';
import { useBuildingScanWorkflow, useBuildingScanWorkflowControl } from '../hooks/useBuildingScanWorkflow';
import {
  ScreenContainer,
  SectionHeader,
  PrimaryButton,
  StatusBadge,
} from '../components';
import { SCAN_STATE_TITLES } from '../constants/buildingScanWorkflow';
import { MAIN_ROUTES } from '../constants/routes';
import { formatScanDuration } from '../utils/buildingScanWorkflowUtils';
import type { MainStackParamList, BuildingState, Building } from '../types';

type UnifiedScanScreenProps = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'UnifiedScan'>;
  route: RouteProp<MainStackParamList, 'UnifiedScan'>;
};

const UnifiedScanScreen: React.FC<UnifiedScanScreenProps> = ({ navigation, route }) => {
  const { theme } = useAppTheme();
  const { colors, spacing, typography, borderRadius } = theme.custom;

  const targetBuildingId = route.params?.buildingId;
  const building = useBuildingStore((s: BuildingState) =>
    targetBuildingId ? s.buildings.find((b: Building) => b.id === targetBuildingId) : null,
  );

  const { snapshot, validation } = useBuildingScanWorkflow();
  const {
    startWorkflow,
    pauseWorkflow,
    resumeWorkflow,
    finishWorkflow,
    saveScan,
    discardScan,
    cancelWorkflow,
  } = useBuildingScanWorkflowControl();

  const isScanning = snapshot.state === 'SCANNING';
  const isPaused = snapshot.state === 'PAUSED';
  const isPreview = snapshot.state === 'PREVIEW';
  const isCompleted = snapshot.state === 'COMPLETED';

  useEffect(() => {
    const bId = building?.id || targetBuildingId || 'demo_building_1';
    const bName = building?.name || route.params?.buildingName || 'Sample Building';
    const floor = route.params?.floor || 1;

    startWorkflow(bId, bName, floor);

    return () => {
      // Auto-cleanup on unmount if left scanning
    };
  }, [targetBuildingId]);

  const handlePauseResume = () => {
    if (isScanning) {
      pauseWorkflow();
    } else if (isPaused) {
      resumeWorkflow();
    }
  };

  const handleSaveAndReturn = () => {
    saveScan();
    navigation.navigate(MAIN_ROUTES.BUILDINGS);
  };

  const handleDiscardAndReturn = () => {
    discardScan();
    navigation.navigate(MAIN_ROUTES.BUILDINGS);
  };

  const styles = StyleSheet.create({
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    titleGroup: {
      flex: 1,
    },
    buildingName: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
      color: colors.onSurface,
    },
    floorSubtitle: {
      fontSize: typography.fontSize.xs,
      color: colors.primary,
      marginTop: 2,
    },
    progressCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.xl,
      padding: spacing.lg,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.md,
    },
    progressCircleBg: {
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor: `${colors.primary}12`,
      borderWidth: 8,
      borderColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: spacing.md,
    },
    progressNumber: {
      fontSize: typography.fontSize.xxl,
      fontWeight: typography.fontWeight.extraBold,
      color: colors.primary,
    },
    progressLabel: {
      fontSize: 10,
      color: colors.onSurfaceVariant,
      letterSpacing: 1,
      textTransform: 'uppercase',
      marginTop: 2,
    },
    stateBadge: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.bold,
      color: colors.onPrimary,
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.md,
      paddingVertical: 4,
      borderRadius: borderRadius.full,
    },
    guidanceBox: {
      backgroundColor: colors.surfaceVariant,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    guidanceText: {
      flex: 1,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      color: colors.onSurface,
    },
    telemetryGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.lg,
    },
    telemetryItem: {
      alignItems: 'center',
      flex: 1,
    },
    telemetryVal: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.bold,
      color: colors.onSurface,
    },
    telemetryLabel: {
      fontSize: 10,
      color: colors.onSurfaceVariant,
      marginTop: 2,
    },
    actionRow: {
      gap: spacing.sm,
      marginBottom: spacing.xl,
    },
    buttonFlexRow: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      justifyContent: 'center',
      padding: spacing.md,
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.xl,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    modalTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
      color: colors.onSurface,
      textAlign: 'center',
    },
    modalSubtitle: {
      fontSize: typography.fontSize.xs,
      color: colors.onSurfaceVariant,
      textAlign: 'center',
      marginTop: 4,
      marginBottom: spacing.md,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: spacing.xs,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    summaryLabel: {
      fontSize: typography.fontSize.sm,
      color: colors.onSurfaceVariant,
    },
    summaryValue: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.bold,
      color: colors.onSurface,
    },
    modalActions: {
      gap: spacing.sm,
      marginTop: spacing.lg,
    },
  });

  return (
    <ScreenContainer scrollable padding={spacing.md} testID="unified-scan-screen">
      {/* 1. Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <Text style={styles.buildingName}>{building?.name || snapshot.buildingName}</Text>
          <Text style={styles.floorSubtitle}>Floor {snapshot.floor} • Indoor Scanning</Text>
        </View>
        <StatusBadge status={isCompleted ? 'completed' : isScanning ? 'in_progress' : 'not_started'} />
      </View>

      {/* 2. Large Circular Spatial Coverage Indicator */}
      <View style={styles.progressCard}>
        <Text style={styles.stateBadge}>{SCAN_STATE_TITLES[snapshot.state]}</Text>

        <View style={styles.progressCircleBg}>
          <Text style={styles.progressNumber}>{snapshot.coverageEstimatePct}%</Text>
          <Text style={styles.progressLabel}>COVERAGE</Text>
        </View>

        <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold, color: colors.onSurface }}>
          Scan Duration: {formatScanDuration(snapshot.elapsedTimeSeconds)}
        </Text>
      </View>

      {/* 3. Live AR Guidance Prompt Banner */}
      <View style={styles.guidanceBox}>
        <MaterialCommunityIcons name="information" size={22} color={colors.primary} />
        <Text style={styles.guidanceText}>{snapshot.guidanceMessage}</Text>
      </View>

      {/* 4. Telemetry Grid */}
      <View style={styles.telemetryGrid}>
        <View style={styles.telemetryItem}>
          <Text style={styles.telemetryVal}>{snapshot.detectedPlaneCount}</Text>
          <Text style={styles.telemetryLabel}>Planes</Text>
        </View>
        <View style={styles.telemetryItem}>
          <Text style={styles.telemetryVal}>{snapshot.pointCloudCount}</Text>
          <Text style={styles.telemetryLabel}>Vertices</Text>
        </View>
        <View style={styles.telemetryItem}>
          <Text style={styles.telemetryVal}>{snapshot.speedMps} m/s</Text>
          <Text style={styles.telemetryLabel}>Speed</Text>
        </View>
        <View style={styles.telemetryItem}>
          <Text style={styles.telemetryVal}>{snapshot.scanHealthScore}%</Text>
          <Text style={styles.telemetryLabel}>Health Score</Text>
        </View>
      </View>

      {/* 5. Minimal Action Buttons */}
      <View style={styles.actionRow}>
        <PrimaryButton
          label="Finish Scan"
          icon="check-circle"
          onPress={finishWorkflow}
          testID="btn-finish-scan"
        />

        <View style={styles.buttonFlexRow}>
          <View style={{ flex: 1 }}>
            <PrimaryButton
              label={isScanning ? 'Pause' : 'Resume'}
              icon={isScanning ? 'pause' : 'play'}
              mode="outlined"
              onPress={handlePauseResume}
              testID="btn-pause-resume-scan"
            />
          </View>
          <View style={{ flex: 1 }}>
            <PrimaryButton
              label="Cancel"
              icon="close-circle-outline"
              mode="outlined"
              onPress={handleDiscardAndReturn}
              testID="btn-cancel-scan"
            />
          </View>
        </View>
      </View>

      {/* 6. Scan Preview Summary Modal */}
      <Modal visible={isPreview} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Scan Summary Preview</Text>
            <Text style={styles.modalSubtitle}>Review captured spatial data before saving</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Building Name</Text>
              <Text style={styles.summaryValue}>{snapshot.summary?.buildingName}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Duration</Text>
              <Text style={styles.summaryValue}>{formatScanDuration(snapshot.summary?.durationSeconds || 0)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Spatial Coverage</Text>
              <Text style={styles.summaryValue}>{snapshot.summary?.coverageEstimatePct}%</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Planes Detected</Text>
              <Text style={styles.summaryValue}>{snapshot.summary?.planeCount}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Point Cloud Vertices</Text>
              <Text style={styles.summaryValue}>{snapshot.summary?.pointCount}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Distance Walked</Text>
              <Text style={styles.summaryValue}>{snapshot.summary?.distanceWalkedMeters}m</Text>
            </View>

            <View style={styles.modalActions}>
              <PrimaryButton
                label="Save Scan"
                icon="content-save"
                onPress={handleSaveAndReturn}
                testID="btn-save-scan"
              />
              <PrimaryButton
                label="Resume Scanning"
                icon="play-outline"
                mode="outlined"
                onPress={resumeWorkflow}
                testID="btn-resume-scan"
              />
              <PrimaryButton
                label="Discard Scan"
                icon="trash-can-outline"
                mode="text"
                style={{ backgroundColor: `${colors.error}15` }}
                onPress={handleDiscardAndReturn}
                testID="btn-discard-scan"
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
};

export default UnifiedScanScreen;
