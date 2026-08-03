/**
 * @file src/utils/arNativeUtils.ts
 * @description Utilities for spatial plane geometry, anchor transforms, and diagnostic formatting.
 */

import type { Vector3D, Quaternion, EulerAngles } from '../types/ar';
import type { ARPlane, ARAnchor, ARPlaneType } from '../types/arNative';

/**
 * Generates a unique anchor ID with timestamp suffix.
 */
export function generateAnchorId(prefix = 'anchor'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

/**
 * Generates a unique plane ID.
 */
export function generatePlaneId(type: ARPlaneType): string {
  const shortType = type.startsWith('HORIZONTAL') ? 'hplane' : 'vplane';
  return `${shortType}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

/**
 * Calculates plane surface area in square meters $(m^2)$.
 */
export function calculatePlaneSurfaceArea(extentX: number, extentZ: number): number {
  return Number((extentX * extentZ).toFixed(2));
}

/**
 * Formats plane extents into human-readable string (e.g. "2.5m x 1.8m (4.50 m²)").
 */
export function formatPlaneDimensions(plane: ARPlane): string {
  return `${plane.extentX.toFixed(1)}m × ${plane.extentZ.toFixed(1)}m (${plane.surfaceAreaM2.toFixed(2)} m²)`;
}

/**
 * Creates a mock test plane anchored to spatial coordinates (for diagnostics & testing).
 */
export function createMockPlane(
  type: ARPlaneType,
  center: Vector3D,
  extentX = 2.0,
  extentZ = 1.5,
): ARPlane {
  const now = new Date().toISOString();
  const surfaceAreaM2 = calculatePlaneSurfaceArea(extentX, extentZ);

  return {
    id: generatePlaneId(type),
    planeType: type,
    center,
    extentX,
    extentZ,
    surfaceAreaM2,
    trackingState: 'TRACKING',
    polygonPoints: [
      { x: center.x - extentX / 2, y: center.y, z: center.z - extentZ / 2 },
      { x: center.x + extentX / 2, y: center.y, z: center.z - extentZ / 2 },
      { x: center.x + extentX / 2, y: center.y, z: center.z + extentZ / 2 },
      { x: center.x - extentX / 2, y: center.y, z: center.z + extentZ / 2 },
    ],
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Creates a spatial test anchor anchored to spatial coordinates.
 */
export function createMockAnchor(
  name: string,
  position: Vector3D,
  quaternion: Quaternion = { x: 0, y: 0, z: 0, w: 1 },
  rotation: EulerAngles = { pitch: 0, roll: 0, yaw: 0 },
): ARAnchor {
  return {
    id: generateAnchorId('anchor'),
    name,
    position,
    quaternion,
    rotation,
    trackingState: 'TRACKING',
    lifetimeSeconds: 0,
    createdAt: new Date().toISOString(),
  };
}
