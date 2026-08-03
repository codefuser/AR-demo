/**
 * @file src/components/ScanProgressCard.tsx
 * @description Progress card component displaying scan progress %, current stage, elapsed & estimated remaining time.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ScanSession } from '../types/scanSession';
import { SCAN_STAGE_LABELS } from '../constants/scanSession';
import { formatElapsedTime } from '../utils/scanSessionUtils';
import { useAppTheme } from '../hooks/useAppTheme';

interface ScanProgressCardProps {
  session: ScanSession;
}

const ScanProgressCard: React.FC<ScanProgressCardProps> = ({ session }) => {
  const { theme } = useAppTheme();
  const { colors, spacing, borderRadius, typography } = theme.custom;

  const stageLabel = SCAN_STAGE_LABELS[session.currentStage] || session.currentStage;
  const isScanning = session.currentStatus === 'SCANNING';
  const isCompleted = session.currentStatus === 'COMPLETED';

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.md,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xs,
    },
    titleGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    title: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.bold,
      color: colors.onSurface,
    },
    pctBadge: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.extraBold,
      color: isCompleted ? colors.success : colors.primary,
    },
    progressBarBg: {
      height: 10,
      borderRadius: borderRadius.full,
      backgroundColor: colors.surfaceVariant,
      overflow: 'hidden',
      marginVertical: spacing.xs,
    },
    progressBarFill: {
      height: '100%',
      backgroundColor: isCompleted ? colors.success : colors.primary,
      borderRadius: borderRadius.full,
    },
    stageText: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.semiBold,
      color: colors.onSurfaceVariant,
      marginTop: 2,
      marginBottom: spacing.xs,
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: spacing.xs,
      borderTopWidth: 1,
      borderColor: colors.border,
      marginTop: spacing.xs,
    },
    statItem: {
      alignItems: 'center',
      flex: 1,
    },
    statValue: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.bold,
      color: colors.onSurface,
    },
    statLabel: {
      fontSize: 10,
      color: colors.onSurfaceVariant,
      marginTop: 2,
    },
  });

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <MaterialCommunityIcons
            name={isScanning ? 'radar' : isCompleted ? 'check-circle' : 'cube-scan'}
            size={18}
            color={isCompleted ? colors.success : colors.primary}
          />
          <Text style={styles.title}>Scan Session Progress</Text>
        </View>
        <Text style={styles.pctBadge}>{session.progressPercentage}%</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${session.progressPercentage}%` }]} />
      </View>

      <Text style={styles.stageText}>{stageLabel}</Text>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatElapsedTime(session.elapsedTimeSeconds)}</Text>
          <Text style={styles.statLabel}>Elapsed Time</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {session.currentStatus === 'COMPLETED' ? '00:00' : formatElapsedTime(session.estimatedRemainingTimeSeconds)}
          </Text>
          <Text style={styles.statLabel}>Est. Remaining</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {session.currentScanPointCount} / {session.totalScanPoints}
          </Text>
          <Text style={styles.statLabel}>Scan Points</Text>
        </View>
      </View>
    </View>
  );
};

export default ScanProgressCard;
