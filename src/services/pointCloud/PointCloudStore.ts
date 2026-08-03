/**
 * @file src/services/pointCloud/PointCloudStore.ts
 * @description High-Performance Observable State Store for Captured Raw Point Cloud Frames.
 *
 * Manages:
 *  - Captured Point Cloud Frames Map (`frameId -> PointCloudFrame`)
 *  - Cumulative 3D Vertex Count & Frame Counter
 *  - Memory Buffer Capacity Management (`MAX_MEMORY_FRAME_BUFFER`)
 *  - Real-time PointCloudStats Snapshot
 */

import type { PointCloudFrame, PointCloudStats } from '../../types/pointCloud';
import { MAX_MEMORY_FRAME_BUFFER } from '../../constants/pointCloud';
import {
  estimatePointCloudMemoryMB,
  calculateAveragePointsPerFrame,
} from '../../utils/pointCloudUtils';

export type PointCloudStoreListener = (stats: PointCloudStats) => void;

export class PointCloudStore {
  private static instance: PointCloudStore;

  private framesMap: Map<string, PointCloudFrame> = new Map();
  private listeners: Set<PointCloudStoreListener> = new Set();
  private frameSequenceCounter = 0;
  private currentFrame: PointCloudFrame | null = null;

  private constructor() {}

  public static getInstance(): PointCloudStore {
    if (!PointCloudStore.instance) {
      PointCloudStore.instance = new PointCloudStore();
    }
    return PointCloudStore.instance;
  }

  public getStats(): PointCloudStats {
    const framesList = Array.from(this.framesMap.values());
    const totalPoints = framesList.reduce((acc, f) => acc + f.pointCount, 0);

    return {
      totalFrames: framesList.length,
      totalPoints,
      avgPointsPerFrame: calculateAveragePointsPerFrame(framesList),
      estimatedMemoryMB: estimatePointCloudMemoryMB(framesList),
      currentFrameNumber: this.frameSequenceCounter,
      currentPointCount: this.currentFrame ? this.currentFrame.pointCount : 0,
    };
  }

  public getFrames(): PointCloudFrame[] {
    return Array.from(this.framesMap.values()).map((f) => ({ ...f }));
  }

  public getFramesForSession(sessionId: string): PointCloudFrame[] {
    return Array.from(this.framesMap.values())
      .filter((f) => f.sessionId === sessionId)
      .map((f) => ({ ...f }));
  }

  public addFrame(frame: PointCloudFrame): void {
    this.frameSequenceCounter++;
    this.currentFrame = { ...frame };
    this.framesMap.set(frame.frameId, { ...frame });

    // Buffer trimming: Enforce memory limit if buffer exceeds MAX_MEMORY_FRAME_BUFFER
    if (this.framesMap.size > MAX_MEMORY_FRAME_BUFFER) {
      const oldestKey = this.framesMap.keys().next().value;
      if (oldestKey) {
        this.framesMap.delete(oldestKey);
      }
    }

    this.notifyListeners();
  }

  public clearFrames(): void {
    this.framesMap.clear();
    this.frameSequenceCounter = 0;
    this.currentFrame = null;
    this.notifyListeners();
  }

  public subscribe(listener: PointCloudStoreListener): () => void {
    this.listeners.add(listener);
    listener(this.getStats());
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    const currentStats = this.getStats();
    this.listeners.forEach((listener) => listener(currentStats));
  }
}
