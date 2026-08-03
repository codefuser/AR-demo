/**
 * @file src/components/ScanValidationCard.tsx
 * @description Pre-scan readiness checklist validation card.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ScanSessionValidation } from '../types/scanSession';
import { useAppTheme } from '../hooks/useAppTheme';

interface ScanValidationCardProps {
  validation: ScanSessionValidation | null;
}

const ScanValidationCard: React.FC<ScanValidationCardProps> = ({ validation }) => {
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
      marginBottom: spacing.xs,
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
      paddingVertical: 4,
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
    msgText: {
      fontSize: typography.fontSize.xs,
      color: colors.textMuted,
      marginTop: spacing.xs,
      fontStyle: 'italic',
    },
  });

  const renderBadge = (pass: boolean) => (
    <View
      style={[
        styles.badge,
        { backgroundColor: pass ? `${colors.success}20` : `${colors.error}20` },
      ]}
    >
      <Text style={[styles.badgeText, { color: pass ? colors.success : colors.error }]}>
        {pass ? 'READY' : 'REQUIRED'}
      </Text>
    </View>
  );

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <MaterialCommunityIcons name="clipboard-check-outline" size={18} color={colors.primary} />
        <Text style={styles.title}>Pre-Scan Readiness Validation</Text>
      </View>

      {!validation ? (
        <Text style={styles.msgText}>Verifying building & sensor readiness...</Text>
      ) : (
        <>
          <View style={styles.row}>
            <View style={styles.labelGroup}>
              <MaterialCommunityIcons name="office-building" size={14} color={colors.textMuted} />
              <Text style={styles.label}>Building Selected</Text>
            </View>
            {renderBadge(validation.isBuildingValid)}
          </View>

          <View style={styles.row}>
            <View style={styles.labelGroup}>
              <MaterialCommunityIcons name="camera-outline" size={14} color={colors.textMuted} />
              <Text style={styles.label}>Camera Permission</Text>
            </View>
            {renderBadge(validation.isCameraPermissionGranted)}
          </View>

          <View style={styles.row}>
            <View style={styles.labelGroup}>
              <MaterialCommunityIcons name="motion-sensor" size={14} color={colors.textMuted} />
              <Text style={styles.label}>AR Spatial Engine Ready</Text>
            </View>
            {renderBadge(validation.isARReady)}
          </View>

          <View style={styles.row}>
            <View style={styles.labelGroup}>
              <MaterialCommunityIcons name="cellphone-check" size={14} color={colors.textMuted} />
              <Text style={styles.label}>Device Hardware Support</Text>
            </View>
            {renderBadge(validation.isDeviceCompatible)}
          </View>

          <Text style={styles.msgText}>{validation.message}</Text>
        </>
      )}
    </View>
  );
};

export default ScanValidationCard;
