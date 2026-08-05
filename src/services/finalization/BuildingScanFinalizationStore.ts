/**
 * @file src/services/finalization/BuildingScanFinalizationStore.ts
 * @description Central Observable State Store for Building Scan Finalization Engine.
 */

import type { FinalizationState, FinalScanSummaryRecord } from '../../types/buildingScanFinalization';

export type BuildingScanFinalizationListener = (
  state: FinalizationState,
  record: FinalScanSummaryRecord | null,
  errorMessage?: string,
) => void;

export class BuildingScanFinalizationStore {
  private static instance: BuildingScanFinalizationStore;
  private state: FinalizationState = 'IDLE';
  private activeRecord: FinalScanSummaryRecord | null = null;
  private errorMessage?: string;
  private listeners: Set<BuildingScanFinalizationListener> = new Set();

  private constructor() {}

  public static getInstance(): BuildingScanFinalizationStore {
    if (!BuildingScanFinalizationStore.instance) {
      BuildingScanFinalizationStore.instance = new BuildingScanFinalizationStore();
    }
    return BuildingScanFinalizationStore.instance;
  }

  public getState(): FinalizationState {
    return this.state;
  }

  public getActiveRecord(): FinalScanSummaryRecord | null {
    return this.activeRecord ? { ...this.activeRecord } : null;
  }

  public getErrorMessage(): string | undefined {
    return this.errorMessage;
  }

  public setState(state: FinalizationState, record: FinalScanSummaryRecord | null = null, errorMessage?: string): void {
    this.state = state;
    if (record) this.activeRecord = { ...record };
    this.errorMessage = errorMessage;
    this.notifyListeners();
  }

  public resetState(): void {
    this.state = 'IDLE';
    this.activeRecord = null;
    this.errorMessage = undefined;
    this.notifyListeners();
  }

  public subscribe(listener: BuildingScanFinalizationListener): () => void {
    this.listeners.add(listener);
    listener(this.getState(), this.getActiveRecord(), this.getErrorMessage());
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    const currentState = this.getState();
    const currentRec = this.getActiveRecord();
    const currentErr = this.getErrorMessage();
    this.listeners.forEach((listener) => listener(currentState, currentRec, currentErr));
  }
}
