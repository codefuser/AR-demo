/**
 * @file src/screens/ScanFinalizationSuccessScreen.tsx
 * @description Scan Finalization Success Screen.
 *
 * Displays:
 *  - Building Name & "Scan Completed" Badge
 *  - Key metrics: Coverage %, Validation Score %, Duration, Quality Rating, Plane Count, Feature Points, AR Tracking
 *  - Executive Summary & Technical Summary breakdown cards
 *  - "Done" and "View Building Details" action buttons
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../hooks/useAppTheme';
import { useBuildingScanFinalization } from '../hooks/useBuildingScanFinalization';
import { ScreenContainer, SectionHeader, PrimaryButton } from '../components';
import { formatDurationLabel } from '../utils/buildingScanFinalizationUtils';
import { MAIN_ROUTES } from '../constants/routes';
import type { MainStackParamList } from '../types';

type ScanFinalizationSuccessScreenProps = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'ScanFinalizationSuccess'>;
  route: RouteProp<MainStackParamList, 'ScanFinalizationSuccess'>;
};

const ScanFinalizationSuccessScreen: React.FC<ScanFinalizationSuccessScreenProps> = ({
  navigation,
  route,
}) => {
  const { theme } = useAppTheme();
  const { colors, spacing, typography, borderRadius } = theme.custom;

  const { record } = useBuildingScanFinalization();
  const buildingName = route.params?.buildingName || record?.buildingName || 'Building Scan';
  const buildingId = route.params?.buildingId || record?.buildingId;

  const styles = StyleSheet.create({
    hero: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: borderRadius.xl,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.md,
    },
    iconBg: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: `${colors.success}18`,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.xs,
    },
    statusBadge: {
      fontSize: 10,
      fontWeight: typography.fontWeight.bold,
      color: colors.onPrimary,
      backgroundColor: colors.success,
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: borderRadius.full,
      marginBottom: spacing.xs,
    },
    title: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.extraBold,
      color: colors.onSurface,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: typography.fontSize.xs,
      color: colors.onSurfaceVariant,
      marginTop: 2,
    },
    gridCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.md,
    },
    gridRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 4,
    },
    gridLabel: {
      fontSize: typography.fontSize.xs,
      color: colors.onSurfaceVariant,
    },
    gridVal: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.bold,
      color: colors.onSurface,
    },
    summaryCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.md,
    },
    summaryHeader: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.bold,
      color: colors.onSurface,
      marginBottom: spacing.xs,
    },
    summaryText: {
      fontSize: typography.fontSize.xs,
      color: colors.onSurfaceVariant,
      lineHeight: typography.fontSize.xs * 1.4,
    },
    controlsGroup: {
      gap: spacing.sm,
      marginBottom: spacing.xl,
    },
  });

  return (
    <ScreenContainer scrollable padding={spacing.md} testID="scan-finalization-success-screen">
      {/* 1. Hero Card */}
      <View style={styles.hero}>
        <View style={styles.iconBg}>
          <MaterialCommunityIcons name="check-decagram" size={36} color={colors.success} />
        </View>
        <Text style={styles.statusBadge}>SCAN COMPLETED</Text>
        <Text style={styles.title}>{buildingName}</Text>
        <Text style={styles.subtitle}>Scan session persisted & status updated to Completed</Text>
      </View>

      {/* 2. Key Metrics Grid */}
      <View style={styles.gridCard}>
        <View style={styles.gridRow}>
          <Text style={styles.gridLabel}>Spatial Coverage</Text>
          <Text style={styles.gridVal}>{record?.statistics.coveragePct || 0}%</Text>
        </View>
        <View style={styles.gridRow}>
          <Text style={styles.gridLabel}>Validation QA Score</Text>
          <Text style={styles.gridVal}>{record?.statistics.validationScore || 0}% ({record?.statistics.validationResult || 'PASS'})</Text>
        </View>
        <View style={styles.gridRow}>
          <Text style={styles.gridLabel}>Total Scan Duration</Text>
          <Text style={styles.gridVal}>{formatDurationLabel(record?.metadata.durationSeconds || 0)}</Text>
        </View>
        <View style={styles.gridRow}>
          <Text style={styles.gridLabel}>Mapped Surface Planes</Text>
          <Text style={styles.gridVal}>{record?.statistics.planeCount || 0} planes</Text>
        </View>
        <View style={styles.gridRow}>
          <Text style={styles.gridLabel}>Feature Point Density</Text>
          <Text style={styles.gridVal}>{record?.statistics.avgPointDensity || 0} pts/m²</Text>
        </View>
        <View style={styles.gridRow}>
          <Text style={styles.gridLabel}>AR Tracking Quality</Text>
          <Text style={styles.gridVal}>{record?.statistics.trackingQuality || 'EXCELLENT'}</Text>
        </View>
      </View>

      {/* 3. Executive Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryHeader}>Executive Summary</Text>
        <Text style={styles.summaryText}>{record?.executiveSummary || 'Scan completed successfully.'}</Text>
      </View>

      {/* 4. Technical Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryHeader}>Technical Telemetry Summary</Text>
        <Text style={styles.summaryText}>{record?.technicalSummary || 'VIO tracking quality maintained.'}</Text>
      </View>

      {/* 5. Actions */}
      <View style={styles.controlsGroup}>
        {buildingId ? (
          <PrimaryButton
            label="View Building Details"
            icon="office-building"
            onPress={() => navigation.navigate(MAIN_ROUTES.BUILDING_DETAILS, { buildingId })}
            testID="btn-view-building-details"
          />
        ) : null}
        <PrimaryButton
          label="Done"
          icon="check"
          mode="outlined"
          onPress={() => navigation.navigate(MAIN_ROUTES.HOME)}
          testID="btn-done-finalization"
        />
      </View>
    </ScreenContainer>
  );
};

export default ScanFinalizationSuccessScreen;
