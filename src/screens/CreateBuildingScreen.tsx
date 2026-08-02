/**
 * @file src/screens/CreateBuildingScreen.tsx
 * @description Create / Edit Building screen.
 *
 * Presents a form for entering building details:
 *  - Building Name * (required, min 2, max 80)
 *  - Description
 *  - Number of Floors * (required, min 1, max 100)
 *  - Address
 *  - Building Type * (College, School, Mall, Hospital, Office, Other)
 *  - Thumbnail Image (placeholder)
 *
 * Phase 2: Saves building to Zustand store and navigates directly to BuildingDetails.
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Pressable } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { TextInput, HelperText } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../hooks/useAppTheme';
import { ScreenContainer, PrimaryButton, SectionHeader, BuildingTypePicker } from '../components';
import { useBuildingStore } from '../store';
import { createBuilding, updateBuilding as updateBuildingService } from '../services/buildingService';
import { APP_STRINGS } from '../constants/strings';
import { MAIN_ROUTES } from '../constants/routes';
import type { MainStackParamList, CreateBuildingPayload, BuildingType } from '../types';

type CreateBuildingScreenProps = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'CreateBuilding'>;
  route: RouteProp<MainStackParamList, 'CreateBuilding'>;
};

interface FormValues {
  name: string;
  description: string;
  address: string;
  floorCount: string;
  buildingType: BuildingType;
}

const CreateBuildingScreen: React.FC<CreateBuildingScreenProps> = ({
  navigation,
  route,
}) => {
  const editId = route.params?.editId;
  const { theme } = useAppTheme();
  const { colors, spacing, typography, borderRadius } = theme.custom;
  
  const addBuilding = useBuildingStore((s) => s.addBuilding);
  const updateBuildingStore = useBuildingStore((s) => s.updateBuilding);
  const buildings = useBuildingStore((s) => s.buildings);
  
  const existingBuilding = editId ? buildings.find((b) => b.id === editId) : undefined;

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      name: existingBuilding?.name || '',
      description: existingBuilding?.description || '',
      address: existingBuilding?.address || '',
      floorCount: existingBuilding?.floorCount ? String(existingBuilding.floorCount) : '1',
      buildingType: existingBuilding?.buildingType || 'college',
    },
  });

  useEffect(() => {
    if (existingBuilding) {
      setValue('name', existingBuilding.name);
      setValue('description', existingBuilding.description || '');
      setValue('address', existingBuilding.address || '');
      setValue('floorCount', String(existingBuilding.floorCount));
      setValue('buildingType', existingBuilding.buildingType);
    }
  }, [existingBuilding, setValue]);

  const onSubmit = async (data: FormValues) => {
    const floorNum = parseInt(data.floorCount, 10);
    
    if (existingBuilding) {
      const updated = await updateBuildingService(existingBuilding, {
        name: data.name.trim(),
        description: data.description.trim() || undefined,
        address: data.address.trim() || undefined,
        floorCount: floorNum,
        buildingType: data.buildingType,
      });
      updateBuildingStore(existingBuilding.id, updated);
      reset();
      navigation.goBack();
    } else {
      const payload: CreateBuildingPayload = {
        name: data.name.trim(),
        description: data.description.trim() || undefined,
        address: data.address.trim() || undefined,
        floorCount: floorNum,
        buildingType: data.buildingType,
      };

      const newBuilding = await createBuilding(payload);
      addBuilding(newBuilding);
      reset();

      // Navigate to Building Details as per workflow: Home -> Buildings -> Create -> Save -> Building Details
      navigation.replace(MAIN_ROUTES.BUILDING_DETAILS, { buildingId: newBuilding.id });
    }
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
      paddingBottom: spacing.xl,
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
    thumbnailBox: {
      height: 100,
      borderRadius: borderRadius.md,
      borderWidth: 1.5,
      borderColor: colors.border,
      borderStyle: 'dashed',
      backgroundColor: colors.surfaceVariant,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
    },
    thumbnailText: {
      fontSize: typography.fontSize.xs,
      color: colors.textMuted,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: spacing.md,
      marginTop: spacing.md,
    },
    buttonFlex: {
      flex: 1,
    },
  });

  return (
    <ScreenContainer scrollable avoidKeyboard padding={spacing.md} testID="create-building-screen">
      <SectionHeader
        title={existingBuilding ? APP_STRINGS.CREATE_BUILDING_EDIT_TITLE : APP_STRINGS.CREATE_BUILDING_TITLE}
        subtitle={APP_STRINGS.CREATE_BUILDING_SUBTITLE}
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
              />
            )}
          />
          {errors.name && <HelperText type="error">{errors.name.message}</HelperText>}
        </View>

        {/* Building Type Selector */}
        <View>
          <Text style={styles.label}>{APP_STRINGS.CREATE_BUILDING_TYPE_LABEL}</Text>
          <Controller
            control={control}
            name="buildingType"
            render={({ field: { value, onChange } }) => (
              <BuildingTypePicker value={value} onChange={onChange} testID="picker-building-type" />
            )}
          />
        </View>

        {/* Number of Floors */}
        <View>
          <Text style={styles.label}>{APP_STRINGS.CREATE_BUILDING_FLOOR_LABEL}</Text>
          <Controller
            control={control}
            name="floorCount"
            rules={{
              required: 'Floor count is required',
              validate: (val) => {
                const n = parseInt(val, 10);
                if (isNaN(n) || n < 1) return 'Floor count must be at least 1';
                if (n > 100) return 'Floor count cannot exceed 100';
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
              />
            )}
          />
          {errors.floorCount && <HelperText type="error">{errors.floorCount.message}</HelperText>}
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

        {/* Address */}
        <View>
          <Text style={styles.label}>{APP_STRINGS.CREATE_BUILDING_ADDRESS_LABEL}</Text>
          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                mode="outlined"
                placeholder={APP_STRINGS.CREATE_BUILDING_ADDRESS_PLACEHOLDER}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                style={styles.field}
                theme={inputTheme}
                testID="input-building-address"
              />
            )}
          />
        </View>

        {/* Thumbnail Image (Placeholder) */}
        <View>
          <Text style={styles.label}>{APP_STRINGS.CREATE_BUILDING_THUMBNAIL_LABEL}</Text>
          <Pressable
            onPress={() => Alert.alert(APP_STRINGS.COMMON_COMING_SOON, 'Thumbnail upload will be available in Phase 3.')}
          >
            <View style={styles.thumbnailBox}>
              <MaterialCommunityIcons name="image-plus" size={28} color={colors.textMuted} />
              <Text style={styles.thumbnailText}>{APP_STRINGS.CREATE_BUILDING_THUMBNAIL_PLACEHOLDER}</Text>
            </View>
          </Pressable>
        </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <View style={styles.buttonFlex}>
            <PrimaryButton
              label={APP_STRINGS.CREATE_BUILDING_CANCEL}
              mode="outlined"
              onPress={() => navigation.goBack()}
              testID="btn-cancel-building"
            />
          </View>
          <View style={styles.buttonFlex}>
            <PrimaryButton
              label={APP_STRINGS.CREATE_BUILDING_SUBMIT}
              icon="content-save-outline"
              onPress={handleSubmit(onSubmit)}
              loading={isSubmitting}
              testID="btn-save-building"
            />
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
};

export default CreateBuildingScreen;
