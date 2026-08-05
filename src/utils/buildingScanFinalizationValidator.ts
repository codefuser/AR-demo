/**
 * @file src/utils/buildingScanFinalizationValidator.ts
 * @description Verifies scan validation outcome readiness before allowing finalization.
 */

import type { ScanValidationReportModel } from '../types/scanValidation';

export class BuildingScanFinalizationValidator {
  /**
   * Verifies that scan validation outcome is PASS or PASS_WITH_WARNINGS before allowing persistence.
   */
  public static validateFinalizationReadiness(report: ScanValidationReportModel | null): {
    canFinalize: boolean;
    reason?: string;
  } {
    if (!report) {
      return {
        canFinalize: false,
        reason: 'No scan validation report found. Please run Scan Validation first.',
      };
    }

    if (report.outcome === 'FAILED') {
      return {
        canFinalize: false,
        reason: 'Scan validation FAILED. Insufficient tracking or point cloud data.',
      };
    }

    if (report.outcome === 'INCOMPLETE') {
      return {
        canFinalize: false,
        reason: 'Scan is INCOMPLETE. Spatial coverage is below 70% threshold.',
      };
    }

    return {
      canFinalize: true,
    };
  }
}
