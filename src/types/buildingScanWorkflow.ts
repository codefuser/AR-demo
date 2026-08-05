/**
 * @file src/types/buildingScanWorkflow.ts
 * @description Unified Building Scan Workflow Engine TypeScript types and interfaces.
 */

import type { ARTrackingQuality } from './ar';
import type { ARNativeTrackingState } from './arNative';
import type { MovementType, WalkingQuality } from './walkthrough';

/**
 * Scan workflow state machine states.
 */
export type BuildingScanWorkflowState =
  | 'IDLE'
  | 'PREPARING'
  | 'CHECKING_PERMISSIONS'
  | 'INITIALIZING_CAMERA'
  | 'INITIALIZING_ARCORE'
  | 'READY'
  | 'SCANNING'
  | 'PAUSED'
  | 'RECOVERING'
  | 'PREVIEW'
  | 'SAVING'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'FAILED';

/**
 * Completed or preview scan summary record.
 */
export interface BuildingScanWorkflowSummary {
  /** Unique session ID. */
  sessionId: string;
  /** Building ID. */
  buildingId: string;
  /** Building Name. */
  buildingName: string;
  /** Floor number. */
  floor: number;
  /** Total scan duration in seconds. */
  durationSeconds: number;
  /** Estimated spatial coverage percentage (0% - 100%). */
  coverageEstimatePct: number;
  /** Total 3D point cloud feature vertices captured. */
  pointCount: number;
  /** Total physical planes detected (floors & walls). */
  planeCount: number;
  /** Number of spatial scan points captured. */
  scanPointCount: number;
  /** Distance walked in meters. */
  distanceWalkedMeters: number;
  /** Overall tracking quality summary. */
  trackingQualitySummary: ARTrackingQuality;
  /** ISO string of timestamp when scan was finished. */
  timestamp: string;
}

/**
 * Pre-scan readiness validation checks result.
 */
export interface BuildingScanPreValidationResult {
  cameraPermissionGranted: boolean;
  arCoreAvailable: boolean;
  deviceSupported: boolean;
  buildingSelected: boolean;
  storageAvailable: boolean;
  batteryLevelPct: number;
  canStart: boolean;
  blockingMessage?: string;
}

/**
 * Full active workflow state snapshot.
 */
export interface BuildingScanWorkflowSnapshot {
  sessionId: string;
  buildingId: string;
  buildingName: string;
  floor: number;
  state: BuildingScanWorkflowState;
  progressPct: number;
  coverageEstimatePct: number;
  scanHealthScore: number;
  trackingState: ARNativeTrackingState;
  trackingQuality: ARTrackingQuality;
  movementType: MovementType;
  walkingQuality: WalkingQuality;
  guidanceMessage: string;
  detectedPlaneCount: number;
  pointCloudCount: number;
  scanPointCount: number;
  speedMps: number;
  elapsedTimeSeconds: number;
  distanceWalkedMeters: number;
  summary: BuildingScanWorkflowSummary | null;
  errorMessage?: string;
}
