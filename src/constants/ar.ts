/**
 * @file src/constants/ar.ts
 * @description AR Module constants, thresholds, and configuration defaults.
 */

import type { Vector3D, Quaternion, EulerAngles, ARSessionConfig } from '../types/ar';

/**
 * Standard sensor sampling interval in milliseconds (60 FPS = ~16.6ms).
 */
export const DEFAULT_SENSOR_INTERVAL_MS = 16;

/**
 * Default AR Session configuration parameters.
 */
export const DEFAULT_AR_CONFIG: ARSessionConfig = {
  sampleRateHz: 60,
  autoResetOrigin: true,
  highPrecision: true,
};

/**
 * Default zeroed 3D position vector.
 */
export const ZERO_VECTOR: Vector3D = { x: 0, y: 0, z: 0 };

/**
 * Default identity quaternion $[0, 0, 0, 1]$.
 */
export const IDENTITY_QUATERNION: Quaternion = { x: 0, y: 0, z: 0, w: 1 };

/**
 * Default zeroed Euler orientation.
 */
export const ZERO_EULER: EulerAngles = { pitch: 0, roll: 0, yaw: 0 };

/**
 * Thresholds for motion state classification ($m/s^2$ acceleration & $rad/s$ rotation).
 */
export const MOTION_THRESHOLDS = {
  STATIONARY_ACCEL: 0.15,
  MOVING_ACCEL: 0.8,
  FAST_MOTION_ACCEL: 2.5,
  ROTATION_RAD_SEC: 1.2,
} as const;

/**
 * Human-readable error messages for AR session errors.
 */
export const AR_ERROR_MESSAGES = {
  UNSUPPORTED_DEVICE: 'AR tracking is not supported on this device hardware or browser environment.',
  MISSING_SENSORS: 'Required motion sensors (Gyroscope / Accelerometer) are missing on this device.',
  PERMISSION_DENIED: 'Permission to access motion sensors or camera was denied.',
  TRACKING_LOST: 'AR tracking lost. Move the device slowly to recover spatial orientation.',
  INITIALIZATION_FAILED: 'Failed to initialize the AR Tracking Engine.',
  LOW_LIGHT: 'Environment lighting is too low for visual-inertial tracking precision.',
} as const;
