/**
 * @file src/components/ARDiagnosticsHeader.tsx
 * @description AR Diagnostics Screen Header overlay component.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ARNativeSessionStatus } from '../types/arNative';
import type { ARTrackingQuality } from '../types/ar';
import { useAppTheme } from '../hooks/useAppTheme';

interface ARDiagnosticsHeaderProps {
  status: ARNativeSessionStatus;
  quality: ARTrackingQuality;
  fps: number;
}

const ARDiagnosticsHeader: React.FC<ARDiagnosticsHeaderProps> = ({
  status,
  quality,
  fps,
}) => {
  const { theme } = useAppTheme();
  const { colors, spacing, borderRadius, typography } = theme.custom;

  const isTracking = status === 'TRACKING';

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: spacing.md,
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.md,
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
    badgeGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    statusBadge: {
      paddingHorizontal: spacing.xs,
      paddingVertical: 2,
      borderRadius: borderRadius.full,
      backgroundColor: isTracking ? `${colors.success}20` : `${colors.warning}20`,
      borderWidth: 1,
      borderColor: isTracking ? `${colors.success}40` : `${colors.warning}40`,
    },
    statusText: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.bold,
      color: isTracking ? colors.success : colors.warning,
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
  });

  return (
    <View style={styles.container}>
      <View style={styles.titleGroup}>
        <MaterialCommunityIcons name="cube-scan" size={20} color={colors.primary} />
        <Text style={styles.title}>Native AR Engine</Text>
      </View>

      <View style={styles.badgeGroup}>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
        <Text style={styles.fpsBadge}>{fps} FPS</Text>
      </View>
    </View>
  );
};

export default ARDiagnosticsHeader;
