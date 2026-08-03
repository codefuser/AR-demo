/**
 * @file src/components/PlaneSummaryCard.tsx
 * @description Card component displaying real-time AR plane detection telemetry summary.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { PlaneStats } from '../types/plane';
import type { ARTrackingQuality } from '../types/ar';
import { useAppTheme } from '../hooks/useAppTheme';

interface PlaneSummaryCardProps {
  stats: PlaneStats;
  trackingQuality: ARTrackingQuality;
  fps: number;
}

const PlaneSummaryCard: React.FC<PlaneSummaryCardProps> = ({ stats, trackingQuality, fps }) => {
  const { theme } = useAppTheme();
  const { colors, spacing, borderRadius, typography } = theme.custom;

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
    countBadge: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.bold,
      color: colors.primary,
      backgroundColor: `${colors.primary}18`,
      paddingHorizontal: spacing.xs,
      paddingVertical: 2,
      borderRadius: borderRadius.full,
    },
    gridRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing.xs,
      paddingTop: spacing.xs,
      borderTopWidth: 1,
      borderColor: colors.border,
    },
    gridItem: {
      alignItems: 'center',
      flex: 1,
    },
    gridVal: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.bold,
      color: colors.onSurface,
    },
    gridLabel: {
      fontSize: 10,
      color: colors.onSurfaceVariant,
      marginTop: 2,
    },
  });

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <MaterialCommunityIcons name="select-all" size={18} color={colors.primary} />
          <Text style={styles.title}>ARCore Plane Detection Telemetry</Text>
        </View>
        <Text style={styles.countBadge}>{stats.totalPlanes} Planes Detected</Text>
      </View>

      <View style={styles.gridRow}>
        <View style={styles.gridItem}>
          <Text style={styles.gridVal}>{stats.horizontalCount}</Text>
          <Text style={styles.gridLabel}>Floors (Horizontal)</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridVal}>{stats.verticalCount}</Text>
          <Text style={styles.gridLabel}>Walls (Vertical)</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridVal}>{stats.largestPlaneAreaM2} m²</Text>
          <Text style={styles.gridLabel}>Largest Plane</Text>
        </View>
      </View>

      <View style={styles.gridRow}>
        <View style={styles.gridItem}>
          <Text style={styles.gridVal}>{stats.avgPlaneAreaM2} m²</Text>
          <Text style={styles.gridLabel}>Avg Plane Area</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridVal}>{trackingQuality}</Text>
          <Text style={styles.gridLabel}>Tracking State</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridVal}>{fps > 0 ? fps : 60} FPS</Text>
          <Text style={styles.gridLabel}>Frame Rate</Text>
        </View>
      </View>
    </View>
  );
};

export default PlaneSummaryCard;
