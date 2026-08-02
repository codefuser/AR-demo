/**
 * @file src/components/StatusBadge.tsx
 * @description Scan status badge component.
 *
 * Renders a colour-coded pill indicating a building's current scan status:
 *   • Not Started — slate/grey
 *   • Scanning    — amber/orange
 *   • Completed   — emerald/green
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ScanStatus } from '../types';
import { useAppTheme } from '../hooks/useAppTheme';

interface StatusBadgeProps {
  /** The scan status to display. */
  status: ScanStatus;
  /** Whether to render a compact version (icon only, no text). */
  compact?: boolean;
}

/** Visual configuration for each status value. */
const STATUS_CONFIG: Record<
  ScanStatus,
  { label: string; icon: 'clock-outline' | 'radar' | 'check-circle-outline'; colorKey: 'textMuted' | 'warning' | 'success' }
> = {
  not_started: {
    label: 'Not Started',
    icon: 'clock-outline',
    colorKey: 'textMuted',
  },
  in_progress: {
    label: 'Scanning',
    icon: 'radar',
    colorKey: 'warning',
  },
  completed: {
    label: 'Completed',
    icon: 'check-circle-outline',
    colorKey: 'success',
  },
};

/**
 * Pill badge displaying a building's scan status with icon and colour.
 *
 * @example
 * <StatusBadge status="not_started" />
 * <StatusBadge status="completed" compact />
 */
const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  compact = false,
}) => {
  const { theme } = useAppTheme();
  const { colors, spacing, borderRadius, typography } = theme.custom;
  const config = STATUS_CONFIG[status];
  const color = colors[config.colorKey];

  const styles = StyleSheet.create({
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      paddingHorizontal: compact ? spacing.xs : spacing.sm,
      paddingVertical: compact ? 2 : spacing.xs,
      borderRadius: borderRadius.full,
      backgroundColor: `${color}20`,
      borderWidth: 1,
      borderColor: `${color}40`,
      gap: 4,
    },
    label: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.semiBold,
      color,
    },
  });

  return (
    <View style={styles.badge} accessibilityLabel={`Scan status: ${config.label}`}>
      <MaterialCommunityIcons name={config.icon} size={compact ? 12 : 13} color={color} />
      {!compact && <Text style={styles.label}>{config.label}</Text>}
    </View>
  );
};

export default StatusBadge;
