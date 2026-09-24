/**
 * `@ml/engine` — the maths the ML courses teach, in plain TypeScript.
 *
 * Two things live here, and they are deliberately in one place:
 *
 * 1. **The generation contract** (`lesson-content.types.ts`) — what a generator
 *    must produce from a lesson manifest. Types only, no runtime.
 * 2. **The engine** (`vectors`, `matrices`, `linear-regression`, `probability`,
 *    `functions`) — the same algorithms the lessons build by hand, so a lesson's
 *    numeric example is checked against code instead of against prose.
 *
 * Why not `libs/shared-*`: those are cross-project infrastructure (plotting,
 * KaTeX, progress, the study catalogue). This is a domain engine. The namespace
 * says so: `@shared/*` is infrastructure, `@ml/engine` is the maths.
 *
 * `methodology.md` sets the constraint that shaped this: before Curso 3 the
 * algorithms are "TS puro" — no TensorFlow.js, no numeric library — because the
 * student is supposed to be able to re-derive every step on paper.
 */

export {
  type LessonWidgetInteraction,
  type LessonCheckpoint,
  type LessonContentStep,
  type LessonContent,
  type LessonContentGap,
  type LessonContentResult,
  isLessonContentGap,
} from './lesson-content.types';

export {
  type Vector,
  dot,
  norm,
  scale,
  add,
  subtract,
  linearCombination,
  cosineAngle,
  projection,
} from './vectors';

export {
  type Matrix,
  matMul,
  matVec,
  transpose,
  solveLinearSystem,
  eigenvalues2x2,
} from './matrices';

export {
  type RegisteredFunction,
  FUNCTIONS,
  FUNCTION_IDS,
  getFunction,
  evaluateFunction,
  evaluateGradient,
} from './functions';

export {
  type GradientDescentOptions,
  type GradientDescentTrace,
  meanSquaredError,
  designMatrix,
  mseGradient,
  gradientDescentStep,
  gradientDescentLinear,
  normalEquation,
  descend1d,
} from './linear-regression';

export { erf, normalCdf, gaussianProbabilityWithin } from './probability';
