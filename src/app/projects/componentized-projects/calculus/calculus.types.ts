/**
 * Core data model for the Calculus I learning app.
 *
 * Every lesson opens with a concrete `scenario` (the practical problem the
 * widget is in service of). Steps reference the scenario's variables before
 * the final step names the general formula.
 */

export type WidgetType =
  | 'limitExplorer'
  | 'discontinuityExplorer'
  | 'continuityExplorer'
  | 'averageSlopeExplorer'
  | 'tangentLineExplorer'
  | 'derivativeFunctionExplorer'
  | 'rulePlayground'
  | 'formulaMatch';

export interface FormulaOption {
  id: string;
  latex: string;
  feedback: string;
}

export type Validation =
  | { type: 'formulaMatch'; correctAnswer: string }
  | { type: 'limitTableCompletion'; target: number }
  | { type: 'modeSelection'; target: string }
  | { type: 'continuityToggle'; target: string }
  | { type: 'range'; targetParam: string; targetRange: [number, number] }
  | { type: 'positiveDerivative' }
  | { type: 'ruleSelection'; target: string };

export interface LessonStep {
  title: string;
  instruction: string;
  widget: WidgetType;
  options?: FormulaOption[];
  validation: Validation;
  /** May contain `$$...$$` inline LaTeX segments. */
  explanation: string;
}

export interface LessonSummary {
  title: string;
  content: string;
  keyTakeaway: string;
}

export interface Lesson {
  id: string;
  unit: string;
  title: string;
  description: string;
  estimatedTime: string;
  scenario: string;
  objectives: string[];
  steps: LessonStep[];
  summary: LessonSummary;
}
