/**
 * @file src/services/plane/PlaneService.ts
 * @description Low-level service converting native plane payloads into ARNativePlaneModel records.
 */

import { PlaneStore } from './PlaneStore';
import { calculatePolygonAreaM2 } from '../../utils/planeUtils';
import type { NativePlanePayload } from '../ar/native/ARCoreNativeBridgeService';
import type { ARNativePlaneModel } from '../../types/plane';

export class PlaneService {
  private static instance: PlaneService;
  private store: PlaneStore;

  private constructor() {
    this.store = PlaneStore.getInstance();
  }

  public static getInstance(): PlaneService {
    if (!PlaneService.instance) {
      PlaneService.instance = new PlaneService();
    }
    return PlaneService.instance;
  }

  /**
   * Processes native plane payload and updates store.
   */
  public processNativePlane(payload: NativePlanePayload): ARNativePlaneModel {
    const areaM2 = calculatePolygonAreaM2(payload.polygon, payload.extentX, payload.extentZ);
    const quality = areaM2 >= 1.0 ? 'HIGH' : areaM2 >= 0.3 ? 'MEDIUM' : 'LOW';

    const planeModel: ARNativePlaneModel = {
      planeId: payload.planeId,
      type: payload.type,
      trackingState: payload.trackingState,
      centerPose: payload.centerPose,
      extentX: payload.extentX,
      extentZ: payload.extentZ,
      areaM2,
      polygon: payload.polygon,
      subsumedByPlaneId: payload.subsumedByPlaneId,
      timestamp: new Date(payload.timestamp).toISOString(),
      frameNumber: payload.frameNumber,
      quality,
    };

    if (payload.trackingState === 'STOPPED' || payload.subsumedByPlaneId) {
      this.store.removePlane(payload.planeId);
    } else {
      this.store.addOrUpdatePlane(planeModel);
    }

    return planeModel;
  }

  public removePlane(planeId: string): void {
    this.store.removePlane(planeId);
  }

  public clearPlanes(): void {
    this.store.clearPlanes();
  }
}
