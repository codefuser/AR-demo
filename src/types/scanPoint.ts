/**
 * @file src/types/scanPoint.ts
 * @description Scan Point Capture Engine TypeScript types and interfaces.
 *
 * Covers:
 *  - Scan Point Data Model
 *  - Capture Statuses ('CAPTURED' | 'DUPLICATE_FILTERED' | 'TRACKING_LOST_SKIPPED' | 'INVALID_POSE')
 *  - Trigger Rule Thresholds Configuration
 *  - Telemetry Snapshot
 */

import type { Vector3D, Quaternion, EulerAngles, ARTrackingQuality } from './ar';
import type { ARNativeTrackingState } from './arNative';

/**
 * Status of a scan point capture attempt.
 */
export type ScanPointCaptureStatus =
  | 'CAPTURED'
  | 'DUPLICATE_FILTERED'
  | 'TRACKING_LOST_SKIPPED'
  | 'INVALID_POSE';

/**
 * Individual Scan Point telemetry record captured during an indoor building walk.
 */
export interface ScanPoint {
  /** Unique scan point identifier (e.g. `pt_1785688000_1`). */
  pointId: string;
  /** Associated scan session ID. */
  sessionId: string;
  /** ISO 8601 capture timestamp. */
  timestamp: string;
  /** Floor number being scanned. */
  floor: number;
  /** 3D Camera Position $(X,Y,Z)$ in meters relative to world origin. */
  cameraPosition: Vector3D;
  /** Camera Rotation Euler angles (Pitch, Roll, Yaw) in degrees. */
  cameraRotation: EulerAngles;
  /** Camera Rotation 4D Quaternion. */
  quaternion: Quaternion;
  /** AR Native Tracking State ('TRACKING' | 'PAUSED' | 'STOPPED'). */
  trackingState: ARNativeTrackingState;
  /** AR Tracking Quality level ('EXCELLENT' | 'GOOD' | 'LIMITED' | 'POOR'). */
  trackingQuality: ARTrackingQuality;
  /** Number of physical surfaces / planes detected at time of capture. */
  detectedPlaneCount: number;
  /** Number of active spatial anchors at time of capture. */
  anchorCount: number;
  /** Frame sequence number. */
  frameNumber: number;
  /** Device UI orientation ('PORTRAIT' | 'LANDSCAPE'). */
  deviceOrientation: 'PORTRAIT' | 'LANDSCAPE';
  /** Number of visual SLAM feature points captured in frame. */
  featurePointCount: number;
  /** Capture status outcome. */
  captureStatus: ScanPointCaptureStatus;
}

/**
 * Configuration thresholds driving automatic scan point capture.
 */
export interface ScanPointCaptureRules {
  /** Distance movement threshold in meters to trigger capture (e.g. 1.0m). */
  minDistanceMeters: number;
  /** Rotation angle delta threshold in degrees to trigger capture (e.g. 25°). */
  minRotationDegrees: number;
  /** Maximum time interval in milliseconds between captures (e.g. 2500ms). */
  maxIntervalMs: number;
  /** Minimum distance threshold in meters to reject duplicate captures (e.g. 0.3m). */
  duplicateThresholdMeters: number;
}
