/**
 * @file src/services/workflow/BuildingScanWorkflowService.ts
 * @description Low-level service for persisting building scan workflow records.
 */

import { BuildingScanWorkflowStore } from './BuildingScanWorkflowStore';
import { useBuildingStore } from '../../store';
import type { BuildingScanWorkflowSummary } from '../../types/buildingScanWorkflow';

export class BuildingScanWorkflowService {
  private static instance: BuildingScanWorkflowService;
  private store: BuildingScanWorkflowStore;

  private constructor() {
    this.store = BuildingScanWorkflowStore.getInstance();
  }

  public static getInstance(): BuildingScanWorkflowService {
    if (!BuildingScanWorkflowService.instance) {
      BuildingScanWorkflowService.instance = new BuildingScanWorkflowService();
    }
    return BuildingScanWorkflowService.instance;
  }

  /**
   * Persists the saved scan record and updates building scanStatus to 'completed'.
   */
  public saveScanSummary(summary: BuildingScanWorkflowSummary): void {
    if (summary.buildingId) {
      useBuildingStore.getState().updateBuilding(summary.buildingId, {
        scanStatus: 'completed',
        status: 'scanned',
      });
    }
    this.store.updateSnapshot({
      state: 'COMPLETED',
      summary,
    });
  }
}
