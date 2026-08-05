/**
 * @file src/types/coverage.ts
 * @description Intelligent Coverage Analysis Engine TypeScript types and interfaces.
 */

import type { ARTrackingQuality } from './ar';

/**
 * Single 2D spatial grid cell occupied during building walkthrough scanning.
 * Grid cell size is 1.0m x 1.0m on horizontal plane (X, Z).
 */
export interface SpatialGridCell {
  /** Cell ID key (e.g. `cell_2_-5`). */
  cellId: string;
  /** X integer coordinate index. */
  cellX: number;
  /** Z integer coordinate index. */
  cellZ: number;
  /** Number of times camera traversed this grid cell. */
  visitCount: number;
  /** Cumulative 3D point cloud feature vertices inside cell. */
  pointCount: number;
  /** Detected surface planes intersecting cell. */
  planeCount: number;
  /** ISO string when cell was first visited. */
  firstVisitedAt: string;
  /** ISO string when cell was last visited. */
  lastVisitedAt: string;
}

/**
 * Coverage quality classification rating.
 */
export type CoverageQualityRating = 'OPTIMAL' | 'GOOD' | 'SPARSE' | 'POOR';

/**
 * 5-Factor Scan Quality Scoring breakdown (0% - 100%).
 */
export interface CoverageScores {
  coverageScore: number;
  pointDensityScore: number;
  trackingScore: number;
  planeQualityScore: number;
  walkthroughScore: number;
  overallQualityScore: number;
}

/**
 * Master coverage analysis metrics snapshot.
 */
export interface CoverageMetricsSnapshot {
  /** Total unique visited floor area in square meters (m²). */
  visitedAreaM2: number;
  /** Estimated total building floor area in square meters (m²). */
  estimatedTotalAreaM2: number;
  /** Calculated real coverage percentage (0% - 100%). */
  coveragePct: number;
  /** Confidence rating of spatial coverage math (0% - 100%). */
  coverageConfidencePct: number;
  /** Redundant walking trajectory ratio (0% - 100%). */
  redundantScanPct: number;
  /** Unvisited floor area percentage (0% - 100%). */
  unvisitedPct: number;
  /** Average 3D feature points per square meter (points/m²). */
  avgPointDensity: number;
  /** Coverage quality rating classification. */
  qualityRating: CoverageQualityRating;
  /** 5-Factor quality scoring breakdown. */
  scores: CoverageScores;
  /** Live AR User Guidance instruction prompt. */
  guidanceMessage: string;
  /** Total unique spatial grid cells logged. */
  totalGridCells: number;
  /** Whether coverage and density meet scan completion threshold rules. */
  isCompletionEligible: boolean;
  /** Reason message if completion rules fail. */
  completionBlockingMessage?: string;
}

/**
 * Scan Completion Validation result.
 */
export interface CoverageCompletionValidationResult {
  isCoverageThresholdMet: boolean;
  isPointDensityMet: boolean;
  isPlaneCoverageMet: boolean;
  isTrackingQualityMet: boolean;
  canCompleteScan: boolean;
  blockingMessage?: string;
}
