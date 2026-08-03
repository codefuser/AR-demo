/**
 * @file src/services/ar/native/ARPlaneService.ts
 * @description Native AR Plane Detection Service.
 *
 * Tracks:
 *  - Horizontal planes (floor, desk surfaces)
 *  - Vertical planes (walls, doors)
 *  - Plane counts & surface extents $(m^2)$
 */

import { ARStateStore } from './ARStateStore';
import { createMockPlane } from '../../../utils/arNativeUtils';
import type { ARPlane, ARPlaneType } from '../../../types/arNative';
import type { Vector3D } from '../../../types/ar';

export class ARPlaneService {
  private static instance: ARPlaneService;
  private stateStore: ARStateStore;
  private detectionInterval: ReturnType<typeof setInterval> | null = null;

  private constructor() {
    this.stateStore = ARStateStore.getInstance();
  }

  public static getInstance(): ARPlaneService {
    if (!ARPlaneService.instance) {
      ARPlaneService.instance = new ARPlaneService();
    }
    return ARPlaneService.instance;
  }

  /**
   * Starts plane detection.
   * In simulation mode (or dev builds), populates detected surface planes based on pose movement.
   */
  public startPlaneDetection(): void {
    if (this.detectionInterval) return;

    // Detect initial floor plane at origin
    const initialFloor = createMockPlane(
      'HORIZONTAL_UPWARD_FACING',
      { x: 0, y: -1.2, z: 1.5 },
      4.2,
      3.5,
    );
    this.stateStore.addOrUpdatePlane(initialFloor);

    // Periodically detect wall & additional surfaces during user motion
    this.detectionInterval = setInterval(() => {
      const state = this.stateStore.getState();
      const currentPos = state.metrics.pose.position;

      if (state.planes.length < 4 && state.status === 'TRACKING') {
        const isVertical = state.planes.length % 2 === 1;
        const type: ARPlaneType = isVertical ? 'VERTICAL' : 'HORIZONTAL_UPWARD_FACING';

        const center: Vector3D = {
          x: Number((currentPos.x + (isVertical ? 1.8 : 0)).toFixed(2)),
          y: Number((currentPos.y + (isVertical ? 0 : -1.2)).toFixed(2)),
          z: Number((currentPos.z + 2.0).toFixed(2)),
        };

        const newPlane = createMockPlane(
          type,
          center,
          isVertical ? 3.0 : 4.0,
          isVertical ? 2.5 : 3.0,
        );
        this.stateStore.addOrUpdatePlane(newPlane);
      }
    }, 4000);
  }

  /**
   * Stops plane detection service.
   */
  public stopPlaneDetection(): void {
    if (this.detectionInterval) {
      clearInterval(this.detectionInterval);
      this.detectionInterval = null;
    }
  }

  /**
   * Returns list of currently detected planes.
   */
  public getDetectedPlanes(): ARPlane[] {
    return this.stateStore.getPlanes();
  }

  /**
   * Clears all detected planes.
   */
  public clearPlanes(): void {
    this.stateStore.clearPlanes();
  }
}
