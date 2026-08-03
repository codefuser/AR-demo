/**
 * @file src/utils/planeValidator.ts
 * @description Validates plane parameters against minimum area and non-zero extent rules.
 */

import type { ARNativePlaneModel } from '../types/plane';
import { MIN_PLANE_AREA_M2 } from '../constants/plane';

export class PlaneValidator {
  /**
   * Validates if plane meets physical minimum area and non-zero extent requirements.
   */
  public static isValidPlane(plane: ARNativePlaneModel): boolean {
    if (!plane || !plane.planeId) return false;
    if (plane.subsumedByPlaneId) return false; // Ignore merged subsumed planes
    if (plane.trackingState === 'STOPPED') return false;
    if (plane.extentX <= 0 || plane.extentZ <= 0) return false;
    if (plane.areaM2 < MIN_PLANE_AREA_M2) return false;
    return true;
  }
}
