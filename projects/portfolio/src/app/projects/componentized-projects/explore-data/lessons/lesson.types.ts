import type { FieldType } from '../models/types';

export type LessonDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type LessonAction =
  | 'upload'
  | 'chartSelection'
  | 'multipleChoice'
  | 'textAnswer'
  | 'freeform';

export interface FieldDescription {
  name: string;
  type: FieldType;
  description?: string;
}

export interface AnswerOption {
  id: string;
  text: string;
  feedback: string;
}

export interface ValidationRule {
  type: 'fieldTypes' | 'chartType' | 'interpretation' | 'knowledge' | 'textMatch';
  /** fieldTypes: the columns (name + type) that must exist in the dataset. */
  expectedFields?: FieldDescription[];
  /** chartType: the expected ChartKind (e.g. 'scatter-plot'). */
  expectedChartType?: string;
  /** chartType: the field names that must be selected. */
  expectedFieldNames?: string[];
  /** interpretation: id of the correct option. */
  correctAnswer?: string;
  options?: AnswerOption[];
  /** textMatch: any of these keywords make the answer valid. */
  keywords?: string[];
  partialCredit?: boolean;
  errorMessage?: string;
  feedback?: string;
}

export interface LessonStep {
  id: string;
  title: string;
  instruction: string;
  action: LessonAction;
  validation: ValidationRule;
  hint?: string;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: LessonDifficulty;
  estimatedTime: string;
  objectives: string[];
  /** Inline CSV for the example dataset (self-contained, no file server needed). */
  exampleDatasetCsv: string;
  exampleFieldDescriptions: FieldDescription[];
  steps: LessonStep[];
  summary: {
    title: string;
    content: string;
    keyTakeaway: string;
  };
}
