/**
 * @file src/navigation/RootNavigator.tsx
 * @description Root navigator — top-level navigation container.
 *
 * Wraps NavigationContainer and hosts the root stack:
 *   - Splash  (shown once on first launch)
 *   - Main    (the rest of the application)
 *
 * The NavigationContainer receives the theme derived from the active
 * color scheme so React Navigation's default chrome (background, borders)
 * is also themed correctly.
 */

import React from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashScreen } from '../screens';
import MainNavigator from './MainNavigator';
import { useAppTheme } from '../hooks/useAppTheme';
import { ROOT_ROUTES } from '../constants/routes';
import type { RootStackParamList } from '../types';

const RootStack = createNativeStackNavigator<RootStackParamList>();

/**
 * Root navigator that bootstraps the navigation tree.
 *
 * The NavigationContainer's theme is synced with the app's color scheme so
 * RN Navigation's internal chrome (e.g. background behind modals) is correct.
 */
const RootNavigator: React.FC = () => {
  const { theme, isDark } = useAppTheme();
  const { colors } = theme.custom;

  /**
   * React Navigation theme adapted from the current color scheme.
   * Only the colors we override are listed; the rest inherit from
   * DefaultTheme / DarkTheme.
   */
  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
      card: colors.surface,
      text: colors.onSurface,
      border: colors.border,
      primary: colors.primary,
      notification: colors.primary,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <RootStack.Navigator
        initialRouteName={ROOT_ROUTES.SPLASH}
        screenOptions={{ headerShown: false, animation: 'fade' }}
      >
        <RootStack.Screen name={ROOT_ROUTES.SPLASH} component={SplashScreen} />
        <RootStack.Screen name={ROOT_ROUTES.MAIN} component={MainNavigator} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
