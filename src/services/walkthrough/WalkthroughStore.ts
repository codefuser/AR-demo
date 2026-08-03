/**
 * @file src/services/walkthrough/WalkthroughStore.ts
 * @description Central Observable State Store for Active Building Walkthrough Sessions.
 */

import type { WalkthroughSession } from '../../types/walkthrough';

export type WalkthroughStoreListener = (session: WalkthroughSession | null) => void;

export class WalkthroughStore {
  private static instance: WalkthroughStore;

  private activeSession: WalkthroughSession | null = null;
  private listeners: Set<WalkthroughStoreListener> = new Set();

  private constructor() {}

  public static getInstance(): WalkthroughStore {
    if (!WalkthroughStore.instance) {
      WalkthroughStore.instance = new WalkthroughStore();
    }
    return WalkthroughStore.instance;
  }

  public getActiveSession(): WalkthroughSession | null {
    return this.activeSession ? { ...this.activeSession } : null;
  }

  public setSession(session: WalkthroughSession | null): void {
    this.activeSession = session ? { ...session } : null;
    this.notifyListeners();
  }

  public updateSession(payload: Partial<WalkthroughSession>): void {
    if (this.activeSession) {
      this.activeSession = {
        ...this.activeSession,
        ...payload,
      };
      this.notifyListeners();
    }
  }

  public subscribe(listener: WalkthroughStoreListener): () => void {
    this.listeners.add(listener);
    listener(this.getActiveSession());
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    const sessionCopy = this.getActiveSession();
    this.listeners.forEach((listener) => listener(sessionCopy));
  }
}
