/**
 * @file src/components/ARPoseCard.tsx
 * @description Real-time 6-DOF pose telemetry component.
 *
 * Displays:
 *  - 3D Position Coordinates $(X, Y, Z)$
 *  - Orientation Euler Angles (Pitch, Roll, Yaw)
 *  - 4D Quaternions $(X, Y, Z, W)$
 *  - Motion State & FPS Telemetry
 */

import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ARTrackingMetrics } from '../types/ar';
import { useAppTheme } from '../hooks/useAppTheme';

interface ARPoseCardProps {
  /** Real-time metrics payload from useARTracking(). */
  metrics: ARTrackingMetrics;
}

const ARPoseCard: React.FC<ARPoseCardProps> = ({ metrics }) => {
  const { theme } = useAppTheme();
  const { colors, spacing, borderRadius, typography } = theme.custom;
  const { pose, motionState, fps, frameCount, uptimeSeconds } = metrics;
  const { position, rotation, quaternion } = pose;

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.md,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
      paddingBottom: spacing.xs,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.bold,
      color: colors.onSurface,
    },
    fpsBadge: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.semiBold,
      color: colors.primary,
      backgroundColor: `${colors.primary}18`,
      paddingHorizontal: spacing.xs,
      paddingVertical: 2,
      borderRadius: borderRadius.sm,
    },
    sectionLabel: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.semiBold,
      color: colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginTop: spacing.xs,
      marginBottom: 4,
    },
    gridRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.xs,
    },
    cell: {
      flex: 1,
      backgroundColor: colors.surfaceVariant,
      padding: spacing.xs,
      borderRadius: borderRadius.sm,
      marginHorizontal: 2,
      alignItems: 'center',
    },
    cellLabel: {
      fontSize: 10,
      color: colors.onSurfaceVariant,
      fontWeight: typography.fontWeight.medium,
    },
    cellValue: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.bold,
      color: colors.onSurface,
      marginTop: 2,
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    metaRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: spacing.xs,
      paddingTop: spacing.xs,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    metaText: {
      fontSize: typography.fontSize.xs,
      color: colors.onSurfaceVariant,
    },
  });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <MaterialCommunityIcons name="axis-arrow" size={18} color={colors.primary} />
          <Text style={styles.headerTitle}>Real-Time 6-DOF Camera Pose</Text>
        </View>
        <Text style={styles.fpsBadge}>{fps} FPS</Text>
      </View>

      {/* 3D Position (Meters) */}
      <Text style={styles.sectionLabel}>Position Coordinates (Meters)</Text>
      <View style={styles.gridRow}>
        <View style={styles.cell}>
          <Text style={styles.cellLabel}>X (Left / Right)</Text>
          <Text style={styles.cellValue}>{position.x.toFixed(2)}m</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.cellLabel}>Y (Up / Down)</Text>
          <Text style={styles.cellValue}>{position.y.toFixed(2)}m</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.cellLabel}>Z (Forward / Back)</Text>
          <Text style={styles.cellValue}>{position.z.toFixed(2)}m</Text>
        </View>
      </View>

      {/* Orientation Euler Angles (Degrees) */}
      <Text style={styles.sectionLabel}>Orientation Angles (Degrees)</Text>
      <View style={styles.gridRow}>
        <View style={styles.cell}>
          <Text style={styles.cellLabel}>Pitch (Tilt X)</Text>
          <Text style={styles.cellValue}>{rotation.pitch.toFixed(1)}°</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.cellLabel}>Roll (Tilt Y)</Text>
          <Text style={styles.cellValue}>{rotation.roll.toFixed(1)}°</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.cellLabel}>Yaw (Heading Z)</Text>
          <Text style={styles.cellValue}>{rotation.yaw.toFixed(1)}°</Text>
        </View>
      </View>

      {/* Quaternions */}
      <Text style={styles.sectionLabel}>Quaternions (X, Y, Z, W)</Text>
      <View style={styles.gridRow}>
        <View style={styles.cell}>
          <Text style={styles.cellLabel}>QX</Text>
          <Text style={styles.cellValue}>{quaternion.x.toFixed(2)}</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.cellLabel}>QY</Text>
          <Text style={styles.cellValue}>{quaternion.y.toFixed(2)}</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.cellLabel}>QZ</Text>
          <Text style={styles.cellValue}>{quaternion.z.toFixed(2)}</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.cellLabel}>QW</Text>
          <Text style={styles.cellValue}>{quaternion.w.toFixed(2)}</Text>
        </View>
      </View>

      {/* Motion State & Uptime */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <MaterialCommunityIcons name="run" size={14} color={colors.primary} />
          <Text style={styles.metaText}>Motion: {motionState}</Text>
        </View>
        <View style={styles.metaItem}>
          <MaterialCommunityIcons name="timer-outline" size={14} color={colors.textMuted} />
          <Text style={styles.metaText}>
            {uptimeSeconds}s ({frameCount} frames)
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ARPoseCard;
