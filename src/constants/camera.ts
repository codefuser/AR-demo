/**
 * @file src/constants/camera.ts
 * @description Camera module constants, error codes, and default options.
 */

import type { CameraFacing, FlashMode } from '../types/camera';

/**
 * Camera facing modes.
 */
export const CAMERA_FACING: Record<'BACK' | 'FRONT', CameraFacing> = {
  BACK: 'back',
  FRONT: 'front',
} as const;

/**
 * Flash modes cycling order.
 */
export const FLASH_MODES: FlashMode[] = ['off', 'on', 'auto', 'torch'];

/**
 * Human-readable labels and icon names for flash modes.
 */
export const FLASH_MODE_CONFIG: Record<
  FlashMode,
  { label: string; icon: 'flash-off' | 'flash' | 'flash-auto' | 'flashlight' }
> = {
  off: { label: 'Flash Off', icon: 'flash-off' },
  on: { label: 'Flash On', icon: 'flash' },
  auto: { label: 'Auto Flash', icon: 'flash-auto' },
  torch: { label: 'Torch', icon: 'flashlight' },
};

/**
 * Error messages for camera failure scenarios.
 */
export const CAMERA_ERROR_MESSAGES = {
  PERMISSION_DENIED: 'Camera permission was denied. Please grant access in device settings to use the camera.',
  NOT_AVAILABLE: 'Camera hardware is not available on this device or environment.',
  INITIALIZATION_FAILED: 'Failed to initialize the camera preview. Please try reopening the screen.',
  BUSY: 'Camera is currently busy with another process.',
  CAPTURE_FAILED: 'Failed to capture photo. Please try again.',
  UNEXPECTED: 'An unexpected camera error occurred.',
} as const;
