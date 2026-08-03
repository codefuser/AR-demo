/**
 * @file src/hooks/usePointCloud.ts
 * @description Custom React Hooks for Raw Point Cloud Capture Engine.
 *
 * Exposes:
 *  - usePointCloudFeed(sessionId?): List of captured point cloud frames
 *  - usePointCloudStats(): Real-time stats (totalFrames, totalPoints, avgPointsPerFrame, estimatedMemoryMB)
 *  - usePointCloudCapture(): Control actions (clearData)
 */

import { useState, useEffect, useCallback } from 'react';
import { PointCloudStore } from '../services/pointCloud/PointCloudStore';
import { PointCloudManager } from '../services/pointCloud/PointCloudManager';
import type { PointCloudFrame, PointCloudStats } from '../types/pointCloud';

const cloudStore = PointCloudStore.getInstance();
const cloudManager = PointCloudManager.getInstance();

export function usePointCloudStats(): PointCloudStats {
  const [stats, setStats] = useState<PointCloudStats>(cloudStore.getStats());

  useEffect(() => {
    let isMounted = true;
    const unsubscribe = cloudStore.subscribe((newStats) => {
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

export function usePointCloudFeed(targetSessionId?: string): PointCloudFrame[] {
  const [frames, setFrames] = useState<PointCloudFrame[]>(
    targetSessionId ? cloudStore.getFramesForSession(targetSessionId) : cloudStore.getFrames(),
  );

  useEffect(() => {
    let isMounted = true;
    const unsubscribe = cloudStore.subscribe(() => {
      if (isMounted) {
        setFrames(
          targetSessionId ? cloudStore.getFramesForSession(targetSessionId) : cloudStore.getFrames(),
        );
      }
    });
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [targetSessionId]);

  return frames;
}

export function usePointCloudCapture() {
  const startLoop = useCallback(() => cloudManager.startCaptureLoop(), []);
  const stopLoop = useCallback(() => cloudManager.stopCaptureLoop(), []);
  const clearData = useCallback(() => cloudManager.clearData(), []);

  return {
    startLoop,
    stopLoop,
    clearData,
  };
}
