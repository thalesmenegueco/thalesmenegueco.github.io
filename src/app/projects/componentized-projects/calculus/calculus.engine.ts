import { Validation } from './calculus.types';

/**
 * Pure, framework-free step validation.
 *
 * `value` is whatever the active widget last emitted (a number for sliders,
 * a string for select/choice widgets, or `undefined` when untouched).
 */
export function validateStep(
  validation: Validation | undefined,
  value: unknown,
): boolean {
  if (!validation) {
    return true;
  }

  switch (validation.type) {
    case 'formulaMatch':
      return value === validation.correctAnswer;
    // The limit table is a read-only pattern observation; it always passes.
    case 'limitTableCompletion':
      return true;
    case 'modeSelection':
      return value === validation.target;
    case 'continuityToggle':
      return value === validation.target;
    case 'range':
      return (
        typeof value === 'number' &&
        Number.isFinite(value) &&
        value >= validation.targetRange[0] &&
        value <= validation.targetRange[1]
      );
    case 'positiveDerivative':
      return typeof value === 'number' && value > 0;
    case 'ruleSelection':
      return value === validation.target;
    default:
      return true;
  }
}

export function validationMessage(
  validation: Validation | undefined,
): string {
  const messages: Record<string, string> = {
    formulaMatch: 'Escolha uma fórmula antes de continuar.',
    modeSelection:
      'Explore o comportamento solicitado no controle do widget.',
    continuityToggle:
      'Alterne o estado da função para o modo indicado na instrução.',
    range: 'Aproxime o controle da faixa indicada e observe novamente.',
    positiveDerivative:
      'Mova o ponto para uma região em que a derivada seja positiva.',
    ruleSelection:
      'Selecione a estrutura matemática indicada na instrução.',
  };

  return validation
    ? (messages[validation.type] ?? 'Explore o widget e tente novamente.')
    : 'Explore o widget e tente novamente.';
}
