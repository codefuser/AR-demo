/**
 * @file src/components/PointCloudLiveCard.tsx
 * @description Card component displaying real-time raw Point Cloud telemetry & estimated memory usage MB.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { PointCloudStats } from '../types/pointCloud';
import type { ARTrackingQuality } from '../types/ar';
import { useAppTheme } from '../hooks/useAppTheme';

interface PointCloudLiveCardProps {
  stats: PointCloudStats;
  trackingQuality: ARTrackingQuality;
}

const PointCloudLiveCard: React.FC<PointCloudLiveCardProps> = ({ stats, trackingQuality }) => {
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
    memBadge: {
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
          <MaterialCommunityIcons name="vector-point" size={18} color={colors.primary} />
          <Text style={styles.title}>Raw Point Cloud Engine</Text>
        </View>
        <Text style={styles.memBadge}>{stats.estimatedMemoryMB} MB RAM</Text>
      </View>

      <View style={styles.gridRow}>
        <View style={styles.gridItem}>
          <Text style={styles.gridVal}>{stats.currentFrameNumber}</Text>
          <Text style={styles.gridLabel}>Frame Number</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridVal}>{stats.currentPointCount}</Text>
          <Text style={styles.gridLabel}>Current Frame Points</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridVal}>{stats.totalFrames}</Text>
          <Text style={styles.gridLabel}>Total Frames</Text>
        </View>
      </View>

      <View style={styles.gridRow}>
        <View style={styles.gridItem}>
          <Text style={styles.gridVal}>{stats.totalPoints}</Text>
          <Text style={styles.gridLabel}>Total 3D Vertices</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridVal}>{stats.avgPointsPerFrame}</Text>
          <Text style={styles.gridLabel}>Avg Points/Frame</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridVal}>{trackingQuality}</Text>
          <Text style={styles.gridLabel}>Tracking State</Text>
        </View>
      </View>
    </View>
  );
};

export default PointCloudLiveCard;
