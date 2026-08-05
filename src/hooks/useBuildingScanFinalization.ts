/**
 * @file src/hooks/useBuildingScanFinalization.ts
 * @description Custom React Hooks for Building Scan Finalization Engine.
 */

import { useState, useEffect, useCallback } from 'react';
import { BuildingScanFinalizationStore } from '../services/finalization/BuildingScanFinalizationStore';
import { BuildingScanFinalizationManager } from '../services/finalization/BuildingScanFinalizationManager';
import type { FinalizationState, FinalScanSummaryRecord } from '../types/buildingScanFinalization';

const store = BuildingScanFinalizationStore.getInstance();
const manager = BuildingScanFinalizationManager.getInstance();

export function useBuildingScanFinalization(): {
  state: FinalizationState;
  record: FinalScanSummaryRecord | null;
  errorMessage?: string;
} {
  const [state, setState] = useState<FinalizationState>(store.getState());
  const [record, setRecord] = useState<FinalScanSummaryRecord | null>(store.getActiveRecord());
  const [errorMessage, setErrorMessage] = useState<string | undefined>(store.getErrorMessage());

  useEffect(() => {
    let isMounted = true;
    const unsubscribe = store.subscribe((newState, newRecord, newErr) => {
      if (isMounted) {
        setState(newState);
        setRecord(newRecord);
        setErrorMessage(newErr);
      }
    });
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return {
    state,
    record,
    errorMessage,
  };
}

export function useBuildingScanFinalizationControl() {
  const finalizeScan = useCallback(
    (buildingId: string, buildingName: string) =>
      manager.finalizeScanSession(buildingId, buildingName),
    [],
  );

  const resetFinalization = useCallback(() => store.resetState(), []);

  return {
    finalizeScan,
    resetFinalization,
  };
}
