import type { AnalysisSuggestion, Dataset, Field } from '../models/types';
import type { LessonStep } from './lesson.types';

/**
 * Pure, framework-free lesson validation. Given the current app state (and an
 * optional user answer), decides whether a step is satisfied. No Angular DI, no
 * signals — fully unit-testable.
 */

export interface LessonAppState {
  dataset: Dataset | null;
  selectedFields: Field[];
  activeSuggestion: AnalysisSuggestion | null;
}

export interface ValidationResult {
  valid: boolean;
  message: string;
}

function hasField(actual: Field[], name: string, type: string): boolean {
  return actual.some((f) => f.name === name && f.type === type);
}

export function validateStep(
  step: LessonStep,
  state: LessonAppState,
  answer?: string
): ValidationResult {
  const rule = step.validation;

  switch (rule.type) {
    case 'fieldTypes': {
      const expected = rule.expectedFields ?? [];
      const actual = state.dataset?.fields ?? [];
      const ok =
        expected.length > 0 && expected.every((e) => hasField(actual, e.name, e.type));
      return ok
        ? { valid: true, message: 'Tipos corretos! Continue para a próxima etapa.' }
        : { valid: false, message: rule.errorMessage ?? 'Confirme os tipos das colunas esperadas.' };
    }

    case 'chartType': {
      const expectedNames = (rule.expectedFieldNames ?? []).slice().sort();
      const selectedNames = state.selectedFields.map((f) => f.name).slice().sort();
      const kindOk = !!rule.expectedChartType && state.activeSuggestion?.kind === rule.expectedChartType;
      const fieldsOk =
        expectedNames.length === selectedNames.length &&
        expectedNames.every((n, i) => n === selectedNames[i]);
      return kindOk && fieldsOk
        ? { valid: true, message: 'Gráfico correto! Continue para a próxima etapa.' }
        : { valid: false, message: rule.errorMessage ?? 'Selecione os campos e o gráfico corretos.' };
    }

    case 'interpretation':
    case 'knowledge': {
      const correct = rule.correctAnswer;
      if (answer === correct) {
        const opt = rule.options?.find((o) => o.id === correct);
        return { valid: true, message: opt?.feedback ?? step.explanation };
      }
      const chosen = rule.options?.find((o) => o.id === answer);
      return { valid: false, message: chosen?.feedback ?? 'Tente novamente.' };
    }

    case 'textMatch': {
      const keywords = rule.keywords ?? [];
      const text = (answer ?? '').toLowerCase();
      const matched = keywords.filter((k) => text.includes(k.toLowerCase()));
      if (matched.length > 0) {
        return { valid: true, message: rule.feedback ?? step.explanation };
      }
      return {
        valid: false,
        message:
          'Ainda não identifiquei a resposta. Tente usar os termos do enunciado (ex.: "forte", "positiva", "0.85").',
      };
    }

    default:
      return { valid: true, message: step.explanation };
  }
}
