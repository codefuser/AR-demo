/**
 * @file src/utils/scanValidationValidator.ts
 * @description Pre-validation utility verifying whether input telemetry streams contain valid scan records.
 */

export class ScanValidationValidator {
  /**
   * Verifies whether input telemetry streams contain valid non-zero scan data.
   */
  public static isValidTelemetryInput(
    hasBuildingId: boolean,
    pointCount: number,
    planeCount: number,
  ): boolean {
    return hasBuildingId && (pointCount > 0 || planeCount > 0);
  }
}
