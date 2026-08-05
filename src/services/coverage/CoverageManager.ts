/**
 * @file src/services/coverage/CoverageManager.ts
 * @description Master Orchestrator for Intelligent Coverage Analysis Engine.
 *
 * Subscribes to real 60Hz AR camera pose updates, point cloud feature density, and detected physical planes.
 * Computes unique visited 2D spatial grid cells (1m x 1m), redundant walking %, 5-factor quality scores, and live guidance prompts.
 */

import { CoverageAnalysisService } from './CoverageAnalysisService';
import { CoverageStore } from './CoverageStore';
import { ARStateStore } from '../ar/native/ARStateStore';
import { PointCloudStore } from '../pointCloud/PointCloudStore';
import { PlaneStore } from '../plane/PlaneStore';
import { WalkthroughStore } from '../walkthrough/WalkthroughStore';
import {
  calculateVisitedAreaM2,
  calculateRedundantScanPct,
} from '../../utils/coverageUtils';
import {
  estimateTotalBuildingAreaM2,
  calculateCoveragePct,
  evaluateCoverageQuality,
} from '../../utils/coverageEstimator';
import { CoverageStatistics } from '../../utils/coverageStatistics';
import { CoverageValidator } from '../../utils/coverageValidator';

export class CoverageManager {
  private static instance: CoverageManager;

  private service: CoverageAnalysisService;
  private store: CoverageStore;
  private arStore: ARStateStore;
  private cloudStore: PointCloudStore;
  private planeStore: PlaneStore;
  private wtStore: WalkthroughStore;

  private unsubscribeAR: (() => void) | null = null;
  private isAnalyzing = false;

  private constructor() {
    this.service = CoverageAnalysisService.getInstance();
    this.store = CoverageStore.getInstance();
    this.arStore = ARStateStore.getInstance();
    this.cloudStore = PointCloudStore.getInstance();
    this.planeStore = PlaneStore.getInstance();
    this.wtStore = WalkthroughStore.getInstance();
  }

  public static getInstance(): CoverageManager {
    if (!CoverageManager.instance) {
      CoverageManager.instance = new CoverageManager();
    }
    return CoverageManager.instance;
  }

  /**
   * Starts real-time coverage analysis telemetry loop.
   */
  public startAnalysis(): void {
    if (this.isAnalyzing) return;
    this.isAnalyzing = true;

    this.unsubscribeAR = this.arStore.subscribe((arState) => {
      if (!this.isAnalyzing || arState.status !== 'TRACKING') return;

      const position = arState.metrics.pose.position;
      const cloudStats = this.cloudStore.getStats();
      const planeStats = this.planeStore.getStats();
      const wtSession = this.wtStore.getActiveSession();

      // Register spatial pose position in 2D spatial grid cell map
      this.service.registerPosition(position, cloudStats.totalPoints, planeStats.totalPlanes);

      const gridCellsMap = this.store.getGridCells();
      const uniqueCellCount = gridCellsMap.size;
      const totalHits = this.service.getTotalPositionHits();

      const visitedAreaM2 = calculateVisitedAreaM2(uniqueCellCount);
      const estimatedTotalAreaM2 = estimateTotalBuildingAreaM2(visitedAreaM2, planeStats.totalAreaM2);
      const coveragePct = calculateCoveragePct(visitedAreaM2, estimatedTotalAreaM2);
      const unvisitedPct = Math.max(0, 100 - coveragePct);
      const redundantScanPct = calculateRedundantScanPct(totalHits, uniqueCellCount);

      const avgPointDensity = visitedAreaM2 > 0 ? Number((cloudStats.totalPoints / visitedAreaM2).toFixed(1)) : 0;
      const qualityResult = evaluateCoverageQuality(coveragePct, avgPointDensity, planeStats.totalPlanes);

      const scores = CoverageStatistics.calculateScores(
        coveragePct,
        avgPointDensity,
        arState.metrics.trackingQuality,
        planeStats.totalPlanes,
        wtSession?.distanceWalkedMeters || 0,
      );

      const validation = CoverageValidator.validateScanCompletionReadiness(
        coveragePct,
        avgPointDensity,
        planeStats.totalPlanes,
        arState.metrics.trackingQuality,
      );

      this.store.updateSnapshot({
        visitedAreaM2,
        estimatedTotalAreaM2,
        coveragePct,
        coverageConfidencePct: Math.min(100, Math.round(90 + (planeStats.totalPlanes > 2 ? 10 : 0))),
        redundantScanPct,
        unvisitedPct,
        avgPointDensity,
        qualityRating: qualityResult.rating,
        scores,
        guidanceMessage: qualityResult.guidanceMessage,
        totalGridCells: uniqueCellCount,
        isCompletionEligible: validation.canCompleteScan,
        completionBlockingMessage: validation.blockingMessage,
      });
    });
  }

  public stopAnalysis(): void {
    if (this.unsubscribeAR) {
      this.unsubscribeAR();
      this.unsubscribeAR = null;
    }
    this.isAnalyzing = false;
  }

  public resetCoverage(): void {
    this.stopAnalysis();
    this.service.resetData();
  }
}
