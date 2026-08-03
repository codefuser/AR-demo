/**
 * @file src/constants/scanSession.ts
 * @description Building Scan Session Engine constants, default targets, and diagnostic messages.
 */

/**
 * Default total scan point targets per floor area.
 */
export const DEFAULT_SCAN_POINT_TARGET = 1500;

/**
 * Scan stage labels for UI rendering.
 */
export const SCAN_STAGE_LABELS = {
  INITIALIZING: 'Initializing AR Session & Hardware',
  ANCHORING_ORIGIN: 'Anchoring Building World Origin (0,0,0)',
  SCANNING_CORRIDORS: 'Scanning Corridors & Main Passageways',
  SCANNING_ROOMS: 'Scanning Room Boundaries & Entrances',
  FINALIZING_MESH: 'Finalizing 3D Spatial Geometry',
  COMPLETED: 'Scan Session Completed',
} as const;

/**
 * Diagnostic error and validation messages.
 */
export const SCAN_SESSION_MESSAGES = {
  READY_TO_SCAN: 'All system checks passed. Ready to start building scan.',
  MISSING_BUILDING: 'No valid building selected for scan session.',
  MISSING_CAMERA_PERMISSION: 'Camera permission is required before starting a scan session.',
  AR_NOT_READY: 'AR Engine is initializing or unavailable. Please wait.',
  UNSUPPORTED_DEVICE: 'Device hardware does not support spatial AR scanning.',
  SESSION_CANCELLED: 'Scan session was cancelled by administrator.',
  SESSION_FINISHED: 'Building scan session successfully finished.',
} as const;
