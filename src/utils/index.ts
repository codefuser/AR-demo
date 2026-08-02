/**
 * @file src/utils/index.ts
 * @description General-purpose utility functions.
 *
 * Keep utilities pure (no side effects, no state) so they are easily testable.
 */

/**
 * Format an ISO 8601 date string to a human-readable locale string.
 *
 * @param isoString - e.g. "2026-08-02T15:00:00.000Z"
 * @returns e.g. "Aug 2, 2026"
 */
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Capitalise the first letter of a string.
 *
 * @param text - Input string.
 * @returns String with first character uppercased.
 */
export function capitalise(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Clamp a numeric value between min and max bounds.
 *
 * @param value - The input number.
 * @param min   - Lower bound (inclusive).
 * @param max   - Upper bound (inclusive).
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Return a truncated string with an ellipsis if it exceeds `maxLength`.
 *
 * @param text      - Source string.
 * @param maxLength - Maximum character count before truncation.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
}

/**
 * Pause execution for a given number of milliseconds.
 * Useful for splash screen timing.
 *
 * @param ms - Duration in milliseconds.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
