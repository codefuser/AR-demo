/**
 * @file src/services/workflow/BuildingScanWorkflowManager.ts
 * @description Master Orchestrator for Unified Building Scan Workflow Engine.
 *
 * Automatically initializes and coordinates all underlying engines:
 *  1. ARCoreNativeBridgeService (Native AR Session)
 *  2. PlaneManager (Real Plane Detection)
 *  3. PointCloudManager (Raw Point Cloud Stream)
 *  4. WalkthroughManager (Movement Telemetry & Live AR Guidance)
 *  5. ARTrackingService (6-DOF Camera Pose Tracking)
 */

import { BuildingScanWorkflowStore } from './BuildingScanWorkflowStore';
import { BuildingScanWorkflowService } from './BuildingScanWorkflowService';
import { WalkthroughManager } from '../walkthrough/WalkthroughManager';
import { WalkthroughStore } from '../walkthrough/WalkthroughStore';
import { PlaneManager } from '../plane/PlaneManager';
import { PointCloudManager } from '../pointCloud/PointCloudManager';
import { ARTrackingService } from '../ar/native/ARTrackingService';
import ARCoreNativeBridgeService from '../ar/native/ARCoreNativeBridgeService';
import { calculateScanHealthScore } from '../../utils/buildingScanWorkflowUtils';
import type { BuildingScanWorkflowSummary, BuildingScanWorkflowState } from '../../types/buildingScanWorkflow';

export class BuildingScanWorkflowManager {
  private static instance: BuildingScanWorkflowManager;

  private store: BuildingScanWorkflowStore;
  private service: BuildingScanWorkflowService;
  private walkthroughManager: WalkthroughManager;
  private walkthroughStore: WalkthroughStore;
  private planeManager: PlaneManager;
  private cloudManager: PointCloudManager;
  private trackingService: ARTrackingService;
  private nativeBridge: ARCoreNativeBridgeService;

  private unsubscribeWalkthrough: (() => void) | null = null;
  private isOrchestrating = false;

  private constructor() {
    this.store = BuildingScanWorkflowStore.getInstance();
    this.service = BuildingScanWorkflowService.getInstance();
    this.walkthroughManager = WalkthroughManager.getInstance();
    this.walkthroughStore = WalkthroughStore.getInstance();
    this.planeManager = PlaneManager.getInstance();
    this.cloudManager = PointCloudManager.getInstance();
    this.trackingService = ARTrackingService.getInstance();
    this.nativeBridge = ARCoreNativeBridgeService.getInstance();
  }

  public static getInstance(): BuildingScanWorkflowManager {
    if (!BuildingScanWorkflowManager.instance) {
      BuildingScanWorkflowManager.instance = new BuildingScanWorkflowManager();
    }
    return BuildingScanWorkflowManager.instance;
  }

  /**
   * Starts the Unified Scan Workflow. Automatically initializes all underlying engines.
   */
  public async startWorkflow(buildingId: string, buildingName: string, floor = 1): Promise<void> {
    const sessionId = `scan_wf_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    this.store.updateSnapshot({
      sessionId,
      buildingId,
      buildingName,
      floor,
      state: 'PREPARING',
      progressPct: 5,
    });

    // 1. Start Native ARCore Bridge Session
    if (this.nativeBridge.isNativeModuleAvailable()) {
      this.nativeBridge.resumeSession();
    }

    // 2. Start Pose Tracking Service
    this.trackingService.startTracking();

    // 3. Start Real Plane Detection Engine
    this.planeManager.startPlaneDetection();

    // 4. Start Point Cloud Capture Engine
    this.cloudManager.startCaptureLoop();

    // 5. Start Walkthrough Engine
    await this.walkthroughManager.startWalkthrough(buildingId, buildingName, floor);

    this.isOrchestrating = true;
    this.store.updateSnapshot({
      state: 'SCANNING',
      progressPct: 15,
    });

    // 6. Subscribe to Walkthrough Engine telemetry stream & aggregate master snapshot
    this.unsubscribeWalkthrough = this.walkthroughStore.subscribe((wtSession) => {
      if (!wtSession || !this.isOrchestrating) return;

      const healthScore = calculateScanHealthScore(
        wtSession.trackingQuality,
        wtSession.walkingQuality,
        wtSession.detectedPlaneCount,
        wtSession.pointCloudCount,
      );

      let currentState: BuildingScanWorkflowState = 'SCANNING';
      if (wtSession.status === 'PAUSED') {
        currentState = 'PAUSED';
      } else if (wtSession.trackingQuality === 'NOT_AVAILABLE' || wtSession.status === 'TRACKING_LOST') {
        currentState = 'RECOVERING';
      }

      this.store.updateSnapshot({
        state: currentState,
        progressPct: wtSession.coverageEstimatePct,
        coverageEstimatePct: wtSession.coverageEstimatePct,
        scanHealthScore: healthScore,
        trackingState: wtSession.trackingState,
        trackingQuality: wtSession.trackingQuality,
        movementType: wtSession.movementType,
        walkingQuality: wtSession.walkingQuality,
        guidanceMessage: wtSession.guidanceMessage,
        detectedPlaneCount: wtSession.detectedPlaneCount,
        pointCloudCount: wtSession.pointCloudCount,
        scanPointCount: wtSession.scanPointCount,
        speedMps: wtSession.speedMps,
        elapsedTimeSeconds: wtSession.elapsedTimeSeconds,
        distanceWalkedMeters: wtSession.distanceWalkedMeters,
      });
    });
  }

  public pauseWorkflow(): void {
    this.walkthroughManager.pauseWalkthrough();
    this.store.updateSnapshot({ state: 'PAUSED' });
  }

  public resumeWorkflow(): void {
    this.walkthroughManager.resumeWalkthrough();
    this.store.updateSnapshot({ state: 'SCANNING' });
  }

  /**
   * Opens the Scan Preview summary modal.
   */
  public finishWorkflow(): void {
    this.walkthroughManager.pauseWalkthrough();

    const snapshot = this.store.getSnapshot();
    const summary: BuildingScanWorkflowSummary = {
      sessionId: snapshot.sessionId,
      buildingId: snapshot.buildingId,
      buildingName: snapshot.buildingName,
      floor: snapshot.floor,
      durationSeconds: snapshot.elapsedTimeSeconds,
      coverageEstimatePct: snapshot.coverageEstimatePct,
      pointCount: snapshot.pointCloudCount,
      planeCount: snapshot.detectedPlaneCount,
      scanPointCount: snapshot.scanPointCount,
      distanceWalkedMeters: snapshot.distanceWalkedMeters,
      trackingQualitySummary: snapshot.trackingQuality,
      timestamp: new Date().toISOString(),
    };

    this.store.updateSnapshot({
      state: 'PREVIEW',
      summary,
    });
  }

  /**
   * Saves the scan record and completes the workflow.
   */
  public saveScan(): void {
    const snapshot = this.store.getSnapshot();
    if (snapshot.summary) {
      this.service.saveScanSummary(snapshot.summary);
    } else {
      this.store.updateSnapshot({ state: 'COMPLETED' });
    }
    this.stopAllEngines();
  }

  /**
   * Discards the scan session without saving.
   */
  public discardScan(): void {
    this.stopAllEngines();
    this.store.updateSnapshot({ state: 'CANCELLED' });
  }

  public cancelWorkflow(): void {
    this.discardScan();
  }

  private stopAllEngines(): void {
    if (this.unsubscribeWalkthrough) {
      this.unsubscribeWalkthrough();
      this.unsubscribeWalkthrough = null;
    }
    this.isOrchestrating = false;
    this.walkthroughManager.completeWalkthrough();
    this.cloudManager.stopCaptureLoop();
    this.planeManager.stopPlaneDetection();
    this.trackingService.stopTracking();
  }
}
