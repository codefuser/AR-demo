/**
 * @file src/constants/coverage.ts
 * @description Constants, grid cell size, minimum completion thresholds, and guidance messages for Coverage Analysis Engine.
 */

import type { CoverageQualityRating } from '../types/coverage';

/** Spatial 2D grid cell dimensions in meters (1.0m x 1.0m) */
export const GRID_CELL_SIZE_METERS = 1.0;

/** Default estimated building footprint fallback area in m² */
export const DEFAULT_ESTIMATED_BUILDING_AREA_M2 = 50.0;

/** Minimum thresholds required for automatic scan completion validation */
export const MIN_COMPLETION_COVERAGE_PCT = 70.0;
export const MIN_COMPLETION_POINT_DENSITY = 15.0; // points per m²
export const MIN_COMPLETION_PLANES = 2;

/** Live AR User Guidance prompts for coverage analysis */
export const COVERAGE_GUIDANCE_MESSAGES: Record<CoverageQualityRating, string> = {
  OPTIMAL: 'High spatial coverage. Building structure well mapped.',
  GOOD: 'Good progress. Continue walking to unvisited corridors.',
  SPARSE: 'Sparse feature density. Move to uncovered regions.',
  POOR: 'Low coverage. Walk along walls and floors to detect geometry.',
};
