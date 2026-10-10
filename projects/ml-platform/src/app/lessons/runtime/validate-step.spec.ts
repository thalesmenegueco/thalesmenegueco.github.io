import type { RuntimeValidation } from './lesson-runtime.types';
import { validateStep, validationMessage } from './validate-step';

/**
 * The pure advance gate. Cálculo's `calculus.engine.ts` is the precedent: who may advance is a
 * decision about data, so it is a function of `(validation, snapshot)` and gets tested as one —
 * no TestBed, no widget, no DOM.
 *
 * The two properties worth more than the happy paths: **it fails closed** (an unreported field
 * is not a pass), and **a refused step explains itself** in the student's language.
 */
describe('validateStep', () => {
  it('equals: só passa com o estado declarado', () => {
    const validation: RuntimeValidation = { type: 'equals', field: 'reached', value: true };

    expect(validateStep(validation, { reached: true })).toBeTrue();
    expect(validateStep(validation, { reached: false })).toBeFalse();
    expect(validateStep(validation, {})).toBeFalse();
    expect(validateStep(validation, undefined)).toBeFalse();
  });

  it('equals: distingue o valor por tipo, sem coagir', () => {
    const validation: RuntimeValidation = { type: 'equals', field: 'mode', value: '3' };

    expect(validateStep(validation, { mode: '3' })).toBeTrue();
    expect(validateStep(validation, { mode: 3 })).toBeFalse();
  });

  it('within: aceita a faixa inclusive nas duas pontas', () => {
    const validation: RuntimeValidation = { type: 'within', field: 'lambda', range: [-3, -0.5] };

    expect(validateStep(validation, { lambda: -3 })).toBeTrue();
    expect(validateStep(validation, { lambda: -0.5 })).toBeTrue();
    expect(validateStep(validation, { lambda: -1.75 })).toBeTrue();

    expect(validateStep(validation, { lambda: 0 })).toBeFalse();
    expect(validateStep(validation, { lambda: -3.5 })).toBeFalse();
  });

  it('within: um campo que não é número não passa — nem uma string numérica', () => {
    const validation: RuntimeValidation = { type: 'within', field: 'lambda', range: [-3, -0.5] };

    expect(validateStep(validation, { lambda: '-1' })).toBeFalse();
    expect(validateStep(validation, { lambda: Number.NaN })).toBeFalse();
    expect(validateStep(validation, {})).toBeFalse();
  });

  it('formula: passa só com a alternativa declarada', () => {
    const validation: RuntimeValidation = { type: 'formula', correctAnswer: 'a' };

    expect(validateStep(validation, { option: 'a' })).toBeTrue();
    expect(validateStep(validation, { option: 'b' })).toBeFalse();
    expect(validateStep(validation, undefined)).toBeFalse();
  });

  it('um campo que a widget nunca reporta reprova em vez de passar por omissão', () => {
    // The whole point of shape (b): in shape (c) every step passed *because* nothing was
    // checked. A validation naming a field that no widget emits must block the student, not
    // wave them through — that failure is loud in the browser and silent if it defaults to true.
    const typo: RuntimeValidation = { type: 'equals', field: 'reache', value: true };

    expect(validateStep(typo, { reached: true })).toBeFalse();
  });
});

describe('validationMessage', () => {
  it('usa a dica escrita pelo autor quando existe', () => {
    const validation: RuntimeValidation = { type: 'within', field: 'lambda', range: [-3, -0.5] };

    expect(validationMessage(validation, 'Leve λ para um valor negativo.')).toBe(
      'Leve λ para um valor negativo.',
    );
  });

  it('cai na mensagem do tipo quando o passo não tem dica', () => {
    expect(validationMessage({ type: 'formula', correctAnswer: 'a' }, undefined)).toContain(
      'Escolha',
    );
    expect(
      validationMessage({ type: 'equals', field: 'reached', value: true }, undefined),
    ).toContain('widget');
  });
});
