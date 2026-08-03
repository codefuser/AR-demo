/**
 * @file src/services/scanSession/ScanSessionManager.ts
 * @description Core Building Scan Session Controller & Lifecycle Manager.
 *
 * Manages:
 *  - Pre-scan validation readiness checklist (`validatePreScanReadiness`)
 *  - Session Operations: Start, Pause, Resume, Cancel, Complete, Delete, Reset
 *  - Progress calculation & active stage progression ticker
 */

import { ScanSessionService } from './ScanSessionService';
import { ScanSessionStore } from './ScanSessionStore';
import { ARDeviceChecker } from '../ar/native/ARDeviceChecker';
import { ARPermissionManager } from '../ar/native/ARPermissionManager';
import {
  calculateScanProgress,
  estimateRemainingTime,
} from '../../utils/scanSessionUtils';
import { SCAN_SESSION_MESSAGES } from '../../constants/scanSession';
import type {
  ScanSession,
  ScanSessionStatus,
  ScanSessionValidation,
  ScanSessionStage,
} from '../../types/scanSession';

export class ScanSessionManager {
  private static instance: ScanSessionManager;
  private service: ScanSessionService;
  private store: ScanSessionStore;
  private deviceChecker: ARDeviceChecker;
  private permissionManager: ARPermissionManager;

  private tickerInterval: ReturnType<typeof setInterval> | null = null;

  private constructor() {
    this.service = ScanSessionService.getInstance();
    this.store = ScanSessionStore.getInstance();
    this.deviceChecker = ARDeviceChecker.getInstance();
    this.permissionManager = ARPermissionManager.getInstance();
  }

  public static getInstance(): ScanSessionManager {
    if (!ScanSessionManager.instance) {
      ScanSessionManager.instance = new ScanSessionManager();
    }
    return ScanSessionManager.instance;
  }

  /**
   * Validates pre-scan readiness checklist.
   */
  public async validatePreScanReadiness(buildingId?: string): Promise<ScanSessionValidation> {
    const isBuildingValid = Boolean(buildingId && buildingId.trim().length > 0);
    const cameraGranted = await this.permissionManager.checkPermissions();
    const diagnostics = await this.deviceChecker.checkDeviceDiagnostics();

    const isARReady = diagnostics.sensorsAvailable;
    const isDeviceCompatible = diagnostics.isARSupported;

    let message: string = SCAN_SESSION_MESSAGES.READY_TO_SCAN;
    let canStartScan = true;

    if (!isBuildingValid) {
      message = SCAN_SESSION_MESSAGES.MISSING_BUILDING;
      canStartScan = false;
    } else if (!cameraGranted) {
      message = SCAN_SESSION_MESSAGES.MISSING_CAMERA_PERMISSION;
      canStartScan = false;
    } else if (!isARReady) {
      message = SCAN_SESSION_MESSAGES.AR_NOT_READY;
      canStartScan = false;
    } else if (!isDeviceCompatible) {
      message = SCAN_SESSION_MESSAGES.UNSUPPORTED_DEVICE;
      canStartScan = false;
    }

    return {
      isBuildingValid,
      isCameraPermissionGranted: cameraGranted,
      isARReady,
      isDeviceCompatible,
      canStartScan,
      message,
    };
  }

  /**
   * Creates a new building scan session.
   */
  public async createSession(
    buildingId: string,
    buildingName: string,
    floor = 1,
  ): Promise<ScanSession> {
    const session = this.service.createScanSession(buildingId, buildingName, floor);
    const diagnostics = await this.deviceChecker.checkDeviceDiagnostics();

    this.service.updateSession(session.sessionId, {
      deviceCompatibility: diagnostics,
      currentStatus: 'READY',
    });

    return this.store.getSessionById(session.sessionId)!;
  }

  /**
   * Starts scan session lifecycle.
   */
  public async startSession(sessionId: string): Promise<boolean> {
    const session = this.store.getSessionById(sessionId);
    if (!session) return false;

    const validation = await this.validatePreScanReadiness(session.buildingId);
    if (!validation.canStartScan) {
      this.service.updateSession(sessionId, {
        currentStatus: 'FAILED',
        errorMessage: validation.message,
      });
      return false;
    }

    const now = new Date().toISOString();
    this.service.updateSession(sessionId, {
      currentStatus: 'SCANNING',
      currentStage: 'ANCHORING_ORIGIN',
      startedDate: session.startedDate || now,
      trackingQuality: 'GOOD',
    });

    this.startProgressTicker(sessionId);
    return true;
  }

  /**
   * Pauses scan session.
   */
  public pauseSession(sessionId: string): void {
    const session = this.store.getSessionById(sessionId);
    if (session && session.currentStatus === 'SCANNING') {
      this.stopProgressTicker();
      this.service.updateSession(sessionId, {
        currentStatus: 'PAUSED',
      });
    }
  }

  /**
   * Resumes a paused scan session.
   */
  public resumeSession(sessionId: string): void {
    const session = this.store.getSessionById(sessionId);
    if (session && (session.currentStatus === 'PAUSED' || session.currentStatus === 'READY')) {
      this.service.updateSession(sessionId, {
        currentStatus: 'SCANNING',
      });
      this.startProgressTicker(sessionId);
    }
  }

  /**
   * Cancels scan session.
   */
  public cancelSession(sessionId: string): void {
    this.stopProgressTicker();
    this.service.updateSession(sessionId, {
      currentStatus: 'CANCELLED',
      finishedDate: new Date().toISOString(),
      sessionNotes: SCAN_SESSION_MESSAGES.SESSION_CANCELLED,
    });
  }

  /**
   * Completes scan session.
   */
  public completeSession(sessionId: string): void {
    this.stopProgressTicker();
    const session = this.store.getSessionById(sessionId);

    this.service.updateSession(sessionId, {
      currentStatus: 'COMPLETED',
      currentStage: 'COMPLETED',
      progressPercentage: 100,
      currentScanPointCount: session?.totalScanPoints || 1500,
      estimatedRemainingTimeSeconds: 0,
      finishedDate: new Date().toISOString(),
      sessionNotes: SCAN_SESSION_MESSAGES.SESSION_FINISHED,
    });
  }

  /**
   * Resets scan session metrics back to 0.
   */
  public resetSession(sessionId: string): void {
    this.stopProgressTicker();
    this.service.updateSession(sessionId, {
      currentStatus: 'READY',
      currentStage: 'INITIALIZING',
      progressPercentage: 0,
      elapsedTimeSeconds: 0,
      estimatedRemainingTimeSeconds: 300,
      currentScanPointCount: 0,
      startedDate: null,
      finishedDate: null,
    });
  }

  /**
   * Deletes session record.
   */
  public deleteSession(sessionId: string): void {
    this.stopProgressTicker();
    this.service.deleteSession(sessionId);
  }

  // ── Progress Ticker Simulation ─────────────────────────────────────────────

  private startProgressTicker(sessionId: string): void {
    this.stopProgressTicker();

    this.tickerInterval = setInterval(() => {
      const session = this.store.getSessionById(sessionId);
      if (!session || session.currentStatus !== 'SCANNING') {
        this.stopProgressTicker();
        return;
      }

      const newElapsed = session.elapsedTimeSeconds + 1;
      const newScanPoints = Math.min(
        session.totalScanPoints,
        session.currentScanPointCount + Math.floor(Math.random() * 25) + 15,
      );

      const progressPct = calculateScanProgress(newScanPoints, session.totalScanPoints);
      const remainingTime = estimateRemainingTime(newElapsed, progressPct);

      // Determine stage based on progress percentage
      let currentStage: ScanSessionStage = 'ANCHORING_ORIGIN';
      if (progressPct >= 95) {
        currentStage = 'FINALIZING_MESH';
      } else if (progressPct >= 50) {
        currentStage = 'SCANNING_ROOMS';
      } else if (progressPct >= 15) {
        currentStage = 'SCANNING_CORRIDORS';
      }

      this.service.updateSession(sessionId, {
        elapsedTimeSeconds: newElapsed,
        currentScanPointCount: newScanPoints,
        progressPercentage: progressPct,
        estimatedRemainingTimeSeconds: remainingTime,
        currentStage,
      });

      // Auto finish if 100%
      if (progressPct >= 100) {
        this.completeSession(sessionId);
      }
    }, 1000);
  }

  private stopProgressTicker(): void {
    if (this.tickerInterval) {
      clearInterval(this.tickerInterval);
      this.tickerInterval = null;
    }
  }
}
