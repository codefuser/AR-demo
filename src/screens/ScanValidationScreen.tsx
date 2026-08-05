/**
 * @file src/screens/ScanValidationScreen.tsx
 * @description Scan Validation Screen — Intelligent Quality Assurance Dashboard.
 *
 * Displays:
 *  - Outcome Badge (`PASS`, `PASS_WITH_WARNINGS`, `INCOMPLETE`, `FAILED`)
 *  - Overall Validation Score % Indicator
 *  - 6-Factor Score Breakdown Grid
 *  - Warnings List
 *  - Actionable Administrator Rescan Recommendations List
 *  - Re-evaluate & Threshold Adjustment Controls
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../hooks/useAppTheme';
import { useScanValidation, useScanValidationControl } from '../hooks/useScanValidation';
import {
  ScreenContainer,
  SectionHeader,
  PrimaryButton,
} from '../components';
import { OUTCOME_TITLES } from '../constants/scanValidation';
import type { ScanValidationOutcome } from '../types/scanValidation';

const ScanValidationScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const { colors, spacing, typography, borderRadius } = theme.custom;

  const { thresholds, report } = useScanValidation();
  const { evaluateScan } = useScanValidationControl();

  useEffect(() => {
    if (!report) {
      evaluateScan();
    }
  }, []);

  const getOutcomeColor = (outcome: ScanValidationOutcome) => {
    switch (outcome) {
      case 'PASS':
        return colors.success;
      case 'PASS_WITH_WARNINGS':
        return colors.warning;
      case 'INCOMPLETE':
        return colors.primary;
      case 'FAILED':
        return colors.error;
      default:
        return colors.primary;
    }
  };

  const currentOutcome = report?.outcome || 'INCOMPLETE';
  const color = getOutcomeColor(currentOutcome);

  const styles = StyleSheet.create({
    header: {
      marginBottom: spacing.sm,
    },
    heroCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.xl,
      padding: spacing.lg,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.md,
    },
    outcomeBadge: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.bold,
      color: colors.onPrimary,
      backgroundColor: color,
      paddingHorizontal: spacing.md,
      paddingVertical: 4,
      borderRadius: borderRadius.full,
      marginBottom: spacing.sm,
    },
    scoreCircle: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: `${color}15`,
      borderWidth: 6,
      borderColor: color,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: spacing.sm,
    },
    scoreVal: {
      fontSize: typography.fontSize.xxl,
      fontWeight: typography.fontWeight.extraBold,
      color,
    },
    scoreLabel: {
      fontSize: 10,
      color: colors.onSurfaceVariant,
      letterSpacing: 1,
    },
    gridCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.md,
    },
    gridTitle: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.bold,
      color: colors.onSurface,
      marginBottom: spacing.xs,
    },
    gridRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 4,
    },
    gridLabel: {
      fontSize: typography.fontSize.xs,
      color: colors.onSurfaceVariant,
    },
    gridVal: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.bold,
      color: colors.onSurface,
    },
    sectionBox: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.md,
    },
    sectionHeader: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.bold,
      color: colors.onSurface,
      marginBottom: spacing.xs,
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.xs,
      marginVertical: 3,
    },
    listText: {
      flex: 1,
      fontSize: typography.fontSize.xs,
      color: colors.onSurfaceVariant,
      lineHeight: typography.fontSize.xs * 1.4,
    },
    controlsGroup: {
      gap: spacing.sm,
      marginBottom: spacing.xl,
    },
  });

  return (
    <ScreenContainer scrollable padding={spacing.md} testID="scan-validation-screen">
      <SectionHeader
        title="Scan Validation QA"
        subtitle="Rule evaluation pipeline & quality decision gatekeeper"
        style={styles.header}
      />

      {/* 1. Hero Outcome & Score Indicator */}
      <View style={styles.heroCard}>
        <Text style={styles.outcomeBadge}>{OUTCOME_TITLES[currentOutcome]}</Text>

        <View style={styles.scoreCircle}>
          <Text style={styles.scoreVal}>{report?.overallScore || 0}%</Text>
          <Text style={styles.scoreLabel}>OVERALL SCORE</Text>
        </View>

        <Text style={{ fontSize: typography.fontSize.xs, color: colors.onSurfaceVariant }}>
          Evaluated for: {report?.buildingName || 'Sample Building'}
        </Text>
      </View>

      {/* 2. 6-Factor Score Grid */}
      <View style={styles.gridCard}>
        <Text style={styles.gridTitle}>6-Factor Score Breakdown</Text>
        <View style={styles.gridRow}>
          <Text style={styles.gridLabel}>Coverage Score</Text>
          <Text style={styles.gridVal}>{report?.scores.coverageScore || 0}%</Text>
        </View>
        <View style={styles.gridRow}>
          <Text style={styles.gridLabel}>Tracking Score</Text>
          <Text style={styles.gridVal}>{report?.scores.trackingScore || 0}%</Text>
        </View>
        <View style={styles.gridRow}>
          <Text style={styles.gridLabel}>Point Cloud Score</Text>
          <Text style={styles.gridVal}>{report?.scores.pointCloudScore || 0}%</Text>
        </View>
        <View style={styles.gridRow}>
          <Text style={styles.gridLabel}>Plane Geometry Score</Text>
          <Text style={styles.gridVal}>{report?.scores.planeScore || 0}%</Text>
        </View>
        <View style={styles.gridRow}>
          <Text style={styles.gridLabel}>Movement Trajectory</Text>
          <Text style={styles.gridVal}>{report?.scores.movementScore || 0}%</Text>
        </View>
        <View style={styles.gridRow}>
          <Text style={styles.gridLabel}>Camera Stability</Text>
          <Text style={styles.gridVal}>{report?.scores.stabilityScore || 0}%</Text>
        </View>
      </View>

      {/* 3. Validation Warnings */}
      {report?.warnings && report.warnings.length > 0 ? (
        <View style={styles.sectionBox}>
          <Text style={[styles.sectionHeader, { color: colors.warning }]}>Validation Warnings</Text>
          {report.warnings.map((w, idx) => (
            <View key={idx} style={styles.listItem}>
              <MaterialCommunityIcons name="alert-outline" size={16} color={colors.warning} />
              <Text style={styles.listText}>{w}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {/* 4. Actionable Rescan Recommendations */}
      {report?.recommendations && report.recommendations.length > 0 ? (
        <View style={styles.sectionBox}>
          <Text style={[styles.sectionHeader, { color: colors.primary }]}>Rescan Recommendations</Text>
          {report.recommendations.map((rec, idx) => (
            <View key={idx} style={styles.listItem}>
              <MaterialCommunityIcons name="lightbulb-on-outline" size={16} color={colors.primary} />
              <Text style={styles.listText}>{rec}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {/* 5. Controls */}
      <View style={styles.controlsGroup}>
        <PrimaryButton
          label="Re-Evaluate Validation Pipeline"
          icon="shield-check-outline"
          onPress={() => evaluateScan()}
          testID="btn-evaluate-validation"
        />
      </View>
    </ScreenContainer>
  );
};

export default ScanValidationScreen;
