/**
 * @file src/components/ARPlanesSummaryCard.tsx
 * @description Card component displaying detected horizontal/vertical planes and surface area extents.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ARPlane } from '../types/arNative';
import { formatPlaneDimensions } from '../utils/arNativeUtils';
import { useAppTheme } from '../hooks/useAppTheme';

interface ARPlanesSummaryCardProps {
  planes: ARPlane[];
  horizontalCount: number;
  verticalCount: number;
  totalSurfaceAreaM2: number;
}

const ARPlanesSummaryCard: React.FC<ARPlanesSummaryCardProps> = ({
  planes,
  horizontalCount,
  verticalCount,
  totalSurfaceAreaM2,
}) => {
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
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: spacing.xs,
      paddingVertical: spacing.xs,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.border,
    },
    statItem: {
      alignItems: 'center',
      flex: 1,
    },
    statValue: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.bold,
      color: colors.onSurface,
    },
    statLabel: {
      fontSize: 10,
      color: colors.onSurfaceVariant,
      marginTop: 2,
    },
    planeItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 4,
    },
    planeLabel: {
      fontSize: typography.fontSize.xs,
      color: colors.onSurface,
      fontWeight: typography.fontWeight.medium,
    },
    planeDetail: {
      fontSize: typography.fontSize.xs,
      color: colors.textMuted,
    },
    emptyText: {
      fontSize: typography.fontSize.xs,
      color: colors.textMuted,
      fontStyle: 'italic',
      textAlign: 'center',
      marginVertical: spacing.xs,
    },
  });

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <MaterialCommunityIcons name="select-all" size={18} color={colors.primary} />
          <Text style={styles.title}>Detected Planes & Surfaces</Text>
        </View>
        <Text style={styles.countBadge}>{planes.length} Detected</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{horizontalCount}</Text>
          <Text style={styles.statLabel}>Horizontal (Floors)</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{verticalCount}</Text>
          <Text style={styles.statLabel}>Vertical (Walls)</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalSurfaceAreaM2} m²</Text>
          <Text style={styles.statLabel}>Surface Area</Text>
        </View>
      </View>

      {planes.length === 0 ? (
        <Text style={styles.emptyText}>Scan environment to detect floors & walls...</Text>
      ) : (
        planes.map((plane) => (
          <View key={plane.id} style={styles.planeItem}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <MaterialCommunityIcons
                name={plane.planeType === 'VERTICAL' ? 'wall' : 'floor-plan'}
                size={14}
                color={colors.primary}
              />
              <Text style={styles.planeLabel}>
                {plane.planeType === 'VERTICAL' ? 'Wall' : 'Floor'} ({plane.id.substring(0, 10)})
              </Text>
            </View>
            <Text style={styles.planeDetail}>{formatPlaneDimensions(plane)}</Text>
          </View>
        ))
      )}
    </View>
  );
};

export default ARPlanesSummaryCard;
