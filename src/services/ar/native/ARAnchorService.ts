/**
 * @file src/services/ar/native/ARAnchorService.ts
 * @description Native AR Anchor Management Service.
 *
 * Manages:
 *  - Creating test spatial anchors
 *  - Removing anchors
 *  - Listing active anchors
 *  - Updating anchor lifetimes
 */

import { ARStateStore } from './ARStateStore';
import { createMockAnchor } from '../../../utils/arNativeUtils';
import type { ARAnchor } from '../../../types/arNative';
import type { Vector3D, Quaternion, EulerAngles } from '../../../types/ar';

export class ARAnchorService {
  private static instance: ARAnchorService;
  private stateStore: ARStateStore;
  private lifetimeInterval: ReturnType<typeof setInterval> | null = null;

  private constructor() {
    this.stateStore = ARStateStore.getInstance();
    this.startLifetimeTicker();
  }

  public static getInstance(): ARAnchorService {
    if (!ARAnchorService.instance) {
      ARAnchorService.instance = new ARAnchorService();
    }
    return ARAnchorService.instance;
  }

  /**
   * Creates a new spatial test anchor at specified or current camera pose coordinates.
   */
  public createAnchor(
    name = 'Test Anchor',
    position?: Vector3D,
    quaternion?: Quaternion,
    rotation?: EulerAngles,
  ): ARAnchor {
    const state = this.stateStore.getState();
    const targetPos = position || { ...state.metrics.pose.position };
    const targetQuat = quaternion || { ...state.metrics.pose.quaternion };
    const targetRot = rotation || { ...state.metrics.pose.rotation };

    const anchorName = `${name} #${state.anchors.length + 1}`;
    const newAnchor = createMockAnchor(anchorName, targetPos, targetQuat, targetRot);

    this.stateStore.addAnchor(newAnchor);
    return newAnchor;
  }

  /**
   * Removes a spatial anchor by ID.
   */
  public removeAnchor(id: string): void {
    this.stateStore.removeAnchor(id);
  }

  /**
   * Clears all active anchors.
   */
  public clearAllAnchors(): void {
    this.stateStore.clearAnchors();
  }

  /**
   * Returns list of active spatial anchors.
   */
  public getAnchors(): ARAnchor[] {
    return this.stateStore.getAnchors();
  }

  /**
   * Internal ticker to update lifetime duration (seconds) of active anchors.
   */
  private startLifetimeTicker(): void {
    if (this.lifetimeInterval) return;

    this.lifetimeInterval = setInterval(() => {
      const anchors = this.stateStore.getAnchors();
      if (anchors.length > 0) {
        anchors.forEach((anchor) => {
          this.stateStore.addAnchor({
            ...anchor,
            lifetimeSeconds: anchor.lifetimeSeconds + 1,
          });
        });
      }
    }, 1000);
  }
}
