/**
 * @file src/constants/strings.ts
 * @description Centralised UI string constants.
 * Phase 2: Added Building Management strings.
 */

export const APP_STRINGS = {
  // ── App Identity ───────────────────────────────────────────────────────────
  APP_NAME: 'AR Indoor Nav',
  APP_SUBTITLE: 'Indoor Navigation & 3D Building Mapping',
  APP_VERSION: '2.0.0 (Phase 2)',

  // ── Home Screen ────────────────────────────────────────────────────────────
  HOME_TAGLINE: 'Navigate smarter, indoors.',
  HOME_BTN_CREATE_BUILDING: 'Create Building',
  HOME_BTN_BUILDINGS: 'My Buildings',
  HOME_BTN_SETTINGS: 'Settings',
  HOME_BTN_ABOUT: 'About',

  // ── Buildings Screen ───────────────────────────────────────────────────────
  BUILDINGS_TITLE: 'My Buildings',
  BUILDINGS_SUBTITLE: 'Manage your indoor spaces',
  BUILDINGS_EMPTY_TITLE: 'No Buildings Found',
  BUILDINGS_EMPTY_MESSAGE:
    'Create your first building to get started with indoor navigation.',
  BUILDINGS_BTN_CREATE: 'Create Building',
  BUILDINGS_COUNT: (n: number) => `${n} building${n !== 1 ? 's' : ''}`,

  // ── Create Building Screen ─────────────────────────────────────────────────
  CREATE_BUILDING_TITLE: 'Create Building',
  CREATE_BUILDING_EDIT_TITLE: 'Edit Building',
  CREATE_BUILDING_SUBTITLE: 'Fill in your building details below',
  CREATE_BUILDING_NAME_LABEL: 'Building Name *',
  CREATE_BUILDING_NAME_PLACEHOLDER: 'e.g. Engineering Block A',
  CREATE_BUILDING_DESC_LABEL: 'Description',
  CREATE_BUILDING_DESC_PLACEHOLDER: 'Briefly describe this building…',
  CREATE_BUILDING_ADDRESS_LABEL: 'Address',
  CREATE_BUILDING_ADDRESS_PLACEHOLDER: 'e.g. 123 College Road, Chennai',
  CREATE_BUILDING_FLOOR_LABEL: 'Number of Floors *',
  CREATE_BUILDING_TYPE_LABEL: 'Building Type *',
  CREATE_BUILDING_THUMBNAIL_LABEL: 'Thumbnail Image',
  CREATE_BUILDING_THUMBNAIL_PLACEHOLDER: 'Tap to add image (Phase 3)',
  CREATE_BUILDING_SUBMIT: 'Save Building',
  CREATE_BUILDING_CANCEL: 'Cancel',

  // ── Building Types ─────────────────────────────────────────────────────────
  BUILDING_TYPE_COLLEGE: 'College',
  BUILDING_TYPE_SCHOOL: 'School',
  BUILDING_TYPE_MALL: 'Mall',
  BUILDING_TYPE_HOSPITAL: 'Hospital',
  BUILDING_TYPE_OFFICE: 'Office',
  BUILDING_TYPE_OTHER: 'Other',

  // ── Building Details Screen ────────────────────────────────────────────────
  BUILDING_DETAILS_TITLE: 'Building Details',
  BUILDING_DETAILS_INFO_SECTION: 'Building Information',
  BUILDING_DETAILS_STATUS_SECTION: 'Scan Status',
  BUILDING_DETAILS_ACTIONS_SECTION: 'Actions',
  BUILDING_DETAILS_BTN_SCAN: 'Start Scanning',
  BUILDING_DETAILS_BTN_SCAN_DISABLED: 'Scanning — Phase 3',
  BUILDING_DETAILS_BTN_EDIT: 'Edit Building',
  BUILDING_DETAILS_BTN_DELETE: 'Delete Building',
  BUILDING_DETAILS_DELETE_CONFIRM_TITLE: 'Delete Building',
  BUILDING_DETAILS_DELETE_CONFIRM_MSG: (name: string) =>
    `Are you sure you want to delete "${name}"? This action cannot be undone.`,
  BUILDING_DETAILS_DELETE_BTN: 'Delete',
  BUILDING_DETAILS_CANCEL: 'Cancel',
  BUILDING_DETAILS_ID_LABEL: 'Building ID',
  BUILDING_DETAILS_FLOORS_LABEL: 'Total Floors',
  BUILDING_DETAILS_TYPE_LABEL: 'Building Type',
  BUILDING_DETAILS_ADDRESS_LABEL: 'Address',
  BUILDING_DETAILS_CREATED_LABEL: 'Created On',
  BUILDING_DETAILS_UPDATED_LABEL: 'Last Updated',

  // ── Scan Status Labels ─────────────────────────────────────────────────────
  SCAN_STATUS_NOT_STARTED: 'Not Started',
  SCAN_STATUS_IN_PROGRESS: 'Scanning',
  SCAN_STATUS_COMPLETED: 'Completed',

  // ── Settings Screen ────────────────────────────────────────────────────────
  SETTINGS_TITLE: 'Settings',
  SETTINGS_APPEARANCE: 'Appearance',
  SETTINGS_DARK_MODE: 'Dark Mode',
  SETTINGS_DARK_MODE_SUBTITLE: 'Switch between light and dark themes',

  // ── About Screen ───────────────────────────────────────────────────────────
  ABOUT_TITLE: 'About',
  ABOUT_PROJECT_TITLE: 'AR Indoor Navigation',
  ABOUT_PROJECT_SUBTITLE: '3D Building Mapping System',
  ABOUT_DESCRIPTION:
    'A final-year engineering project that enables administrators to create indoor building maps and allows users to navigate using augmented reality.',
  ABOUT_PHASE_LABEL: 'Current Phase',
  ABOUT_PHASE_VALUE: 'Phase 2 — Building Management',
  ABOUT_TECH_LABEL: 'Technology Stack',
  ABOUT_TECH_VALUE:
    'React Native • Expo SDK 57 • TypeScript • React Navigation • Zustand',

  // ── Common ─────────────────────────────────────────────────────────────────
  COMMON_BACK: 'Back',
  COMMON_CANCEL: 'Cancel',
  COMMON_SAVE: 'Save',
  COMMON_DELETE: 'Delete',
  COMMON_EDIT: 'Edit',
  COMMON_COMING_SOON: 'Coming Soon',
  COMMON_COMING_SOON_MESSAGE:
    'This feature will be available in a future phase.',
  COMMON_NOT_AVAILABLE: 'N/A',
} as const;
