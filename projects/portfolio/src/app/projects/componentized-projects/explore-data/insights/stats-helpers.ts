import { mean, quantileSorted, sampleCorrelation, standardDeviation } from 'simple-statistics';

/**
 * Pure, framework-free statistical helpers used by the insight detectors.
 * Values come in as raw (string/number) column data and are coerced here.
 */

export function toNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  const n = Number(String(value).trim());
  return Number.isFinite(n) ? n : null;
}

export function numericValues(values: unknown[]): number[] {
  const out: number[] = [];
  for (const v of values) {
    const n = toNumber(v);
    if (n !== null) {
      out.push(n);
    }
  }
  return out;
}

export function percentile(sorted: number[], p: number): number {
  return sorted.length > 0 ? quantileSorted(sorted, p) : NaN;
}

/**
 * Pearson correlation between two raw columns, pairing values by row index and
 * dropping rows where either side is missing/non-numeric.
 */
export function pearsonCorrelation(rawA: unknown[], rawB: unknown[]): number | null {
  const xs: number[] = [];
  const ys: number[] = [];
  const len = Math.min(rawA.length, rawB.length);
  for (let i = 0; i < len; i++) {
    const x = toNumber(rawA[i]);
    const y = toNumber(rawB[i]);
    if (x !== null && y !== null) {
      xs.push(x);
      ys.push(y);
    }
  }
  if (xs.length < 2) {
    return null;
  }
  return sampleCorrelation(xs, ys);
}

/** Adjusted Fisher–Pearson sample skewness. */
export function skewness(values: number[]): number {
  const n = values.length;
  if (n < 3) {
    return 0;
  }
  const m = mean(values);
  const m2 = values.reduce((s, v) => s + (v - m) ** 2, 0) / n;
  const m3 = values.reduce((s, v) => s + (v - m) ** 3, 0) / n;
  if (m2 === 0) {
    return 0;
  }
  const g1 = m3 / Math.pow(m2, 1.5);
  return (Math.sqrt(n * (n - 1)) / (n - 2)) * g1;
}

/** Excess kurtosis (0 = normal). */
export function kurtosis(values: number[]): number {
  const n = values.length;
  if (n < 4) {
    return 0;
  }
  const m = mean(values);
  const m2 = values.reduce((s, v) => s + (v - m) ** 2, 0) / n;
  const m4 = values.reduce((s, v) => s + (v - m) ** 4, 0) / n;
  if (m2 === 0) {
    return 0;
  }
  const g2 = m4 / (m2 * m2) - 3;
  return ((n - 1) / ((n - 2) * (n - 3))) * ((n + 1) * g2 + 6);
}

export function coefficientOfVariation(values: number[]): number {
  const m = mean(values);
  if (m === 0) {
    return 0;
  }
  return standardDeviation(values) / Math.abs(m);
}
