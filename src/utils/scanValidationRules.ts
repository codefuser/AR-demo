/**
 * @file src/utils/scanValidationRules.ts
 * @description Modular validation rule evaluators returning warnings & recommendations.
 */

import type { ScanValidationThresholds } from '../types/scanValidation';
import type { ARTrackingQuality } from '../types/ar';
import type { WalkingQuality } from '../types/walkthrough';

export interface RuleEvaluationResult {
  ruleName: string;
  passed: boolean;
  warning?: string;
  recommendation?: string;
}

export class ScanValidationRules {
  public static evaluateCoverageRule(
    coveragePct: number,
    thresholds: ScanValidationThresholds,
  ): RuleEvaluationResult {
    const passed = coveragePct >= thresholds.minCoveragePct;
    return {
      ruleName: 'Coverage Threshold Rule',
      passed,
      warning: passed ? undefined : `Coverage too low (${coveragePct}% < ${thresholds.minCoveragePct}%).`,
      recommendation: passed ? undefined : 'Walk through remaining unvisited corridors to increase coverage.',
    };
  }

  public static evaluateTrackingRule(
    trackingQuality: ARTrackingQuality,
    walkingQuality: WalkingQuality,
  ): RuleEvaluationResult {
    const passed = trackingQuality === 'EXCELLENT' || trackingQuality === 'GOOD';
    return {
      ruleName: 'Tracking Stability Rule',
      passed,
      warning: passed ? undefined : `AR tracking quality insufficient (${trackingQuality}).`,
      recommendation: passed ? undefined : 'Keep camera stable and point toward well-lit textured surfaces.',
    };
  }

  public static evaluatePlaneRule(
    planeCount: number,
    thresholds: ScanValidationThresholds,
  ): RuleEvaluationResult {
    const passed = planeCount >= thresholds.minPlaneCount;
    return {
      ruleName: 'Plane Geometry Rule',
      passed,
      warning: passed ? undefined : `Plane detection insufficient (${planeCount} < ${thresholds.minPlaneCount}).`,
      recommendation: passed ? undefined : 'Slowly tilt camera toward floor and wall surfaces to detect geometry.',
    };
  }

  public static evaluateDensityRule(
    pointDensity: number,
    thresholds: ScanValidationThresholds,
  ): RuleEvaluationResult {
    const passed = pointDensity >= thresholds.minPointDensity;
    return {
      ruleName: 'Feature Density Rule',
      passed,
      warning: passed ? undefined : `Low feature point density (${pointDensity.toFixed(1)} < ${thresholds.minPointDensity} pts/m²).`,
      recommendation: passed ? undefined : 'Scan walls with posters or rich architectural texture.',
    };
  }

  public static evaluateWalkthroughRule(
    speedMps: number,
    distanceWalkedMeters: number,
    thresholds: ScanValidationThresholds,
  ): RuleEvaluationResult {
    const isSpeedOk = speedMps <= 1.5;
    const isDistOk = distanceWalkedMeters >= thresholds.minWalkDistanceMeters;
    const passed = isSpeedOk && isDistOk;

    let warning: string | undefined;
    let recommendation: string | undefined;

    if (!isSpeedOk) {
      warning = 'Walkthrough pace too fast (> 1.5 m/s).';
      recommendation = 'Walk slowly and maintain steady pace.';
    } else if (!isDistOk) {
      warning = `Walking distance too short (${distanceWalkedMeters.toFixed(1)}m < ${thresholds.minWalkDistanceMeters}m).`;
      recommendation = 'Walk further along building corridors.';
    }

    return {
      ruleName: 'Walkthrough Trajectory Rule',
      passed,
      warning,
      recommendation,
    };
  }
}
