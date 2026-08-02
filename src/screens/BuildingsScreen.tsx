/**
 * @file src/screens/BuildingsScreen.tsx
 * @description Buildings list screen.
 *
 * Displays all buildings created by the administrator.
 * Phase 2: Renders a FlatList of BuildingCard components when buildings exist,
 * or a styled Empty State illustration with a CTA button when empty.
 */

import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../hooks/useAppTheme';
import { ScreenContainer, PrimaryButton, SectionHeader, BuildingCard } from '../components';
import { useBuildingStore } from '../store';
import { APP_STRINGS } from '../constants/strings';
import { MAIN_ROUTES } from '../constants/routes';
import type { MainStackParamList, Building } from '../types';

type BuildingsScreenProps = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'Buildings'>;
};

/**
 * Buildings list screen with dynamic list and empty state.
 */
const BuildingsScreen: React.FC<BuildingsScreenProps> = ({ navigation }) => {
  const { theme } = useAppTheme();
  const { colors, spacing, typography, borderRadius } = theme.custom;
  const buildings = useBuildingStore((s) => s.buildings);
  const selectBuilding = useBuildingStore((s) => s.selectBuilding);

  const handleSelectBuilding = (building: Building) => {
    selectBuilding(building.id);
    navigation.navigate(MAIN_ROUTES.BUILDING_DETAILS, { buildingId: building.id });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    countText: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.semiBold,
      color: colors.primary,
      backgroundColor: `${colors.primary}18`,
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: borderRadius.full,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.xxl,
    },
    iconWrapper: {
      width: 90,
      height: 90,
      borderRadius: borderRadius.full,
      backgroundColor: `${colors.primary}18`,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.lg,
    },
    emptyTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
      color: colors.onBackground,
      textAlign: 'center',
      marginBottom: spacing.sm,
    },
    emptyMessage: {
      fontSize: typography.fontSize.sm,
      color: colors.onSurfaceVariant,
      textAlign: 'center',
      lineHeight: typography.fontSize.sm * 1.5,
      marginBottom: spacing.xl,
    },
    listContent: {
      paddingBottom: spacing.xl,
    },
    createButtonWrapper: {
      marginTop: spacing.md,
      marginBottom: spacing.lg,
    },
  });

  return (
    <ScreenContainer testID="buildings-screen">
      <View style={styles.headerRow}>
        <SectionHeader
          title={APP_STRINGS.BUILDINGS_TITLE}
          subtitle={APP_STRINGS.BUILDINGS_SUBTITLE}
          style={{ marginBottom: 0 }}
        />
        {buildings.length > 0 && (
          <Text style={styles.countText}>
            {APP_STRINGS.BUILDINGS_COUNT(buildings.length)}
          </Text>
        )}
      </View>

      {buildings.length === 0 ? (
        /* Empty State */
        <View style={styles.emptyContainer}>
          <View style={styles.iconWrapper}>
            <MaterialCommunityIcons
              name="office-building-marker-outline"
              size={44}
              color={colors.primary}
            />
          </View>

          <Text style={styles.emptyTitle}>{APP_STRINGS.BUILDINGS_EMPTY_TITLE}</Text>
          <Text style={styles.emptyMessage}>{APP_STRINGS.BUILDINGS_EMPTY_MESSAGE}</Text>

          <PrimaryButton
            label={APP_STRINGS.BUILDINGS_BTN_CREATE}
            icon="plus"
            onPress={() => navigation.navigate(MAIN_ROUTES.CREATE_BUILDING)}
            testID="buildings-btn-create"
          />
        </View>
      ) : (
        /* Buildings List */
        <View style={styles.container}>
          <View style={styles.createButtonWrapper}>
            <PrimaryButton
              label={APP_STRINGS.HOME_BTN_CREATE_BUILDING}
              icon="plus"
              onPress={() => navigation.navigate(MAIN_ROUTES.CREATE_BUILDING)}
              testID="buildings-btn-create-top"
            />
          </View>

          <FlatList
            data={buildings}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <BuildingCard
                building={item}
                onPress={() => handleSelectBuilding(item)}
                testID={`building-card-${item.id}`}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </ScreenContainer>
  );
};

export default BuildingsScreen;
