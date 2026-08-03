/**
 * @file src/services/ar/native/ARSessionService.ts
 * @description Low-Level Native AR Session Service.
 *
 * Interfaces between native C++/Java Google ARCore bindings and upper-level AR Session Managers.
 */

import { ARDeviceChecker } from './ARDeviceChecker';
import { ARPermissionManager } from './ARPermissionManager';
import { ARStateStore } from './ARStateStore';
import type { ARNativeSessionConfig } from '../../../types/arNative';
import { DEFAULT_NATIVE_AR_CONFIG } from '../../../constants/arNative';

export class ARSessionService {
  private static instance: ARSessionService;
  private deviceChecker: ARDeviceChecker;
  private permissionManager: ARPermissionManager;
  private stateStore: ARStateStore;

  private constructor() {
    this.deviceChecker = ARDeviceChecker.getInstance();
    this.permissionManager = ARPermissionManager.getInstance();
    this.stateStore = ARStateStore.getInstance();
  }

  public static getInstance(): ARSessionService {
    if (!ARSessionService.instance) {
      ARSessionService.instance = new ARSessionService();
    }
    return ARSessionService.instance;
  }

  /**
   * Initializes native session dependencies, diagnostics, and permissions.
   */
  public async initialize(config: ARNativeSessionConfig = DEFAULT_NATIVE_AR_CONFIG): Promise<boolean> {
    this.stateStore.setStatus('INITIALIZING');

    const diagnostics = await this.deviceChecker.checkDeviceDiagnostics();
    this.stateStore.setDiagnostics(diagnostics);

    if (!diagnostics.cameraPermissionGranted) {
      const granted = await this.permissionManager.requestCameraPermission();
      if (!granted) {
        this.stateStore.setStatus('ERROR');
        return false;
      }
    }

    void config;
    return true;
  }
}
