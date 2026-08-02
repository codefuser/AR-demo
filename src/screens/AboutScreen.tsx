/**
 * @file src/screens/AboutScreen.tsx
 * @description About screen — project information and tech stack.
 *
 * Presents a polished project overview card, current phase status,
 * tech stack details, and developer attribution.
 */

import React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../hooks/useAppTheme';
import { ScreenContainer, AppLogo } from '../components';
import { APP_STRINGS } from '../constants/strings';
import appConfig from '../config/appConfig';

/** Tech stack entries rendered as info pills. */
const TECH_STACK = [
  { label: 'React Native', icon: 'react' as const },
  { label: 'Expo SDK 57', icon: 'lightning-bolt' as const },
  { label: 'TypeScript', icon: 'language-typescript' as const },
  { label: 'React Navigation', icon: 'navigation' as const },
  { label: 'Zustand', icon: 'database' as const },
  { label: 'React Native Paper', icon: 'palette-outline' as const },
];

/** Phase roadmap entries. */
const PHASES = [
  { phase: 1, label: 'Foundation & Architecture', status: 'complete' as const },
  { phase: 2, label: 'Building Management & SQLite', status: 'pending' as const },
  { phase: 3, label: 'QR Code & AR Navigation', status: 'pending' as const },
  { phase: 4, label: '3D Building Viewer', status: 'pending' as const },
];

/**
 * About screen with project overview, phase roadmap, and tech stack.
 */
const AboutScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const { colors, spacing, typography, borderRadius } = theme.custom;

  const styles = StyleSheet.create({
    heroCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.xl,
      padding: spacing.xl,
      alignItems: 'center',
      marginBottom: spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    heroTitle: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.extraBold,
      color: colors.onBackground,
      textAlign: 'center',
      marginTop: spacing.md,
      letterSpacing: -0.5,
    },
    heroSubtitle: {
      fontSize: typography.fontSize.sm,
      color: colors.onSurfaceVariant,
      textAlign: 'center',
      marginTop: spacing.xs,
      lineHeight: typography.fontSize.sm * 1.5,
    },
    heroDescription: {
      fontSize: typography.fontSize.sm,
      color: colors.onSurface,
      textAlign: 'center',
      marginTop: spacing.md,
      lineHeight: typography.fontSize.sm * 1.6,
      paddingHorizontal: spacing.sm,
    },
    sectionTitle: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.semiBold,
      color: colors.textMuted,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      marginBottom: spacing.sm,
    },
    // Phases
    phasesContainer: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.lg,
    },
    phaseRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
    },
    phaseDivider: {
      height: 1,
      backgroundColor: colors.border,
      marginHorizontal: spacing.md,
    },
    phaseNumber: {
      width: 32,
      height: 32,
      borderRadius: borderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    phaseNumberText: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.bold,
      color: colors.onPrimary,
    },
    phaseLabel: {
      flex: 1,
      fontSize: typography.fontSize.base,
      color: colors.onSurface,
    },
    phaseStatusBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: 3,
      borderRadius: borderRadius.full,
    },
    phaseStatusText: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.semiBold,
    },
    // Tech pills
    pillsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginBottom: spacing.lg,
    },
    pill: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.full,
      backgroundColor: colors.surfaceVariant,
      borderWidth: 1,
      borderColor: colors.border,
      gap: spacing.xs,
    },
    pillText: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.medium,
      color: colors.onSurface,
    },
    versionCard: {
      backgroundColor: colors.surfaceVariant,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    versionLabel: {
      fontSize: typography.fontSize.sm,
      color: colors.onSurfaceVariant,
    },
    versionValue: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semiBold,
      color: colors.primary,
    },
  });

  return (
    <ScreenContainer scrollable testID="about-screen">
      {/* ── Hero Card ─────────────────────────────────────────────────── */}
      <View style={styles.heroCard}>
        <AppLogo size="medium" />
        <Text style={styles.heroTitle}>{APP_STRINGS.ABOUT_PROJECT_TITLE}</Text>
        <Text style={styles.heroSubtitle}>{APP_STRINGS.ABOUT_PROJECT_SUBTITLE}</Text>
        <Text style={styles.heroDescription}>{APP_STRINGS.ABOUT_DESCRIPTION}</Text>
      </View>

      {/* ── Development Phases ────────────────────────────────────────── */}
      <Text style={styles.sectionTitle}>Development Roadmap</Text>
      <View style={styles.phasesContainer}>
        {PHASES.map(({ phase, label, status }, index) => {
          const isComplete = status === 'complete';
          const bgColor = isComplete ? colors.success : colors.surfaceVariant;
          const textColor = isComplete ? colors.success : colors.textMuted;
          const numberBg = isComplete ? colors.success : colors.border;

          return (
            <View key={phase}>
              {index > 0 && <View style={styles.phaseDivider} />}
              <View style={styles.phaseRow}>
                <View style={[styles.phaseNumber, { backgroundColor: numberBg }]}>
                  <Text style={styles.phaseNumberText}>{phase}</Text>
                </View>
                <Text style={styles.phaseLabel}>{label}</Text>
                <View
                  style={[
                    styles.phaseStatusBadge,
                    { backgroundColor: `${textColor}20` },
                  ]}
                >
                  <Text style={[styles.phaseStatusText, { color: textColor }]}>
                    {isComplete ? '✓ Done' : 'Pending'}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* ── Tech Stack ────────────────────────────────────────────────── */}
      <Text style={styles.sectionTitle}>Technology Stack</Text>
      <View style={styles.pillsContainer}>
        {TECH_STACK.map(({ label, icon }) => (
          <View key={label} style={styles.pill}>
            <MaterialCommunityIcons
              name={icon}
              size={14}
              color={colors.primary}
            />
            <Text style={styles.pillText}>{label}</Text>
          </View>
        ))}
      </View>

      {/* ── Version Info ──────────────────────────────────────────────── */}
      <View style={styles.versionCard}>
        <Text style={styles.versionLabel}>App Version</Text>
        <Text style={styles.versionValue}>
          v{appConfig.version} — Phase {appConfig.phase}
        </Text>
      </View>
    </ScreenContainer>
  );
};

export default AboutScreen;
