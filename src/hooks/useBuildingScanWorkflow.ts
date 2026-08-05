/**
 * @file src/hooks/useBuildingScanWorkflow.ts
 * @description Custom React Hooks for Unified Building Scan Workflow Engine.
 */

import { useState, useEffect, useCallback } from 'react';
import { BuildingScanWorkflowStore } from '../services/workflow/BuildingScanWorkflowStore';
import { BuildingScanWorkflowManager } from '../services/workflow/BuildingScanWorkflowManager';
import { BuildingScanWorkflowValidator } from '../utils/buildingScanWorkflowValidator';
import type { BuildingScanWorkflowSnapshot, BuildingScanPreValidationResult } from '../types/buildingScanWorkflow';

const store = BuildingScanWorkflowStore.getInstance();
const manager = BuildingScanWorkflowManager.getInstance();

export function useBuildingScanWorkflow(): {
  snapshot: BuildingScanWorkflowSnapshot;
  validation: BuildingScanPreValidationResult;
} {
  const [snapshot, setSnapshot] = useState<BuildingScanWorkflowSnapshot>(store.getSnapshot());

  useEffect(() => {
    let isMounted = true;
    const unsubscribe = store.subscribe((newSnapshot) => {
      if (isMounted) {
        setSnapshot(newSnapshot);
      }
    });
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const validation = BuildingScanWorkflowValidator.validatePreScanReadiness(true, true, true, true);

  return {
    snapshot,
    validation,
  };
}

export function useBuildingScanWorkflowControl() {
  const startWorkflow = useCallback(
    (buildingId: string, buildingName: string, floor = 1) =>
      manager.startWorkflow(buildingId, buildingName, floor),
    [],
  );
  const pauseWorkflow = useCallback(() => manager.pauseWorkflow(), []);
  const resumeWorkflow = useCallback(() => manager.resumeWorkflow(), []);
  const finishWorkflow = useCallback(() => manager.finishWorkflow(), []);
  const saveScan = useCallback(() => manager.saveScan(), []);
  const discardScan = useCallback(() => manager.discardScan(), []);
  const cancelWorkflow = useCallback(() => manager.cancelWorkflow(), []);

  return {
    startWorkflow,
    pauseWorkflow,
    resumeWorkflow,
    finishWorkflow,
    saveScan,
    discardScan,
    cancelWorkflow,
  };
}
