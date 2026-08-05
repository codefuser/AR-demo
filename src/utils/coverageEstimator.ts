/**
 * @file src/utils/coverageEstimator.ts
 * @description Building footprint estimation & coverage quality evaluation.
 */

import type { CoverageQualityRating } from '../types/coverage';
import { DEFAULT_ESTIMATED_BUILDING_AREA_M2, COVERAGE_GUIDANCE_MESSAGES } from '../constants/coverage';

/**
 * Dynamically estimates total building floor area (m²) from camera bounding extents and surface planes.
 */
export function estimateTotalBuildingAreaM2(
  visitedAreaM2: number,
  totalPlaneAreaM2: number,
): number {
  const dynamicEst = Math.max(DEFAULT_ESTIMATED_BUILDING_AREA_M2, visitedAreaM2 + totalPlaneAreaM2 * 0.5);
  return Number(dynamicEst.toFixed(1));
}

/**
 * Calculates coverage percentage (0% - 100%).
 */
export function calculateCoveragePct(visitedAreaM2: number, estimatedTotalAreaM2: number): number {
  if (estimatedTotalAreaM2 <= 0) return 0;
  const pct = (visitedAreaM2 / estimatedTotalAreaM2) * 100;
  return Math.min(100, Math.round(pct));
}

/**
 * Evaluates coverage quality rating and selects appropriate guidance prompt.
 */
export function evaluateCoverageQuality(
  coveragePct: number,
  avgPointDensity: number,
  planeCount: number,
): { rating: CoverageQualityRating; guidanceMessage: string } {
  if (coveragePct >= 70 && avgPointDensity >= 15 && planeCount >= 2) {
    return { rating: 'OPTIMAL', guidanceMessage: COVERAGE_GUIDANCE_MESSAGES.OPTIMAL };
  }
  if (coveragePct >= 40 && avgPointDensity >= 10) {
    return { rating: 'GOOD', guidanceMessage: COVERAGE_GUIDANCE_MESSAGES.GOOD };
  }
  if (coveragePct >= 20) {
    return { rating: 'SPARSE', guidanceMessage: COVERAGE_GUIDANCE_MESSAGES.SPARSE };
  }
  return { rating: 'POOR', guidanceMessage: COVERAGE_GUIDANCE_MESSAGES.POOR };
}
