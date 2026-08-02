/**
 * @file src/utils/arUtils.ts
 * @description AR math utilities, quaternion conversions, noise filters, and FPS calculations.
 */

import type { Vector3D, Quaternion, EulerAngles, ARMotionState, ARTrackingQuality } from '../types/ar';
import { MOTION_THRESHOLDS } from '../constants/ar';

/**
 * Converts rotation angles from radians to degrees.
 */
export function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

/**
 * Formats a 3D vector for clean UI display (2 decimal places).
 */
export function formatVector3D(v: Vector3D): string {
  return `X: ${v.x.toFixed(2)}m  Y: ${v.y.toFixed(2)}m  Z: ${v.z.toFixed(2)}m`;
}

/**
 * Formats Euler angles for clean UI display (1 decimal place).
 */
export function formatEulerAngles(e: EulerAngles): string {
  return `P: ${e.pitch.toFixed(1)}°  R: ${e.roll.toFixed(1)}°  Y: ${e.yaw.toFixed(1)}°`;
}

/**
 * Converts rotation (pitch, roll, yaw in radians) into a 4D Quaternion.
 */
export function eulerToQuaternion(pitchRad: number, rollRad: number, yawRad: number): Quaternion {
  const c1 = Math.cos(yawRad / 2);
  const s1 = Math.sin(yawRad / 2);
  const c2 = Math.cos(rollRad / 2);
  const s2 = Math.sin(rollRad / 2);
  const c3 = Math.cos(pitchRad / 2);
  const s3 = Math.sin(pitchRad / 2);

  return {
    x: s1 * c2 * c3 - c1 * s2 * s3,
    y: c1 * s2 * c3 + s1 * c2 * s3,
    z: c1 * c2 * s3 - s1 * s2 * c3,
    w: c1 * c2 * c3 + s1 * s2 * s3,
  };
}

/**
 * Calculates Euclidean distance between two 3D vectors.
 */
export function distance3D(v1: Vector3D, v2: Vector3D): number {
  const dx = v2.x - v1.x;
  const dy = v2.y - v1.y;
  const dz = v2.z - v1.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Low-pass filter to smooth sensor jitter.
 *
 * @param current  - New raw sensor value.
 * @param previous - Previous filtered value.
 * @param alpha    - Smoothing factor $[0, 1]$ (lower = smoother, higher = faster response).
 */
export function lowPassFilter(current: number, previous: number, alpha = 0.2): number {
  return previous + alpha * (current - previous);
}

/**
 * Classifies device motion state based on total acceleration and angular velocity.
 */
export function classifyMotionState(
  accelMag: number,
  rotRateMag: number,
): ARMotionState {
  if (rotRateMag > MOTION_THRESHOLDS.ROTATION_RAD_SEC) {
    return 'ROTATING';
  }
  if (accelMag > MOTION_THRESHOLDS.FAST_MOTION_ACCEL) {
    return 'FAST_MOTION';
  }
  if (accelMag > MOTION_THRESHOLDS.MOVING_ACCEL) {
    return 'MOVING';
  }
  return 'STATIONARY';
}

/**
 * Estimates AR tracking quality based on motion state and sensor variance.
 */
export function estimateTrackingQuality(
  motionState: ARMotionState,
  isSensorsActive: boolean,
): ARTrackingQuality {
  if (!isSensorsActive) return 'NOT_AVAILABLE';
  switch (motionState) {
    case 'STATIONARY':
      return 'EXCELLENT';
    case 'MOVING':
      return 'GOOD';
    case 'ROTATING':
      return 'LIMITED';
    case 'FAST_MOTION':
      return 'POOR';
    default:
      return 'GOOD';
  }
}
