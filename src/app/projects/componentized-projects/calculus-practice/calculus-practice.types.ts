/**
 * Data model for the applied-math module of the Calculus subject
 * ("Matemática aplicada ao Cálculo").
 *
 * Unlike the theory lessons, each exercise opens with a real-world decision
 * or measurement. Calculus enters as the tool that answers the situation,
 * and `takeaway` generalizes the result back to the mathematical concept.
 */

export type ProblemArea =
  | 'elétrica'
  | 'mecânica'
  | 'arquitetura'
  | 'programação'
  | 'economia';

export type VisualizationType =
  | 'rc'
  | 'braking'
  | 'window'
  | 'algorithm'
  | 'revenue'
  | 'tank';

export interface Concept {
  title: string;
  text: string;
}

export interface SolutionStep {
  /** A LaTeX expression rendered as a display formula. */
  latex: string;
}

export interface AppliedProblem {
  id: string;
  area: ProblemArea;
  title: string;
  scenarioTitle: string;
  scenario: string;
  prompt: string;
  /** LaTeX formula of the model being studied. */
  formula: string;
  answerLabel: string;
  answer: number;
  tolerance: number;
  hint: string;
  concepts: Concept[];
  solution: SolutionStep[];
  visualization: VisualizationType;
  /** Prose that generalizes the exercise back to the math concept. */
  takeaway: string;
}

export const AREA_LABELS: Record<ProblemArea, string> = {
  elétrica: 'Engenharia elétrica',
  mecânica: 'Engenharia mecânica',
  arquitetura: 'Arquitetura',
  programação: 'Programação',
  economia: 'Economia',
};
