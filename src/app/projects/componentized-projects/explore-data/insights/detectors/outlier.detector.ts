import type { Insight } from '../insight.types';
import { numericValues, percentile } from '../stats-helpers';

/**
 * Detects outliers in a single numerical column using the IQR (Tukey) fences.
 * Pure function: raw column data in, Insight[] out.
 */
export function detectOutliers(
  data: unknown[],
  field: string,
  method: 'iqr' | 'zscore' = 'iqr'
): Insight[] {
  const values = numericValues(data);
  if (values.length === 0) {
    return [];
  }

  const sorted = [...values].sort((a, b) => a - b);
  const q1 = percentile(sorted, 0.25);
  const q3 = percentile(sorted, 0.75);
  const iqr = q3 - q1;

  if (method === 'iqr') {
    if (iqr === 0) {
      return [];
    }
    const lower = q1 - 1.5 * iqr;
    const upper = q3 + 1.5 * iqr;
    const outliers = values.filter((v) => v < lower || v > upper);
    if (outliers.length === 0) {
      return [];
    }
    const pct = ((outliers.length / values.length) * 100).toFixed(1);
    return [
      {
        type: 'outlier',
        severity: outliers.length > values.length * 0.05 ? 'warning' : 'info',
        fields: [field],
        value: outliers.length,
        title: 'Outliers Detectados',
        description: `${outliers.length} valores (${pct}%) estão fora da faixa esperada de ${lower.toFixed(
          2
        )} a ${upper.toFixed(2)}.`,
        recommendation:
          'Investigue se são erros de digitação. Se forem reais, podem ser os pontos mais interessantes dos seus dados!',
        icon: '🔴',
      },
    ];
  }

  // z-score fallback: values beyond 3 standard deviations.
  const m = values.reduce((s, v) => s + v, 0) / values.length;
  const variance = values.reduce((s, v) => s + (v - m) ** 2, 0) / values.length;
  const sd = Math.sqrt(variance);
  if (sd === 0) {
    return [];
  }
  const outliers = values.filter((v) => Math.abs((v - m) / sd) > 3);
  if (outliers.length === 0) {
    return [];
  }
  return [
    {
      type: 'outlier',
      severity: outliers.length > values.length * 0.05 ? 'warning' : 'info',
      fields: [field],
      value: outliers.length,
      title: 'Outliers Detectados',
      description: `${outliers.length} valores estão a mais de 3 desvios-padrão da média.`,
      recommendation: 'Confira se são erros de entrada ou valores extremos reais.',
      icon: '🔴',
    },
  ];
}
