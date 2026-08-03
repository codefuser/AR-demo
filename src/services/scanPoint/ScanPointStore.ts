/**
 * @file src/services/scanPoint/ScanPointStore.ts
 * @description Central Observable State Store for Captured Scan Points.
 *
 * Manages:
 *  - Captured Scan Points Map (`pointId -> ScanPoint`)
 *  - Active Session Point Feed
 *  - Real-time Scan Point Count & Feature Point Totals
 *  - Observable subscription listeners for UI cards
 */

import type { ScanPoint, ScanPointCaptureStatus } from '../../types/scanPoint';

export type ScanPointStoreListener = (state: ScanPointStoreState) => void;

export interface ScanPointStoreState {
  points: ScanPoint[];
  pointCount: number;
  totalFeaturePoints: number;
  lastCaptureStatus: ScanPointCaptureStatus | null;
  lastCapturedPoint: ScanPoint | null;
}

export class ScanPointStore {
  private static instance: ScanPointStore;

  private pointsMap: Map<string, ScanPoint> = new Map();
  private lastCaptureStatus: ScanPointCaptureStatus | null = null;
  private lastCapturedPoint: ScanPoint | null = null;
  private listeners: Set<ScanPointStoreListener> = new Set();

  private constructor() {}

  public static getInstance(): ScanPointStore {
    if (!ScanPointStore.instance) {
      ScanPointStore.instance = new ScanPointStore();
    }
    return ScanPointStore.instance;
  }

  public getState(): ScanPointStoreState {
    const pointsList = Array.from(this.pointsMap.values());
    const totalFeaturePoints = pointsList.reduce((acc, p) => acc + p.featurePointCount, 0);

    return {
      points: pointsList.map((p) => ({ ...p })),
      pointCount: pointsList.length,
      totalFeaturePoints,
      lastCaptureStatus: this.lastCaptureStatus,
      lastCapturedPoint: this.lastCapturedPoint ? { ...this.lastCapturedPoint } : null,
    };
  }

  public addPoint(point: ScanPoint): void {
    this.pointsMap.set(point.pointId, { ...point });
    this.lastCaptureStatus = point.captureStatus;
    if (point.captureStatus === 'CAPTURED') {
      this.lastCapturedPoint = { ...point };
    }
    this.notifyListeners();
  }

  public getPointsForSession(sessionId: string): ScanPoint[] {
    return Array.from(this.pointsMap.values())
      .filter((p) => p.sessionId === sessionId)
      .map((p) => ({ ...p }));
  }

  public clearPoints(): void {
    this.pointsMap.clear();
    this.lastCaptureStatus = null;
    this.lastCapturedPoint = null;
    this.notifyListeners();
  }

  public subscribe(listener: ScanPointStoreListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    const currentState = this.getState();
    this.listeners.forEach((listener) => listener(currentState));
  }
}
