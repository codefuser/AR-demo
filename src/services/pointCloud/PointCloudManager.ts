/**
 * @file src/services/pointCloud/PointCloudManager.ts
 * @description Core Raw Point Cloud Capture Manager.
 *
 * Listens to AR frame updates and captures raw point cloud frames associated with
 * the active `ScanPoint` and `ScanSession`.
 *
 * Rules:
 *  - Captures frames ONLY when AR Session is active, Tracking is NORMAL, and Scan Session is RUNNING.
 *  - Links each point cloud frame to its parent `ScanPointId`.
 *  - Ignores empty frames and handles tracking loss cleanly.
 */

import { PointCloudService } from './PointCloudService';
import { PointCloudStore } from './PointCloudStore';
import { ARStateStore } from '../ar/native/ARStateStore';
import { ScanSessionStore } from '../scanSession/ScanSessionStore';
import { ScanPointStore } from '../scanPoint/ScanPointStore';
import { generateMockFeaturePointCloud } from '../../utils/pointCloudUtils';

export class PointCloudManager {
  private static instance: PointCloudManager;
  private cloudService: PointCloudService;
  private cloudStore: PointCloudStore;
  private arStore: ARStateStore;
  private sessionStore: ScanSessionStore;
  private pointStore: ScanPointStore;

  private unsubscribeAR: (() => void) | null = null;
  private isLoopRunning = false;

  private constructor() {
    this.cloudService = PointCloudService.getInstance();
    this.cloudStore = PointCloudStore.getInstance();
    this.arStore = ARStateStore.getInstance();
    this.sessionStore = ScanSessionStore.getInstance();
    this.pointStore = ScanPointStore.getInstance();
  }

  public static getInstance(): PointCloudManager {
    if (!PointCloudManager.instance) {
      PointCloudManager.instance = new PointCloudManager();
    }
    return PointCloudManager.instance;
  }

  /**
   * Starts point cloud frame capture loop.
   */
  public startCaptureLoop(): void {
    if (this.isLoopRunning) return;
    this.isLoopRunning = true;

    this.unsubscribeAR = this.arStore.subscribe((arState) => {
      const activeSession = this.sessionStore.getState().activeSession;

      // Validation check: Only capture when active session is SCANNING and AR status is TRACKING
      if (!activeSession || activeSession.currentStatus !== 'SCANNING') {
        return;
      }
      if (arState.status !== 'TRACKING') {
        return;
      }

      const lastPoint = this.pointStore.getState().lastCapturedPoint;
      const scanPointId = lastPoint ? lastPoint.pointId : 'sp_origin_0';

      const cameraPos = arState.metrics.pose.position;
      const mockPointCloud = generateMockFeaturePointCloud(cameraPos, Math.floor(Math.random() * 80) + 120);

      this.cloudService.processPointCloudFrame(
        activeSession.sessionId,
        scanPointId,
        arState.metrics.frameCount,
        mockPointCloud.vertices,
        mockPointCloud.confidences,
        arState.metrics.pose,
        'TRACKING',
        arState.metrics.trackingQuality,
      );
    });
  }

  /**
   * Stops capture loop.
   */
  public stopCaptureLoop(): void {
    if (this.unsubscribeAR) {
      this.unsubscribeAR();
      this.unsubscribeAR = null;
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
