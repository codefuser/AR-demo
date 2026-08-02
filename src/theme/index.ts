/**
 * @file src/theme/index.ts
 * @description Theme barrel export.
 *
 * Consumers import from '@/theme' to access themes, tokens, and helpers.
 *
 * Usage:
 *   import { lightTheme, darkTheme, useAppTheme } from '@/theme';
 */

export { default as lightTheme } from './lightTheme';
export { default as darkTheme } from './darkTheme';
export { lightColors } from './lightTheme';
export { darkColors } from './darkTheme';
export * from './tokens';
export type { AppTheme, AppColors, AppThemeCustom } from './lightTheme';
