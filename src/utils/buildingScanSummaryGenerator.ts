/**
 * @file src/utils/buildingScanSummaryGenerator.ts
 * @description Generates executive & technical summaries for scan finalization record.
 */

import type { ScanValidationReportModel } from '../types/scanValidation';
import type { CoverageMetricsSnapshot } from '../types/coverage';
import type {
  FinalScanMetadata,
  FinalScanStatistics,
  FinalScanReferences,
  FinalScanSummaryRecord,
} from '../types/buildingScanFinalization';
import { SCAN_SCHEMA_VERSION, APP_BUILD_VERSION, TARGET_DEVICE_PLATFORM } from '../constants/buildingScanFinalization';
import { calculateDurationSeconds } from './buildingScanFinalizationUtils';

export class BuildingScanSummaryGenerator {
  public static generateExecutiveSummary(
    buildingName: string,
    coveragePct: number,
    validationResult: string,
    planeCount: number,
  ): string {
    return `Building scan for "${buildingName}" completed successfully with an overall validation outcome of ${validationResult}. The scan achieved ${coveragePct}% spatial coverage across detected architectural planes (${planeCount} surface planes mapped).`;
  }

  public static generateTechnicalSummary(
    avgPointDensity: number,
    trackingQuality: string,
    distanceWalked: number,
    visitedCells: number,
  ): string {
    return `VIO tracking quality maintained at ${trackingQuality}. Average feature point density achieved ${avgPointDensity} pts/m² across ${visitedCells} unique 1m² spatial grid cells over a total walked trajectory of ${distanceWalked.toFixed(1)}m.`;
  }

  public static createFullScanSummaryRecord(
    buildingId: string,
    buildingName: string,
    validationReport: ScanValidationReportModel,
    coverageSnapshot: CoverageMetricsSnapshot,
    startTimeIso: string,
    planeIds: string[],
  ): FinalScanSummaryRecord {
    const endTimeIso = new Date().toISOString();
    const durationSeconds = calculateDurationSeconds(startTimeIso, endTimeIso);
    const scanId = `scan_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const metadata: FinalScanMetadata = {
      scanId,
      buildingId,
      sessionId: validationReport.sessionId,
      startTime: startTimeIso,
      endTime: endTimeIso,
      durationSeconds,
      scanVersion: SCAN_SCHEMA_VERSION,
      appVersion: APP_BUILD_VERSION,
      devicePlatform: TARGET_DEVICE_PLATFORM,
    };

    const statistics: FinalScanStatistics = {
      coveragePct: coverageSnapshot.coveragePct,
      coverageConfidencePct: coverageSnapshot.coverageConfidencePct,
      validationScore: validationReport.overallScore,
      validationResult: validationReport.outcome,
      trackingQuality: validationReport.scores.trackingScore >= 80 ? 'EXCELLENT' : 'GOOD',
      avgPointDensity: coverageSnapshot.avgPointDensity,
      planeCount: planeIds.length,
      visitedCellCount: coverageSnapshot.totalGridCells,
      distanceWalkedMeters: validationReport.scores.movementScore * 0.4,
      scores: validationReport.scores,
    };

    const references: FinalScanReferences = {
      spatialCellIds: Array.from({ length: coverageSnapshot.totalGridCells }, (_, i) => `cell_${i}`),
      planeReferenceIds: planeIds,
      pointCloudSessionId: `pcs_${validationReport.sessionId}`,
      walkthroughSessionId: `wts_${validationReport.sessionId}`,
    };

    return {
      scanId,
      buildingId,
      buildingName,
      metadata,
      statistics,
      references,
      warnings: validationReport.warnings,
      recommendations: validationReport.recommendations,
      executiveSummary: this.generateExecutiveSummary(
        buildingName,
        coverageSnapshot.coveragePct,
        validationReport.outcome,
        planeIds.length,
      ),
      technicalSummary: this.generateTechnicalSummary(
        coverageSnapshot.avgPointDensity,
        statistics.trackingQuality,
        statistics.distanceWalkedMeters,
        coverageSnapshot.totalGridCells,
      ),
      finalizedAt: endTimeIso,
    };
  }
}
