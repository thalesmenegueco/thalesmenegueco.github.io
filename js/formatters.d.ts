/**
 * Formatting Utilities
 * Format numbers and values for display to users
 */

/**
 * Formats a raw number to the Brazilian currency standard (R$)
 * @param value - The value to be formatted (e.g. 1250.5)
 * @returns Formatted string (e.g. "R$ 1.250,50")
 */
export function formatCurrency(value: number | string | null | undefined): string;
