/**
 * @file src/constants/walkthrough.ts
 * @description Constants, velocity thresholds, and guidance messages for Building Walkthrough Engine.
 */

import type { WalkingQuality } from '../types/walkthrough';

/** Optimal walking speed bounds in meters per second (m/s) */
export const OPTIMAL_SPEED_MIN_MPS = 0.3;
export const OPTIMAL_SPEED_MAX_MPS = 1.2;
export const FAST_SPEED_THRESHOLD_MPS = 1.5;

/** Angular rotation velocity threshold in degrees per second */
export const FAST_ROTATION_THRESHOLD_DEG_SEC = 45.0;

/** Minimum planes required for optimal scanning quality */
export const MIN_OPTIMAL_PLANES = 2;

/** Live AR User Guidance Prompts mapping */
export const GUIDANCE_PROMPTS: Record<WalkingQuality, string> = {
  OPTIMAL: 'Optimal pace. Continue walking along the corridor.',
  TOO_FAST: 'Slow down. Walk slowly to maintain high tracking accuracy.',
  TOO_SLOW: 'Slow pace. Continue moving forward through the building.',
  CAMERA_SHAKING: 'Keep camera stable. Avoid rapid tilting or shaking.',
  LOW_LIGHT: 'Low light detected. Point camera toward well-lit surfaces.',
  TRACKING_LOST: 'Tracking lost! Pause and hold camera steady to recover.',
  POOR_POINT_CLOUD: 'Low feature density. Point camera at textured surfaces.',
  LOW_PLANE_DETECTION: 'Scan floor and wall surfaces to detect geometry.',
};
