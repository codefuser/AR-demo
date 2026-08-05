/**
 * @file src/utils/coverageStatistics.ts
 * @description 5-Factor Quality Scoring matrix math for Intelligent Coverage Analysis Engine.
 */

import type { ARTrackingQuality } from '../types/ar';
import type { CoverageScores } from '../types/coverage';

export class CoverageStatistics {
  /**
   * Evaluates 5-factor scan quality scores (0% - 100%).
   */
  public static calculateScores(
    coveragePct: number,
    pointDensity: number,
    trackingQuality: ARTrackingQuality,
    planeCount: number,
    distanceWalkedMeters: number,
  ): CoverageScores {
    const coverageScore = Math.min(100, Math.round((coveragePct / 80) * 100));

    const densityScore = Math.min(100, Math.round((pointDensity / 25) * 100));

    let trackingScore = 50;
    if (trackingQuality === 'EXCELLENT') trackingScore = 100;
    else if (trackingQuality === 'GOOD') trackingScore = 80;
    else if (trackingQuality === 'LIMITED') trackingScore = 50;
    else trackingScore = 20;

    const planeQualityScore = Math.min(100, Math.round((planeCount / 5) * 100));

    const walkthroughScore = Math.min(100, Math.round((distanceWalkedMeters / 40) * 100));

    const overallQualityScore = Math.round(
      coverageScore * 0.3 +
        densityScore * 0.25 +
        trackingScore * 0.25 +
        planeQualityScore * 0.1 +
        walkthroughScore * 0.1,
    );

    return {
      coverageScore,
      pointDensityScore: densityScore,
      trackingScore,
      planeQualityScore,
      walkthroughScore,
      overallQualityScore: Math.min(100, overallQualityScore),
    };
  }
}
