/**
 * @file src/types/arNative.ts
 * @description Native AR Session Foundation TypeScript types and interfaces.
 *
 * Covers:
 *  - Plane Detection (Horizontal, Vertical, Extents, Polygon Points)
 *  - Anchor Management (ID, Pose, State, Lifetime)
 *  - Native Session State & Lifecycle
 *  - Device & AR System Diagnostics
 */

import type { Vector3D, Quaternion, EulerAngles, ARTrackingQuality } from './ar';

/**
 * Orientation / alignment type of detected physical plane.
 */
export type ARPlaneType = 'HORIZONTAL_UPWARD_FACING' | 'HORIZONTAL_DOWNWARD_FACING' | 'VERTICAL';

/**
 * Tracking state of a detected plane or anchor.
 */
export type ARNativeTrackingState = 'TRACKING' | 'PAUSED' | 'STOPPED';

/**
 * Detected physical surface / plane metadata.
 */
export interface ARPlane {
  /** Unique plane identifier. */
  id: string;
  /** Alignment type (Horizontal floor/table vs Vertical wall). */
  planeType: ARPlaneType;
  /** Center coordinate in meters $(X,Y,Z)$ relative to world origin. */
  center: Vector3D;
  /** Extent/width along local X axis in meters. */
  extentX: number;
  /** Extent/height along local Z axis in meters. */
  extentZ: number;
  /** Estimated plane surface area in square meters $(m^2)$. */
  surfaceAreaM2: number;
  /** Plane tracking state. */
  trackingState: ARNativeTrackingState;
  /** Boundary polygon vertices in 3D space. */
  polygonPoints: Vector3D[];
  /** Timestamp when plane was first detected. */
  createdAt: string;
  /** Timestamp of last update. */
  updatedAt: string;
}

/**
 * Spatial anchor pinned to physical coordinates.
 */
export interface ARAnchor {
  /** Unique spatial anchor identifier. */
  id: string;
  /** Label / name of anchor (e.g., 'TestAnchor_1'). */
  name: string;
  /** 3D spatial position $(X,Y,Z)$ in meters. */
  position: Vector3D;
  /** 4D rotation quaternion. */
  quaternion: Quaternion;
  /** Orientation Euler angles. */
  rotation: EulerAngles;
  /** Anchor tracking state. */
  trackingState: ARNativeTrackingState;
  /** Active lifetime duration in seconds. */
  lifetimeSeconds: number;
  /** Timestamp when anchor was created. */
  createdAt: string;
}

/**
 * Native AR Session state lifecycle states.
 */
export type ARNativeSessionStatus =
  | 'UNINITIALIZED'
  | 'INITIALIZING'
  | 'TRACKING'
  | 'PAUSED'
  | 'STOPPED'
  | 'ERROR'
  | 'RECOVERING';

/**
 * Hardware and AR system compatibility diagnostic status.
 */
export interface ARSystemDiagnostics {
  /** Overall native AR support flag. */
  isARSupported: boolean;
  /** Google ARCore / Apple ARKit installed status. */
  arServicesInstalled: boolean;
  /** ARCore / ARKit framework version string. */
  arServicesVersion: string;
  /** Camera hardware availability. */
  cameraAvailable: boolean;
  /** Camera permission status. */
  cameraPermissionGranted: boolean;
  /** Motion sensors (IMU) availability. */
  sensorsAvailable: boolean;
  /** Diagnostic human-readable message. */
  diagnosticMessage: string;
}

/**
 * Native AR Session configuration options.
 */
export interface ARNativeSessionConfig {
  /** Enable horizontal plane detection. */
  detectHorizontalPlanes: boolean;
  /** Enable vertical plane detection. */
  detectVerticalPlanes: boolean;
  /** Auto-recalibrate world origin on session start. */
  autoResetOrigin: boolean;
  /** Target frame rate (e.g., 60 FPS). */
  targetFPS: number;
}
