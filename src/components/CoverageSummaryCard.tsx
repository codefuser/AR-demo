/**
 * @file src/components/CoverageSummaryCard.tsx
 * @description Card component rendering spatial coverage metrics summary (% coverage, visited area m², redundant scan %).
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { CoverageMetricsSnapshot } from '../types/coverage';
import { useAppTheme } from '../hooks/useAppTheme';

interface CoverageSummaryCardProps {
  snapshot: CoverageMetricsSnapshot;
}

const CoverageSummaryCard: React.FC<CoverageSummaryCardProps> = ({ snapshot }) => {
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
    badge: {
      fontSize: 10,
      fontWeight: typography.fontWeight.bold,
      color: colors.primary,
      backgroundColor: `${colors.primary}18`,
      paddingHorizontal: spacing.xs,
      paddingVertical: 2,
      borderRadius: borderRadius.full,
    },
    progressBg: {
      height: 8,
      backgroundColor: colors.surfaceVariant,
      borderRadius: borderRadius.full,
      overflow: 'hidden',
      marginVertical: spacing.xs,
    },
    progressFill: {
      height: '100%',
      backgroundColor: snapshot.coveragePct >= 70 ? colors.success : colors.primary,
    },
    gridRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing.xs,
      paddingTop: spacing.xs,
      borderTopWidth: 1,
      borderColor: colors.border,
    },
    gridItem: {
      alignItems: 'center',
      flex: 1,
    },
    gridVal: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.bold,
      color: colors.onSurface,
    },
    gridLabel: {
      fontSize: 10,
      color: colors.onSurfaceVariant,
      marginTop: 2,
    },
  });

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <MaterialCommunityIcons name="chart-donut" size={18} color={colors.primary} />
          <Text style={styles.title}>Spatial Coverage Analysis</Text>
        </View>
        <Text style={styles.badge}>{snapshot.coveragePct}% Covered</Text>
      </View>

      <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${snapshot.coveragePct}%` }]} />
      </View>

      <View style={styles.gridRow}>
        <View style={styles.gridItem}>
          <Text style={styles.gridVal}>{snapshot.visitedAreaM2} m²</Text>
          <Text style={styles.gridLabel}>Visited Area</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridVal}>{snapshot.estimatedTotalAreaM2} m²</Text>
          <Text style={styles.gridLabel}>Est. Total Area</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridVal}>{snapshot.redundantScanPct}%</Text>
          <Text style={styles.gridLabel}>Redundant Scan</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridVal}>{snapshot.coverageConfidencePct}%</Text>
          <Text style={styles.gridLabel}>Confidence</Text>
        </View>
      </View>
    </View>
  );
};

export default CoverageSummaryCard;
