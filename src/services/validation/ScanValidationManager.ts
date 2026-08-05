/**
 * @file src/services/validation/ScanValidationManager.ts
 * @description Master Orchestrator for Intelligent Scan Validation Engine.
 *
 * Evaluates real VIO tracking metrics, spatial coverage estimates, raw point cloud feature density, physical plane counts, and walkthrough camera velocity parameters against a configurable validation threshold matrix.
 */

import { ScanValidationService } from './ScanValidationService';
import { ScanValidationStore } from './ScanValidationStore';
import { CoverageStore } from '../coverage/CoverageStore';
import { PointCloudStore } from '../pointCloud/PointCloudStore';
import { PlaneStore } from '../plane/PlaneStore';
import { WalkthroughStore } from '../walkthrough/WalkthroughStore';
import { ARStateStore } from '../ar/native/ARStateStore';
import { ScanValidationRules } from '../../utils/scanValidationRules';
import { ScanValidationUtils } from '../../utils/scanValidationUtils';
import type { ScanValidationReportModel } from '../../types/scanValidation';

export class ScanValidationManager {
  private static instance: ScanValidationManager;

  private service: ScanValidationService;
  private store: ScanValidationStore;
  private coverageStore: CoverageStore;
  private cloudStore: PointCloudStore;
  private planeStore: PlaneStore;
  private wtStore: WalkthroughStore;
  private arStore: ARStateStore;

  private constructor() {
    this.service = ScanValidationService.getInstance();
    this.store = ScanValidationStore.getInstance();
    this.coverageStore = CoverageStore.getInstance();
    this.cloudStore = PointCloudStore.getInstance();
    this.planeStore = PlaneStore.getInstance();
    this.wtStore = WalkthroughStore.getInstance();
    this.arStore = ARStateStore.getInstance();
  }

  public static getInstance(): ScanValidationManager {
    if (!ScanValidationManager.instance) {
      ScanValidationManager.instance = new ScanValidationManager();
    }
    return ScanValidationManager.instance;
  }

  /**
   * Executes the full Scan Validation evaluation pipeline on active telemetry stores.
   */
  public evaluateCurrentScan(buildingId = 'demo_b_1', buildingName = 'Sample Building'): ScanValidationReportModel {
    const thresholds = this.store.getThresholds();

    const coverageSnap = this.coverageStore.getSnapshot();
    const cloudStats = this.cloudStore.getStats();
    const planeStats = this.planeStore.getStats();
    const wtSession = this.wtStore.getActiveSession();
    const arState = this.arStore.getState();

    const speedMps = wtSession?.speedMps || 0;
    const distanceWalked = wtSession?.distanceWalkedMeters || 0;
    const trackingQuality = arState.metrics.trackingQuality;
    const walkingQuality = wtSession?.walkingQuality || 'OPTIMAL';

    // 1. Evaluate Modular Rules
    const rCoverage = ScanValidationRules.evaluateCoverageRule(coverageSnap.coveragePct, thresholds);
    const rTracking = ScanValidationRules.evaluateTrackingRule(trackingQuality, walkingQuality);
    const rPlane = ScanValidationRules.evaluatePlaneRule(planeStats.totalPlanes, thresholds);
    const rDensity = ScanValidationRules.evaluateDensityRule(coverageSnap.avgPointDensity, thresholds);
    const rWalk = ScanValidationRules.evaluateWalkthroughRule(speedMps, distanceWalked, thresholds);

    const ruleResults = [rCoverage, rTracking, rPlane, rDensity, rWalk];

    // 2. Calculate 6-Factor Score Breakdown
    const scores = ScanValidationUtils.calculate6FactorScores(
      coverageSnap.coveragePct,
      coverageSnap.avgPointDensity,
      planeStats.totalPlanes,
      trackingQuality,
      walkingQuality,
      speedMps,
    );

    // 3. Determine Overall Outcome (PASS, PASS_WITH_WARNINGS, INCOMPLETE, FAILED)
    const outcomeResult = ScanValidationUtils.determineOverallOutcome(scores, ruleResults);

    const report: ScanValidationReportModel = {
      evaluationId: `val_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      sessionId: wtSession?.sessionId || `session_${Date.now()}`,
      buildingId,
      buildingName,
      outcome: outcomeResult.outcome,
      overallScore: scores.overallScore,
      scores,
      warnings: outcomeResult.warnings,
      recommendations: outcomeResult.recommendations,
      thresholdsUsed: thresholds,
      timestamp: new Date().toISOString(),
    };

    this.service.logReport(report);
    return report;
  }
}
