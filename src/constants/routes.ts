/**
 * @file src/constants/routes.ts
 * @description Centralised route name constants for React Navigation.
 *
 * Using string constants (instead of magic strings) prevents typos and
 * enables IDE auto-complete across the codebase.
 */

/**
 * Root stack route names.
 */
export const ROOT_ROUTES = {
  SPLASH: 'Splash',
  MAIN: 'Main',
} as const;

/**
 * Main stack route names.
 */
export const MAIN_ROUTES = {
  HOME: 'Home',
  BUILDINGS: 'Buildings',
  CREATE_BUILDING: 'CreateBuilding',
  SETTINGS: 'Settings',
  ABOUT: 'About',
} as const;
