/**
 * @file src/services/cameraService.ts
 * @description Camera Service — abstraction layer for camera operations.
 *
 * Provides a clean interface for requesting camera permissions and capturing photos.
 * Separates Expo Camera API calls from React component rendering logic.
 */

import { Camera } from 'expo-camera';
import type { CapturedPictureResult } from '../types/camera';

export interface RawPictureResult {
  uri: string;
  width?: number;
  height?: number;
}

/**
 * Checks current camera permission status without prompting.
 *
 * @returns Promise resolving to boolean granted status.
 */
export async function checkCameraPermissions(): Promise<boolean> {
  try {
    const status = await Camera.getCameraPermissionsAsync();
    return status.granted;
  } catch (error) {
    console.warn('Error checking camera permissions:', error);
    return false;
  }
}

/**
 * Requests camera permission from the OS.
 *
 * @returns Promise resolving to boolean granted status.
 */
export async function requestCameraPermissions(): Promise<boolean> {
  try {
    const status = await Camera.requestCameraPermissionsAsync();
    return status.granted;
  } catch (error) {
    console.warn('Error requesting camera permissions:', error);
    return false;
  }
}

/**
 * Formats a picture reference result from expo-camera into a CapturedPictureResult.
 *
 * @param picture - The raw captured picture object.
 */
export function formatPictureResult(picture: RawPictureResult): CapturedPictureResult {
  return {
    uri: picture.uri,
    width: picture.width,
    height: picture.height,
    timestamp: new Date().toISOString(),
  };
}
