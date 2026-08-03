/**
 * @file src/components/ScanPointFeedCard.tsx
 * @description Feed card component listing recent captured scan points.
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ScanPoint } from '../types/scanPoint';
import { useAppTheme } from '../hooks/useAppTheme';
import PrimaryButton from './PrimaryButton';

interface ScanPointFeedCardProps {
  points: ScanPoint[];
  onManualCapture: () => void;
  onClearPoints: () => void;
}

const ScanPointFeedCard: React.FC<ScanPointFeedCardProps> = ({
  points,
  onManualCapture,
  onClearPoints,
}) => {
  const { theme } = useAppTheme();
  const { colors, spacing, borderRadius, typography } = theme.custom;

  const recentPoints = points.slice(-5).reverse();

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
    buttonRow: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginBottom: spacing.xs,
    },
    flexButton: {
      flex: 1,
    },
    feedList: {
      gap: spacing.xs,
      marginTop: spacing.xs,
    },
    pointItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.surfaceVariant,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
    },
    pointTitle: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.bold,
      color: colors.onSurface,
    },
    pointDetails: {
      fontSize: 10,
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
          <MaterialCommunityIcons name="format-list-bulleted-square" size={18} color={colors.primary} />
          <Text style={styles.title}>Captured Scan Points Feed</Text>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <View style={styles.flexButton}>
          <PrimaryButton
            label="Manual Capture Point"
            icon="plus-circle"
            onPress={onManualCapture}
            testID="btn-manual-capture"
          />
        </View>
        <View style={styles.flexButton}>
          <PrimaryButton
            label="Clear Points"
            icon="trash-can-outline"
            mode="outlined"
            onPress={onClearPoints}
            disabled={points.length === 0}
            testID="btn-clear-scan-points"
          />
        </View>
      </View>

      {points.length === 0 ? (
        <Text style={styles.emptyText}>
          Walk 1 meter or tap "Manual Capture Point" to record spatial scan points...
        </Text>
      ) : (
        <View style={styles.feedList}>
          {recentPoints.map((pt) => (
            <View key={pt.pointId} style={styles.pointItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.pointTitle}>
                  Point #{pt.pointId.split('_')[2]} (Floor {pt.floor})
                </Text>
                <Text style={styles.pointDetails}>
                  X:{pt.cameraPosition.x.toFixed(2)}m Y:{pt.cameraPosition.y.toFixed(2)}m Z:{pt.cameraPosition.z.toFixed(2)}m ({pt.featurePointCount} Features)
                </Text>
              </View>
              <MaterialCommunityIcons name="check-circle" size={16} color={colors.success} />
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default ScanPointFeedCard;
