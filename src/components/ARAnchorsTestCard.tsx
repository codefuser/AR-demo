/**
 * @file src/components/ARAnchorsTestCard.tsx
 * @description Card component for testing spatial anchor creation, listing active anchors, and anchor lifetime tracking.
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ARAnchor } from '../types/arNative';
import { useAppTheme } from '../hooks/useAppTheme';
import PrimaryButton from './PrimaryButton';

interface ARAnchorsTestCardProps {
  anchors: ARAnchor[];
  onCreateAnchor: () => void;
  onRemoveAnchor: (id: string) => void;
  onClearAnchors: () => void;
}

const ARAnchorsTestCard: React.FC<ARAnchorsTestCardProps> = ({
  anchors,
  onCreateAnchor,
  onRemoveAnchor,
  onClearAnchors,
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
    countBadge: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.bold,
      color: colors.primary,
      backgroundColor: `${colors.primary}18`,
      paddingHorizontal: spacing.xs,
      paddingVertical: 2,
      borderRadius: borderRadius.full,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    flexButton: {
      flex: 1,
    },
    anchorList: {
      gap: spacing.xs,
      marginTop: spacing.xs,
    },
    anchorItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.surfaceVariant,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
    },
    anchorName: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.bold,
      color: colors.onSurface,
    },
    anchorPos: {
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
          <MaterialCommunityIcons name="map-marker-path" size={18} color={colors.primary} />
          <Text style={styles.title}>Spatial Anchors Management</Text>
        </View>
        <Text style={styles.countBadge}>{anchors.length} Active</Text>
      </View>

      <View style={styles.buttonRow}>
        <View style={styles.flexButton}>
          <PrimaryButton
            label="Create Test Anchor"
            icon="plus-circle-outline"
            onPress={onCreateAnchor}
            testID="btn-create-anchor"
          />
        </View>
        <View style={styles.flexButton}>
          <PrimaryButton
            label="Clear Anchors"
            icon="trash-can-outline"
            mode="outlined"
            onPress={onClearAnchors}
            disabled={anchors.length === 0}
            testID="btn-clear-anchors"
          />
        </View>
      </View>

      {anchors.length === 0 ? (
        <Text style={styles.emptyText}>Tap "Create Test Anchor" to pin spatial anchor coordinates...</Text>
      ) : (
        <View style={styles.anchorList}>
          {anchors.map((anchor) => (
            <View key={anchor.id} style={styles.anchorItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.anchorName}>{anchor.name}</Text>
                <Text style={styles.anchorPos}>
                  X: {anchor.position.x.toFixed(2)}m Y: {anchor.position.y.toFixed(2)}m Z: {anchor.position.z.toFixed(2)}m ({anchor.lifetimeSeconds}s active)
                </Text>
              </View>
              <Pressable onPress={() => onRemoveAnchor(anchor.id)} hitSlop={8}>
                <MaterialCommunityIcons name="close" size={16} color={colors.error} />
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default ARAnchorsTestCard;
