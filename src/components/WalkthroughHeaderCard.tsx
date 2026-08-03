/**
 * @file src/components/WalkthroughHeaderCard.tsx
 * @description Card rendering Walkthrough session status, floor, timer, and spatial coverage % bar.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { WalkthroughSession } from '../types/walkthrough';
import { formatElapsedTime } from '../utils/scanSessionUtils';
import { useAppTheme } from '../hooks/useAppTheme';
import StatusBadge from './StatusBadge';

interface WalkthroughHeaderCardProps {
  session: WalkthroughSession;
}

const WalkthroughHeaderCard: React.FC<WalkthroughHeaderCardProps> = ({ session }) => {
  const { theme } = useAppTheme();
  const { colors, spacing, borderRadius, typography } = theme.custom;

  const isCompleted = session.status === 'COMPLETED';
  const isWalking = session.status === 'WALKING';

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.md,
    },
    topRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xs,
    },
    buildingTitle: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.bold,
      color: colors.onSurface,
    },
    floorSubtitle: {
      fontSize: typography.fontSize.xs,
      color: colors.onSurfaceVariant,
      marginTop: 2,
    },
    timerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: spacing.xs,
    },
    timerText: {
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.extraBold,
      color: colors.primary,
    },
    progressBarBg: {
      height: 8,
      backgroundColor: colors.surfaceVariant,
      borderRadius: borderRadius.full,
      overflow: 'hidden',
      marginTop: spacing.xs,
    },
    progressBarFill: {
      height: '100%',
      backgroundColor: isCompleted ? colors.success : colors.primary,
    },
    coverageText: {
      fontSize: 10,
      color: colors.onSurfaceVariant,
      marginTop: 4,
      textAlign: 'right',
    },
  });

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.buildingTitle}>{session.buildingName}</Text>
          <Text style={styles.floorSubtitle}>Floor {session.currentFloor}</Text>
        </View>
        <StatusBadge status={isCompleted ? 'completed' : isWalking ? 'in_progress' : 'not_started'} />
      </View>

      <View style={styles.timerRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
          <MaterialCommunityIcons name="clock-outline" size={18} color={colors.primary} />
          <Text style={styles.timerText}>{formatElapsedTime(session.elapsedTimeSeconds)}</Text>
        </View>
        <Text style={{ fontSize: typography.fontSize.xs, color: colors.onSurfaceVariant }}>
          Distance: {session.distanceWalkedMeters}m
        </Text>
      </View>

      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${session.coverageEstimatePct}%` }]} />
      </View>
      <Text style={styles.coverageText}>Spatial Coverage: {session.coverageEstimatePct}%</Text>
    </View>
  );
};

export default WalkthroughHeaderCard;
