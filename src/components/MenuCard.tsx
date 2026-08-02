/**
 * @file src/components/MenuCard.tsx
 * @description Reusable pressable menu card used on the Home screen.
 *
 * Renders an icon, label, and optional subtitle inside an elevated card.
 * Supports press feedback via React Native's Pressable API.
 */

import React, { useRef } from 'react';
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  Animated,
  ViewStyle,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../hooks/useAppTheme';

interface MenuCardProps {
  /** Icon name from MaterialCommunityIcons. */
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  /** Card label. */
  label: string;
  /** Optional supporting text. */
  subtitle?: string;
  /** Called when the card is tapped. */
  onPress: () => void;
  /** Accent colour for the icon background. Defaults to primary. */
  iconColor?: string;
  /** Additional outer container style. */
  style?: ViewStyle;
  /** Test identifier. */
  testID?: string;
}

/**
 * Pressable menu card with animated press scale feedback.
 *
 * @example
 * <MenuCard
 *   icon="office-building-plus"
 *   label="Create Building"
 *   subtitle="Add a new indoor space"
 *   onPress={handleCreate}
 * />
 */
const MenuCard: React.FC<MenuCardProps> = ({
  icon,
  label,
  subtitle,
  onPress,
  iconColor,
  style,
  testID,
}) => {
  const { theme } = useAppTheme();
  const { colors, spacing, borderRadius, typography } = theme.custom;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 4,
    }).start();
  };

  const accentColor = iconColor ?? colors.primary;

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme.dark ? 0.3 : 0.08,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.border,
    },
    iconContainer: {
      width: 52,
      height: 52,
      borderRadius: borderRadius.md,
      backgroundColor: `${accentColor}22`,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    textContainer: {
      flex: 1,
    },
    label: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semiBold,
      color: colors.onSurface,
      marginBottom: subtitle ? 2 : 0,
    },
    subtitle: {
      fontSize: typography.fontSize.xs,
      color: colors.onSurfaceVariant,
      lineHeight: typography.fontSize.xs * 1.5,
    },
    arrow: {
      marginLeft: spacing.sm,
    },
  });

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Animated.View style={[styles.card, style, { transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name={icon} size={26} color={accentColor} />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.label} numberOfLines={1}>
            {label}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={2}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        <MaterialCommunityIcons
          name="chevron-right"
          size={20}
          color={colors.textMuted}
          style={styles.arrow}
        />
      </Animated.View>
    </Pressable>
  );
};

export default MenuCard;
