/**
 * @file src/screens/BuildingsScreen.tsx
 * @description Buildings list screen.
 *
 * Displays all buildings created by the administrator.
 * Phase 1: Shows an empty state with a prompt to create the first building.
 * Phase 2: Will fetch from SQLite and render a FlatList of BuildingCard components.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../hooks/useAppTheme';
import { ScreenContainer, PrimaryButton, SectionHeader } from '../components';
import { APP_STRINGS } from '../constants/strings';
import { MAIN_ROUTES } from '../constants/routes';
import type { MainStackParamList } from '../types';

type BuildingsScreenProps = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'Buildings'>;
};

/**
 * Buildings list screen.
 *
 * Phase 1 renders an empty state illustration.
 * The FlatList implementation is deferred to Phase 2.
 */
const BuildingsScreen: React.FC<BuildingsScreenProps> = ({ navigation }) => {
  const { theme } = useAppTheme();
  const { colors, spacing, typography, borderRadius } = theme.custom;

  const styles = StyleSheet.create({
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.xl,
    },
    iconWrapper: {
      width: 100,
      height: 100,
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
      lineHeight: typography.fontSize.sm * 1.6,
      marginBottom: spacing.xl,
    },
  });

  return (
    <ScreenContainer testID="buildings-screen">
      <SectionHeader
        title={APP_STRINGS.BUILDINGS_TITLE}
        subtitle="All your indoor spaces"
      />

      {/* Empty State */}
      <View style={styles.emptyContainer}>
        <View style={styles.iconWrapper}>
          <MaterialCommunityIcons
            name="city-variant-outline"
            size={48}
            color={colors.primary}
          />
        </View>

        <Text style={styles.emptyTitle}>{APP_STRINGS.BUILDINGS_EMPTY_TITLE}</Text>
        <Text style={styles.emptyMessage}>{APP_STRINGS.BUILDINGS_EMPTY_MESSAGE}</Text>

        <PrimaryButton
          label={APP_STRINGS.HOME_BTN_CREATE_BUILDING}
          icon="plus"
          onPress={() => navigation.navigate(MAIN_ROUTES.CREATE_BUILDING)}
          testID="buildings-btn-create"
        />
      </View>

      {/*
       * Phase 2 — replace the empty state above with:
       * <FlatList
       *   data={buildings}
       *   keyExtractor={(item) => item.id}
       *   renderItem={({ item }) => <BuildingCard building={item} />}
       * />
       */}
    </ScreenContainer>
  );
};

export default BuildingsScreen;
