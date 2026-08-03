/**
 * @file src/services/ar/native/ARCoreNativeBridgeService.ts
 * @description React Native JavaScript Service interfacing with ARCoreNativeModule Kotlin Bridge.
 *
 * Provides typed functional calls to:
 *  - Native ARCore installation checks
 *  - Native Session initialization & controls (start, pause, resume, destroy)
 *  - Listening to native Android hardware events (`onSessionStateChanged`)
 */

import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const { ARCoreNativeModule } = NativeModules;

export interface ARCoreNativeModuleInterface {
  ARCORE_VERSION: string;
  IS_NATIVE_READY: boolean;
  isARCoreInstalled(): Promise<boolean>;
  initializeSession(): Promise<boolean>;
  pauseSession(): Promise<boolean>;
  resumeSession(): Promise<boolean>;
  destroySession(): Promise<boolean>;
}

class ARCoreNativeBridgeService {
  private static instance: ARCoreNativeBridgeService;
  private nativeModule: ARCoreNativeModuleInterface | null = null;
  private eventEmitter: NativeEventEmitter | null = null;

  private constructor() {
    if (Platform.OS === 'android' && ARCoreNativeModule) {
      this.nativeModule = ARCoreNativeModule as ARCoreNativeModuleInterface;
      this.eventEmitter = new NativeEventEmitter(ARCoreNativeModule);
    }
  }

  public static getInstance(): ARCoreNativeBridgeService {
    if (!ARCoreNativeBridgeService.instance) {
      ARCoreNativeBridgeService.instance = new ARCoreNativeBridgeService();
    }
    return ARCoreNativeBridgeService.instance;
  }

  /**
   * Checks if native Kotlin ARCore module is registered.
   */
  public isNativeModuleAvailable(): boolean {
    return this.nativeModule !== null;
  }

  /**
   * Checks if Google ARCore services are installed on device.
   */
  public async isARCoreInstalled(): Promise<boolean> {
    if (this.nativeModule) {
      try {
        return await this.nativeModule.isARCoreInstalled();
      } catch (err) {
        console.warn('Native ARCore installation check failed:', err);
        return false;
      }
    }
    return false;
  }

  /**
   * Initializes native ARCore session.
   */
  public async initializeSession(): Promise<boolean> {
    if (this.nativeModule) {
      try {
        return await this.nativeModule.initializeSession();
      } catch (err) {
        console.warn('Native ARCore session initialization failed:', err);
        return false;
      }
    }
    return false;
  }

  /**
   * Pauses native ARCore session.
   */
  public async pauseSession(): Promise<boolean> {
    if (this.nativeModule) {
      return this.nativeModule.pauseSession();
    }
    return false;
  }

  /**
   * Resumes native ARCore session.
   */
  public async resumeSession(): Promise<boolean> {
    if (this.nativeModule) {
      return this.nativeModule.resumeSession();
    }
    return false;
  }

  /**
   * Destroys native ARCore session.
   */
  public async destroySession(): Promise<boolean> {
    if (this.nativeModule) {
      return this.nativeModule.destroySession();
    }
    return false;
  }

  /**
   * Subscribes to native session lifecycle events.
   */
  public subscribeNativeState(listener: (data: { status: string }) => void): () => void {
    if (this.eventEmitter) {
      const subscription = this.eventEmitter.addListener('onSessionStateChanged', listener);
      return () => subscription.remove();
    }
    return () => {};
  }
}

export default ARCoreNativeBridgeService;
