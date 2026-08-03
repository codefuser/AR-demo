/**
 * @file src/hooks/useScanPoint.ts
 * @description Custom React Hooks for Scan Point Capture Engine.
 *
 * Exposes:
 *  - useScanPoints(sessionId?): List of captured scan points
 *  - useScanPointStats(): Real-time point count, feature point totals, & latest capture status badge
 *  - useScanPointCapture(): Manual capture actions & clear points
 */

import { useState, useEffect, useCallback } from 'react';
import { ScanPointStore, type ScanPointStoreState } from '../services/scanPoint/ScanPointStore';
import { ScanPointManager } from '../services/scanPoint/ScanPointManager';
import type { ScanPoint, ScanPointCaptureStatus } from '../types/scanPoint';

const pointStore = ScanPointStore.getInstance();
const pointManager = ScanPointManager.getInstance();

export function useScanPointStore(): ScanPointStoreState {
  const [state, setState] = useState<ScanPointStoreState>(pointStore.getState());

  useEffect(() => {
    let isMounted = true;
    const unsubscribe = pointStore.subscribe((newState) => {
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

export function useScanPoints(targetSessionId?: string): ScanPoint[] {
  const state = useScanPointStore();
  if (targetSessionId) {
    return state.points.filter((p) => p.sessionId === targetSessionId);
  }
  return state.points;
}

export function useScanPointStats(): {
  pointCount: number;
  totalFeaturePoints: number;
  lastCaptureStatus: ScanPointCaptureStatus | null;
  lastCapturedPoint: ScanPoint | null;
} {
  const state = useScanPointStore();
  return {
    pointCount: state.pointCount,
    totalFeaturePoints: state.totalFeaturePoints,
    lastCaptureStatus: state.lastCaptureStatus,
    lastCapturedPoint: state.lastCapturedPoint,
  };
}

export function useScanPointCapture() {
  const startLoop = useCallback(() => pointManager.startCaptureLoop(), []);
  const stopLoop = useCallback(() => pointManager.stopCaptureLoop(), []);
  const captureManualPoint = useCallback(() => pointManager.captureManualPoint(), []);
  const clearPoints = useCallback(() => pointManager.clearPoints(), []);

  return {
    startLoop,
    stopLoop,
    captureManualPoint,
    clearPoints,
  };
}
