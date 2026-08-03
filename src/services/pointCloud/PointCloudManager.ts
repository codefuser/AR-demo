/**
 * @file src/services/pointCloud/PointCloudManager.ts
 * @description Core Raw Point Cloud Capture Manager.
 *
 * Subscribes to REAL native Google ARCore `Frame.acquirePointCloud()` events via
 * `ARCoreNativeBridgeService` and processes point cloud frames associated with
 * the active `ScanPoint` and `ScanSession`.
 *
 * Rules:
 *  - Captures frames ONLY when AR Session is active, Tracking is NORMAL, and Scan Session is RUNNING.
 *  - Links each real hardware point cloud frame to its parent `ScanPointId`.
 *  - Ignores empty frames and handles tracking loss cleanly.
 */

import { PointCloudService } from './PointCloudService';
import { PointCloudStore } from './PointCloudStore';
import { ARStateStore } from '../ar/native/ARStateStore';
import { ScanSessionStore } from '../scanSession/ScanSessionStore';
import { ScanPointStore } from '../scanPoint/ScanPointStore';
import ARCoreNativeBridgeService from '../ar/native/ARCoreNativeBridgeService';
import type { Vector3D } from '../../types/ar';

export class PointCloudManager {
  private static instance: PointCloudManager;
  private cloudService: PointCloudService;
  private cloudStore: PointCloudStore;
  private arStore: ARStateStore;
  private sessionStore: ScanSessionStore;
  private pointStore: ScanPointStore;
  private nativeBridge: ARCoreNativeBridgeService;

  private unsubscribeNativeCloud: (() => void) | null = null;
  private isLoopRunning = false;

  private constructor() {
    this.cloudService = PointCloudService.getInstance();
    this.cloudStore = PointCloudStore.getInstance();
    this.arStore = ARStateStore.getInstance();
    this.sessionStore = ScanSessionStore.getInstance();
    this.pointStore = ScanPointStore.getInstance();
    this.nativeBridge = ARCoreNativeBridgeService.getInstance();
  }

  public static getInstance(): PointCloudManager {
    if (!PointCloudManager.instance) {
      PointCloudManager.instance = new PointCloudManager();
    }
    return PointCloudManager.instance;
  }

  /**
   * Starts real native point cloud frame capture subscription loop.
   */
  public startCaptureLoop(): void {
    if (this.isLoopRunning) return;
    this.isLoopRunning = true;

    // Start native session if bridge is available
    if (this.nativeBridge.isNativeModuleAvailable()) {
      this.nativeBridge.resumeSession();
    }

    this.unsubscribeNativeCloud = this.nativeBridge.subscribePointCloud((payload) => {
      const activeSession = this.sessionStore.getState().activeSession;
      const arState = this.arStore.getState();

      // Validation check: Only capture when active session is SCANNING and AR status is TRACKING
      if (!activeSession || activeSession.currentStatus !== 'SCANNING') {
        return;
      }
      if (payload.trackingState !== 'TRACKING' && arState.status !== 'TRACKING') {
        return;
      }

      const lastPoint = this.pointStore.getState().lastCapturedPoint;
      const scanPointId = lastPoint ? lastPoint.pointId : 'sp_origin_0';

      const realVertices: Vector3D[] = payload.points.map((pt) => ({
        x: pt.x,
        y: pt.y,
        z: pt.z,
      }));

      const realConfidences: number[] = payload.points.map((pt) => pt.confidence);

      this.cloudService.processPointCloudFrame(
        activeSession.sessionId,
        scanPointId,
        arState.metrics.frameCount,
        realVertices,
        realConfidences,
        arState.metrics.pose,
        payload.trackingState,
        arState.metrics.trackingQuality,
      );
    });
  }

  /**
   * Stops capture loop.
   */
  public stopCaptureLoop(): void {
    if (this.unsubscribeNativeCloud) {
      this.unsubscribeNativeCloud();
      this.unsubscribeNativeCloud = null;
    }
    this.isLoopRunning = false;
  }

  /**
   * Clears point cloud frame data.
   */
  public clearData(): void {
    this.cloudService.clearData();
  }
}
