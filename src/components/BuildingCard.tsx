/**
 * @file src/components/BuildingCard.tsx
 * @description Building list item card component.
 *
 * Renders building name, description, floor count, building type label,
 * creation date, and current scan status badge.
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
import type { Building } from '../types';
import { useAppTheme } from '../hooks/useAppTheme';
import { getBuildingTypeLabel } from '../services/buildingService';
import { formatDate } from '../utils';
import StatusBadge from './StatusBadge';

interface BuildingCardProps {
  /** Building object to display. */
  building: Building;
  /** Called when card is pressed. */
  onPress: () => void;
  /** Optional container style override. */
  style?: ViewStyle;
  /** Test identifier. */
  testID?: string;
}

/**
 * Building card component with scale animation on press.
 */
const BuildingCard: React.FC<BuildingCardProps> = ({
  building,
  onPress,
  style,
  testID,
}) => {
  const { theme } = useAppTheme();
  const { colors, spacing, borderRadius, typography } = theme.custom;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
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

  const typeLabel = getBuildingTypeLabel(building.buildingType);

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme.dark ? 0.3 : 0.06,
      shadowRadius: 6,
      elevation: 2,
      marginBottom: spacing.sm,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.xs,
    },
    titleContainer: {
      flex: 1,
      marginRight: spacing.sm,
    },
    name: {
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.bold,
      color: colors.onSurface,
    },
    typeBadge: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.medium,
      color: colors.primary,
      marginTop: 2,
    },
    description: {
      fontSize: typography.fontSize.sm,
      color: colors.onSurfaceVariant,
      lineHeight: typography.fontSize.sm * 1.4,
      marginBottom: spacing.md,
    },
    footerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: spacing.xs,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    infoGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    metaText: {
      fontSize: typography.fontSize.xs,
      color: colors.textMuted,
    },
  });

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={`Building ${building.name}`}
    >
      <Animated.View style={[styles.card, style, { transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <Text style={styles.name} numberOfLines={1}>
              {building.name}
            </Text>
            <Text style={styles.typeBadge}>{typeLabel}</Text>
          </View>
          <StatusBadge status={building.scanStatus} />
        </View>

        {building.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {building.description}
          </Text>
        ) : null}

        <View style={styles.footerRow}>
          <View style={styles.infoGroup}>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons
                name="layers-outline"
                size={14}
                color={colors.textMuted}
              />
              <Text style={styles.metaText}>
                {building.floorCount} {building.floorCount === 1 ? 'Floor' : 'Floors'}
              </Text>
            </View>

            <View style={styles.metaItem}>
              <MaterialCommunityIcons
                name="calendar-outline"
                size={14}
                color={colors.textMuted}
              />
              <Text style={styles.metaText}>{formatDate(building.createdAt)}</Text>
            </View>
          </View>

          <MaterialCommunityIcons
            name="chevron-right"
            size={18}
            color={colors.textMuted}
          />
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default BuildingCard;
