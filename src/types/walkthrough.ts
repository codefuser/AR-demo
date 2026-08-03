/**
 * @file src/types/walkthrough.ts
 * @description Building Walkthrough Engine TypeScript types and interfaces.
 *
 * Covers:
 *  - Walkthrough Session States
 *  - Real-time Movement Analysis Classification
 *  - Walking Quality Evaluation Ratings
 *  - Walkthrough Session Model & Telemetry Metrics
 */

import type { Vector3D, ARTrackingQuality } from './ar';
import type { ARNativeTrackingState } from './arNative';

/**
 * Walkthrough lifecycle state machine states.
 */
export type WalkthroughStatus =
  | 'IDLE'
  | 'PREPARING'
  | 'READY'
  | 'WALKING'
  | 'PAUSED'
  | 'TRACKING_LOST'
  | 'RECOVERING'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'FAILED';

/**
 * Real-time movement classification based on linear velocity & heading angle delta.
 */
export type MovementType =
  | 'STATIONARY'
  | 'WALKING'
  | 'STANDING'
  | 'TURNING_LEFT'
  | 'TURNING_RIGHT'
  | 'MOVING_BACKWARD'
  | 'FAST_MOVEMENT'
  | 'SLOW_MOVEMENT';

/**
 * Real-time walking quality rating.
 */
export type WalkingQuality =
  | 'OPTIMAL'
  | 'TOO_FAST'
  | 'TOO_SLOW'
  | 'CAMERA_SHAKING'
  | 'LOW_LIGHT'
  | 'TRACKING_LOST'
  | 'POOR_POINT_CLOUD'
  | 'LOW_PLANE_DETECTION';

/**
 * Cardinal compass bearing directions.
 */
export type CardinalDirection = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';

/**
 * Active Building Walkthrough Session model.
 */
export interface WalkthroughSession {
  /** Unique session ID (e.g. `wt_session_1785688000_1`). */
  sessionId: string;
  /** ID of building being scanned. */
  buildingId: string;
  /** Human-readable building name. */
  buildingName: string;
  /** Current floor level being walked. */
  currentFloor: number;
  /** Session start ISO timestamp. */
  startedAt: string;
  /** Session end ISO timestamp (if completed/cancelled). */
  finishedAt?: string;
  /** Walkthrough lifecycle state. */
  status: WalkthroughStatus;
  /** Real-time movement type classification. */
  movementType: MovementType;
  /** Linear speed in meters per second (m/s). */
  speedMps: number;
  /** Compass heading angle in degrees (0° - 360°). */
  headingDegrees: number;
  /** Cardinal compass direction ('N', 'NE', 'E', etc.). */
  cardinalDirection: CardinalDirection;
  /** Current camera position $(X,Y,Z)$ in meters. */
  cameraPosition: Vector3D;
  /** Real-time walking quality rating. */
  walkingQuality: WalkingQuality;
  /** Live user guidance instruction prompt. */
  guidanceMessage: string;
  /** Active AR native tracking state. */
  trackingState: ARNativeTrackingState;
  /** Visual tracking quality level. */
  trackingQuality: ARTrackingQuality;
  /** Number of detected physical planes. */
  detectedPlaneCount: number;
  /** Total cumulative 3D point cloud feature vertices. */
  pointCloudCount: number;
  /** Number of captured spatial scan points. */
  scanPointCount: number;
  /** Session elapsed time in seconds. */
  elapsedTimeSeconds: number;
  /** Total distance walked in meters. */
  distanceWalkedMeters: number;
  /** Estimated spatial coverage percentage (0% - 100%). */
  coverageEstimatePct: number;
}

/**
 * Pre-walkthrough readiness validation result.
 */
export interface WalkthroughValidationResult {
  hasValidBuilding: boolean;
  isARSessionReady: boolean;
  isCameraAvailable: boolean;
  isDeviceSupported: boolean;
  canStartWalkthrough: boolean;
  blockingMessage?: string;
}
