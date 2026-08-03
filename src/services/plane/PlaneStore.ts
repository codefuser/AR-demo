/**
 * @file src/services/plane/PlaneStore.ts
 * @description Central Observable State Store for Real Native AR Planes.
 */

import type { ARNativePlaneModel, PlaneStats } from '../../types/plane';
import { PlaneStatistics } from '../../utils/planeStatistics';

export type PlaneStoreListener = (planes: ARNativePlaneModel[], stats: PlaneStats) => void;

export class PlaneStore {
  private static instance: PlaneStore;

  private planesMap: Map<string, ARNativePlaneModel> = new Map();
  private listeners: Set<PlaneStoreListener> = new Set();

  private constructor() {}

  public static getInstance(): PlaneStore {
    if (!PlaneStore.instance) {
      PlaneStore.instance = new PlaneStore();
    }
    return PlaneStore.instance;
  }

  public getPlanes(): ARNativePlaneModel[] {
    return Array.from(this.planesMap.values()).map((p) => ({ ...p }));
  }

  public getStats(): PlaneStats {
    return PlaneStatistics.calculate(Array.from(this.planesMap.values()));
  }

  public addOrUpdatePlane(plane: ARNativePlaneModel): void {
    this.planesMap.set(plane.planeId, { ...plane });
    this.notifyListeners();
  }

  public removePlane(planeId: string): void {
    if (this.planesMap.has(planeId)) {
      this.planesMap.delete(planeId);
      this.notifyListeners();
    }
  }

  public clearPlanes(): void {
    this.planesMap.clear();
    this.notifyListeners();
  }

  public subscribe(listener: PlaneStoreListener): () => void {
    this.listeners.add(listener);
    listener(this.getPlanes(), this.getStats());
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    const planesList = this.getPlanes();
    const stats = this.getStats();
    this.listeners.forEach((listener) => listener(planesList, stats));
  }
}
