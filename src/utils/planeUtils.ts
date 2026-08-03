/**
 * @file src/utils/planeUtils.ts
 * @description Polygon 2D surface area math and plane spatial calculations.
 */

import type { Vector2D, Vector3D } from '../types/ar';

/**
 * Calculates 2D polygon surface area in square meters using the Shoelace formula.
 */
export function calculatePolygonAreaM2(polygon: Vector2D[], extentX: number, extentZ: number): number {
  if (!polygon || polygon.length < 3) {
    return Number((extentX * extentZ).toFixed(2));
  }

  let area = 0;
  const n = polygon.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += polygon[i].x * polygon[j].z;
    area -= polygon[j].x * polygon[i].z;
  }
  const calcArea = Math.abs(area) / 2.0;
  return Number((calcArea > 0 ? calcArea : extentX * extentZ).toFixed(2));
}

/**
 * Calculates Euclidean 3D distance from camera position to plane center pose.
 */
export function calculateDistanceToPlane(cameraPos: Vector3D, planeCenter: Vector3D): number {
  const dx = cameraPos.x - planeCenter.x;
  const dy = cameraPos.y - planeCenter.y;
  const dz = cameraPos.z - planeCenter.z;
  return Number(Math.sqrt(dx * dx + dy * dy + dz * dz).toFixed(2));
}
