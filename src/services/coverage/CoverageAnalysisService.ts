/**
 * @file src/services/coverage/CoverageAnalysisService.ts
 * @description Low-level service for mapping spatial positions into 2D grid cells.
 */

import { CoverageStore } from './CoverageStore';
import { getGridCellCoordinates } from '../../utils/coverageUtils';
import type { Vector3D } from '../../types/ar';
import type { SpatialGridCell } from '../../types/coverage';

export class CoverageAnalysisService {
  private static instance: CoverageAnalysisService;
  private store: CoverageStore;
  private totalPositionHits = 0;

  private constructor() {
    this.store = CoverageStore.getInstance();
  }

  public static getInstance(): CoverageAnalysisService {
    if (!CoverageAnalysisService.instance) {
      CoverageAnalysisService.instance = new CoverageAnalysisService();
    }
    return CoverageAnalysisService.instance;
  }

  /**
   * Processes continuous camera 3D pose position and updates spatial grid cell map.
   */
  public registerPosition(position: Vector3D, pointCount: number, planeCount: number): SpatialGridCell {
    this.totalPositionHits++;
    const { cellX, cellZ, cellId } = getGridCellCoordinates(position);
    const existingMap = this.store.getGridCells();
    const existingCell = existingMap.get(cellId);

    const nowIso = new Date().toISOString();

    let updatedCell: SpatialGridCell;

    if (existingCell) {
      updatedCell = {
        ...existingCell,
        visitCount: existingCell.visitCount + 1,
        pointCount: Math.max(existingCell.pointCount, pointCount),
        planeCount: Math.max(existingCell.planeCount, planeCount),
        lastVisitedAt: nowIso,
      };
    } else {
      updatedCell = {
        cellId,
        cellX,
        cellZ,
        visitCount: 1,
        pointCount,
        planeCount,
        firstVisitedAt: nowIso,
        lastVisitedAt: nowIso,
      };
    }

    this.store.updateCell(updatedCell);
    return updatedCell;
  }

  public getTotalPositionHits(): number {
    return this.totalPositionHits;
  }

  public resetData(): void {
    this.totalPositionHits = 0;
    this.store.resetData();
  }
}
