import { ControlType, Metric } from './process.types';

/**
 * Pure math for the RC-circuit process, plus the live metrics derived from
 * the interactive controls. No framework dependency — unit-testable in
 * isolation.
 */

export const CIRCUIT = {
  vmax: 12,
  tau: 3,
  targetTime: 3,
} as const;

export function voltage(t: number): number {
  return CIRCUIT.vmax * (1 - Math.exp(-t / CIRCUIT.tau));
}

export function chargingRate(t: number): number {
  return (CIRCUIT.vmax / CIRCUIT.tau) * Math.exp(-t / CIRCUIT.tau);
}

export function secantSlope(t: number, h: number): number {
  return (voltage(t + h) - voltage(t)) / h;
}

export function formatNumber(value: number, digits = 4): string {
  return Number(value).toFixed(digits);
}

export function computeMetrics(
  controlType: ControlType,
  time: number,
  h: number,
  approachDistance: number,
): Metric[] {
  switch (controlType) {
    case 'time':
      return [
        { label: 'Tempo t', value: `${formatNumber(time, 2)} s` },
        { label: 'Tensão V(t)', value: `${formatNumber(voltage(time))} V` },
        { label: "Taxa V'(t)", value: `${formatNumber(chargingRate(time))} V/s` },
      ];
    case 'h':
      return [
        { label: 'Tempo alvo', value: '3.00 s' },
        { label: 'Segundo tempo', value: `${formatNumber(3 + h, 2)} s` },
        {
          label: 'Inclinação da secante',
          value: `${formatNumber(secantSlope(3, h))} V/s`,
        },
        {
          label: 'Inclinação da tangente',
          value: `${formatNumber(chargingRate(3))} V/s`,
        },
      ];
    case 'approach':
      return [
        {
          label: 'Valor pela esquerda',
          value: `${formatNumber(voltage(3 - approachDistance))} V`,
        },
        {
          label: 'Valor pela direita',
          value: `${formatNumber(voltage(3 + approachDistance))} V`,
        },
        { label: 'Valor em t = 3', value: `${formatNumber(voltage(3))} V` },
      ];
    case 'result':
      return [
        { label: 'Tempo selecionado', value: `${formatNumber(time, 2)} s` },
        { label: 'Tensão', value: `${formatNumber(voltage(time))} V` },
        {
          label: 'Taxa de carregamento',
          value: `${formatNumber(chargingRate(time))} V/s`,
        },
      ];
    case 'none':
    default:
      return [];
  }
}
