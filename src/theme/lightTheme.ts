/**
 * @file src/theme/lightTheme.ts
 * @description Light color theme definition.
 *
 * Colors follow the React Native Paper MD3 theme contract extended with
 * custom application-level semantic tokens.
 */

import { MD3LightTheme } from 'react-native-paper';
import { spacing, typography, borderRadius, elevation, duration } from './tokens';

// ── App Color Palette Interface ───────────────────────────────────────────────
// Defines the shape of the custom color palette used by both light and dark
// themes.  Using an interface (not `typeof lightColors`) ensures dark values
// are accepted by the AppTheme type without literal-type conflicts.

export interface AppColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  surfaceVariant: string;
  card: string;
  onBackground: string;
  onSurface: string;
  onSurfaceVariant: string;
  textMuted: string;
  onPrimary: string;
  border: string;
  borderFocus: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  gradientStart: string;
  gradientEnd: string;
  overlay: string;
  ripple: string;
}

/**
 * Application-specific color palette for the light theme.
 * Use semantic names (e.g. `primary`) rather than raw hex values in components.
 */
const lightColors: AppColors = {
  // ── Brand ────────────────────────────────────────────────────────────────
  primary: '#4F46E5',       // Indigo 600
  primaryLight: '#818CF8',  // Indigo 400
  primaryDark: '#3730A3',   // Indigo 800
  secondary: '#0EA5E9',     // Sky 500
  accent: '#10B981',        // Emerald 500

  // ── Backgrounds ──────────────────────────────────────────────────────────
  background: '#F8FAFC',    // Slate 50
  surface: '#FFFFFF',
  surfaceVariant: '#F1F5F9', // Slate 100
  card: '#FFFFFF',

  // ── Text ──────────────────────────────────────────────────────────────────
  onBackground: '#0F172A',  // Slate 900
  onSurface: '#1E293B',     // Slate 800
  onSurfaceVariant: '#64748B', // Slate 500
  textMuted: '#94A3B8',     // Slate 400
  onPrimary: '#FFFFFF',

  // ── Borders ───────────────────────────────────────────────────────────────
  border: '#E2E8F0',        // Slate 200
  borderFocus: '#4F46E5',

  // ── Status ─────────────────────────────────────────────────────────────────
  success: '#10B981',       // Emerald 500
  warning: '#F59E0B',       // Amber 500
  error: '#EF4444',         // Red 500
  info: '#3B82F6',          // Blue 500

  // ── Gradient stops ────────────────────────────────────────────────────────
  gradientStart: '#4F46E5',
  gradientEnd: '#7C3AED',   // Violet 600

  // ── Overlay ───────────────────────────────────────────────────────────────
  overlay: 'rgba(0, 0, 0, 0.4)',
  ripple: 'rgba(79, 70, 229, 0.12)',
};

// ── AppTheme Interface ────────────────────────────────────────────────────────
// Declare the shape using string-typed color fields (not literal types) so
// darkTheme can supply different hex values without type errors.

export interface AppThemeCustom {
  colors: AppColors;
  spacing: typeof spacing;
  typography: typeof typography;
  borderRadius: typeof borderRadius;
  elevation: typeof elevation;
  duration: typeof duration;
}

export interface AppTheme {
  dark: boolean;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    surfaceVariant: string;
    onBackground: string;
    onSurface: string;
    onSurfaceVariant: string;
    error: string;
    onPrimary: string;
    // React Native Paper MD3 theme colors (non-string values allowed)
    [key: string]: unknown;
  };
  custom: AppThemeCustom;
  // Allow React Native Paper's remaining keys
  [key: string]: unknown;
}

/**
 * Complete light theme object passed to React Native Paper's `PaperProvider`.
 */
const lightTheme: AppTheme = {
  ...MD3LightTheme,
  dark: false,
  colors: {
    ...MD3LightTheme.colors,
    primary: lightColors.primary,
    secondary: lightColors.secondary,
    background: lightColors.background,
    surface: lightColors.surface,
    surfaceVariant: lightColors.surfaceVariant,
    onBackground: lightColors.onBackground,
    onSurface: lightColors.onSurface,
    onSurfaceVariant: lightColors.onSurfaceVariant,
    error: lightColors.error,
    onPrimary: lightColors.onPrimary,
  },
  // Custom extension — available via useAppTheme() hook
  custom: {
    colors: lightColors,
    spacing,
    typography,
    borderRadius,
    elevation,
    duration,
  },
};

export { lightColors };
export default lightTheme;
