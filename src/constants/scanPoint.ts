/**
 * @file src/constants/scanPoint.ts
 * @description Scan Point Capture Engine default thresholds, rules, and diagnostic messages.
 */

import type { ScanPointCaptureRules } from '../types/scanPoint';

/**
 * Default automatic capture rules configuration.
 *  - Trigger capture when user walks 1.0m
 *  - OR camera rotation changes by 25 degrees
 *  - OR 2.5 seconds elapse
 *  - Filter duplicates within 0.3m radius
 */
export const DEFAULT_CAPTURE_RULES: ScanPointCaptureRules = {
  minDistanceMeters: 1.0,
  minRotationDegrees: 25.0,
  maxIntervalMs: 2500,
  duplicateThresholdMeters: 0.3,
};

/**
 * Human-readable diagnostic messages for scan point capture engine.
 */
export const SCAN_POINT_MESSAGES = {
  CAPTURED: 'Scan Point captured successfully.',
  DUPLICATE_SKIPPED: 'Position within 0.3m radius — duplicate capture skipped.',
  TRACKING_LOST: 'AR tracking lost — scan point capture suspended.',
  INVALID_POSE: 'Camera pose coordinates invalid — capture skipped.',
} as const;
