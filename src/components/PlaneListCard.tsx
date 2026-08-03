/**
 * @file src/components/PlaneListCard.tsx
 * @description Card component rendering list of active detected physical planes.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ARNativePlaneModel } from '../types/plane';
import { useAppTheme } from '../hooks/useAppTheme';
import PrimaryButton from './PrimaryButton';

interface PlaneListCardProps {
  planes: ARNativePlaneModel[];
  onClearPlanes: () => void;
}

const PlaneListCard: React.FC<PlaneListCardProps> = ({ planes, onClearPlanes }) => {
  const { theme } = useAppTheme();
  const { colors, spacing, borderRadius, typography } = theme.custom;

  const validPlanes = planes.filter((p) => !p.subsumedByPlaneId).slice(-6).reverse();

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
      marginBottom: spacing.sm,
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
    feedList: {
      gap: spacing.xs,
      marginTop: spacing.xs,
    },
    planeItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.surfaceVariant,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
    },
    planeTitle: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.bold,
      color: colors.onSurface,
    },
    planeDetails: {
      fontSize: 10,
      color: colors.textMuted,
    },
    typeBadge: {
      fontSize: 10,
      fontWeight: typography.fontWeight.bold,
      color: colors.primary,
      backgroundColor: `${colors.primary}18`,
      paddingHorizontal: spacing.xs,
      paddingVertical: 2,
      borderRadius: borderRadius.full,
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
          <MaterialCommunityIcons name="floor-plan" size={18} color={colors.primary} />
          <Text style={styles.title}>Detected Physical Surfaces</Text>
        </View>
        <PrimaryButton
          label="Clear"
          icon="trash-can-outline"
          mode="outlined"
          onPress={onClearPlanes}
          disabled={planes.length === 0}
          testID="btn-clear-planes"
        />
      </View>

      {validPlanes.length === 0 ? (
        <Text style={styles.emptyText}>
          Point camera at physical floor or wall surfaces to detect AR planes...
        </Text>
      ) : (
        <View style={styles.feedList}>
          {validPlanes.map((pl) => (
            <View key={pl.planeId} style={styles.planeItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.planeTitle}>
                  {pl.planeId} ({pl.areaM2} m²)
                </Text>
                <Text style={styles.planeDetails}>
                  X:{pl.centerPose.x.toFixed(2)}m Y:{pl.centerPose.y.toFixed(2)}m Z:{pl.centerPose.z.toFixed(2)}m ({pl.polygon?.length || 0} Polygon Points)
                </Text>
              </View>
              <Text style={styles.typeBadge}>
                {pl.type === 'HORIZONTAL_FLOOR' ? 'FLOOR' : pl.type === 'VERTICAL_WALL' ? 'WALL' : 'SURFACE'}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default PlaneListCard;
