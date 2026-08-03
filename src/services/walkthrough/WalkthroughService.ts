/**
 * @file src/services/walkthrough/WalkthroughService.ts
 * @description Low-level service for creating, updating, and finishing Walkthrough Sessions.
 */

import { WalkthroughStore } from './WalkthroughStore';
import { ZERO_VECTOR } from '../../constants/ar';
import type { WalkthroughSession, WalkthroughStatus } from '../../types/walkthrough';

export class WalkthroughService {
  private static instance: WalkthroughService;
  private store: WalkthroughStore;

  private constructor() {
    this.store = WalkthroughStore.getInstance();
  }

  public static getInstance(): WalkthroughService {
    if (!WalkthroughService.instance) {
      WalkthroughService.instance = new WalkthroughService();
    }
    return WalkthroughService.instance;
  }

  /**
   * Creates a new Walkthrough Session.
   */
  public createSession(
    buildingId: string,
    buildingName: string,
    currentFloor = 1,
  ): WalkthroughSession {
    const sessionId = `wt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const newSession: WalkthroughSession = {
      sessionId,
      buildingId,
      buildingName,
      currentFloor,
      startedAt: new Date().toISOString(),
      status: 'IDLE',
      movementType: 'STATIONARY',
      speedMps: 0,
      headingDegrees: 0,
      cardinalDirection: 'N',
      cameraPosition: { ...ZERO_VECTOR },
      walkingQuality: 'OPTIMAL',
      guidanceMessage: 'Press Start Walkthrough to begin indoor movement analysis.',
      trackingState: 'STOPPED',
      trackingQuality: 'NOT_AVAILABLE',
      detectedPlaneCount: 0,
      pointCloudCount: 0,
      scanPointCount: 0,
      elapsedTimeSeconds: 0,
      distanceWalkedMeters: 0,
      coverageEstimatePct: 0,
    };

    this.store.setSession(newSession);
    return newSession;
  }

  public updateStatus(status: WalkthroughStatus): void {
    const session = this.store.getActiveSession();
    if (!session) return;

    const updates: Partial<WalkthroughSession> = { status };
    if (status === 'COMPLETED' || status === 'CANCELLED' || status === 'FAILED') {
      updates.finishedAt = new Date().toISOString();
    }

    this.store.updateSession(updates);
  }

  public resetSession(): void {
    this.store.setSession(null);
  }
}
