/**
 * @file src/constants/routes.ts
 * @description Centralised route name constants for React Navigation.
 * Phase 4: Added AR_STATUS.
 * Phase 5A: Added AR_DIAGNOSTICS.
 * Phase 5B.1: Added SCAN_SESSION.
 * Phase 5C.3: Added PLANE_DIAGNOSTICS.
 * Phase 5C.4: Added WALKTHROUGH.
 * UX Redesign: Added DEVELOPER_OPTIONS.
 * Phase 5C.5: Added UNIFIED_SCAN.
 * Phase 5C.6: Added COVERAGE_DIAGNOSTICS.
 * Phase 5C.7: Added SCAN_VALIDATION.
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
  AR_DIAGNOSTICS: 'ARDiagnostics',
  PLANE_DIAGNOSTICS: 'PlaneDiagnostics',
  SCAN_SESSION: 'ScanSession',
  WALKTHROUGH: 'Walkthrough',
  UNIFIED_SCAN: 'UnifiedScan',
  COVERAGE_DIAGNOSTICS: 'CoverageDiagnostics',
  SCAN_VALIDATION: 'ScanValidation',
  DEVELOPER_OPTIONS: 'DeveloperOptions',
  SETTINGS: 'Settings',
  ABOUT: 'About',
} as const;
