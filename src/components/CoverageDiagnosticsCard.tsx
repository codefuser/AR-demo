/**
 * @file src/components/CoverageDiagnosticsCard.tsx
 * @description Card component rendering 5-factor quality scoring matrix breakdown.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { CoverageScores } from '../types/coverage';
import { useAppTheme } from '../hooks/useAppTheme';

interface CoverageDiagnosticsCardProps {
  scores: CoverageScores;
}

const CoverageDiagnosticsCard: React.FC<CoverageDiagnosticsCardProps> = ({ scores }) => {
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
    overallBadge: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.bold,
      color: colors.onPrimary,
      backgroundColor: scores.overallQualityScore >= 70 ? colors.success : colors.primary,
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: borderRadius.full,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 4,
    },
    rowLabel: {
      fontSize: typography.fontSize.xs,
      color: colors.onSurfaceVariant,
    },
    rowVal: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.bold,
      color: colors.onSurface,
    },
    barBg: {
      height: 6,
      backgroundColor: colors.surfaceVariant,
      borderRadius: borderRadius.full,
      overflow: 'hidden',
      flex: 1,
      marginHorizontal: spacing.sm,
    },
    barFill: {
      height: '100%',
      backgroundColor: colors.primary,
    },
  });

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <MaterialCommunityIcons name="star-outline" size={18} color={colors.primary} />
          <Text style={styles.title}>5-Factor Quality Scoring Matrix</Text>
        </View>
        <Text style={styles.overallBadge}>{scores.overallQualityScore}% Quality</Text>
      </View>

      <View style={{ marginTop: spacing.xs }}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Coverage Score (30%)</Text>
          <View style={styles.barBg}>
            <View style={[styles.barFill, { width: `${scores.coverageScore}%` }]} />
          </View>
          <Text style={styles.rowVal}>{scores.coverageScore}%</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Point Density (25%)</Text>
          <View style={styles.barBg}>
            <View style={[styles.barFill, { width: `${scores.pointDensityScore}%` }]} />
          </View>
          <Text style={styles.rowVal}>{scores.pointDensityScore}%</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>AR Tracking (25%)</Text>
          <View style={styles.barBg}>
            <View style={[styles.barFill, { width: `${scores.trackingScore}%` }]} />
          </View>
          <Text style={styles.rowVal}>{scores.trackingScore}%</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Plane Quality (10%)</Text>
          <View style={styles.barBg}>
            <View style={[styles.barFill, { width: `${scores.planeQualityScore}%` }]} />
          </View>
          <Text style={styles.rowVal}>{scores.planeQualityScore}%</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Walkthrough (10%)</Text>
          <View style={styles.barBg}>
            <View style={[styles.barFill, { width: `${scores.walkthroughScore}%` }]} />
          </View>
          <Text style={styles.rowVal}>{scores.walkthroughScore}%</Text>
        </View>
      </View>
    </View>
  );
};

export default CoverageDiagnosticsCard;
