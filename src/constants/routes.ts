/**
 * @file src/constants/routes.ts
 * @description Centralised route name constants for React Navigation.
 * Phase 4: Added AR_STATUS.
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
  CAMERA: 'Camera',
  AR_STATUS: 'ARStatus',
  SETTINGS: 'Settings',
  ABOUT: 'About',
} as const;
