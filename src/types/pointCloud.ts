/**
 * @file src/types/pointCloud.ts
 * @description Raw Point Cloud Capture Engine TypeScript types and interfaces.
 *
 * Covers:
 *  - Point Cloud Frame Statuses ('CAPTURED' | 'EMPTY_SKIPPED' | 'TRACKING_LOST_SKIPPED' | 'INVALID_POSE')
 *  - Point Cloud Frame Data Model
 *  - Real-time Point Cloud Performance & Memory Statistics
 */

import type { Vector3D, ARCameraPose, ARTrackingQuality } from './ar';
import type { ARNativeTrackingState } from './arNative';

/**
 * Status outcome of a raw point cloud frame capture attempt.
 */
export type PointCloudFrameStatus =
  | 'CAPTURED'
  | 'EMPTY_SKIPPED'
  | 'TRACKING_LOST_SKIPPED'
  | 'INVALID_POSE';

/**
 * Single raw 3D Point Cloud frame captured per AR frame cycle.
 */
export interface PointCloudFrame {
  /** Unique frame identifier (e.g. `frame_1785688000_102`). */
  frameId: string;
  /** Associated scan session ID. */
  sessionId: string;
  /** Associated parent Scan Point ID. */
  scanPointId: string;
  /** ISO 8601 capture timestamp. */
  timestamp: string;
  /** Number of 3D feature points in this frame. */
  pointCount: number;
  /** Array of raw 3D spatial vertex coordinates $(X,Y,Z)$ in meters relative to world origin. */
  rawCoordinates: Vector3D[];
  /** Array of point confidence scores (0.0 to 1.0) if available. */
  confidenceScores: number[];
  /** Camera pose matrix snapshot at frame capture. */
  cameraPose: ARCameraPose;
  /** AR Native tracking state. */
  trackingState: ARNativeTrackingState;
  /** Tracking quality level. */
  trackingQuality: ARTrackingQuality;
  /** Frame capture status outcome. */
  frameStatus: PointCloudFrameStatus;
}

/**
 * Real-time point cloud performance & memory telemetry statistics.
 */
export interface PointCloudStats {
  /** Total point cloud frames captured in session. */
  totalFrames: number;
  /** Total cumulative 3D feature points stored across all frames. */
  totalPoints: number;
  /** Average number of 3D points per frame. */
  avgPointsPerFrame: number;
  /** Estimated memory consumption in Megabytes (MB). */
  estimatedMemoryMB: number;
  /** Most recent frame number processed. */
  currentFrameNumber: number;
  /** Number of points in most recent frame. */
  currentPointCount: number;
}
