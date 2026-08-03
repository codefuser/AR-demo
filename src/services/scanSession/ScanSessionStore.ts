/**
 * @file src/services/scanSession/ScanSessionStore.ts
 * @description Observable State Store for Building Scan Sessions.
 *
 * Manages:
 *  - Active Scan Session snapshot
 *  - All historical Scan Sessions map (`sessionId -> ScanSession`)
 *  - Observable subscription listeners for UI updates
 */

import type { ScanSession, ScanSessionStatus } from '../../types/scanSession';

export type ScanSessionListener = (state: ScanSessionStoreState) => void;

export interface ScanSessionStoreState {
  activeSession: ScanSession | null;
  sessionsList: ScanSession[];
}

export class ScanSessionStore {
  private static instance: ScanSessionStore;

  private activeSessionId: string | null = null;
  private sessions: Map<string, ScanSession> = new Map();
  private listeners: Set<ScanSessionListener> = new Set();

  private constructor() {}

  public static getInstance(): ScanSessionStore {
    if (!ScanSessionStore.instance) {
      ScanSessionStore.instance = new ScanSessionStore();
    }
    return ScanSessionStore.instance;
  }

  public getState(): ScanSessionStoreState {
    const activeSession = this.activeSessionId ? this.sessions.get(this.activeSessionId) || null : null;
    return {
      activeSession: activeSession ? { ...activeSession } : null,
      sessionsList: Array.from(this.sessions.values()).map((s) => ({ ...s })),
    };
  }

  public getSessionById(sessionId: string): ScanSession | null {
    const s = this.sessions.get(sessionId);
    return s ? { ...s } : null;
  }

  public getSessionsForBuilding(buildingId: string): ScanSession[] {
    return Array.from(this.sessions.values())
      .filter((s) => s.buildingId === buildingId)
      .map((s) => ({ ...s }));
  }

  public saveSession(session: ScanSession): void {
    this.sessions.set(session.sessionId, { ...session });
    this.notifyListeners();
  }

  public setActiveSessionId(id: string | null): void {
    this.activeSessionId = id;
    this.notifyListeners();
  }

  public updateSessionStatus(sessionId: string, status: ScanSessionStatus, extra?: Partial<ScanSession>): void {
    const s = this.sessions.get(sessionId);
    if (s) {
      const updated: ScanSession = {
        ...s,
        currentStatus: status,
        ...extra,
      };
      this.sessions.set(sessionId, updated);
      this.notifyListeners();
    }
  }

  public deleteSession(sessionId: string): void {
    if (this.sessions.has(sessionId)) {
      this.sessions.delete(sessionId);
      if (this.activeSessionId === sessionId) {
        this.activeSessionId = null;
      }
      this.notifyListeners();
    }
  }

  public subscribe(listener: ScanSessionListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    const currentState = this.getState();
    this.listeners.forEach((listener) => listener(currentState));
  }

  public resetAll(): void {
    this.activeSessionId = null;
    this.sessions.clear();
    this.notifyListeners();
  }
}
