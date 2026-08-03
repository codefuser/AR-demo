/**
 * @file src/services/scanSession/ScanSessionService.ts
 * @description Low-Level Building Scan Session Data & CRUD Service.
 */

import { ScanSessionStore } from './ScanSessionStore';
import { generateScanSessionId } from '../../utils/scanSessionUtils';
import { DEFAULT_SCAN_POINT_TARGET } from '../../constants/scanSession';
import type { ScanSession, ScanSessionStatus } from '../../types/scanSession';

export class ScanSessionService {
  private static instance: ScanSessionService;
  private store: ScanSessionStore;

  private constructor() {
    this.store = ScanSessionStore.getInstance();
  }

  public static getInstance(): ScanSessionService {
    if (!ScanSessionService.instance) {
      ScanSessionService.instance = new ScanSessionService();
    }
    return ScanSessionService.instance;
  }

  /**
   * Creates a new ScanSession model.
   */
  public createScanSession(
    buildingId: string,
    buildingName: string,
    floor = 1,
    targetScanPoints = DEFAULT_SCAN_POINT_TARGET,
  ): ScanSession {
    const now = new Date().toISOString();
    const sessionId = generateScanSessionId(buildingId);

    const session: ScanSession = {
      sessionId,
      buildingId,
      buildingName,
      currentFloor: floor,
      createdDate: now,
      startedDate: null,
      finishedDate: null,
      currentStatus: 'CREATED',
      currentStage: 'INITIALIZING',
      progressPercentage: 0,
      elapsedTimeSeconds: 0,
      estimatedRemainingTimeSeconds: 300,
      currentScanPointCount: 0,
      totalScanPoints: targetScanPoints,
      trackingQuality: 'NOT_AVAILABLE',
      deviceCompatibility: null,
      sessionNotes: '',
    };

    this.store.saveSession(session);
    this.store.setActiveSessionId(sessionId);
    return session;
  }

  /**
   * Gets session by ID.
   */
  public getSession(sessionId: string): ScanSession | null {
    return this.store.getSessionById(sessionId);
  }

  /**
   * Updates session fields.
   */
  public updateSession(sessionId: string, updates: Partial<ScanSession>): void {
    const existing = this.store.getSessionById(sessionId);
    if (existing) {
      this.store.saveSession({
        ...existing,
        ...updates,
      });
    }
  }

  /**
   * Deletes session.
   */
  public deleteSession(sessionId: string): void {
    this.store.deleteSession(sessionId);
  }
}
