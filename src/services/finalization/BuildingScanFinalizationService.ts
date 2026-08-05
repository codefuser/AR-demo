/**
 * @file src/services/finalization/BuildingScanFinalizationService.ts
 * @description Low-level service for handling scan finalization CRUD operations.
 */

import { BuildingScanFinalizationStore } from './BuildingScanFinalizationStore';
import { BuildingScanPersistenceService } from './BuildingScanPersistenceService';
import type { FinalScanSummaryRecord } from '../../types/buildingScanFinalization';

export class BuildingScanFinalizationService {
  private static instance: BuildingScanFinalizationService;
  private store: BuildingScanFinalizationStore;
  private persistence: BuildingScanPersistenceService;

  private constructor() {
    this.store = BuildingScanFinalizationStore.getInstance();
    this.persistence = BuildingScanPersistenceService.getInstance();
  }

  public static getInstance(): BuildingScanFinalizationService {
    if (!BuildingScanFinalizationService.instance) {
      BuildingScanFinalizationService.instance = new BuildingScanFinalizationService();
    }
    return BuildingScanFinalizationService.instance;
  }

  public async saveRecord(record: FinalScanSummaryRecord): Promise<boolean> {
    this.store.setState('PERSISTING');
    try {
      await this.persistence.atomicSaveScanRecord(record);
      this.store.setState('SUCCESS', record);
      return true;
    } catch (err: any) {
      this.store.setState('FAILED', null, err?.message || 'Storage error');
      return false;
    }
  }
}
