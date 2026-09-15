/**
 * Data model for the "Process Lab" module of the Calculus subject.
 *
 * Unlike a sequence of exercises, a `MathematicalProcess` walks one real
 * problem through a chain of `ProcessStage`s — each stage is a mathematical
 * state transformation (situation → model → continuity → limit → secant →
 * tangent → derivative → result). Every transformation preserves the meaning
 * of the original physical situation.
 */

export type ControlType = 'none' | 'time' | 'approach' | 'h' | 'result';

export type ProcessVisualType =
  | 'circuit'
  | 'model'
  | 'limit'
  | 'secant'
  | 'tangent'
  | 'derivative'
  | 'result';

export interface FormulaTransformation {
  label: string;
  latex: string;
}

export interface Metric {
  label: string;
  value: string;
}

export interface StageReasoning {
  /** Bold lead-in, e.g. "Tradução:" or "Continuidade:". */
  lead: string;
  text: string;
}

export interface ProcessStage {
  id: string;
  /** Short label used in the flow strip. */
  flowLabel: string;
  title: string;
  purpose: string;
  visual: ProcessVisualType;
  visualTitle: string;
  visualCaption: string;
  formulas: FormulaTransformation[];
  /** Static metrics, shown when the stage has no interactive controls. */
  metrics: Metric[];
  reasoning: StageReasoning;
  controls: ControlType;
}

export interface Scenario {
  label: string;
  title: string;
  description: string;
  tags: string[];
}

export interface FormulaResult {
  title: string;
  description: string;
  label: string;
  latex: string;
}

export interface MathematicalProcess {
  scenario: Scenario;
  stages: ProcessStage[];
  finalResult: FormulaResult;
}
