/**
 * @file src/components/BuildingTypePicker.tsx
 * @description Building type selector displayed as a horizontal chip group.
 *
 * Renders one chip per BuildingType. The active chip is highlighted with the
 * primary colour.  Designed for use inside react-hook-form via Controller.
 */

import React from 'react';
import {
  ScrollView,
  Pressable,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { BuildingType } from '../types';
import { useAppTheme } from '../hooks/useAppTheme';

/** Icon and label for each building type option. */
const BUILDING_TYPES: Array<{
  value: BuildingType;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}> = [
  { value: 'college', label: 'College', icon: 'school' },
  { value: 'school', label: 'School', icon: 'school-outline' },
  { value: 'mall', label: 'Mall', icon: 'shopping' },
  { value: 'hospital', label: 'Hospital', icon: 'hospital-building' },
  { value: 'office', label: 'Office', icon: 'office-building' },
  { value: 'other', label: 'Other', icon: 'dots-horizontal' },
];

interface BuildingTypePickerProps {
  /** Currently selected building type. */
  value: BuildingType;
  /** Callback when the user selects a type. */
  onChange: (type: BuildingType) => void;
  /** Test identifier. */
  testID?: string;
}

/**
 * Horizontal scrollable chip selector for BuildingType.
 *
 * @example
 * <Controller
 *   control={control}
 *   name="buildingType"
 *   render={({ field: { value, onChange } }) => (
 *     <BuildingTypePicker value={value} onChange={onChange} />
 *   )}
 * />
 */
const BuildingTypePicker: React.FC<BuildingTypePickerProps> = ({
  value,
  onChange,
  testID,
}) => {
  const { theme } = useAppTheme();
  const { colors, spacing, borderRadius, typography } = theme.custom;

  const styles = StyleSheet.create({
    row: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.full,
      borderWidth: 1.5,
      gap: spacing.xs,
    },
    chipLabel: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
    },
  });

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      testID={testID}
    >
      {BUILDING_TYPES.map((type) => {
        const isSelected = value === type.value;
        return (
          <Pressable
            key={type.value}
            onPress={() => onChange(type.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={type.label}
            testID={`chip-${type.value}`}
          >
            <View
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected
                    ? `${colors.primary}18`
                    : colors.surfaceVariant,
                  borderColor: isSelected ? colors.primary : colors.border,
                },
              ]}
            >
              <MaterialCommunityIcons
                name={type.icon}
                size={16}
                color={isSelected ? colors.primary : colors.onSurfaceVariant}
              />
              <Text
                style={[
                  styles.chipLabel,
                  {
                    color: isSelected
                      ? colors.primary
                      : colors.onSurfaceVariant,
                  },
                ]}
              >
                {type.label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

export default BuildingTypePicker;
