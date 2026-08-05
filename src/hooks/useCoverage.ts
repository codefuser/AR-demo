/**
 * @file src/hooks/useCoverage.ts
 * @description Custom React Hooks for Intelligent Coverage Analysis Engine.
 */

import { useState, useEffect, useCallback } from 'react';
import { CoverageStore } from '../services/coverage/CoverageStore';
import { CoverageManager } from '../services/coverage/CoverageManager';
import { CoverageValidator } from '../utils/coverageValidator';
import type { CoverageMetricsSnapshot, CoverageCompletionValidationResult } from '../types/coverage';

const store = CoverageStore.getInstance();
const manager = CoverageManager.getInstance();

export function useCoverage(): {
  snapshot: CoverageMetricsSnapshot;
  validation: CoverageCompletionValidationResult;
} {
  const [snapshot, setSnapshot] = useState<CoverageMetricsSnapshot>(store.getSnapshot());

  useEffect(() => {
    let isMounted = true;
    const unsubscribe = store.subscribe((_, newSnapshot) => {
      if (isMounted) {
        setSnapshot(newSnapshot);
      }
    });
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const validation = CoverageValidator.validateScanCompletionReadiness(
    snapshot.coveragePct,
    snapshot.avgPointDensity,
    snapshot.scores.planeQualityScore > 0 ? 3 : 0,
    snapshot.scores.trackingScore >= 80 ? 'EXCELLENT' : 'GOOD',
  );

  return {
    snapshot,
    validation,
  };
}

export function useCoverageControl() {
  const startAnalysis = useCallback(() => manager.startAnalysis(), []);
  const stopAnalysis = useCallback(() => manager.stopAnalysis(), []);
  const resetCoverage = useCallback(() => manager.resetCoverage(), []);

  return {
    startAnalysis,
    stopAnalysis,
    resetCoverage,
  };
}
