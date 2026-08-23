import type { Insight } from '../insight.types';
import { pearsonCorrelation } from '../stats-helpers';

export interface NumericColumn {
  name: string;
  data: unknown[];
}

/**
 * Detects pairs of numerical columns with a strong linear correlation.
 * Pure function: columns in, Insight[] out.
 */
export function detectStrongCorrelations(
  columns: NumericColumn[],
  threshold = 0.7
): Insight[] {
  const insights: Insight[] = [];

  for (let i = 0; i < columns.length; i++) {
    for (let j = i + 1; j < columns.length; j++) {
      const a = columns[i];
      const b = columns[j];
      const corr = pearsonCorrelation(a.data, b.data);
      if (corr === null || Math.abs(corr) <= threshold) {
        continue;
      }

      const direction = corr > 0 ? 'positiva' : 'negativa';
      insights.push({
        type: 'correlation',
        severity: Math.abs(corr) > 0.85 ? 'critical' : 'warning',
        fields: [a.name, b.name],
        value: corr,
        title: `Correlação ${direction} forte detectada`,
        description: `${a.name} e ${b.name} têm uma correlação de ${corr.toFixed(
          2
        )}. Isso significa que tendem a variar juntas.`,
        recommendation: 'Explore com um scatter plot. Mas cuidado: correlação ≠ causação!',
        icon: '🔗',
      });
    }
  }

  return insights;
}
