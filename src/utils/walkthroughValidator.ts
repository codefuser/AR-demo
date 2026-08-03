/**
 * @file src/utils/walkthroughValidator.ts
 * @description Validates building walkthrough pre-readiness.
 */

import type { WalkthroughValidationResult } from '../types/walkthrough';

export class WalkthroughValidator {
  /**
   * Validates if pre-conditions permit starting a walkthrough session.
   */
  public static validateWalkthroughPreReadiness(
    hasBuilding: boolean,
    isARActive: boolean,
    isCameraReady: boolean,
    isHardwareSupported: boolean,
  ): WalkthroughValidationResult {
    if (!hasBuilding) {
      return {
        hasValidBuilding: false,
        isARSessionReady: isARActive,
        isCameraAvailable: isCameraReady,
        isDeviceSupported: isHardwareSupported,
        canStartWalkthrough: false,
        blockingMessage: 'Building selection required before starting walkthrough.',
      };
    }

    if (!isHardwareSupported) {
      return {
        hasValidBuilding: hasBuilding,
        isARSessionReady: isARActive,
        isCameraAvailable: isCameraReady,
        isDeviceSupported: false,
        canStartWalkthrough: false,
        blockingMessage: 'Device does not meet Google ARCore hardware requirements.',
      };
    }

    if (!isCameraReady) {
      return {
        hasValidBuilding: hasBuilding,
        isARSessionReady: isARActive,
        isCameraAvailable: false,
        isDeviceSupported: isHardwareSupported,
        canStartWalkthrough: false,
        blockingMessage: 'Camera permission denied or camera unavailable.',
      };
    }

    return {
      hasValidBuilding: hasBuilding,
      isARSessionReady: isARActive,
      isCameraAvailable: isCameraReady,
      isDeviceSupported: isHardwareSupported,
      canStartWalkthrough: true,
    };
  }
}
