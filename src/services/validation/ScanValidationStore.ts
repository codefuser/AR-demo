/**
 * @file src/services/validation/ScanValidationStore.ts
 * @description Central Observable State Store for Intelligent Scan Validation Engine.
 */

import { DEFAULT_VALIDATION_THRESHOLDS } from '../../constants/scanValidation';
import type { ScanValidationThresholds, ScanValidationReportModel } from '../../types/scanValidation';

export type ScanValidationStoreListener = (
  thresholds: ScanValidationThresholds,
  report: ScanValidationReportModel | null,
) => void;

export class ScanValidationStore {
  private static instance: ScanValidationStore;
  private thresholds: ScanValidationThresholds = { ...DEFAULT_VALIDATION_THRESHOLDS };
  private activeReport: ScanValidationReportModel | null = null;
  private logs: ScanValidationReportModel[] = [];
  private listeners: Set<ScanValidationStoreListener> = new Set();

  private constructor() {}

  public static getInstance(): ScanValidationStore {
    if (!ScanValidationStore.instance) {
      ScanValidationStore.instance = new ScanValidationStore();
    }
    return ScanValidationStore.instance;
  }

  public getThresholds(): ScanValidationThresholds {
    return { ...this.thresholds };
  }

  public getActiveReport(): ScanValidationReportModel | null {
    return this.activeReport ? { ...this.activeReport } : null;
  }

  public updateThresholds(payload: Partial<ScanValidationThresholds>): void {
    this.thresholds = {
      ...this.thresholds,
      ...payload,
    };
    this.notifyListeners();
  }

  public setReport(report: ScanValidationReportModel): void {
    this.activeReport = { ...report };
    this.logs.unshift({ ...report });
    this.notifyListeners();
  }

  public resetValidation(): void {
    this.activeReport = null;
    this.notifyListeners();
  }

  public subscribe(listener: ScanValidationStoreListener): () => void {
    this.listeners.add(listener);
    listener(this.getThresholds(), this.getActiveReport());
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    const threshCopy = this.getThresholds();
    const repCopy = this.getActiveReport();
    this.listeners.forEach((listener) => listener(threshCopy, repCopy));
  }
}
