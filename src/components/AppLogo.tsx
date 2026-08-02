/**
 * @file src/components/AppLogo.tsx
 * @description AR Indoor Nav application logo component.
 *
 * Renders a stylised SVG-based logo using MaterialCommunityIcons wrapped
 * inside a gradient-like container.  The logo adapts to the current theme.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../hooks/useAppTheme';

interface AppLogoProps {
  /** Size variant controlling the icon and text scale. */
  size?: 'small' | 'medium' | 'large';
  /** Whether to show the text label below the icon. */
  showLabel?: boolean;
}

/** Dimension map for each size variant. */
const SIZE_MAP = {
  small: { container: 56, icon: 28, font: 10, borderRadius: 14 },
  medium: { container: 80, icon: 40, font: 13, borderRadius: 20 },
  large: { container: 110, icon: 56, font: 16, borderRadius: 28 },
} as const;

/**
 * Application logo with icon container and optional label.
 *
 * @example
 * <AppLogo size="large" showLabel />
 */
const AppLogo: React.FC<AppLogoProps> = ({
  size = 'medium',
  showLabel = false,
}) => {
  const { theme } = useAppTheme();
  const { colors, spacing } = theme.custom;
  const dims = SIZE_MAP[size];

  const styles = StyleSheet.create({
    wrapper: {
      alignItems: 'center',
    },
    container: {
      width: dims.container,
      height: dims.container,
      borderRadius: dims.borderRadius,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.45,
      shadowRadius: 12,
      elevation: 10,
    },
    label: {
      marginTop: spacing.sm,
      fontSize: dims.font,
      fontWeight: '700',
      letterSpacing: 1.2,
      color: colors.onBackground,
      textTransform: 'uppercase',
    },
  });

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <MaterialCommunityIcons
          name="map-marker-radius"
          size={dims.icon}
          color={colors.onPrimary}
        />
      </View>
      {showLabel && (
        <Text style={styles.label} numberOfLines={1}>
          AR Indoor Nav
        </Text>
      )}
    </View>
  );
};

export default AppLogo;
