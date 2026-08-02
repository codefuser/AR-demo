/**
 * @file src/services/ar/ARStateManager.ts
 * @description AR State Manager — maintains live 6-DOF telemetry & session state.
 *
 * Implements an observer pattern (subscribe/unsubscribe) so React hooks
 * and UI components receive 60Hz pose & metrics updates without unnecessary re-renders.
 */

import type {
  ARCameraPose,
  ARTrackingMetrics,
  ARSessionStatus,
  Vector3D,
} from '../../types/ar';
import {
  ZERO_VECTOR,
  IDENTITY_QUATERNION,
  ZERO_EULER,
} from '../../constants/ar';

export type ARStateListener = (metrics: ARTrackingMetrics) => void;
export type ARStatusListener = (status: ARSessionStatus) => void;

/**
 * Singleton state manager for AR telemetry.
 */
export class ARStateManager {
  private static instance: ARStateManager;

  private currentStatus: ARSessionStatus = 'UNINITIALIZED';
  private stateListeners: Set<ARStateListener> = new Set();
  private statusListeners: Set<ARStatusListener> = new Set();

  private worldOrigin: Vector3D = { ...ZERO_VECTOR };
  private currentPose: ARCameraPose = {
    position: { ...ZERO_VECTOR },
    rotation: { ...ZERO_EULER },
    quaternion: { ...IDENTITY_QUATERNION },
    timestamp: new Date().toISOString(),
  };

  private metrics: ARTrackingMetrics = {
    pose: this.currentPose,
    worldOrigin: this.worldOrigin,
    motionState: 'STATIONARY',
    trackingQuality: 'NOT_AVAILABLE',
    fps: 0,
    frameCount: 0,
    uptimeSeconds: 0,
  };

  private constructor() {}

  public static getInstance(): ARStateManager {
    if (!ARStateManager.instance) {
      ARStateManager.instance = new ARStateManager();
    }
    return ARStateManager.instance;
  }

  /**
   * Returns current session status.
   */
  public getStatus(): ARSessionStatus {
    return this.currentStatus;
  }

  /**
   * Returns latest tracking metrics snapshot.
   */
  public getMetrics(): ARTrackingMetrics {
    return { ...this.metrics };
  }

  /**
   * Updates session status and notifies listeners.
   */
  public setStatus(status: ARSessionStatus): void {
    if (this.currentStatus !== status) {
      this.currentStatus = status;
      this.statusListeners.forEach((listener) => listener(status));
    }
  }

  /**
   * Updates tracking metrics and notifies 60Hz subscribers.
   */
  public updateMetrics(partial: Partial<ARTrackingMetrics>): void {
    this.metrics = {
      ...this.metrics,
      ...partial,
      pose: partial.pose ? { ...partial.pose } : this.metrics.pose,
    };

    this.stateListeners.forEach((listener) => listener(this.metrics));
  }

  /**
   * Resets world origin coordinate to $(0,0,0)$.
   */
  public resetWorldOrigin(newOrigin: Vector3D = { ...ZERO_VECTOR }): void {
    this.worldOrigin = { ...newOrigin };
    this.updateMetrics({
      worldOrigin: this.worldOrigin,
      pose: {
        ...this.metrics.pose,
        position: { ...ZERO_VECTOR },
      },
    });
  }

  /**
   * Subscribe to 60Hz telemetry updates.
   */
  public subscribeMetrics(listener: ARStateListener): () => void {
    this.stateListeners.add(listener);
    return () => this.stateListeners.delete(listener);
  }

  /**
   * Subscribe to session lifecycle status changes.
   */
  public subscribeStatus(listener: ARStatusListener): () => void {
    this.statusListeners.add(listener);
    return () => this.statusListeners.delete(listener);
  }

  /**
   * Reset all state to defaults.
   */
  public resetState(): void {
    this.currentStatus = 'UNINITIALIZED';
    this.worldOrigin = { ...ZERO_VECTOR };
    this.metrics = {
      pose: {
        position: { ...ZERO_VECTOR },
        rotation: { ...ZERO_EULER },
        quaternion: { ...IDENTITY_QUATERNION },
        timestamp: new Date().toISOString(),
      },
      worldOrigin: this.worldOrigin,
      motionState: 'STATIONARY',
      trackingQuality: 'NOT_AVAILABLE',
      fps: 0,
      frameCount: 0,
      uptimeSeconds: 0,
    };
  }
}
