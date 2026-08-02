/**
 * @file src/hooks/useAppTheme.ts
 * @description Custom hook that resolves the current theme object based on
 *              the active color scheme stored in the global app store.
 *
 * Usage:
 *   const { theme, colorScheme, isDark } = useAppTheme();
 *   const { colors, spacing } = theme.custom;
 */

import { useMemo } from 'react';
import { lightTheme, darkTheme } from '../theme';
import type { AppTheme } from '../theme';
import useAppStore from '../store/useAppStore';

export interface UseAppThemeReturn {
  /** Full theme object (React Native Paper + custom tokens). */
  theme: AppTheme;
  /** 'light' | 'dark' */
  colorScheme: 'light' | 'dark';
  /** Convenience flag — true when dark mode is active. */
  isDark: boolean;
}

/**
 * Resolves the active theme and exposes convenience properties.
 *
 * @example
 * const { theme, isDark } = useAppTheme();
 * const bg = theme.custom.colors.background;
 */
export function useAppTheme(): UseAppThemeReturn {
  const colorScheme = useAppStore((s) => s.colorScheme);

  const theme: AppTheme = useMemo(
    () => (colorScheme === 'dark' ? darkTheme : lightTheme),
    [colorScheme],
  );

  return {
    theme,
    colorScheme,
    isDark: colorScheme === 'dark',
  };
}

export default useAppTheme;
