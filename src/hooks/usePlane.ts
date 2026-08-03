/**
 * @file src/hooks/usePlane.ts
 * @description Custom React Hooks for Real Plane Detection Engine.
 *
 * Exposes:
 *  - usePlanes(): List of active detected planes
 *  - usePlaneStats(): Real-time plane statistics (counts, total area m², largest plane)
 *  - usePlaneControl(): Control actions (startPlaneDetection, stopPlaneDetection, clearPlanes)
 */

import { useState, useEffect, useCallback } from 'react';
import { PlaneStore } from '../services/plane/PlaneStore';
import { PlaneManager } from '../services/plane/PlaneManager';
import type { ARNativePlaneModel, PlaneStats } from '../types/plane';

const planeStore = PlaneStore.getInstance();
const planeManager = PlaneManager.getInstance();

export function usePlanes(): ARNativePlaneModel[] {
  const [planes, setPlanes] = useState<ARNativePlaneModel[]>(planeStore.getPlanes());

  useEffect(() => {
    let isMounted = true;
    const unsubscribe = planeStore.subscribe((newPlanes) => {
      if (isMounted) {
        setPlanes(newPlanes);
      }
    });
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return planes;
}

export function usePlaneStats(): PlaneStats {
  const [stats, setStats] = useState<PlaneStats>(planeStore.getStats());

  useEffect(() => {
    let isMounted = true;
    const unsubscribe = planeStore.subscribe((_, newStats) => {
      if (isMounted) {
        setStats(newStats);
      }
    });
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return stats;
}

export function usePlaneControl() {
  const startDetection = useCallback(() => planeManager.startPlaneDetection(), []);
  const stopDetection = useCallback(() => planeManager.stopPlaneDetection(), []);
  const clearPlanes = useCallback(() => planeManager.clearPlanes(), []);

  return {
    startDetection,
    stopDetection,
    clearPlanes,
  };
}
