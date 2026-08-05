/**
 * @file src/utils/coverageValidator.ts
 * @description Automatic scan completion validator enforcing minimum thresholds for coverage, point density, and planes.
 */

import type { ARTrackingQuality } from '../types/ar';
import type { CoverageCompletionValidationResult } from '../types/coverage';
import {
  MIN_COMPLETION_COVERAGE_PCT,
  MIN_COMPLETION_POINT_DENSITY,
  MIN_COMPLETION_PLANES,
} from '../constants/coverage';

export class CoverageValidator {
  /**
   * Enforces minimum coverage %, point density, and plane thresholds before allowing scan completion.
   */
  public static validateScanCompletionReadiness(
    coveragePct: number,
    pointDensity: number,
    planeCount: number,
    trackingQuality: ARTrackingQuality,
  ): CoverageCompletionValidationResult {
    const isCoverageThresholdMet = coveragePct >= MIN_COMPLETION_COVERAGE_PCT;
    const isPointDensityMet = pointDensity >= MIN_COMPLETION_POINT_DENSITY;
    const isPlaneCoverageMet = planeCount >= MIN_COMPLETION_PLANES;
    const isTrackingQualityMet = trackingQuality === 'EXCELLENT' || trackingQuality === 'GOOD';

    if (!isCoverageThresholdMet) {
      return {
        isCoverageThresholdMet: false,
        isPointDensityMet,
        isPlaneCoverageMet,
        isTrackingQualityMet,
        canCompleteScan: false,
        blockingMessage: `Insufficient spatial coverage (${coveragePct}% < ${MIN_COMPLETION_COVERAGE_PCT}%). Continue walking unvisited areas.`,
      };
    }

    if (!isPointDensityMet) {
      return {
        isCoverageThresholdMet,
        isPointDensityMet: false,
        isPlaneCoverageMet,
        isTrackingQualityMet,
        canCompleteScan: false,
        blockingMessage: `Low point cloud density (${pointDensity.toFixed(1)} < ${MIN_COMPLETION_POINT_DENSITY} points/m²). Scan textured surfaces.`,
      };
    }

    if (!isPlaneCoverageMet) {
      return {
        isCoverageThresholdMet,
        isPointDensityMet,
        isPlaneCoverageMet: false,
        isTrackingQualityMet,
        canCompleteScan: false,
        blockingMessage: `Physical surface planes missing (${planeCount} < ${MIN_COMPLETION_PLANES}). Scan floors and walls.`,
      };
    }

    return {
      isCoverageThresholdMet: true,
      isPointDensityMet: true,
      isPlaneCoverageMet: true,
      isTrackingQualityMet: true,
      canCompleteScan: true,
    };
  }
}
