/**
 * @file src/hooks/useCamera.ts
 * @description Custom React hook for managing camera lifecycle, permissions, controls, and capture.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import type { CameraView } from 'expo-camera';
import {
  checkCameraPermissions,
  requestCameraPermissions,
  formatPictureResult,
} from '../services/cameraService';
import { FLASH_MODES } from '../constants/camera';
import type { CameraFacing, FlashMode, CameraState, CameraErrorType, CapturedPictureResult } from '../types/camera';

export interface UseCameraReturn extends CameraState {
  /** React Ref to attach to the CameraView component. */
  cameraRef: React.RefObject<CameraView | null>;
  /** Request camera permissions from OS. */
  requestPermission: () => Promise<boolean>;
  /** Toggle facing mode between front and back. */
  toggleFacing: () => void;
  /** Cycle through flash modes (off -> on -> auto -> torch). */
  cycleFlashMode: () => void;
  /** Capture a single photo. Returns CapturedPictureResult or null. */
  takePicture: () => Promise<CapturedPictureResult | null>;
  /** Callback when camera preview finishes initialization. */
  onCameraReady: () => void;
  /** Callback when camera preview fails initialization. */
  onCameraError: (error: { message: string }) => void;
  /** Reset photo preview state. */
  clearLastPhoto: () => void;
}

/**
 * Hook providing camera state management and controls.
 */
export function useCamera(): UseCameraReturn {
  const cameraRef = useRef<CameraView | null>(null);

  const [facing, setFacing] = useState<CameraFacing>('back');
  const [flashMode, setFlashMode] = useState<FlashMode>('off');
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<CameraErrorType | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [lastPhoto, setLastPhoto] = useState<CapturedPictureResult | null>(null);

  // Initial permission check
  useEffect(() => {
    let isMounted = true;

    async function initPermissions() {
      setIsLoading(true);
      const granted = await checkCameraPermissions();
      if (isMounted) {
        setHasPermission(granted);
        if (!granted) {
          setErrorType('PERMISSION_DENIED');
          setError('Camera permission has not been granted.');
        }
        setIsLoading(false);
      }
    }

    initPermissions();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Request camera permission from OS.
   */
  const requestPermission = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setErrorType(null);

    const granted = await requestCameraPermissions();
    setHasPermission(granted);

    if (!granted) {
      setErrorType('PERMISSION_DENIED');
      setError('Camera permission was denied.');
    }

    setIsLoading(false);
    return granted;
  }, []);

  /**
   * Toggle between back and front facing cameras.
   */
  const toggleFacing = useCallback(() => {
    setFacing((prev: CameraFacing) => (prev === 'back' ? 'front' : 'back'));
    setIsReady(false); // reset ready state until new camera initializes
  }, []);

  /**
   * Cycle through available flash modes.
   */
  const cycleFlashMode = useCallback(() => {
    setFlashMode((prev: FlashMode) => {
      const currentIndex = FLASH_MODES.indexOf(prev);
      const nextIndex = (currentIndex + 1) % FLASH_MODES.length;
      return FLASH_MODES[nextIndex];
    });
  }, []);

  /**
   * Handle camera ready event.
   */
  const onCameraReady = useCallback(() => {
    setIsReady(true);
    setIsLoading(false);
    setError(null);
    setErrorType(null);
  }, []);

  /**
   * Handle camera initialization / runtime error.
   */
  const onCameraError = useCallback((err: { message: string }) => {
    setIsReady(false);
    setIsLoading(false);
    setError(err.message || 'Camera initialization failed.');
    setErrorType('INITIALIZATION_FAILED');
  }, []);

  /**
   * Capture a single photo temporarily.
   */
  const takePicture = useCallback(async (): Promise<CapturedPictureResult | null> => {
    if (!cameraRef.current || !isReady) {
      setError('Camera is not ready yet.');
      setErrorType('BUSY');
      return null;
    }

    try {
      setIsLoading(true);
      const picture = await cameraRef.current.takePictureAsync({
        quality: 0.85,
        skipProcessing: true,
      });

      if (picture) {
        const formatted = formatPictureResult(picture);
        setLastPhoto(formatted);
        setIsLoading(false);
        return formatted;
      }
    } catch (err) {
      console.warn('Error taking picture:', err);
      setError('Failed to capture photo.');
      setErrorType('CAPTURE_FAILED');
    } finally {
      setIsLoading(false);
    }

    return null;
  }, [isReady]);

  /**
   * Clear the last taken photo preview.
   */
  const clearLastPhoto = useCallback(() => {
    setLastPhoto(null);
  }, []);

  return {
    cameraRef,
    facing,
    flashMode,
    isReady,
    isLoading,
    error,
    errorType,
    hasPermission,
    lastPhoto,
    requestPermission,
    toggleFacing,
    cycleFlashMode,
    takePicture,
    onCameraReady,
    onCameraError,
    clearLastPhoto,
  };
}

export default useCamera;
