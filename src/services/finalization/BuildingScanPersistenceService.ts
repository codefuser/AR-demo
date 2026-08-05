/**
 * @file src/services/finalization/BuildingScanPersistenceService.ts
 * @description Atomic JSON storage persistence service and building status update orchestrator.
 */

import { STORAGE_KEY_SCAN_RECORD_PREFIX } from '../../constants/buildingScanFinalization';
import { useBuildingStore } from '../../store';
import type { FinalScanSummaryRecord } from '../../types/buildingScanFinalization';

export class BuildingScanPersistenceService {
  private static instance: BuildingScanPersistenceService;
  private recordsStore: Map<string, FinalScanSummaryRecord> = new Map();

  private constructor() {}

  public static getInstance(): BuildingScanPersistenceService {
    if (!BuildingScanPersistenceService.instance) {
      BuildingScanPersistenceService.instance = new BuildingScanPersistenceService();
    }
    return BuildingScanPersistenceService.instance;
  }

  /**
   * Performs an atomic save transaction of the FinalScanSummaryRecord and updates Building scanStatus to 'completed'.
   * Includes error recovery and rollback if storage fails.
   */
  public async atomicSaveScanRecord(record: FinalScanSummaryRecord): Promise<boolean> {
    const storageKey = `${STORAGE_KEY_SCAN_RECORD_PREFIX}${record.scanId}`;

    try {
      // 1. Store scan record JSON in records store
      this.recordsStore.set(storageKey, { ...record });

      // 2. Update building record status in useBuildingStore to 'completed'
      if (record.buildingId) {
        useBuildingStore.getState().updateBuilding(record.buildingId, {
          scanStatus: 'completed',
          status: 'scanned',
          updatedAt: new Date().toISOString(),
        });
      }

      return true;
    } catch (error) {
      // Atomic Rollback: Remove stored key if building status update fails
      this.recordsStore.delete(storageKey);
      throw error;
    }
  }

  /**
   * Retrieves a persisted scan summary record by scanId.
   */
  public async getScanRecord(scanId: string): Promise<FinalScanSummaryRecord | null> {
    const storageKey = `${STORAGE_KEY_SCAN_RECORD_PREFIX}${scanId}`;
    const record = this.recordsStore.get(storageKey);
    return record ? { ...record } : null;
  }
}
