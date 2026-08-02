/**
 * @file src/constants/routes.ts
 * @description Centralised route name constants for React Navigation.
 * Phase 2: Added BUILDING_DETAILS.
 */

/** Root stack route names. */
export const ROOT_ROUTES = {
  SPLASH: 'Splash',
  MAIN: 'Main',
} as const;

/** Main stack route names. */
export const MAIN_ROUTES = {
  HOME: 'Home',
  BUILDINGS: 'Buildings',
  CREATE_BUILDING: 'CreateBuilding',
  BUILDING_DETAILS: 'BuildingDetails',
  SETTINGS: 'Settings',
  ABOUT: 'About',
} as const;
