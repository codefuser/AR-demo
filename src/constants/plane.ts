/**
 * @file src/constants/plane.ts
 * @description Constants and default thresholds for Real Plane Detection Engine.
 */

/** Minimum surface area threshold in square meters (0.15 m²) to consider a plane valid */
export const MIN_PLANE_AREA_M2 = 0.15;

/** Default diagnostic messages */
export const PLANE_MESSAGES = {
  PLANE_DETECTED: 'Physical surface plane detected.',
  PLANE_UPDATED: 'Plane boundary polygon updated.',
  PLANE_SUBSUMED: 'Plane merged into parent surface.',
  PLANE_REMOVED: 'Plane tracking lost or surface removed.',
} as const;
