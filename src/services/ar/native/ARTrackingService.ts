/**
 * @file src/services/ar/native/ARTrackingService.ts
 * @description Native AR Tracking Service — real Google ARCore camera pose & VIO telemetry tracking.
 */

import { ARTrackingManager } from '../ARTrackingManager';
import { ARStateStore } from './ARStateStore';
import ARCoreNativeBridgeService from './ARCoreNativeBridgeService';
import type { ARTrackingMetrics } from '../../../types/ar';

export class ARTrackingService {
  private static instance: ARTrackingService;
  private trackingManager: ARTrackingManager;
  private stateStore: ARStateStore;
  private nativeBridge: ARCoreNativeBridgeService;
  private unsubscribeTracking: (() => void) | null = null;
  private unsubscribeNativePose: (() => void) | null = null;

  private constructor() {
    this.trackingManager = ARTrackingManager.getInstance();
    this.stateStore = ARStateStore.getInstance();
    this.nativeBridge = ARCoreNativeBridgeService.getInstance();
  }

  public static getInstance(): ARTrackingService {
    if (!ARTrackingService.instance) {
      ARTrackingService.instance = new ARTrackingService();
    }
    return ARTrackingService.instance;
  }

  /**
   * Starts real native tracking telemetry feed.
   */
  public async startTracking(): Promise<boolean> {
    if (this.nativeBridge.isNativeModuleAvailable()) {
      this.nativeBridge.resumeSession();
      this.unsubscribeNativePose = this.nativeBridge.subscribeCameraPose((payload) => {
        this.stateStore.updateMetrics({
          pose: {
            position: payload.position,
            rotation: payload.rotation,
            quaternion: payload.quaternion,
            timestamp: new Date(payload.timestamp).toISOString(),
          },
          trackingQuality: payload.trackingState === 'TRACKING' ? 'EXCELLENT' : 'POOR',
          frameCount: payload.frameNumber,
        });
        if (payload.trackingState === 'TRACKING') {
          this.stateStore.setStatus('TRACKING');
        }
      });
      return true;
    }

    // Fallback if running outside native container
    const success = await this.trackingManager.startTracking();
    if (success) {
      this.unsubscribeTracking = this.trackingManager['stateManager'].subscribeMetrics(
        (metrics: ARTrackingMetrics) => {
          this.stateStore.updateMetrics(metrics);
        },
      );
    }
    return success;
  }

  /**
   * Stops tracking loop.
   */
  public stopTracking(): void {
    if (this.unsubscribeNativePose) {
      this.unsubscribeNativePose();
      this.unsubscribeNativePose = null;
    }
    if (this.unsubscribeTracking) {
      this.unsubscribeTracking();
      this.unsubscribeTracking = null;
    }
    if (this.nativeBridge.isNativeModuleAvailable()) {
      this.nativeBridge.pauseSession();
    }
    this.trackingManager.stopTracking();
  }

  /**
   * Resets spatial baseline origin to $(0,0,0)$.
   */
  public resetOrigin(): void {
    this.trackingManager.resetOrigin();
  }
}
