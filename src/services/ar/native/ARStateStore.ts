/**
 * @file src/services/ar/native/ARStateStore.ts
 * @description Central Observable State Store for Native AR Session Foundation.
 *
 * Manages:
 *  - Native Session Status ('UNINITIALIZED' | 'TRACKING' | 'PAUSED' | 'STOPPED' | etc.)
 *  - Real-time 6-DOF Pose Telemetry
 *  - Detected Planes Map (`ARPlane[]`)
 *  - Active Test Spatial Anchors Map (`ARAnchor[]`)
 *  - System Diagnostics Snapshot
 */

import type {
  ARPlane,
  ARAnchor,
  ARNativeSessionStatus,
  ARSystemDiagnostics,
} from '../../../types/arNative';
import type { ARTrackingMetrics } from '../../../types/ar';
import { ZERO_VECTOR, IDENTITY_QUATERNION, ZERO_EULER } from '../../../constants/ar';

export type ARNativeStateListener = (state: ARNativeStoreState) => void;

export interface ARNativeStoreState {
  status: ARNativeSessionStatus;
  metrics: ARTrackingMetrics;
  planes: ARPlane[];
  anchors: ARAnchor[];
  diagnostics: ARSystemDiagnostics | null;
}

export class ARStateStore {
  private static instance: ARStateStore;

  private status: ARNativeSessionStatus = 'UNINITIALIZED';
  private planes: Map<string, ARPlane> = new Map();
  private anchors: Map<string, ARAnchor> = new Map();
  private diagnostics: ARSystemDiagnostics | null = null;
  private listeners: Set<ARNativeStateListener> = new Set();

  private metrics: ARTrackingMetrics = {
    pose: {
      position: { ...ZERO_VECTOR },
      rotation: { ...ZERO_EULER },
      quaternion: { ...IDENTITY_QUATERNION },
      timestamp: new Date().toISOString(),
    },
    worldOrigin: { ...ZERO_VECTOR },
    motionState: 'STATIONARY',
    trackingQuality: 'NOT_AVAILABLE',
    fps: 0,
    frameCount: 0,
    uptimeSeconds: 0,
  };

  private constructor() {}

  public static getInstance(): ARStateStore {
    if (!ARStateStore.instance) {
      ARStateStore.instance = new ARStateStore();
    }
    return ARStateStore.instance;
  }

  public getState(): ARNativeStoreState {
    return {
      status: this.status,
      metrics: { ...this.metrics },
      planes: Array.from(this.planes.values()),
      anchors: Array.from(this.anchors.values()),
      diagnostics: this.diagnostics ? { ...this.diagnostics } : null,
    };
  }

  public setStatus(status: ARNativeSessionStatus): void {
    if (this.status !== status) {
      this.status = status;
      this.notifyListeners();
    }
  }

  public setDiagnostics(diagnostics: ARSystemDiagnostics): void {
    this.diagnostics = { ...diagnostics };
    this.notifyListeners();
  }

  public updateMetrics(metrics: Partial<ARTrackingMetrics>): void {
    this.metrics = {
      ...this.metrics,
      ...metrics,
      pose: metrics.pose ? { ...metrics.pose } : this.metrics.pose,
    };
    this.notifyListeners();
  }

  // ── Plane Operations ───────────────────────────────────────────────────────

  public addOrUpdatePlane(plane: ARPlane): void {
    this.planes.set(plane.id, { ...plane });
    this.notifyListeners();
  }

  public removePlane(planeId: string): void {
    if (this.planes.has(planeId)) {
      this.planes.delete(planeId);
      this.notifyListeners();
    }
  }

  public clearPlanes(): void {
    this.planes.clear();
    this.notifyListeners();
  }

  public getPlanes(): ARPlane[] {
    return Array.from(this.planes.values());
  }

  // ── Anchor Operations ──────────────────────────────────────────────────────

  public addAnchor(anchor: ARAnchor): void {
    this.anchors.set(anchor.id, { ...anchor });
    this.notifyListeners();
  }

  public removeAnchor(anchorId: string): void {
    if (this.anchors.has(anchorId)) {
      this.anchors.delete(anchorId);
      this.notifyListeners();
    }
  }

  public clearAnchors(): void {
    this.anchors.clear();
    this.notifyListeners();
  }

  public getAnchors(): ARAnchor[] {
    return Array.from(this.anchors.values());
  }

  // ── Subscription ───────────────────────────────────────────────────────────

  public subscribe(listener: ARNativeStateListener): () => void {
    this.listeners.add(listener);
    // Push initial snapshot
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    const currentState = this.getState();
    this.listeners.forEach((listener) => listener(currentState));
  }

  public resetAll(): void {
    this.status = 'UNINITIALIZED';
    this.planes.clear();
    this.anchors.clear();
    this.metrics = {
      pose: {
        position: { ...ZERO_VECTOR },
        rotation: { ...ZERO_EULER },
        quaternion: { ...IDENTITY_QUATERNION },
        timestamp: new Date().toISOString(),
      },
      worldOrigin: { ...ZERO_VECTOR },
      motionState: 'STATIONARY',
      trackingQuality: 'NOT_AVAILABLE',
      fps: 0,
      frameCount: 0,
      uptimeSeconds: 0,
    };
    this.notifyListeners();
  }
}
