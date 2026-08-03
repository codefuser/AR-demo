/**
 * @file src/services/pointCloud/PointCloudService.ts
 * @description Low-Level Point Cloud Frame Processing & Persistence Service.
 */

import { PointCloudStore } from './PointCloudStore';
import { generateFrameId, filterInvalidVertices } from '../../utils/pointCloudUtils';
import type { PointCloudFrame, PointCloudFrameStatus } from '../../types/pointCloud';
import type { Vector3D, ARCameraPose, ARTrackingQuality } from '../../types/ar';
import type { ARNativeTrackingState } from '../../types/arNative';

export class PointCloudService {
  private static instance: PointCloudService;
  private store: PointCloudStore;

  private constructor() {
    this.store = PointCloudStore.getInstance();
  }

  public static getInstance(): PointCloudService {
    if (!PointCloudService.instance) {
      PointCloudService.instance = new PointCloudService();
    }
    return PointCloudService.instance;
  }

  /**
   * Processes and stores a raw point cloud frame.
   */
  public processPointCloudFrame(
    sessionId: string,
    scanPointId: string,
    frameNumber: number,
    rawVertices: Vector3D[],
    confidences: number[],
    cameraPose: ARCameraPose,
    trackingState: ARNativeTrackingState,
    trackingQuality: ARTrackingQuality,
  ): { frame: PointCloudFrame | null; status: PointCloudFrameStatus } {
    if (trackingState !== 'TRACKING') {
      return { frame: null, status: 'TRACKING_LOST_SKIPPED' };
    }

    const validVertices = filterInvalidVertices(rawVertices);
    if (validVertices.length === 0) {
      return { frame: null, status: 'EMPTY_SKIPPED' };
    }

    const frameId = generateFrameId(sessionId, frameNumber);
    const frame: PointCloudFrame = {
      frameId,
      sessionId,
      scanPointId,
      timestamp: new Date().toISOString(),
      pointCount: validVertices.length,
      rawCoordinates: validVertices,
      confidenceScores: confidences.slice(0, validVertices.length),
      cameraPose,
      trackingState,
      trackingQuality,
      frameStatus: 'CAPTURED',
    };

    this.store.addFrame(frame);
    return { frame, status: 'CAPTURED' };
  }

  public clearData(): void {
    this.store.clearFrames();
  }
}
