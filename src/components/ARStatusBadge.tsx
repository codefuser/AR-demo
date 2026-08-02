/**
 * @file src/components/ARStatusBadge.tsx
 * @description AR Tracking Quality & Status pill badge component.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ARTrackingQuality, ARSessionStatus } from '../types/ar';
import { useAppTheme } from '../hooks/useAppTheme';

interface ARStatusBadgeProps {
  /** AR Tracking quality level. */
  quality: ARTrackingQuality;
  /** Current session status. */
  status: ARSessionStatus;
}

const QUALITY_CONFIG: Record<
  ARTrackingQuality,
  { label: string; colorKey: 'success' | 'warning' | 'error' | 'info' | 'textMuted'; icon: 'target' | 'check-circle' | 'alert-circle' | 'close-circle' }
> = {
  EXCELLENT: { label: 'Excellent', colorKey: 'success', icon: 'check-circle' },
  GOOD: { label: 'Good', colorKey: 'success', icon: 'check-circle' },
  LIMITED: { label: 'Limited', colorKey: 'warning', icon: 'alert-circle' },
  POOR: { label: 'Poor', colorKey: 'error', icon: 'close-circle' },
  NOT_AVAILABLE: { label: 'N/A', colorKey: 'textMuted', icon: 'alert-circle' },
};

const ARStatusBadge: React.FC<ARStatusBadgeProps> = ({ quality, status }) => {
  const { theme } = useAppTheme();
  const { colors, spacing, borderRadius, typography } = theme.custom;

  const config = QUALITY_CONFIG[quality] || QUALITY_CONFIG.NOT_AVAILABLE;
  const color = colors[config.colorKey];

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: borderRadius.full,
      backgroundColor: `${color}20`,
      borderWidth: 1,
      borderColor: `${color}40`,
      gap: 4,
    },
    label: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.bold,
      color,
    },
    statusText: {
      fontSize: typography.fontSize.xs,
      color: colors.onSurfaceVariant,
      marginLeft: 2,
    },
  });

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name={config.icon} size={14} color={color} />
      <Text style={styles.label}>{config.label}</Text>
      <Text style={styles.statusText}>({status})</Text>
    </View>
  );
};

export default ARStatusBadge;
