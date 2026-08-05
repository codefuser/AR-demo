/**
 * @file src/utils/buildingScanWorkflowValidator.ts
 * @description Pre-scan readiness validator.
 */

import type { BuildingScanPreValidationResult } from '../types/buildingScanWorkflow';

export class BuildingScanWorkflowValidator {
  /**
   * Validates pre-scan requirements (camera permission, ARCore service, building selection, device capability).
   */
  public static validatePreScanReadiness(
    hasBuilding: boolean,
    isCameraPermissionGranted = true,
    isARCoreAvailable = true,
    isDeviceSupported = true,
  ): BuildingScanPreValidationResult {
    if (!hasBuilding) {
      return {
        cameraPermissionGranted: isCameraPermissionGranted,
        arCoreAvailable: isARCoreAvailable,
        deviceSupported: isDeviceSupported,
        buildingSelected: false,
        storageAvailable: true,
        batteryLevelPct: 85,
        canStart: false,
        blockingMessage: 'Building selection required before starting scan.',
      };
    }

    if (!isCameraPermissionGranted) {
      return {
        cameraPermissionGranted: false,
        arCoreAvailable: isARCoreAvailable,
        deviceSupported: isDeviceSupported,
        buildingSelected: hasBuilding,
        storageAvailable: true,
        batteryLevelPct: 85,
        canStart: false,
        blockingMessage: 'Camera permission is required to perform AR building scanning.',
      };
    }

    if (!isARCoreAvailable || !isDeviceSupported) {
      return {
        cameraPermissionGranted: isCameraPermissionGranted,
        arCoreAvailable: isARCoreAvailable,
        deviceSupported: isDeviceSupported,
        buildingSelected: hasBuilding,
        storageAvailable: true,
        batteryLevelPct: 85,
        canStart: false,
        blockingMessage: 'Device does not meet Google ARCore hardware requirements.',
      };
    }

    return {
      cameraPermissionGranted: true,
      arCoreAvailable: true,
      deviceSupported: true,
      buildingSelected: true,
      storageAvailable: true,
      batteryLevelPct: 85,
      canStart: true,
    };
  }
}
