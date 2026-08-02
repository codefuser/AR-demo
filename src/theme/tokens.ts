/**
 * @file src/theme/tokens.ts
 * @description Shared design tokens used by both light and dark themes.
 *
 * Design tokens are the atomic values (spacing, font sizes, radii, etc.)
 * that ensure visual consistency across the entire application.
 */

/**
 * Spacing scale (in dp) following an 8-point grid system.
 */
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

/**
 * Typography scale.
 */
export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    xxl: 30,
    display: 40,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
    extraBold: '800' as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

/**
 * Border radius scale.
 */
export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

/**
 * Elevation / shadow levels for Android and iOS.
 */
export const elevation = {
  none: 0,
  sm: 2,
  md: 4,
  lg: 8,
  xl: 16,
} as const;

/**
 * Animation / transition durations (ms).
 */
export const duration = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;
