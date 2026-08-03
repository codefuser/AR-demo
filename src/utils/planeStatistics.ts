/**
 * @file src/utils/planeStatistics.ts
 * @description Calculates real-time plane statistics (counts, largest plane, surface areas).
 */

import type { ARNativePlaneModel, PlaneStats } from '../types/plane';

export class PlaneStatistics {
  public static calculate(planes: ARNativePlaneModel[]): PlaneStats {
    const validPlanes = planes.filter((p) => !p.subsumedByPlaneId && p.trackingState !== 'STOPPED');

    let horizontalCount = 0;
    let verticalCount = 0;
    let ceilingCount = 0;
    let totalAreaM2 = 0;
    let largestPlaneAreaM2 = 0;

    for (const plane of validPlanes) {
      if (plane.type === 'HORIZONTAL_FLOOR') horizontalCount++;
      else if (plane.type === 'VERTICAL_WALL') verticalCount++;
      else if (plane.type === 'CEILING') ceilingCount++;

      totalAreaM2 += plane.areaM2;
      if (plane.areaM2 > largestPlaneAreaM2) {
        largestPlaneAreaM2 = plane.areaM2;
      }
    }

    const avgPlaneAreaM2 =
      validPlanes.length > 0 ? Number((totalAreaM2 / validPlanes.length).toFixed(2)) : 0;

    return {
      totalPlanes: validPlanes.length,
      horizontalCount,
      verticalCount,
      ceilingCount,
      totalAreaM2: Number(totalAreaM2.toFixed(2)),
      largestPlaneAreaM2: Number(largestPlaneAreaM2.toFixed(2)),
      avgPlaneAreaM2,
    };
  }
}
