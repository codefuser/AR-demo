/**
 * @file src/components/SectionHeader.tsx
 * @description Reusable section header component.
 *
 * Renders a styled heading and optional subtitle used inside screen sections.
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';

interface SectionHeaderProps {
  /** Primary heading text. */
  title: string;
  /** Optional supplementary text shown below the title. */
  subtitle?: string;
  /** Alignment of the text block. */
  align?: 'left' | 'center';
  /** Container style overrides. */
  style?: ViewStyle;
}

/**
 * Section heading with optional subtitle.
 *
 * @example
 * <SectionHeader title="My Buildings" subtitle="Manage your indoor spaces" />
 */
const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  align = 'left',
  style,
}) => {
  const { theme } = useAppTheme();
  const { colors, spacing, typography } = theme.custom;

  const styles = StyleSheet.create({
    container: {
      marginBottom: spacing.md,
    },
    title: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      color: colors.onBackground,
      textAlign: align,
      letterSpacing: -0.4,
    },
    subtitle: {
      marginTop: spacing.xs,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.regular,
      color: colors.onSurfaceVariant,
      textAlign: align,
      lineHeight: typography.fontSize.sm * 1.5,
    },
  });

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
};

export default SectionHeader;
