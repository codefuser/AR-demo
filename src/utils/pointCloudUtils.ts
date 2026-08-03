/**
 * @file src/utils/pointCloudUtils.ts
 * @description Utilities for point cloud memory estimation, vertex filtering, and average point statistics.
 */

import type { Vector3D } from '../types/ar';
import type { PointCloudFrame } from '../types/pointCloud';
import { BYTES_PER_3D_POINT, BYTES_PER_FRAME_OVERHEAD } from '../constants/pointCloud';

/**
 * Generates a unique point cloud frame ID.
 */
export function generateFrameId(sessionId: string, frameNumber: number): string {
  return `frame_${sessionId}_${frameNumber}_${Math.random().toString(36).substring(2, 6)}`;
}

/**
 * Estimates total memory consumption in Megabytes (MB) for a list of point cloud frames.
 */
export function estimatePointCloudMemoryMB(frames: PointCloudFrame[]): number {
  let totalBytes = 0;
  for (const frame of frames) {
    totalBytes += BYTES_PER_FRAME_OVERHEAD + frame.pointCount * BYTES_PER_3D_POINT;
  }
  const megabytes = totalBytes / (1024 * 1024);
  return Number(megabytes.toFixed(2));
}

/**
 * Filters out invalid or NaN 3D vertex coordinates.
 */
export function filterInvalidVertices(vertices: Vector3D[]): Vector3D[] {
  return vertices.filter(
    (v) =>
      v &&
      typeof v.x === 'number' &&
      typeof v.y === 'number' &&
      typeof v.z === 'number' &&
      !isNaN(v.x) &&
      !isNaN(v.y) &&
      !isNaN(v.z),
  );
}

/**
 * Calculates average 3D feature points per frame.
 */
export function calculateAveragePointsPerFrame(frames: PointCloudFrame[]): number {
  if (frames.length === 0) return 0;
  const totalPoints = frames.reduce((acc, f) => acc + f.pointCount, 0);
  return Math.round(totalPoints / frames.length);
}

/**
 * Simulates raw 3D feature point cloud vertex extraction around camera pose.
 */
export function generateMockFeaturePointCloud(
  cameraPos: Vector3D,
  count = 150,
): { vertices: Vector3D[]; confidences: number[] } {
  const vertices: Vector3D[] = [];
  const confidences: number[] = [];

  for (let i = 0; i < count; i++) {
    // Distribute points in 3D spatial field around camera position
    const offsetX = (Math.random() - 0.5) * 5.0;
    const offsetY = (Math.random() - 0.5) * 3.0;
    const offsetZ = Math.random() * 4.0 + 0.5;

    vertices.push({
      x: Number((cameraPos.x + offsetX).toFixed(3)),
      y: Number((cameraPos.y + offsetY).toFixed(3)),
      z: Number((cameraPos.z + offsetZ).toFixed(3)),
    });

    confidences.push(Number((Math.random() * 0.4 + 0.6).toFixed(2))); // 0.60 to 1.00
  }

  return { vertices, confidences };
}
