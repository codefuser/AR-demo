/**
 * @file src/screens/SettingsScreen.tsx
 * @description Application settings screen.
 *
 * Includes:
 *  - Dark mode toggle
 *  - Developer Options section (Navigates to DeveloperOptionsScreen)
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Switch } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppTheme } from '../hooks/useAppTheme';
import { ScreenContainer, SectionHeader } from '../components';
import { useAppStore } from '../store';
import { APP_STRINGS } from '../constants/strings';
import { MAIN_ROUTES } from '../constants/routes';
import type { MainStackParamList } from '../types';

type SettingsScreenProps = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'Settings'>;
};

/**
 * Settings screen with theme toggle and Developer Options access.
 */
const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
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

      {/* ── Developer Mode ──────────────────────────────────────────────── */}
      <Text style={styles.sectionGroupTitle}>Engineering</Text>
      <View style={styles.sectionGroup}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate(MAIN_ROUTES.DEVELOPER_OPTIONS)}
          activeOpacity={0.7}
          testID="btn-developer-options"
        >
          <View style={styles.rowTextContainer}>
            <Text style={styles.rowTitle}>Developer Options</Text>
            <Text style={styles.rowSubtitle}>Camera, AR tracking, planes & diagnostic tools</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color={colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
};

export default SettingsScreen;
