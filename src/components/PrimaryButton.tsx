/**
 * @file src/components/PrimaryButton.tsx
 * @description Reusable primary action button component.
 *
 * Wraps React Native Paper's `Button` to enforce consistent styling
 * and expose only the props the application needs.
 */

import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../hooks/useAppTheme';

interface PrimaryButtonProps {
  /** Button label text. */
  label: string;
  /** Called when the button is pressed. */
  onPress: () => void;
  /** Optional MaterialCommunityIcons icon name shown on the left. */
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  /** Disable the button and show a non-interactive state. */
  disabled?: boolean;
  /** Show a loading spinner instead of the label. */
  loading?: boolean;
  /** Override button variant. Defaults to 'contained'. */
  mode?: 'contained' | 'outlined' | 'text';
  /** Additional container style overrides. */
  style?: ViewStyle;
  /** Test identifier for automated testing. */
  testID?: string;
}

/**
 * Full-width primary action button with icon support.
 *
 * @example
 * <PrimaryButton label="Create Building" icon="plus" onPress={handleCreate} />
 */
const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onPress,
  icon,
  disabled = false,
  loading = false,
  mode = 'contained',
  style,
  testID,
}) => {
  const { theme } = useAppTheme();
  const { colors, borderRadius, spacing } = theme.custom;

  const styles = StyleSheet.create({
    button: {
      borderRadius: borderRadius.md,
      paddingVertical: spacing.xs,
    },
    contentStyle: {
      height: 52,
      flexDirection: 'row',
      alignItems: 'center',
    },
    labelStyle: {
      fontSize: 15,
      fontWeight: '600',
      letterSpacing: 0.4,
      color: mode === 'contained' ? colors.onPrimary : colors.primary,
    },
  });

  return (
    <Button
      mode={mode}
      onPress={onPress}
      icon={icon}
      disabled={disabled || loading}
      loading={loading}
      style={[styles.button, style]}
      contentStyle={styles.contentStyle}
      labelStyle={styles.labelStyle}
      buttonColor={mode === 'contained' ? colors.primary : undefined}
      testID={testID}
    >
      {label}
    </Button>
  );
};

export default PrimaryButton;
