/**
 * @file src/utils/validation.ts
 * @description Form validation helper functions.
 *
 * Used with react-hook-form `validate` rules across form screens.
 * Keep functions pure and free of UI concerns.
 */

/**
 * Validate that a value is a non-empty, non-whitespace string.
 *
 * @param value - The field value to check.
 * @param fieldName - Human-readable name for the error message.
 * @returns `true` if valid, or an error message string.
 */
export function required(value: string, fieldName = 'This field'): true | string {
  if (!value || value.trim().length === 0) {
    return `${fieldName} is required`;
  }
  return true;
}

/**
 * Validate minimum string length.
 *
 * @param value   - The field value.
 * @param min     - Minimum number of characters.
 * @returns `true` if valid, or an error message string.
 */
export function minLength(value: string, min: number): true | string {
  if (value.trim().length < min) {
    return `Must be at least ${min} characters`;
  }
  return true;
}

/**
 * Validate maximum string length.
 *
 * @param value   - The field value.
 * @param max     - Maximum number of characters.
 * @returns `true` if valid, or an error message string.
 */
export function maxLength(value: string, max: number): true | string {
  if (value.trim().length > max) {
    return `Must be ${max} characters or fewer`;
  }
  return true;
}

/**
 * Validate that a string parses to a positive integer within a range.
 *
 * @param value  - Raw string from a number input.
 * @param min    - Minimum acceptable value (inclusive).
 * @param max    - Maximum acceptable value (inclusive).
 * @returns `true` if valid, or an error message string.
 */
export function integerRange(
  value: string,
  min: number,
  max: number,
): true | string {
  const n = parseInt(value, 10);
  if (isNaN(n)) return 'Must be a whole number';
  if (n < min) return `Must be at least ${min}`;
  if (n > max) return `Must be no more than ${max}`;
  return true;
}
