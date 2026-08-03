/**
 * @file src/constants/pointCloud.ts
 * @description Raw Point Cloud Capture Engine default limits, memory metrics, and diagnostic messages.
 */

/**
 * Maximum point cloud frames stored in memory buffer before trimming or streaming.
 */
export const MAX_MEMORY_FRAME_BUFFER = 500;

/**
 * Estimated bytes per 3D point (Vector3D floats + confidence float + JS object overhead).
 */
export const BYTES_PER_3D_POINT = 32;

/**
 * Estimated fixed byte overhead per frame object.
 */
export const BYTES_PER_FRAME_OVERHEAD = 512;

/**
 * Diagnostic error and status messages for point cloud capture.
 */
export const POINT_CLOUD_MESSAGES = {
  CAPTURED: 'Point Cloud frame captured.',
  EMPTY_SKIPPED: 'Zero feature points detected — frame skipped.',
  TRACKING_LOST: 'AR tracking interrupted — point cloud capture suspended.',
  INVALID_POSE: 'Camera pose unaligned — point cloud frame rejected.',
} as const;
