/**
 * @file src/services/plane/PlaneManager.ts
 * @description Core Real Plane Detection Manager subscribing to ARCoreNativeBridgeService events.
 */

import { PlaneService } from './PlaneService';
import { PlaneStore } from './PlaneStore';
import ARCoreNativeBridgeService from '../ar/native/ARCoreNativeBridgeService';

export class PlaneManager {
  private static instance: PlaneManager;
  private planeService: PlaneService;
  private planeStore: PlaneStore;
  private nativeBridge: ARCoreNativeBridgeService;

  private unsubscribePlaneUpdated: (() => void) | null = null;
  private unsubscribePlaneRemoved: (() => void) | null = null;
  private isListening = false;

  private constructor() {
    this.planeService = PlaneService.getInstance();
    this.planeStore = PlaneStore.getInstance();
    this.nativeBridge = ARCoreNativeBridgeService.getInstance();
  }

  public static getInstance(): PlaneManager {
    if (!PlaneManager.instance) {
      PlaneManager.instance = new PlaneManager();
    }
    return PlaneManager.instance;
  }

  /**
   * Starts listening to native ARCore plane events.
   */
  public startPlaneDetection(): void {
    if (this.isListening) return;
    this.isListening = true;

    if (this.nativeBridge.isNativeModuleAvailable()) {
      this.nativeBridge.resumeSession();
    }

    this.unsubscribePlaneUpdated = this.nativeBridge.subscribePlaneUpdated((payload) => {
      this.planeService.processNativePlane(payload);
    });

    this.unsubscribePlaneRemoved = this.nativeBridge.subscribePlaneRemoved((payload) => {
      this.planeService.removePlane(payload.planeId);
    });
  }

  /**
   * Stops plane detection listener.
   */
  public stopPlaneDetection(): void {
    if (this.unsubscribePlaneUpdated) {
      this.unsubscribePlaneUpdated();
      this.unsubscribePlaneUpdated = null;
    }
    if (this.unsubscribePlaneRemoved) {
      this.unsubscribePlaneRemoved();
      this.unsubscribePlaneRemoved = null;
    }
    this.isListening = false;
  }

  public clearPlanes(): void {
    this.planeService.clearPlanes();
  }
}
