/**
 * @file src/utils/walkthroughUtils.ts
 * @description Mathematics and classification algorithms for movement velocity, heading, quality, and coverage.
 */

import type { Vector3D, EulerAngles, ARTrackingQuality } from '../types/ar';
import type { MovementType, WalkingQuality, CardinalDirection } from '../types/walkthrough';
import {
  OPTIMAL_SPEED_MIN_MPS,
  OPTIMAL_SPEED_MAX_MPS,
  FAST_SPEED_THRESHOLD_MPS,
  FAST_ROTATION_THRESHOLD_DEG_SEC,
  MIN_OPTIMAL_PLANES,
  GUIDANCE_PROMPTS,
} from '../constants/walkthrough';

/**
 * Calculates linear velocity magnitude in meters per second (m/s) between two 3D positions over time delta.
 */
export function calculateSpeedMps(
  currentPos: Vector3D,
  previousPos: Vector3D | null,
  timeDeltaSec: number,
): number {
  if (!previousPos || timeDeltaSec <= 0) return 0;
  const dx = currentPos.x - previousPos.x;
  const dy = currentPos.y - previousPos.y;
  const dz = currentPos.z - previousPos.z;
  const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const speed = dist / timeDeltaSec;
  return Number(speed.toFixed(2));
}

/**
 * Normalizes camera yaw angle into compass heading degrees (0° to 360°).
 */
export function calculateHeadingDegrees(yaw: number): number {
  const normalized = ((yaw % 360) + 360) % 360;
  return Math.round(normalized);
}

/**
 * Converts compass heading degrees to 8-point Cardinal Direction.
 */
export function getCardinalDirection(degrees: number): CardinalDirection {
  const index = Math.floor((degrees + 22.5) / 45) % 8;
  const directions: CardinalDirection[] = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return directions[index];
}

/**
 * Classifies movement type based on linear speed and angular rotation velocity.
 */
export function classifyMovementType(
  speedMps: number,
  rotDeltaDegSec: number,
  yawDeltaDeg: number,
): MovementType {
  if (speedMps > FAST_SPEED_THRESHOLD_MPS) {
    return 'FAST_MOVEMENT';
  }
  if (rotDeltaDegSec > FAST_ROTATION_THRESHOLD_DEG_SEC) {
    return yawDeltaDeg < 0 ? 'TURNING_LEFT' : 'TURNING_RIGHT';
  }
  if (speedMps >= OPTIMAL_SPEED_MIN_MPS && speedMps <= OPTIMAL_SPEED_MAX_MPS) {
    return 'WALKING';
  }
  if (speedMps > 0 && speedMps < OPTIMAL_SPEED_MIN_MPS) {
    return 'SLOW_MOVEMENT';
  }
  return 'STATIONARY';
}

/**
 * Evaluates real-time walking quality and selects appropriate guidance prompt.
 */
export function evaluateWalkingQuality(
  speedMps: number,
  trackingQuality: ARTrackingQuality,
  planeCount: number,
  pointCount: number,
  isTrackingActive: boolean,
): { quality: WalkingQuality; guidanceMessage: string } {
  if (!isTrackingActive) {
    return { quality: 'TRACKING_LOST', guidanceMessage: GUIDANCE_PROMPTS.TRACKING_LOST };
  }
  if (speedMps > FAST_SPEED_THRESHOLD_MPS) {
    return { quality: 'TOO_FAST', guidanceMessage: GUIDANCE_PROMPTS.TOO_FAST };
  }
  if (trackingQuality === 'POOR' || trackingQuality === 'LIMITED') {
    return { quality: 'POOR_POINT_CLOUD', guidanceMessage: GUIDANCE_PROMPTS.POOR_POINT_CLOUD };
  }
  if (planeCount < MIN_OPTIMAL_PLANES) {
    return { quality: 'LOW_PLANE_DETECTION', guidanceMessage: GUIDANCE_PROMPTS.LOW_PLANE_DETECTION };
  }
  if (speedMps < OPTIMAL_SPEED_MIN_MPS && speedMps > 0) {
    return { quality: 'TOO_SLOW', guidanceMessage: GUIDANCE_PROMPTS.TOO_SLOW };
  }
  return { quality: 'OPTIMAL', guidanceMessage: GUIDANCE_PROMPTS.OPTIMAL };
}

/**
 * Calculates estimated spatial coverage percentage (0% to 100%).
 */
export function calculateCoverageEstimate(
  distanceWalkedMeters: number,
  planeCount: number,
  targetDistanceMeters = 50.0,
): number {
  const distancePct = Math.min(1.0, distanceWalkedMeters / targetDistanceMeters) * 70;
  const planePct = Math.min(1.0, planeCount / 8) * 30;
  return Math.min(100, Math.round(distancePct + planePct));
}
