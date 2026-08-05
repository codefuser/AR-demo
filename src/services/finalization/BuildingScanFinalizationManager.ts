/**
 * @file src/services/finalization/BuildingScanFinalizationManager.ts
 * @description Master Orchestrator for Building Scan Finalization Engine.
 *
 * Runs Scan Validation, checks readiness rules, generates executive & technical summaries, executes atomic JSON persistence, and updates Building status to 'completed'.
 */

import { BuildingScanFinalizationService } from './BuildingScanFinalizationService';
import { BuildingScanFinalizationStore } from './BuildingScanFinalizationStore';
import { ScanValidationManager } from '../validation/ScanValidationManager';
import { CoverageStore } from '../coverage/CoverageStore';
import { PlaneStore } from '../plane/PlaneStore';
import { BuildingScanFinalizationValidator } from '../../utils/buildingScanFinalizationValidator';
import { BuildingScanSummaryGenerator } from '../../utils/buildingScanSummaryGenerator';
import type { FinalScanSummaryRecord } from '../../types/buildingScanFinalization';

export class BuildingScanFinalizationManager {
  private static instance: BuildingScanFinalizationManager;

  private service: BuildingScanFinalizationService;
  private store: BuildingScanFinalizationStore;
  private validationManager: ScanValidationManager;
  private coverageStore: CoverageStore;
  private planeStore: PlaneStore;

  private startTimeIso: string = new Date().toISOString();

  private constructor() {
    this.service = BuildingScanFinalizationService.getInstance();
    this.store = BuildingScanFinalizationStore.getInstance();
    this.validationManager = ScanValidationManager.getInstance();
    this.coverageStore = CoverageStore.getInstance();
    this.planeStore = PlaneStore.getInstance();
  }

  public static getInstance(): BuildingScanFinalizationManager {
    if (!BuildingScanFinalizationManager.instance) {
      BuildingScanFinalizationManager.instance = new BuildingScanFinalizationManager();
    }
    return BuildingScanFinalizationManager.instance;
  }

  public setStartTime(startTimeIso: string): void {
    this.startTimeIso = startTimeIso;
  }

  /**
   * Executes full scan finalization pipeline:
   *  1. Runs Scan Validation
   *  2. Verifies outcome (PASS / PASS_WITH_WARNINGS)
   *  3. Generates structured JSON summary record
   *  4. Persists record and updates building status to 'completed'
   */
  public async finalizeScanSession(
    buildingId: string,
    buildingName: string,
  ): Promise<{ success: boolean; record?: FinalScanSummaryRecord; reason?: string }> {
    this.store.setState('VALIDATING');

    // 1. Run Scan Validation Engine
    const valReport = this.validationManager.evaluateCurrentScan(buildingId, buildingName);

    // 2. Validate readiness (Outcome must be PASS or PASS_WITH_WARNINGS)
    const readiness = BuildingScanFinalizationValidator.validateFinalizationReadiness(valReport);
    if (!readiness.canFinalize) {
      this.store.setState('FAILED', null, readiness.reason);
      return { success: false, reason: readiness.reason };
    }

    this.store.setState('GENERATING_SUMMARY');

    // 3. Collect spatial coverage snapshot and planes
    const coverageSnap = this.coverageStore.getSnapshot();
    const planes = this.planeStore.getPlanes();
    const planeIds = planes.map((p) => p.planeId);

    // 4. Generate structured JSON summary record
    const summaryRecord = BuildingScanSummaryGenerator.createFullScanSummaryRecord(
      buildingId,
      buildingName,
      valReport,
      coverageSnap,
      this.startTimeIso,
      planeIds,
    );

    // 5. Execute atomic persistence and status update
    const saved = await this.service.saveRecord(summaryRecord);
    if (saved) {
      return { success: true, record: summaryRecord };
    } else {
      return { success: false, reason: 'Failed to persist scan record to database.' };
    }
  }
}
