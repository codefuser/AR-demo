/**
 * @file src/types/plane.ts
 * @description Native AR Plane Detection Engine TypeScript types & interfaces.
 */

import type { Vector3D, Vector2D } from './ar';
import type { ARNativeTrackingState } from './arNative';

export type PlaneType = 'HORIZONTAL_FLOOR' | 'VERTICAL_WALL' | 'CEILING' | 'UNKNOWN';

export interface ARNativePlaneModel {
  planeId: string;
  type: PlaneType;
  trackingState: ARNativeTrackingState;
  centerPose: Vector3D;
  extentX: number;
  extentZ: number;
  areaM2: number;
  polygon: Vector2D[];
  subsumedByPlaneId?: string;
  timestamp: string;
  frameNumber: number;
  sessionId?: string;
  quality: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface PlaneStats {
  totalPlanes: number;
  horizontalCount: number;
  verticalCount: number;
  ceilingCount: number;
  totalAreaM2: number;
  largestPlaneAreaM2: number;
  avgPlaneAreaM2: number;
}
