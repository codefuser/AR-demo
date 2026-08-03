/**
 * @file src/hooks/arNativeHooks.ts
 * @description Native AR Session Foundation Custom React Hooks.
 *
 * Exposes:
 *  - useARNativeSession(): Session controls & lifecycle status
 *  - useARNativeTracking(): 6-DOF camera pose & VIO telemetry
 *  - useARNativePlanes(): Real-time detected planes & surface extents
 *  - useARNativeAnchors(): Active spatial test anchors & creation actions
 *  - useARNativeDiagnostics(): System capabilities & diagnostic checks
 */

import { useState, useEffect, useCallback } from 'react';
import { ARSessionManager } from '../services/ar/native/ARSessionManager';
import { ARStateStore, type ARNativeStoreState } from '../services/ar/native/ARStateStore';
import { ARAnchorService } from '../services/ar/native/ARAnchorService';
import { ARPlaneService } from '../services/ar/native/ARPlaneService';
import type { ARPlane, ARAnchor, ARNativeSessionStatus, ARSystemDiagnostics } from '../types/arNative';
import type { ARTrackingMetrics, Vector3D } from '../types/ar';

const sessionManager = ARSessionManager.getInstance();
const stateStore = ARStateStore.getInstance();
const anchorService = ARAnchorService.getInstance();
const planeService = ARPlaneService.getInstance();

export function useARNativeStore(): ARNativeStoreState {
  const [state, setState] = useState<ARNativeStoreState>(stateStore.getState());

  useEffect(() => {
    let isMounted = true;
    const unsubscribe = stateStore.subscribe((newState) => {
      if (isMounted) {
        setState(newState);
      }
    });
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return state;
}

export function useARNativeSession() {
  const state = useARNativeStore();

  const start = useCallback(() => sessionManager.startSession(), []);
  const pause = useCallback(() => sessionManager.pauseSession(), []);
  const resume = useCallback(() => sessionManager.resumeSession(), []);
  const stop = useCallback(() => sessionManager.stopSession(), []);
  const reset = useCallback(() => sessionManager.resetSession(), []);
  const dispose = useCallback(() => sessionManager.disposeSession(), []);

  return {
    status: state.status as ARNativeSessionStatus,
    start,
    pause,
    resume,
    stop,
    reset,
    dispose,
  };
}

export function useARNativeTracking(): ARTrackingMetrics {
  const state = useARNativeStore();
  return state.metrics;
}

export function useARNativePlanes(): {
  planes: ARPlane[];
  horizontalCount: number;
  verticalCount: number;
  totalSurfaceAreaM2: number;
  clearPlanes: () => void;
} {
  const state = useARNativeStore();
  const planes = state.planes;

  const horizontalCount = planes.filter((p) => p.planeType.startsWith('HORIZONTAL')).length;
  const verticalCount = planes.filter((p) => p.planeType === 'VERTICAL').length;
  const totalSurfaceAreaM2 = Number(
    planes.reduce((acc, p) => acc + p.surfaceAreaM2, 0).toFixed(2),
  );

  const clearPlanes = useCallback(() => planeService.clearPlanes(), []);

  return {
    planes,
    horizontalCount,
    verticalCount,
    totalSurfaceAreaM2,
    clearPlanes,
  };
}

export function useARNativeAnchors(): {
  anchors: ARAnchor[];
  createTestAnchor: (name?: string, customPos?: Vector3D) => ARAnchor;
  removeAnchor: (id: string) => void;
  clearAnchors: () => void;
} {
  const state = useARNativeStore();
  const anchors = state.anchors;

  const createTestAnchor = useCallback(
    (name = 'Test Anchor', customPos?: Vector3D) => {
      return anchorService.createAnchor(name, customPos);
    },
    [],
  );

  const removeAnchor = useCallback((id: string) => {
    anchorService.removeAnchor(id);
  }, []);

  const clearAnchors = useCallback(() => {
    anchorService.clearAllAnchors();
  }, []);

  return {
    anchors,
    createTestAnchor,
    removeAnchor,
    clearAnchors,
  };
}

export function useARNativeDiagnostics(): ARSystemDiagnostics | null {
  const state = useARNativeStore();
  return state.diagnostics;
}
