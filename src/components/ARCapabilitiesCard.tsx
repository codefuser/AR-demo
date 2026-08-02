/**
 * @file src/components/ARCapabilitiesCard.tsx
 * @description Card component displaying AR hardware capabilities, motion sensor status, and permissions.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ARDeviceCapabilities } from '../types/ar';
import { useAppTheme } from '../hooks/useAppTheme';

interface ARCapabilitiesCardProps {
  /** Capability check result payload. */
  capabilities: ARDeviceCapabilities | null;
  /** Whether check is loading. */
  isLoading?: boolean;
}

const ARCapabilitiesCard: React.FC<ARCapabilitiesCardProps> = ({
  capabilities,
  isLoading = false,
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
      alignItems: 'center',
      gap: spacing.xs,
      marginBottom: spacing.sm,
    },
    title: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.bold,
      color: colors.onSurface,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 6,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    labelGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    label: {
      fontSize: typography.fontSize.xs,
      color: colors.onSurfaceVariant,
    },
    badge: {
      paddingHorizontal: spacing.xs,
      paddingVertical: 2,
      borderRadius: borderRadius.full,
    },
    badgeText: {
      fontSize: 10,
      fontWeight: typography.fontWeight.bold,
    },
    messageText: {
      marginTop: spacing.xs,
      fontSize: typography.fontSize.xs,
      color: colors.textMuted,
      fontStyle: 'italic',
    },
  });

  const renderStatus = (pass: boolean, textTrue = 'AVAILABLE', textFalse = 'UNAVAILABLE') => (
    <View
      style={[
        styles.badge,
        { backgroundColor: pass ? `${colors.success}20` : `${colors.error}20` },
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          { color: pass ? colors.success : colors.error },
        ]}
      >
        {pass ? textTrue : textFalse}
      </Text>
    </View>
  );

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <MaterialCommunityIcons name="chip" size={18} color={colors.primary} />
        <Text style={styles.title}>Hardware & AR Capability Check</Text>
      </View>

      {isLoading || !capabilities ? (
        <Text style={styles.messageText}>Checking AR capabilities...</Text>
      ) : (
        <>
          <View style={styles.row}>
            <View style={styles.labelGroup}>
              <MaterialCommunityIcons name="cube-scan" size={14} color={colors.textMuted} />
              <Text style={styles.label}>AR Tracking Support</Text>
            </View>
            {renderStatus(capabilities.isARSupported, 'SUPPORTED', 'UNSUPPORTED')}
          </View>

          <View style={styles.row}>
            <View style={styles.labelGroup}>
              <MaterialCommunityIcons name="motion-sensor" size={14} color={colors.textMuted} />
              <Text style={styles.label}>Motion Sensors (IMU)</Text>
            </View>
            {renderStatus(capabilities.sensorsAvailable)}
          </View>

          <View style={styles.row}>
            <View style={styles.labelGroup}>
              <MaterialCommunityIcons name="shield-check-outline" size={14} color={colors.textMuted} />
              <Text style={styles.label}>Camera Permission</Text>
            </View>
            {renderStatus(capabilities.permissionGranted, 'GRANTED', 'DENIED')}
          </View>

          <Text style={styles.messageText}>{capabilities.message}</Text>
        </>
      )}
    </View>
  );
};

export default ARCapabilitiesCard;
