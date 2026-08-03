/**
 * @file src/services/ar/native/ARSessionManager.ts
 * @description Native AR Session Manager — orchestrates session lifecycle operations.
 *
 * Implements:
 *  - startSession()
 *  - pauseSession()
 *  - resumeSession()
 *  - stopSession()
 *  - resetSession()
 *  - disposeSession()
 */

import { ARSessionService } from './ARSessionService';
import { ARTrackingService } from './ARTrackingService';
import { ARPlaneService } from './ARPlaneService';
import { ARAnchorService } from './ARAnchorService';
import { ARStateStore } from './ARStateStore';

export class ARSessionManager {
  private static instance: ARSessionManager;
  private sessionService: ARSessionService;
  private trackingService: ARTrackingService;
  private planeService: ARPlaneService;
  private anchorService: ARAnchorService;
  private stateStore: ARStateStore;

  private constructor() {
    this.sessionService = ARSessionService.getInstance();
    this.trackingService = ARTrackingService.getInstance();
    this.planeService = ARPlaneService.getInstance();
    this.anchorService = ARAnchorService.getInstance();
    this.stateStore = ARStateStore.getInstance();
  }

  public static getInstance(): ARSessionManager {
    if (!ARSessionManager.instance) {
      ARSessionManager.instance = new ARSessionManager();
    }
    return ARSessionManager.instance;
  }

  /**
   * Starts a new Native AR Session.
   */
  public async startSession(): Promise<boolean> {
    const initialized = await this.sessionService.initialize();
    if (!initialized) return false;

    const trackingStarted = await this.trackingService.startTracking();
    if (trackingStarted) {
      this.planeService.startPlaneDetection();
      this.stateStore.setStatus('TRACKING');
      return true;
    }

    this.stateStore.setStatus('ERROR');
    return false;
  }

  /**
   * Pauses an active AR Session.
   */
  public pauseSession(): void {
    const status = this.stateStore.getState().status;
    if (status === 'TRACKING') {
      this.trackingService.stopTracking();
      this.planeService.stopPlaneDetection();
      this.stateStore.setStatus('PAUSED');
    }
  }

  /**
   * Resumes a paused AR Session.
   */
  public async resumeSession(): Promise<boolean> {
    const status = this.stateStore.getState().status;
    if (status === 'PAUSED' || status === 'STOPPED') {
      return this.startSession();
    }
    return true;
  }

  /**
   * Stops the AR Session and releases active plane & sensor resources.
   */
  public stopSession(): void {
    this.trackingService.stopTracking();
    this.planeService.stopPlaneDetection();
    this.stateStore.setStatus('STOPPED');
  }

  /**
   * Resets world coordinate baseline to origin $(0,0,0)$.
   */
  public resetSession(): void {
    this.trackingService.resetOrigin();
  }

  /**
   * Disposes session entirely, clearing all planes, anchors, and resetting state to UNINITIALIZED.
   */
  public disposeSession(): void {
    this.stopSession();
    this.planeService.clearPlanes();
    this.anchorService.clearAllAnchors();
    this.stateStore.resetAll();
  }
}
