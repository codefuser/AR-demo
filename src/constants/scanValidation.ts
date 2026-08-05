/**
 * @file src/constants/scanValidation.ts
 * @description Default thresholds and outcome display styles for Intelligent Scan Validation Engine.
 */

import type { ScanValidationThresholds, ScanValidationOutcome } from '../types/scanValidation';

/** Default configurable validation thresholds */
export const DEFAULT_VALIDATION_THRESHOLDS: ScanValidationThresholds = {
  minCoveragePct: 70.0,
  minPointDensity: 15.0,
  minPlaneCount: 2,
  maxRedundantScanPct: 50.0,
  minWalkDistanceMeters: 10.0,
  minTrackingScore: 70.0,
};

/** Outcome titles and display labels */
export const OUTCOME_TITLES: Record<ScanValidationOutcome, string> = {
  PASS: 'SCAN PASSED',
  PASS_WITH_WARNINGS: 'PASSED WITH WARNINGS',
  INCOMPLETE: 'SCAN INCOMPLETE',
  FAILED: 'SCAN FAILED',
};
