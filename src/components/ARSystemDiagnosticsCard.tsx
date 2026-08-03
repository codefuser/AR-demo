/**
 * @file src/components/ARSystemDiagnosticsCard.tsx
 * @description System & Hardware Diagnostics Card component.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ARSystemDiagnostics } from '../types/arNative';
import { useAppTheme } from '../hooks/useAppTheme';

interface ARSystemDiagnosticsCardProps {
  diagnostics: ARSystemDiagnostics | null;
}

const ARSystemDiagnosticsCard: React.FC<ARSystemDiagnosticsCardProps> = ({
  diagnostics,
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
      paddingVertical: 5,
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
    value: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.bold,
      color: colors.onSurface,
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

  const renderBadge = (pass: boolean, trueText = 'PASS', falseText = 'FAIL') => (
    <View
      style={[
        styles.badge,
        { backgroundColor: pass ? `${colors.success}20` : `${colors.error}20` },
      ]}
    >
      <Text style={[styles.badgeText, { color: pass ? colors.success : colors.error }]}>
        {pass ? trueText : falseText}
      </Text>
    </View>
  );

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <MaterialCommunityIcons name="shield-check-outline" size={18} color={colors.primary} />
        <Text style={styles.title}>System Diagnostics & AR Services</Text>
      </View>

      {!diagnostics ? (
        <Text style={styles.msgText}>Running system diagnostics...</Text>
      ) : (
        <>
          <View style={styles.row}>
            <View style={styles.labelGroup}>
              <MaterialCommunityIcons name="cube-scan" size={14} color={colors.textMuted} />
              <Text style={styles.label}>AR Spatial Support</Text>
            </View>
            {renderBadge(diagnostics.isARSupported, 'SUPPORTED', 'UNSUPPORTED')}
          </View>

          <View style={styles.row}>
            <View style={styles.labelGroup}>
              <MaterialCommunityIcons name="google-play" size={14} color={colors.textMuted} />
              <Text style={styles.label}>AR Services Version</Text>
            </View>
            <Text style={styles.value}>{diagnostics.arServicesVersion}</Text>
          </View>

          <View style={styles.row}>
            <View style={styles.labelGroup}>
              <MaterialCommunityIcons name="camera-outline" size={14} color={colors.textMuted} />
              <Text style={styles.label}>Camera Status</Text>
            </View>
            {renderBadge(diagnostics.cameraPermissionGranted, 'ACTIVE', 'DENIED')}
          </View>

          <View style={styles.row}>
            <View style={styles.labelGroup}>
              <MaterialCommunityIcons name="motion-sensor" size={14} color={colors.textMuted} />
              <Text style={styles.label}>IMU Sensors (60Hz)</Text>
            </View>
            {renderBadge(diagnostics.sensorsAvailable, 'ACTIVE', 'MISSING')}
          </View>

          <Text style={styles.msgText}>{diagnostics.diagnosticMessage}</Text>
        </>
      )}
    </View>
  );
};

export default ARSystemDiagnosticsCard;
