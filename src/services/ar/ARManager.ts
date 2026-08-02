/**
 * @file src/services/ar/ARManager.ts
 * @description Central AR Manager Facade — unified entrance for AR hardware checks, session, and tracking.
 */

import { DeviceMotion } from 'expo-sensors';
import { Camera } from 'expo-camera';
import { ARStateManager } from './ARStateManager';
import { ARSessionManager } from './ARSessionManager';
import { ARTrackingManager } from './ARTrackingManager';
import type { ARDeviceCapabilities, ARTrackingMetrics, ARSessionStatus } from '../../types/ar';

export class ARManager {
  private static instance: ARManager;
  private stateManager: ARStateManager;
  private sessionManager: ARSessionManager;
  private trackingManager: ARTrackingManager;

  private constructor() {
    this.stateManager = ARStateManager.getInstance();
    this.sessionManager = ARSessionManager.getInstance();
    this.trackingManager = ARTrackingManager.getInstance();
  }

  public static getInstance(): ARManager {
    if (!ARManager.instance) {
      ARManager.instance = new ARManager();
    }
    return ARManager.instance;
  }

  /**
   * Checks device hardware compatibility and permissions.
   */
  public async checkDeviceCapabilities(): Promise<ARDeviceCapabilities> {
    try {
      const sensorsAvailable = await DeviceMotion.isAvailableAsync();
      const cameraPermission = await Camera.getCameraPermissionsAsync();
      const permissionGranted = cameraPermission.granted;

      const isARSupported = sensorsAvailable;
      const arServicesInstalled = sensorsAvailable;

      let message = 'Device fully supports AR spatial tracking.';
      if (!sensorsAvailable) {
        message = 'Motion sensors are not available on this device.';
      } else if (!permissionGranted) {
        message = 'Camera permission required for spatial tracking.';
      }

      return {
        isARSupported,
        sensorsAvailable,
        arServicesInstalled,
        permissionGranted,
        message,
      };
    } catch (err) {
      console.warn('Error checking AR capabilities:', err);
      return {
        isARSupported: false,
        sensorsAvailable: false,
        arServicesInstalled: false,
        permissionGranted: false,
        message: 'Failed to verify AR capabilities.',
      };
    }
  }

  // Facade delegation methods
  public async startSession(): Promise<boolean> {
    return this.sessionManager.startSession();
  }

  public pauseSession(): void {
    this.sessionManager.pauseSession();
  }

  public async resumeSession(): Promise<boolean> {
    return this.sessionManager.resumeSession();
  }

  public stopSession(): void {
    this.sessionManager.stopSession();
  }

  public resetSession(): void {
    this.sessionManager.resetSession();
  }

  public getMetrics(): ARTrackingMetrics {
    return this.stateManager.getMetrics();
  }

  public getStatus(): ARSessionStatus {
    return this.stateManager.getStatus();
  }

  public subscribeMetrics(listener: (metrics: ARTrackingMetrics) => void): () => void {
    return this.stateManager.subscribeMetrics(listener);
  }

  public subscribeStatus(listener: (status: ARSessionStatus) => void): () => void {
    return this.stateManager.subscribeStatus(listener);
  }
}
