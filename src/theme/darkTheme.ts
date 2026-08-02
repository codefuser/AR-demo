/**
 * @file src/theme/darkTheme.ts
 * @description Dark color theme definition.
 *
 * Mirrors the structure of lightTheme.ts but uses darker surface colors
 * and adjusted brand tones for WCAG AA contrast compliance.
 */

import { MD3DarkTheme } from 'react-native-paper';
import { spacing, typography, borderRadius, elevation, duration } from './tokens';
import type { AppTheme, AppColors } from './lightTheme';

/**
 * Application-specific color palette for the dark theme.
 */
const darkColors: AppColors = {
  // ── Brand ────────────────────────────────────────────────────────────────
  primary: '#818CF8',       // Indigo 400 — lighter for dark bg contrast
  primaryLight: '#A5B4FC',  // Indigo 300
  primaryDark: '#4F46E5',   // Indigo 600
  secondary: '#38BDF8',     // Sky 400
  accent: '#34D399',        // Emerald 400

  // ── Backgrounds ──────────────────────────────────────────────────────────
  background: '#0F172A',    // Slate 900
  surface: '#1E293B',       // Slate 800
  surfaceVariant: '#334155', // Slate 700
  card: '#1E293B',

  // ── Text ──────────────────────────────────────────────────────────────────
  onBackground: '#F1F5F9',  // Slate 100
  onSurface: '#E2E8F0',     // Slate 200
  onSurfaceVariant: '#94A3B8', // Slate 400
  textMuted: '#64748B',     // Slate 500
  onPrimary: '#0F172A',

  // ── Borders ───────────────────────────────────────────────────────────────
  border: '#334155',        // Slate 700
  borderFocus: '#818CF8',

  // ── Status ─────────────────────────────────────────────────────────────────
  success: '#34D399',       // Emerald 400
  warning: '#FBBF24',       // Amber 400
  error: '#F87171',         // Red 400
  info: '#60A5FA',          // Blue 400

  // ── Gradient stops ────────────────────────────────────────────────────────
  gradientStart: '#4F46E5',
  gradientEnd: '#7C3AED',

  // ── Overlay ───────────────────────────────────────────────────────────────
  overlay: 'rgba(0, 0, 0, 0.6)',
  ripple: 'rgba(129, 140, 248, 0.16)',
};

/**
 * Complete dark theme object passed to React Native Paper's `PaperProvider`.
 */
const darkTheme: AppTheme = {
  ...MD3DarkTheme,
  dark: true,
  colors: {
    ...MD3DarkTheme.colors,
    primary: darkColors.primary,
    secondary: darkColors.secondary,
    background: darkColors.background,
    surface: darkColors.surface,
    surfaceVariant: darkColors.surfaceVariant,
    onBackground: darkColors.onBackground,
    onSurface: darkColors.onSurface,
    onSurfaceVariant: darkColors.onSurfaceVariant,
    error: darkColors.error,
    onPrimary: darkColors.onPrimary,
  },
  custom: {
    colors: darkColors,
    spacing,
    typography,
    borderRadius,
    elevation,
    duration,
  },
};

export { darkColors };
export default darkTheme;
