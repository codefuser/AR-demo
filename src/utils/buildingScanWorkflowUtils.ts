/**
 * @file src/utils/buildingScanWorkflowUtils.ts
 * @description Mathematics and health score aggregators for Unified Building Scan Workflow Engine.
 */

import type { ARTrackingQuality } from '../types/ar';
import type { WalkingQuality } from '../types/walkthrough';

/**
 * Calculates overall scan health score percentage (0% to 100%).
 * Evaluates tracking quality, plane count, point cloud density, and walking quality.
 */
export function calculateScanHealthScore(
  trackingQuality: ARTrackingQuality,
  walkingQuality: WalkingQuality,
  planeCount: number,
  pointCount: number,
): number {
  let score = 50;

  if (trackingQuality === 'EXCELLENT') score += 25;
  else if (trackingQuality === 'GOOD') score += 18;
  else if (trackingQuality === 'LIMITED') score += 5;
  else score -= 15;

  if (walkingQuality === 'OPTIMAL') score += 15;
  else if (walkingQuality === 'TOO_FAST' || walkingQuality === 'CAMERA_SHAKING') score -= 10;

  if (planeCount >= 2) score += 10;
  if (pointCount >= 100) score += 10;

  return Math.max(0, Math.min(100, score));
}

/**
 * Formats duration seconds into MM:SS format.
 */
export function formatScanDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
