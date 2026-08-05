/**
 * @file src/hooks/useScanValidation.ts
 * @description Custom React Hooks for Intelligent Scan Validation Engine.
 */

import { useState, useEffect, useCallback } from 'react';
import { ScanValidationStore } from '../services/validation/ScanValidationStore';
import { ScanValidationManager } from '../services/validation/ScanValidationManager';
import type { ScanValidationThresholds, ScanValidationReportModel } from '../types/scanValidation';

const store = ScanValidationStore.getInstance();
const manager = ScanValidationManager.getInstance();

export function useScanValidation(): {
  thresholds: ScanValidationThresholds;
  report: ScanValidationReportModel | null;
} {
  const [thresholds, setThresholds] = useState<ScanValidationThresholds>(store.getThresholds());
  const [report, setReport] = useState<ScanValidationReportModel | null>(store.getActiveReport());

  useEffect(() => {
    let isMounted = true;
    const unsubscribe = store.subscribe((newThresholds, newReport) => {
      if (isMounted) {
        setThresholds(newThresholds);
        setReport(newReport);
      }
    });
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return {
    thresholds,
    report,
  };
}

export function useScanValidationControl() {
  const evaluateScan = useCallback(
    (buildingId?: string, buildingName?: string) =>
      manager.evaluateCurrentScan(buildingId, buildingName),
    [],
  );
  const updateThresholds = useCallback(
    (payload: Partial<ScanValidationThresholds>) =>
      store.updateThresholds(payload),
    [],
  );
  const resetValidation = useCallback(() => store.resetValidation(), []);

  return {
    evaluateScan,
    updateThresholds,
    resetValidation,
  };
}
