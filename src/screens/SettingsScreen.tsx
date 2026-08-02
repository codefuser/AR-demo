/**
 * @file src/screens/SettingsScreen.tsx
 * @description Application settings screen.
 *
 * Phase 1: Exposes the dark mode toggle.
 * Phase 2+: Will include notification preferences, data management, etc.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Switch } from 'react-native-paper';
import { useAppTheme } from '../hooks/useAppTheme';
import { ScreenContainer, SectionHeader } from '../components';
import { useAppStore } from '../store';
import { APP_STRINGS } from '../constants/strings';

/**
 * Settings screen with theme toggle.
 */
const SettingsScreen: React.FC = () => {
  const { theme, isDark } = useAppTheme();
  const { colors, spacing, typography, borderRadius } = theme.custom;
  const toggleColorScheme = useAppStore((s) => s.toggleColorScheme);

  const styles = StyleSheet.create({
    sectionGroup: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.lg,
    },
    sectionGroupTitle: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.semiBold,
      color: colors.textMuted,
      letterSpacing: 1.1,
      textTransform: 'uppercase',
      marginBottom: spacing.sm,
      paddingHorizontal: spacing.xs,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
    },
    rowDivider: {
      height: 1,
      backgroundColor: colors.border,
      marginHorizontal: spacing.md,
    },
    rowTextContainer: {
      flex: 1,
    },
    rowTitle: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.medium,
      color: colors.onSurface,
    },
    rowSubtitle: {
      marginTop: 2,
      fontSize: typography.fontSize.xs,
      color: colors.onSurfaceVariant,
    },
    comingSoonBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: 3,
      borderRadius: borderRadius.full,
      backgroundColor: `${colors.secondary}22`,
    },
    comingSoonText: {
      fontSize: typography.fontSize.xs,
      color: colors.secondary,
      fontWeight: typography.fontWeight.semiBold,
    },
  });

  return (
    <ScreenContainer testID="settings-screen">
      <SectionHeader
        title={APP_STRINGS.SETTINGS_TITLE}
        subtitle="Customise your app experience"
      />

      {/* ── Appearance ─────────────────────────────────────────────────── */}
      <Text style={styles.sectionGroupTitle}>{APP_STRINGS.SETTINGS_APPEARANCE}</Text>
      <View style={styles.sectionGroup}>
        {/* Dark Mode Toggle */}
        <View style={styles.row}>
          <View style={styles.rowTextContainer}>
            <Text style={styles.rowTitle}>{APP_STRINGS.SETTINGS_DARK_MODE}</Text>
            <Text style={styles.rowSubtitle}>{APP_STRINGS.SETTINGS_DARK_MODE_SUBTITLE}</Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleColorScheme}
            color={colors.primary}
            testID="switch-dark-mode"
          />
        </View>
      </View>

      {/* ── Future Settings (Phase 2+) ──────────────────────────────────── */}
      <Text style={styles.sectionGroupTitle}>Data & Storage</Text>
      <View style={styles.sectionGroup}>
        <View style={styles.row}>
          <View style={styles.rowTextContainer}>
            <Text style={styles.rowTitle}>Database Management</Text>
            <Text style={styles.rowSubtitle}>Export, import, or clear building data</Text>
          </View>
          <View style={styles.comingSoonBadge}>
            <Text style={styles.comingSoonText}>Phase 2</Text>
          </View>
        </View>

        <View style={styles.rowDivider} />

        <View style={styles.row}>
          <View style={styles.rowTextContainer}>
            <Text style={styles.rowTitle}>AR Calibration</Text>
            <Text style={styles.rowSubtitle}>Configure AR tracking parameters</Text>
          </View>
          <View style={styles.comingSoonBadge}>
            <Text style={styles.comingSoonText}>Phase 3</Text>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
};

export default SettingsScreen;
