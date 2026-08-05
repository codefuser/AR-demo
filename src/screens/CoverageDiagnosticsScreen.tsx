/**
 * @file src/screens/CoverageDiagnosticsScreen.tsx
 * @description Coverage Diagnostics Screen — Intelligent Coverage Analysis Engine Dashboard.
 *
 * Displays:
 *  - Coverage Summary Card (`CoverageSummaryCard`)
 *  - 5-Factor Quality Scoring Matrix Card (`CoverageDiagnosticsCard`)
 *  - Grid cell statistics & completion eligibility rules
 *  - Start / Pause / Reset Coverage Controls
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';
import { useCoverage, useCoverageControl } from '../hooks/useCoverage';
import {
  ScreenContainer,
  SectionHeader,
  PrimaryButton,
  CoverageSummaryCard,
  CoverageDiagnosticsCard,
} from '../components';

const CoverageDiagnosticsScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const { colors, spacing, typography, borderRadius } = theme.custom;

  const { snapshot, validation } = useCoverage();
  const { startAnalysis, stopAnalysis, resetCoverage } = useCoverageControl();

  useEffect(() => {
    startAnalysis();
    return () => {
      stopAnalysis();
    };
  }, [startAnalysis, stopAnalysis]);

  const styles = StyleSheet.create({
    header: {
      marginBottom: spacing.sm,
    },
    infoBox: {
      backgroundColor: snapshot.isCompletionEligible ? `${colors.success}15` : `${colors.warning}15`,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: snapshot.isCompletionEligible ? `${colors.success}40` : `${colors.warning}40`,
      marginBottom: spacing.md,
    },
    infoTitle: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.bold,
      color: snapshot.isCompletionEligible ? colors.success : colors.warning,
      marginBottom: 2,
    },
    infoText: {
      fontSize: typography.fontSize.xs,
      color: colors.onSurfaceVariant,
      lineHeight: typography.fontSize.xs * 1.4,
    },
    controlsGroup: {
      gap: spacing.sm,
      marginTop: spacing.md,
      marginBottom: spacing.xl,
    },
  });

  return (
    <ScreenContainer scrollable padding={spacing.md} testID="coverage-diagnostics-screen">
      <SectionHeader
        title="Coverage Diagnostics"
        subtitle="2D spatial grid cell hashing & 5-factor quality scoring analysis"
        style={styles.header}
      />

      {/* 1. Coverage Summary Card */}
      <CoverageSummaryCard snapshot={snapshot} />

      {/* 2. Completion Eligibility Readiness Banner */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>
          {snapshot.isCompletionEligible ? 'SCAN COMPLETION ELIGIBLE' : 'SCAN COMPLETION INELIGIBLE'}
        </Text>
        <Text style={styles.infoText}>
          {snapshot.isCompletionEligible
            ? 'Coverage percentage, point cloud density, and physical surface planes meet all scan completion rules.'
            : snapshot.completionBlockingMessage || validation.blockingMessage || 'Scan rules not met.'}
        </Text>
      </View>

      {/* 3. 5-Factor Quality Scoring Breakdown */}
      <CoverageDiagnosticsCard scores={snapshot.scores} />

      {/* 4. Controls */}
      <View style={styles.controlsGroup}>
        <PrimaryButton
          label="Reset Spatial Grid Cells"
          icon="refresh"
          mode="outlined"
          onPress={() => {
            resetCoverage();
            startAnalysis();
          }}
          testID="btn-reset-coverage"
        />
      </View>
    </ScreenContainer>
  );
};

export default CoverageDiagnosticsScreen;
