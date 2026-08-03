/**
 * @file src/services/scanPoint/ScanPointService.ts
 * @description Low-Level Scan Point Service for Creating & Storing Scan Points.
 */

import { ScanPointStore } from './ScanPointStore';
import { generateScanPointId, isDuplicateScanPoint } from '../../utils/scanPointUtils';
import type { ScanPoint, ScanPointCaptureStatus } from '../../types/scanPoint';
import type { Vector3D, Quaternion, EulerAngles, ARTrackingQuality } from '../../types/ar';
import type { ARNativeTrackingState } from '../../types/arNative';

export class ScanPointService {
  private static instance: ScanPointService;
  private store: ScanPointStore;

  private constructor() {
    this.store = ScanPointStore.getInstance();
  }

  public static getInstance(): ScanPointService {
    if (!ScanPointService.instance) {
      ScanPointService.instance = new ScanPointService();
    }
    return ScanPointService.instance;
  }

  /**
   * Evaluates candidate pose and captures a Scan Point if valid and non-duplicate.
   */
  public capturePoint(
    sessionId: string,
    floor: number,
    pos: Vector3D,
    rot: EulerAngles,
    quat: Quaternion,
    trackingState: ARNativeTrackingState,
    trackingQuality: ARTrackingQuality,
    planeCount: number,
    anchorCount: number,
    frameNumber: number,
    featurePoints: number,
    duplicateThreshold = 0.3,
  ): { point: ScanPoint | null; status: ScanPointCaptureStatus } {
    if (trackingState !== 'TRACKING') {
      return { point: null, status: 'TRACKING_LOST_SKIPPED' };
    }

    const existingPoints = this.store.getPointsForSession(sessionId);
    const existingPos = existingPoints.map((p) => p.cameraPosition);

    if (isDuplicateScanPoint(pos, existingPos, duplicateThreshold)) {
      return { point: null, status: 'DUPLICATE_FILTERED' };
    }

    const pointId = generateScanPointId(sessionId, existingPoints.length + 1);
    const newPoint: ScanPoint = {
      pointId,
      sessionId,
      timestamp: new Date().toISOString(),
      floor,
      cameraPosition: { ...pos },
      cameraRotation: { ...rot },
      quaternion: { ...quat },
      trackingState,
      trackingQuality,
      detectedPlaneCount: planeCount,
      anchorCount,
      frameNumber,
      deviceOrientation: 'PORTRAIT',
      featurePointCount: featurePoints,
      captureStatus: 'CAPTURED',
    };

    this.store.addPoint(newPoint);
    return { point: newPoint, status: 'CAPTURED' };
  }

  public clearSessionPoints(): void {
    this.store.clearPoints();
  }
}
