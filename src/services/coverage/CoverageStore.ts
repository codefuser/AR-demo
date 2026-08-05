/**
 * @file src/services/coverage/CoverageStore.ts
 * @description Central Observable State Store for Intelligent Coverage Analysis Engine.
 */

import type { SpatialGridCell, CoverageMetricsSnapshot } from '../../types/coverage';

export type CoverageStoreListener = (
  cells: Map<string, SpatialGridCell>,
  snapshot: CoverageMetricsSnapshot,
) => void;

const INITIAL_SNAPSHOT: CoverageMetricsSnapshot = {
  visitedAreaM2: 0,
  estimatedTotalAreaM2: 50.0,
  coveragePct: 0,
  coverageConfidencePct: 100,
  redundantScanPct: 0,
  unvisitedPct: 100,
  avgPointDensity: 0,
  qualityRating: 'POOR',
  scores: {
    coverageScore: 0,
    pointDensityScore: 0,
    trackingScore: 50,
    planeQualityScore: 0,
    walkthroughScore: 0,
    overallQualityScore: 0,
  },
  guidanceMessage: 'Start walking through building corridors to begin spatial coverage analysis.',
  totalGridCells: 0,
  isCompletionEligible: false,
};

export class CoverageStore {
  private static instance: CoverageStore;
  private cellsMap: Map<string, SpatialGridCell> = new Map();
  private snapshot: CoverageMetricsSnapshot = { ...INITIAL_SNAPSHOT };
  private listeners: Set<CoverageStoreListener> = new Set();

  private constructor() {}

  public static getInstance(): CoverageStore {
    if (!CoverageStore.instance) {
      CoverageStore.instance = new CoverageStore();
    }
    return CoverageStore.instance;
  }

  public getGridCells(): Map<string, SpatialGridCell> {
    return new Map(this.cellsMap);
  }

  public getSnapshot(): CoverageMetricsSnapshot {
    return { ...this.snapshot };
  }

  public updateCell(cell: SpatialGridCell): void {
    this.cellsMap.set(cell.cellId, { ...cell });
  }

  public updateSnapshot(payload: Partial<CoverageMetricsSnapshot>): void {
    this.snapshot = {
      ...this.snapshot,
      ...payload,
    };
    this.notifyListeners();
  }

  public resetData(): void {
    this.cellsMap.clear();
    this.snapshot = { ...INITIAL_SNAPSHOT };
    this.notifyListeners();
  }

  public subscribe(listener: CoverageStoreListener): () => void {
    this.listeners.add(listener);
    listener(this.getGridCells(), this.getSnapshot());
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    const cellsCopy = this.getGridCells();
    const snapCopy = this.getSnapshot();
    this.listeners.forEach((listener) => listener(cellsCopy, snapCopy));
  }
}
