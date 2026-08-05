/**
 * @file src/services/validation/ScanValidationService.ts
 * @description Low-level service for updating thresholds and logging evaluation reports.
 */

import { ScanValidationStore } from './ScanValidationStore';
import type { ScanValidationThresholds, ScanValidationReportModel } from '../../types/scanValidation';

export class ScanValidationService {
  private static instance: ScanValidationService;
  private store: ScanValidationStore;

  private constructor() {
    this.store = ScanValidationStore.getInstance();
  }

  public static getInstance(): ScanValidationService {
    if (!ScanValidationService.instance) {
      ScanValidationService.instance = new ScanValidationService();
    }
    return ScanValidationService.instance;
  }

  public updateThresholds(payload: Partial<ScanValidationThresholds>): void {
    this.store.updateThresholds(payload);
  }

  public logReport(report: ScanValidationReportModel): void {
    this.store.setReport(report);
  }
}
