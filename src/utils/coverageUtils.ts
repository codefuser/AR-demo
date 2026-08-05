/**
 * @file src/utils/coverageUtils.ts
 * @description Mathematics and 2D spatial grid cell hashing for Intelligent Coverage Analysis Engine.
 */

import type { Vector3D } from '../types/ar';
import { GRID_CELL_SIZE_METERS } from '../constants/coverage';

/**
 * Maps continuous 3D camera position (X, Z) into discrete 2D spatial grid cell coordinates.
 */
export function getGridCellCoordinates(position: Vector3D): { cellX: number; cellZ: number; cellId: string } {
  const cellX = Math.floor(position.x / GRID_CELL_SIZE_METERS);
  const cellZ = Math.floor(position.z / GRID_CELL_SIZE_METERS);
  const cellId = `cell_${cellX}_${cellZ}`;
  return { cellX, cellZ, cellId };
}

/**
 * Calculates visited floor area in square meters (m²) from total unique spatial grid cells.
 */
export function calculateVisitedAreaM2(uniqueCellCount: number): number {
  return Number((uniqueCellCount * GRID_CELL_SIZE_METERS * GRID_CELL_SIZE_METERS).toFixed(1));
}

/**
 * Calculates redundant scan percentage (re-visiting already mapped spatial cells).
 */
export function calculateRedundantScanPct(totalHits: number, uniqueCellCount: number): number {
  if (totalHits <= 0 || uniqueCellCount <= 0) return 0;
  const redundantHits = Math.max(0, totalHits - uniqueCellCount);
  const ratio = (redundantHits / totalHits) * 100;
  return Math.min(100, Math.round(ratio));
}
