/**
 * @file src/types/camera.ts
 * @description Camera module TypeScript types and interfaces.
 */

/**
 * Camera facing orientation options.
 */
export type CameraFacing = 'back' | 'front';

/**
 * Camera flash mode options.
 */
export type FlashMode = 'off' | 'on' | 'auto' | 'torch';

/**
 * Camera error classification types.
 */
export type CameraErrorType =
  | 'PERMISSION_DENIED'
  | 'NOT_AVAILABLE'
  | 'INITIALIZATION_FAILED'
  | 'BUSY'
  | 'CAPTURE_FAILED'
  | 'UNEXPECTED';

/**
 * Camera status lifecycle states.
 */
export type CameraStatusState =
  | 'initializing'
  | 'ready'
  | 'loading'
  | 'error'
  | 'permission_denied';

/**
 * Single captured picture result metadata.
 */
export interface CapturedPictureResult {
  /** Temporary local file URI of captured image. */
  uri: string;
  /** Image width in pixels. */
  width?: number;
  /** Image height in pixels. */
  height?: number;
  /** Captured timestamp ISO string. */
  timestamp: string;
}

/**
 * Camera hook state shape.
 */
export interface CameraState {
  /** Current active facing mode ('back' | 'front'). */
  facing: CameraFacing;
  /** Active flash mode ('off' | 'on' | 'auto' | 'torch'). */
  flashMode: FlashMode;
  /** Whether the camera preview is initialized and ready. */
  isReady: boolean;
  /** Whether a photo capture or permission request is in flight. */
  isLoading: boolean;
  /** Error message string if an error occurred. */
  error: string | null;
  /** Specific error type classification. */
  errorType: CameraErrorType | null;
  /** Permission status flag. */
  hasPermission: boolean | null;
  /** Last captured photo metadata. */
  lastPhoto: CapturedPictureResult | null;
}
