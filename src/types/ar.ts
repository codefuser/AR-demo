/**
 * @file src/types/ar.ts
 * @description AR Foundation & Tracking Module TypeScript types and interfaces.
 */

/**
 * 3D spatial vector coordinate (meters).
 */
export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

/**
 * 2D spatial vector coordinate (meters).
 */
export interface Vector2D {
  x: number;
  z: number;
}

/**
 * 4D Quaternion orientation representation.
 */
export interface Quaternion {
  x: number;
  y: number;
  z: number;
  w: number;
}

/**
 * Euler orientation angles in degrees.
 */
export interface EulerAngles {
  pitch: number; // Rotation around X-axis (tilting forward/back)
  roll: number;  // Rotation around Y-axis (tilting left/right)
  yaw: number;   // Rotation around Z-axis (heading / compass turning)
}

/**
 * AR tracking quality level classification.
 */
export type ARTrackingQuality =
  | 'EXCELLENT'
  | 'GOOD'
  | 'LIMITED'
  | 'POOR'
  | 'NOT_AVAILABLE';

/**
 * AR session state lifecycle states.
 */
export type ARSessionStatus =
  | 'UNINITIALIZED'
  | 'INITIALIZING'
  | 'TRACKING'
  | 'PAUSED'
  | 'STOPPED'
  | 'ERROR';

/**
 * Motion state classification based on acceleration & angular velocity.
 */
export type ARMotionState =
  | 'STATIONARY'
  | 'MOVING'
  | 'FAST_MOTION'
  | 'ROTATING';

/**
 * Full 6-DOF camera pose metadata.
 */
export interface ARCameraPose {
  /** 3D position in meters relative to world origin. */
  position: Vector3D;
  /** 3D rotation in Euler angles (degrees). */
  rotation: EulerAngles;
  /** 4D rotation quaternion. */
  quaternion: Quaternion;
  /** ISO string of timestamp when frame was captured. */
  timestamp: string;
}

/**
 * Real-time AR tracking metrics payload.
 */
export interface ARTrackingMetrics {
  /** Current 6-DOF camera pose. */
  pose: ARCameraPose;
  /** World origin position baseline. */
  worldOrigin: Vector3D;
  /** Current motion state classification. */
  motionState: ARMotionState;
  /** Quality estimation of visual-inertial tracking. */
  trackingQuality: ARTrackingQuality;
  /** Estimated frame rate (FPS). */
  fps: number;
  /** Total frames processed since session start. */
  frameCount: number;
  /** Active session duration in seconds. */
  uptimeSeconds: number;
}

/**
 * AR Device capability hardware check result.
 */
export interface ARDeviceCapabilities {
  /** Overall AR tracking support flag. */
  isARSupported: boolean;
  /** Whether motion sensors (DeviceMotion/Gyro/Accel) are present. */
  sensorsAvailable: boolean;
  /** Native AR services availability (e.g. ARCore / ARKit). */
  arServicesInstalled: boolean;
  /** Camera & motion permissions granted status. */
  permissionGranted: boolean;
  /** User-facing explanation message. */
  message: string;
}

/**
 * AR Session configuration options.
 */
export interface ARSessionConfig {
  /** Desired sensor sampling rate in Hertz (e.g. 60Hz). */
  sampleRateHz: number;
  /** Enable automatic origin resetting on session start. */
  autoResetOrigin: boolean;
  /** High-sensitivity motion detection mode. */
  highPrecision: boolean;
}
