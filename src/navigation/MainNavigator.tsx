/**
 * @file src/navigation/MainNavigator.tsx
 * @description Main stack navigator — screens accessible after onboarding.
 *
 * Phase 2: Contains Home, Buildings, CreateBuilding, BuildingDetails, Settings, About.
 * Phase 3: Added CameraScreen.
 * Phase 4: Added ARStatusScreen.
 * Phase 5A: Added ARDiagnosticsScreen.
 * Phase 5B.1: Added ScanSessionScreen.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  HomeScreen,
  BuildingsScreen,
  CreateBuildingScreen,
  BuildingDetailsScreen,
  CameraScreen,
  ARStatusScreen,
  ARDiagnosticsScreen,
  ScanSessionScreen,
  SettingsScreen,
  AboutScreen,
} from '../screens';
import { useAppTheme } from '../hooks/useAppTheme';
import { MAIN_ROUTES } from '../constants/routes';
import type { MainStackParamList } from '../types';

const Stack = createNativeStackNavigator<MainStackParamList>();

/**
 * Main application stack navigator.
 */
const MainNavigator: React.FC = () => {
  const { theme } = useAppTheme();
  const { colors, typography } = theme.custom;

  /** Shared header options applied to all screens. */
  const sharedHeaderOptions = {
    headerStyle: {
      backgroundColor: colors.surface,
    },
    headerTintColor: colors.primary,
    headerTitleStyle: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semiBold as '600',
      color: colors.onSurface,
    },
    headerShadowVisible: false,
    headerBackTitle: '',
  };

  return (
    <Stack.Navigator
      initialRouteName={MAIN_ROUTES.HOME}
      screenOptions={sharedHeaderOptions}
    >
      <Stack.Screen
        name={MAIN_ROUTES.HOME}
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={MAIN_ROUTES.BUILDINGS}
        component={BuildingsScreen}
        options={{ title: 'My Buildings' }}
      />
      <Stack.Screen
        name={MAIN_ROUTES.CREATE_BUILDING}
        component={CreateBuildingScreen}
        options={({ route }) => ({
          title: route.params?.editId ? 'Edit Building' : 'New Building',
        })}
      />
      <Stack.Screen
        name={MAIN_ROUTES.BUILDING_DETAILS}
        component={BuildingDetailsScreen}
        options={{ title: 'Building Details' }}
      />
      <Stack.Screen
        name={MAIN_ROUTES.CAMERA}
        component={CameraScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={MAIN_ROUTES.AR_STATUS}
        component={ARStatusScreen}
        options={{ title: 'AR Engine Status' }}
      />
      <Stack.Screen
        name={MAIN_ROUTES.AR_DIAGNOSTICS}
        component={ARDiagnosticsScreen}
        options={{ title: 'AR Diagnostics' }}
      />
      <Stack.Screen
        name={MAIN_ROUTES.SCAN_SESSION}
        component={ScanSessionScreen}
        options={{ title: 'Scan Building' }}
      />
      <Stack.Screen
        name={MAIN_ROUTES.SETTINGS}
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
      <Stack.Screen
        name={MAIN_ROUTES.ABOUT}
        component={AboutScreen}
        options={{ title: 'About' }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;
