import type { Insight } from '../insight.types';
import { coefficientOfVariation, numericValues, skewness } from '../stats-helpers';

/** Flags strongly skewed numerical columns. Pure function. */
export function detectDistributionShape(data: unknown[], field: string): Insight[] {
  const values = numericValues(data);
  if (values.length < 3) {
    return [];
  }

  const sk = skewness(values);
  if (Math.abs(sk) <= 1) {
    return [];
  }

  const direction = sk > 0 ? 'direita (cauda longa)' : 'esquerda (cauda longa)';
  return [
    {
      type: 'skewness',
      severity: Math.abs(sk) > 2 ? 'warning' : 'info',
      fields: [field],
      value: sk,
      title: 'Distribuição Assimétrica',
      description: `${field} é assimétrica para a ${direction}. Skewness = ${sk.toFixed(
        2
      )}. A maioria dos valores se concentra de um lado.`,
      recommendation:
        'Considere uma transformação logarítmica ou raiz quadrada para aproximar a distribuição da normal.',
      icon: '↗️',
    },
  ];
}

/** Flags columns whose high coefficient of variation suggests mixed groups. */
export function detectMultimodality(data: unknown[], field: string): Insight[] {
  const values = numericValues(data);
  if (values.length === 0) {
    return [];
  }

  const cv = coefficientOfVariation(values);
  if (cv <= 0.5) {
    return [];
  }

  return [
    {
      type: 'multimodal',
      severity: 'info',
      fields: [field],
      value: cv,
      title: 'Múltiplos Grupos?',
      description: `${field} tem variação alta (CV = ${cv.toFixed(
        2
      )}), o que pode indicar grupos ou populações distintas misturadas.`,
      recommendation: 'Tente separar por uma variável categórica para revelar subgrupos.',
      icon: '👥',
    },
  ];
}
