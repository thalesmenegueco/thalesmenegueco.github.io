import type { ColumnProfile, FieldType } from '../models/types';

/**
 * Pure, framework-free heuristics that suggest a column's type from its raw
 * values. The suggestion is only a default — the user always confirms/overrides
 * it, and the confirmed type is what the app trusts.
 */

const BOOLEAN_VALUES = new Set([
  'true',
  'false',
  'sim',
  'não',
  'nao',
  'yes',
  'no',
  'verdadeiro',
  'falso',
]);

export function isBooleanValue(value: unknown): boolean {
  if (value === null || value === undefined) {
    return false;
  }
  if (typeof value === 'boolean') {
    return true;
  }
  return BOOLEAN_VALUES.has(String(value).trim().toLowerCase());
}

export function isNumericValue(value: unknown): boolean {
  if (value === null || value === undefined || value === '') {
    return false;
  }
  if (typeof value === 'number') {
    return Number.isFinite(value);
  }
  const text = String(value).trim();
  if (text === '') {
    return false;
  }
  return Number.isFinite(Number(text));
}

export function isDateValue(value: unknown): boolean {
  if (value === null || value === undefined || value === '') {
    return false;
  }
  if (value instanceof Date) {
    return !isNaN(value.getTime());
  }
  if (typeof value === 'number') {
    return false; // numbers are numeric, not dates
  }
  const text = String(value).trim();
  if (text.length < 6) {
    return false;
  }
  // Must look like a date: digits plus a separator, and not a plain number.
  if (!/\d/.test(text) || !/[-/:.]/.test(text) || isNumericValue(text)) {
    return false;
  }
  return Number.isFinite(Date.parse(text));
}

/**
 * Suggest a FieldType for a column from its values.
 * Empty/fully-null columns fall back to 'categorical'.
 */
export function sniffType(values: unknown[]): FieldType {
  const nonNull = values.filter((v) => v !== null && v !== undefined && v !== '');
  if (nonNull.length === 0) {
    return 'categorical';
  }

  let numeric = 0;
  let date = 0;
  let bool = 0;

  for (const v of nonNull) {
    if (isBooleanValue(v)) {
      bool += 1;
    } else if (isNumericValue(v)) {
      numeric += 1;
    } else if (isDateValue(v)) {
      date += 1;
    }
  }

  const total = nonNull.length;
  if (bool / total >= 0.8) {
    return 'boolean';
  }
  if (date / total >= 0.8) {
    return 'datetime';
  }
  if (numeric / total >= 0.8) {
    return 'numerical';
  }
  return 'categorical';
}

/** Build the full per-column profile shown in the confirmation UI. */
export function profileColumn(name: string, values: unknown[]): ColumnProfile {
  const nonNull = values.filter((v) => v !== null && v !== undefined && v !== '');
  const distinct = new Set(nonNull.map((v) => String(v).trim().toLowerCase()));

  let numeric = 0;
  let date = 0;
  let bool = 0;
  for (const v of nonNull) {
    if (isBooleanValue(v)) {
      bool += 1;
    } else if (isNumericValue(v)) {
      numeric += 1;
    } else if (isDateValue(v)) {
      date += 1;
    }
  }

  const denom = nonNull.length || 1;
  return {
    name,
    suggestedType: sniffType(values),
    distinctCount: distinct.size,
    totalCount: values.length,
    nonNullCount: nonNull.length,
    numericRate: numeric / denom,
    dateRate: date / denom,
    booleanRate: bool / denom,
    sampleValues: nonNull.slice(0, 5).map((v) => String(v)),
  };
}
