/**
 * @file src/screens/CreateBuildingScreen.tsx
 * @description Create Building screen.
 *
 * Presents a form for entering building details.
 * Phase 1: Form UI only — validates inputs via react-hook-form.
 *          On submit, creates an in-memory building via the building service
 *          and adds it to the Zustand store (no persistence).
 * Phase 2: Will persist the building to SQLite on submit.
 */

import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { TextInput, HelperText } from 'react-native-paper';
import { useAppTheme } from '../hooks/useAppTheme';
import { ScreenContainer, PrimaryButton, SectionHeader } from '../components';
import { useBuildingStore } from '../store';
import { createBuilding } from '../services/buildingService';
import { APP_STRINGS } from '../constants/strings';
import type { MainStackParamList, CreateBuildingPayload } from '../types';

type CreateBuildingScreenProps = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'CreateBuilding'>;
};

/**
 * Form field values — mirrors CreateBuildingPayload with string floorCount
 * (text input) that is parsed to a number before submission.
 */
interface FormValues {
  name: string;
  description: string;
  floorCount: string;
}

/**
 * Create Building form screen using react-hook-form for validation.
 */
const CreateBuildingScreen: React.FC<CreateBuildingScreenProps> = ({
  navigation,
}) => {
  const { theme } = useAppTheme();
  const { colors, spacing, typography, borderRadius } = theme.custom;
  const addBuilding = useBuildingStore((s) => s.addBuilding);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      description: '',
      floorCount: '1',
    },
  });

  /**
   * Handle form submission.
   * Phase 1: Creates an in-memory building and adds it to the Zustand store.
   */
  const onSubmit = async (data: FormValues) => {
    const payload: CreateBuildingPayload = {
      name: data.name.trim(),
      description: data.description.trim() || undefined,
      floorCount: parseInt(data.floorCount, 10),
    };

    const building = await createBuilding(payload);
    addBuilding(building);
    reset();

    Alert.alert(
      'Building Created',
      `"${building.name}" has been created successfully.`,
      [{ text: 'OK', onPress: () => navigation.goBack() }],
    );
  };

  const inputTheme = {
    colors: {
      primary: colors.primary,
      onSurfaceVariant: colors.onSurfaceVariant,
      background: colors.surfaceVariant,
    },
  };

  const styles = StyleSheet.create({
    form: {
      gap: spacing.md,
    },
    label: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semiBold,
      color: colors.onSurface,
      marginBottom: spacing.xs,
    },
    field: {
      marginBottom: spacing.xs,
    },
    submitWrapper: {
      marginTop: spacing.lg,
    },
    noteText: {
      fontSize: typography.fontSize.xs,
      color: colors.textMuted,
      textAlign: 'center',
      marginTop: spacing.md,
      lineHeight: typography.fontSize.xs * 1.6,
    },
  });

  return (
    <ScreenContainer scrollable avoidKeyboard padding={spacing.md} testID="create-building-screen">
      <SectionHeader
        title={APP_STRINGS.CREATE_BUILDING_TITLE}
        subtitle="Fill in the details for your new indoor building"
      />

      <View style={styles.form}>
        {/* Building Name */}
        <View>
          <Text style={styles.label}>{APP_STRINGS.CREATE_BUILDING_NAME_LABEL}</Text>
          <Controller
            control={control}
            name="name"
            rules={{
              required: 'Building name is required',
              minLength: { value: 2, message: 'Name must be at least 2 characters' },
              maxLength: { value: 80, message: 'Name must be 80 characters or fewer' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                mode="outlined"
                placeholder={APP_STRINGS.CREATE_BUILDING_NAME_PLACEHOLDER}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.name}
                style={styles.field}
                theme={inputTheme}
                testID="input-building-name"
                autoCapitalize="words"
                returnKeyType="next"
              />
            )}
          />
          {errors.name && (
            <HelperText type="error">{errors.name.message}</HelperText>
          )}
        </View>

        {/* Description */}
        <View>
          <Text style={styles.label}>{APP_STRINGS.CREATE_BUILDING_DESC_LABEL}</Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                mode="outlined"
                placeholder={APP_STRINGS.CREATE_BUILDING_DESC_PLACEHOLDER}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                style={styles.field}
                theme={inputTheme}
                testID="input-building-description"
                multiline
                numberOfLines={3}
              />
            )}
          />
        </View>

        {/* Floor Count */}
        <View>
          <Text style={styles.label}>{APP_STRINGS.CREATE_BUILDING_FLOOR_LABEL}</Text>
          <Controller
            control={control}
            name="floorCount"
            rules={{
              required: 'Floor count is required',
              validate: (val) => {
                const n = parseInt(val, 10);
                if (isNaN(n) || n < 1) return 'Enter a valid number of floors (min: 1)';
                if (n > 200) return 'Floor count cannot exceed 200';
                return true;
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                mode="outlined"
                keyboardType="number-pad"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.floorCount}
                style={styles.field}
                theme={inputTheme}
                testID="input-floor-count"
                returnKeyType="done"
              />
            )}
          />
          {errors.floorCount && (
            <HelperText type="error">{errors.floorCount.message}</HelperText>
          )}
        </View>

        {/* Submit */}
        <View style={styles.submitWrapper}>
          <PrimaryButton
            label={APP_STRINGS.CREATE_BUILDING_SUBMIT}
            icon="content-save-outline"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            testID="btn-save-building"
          />
        </View>

        <Text style={styles.noteText}>
          Phase 1 — building data is stored in memory only.{'\n'}
          Persistent storage will be added in Phase 2.
        </Text>
      </View>
    </ScreenContainer>
  );
};

export default CreateBuildingScreen;
