import { validateStep, type LessonAppState } from './lesson.engine';
import type { LessonStep } from './lesson.types';
import type { AnalysisSuggestion, Dataset, Field } from '../models/types';
import type { ColumnTable } from 'arquero';

function datasetWith(fields: Field[]): Dataset {
  return { fields, table: null as unknown as ColumnTable };
}

function state(overrides: Partial<LessonAppState> = {}): LessonAppState {
  return {
    dataset: null,
    selectedFields: [],
    activeSuggestion: null,
    ...overrides,
  };
}

function suggestion(kind: string): AnalysisSuggestion {
  return {
    id: kind,
    kind: kind as AnalysisSuggestion['kind'],
    label: kind,
    explanation: 'explanation',
    applicableFieldTypes: [],
  };
}

describe('lesson engine', () => {
  it('validates fieldTypes against the dataset', () => {
    const step: LessonStep = {
      id: 's1',
      title: 't',
      instruction: 'i',
      action: 'upload',
      validation: {
        type: 'fieldTypes',
        expectedFields: [{ name: 'height', type: 'numerical', description: '' }],
      },
      explanation: 'ok',
    };

    const ok = validateStep(
      step,
      state({ dataset: datasetWith([{ name: 'height', type: 'numerical' }]) })
    );
    expect(ok.valid).toBeTrue();

    const bad = validateStep(
      step,
      state({ dataset: datasetWith([{ name: 'height', type: 'categorical' }]) })
    );
    expect(bad.valid).toBeFalse();
  });

  it('validates chartType against selected fields and active suggestion', () => {
    const step: LessonStep = {
      id: 's2',
      title: 't',
      instruction: 'i',
      action: 'chartSelection',
      validation: {
        type: 'chartType',
        expectedChartType: 'scatter-plot',
        expectedFieldNames: ['height', 'weight'],
      },
      explanation: 'ok',
    };

    const good = state({
      dataset: datasetWith([
        { name: 'height', type: 'numerical' },
        { name: 'weight', type: 'numerical' },
      ]),
      selectedFields: [
        { name: 'height', type: 'numerical' },
        { name: 'weight', type: 'numerical' },
      ],
      activeSuggestion: suggestion('scatter-plot'),
    });
    expect(validateStep(step, good).valid).toBeTrue();

    const wrongChart = state({ ...good, activeSuggestion: suggestion('box-plot') });
    expect(validateStep(step, wrongChart).valid).toBeFalse();

    const wrongFields = state({
      ...good,
      selectedFields: [{ name: 'height', type: 'numerical' }],
    });
    expect(validateStep(step, wrongFields).valid).toBeFalse();
  });

  it('validates a multiple-choice interpretation', () => {
    const step: LessonStep = {
      id: 's3',
      title: 't',
      instruction: 'i',
      action: 'multipleChoice',
      validation: {
        type: 'interpretation',
        correctAnswer: 'a',
        options: [
          { id: 'a', text: 'right', feedback: 'acertou' },
          { id: 'b', text: 'wrong', feedback: 'errou' },
        ],
      },
      explanation: 'ok',
    };

    expect(validateStep(step, state(), 'a').valid).toBeTrue();
    const bad = validateStep(step, state(), 'b');
    expect(bad.valid).toBeFalse();
    expect(bad.message).toBe('errou');
  });

  it('validates text answers by keyword', () => {
    const step: LessonStep = {
      id: 's4',
      title: 't',
      instruction: 'i',
      action: 'textAnswer',
      validation: {
        type: 'textMatch',
        keywords: ['forte', 'positiva', '0.85'],
      },
      explanation: 'ok',
    };

    expect(validateStep(step, state(), 'é uma correlação positiva forte').valid).toBeTrue();
    expect(validateStep(step, state(), 'r = 0.85').valid).toBeTrue();
    expect(validateStep(step, state(), 'não sei').valid).toBeFalse();
  });
});
