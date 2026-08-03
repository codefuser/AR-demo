/**
 * @file src/services/walkthrough/WalkthroughManager.ts
 * @description Core Building Walkthrough Engine Orchestrator.
 *
 * Listens to 60Hz AR camera pose updates, point cloud feature density, and plane counts.
 * Analyzes velocity (m/s), direction, movement type, walking quality, and produces live AR guidance prompts.
 */

import { WalkthroughService } from './WalkthroughService';
import { WalkthroughStore } from './WalkthroughStore';
import { ARStateStore } from '../ar/native/ARStateStore';
import { PointCloudStore } from '../pointCloud/PointCloudStore';
import { PlaneStore } from '../plane/PlaneStore';
import { ScanPointStore } from '../scanPoint/ScanPointStore';
import {
  calculateSpeedMps,
  calculateHeadingDegrees,
  getCardinalDirection,
  classifyMovementType,
  evaluateWalkingQuality,
  calculateCoverageEstimate,
} from '../../utils/walkthroughUtils';
import type { Vector3D, EulerAngles } from '../../types/ar';
import type { WalkthroughSession, WalkthroughStatus } from '../../types/walkthrough';

export class WalkthroughManager {
  private static instance: WalkthroughManager;
  private service: WalkthroughService;
  private store: WalkthroughStore;
  private arStore: ARStateStore;
  private cloudStore: PointCloudStore;
  private planeStore: PlaneStore;
  private pointStore: ScanPointStore;

  private unsubscribeAR: (() => void) | null = null;
  private timerIntervalId: ReturnType<typeof setInterval> | null = null;

  private previousPos: Vector3D | null = null;
  private previousRot: EulerAngles | null = null;
  private lastUpdateTime = 0;
  private totalDistanceMeters = 0;

  private constructor() {
    this.service = WalkthroughService.getInstance();
    this.store = WalkthroughStore.getInstance();
    this.arStore = ARStateStore.getInstance();
    this.cloudStore = PointCloudStore.getInstance();
    this.planeStore = PlaneStore.getInstance();
    this.pointStore = ScanPointStore.getInstance();
  }

  public static getInstance(): WalkthroughManager {
    if (!WalkthroughManager.instance) {
      WalkthroughManager.instance = new WalkthroughManager();
    }
    return WalkthroughManager.instance;
  }

  public async startWalkthrough(
    buildingId: string,
    buildingName: string,
    floor = 1,
  ): Promise<WalkthroughSession> {
    let session = this.store.getActiveSession();
    if (!session || session.status === 'COMPLETED' || session.status === 'CANCELLED') {
      session = this.service.createSession(buildingId, buildingName, floor);
    }

    this.service.updateStatus('WALKING');
    this.startTickerLoop();
    return session;
  }

  public pauseWalkthrough(): void {
    this.service.updateStatus('PAUSED');
  }

  public resumeWalkthrough(): void {
    this.service.updateStatus('WALKING');
  }

  public cancelWalkthrough(): void {
    this.stopTickerLoop();
    this.service.updateStatus('CANCELLED');
  }

  public completeWalkthrough(): void {
    this.stopTickerLoop();
    this.service.updateStatus('COMPLETED');
  }

  public resetWalkthrough(): void {
    this.stopTickerLoop();
    this.previousPos = null;
    this.previousRot = null;
    this.totalDistanceMeters = 0;
    this.service.resetSession();
  }

  private startTickerLoop(): void {
    if (this.unsubscribeAR) return;

    this.lastUpdateTime = Date.now();

    // 1. Subscribe to AR 60Hz Telemetry & Movement analysis
    this.unsubscribeAR = this.arStore.subscribe((arState) => {
      const activeSession = this.store.getActiveSession();
      if (!activeSession || activeSession.status !== 'WALKING') return;

      const currentPos = arState.metrics.pose.position;
      const currentRot = arState.metrics.pose.rotation;
      const now = Date.now();
      const timeDeltaSec = (now - this.lastUpdateTime) / 1000.0;

      if (timeDeltaSec > 0.1) {
        const speedMps = calculateSpeedMps(currentPos, this.previousPos, timeDeltaSec);
        const headingDegrees = calculateHeadingDegrees(currentRot.yaw);
        const cardinalDirection = getCardinalDirection(headingDegrees);

        const rotDeltaDeg = this.previousRot ? Math.abs(currentRot.yaw - this.previousRot.yaw) : 0;
        const rotDeltaDegSec = timeDeltaSec > 0 ? rotDeltaDeg / timeDeltaSec : 0;

        const movementType = classifyMovementType(speedMps, rotDeltaDegSec, rotDeltaDeg);

        // Distance accumulation
        if (this.previousPos && speedMps > 0.05) {
          const stepDist = calculateSpeedMps(currentPos, this.previousPos, timeDeltaSec) * timeDeltaSec;
          this.totalDistanceMeters += stepDist;
        }

        const cloudStats = this.cloudStore.getStats();
        const planeStats = this.planeStore.getStats();
        const scanPoints = this.pointStore.getState().pointCount;

        const isTrackingActive = arState.status === 'TRACKING';
        const qualityResult = evaluateWalkingQuality(
          speedMps,
          arState.metrics.trackingQuality,
          planeStats.totalPlanes,
          cloudStats.totalPoints,
          isTrackingActive,
        );

        const coverageEstimatePct = calculateCoverageEstimate(
          this.totalDistanceMeters,
          planeStats.totalPlanes,
        );

        this.store.updateSession({
          movementType,
          speedMps,
          headingDegrees,
          cardinalDirection,
          cameraPosition: { ...currentPos },
          walkingQuality: qualityResult.quality,
          guidanceMessage: qualityResult.guidanceMessage,
          trackingState: isTrackingActive ? 'TRACKING' : 'PAUSED',
          trackingQuality: arState.metrics.trackingQuality,
          detectedPlaneCount: planeStats.totalPlanes,
          pointCloudCount: cloudStats.totalPoints,
          scanPointCount: scanPoints,
          distanceWalkedMeters: Number(this.totalDistanceMeters.toFixed(1)),
          coverageEstimatePct,
        });

        this.previousPos = { ...currentPos };
        this.previousRot = { ...currentRot };
        this.lastUpdateTime = now;
      }
    });

    // 2. Elapsed Timer Interval
    this.timerIntervalId = setInterval(() => {
      const activeSession = this.store.getActiveSession();
      if (activeSession && activeSession.status === 'WALKING') {
        this.store.updateSession({
          elapsedTimeSeconds: activeSession.elapsedTimeSeconds + 1,
        });
      }
    }, 1000);
  }

  private stopTickerLoop(): void {
    if (this.unsubscribeAR) {
      this.unsubscribeAR();
      this.unsubscribeAR = null;
    }
    if (this.timerIntervalId) {
      clearInterval(this.timerIntervalId);
      this.timerIntervalId = null;
    }
  }
}
