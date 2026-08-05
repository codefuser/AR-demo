/**
 * @file src/utils/buildingScanFinalizationUtils.ts
 * @description Date formatting and duration calculation utilities for finalization engine.
 */

export function calculateDurationSeconds(startTimeIso: string, endTimeIso: string): number {
  const start = new Date(startTimeIso).getTime();
  const end = new Date(endTimeIso).getTime();
  if (isNaN(start) || isNaN(end) || end < start) return 0;
  return Math.round((end - start) / 1000);
}

export function formatDurationLabel(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}
