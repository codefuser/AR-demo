/**
 * @file src/utils/cameraUtils.ts
 * @description Camera utility functions.
 *
 * Provides helper functions for permissions, opening device settings,
 * error mapping, and environment checks.
 */

import { Linking, Platform } from 'react-native';
import { CAMERA_ERROR_MESSAGES } from '../constants/camera';
import type { CameraErrorType } from '../types/camera';

/**
 * Opens the system settings screen for the app to allow the user
 * to manually grant camera permissions if permanently denied.
 */
export async function openAppDeviceSettings(): Promise<boolean> {
  try {
    if (Platform.OS === 'ios') {
      await Linking.openURL('app-settings:');
      return true;
    } else if (Platform.OS === 'android') {
      await Linking.openSettings();
      return true;
    }
  } catch (err) {
    console.warn('Failed to open app settings:', err);
  }
  return false;
}

/**
 * Maps a camera error type to a user-facing error message.
 *
 * @param errorType - The error type code.
 */
export function getCameraErrorMessage(errorType: CameraErrorType): string {
  return CAMERA_ERROR_MESSAGES[errorType] || CAMERA_ERROR_MESSAGES.UNEXPECTED;
}
