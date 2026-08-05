/**
 * @file src/utils/scanValidationUtils.ts
 * @description 6-Factor Quality Scoring math & overall outcome decision logic.
 */

import type { ARTrackingQuality } from '../types/ar';
import type { WalkingQuality } from '../types/walkthrough';
import type {
  ScanValidationThresholds,
  ScanValidationScores,
  ScanValidationOutcome,
} from '../types/scanValidation';
import { ScanValidationRules, RuleEvaluationResult } from './scanValidationRules';

export class ScanValidationUtils {
  /**
   * Evaluates 6-Factor score breakdown (0% - 100%).
   */
  public static calculate6FactorScores(
    coveragePct: number,
    pointDensity: number,
    planeCount: number,
    trackingQuality: ARTrackingQuality,
    walkingQuality: WalkingQuality,
    speedMps: number,
  ): ScanValidationScores {
    const coverageScore = Math.min(100, Math.round((coveragePct / 70) * 100));
    const pointCloudScore = Math.min(100, Math.round((pointDensity / 20) * 100));
    const planeScore = Math.min(100, Math.round((planeCount / 4) * 100));

    let trackingScore = 50;
    if (trackingQuality === 'EXCELLENT') trackingScore = 100;
    else if (trackingQuality === 'GOOD') trackingScore = 80;
    else if (trackingQuality === 'LIMITED') trackingScore = 50;
    else trackingScore = 20;

    let movementScore = 80;
    if (walkingQuality === 'OPTIMAL') movementScore = 100;
    else if (walkingQuality === 'TOO_FAST') movementScore = 40;

    let stabilityScore = 80;
    if (speedMps <= 1.2 && trackingQuality !== 'POOR') stabilityScore = 95;
    else if (speedMps > 1.5) stabilityScore = 45;

    const overallScore = Math.round(
      coverageScore * 0.3 +
        trackingScore * 0.2 +
        pointCloudScore * 0.2 +
        planeScore * 0.1 +
        movementScore * 0.1 +
        stabilityScore * 0.1,
    );

    return {
      coverageScore,
      trackingScore,
      pointCloudScore,
      planeScore,
      movementScore,
      stabilityScore,
      overallScore: Math.min(100, overallScore),
    };
  }

  /**
   * Decides definitive validation outcome (`PASS`, `PASS_WITH_WARNINGS`, `INCOMPLETE`, `FAILED`).
   */
  public static determineOverallOutcome(
    scores: ScanValidationScores,
    ruleResults: RuleEvaluationResult[],
  ): { outcome: ScanValidationOutcome; warnings: string[]; recommendations: string[] } {
    const warnings: string[] = [];
    const recommendations: string[] = [];

    let failedRuleCount = 0;
    ruleResults.forEach((r) => {
      if (!r.passed) {
        failedRuleCount++;
        if (r.warning) warnings.push(r.warning);
        if (r.recommendation) recommendations.push(r.recommendation);
      }
    });

    let outcome: ScanValidationOutcome = 'PASS';

    if (scores.overallScore < 40 || scores.trackingScore < 40) {
      outcome = 'FAILED';
    } else if (scores.coverageScore < 70) {
      outcome = 'INCOMPLETE';
    } else if (failedRuleCount > 0 || scores.overallScore < 80) {
      outcome = 'PASS_WITH_WARNINGS';
    }

    return { outcome, warnings, recommendations };
  }
}
