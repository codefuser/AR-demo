/**
 * @file src/utils/scanPointUtils.ts
 * @description 3D Spatial math utilities for scan point distance calculations, rotation deltas, and duplicate filtering.
 */

import type { Vector3D, EulerAngles } from '../types/ar';

/**
 * Calculates Euclidean 3D spatial distance between two position vectors $(X,Y,Z)$ in meters.
 */
export function calculate3DDistance(p1: Vector3D, p2: Vector3D): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  const dz = p1.z - p2.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Calculates angular rotation delta in degrees between two Euler orientation vectors (Pitch, Roll, Yaw).
 */
export function calculateRotationDelta(r1: EulerAngles, r2: EulerAngles): number {
  const dp = Math.abs(r1.pitch - r2.pitch);
  const dr = Math.abs(r1.roll - r2.roll);
  const dy = Math.abs(r1.yaw - r2.yaw);
  return Math.max(dp, dr, dy);
}

/**
 * Checks if a candidate position is a duplicate of a previously captured point within radius threshold.
 */
export function isDuplicateScanPoint(
  candidatePos: Vector3D,
  existingPointsPos: Vector3D[],
  thresholdMeters = 0.3,
): boolean {
  for (const pos of existingPointsPos) {
    if (calculate3DDistance(candidatePos, pos) < thresholdMeters) {
      return true;
    }
  }
  return false;
}

/**
 * Generates a unique scan point ID.
 */
export function generateScanPointId(sessionId: string, index: number): string {
  return `pt_${sessionId}_${index}_${Math.random().toString(36).substring(2, 6)}`;
}
