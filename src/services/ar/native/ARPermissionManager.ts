/**
 * @file src/services/ar/native/ARPermissionManager.ts
 * @description Native AR Permission Manager for Camera & Motion Sensors.
 */

import { Camera } from 'expo-camera';
import { DeviceMotion } from 'expo-sensors';

export class ARPermissionManager {
  private static instance: ARPermissionManager;

  private constructor() {}

  public static getInstance(): ARPermissionManager {
    if (!ARPermissionManager.instance) {
      ARPermissionManager.instance = new ARPermissionManager();
    }
    return ARPermissionManager.instance;
  }

  /**
   * Checks whether all required AR permissions are granted.
   */
  public async checkPermissions(): Promise<boolean> {
    try {
      const cameraStatus = await Camera.getCameraPermissionsAsync();
      const motionAvailable = await DeviceMotion.isAvailableAsync();

      return cameraStatus.granted && motionAvailable;
    } catch (err) {
      console.warn('Error checking AR permissions:', err);
      return false;
    }
  }

  /**
   * Requests camera permission from OS.
   */
  public async requestCameraPermission(): Promise<boolean> {
    try {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      return cameraStatus.granted;
    } catch (err) {
      console.warn('Error requesting camera permission:', err);
      return false;
    }
  }
}
