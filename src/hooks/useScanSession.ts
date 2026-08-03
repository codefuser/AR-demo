/**
 * @file src/hooks/useScanSession.ts
 * @description Custom React Hooks for Building Scan Session Engine.
 *
 * Exposes:
 *  - useScanSession(sessionId?): Active scan session state, progress, and stage metrics
 *  - useScanSessionControl(): Actions (create, start, pause, resume, cancel, complete, delete, reset)
 *  - useScanSessionList(buildingId?): Filtered list of historical sessions for a building
 */

import { useState, useEffect, useCallback } from 'react';
import { ScanSessionStore, type ScanSessionStoreState } from '../services/scanSession/ScanSessionStore';
import { ScanSessionManager } from '../services/scanSession/ScanSessionManager';
import type { ScanSession, ScanSessionValidation } from '../types/scanSession';

const store = ScanSessionStore.getInstance();
const manager = ScanSessionManager.getInstance();

export function useScanSessionStore(): ScanSessionStoreState {
  const [state, setState] = useState<ScanSessionStoreState>(store.getState());

  useEffect(() => {
    let isMounted = true;
    const unsubscribe = store.subscribe((newState) => {
      if (isMounted) {
        setState(newState);
      }
    });
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return state;
}

export function useScanSession(targetSessionId?: string): {
  session: ScanSession | null;
  validation: ScanSessionValidation | null;
  validateReadiness: () => Promise<ScanSessionValidation>;
} {
  const state = useScanSessionStore();
  const session = targetSessionId
    ? store.getSessionById(targetSessionId)
    : state.activeSession;

  const [validation, setValidation] = useState<ScanSessionValidation | null>(null);

  const validateReadiness = useCallback(async () => {
    const res = await manager.validatePreScanReadiness(session?.buildingId);
    setValidation(res);
    return res;
  }, [session?.buildingId]);

  useEffect(() => {
    if (session?.buildingId) {
      validateReadiness();
    }
  }, [session?.buildingId, validateReadiness]);

  return {
    session,
    validation,
    validateReadiness,
  };
}

export function useScanSessionControl() {
  const createSession = useCallback(
    (buildingId: string, buildingName: string, floor = 1) =>
      manager.createSession(buildingId, buildingName, floor),
    [],
  );

  const startSession = useCallback(
    (sessionId: string) => manager.startSession(sessionId),
    [],
  );

  const pauseSession = useCallback(
    (sessionId: string) => manager.pauseSession(sessionId),
    [],
  );

  const resumeSession = useCallback(
    (sessionId: string) => manager.resumeSession(sessionId),
    [],
  );

  const cancelSession = useCallback(
    (sessionId: string) => manager.cancelSession(sessionId),
    [],
  );

  const completeSession = useCallback(
    (sessionId: string) => manager.completeSession(sessionId),
    [],
  );

  const resetSession = useCallback(
    (sessionId: string) => manager.resetSession(sessionId),
    [],
  );

  const deleteSession = useCallback(
    (sessionId: string) => manager.deleteSession(sessionId),
    [],
  );

  return {
    createSession,
    startSession,
    pauseSession,
    resumeSession,
    cancelSession,
    completeSession,
    resetSession,
    deleteSession,
  };
}

export function useScanSessionList(buildingId?: string): ScanSession[] {
  const state = useScanSessionStore();
  if (buildingId) {
    return state.sessionsList.filter((s) => s.buildingId === buildingId);
  }
  return state.sessionsList;
}
