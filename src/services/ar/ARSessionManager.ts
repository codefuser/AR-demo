/**
 * @file src/services/ar/ARSessionManager.ts
 * @description AR Session Manager — controls session state lifecycle.
 *
 * Implements:
 *  - startSession()
 *  - pauseSession()
 *  - resumeSession()
 *  - stopSession()
 *  - resetSession()
 */

import { ARStateManager } from './ARStateManager';
import { ARTrackingManager } from './ARTrackingManager';
import type { ARSessionStatus } from '../../types/ar';

export class ARSessionManager {
  private static instance: ARSessionManager;
  private stateManager: ARStateManager;
  private trackingManager: ARTrackingManager;

  private constructor() {
    this.stateManager = ARStateManager.getInstance();
    this.trackingManager = ARTrackingManager.getInstance();
  }

  public static getInstance(): ARSessionManager {
    if (!ARSessionManager.instance) {
      ARSessionManager.instance = new ARSessionManager();
    }
    return ARSessionManager.instance;
  }

  /**
   * Starts a new AR session.
   */
  public async startSession(): Promise<boolean> {
    this.stateManager.setStatus('INITIALIZING');
    const success = await this.trackingManager.startTracking();
    if (success) {
      this.stateManager.setStatus('TRACKING');
    }
    return success;
  }

  /**
   * Pauses active tracking session.
   */
  public pauseSession(): void {
    const current = this.stateManager.getStatus();
    if (current === 'TRACKING') {
      this.trackingManager.stopTracking();
      this.stateManager.setStatus('PAUSED');
    }
  }

  /**
   * Resumes a paused session.
   */
  public async resumeSession(): Promise<boolean> {
    const current = this.stateManager.getStatus();
    if (current === 'PAUSED' || current === 'STOPPED') {
      return this.startSession();
    }
    return true;
  }

  /**
   * Stops session completely and resets telemetry.
   */
  public stopSession(): void {
    this.trackingManager.stopTracking();
    this.stateManager.setStatus('STOPPED');
  }

  /**
   * Resets spatial origin to $(0,0,0)$ and restarts tracking baseline.
   */
  public resetSession(): void {
    this.trackingManager.resetOrigin();
  }

  /**
   * Get current session status.
   */
  public getStatus(): ARSessionStatus {
    return this.stateManager.getStatus();
  }
}
