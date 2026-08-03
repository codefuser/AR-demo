/**
 * @file src/components/ScanPointLiveCard.tsx
 * @description Live Scan Point capture telemetry card component.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ScanPointCaptureStatus } from '../types/scanPoint';
import type { ARTrackingMetrics } from '../types/ar';
import { useAppTheme } from '../hooks/useAppTheme';

interface ScanPointLiveCardProps {
  metrics: ARTrackingMetrics;
  pointCount: number;
  totalFeaturePoints: number;
  lastCaptureStatus: ScanPointCaptureStatus | null;
}

const ScanPointLiveCard: React.FC<ScanPointLiveCardProps> = ({
  metrics,
  pointCount,
  totalFeaturePoints,
  lastCaptureStatus,
}) => {
  const { theme } = useAppTheme();
  const { colors, spacing, borderRadius, typography } = theme.custom;

  const pos = metrics.pose.position;
  const rot = metrics.pose.rotation;

  const getStatusColor = (status: ScanPointCaptureStatus | null) => {
    switch (status) {
      case 'CAPTURED':
        return colors.success;
      case 'DUPLICATE_FILTERED':
        return colors.warning;
      case 'TRACKING_LOST_SKIPPED':
      case 'INVALID_POSE':
        return colors.error;
      default:
        return colors.textMuted;
    }
  };

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
    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginVertical: spacing.xs,
    },
    statusBadge: {
      paddingHorizontal: spacing.xs,
      paddingVertical: 2,
      borderRadius: borderRadius.sm,
      backgroundColor: `${getStatusColor(lastCaptureStatus)}20`,
      borderWidth: 1,
      borderColor: `${getStatusColor(lastCaptureStatus)}40`,
    },
    statusBadgeText: {
      fontSize: 10,
      fontWeight: typography.fontWeight.bold,
      color: getStatusColor(lastCaptureStatus),
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
      flex: 1,
    },
    gridLabel: {
      fontSize: 10,
      color: colors.onSurfaceVariant,
      marginBottom: 2,
    },
    gridVal: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.semiBold,
      color: colors.onSurface,
    },
  });

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <MaterialCommunityIcons name="map-marker-distance" size={18} color={colors.primary} />
          <Text style={styles.title}>Scan Point Engine Telemetry</Text>
        </View>
        <Text style={styles.countBadge}>{pointCount} Points Captured</Text>
      </View>

      <View style={styles.statusRow}>
        <Text style={styles.gridLabel}>Latest Capture Event:</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusBadgeText}>{lastCaptureStatus || 'STANDBY'}</Text>
        </View>
      </View>

      <View style={styles.gridRow}>
        <View style={styles.gridItem}>
          <Text style={styles.gridLabel}>Camera Position</Text>
          <Text style={styles.gridVal}>
            X:{pos.x.toFixed(2)} Y:{pos.y.toFixed(2)} Z:{pos.z.toFixed(2)}
          </Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridLabel}>Camera Rotation</Text>
          <Text style={styles.gridVal}>
            P:{rot.pitch.toFixed(0)}° R:{rot.roll.toFixed(0)}° Y:{rot.yaw.toFixed(0)}°
          </Text>
        </View>
      </View>

      <View style={styles.gridRow}>
        <View style={styles.gridItem}>
          <Text style={styles.gridLabel}>Visual SLAM Feature Points</Text>
          <Text style={styles.gridVal}>{totalFeaturePoints} Points</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridLabel}>Tracking Quality</Text>
          <Text style={styles.gridVal}>{metrics.trackingQuality}</Text>
        </View>
      </View>
    </View>
  );
};

export default ScanPointLiveCard;
