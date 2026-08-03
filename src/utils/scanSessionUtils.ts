/**
 * @file src/utils/scanSessionUtils.ts
 * @description Utilities for scan progress calculations, formatted elapsed/remaining time, and scan session ID generation.
 */

/**
 * Generates a unique scan session ID.
 */
export function generateScanSessionId(buildingId: string): string {
  const timestamp = Math.floor(Date.now() / 1000);
  const randomHex = Math.random().toString(36).substring(2, 6);
  return `scan_${buildingId}_${timestamp}_${randomHex}`;
}

/**
 * Calculates scan progress percentage (0 - 100%).
 */
export function calculateScanProgress(currentPoints: number, targetPoints: number): number {
  if (targetPoints <= 0) return 0;
  const pct = (currentPoints / targetPoints) * 100;
  return Math.min(100, Math.max(0, Number(pct.toFixed(1))));
}

/**
 * Formats time in seconds into `MM:SS` or `HH:MM:SS`.
 */
export function formatElapsedTime(totalSeconds: number): string {
  const secs = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(secs / 3600);
  const minutes = Math.floor((secs % 3600) / 60);
  const remainingSecs = secs % 60;

  const pad = (num: number) => num.toString().padStart(2, '0');

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(remainingSecs)}`;
  }
  return `${pad(minutes)}:${pad(remainingSecs)}`;
}

/**
 * Estimates remaining time in seconds based on current progress rate.
 */
export function estimateRemainingTime(
  elapsedSeconds: number,
  progressPercentage: number,
): number {
  if (progressPercentage <= 0 || elapsedSeconds <= 0) return 300; // Default 5 mins
  if (progressPercentage >= 100) return 0;

  const totalEstimatedSeconds = (elapsedSeconds / progressPercentage) * 100;
  const remainingSeconds = totalEstimatedSeconds - elapsedSeconds;
  return Math.max(0, Math.round(remainingSeconds));
}
