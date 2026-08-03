/**
 * @file src/services/ar/native/ARTrackingService.ts
 * @description Native AR Tracking Service — high-rate 6-DOF pose & VIO telemetry tracking.
 */

import { ARTrackingManager } from '../ARTrackingManager';
import { ARStateStore } from './ARStateStore';
import type { ARTrackingMetrics } from '../../../types/ar';

export class ARTrackingService {
  private static instance: ARTrackingService;
  private trackingManager: ARTrackingManager;
  private stateStore: ARStateStore;
  private unsubscribeTracking: (() => void) | null = null;

  private constructor() {
    this.trackingManager = ARTrackingManager.getInstance();
    this.stateStore = ARStateStore.getInstance();
  }

  public static getInstance(): ARTrackingService {
    if (!ARTrackingService.instance) {
      ARTrackingService.instance = new ARTrackingService();
    }
    return ARTrackingService.instance;
  }

  /**
   * Starts tracking telemetry feed.
   */
  public async startTracking(): Promise<boolean> {
    const success = await this.trackingManager.startTracking();
    if (success) {
      // Forward metrics to native state store
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
    if (this.unsubscribeTracking) {
      this.unsubscribeTracking();
      this.unsubscribeTracking = null;
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
