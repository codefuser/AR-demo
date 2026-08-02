/**
 * @file App.tsx
 * @description Application root component.
 *
 * Responsibilities:
 *  1. Provide React Native Paper's PaperProvider with the active theme.
 *  2. Provide SafeAreaProvider for edge-to-edge safe area support.
 *  3. Render the RootNavigator which bootstraps the full navigation tree.
 *
 * The active theme is derived reactively from the Zustand app store so
 * toggling dark/light mode in Settings is instantly reflected everywhere.
 */

import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { RootNavigator } from './src/navigation';
import { useAppTheme } from './src/hooks/useAppTheme';

/**
 * Inner component that reads theme after providers are mounted.
 * Necessary because useAppTheme depends on context set up by SafeAreaProvider.
 */
const ThemedApp: React.FC = () => {
  const { theme, isDark } = useAppTheme();

  return (
    <PaperProvider theme={theme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <RootNavigator />
    </PaperProvider>
  );
};

/**
 * Root export — registered in index.ts as the app entry point.
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <ThemedApp />
    </SafeAreaProvider>
  );
}
