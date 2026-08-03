/**
 * @file src/types/scanSession.ts
 * @description Building Scan Session Engine TypeScript types and interfaces.
 *
 * Covers:
 *  - Scan Session Statuses ('CREATED' | 'READY' | 'SCANNING' | 'PAUSED' | 'RESUMED' | 'COMPLETED' | 'CANCELLED' | 'FAILED')
 *  - Scan Stages ('INITIALIZING' | 'ANCHORING_ORIGIN' | 'SCANNING_CORRIDORS' | 'SCANNING_ROOMS' | 'FINALIZING_MESH' | 'COMPLETED')
 *  - Scan Session Data Model
 *  - Scan Validation Checklist
 */

import type { ARTrackingQuality } from './ar';
import type { ARSystemDiagnostics } from './arNative';

/**
 * Scan session lifecycle statuses.
 */
export type ScanSessionStatus =
  | 'CREATED'
  | 'READY'
  | 'SCANNING'
  | 'PAUSED'
  | 'RESUMED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'FAILED';

/**
 * Workflow stages during an indoor building scan.
 */
export type ScanSessionStage =
  | 'INITIALIZING'
  | 'ANCHORING_ORIGIN'
  | 'SCANNING_CORRIDORS'
  | 'SCANNING_ROOMS'
  | 'FINALIZING_MESH'
  | 'COMPLETED';

/**
 * Building Scan Session Model.
 */
export interface ScanSession {
  /** Unique session identifier (e.g. `scan_1785688000_a8f9`). */
  sessionId: string;
  /** Associated building ID. */
  buildingId: string;
  /** Building human-readable name. */
  buildingName: string;
  /** Target floor number being scanned (e.g. Floor 1). */
  currentFloor: number;
  /** ISO 8601 creation timestamp. */
  createdDate: string;
  /** ISO 8601 start timestamp (null if not started). */
  startedDate: string | null;
  /** ISO 8601 completion/finish timestamp (null if active). */
  finishedDate: string | null;
  /** Current session status. */
  currentStatus: ScanSessionStatus;
  /** Current workflow stage. */
  currentStage: ScanSessionStage;
  /** Scan progress percentage (0 - 100%). */
  progressPercentage: number;
  /** Active scan elapsed time in seconds. */
  elapsedTimeSeconds: number;
  /** Estimated remaining time in seconds. */
  estimatedRemainingTimeSeconds: number;
  /** Current number of spatial scan points registered. */
  currentScanPointCount: number;
  /** Target total scan points for floor coverage. */
  totalScanPoints: number;
  /** Current AR tracking quality level. */
  trackingQuality: ARTrackingQuality;
  /** System device compatibility snapshot. */
  deviceCompatibility: ARSystemDiagnostics | null;
  /** Optional session notes or administrator comments. */
  sessionNotes?: string;
  /** Error message if status is FAILED. */
  errorMessage?: string;
}

/**
 * Pre-scan validation readiness checklist.
 */
export interface ScanSessionValidation {
  /** Building exists and is selected. */
  isBuildingValid: boolean;
  /** Camera permission is granted. */
  isCameraPermissionGranted: boolean;
  /** AR Engine is initialized and ready. */
  isARReady: boolean;
  /** Device meets hardware requirements. */
  isDeviceCompatible: boolean;
  /** Overall readiness flag to allow starting scan. */
  canStartScan: boolean;
  /** Human-readable status message. */
  message: string;
}
