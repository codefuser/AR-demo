/**
 * @file src/constants/arNative.ts
 * @description Native AR Session Foundation constants, plane configs, and diagnostic messages.
 */

import type { ARNativeSessionConfig } from '../types/arNative';

/**
 * Default Native AR Session configuration.
 */
export const DEFAULT_NATIVE_AR_CONFIG: ARNativeSessionConfig = {
  detectHorizontalPlanes: true,
  detectVerticalPlanes: true,
  autoResetOrigin: true,
  targetFPS: 60,
};

/**
 * Diagnostic error codes and messages.
 */
export const AR_NATIVE_MESSAGES = {
  SESSION_STARTED: 'Native AR Session started successfully.',
  SESSION_PAUSED: 'Native AR Session paused.',
  SESSION_RESUMED: 'Native AR Session resumed.',
  SESSION_STOPPED: 'Native AR Session stopped and resources released.',
  SESSION_RESET: 'World origin reset to (0,0,0).',
  TRACKING_LOST: 'AR tracking lost. Move device slowly across textured surfaces to recover visual anchors.',
  LOW_LIGHT_WARNING: 'Environment lighting is low. AR plane detection precision may be limited.',
  CAMERA_FAILURE: 'Failed to initialize camera feed for AR Session.',
  UNSUPPORTED_DEVICE: 'This device does not support native AR spatial tracking.',
} as const;
