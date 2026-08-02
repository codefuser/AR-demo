/**
 * @file src/constants/strings.ts
 * @description Centralised UI string constants for the application.
 *
 * All user-visible text should live here so the application can be
 * easily localised in a future phase.
 */

export const APP_STRINGS = {
  // ── App Identity ──────────────────────────────────────────────────────────
  APP_NAME: 'AR Indoor Nav',
  APP_SUBTITLE: 'Indoor Navigation & 3D Building Mapping',
  APP_VERSION: '1.0.0 (Phase 1)',

  // ── Home Screen ───────────────────────────────────────────────────────────
  HOME_TAGLINE: 'Navigate smarter, indoors.',
  HOME_BTN_CREATE_BUILDING: 'Create Building',
  HOME_BTN_BUILDINGS: 'My Buildings',
  HOME_BTN_SETTINGS: 'Settings',
  HOME_BTN_ABOUT: 'About',

  // ── Buildings Screen ──────────────────────────────────────────────────────
  BUILDINGS_TITLE: 'My Buildings',
  BUILDINGS_EMPTY_TITLE: 'No Buildings Yet',
  BUILDINGS_EMPTY_MESSAGE:
    'Tap "Create Building" on the home screen to add your first building.',

  // ── Create Building Screen ─────────────────────────────────────────────────
  CREATE_BUILDING_TITLE: 'Create Building',
  CREATE_BUILDING_NAME_LABEL: 'Building Name',
  CREATE_BUILDING_NAME_PLACEHOLDER: 'e.g. Engineering Block A',
  CREATE_BUILDING_DESC_LABEL: 'Description (optional)',
  CREATE_BUILDING_DESC_PLACEHOLDER: 'e.g. Main campus, ground floor',
  CREATE_BUILDING_FLOOR_LABEL: 'Number of Floors',
  CREATE_BUILDING_SUBMIT: 'Save Building',

  // ── Settings Screen ───────────────────────────────────────────────────────
  SETTINGS_TITLE: 'Settings',
  SETTINGS_APPEARANCE: 'Appearance',
  SETTINGS_DARK_MODE: 'Dark Mode',
  SETTINGS_DARK_MODE_SUBTITLE: 'Switch between light and dark themes',

  // ── About Screen ──────────────────────────────────────────────────────────
  ABOUT_TITLE: 'About',
  ABOUT_PROJECT_TITLE: 'AR Indoor Navigation',
  ABOUT_PROJECT_SUBTITLE: '3D Building Mapping System',
  ABOUT_DESCRIPTION:
    'A final-year engineering project that enables administrators to create indoor building maps and allows users to navigate using augmented reality.',
  ABOUT_PHASE_LABEL: 'Current Phase',
  ABOUT_PHASE_VALUE: 'Phase 1 — Foundation',
  ABOUT_TECH_LABEL: 'Technology Stack',
  ABOUT_TECH_VALUE:
    'React Native • Expo SDK 57 • TypeScript • React Navigation • Zustand',

  // ── Common ─────────────────────────────────────────────────────────────────
  COMMON_BACK: 'Back',
  COMMON_CANCEL: 'Cancel',
  COMMON_SAVE: 'Save',
  COMMON_COMING_SOON: 'Coming Soon',
  COMMON_COMING_SOON_MESSAGE:
    'This feature will be available in a future phase.',
} as const;
