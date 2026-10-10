import type { RuntimeValidation, WidgetSnapshot } from './lesson-runtime.types';

/**
 * Pure, framework-free step validation — the ML counterpart of
 * `src/app/calculus/calculus.engine.ts`, and small for the same reason: who may advance is a
 * decision about data, so it is a function of `(validation, snapshot)` and not a component
 * concern. Cálculo's version is a ~70-line switch over seven types; this one starts with three.
 *
 * **It fails closed on purpose.** A field the widget never reported is not "satisfied by
 * default" — it is a step that cannot be completed, and the student gets a message saying
 * what to do. The alternative (treating `undefined` as true) is what made shape (c) free: every
 * step passed because nothing was checked.
 */
export function validateStep(
  validation: RuntimeValidation,
  snapshot: WidgetSnapshot | undefined,
): boolean {
  switch (validation.type) {
    case 'equals':
      return snapshot?.[validation.field] === validation.value;

    case 'within': {
      const value = snapshot?.[validation.field];
      return (
        typeof value === 'number' &&
        Number.isFinite(value) &&
        value >= validation.range[0] &&
        value <= validation.range[1]
      );
    }

    case 'formula':
      // The option chooser reports `{ option: <id> }`, so a formula check is an assertion on a
      // snapshot field like any other — the type differs for intent and for the message.
      return snapshot?.[FORMULA_FIELD] === validation.correctAnswer;

    default:
      return false;
  }
}

/** The snapshot field the option chooser reports. Named once: writer and reader must agree. */
export const FORMULA_FIELD = 'option';

/** Generic refusal messages, by validation type. */
const MESSAGES: Record<RuntimeValidation['type'], string> = {
  equals: 'Explore o widget até chegar ao estado indicado na instrução.',
  within: 'Aproxime o controle da faixa indicada e observe novamente.',
  formula: 'Escolha uma das fórmulas antes de continuar.',
};

/**
 * What the student reads when the advance was refused. The step's authored `hint` wins when it
 * has one, so the refusal can name the exact control instead of describing the check — which is
 * the difference between a gate that teaches and one that only blocks.
 */
export function validationMessage(
  validation: RuntimeValidation,
  hint?: string,
): string {
  return hint ?? MESSAGES[validation.type];
}
