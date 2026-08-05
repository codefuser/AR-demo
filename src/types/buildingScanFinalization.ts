/**
 * @file src/types/buildingScanFinalization.ts
 * @description Building Scan Finalization Engine TypeScript types and interfaces.
 */

import type { ScanValidationOutcome, ScanValidationScores } from './scanValidation';
import type { ARTrackingQuality } from './ar';

/**
 * Finalization State Machine status.
 */
export type FinalizationState =
  | 'IDLE'
  | 'VALIDATING'
  | 'GENERATING_SUMMARY'
  | 'PERSISTING'
  | 'SUCCESS'
  | 'FAILED';

/**
 * Scan session metadata.
 */
export interface FinalScanMetadata {
  scanId: string;
  buildingId: string;
  sessionId: string;
  startTime: string;
  endTime: string;
  durationSeconds: number;
  scanVersion: string;
  appVersion: string;
  devicePlatform: string;
}

/**
 * Scan session statistics.
 */
export interface FinalScanStatistics {
  coveragePct: number;
  coverageConfidencePct: number;
  validationScore: number;
  validationResult: ScanValidationOutcome;
  trackingQuality: ARTrackingQuality;
  avgPointDensity: number;
  planeCount: number;
  visitedCellCount: number;
  distanceWalkedMeters: number;
  scores: ScanValidationScores;
}

/**
 * Structured spatial & sensor reference IDs (NO raw binary buffers).
 */
export interface FinalScanReferences {
  spatialCellIds: string[];
  planeReferenceIds: string[];
  pointCloudSessionId: string;
  walkthroughSessionId: string;
}

/**
 * Master persisted scan summary record.
 */
export interface FinalScanSummaryRecord {
  scanId: string;
  buildingId: string;
  buildingName: string;
  metadata: FinalScanMetadata;
  statistics: FinalScanStatistics;
  references: FinalScanReferences;
  warnings: string[];
  recommendations: string[];
  executiveSummary: string;
  technicalSummary: string;
  finalizedAt: string;
}
