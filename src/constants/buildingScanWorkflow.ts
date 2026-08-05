/**
 * @file src/constants/buildingScanWorkflow.ts
 * @description State titles, guidance prompts, and constants for Unified Building Scan Workflow Engine.
 */

import type { BuildingScanWorkflowState } from '../types/buildingScanWorkflow';

/** Human-readable state title mappings */
export const SCAN_STATE_TITLES: Record<BuildingScanWorkflowState, string> = {
  IDLE: 'Scan Ready',
  PREPARING: 'Preparing Scan',
  CHECKING_PERMISSIONS: 'Checking Permissions',
  INITIALIZING_CAMERA: 'Initializing Camera',
  INITIALIZING_ARCORE: 'Initializing ARCore',
  READY: 'Ready to Scan',
  SCANNING: 'Scanning Building',
  PAUSED: 'Scan Paused',
  RECOVERING: 'Recovering AR Tracking',
  PREVIEW: 'Scan Summary Preview',
  SAVING: 'Saving Scan Record',
  COMPLETED: 'Scan Complete',
  CANCELLED: 'Scan Cancelled',
  FAILED: 'Scan Failed',
};
