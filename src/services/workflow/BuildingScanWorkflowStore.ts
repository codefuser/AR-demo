/**
 * @file src/services/workflow/BuildingScanWorkflowStore.ts
 * @description Central Observable State Store for Active Building Scan Workflows.
 */

import type { BuildingScanWorkflowSnapshot } from '../../types/buildingScanWorkflow';

export type BuildingScanWorkflowStoreListener = (snapshot: BuildingScanWorkflowSnapshot) => void;

const INITIAL_SNAPSHOT: BuildingScanWorkflowSnapshot = {
  sessionId: '',
  buildingId: '',
  buildingName: '',
  floor: 1,
  state: 'IDLE',
  progressPct: 0,
  coverageEstimatePct: 0,
  scanHealthScore: 100,
  trackingState: 'STOPPED',
  trackingQuality: 'NOT_AVAILABLE',
  movementType: 'STATIONARY',
  walkingQuality: 'OPTIMAL',
  guidanceMessage: 'Tap Start Scan to begin automated building scan.',
  detectedPlaneCount: 0,
  pointCloudCount: 0,
  scanPointCount: 0,
  speedMps: 0,
  elapsedTimeSeconds: 0,
  distanceWalkedMeters: 0,
  summary: null,
};

export class BuildingScanWorkflowStore {
  private static instance: BuildingScanWorkflowStore;
  private snapshot: BuildingScanWorkflowSnapshot = { ...INITIAL_SNAPSHOT };
  private listeners: Set<BuildingScanWorkflowStoreListener> = new Set();

  private constructor() {}

  public static getInstance(): BuildingScanWorkflowStore {
    if (!BuildingScanWorkflowStore.instance) {
      BuildingScanWorkflowStore.instance = new BuildingScanWorkflowStore();
    }
    return BuildingScanWorkflowStore.instance;
  }

  public getSnapshot(): BuildingScanWorkflowSnapshot {
    return { ...this.snapshot };
  }

  public updateSnapshot(payload: Partial<BuildingScanWorkflowSnapshot>): void {
    this.snapshot = {
      ...this.snapshot,
      ...payload,
    };
    this.notifyListeners();
  }

  public resetSnapshot(): void {
    this.snapshot = { ...INITIAL_SNAPSHOT };
    this.notifyListeners();
  }

  public subscribe(listener: BuildingScanWorkflowStoreListener): () => void {
    this.listeners.add(listener);
    listener(this.getSnapshot());
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    const snapCopy = this.getSnapshot();
    this.listeners.forEach((listener) => listener(snapCopy));
  }
}
