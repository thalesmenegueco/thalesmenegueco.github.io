/**
 * The **generation contract** for ML lesson content — Camada 3 of the pipeline.
 *
 * Why not `LessonStep`: that name already belongs to the Calculus app
 * (`projects/ml-platform/src/app/calculus/calculus.types.ts`), where a step is a
 * *runtime* model — a `WidgetType` enum plus a `Validation` union that decides
 * whether the student may advance. This one is a *generation* contract: what a
 * generator must produce from a manifest (`../manifests/*.json`), prose and
 * maths only, with no knowledge of any widget implementation. `libs/shared-learning/index.ts`
 * records the same decision from the other side: the ML courses get their own
 * engine, designed fresh, instead of merging the EDA/Calculus one.
 *
 * The bridge between the two is the manifest: it names the `widget` and the
 * `completionCriterion`, and the runtime later maps this content onto its own
 * step model. Content never invents a widget; it describes what the student does
 * with the one the manifest chose.
 *
 * Every step carries `sourceRefs` so the audit (verification level 1 in
 * `PIPELINE.md`) can check that a claim is traceable to the extracted section it
 * cites, and that the citation was in the manifest's `sourceRefs`.
 */

/** What the student does with the lesson's widget, and what they should see. */
export interface LessonWidgetInteraction {
  /** Widget the step is played on — must exist in `manifests/registries.json`. */
  widgetId: string;
  /** Imperative instruction shown to the student. */
  prompt: string;
  /** What the student is expected to notice. This is the step's insight. */
  expectedInsight: string;
}

/**
 * Self-assessment. Deliberately a question and its answer rather than a
 * `Validation` union: the runtime decides *how* to check, so a textual checkpoint
 * survives a change of widget.
 */
export interface LessonCheckpoint {
  question: string;
  answer: string;
}

/** One step of generated content, in discovery order. */
export interface LessonContentStep {
  /** Stable within the lesson, e.g. `passo-1`. */
  id: string;
  title: string;
  /** Discovery-based prose, 2–4 sentences per block, one block per idea. */
  narrative: string[];
  /** KaTeX formulas, copied literally from the cited source sections. */
  katex: string[];
  widgetInteraction: LessonWidgetInteraction;
  checkpoint: LessonCheckpoint;
  /** Section ids from `content-source/` this step draws on, e.g. `mml-5.2`. */
  sourceRefs: string[];
}

/** A whole generated lesson, ready for review before it reaches the runtime. */
export interface LessonContent {
  /** The manifest's `lessonId` — content is always addressed by contract id. */
  lessonId: string;
  title: string;
  /** The manifest's `objective`, restated by the generator as a promise. */
  objective: string;
  steps: LessonContentStep[];
}

/**
 * The escape hatch of fidelity rule 4: when the source does not cover what the
 * manifest asks for, the generator reports the hole instead of inventing.
 */
export interface LessonContentGap {
  gap: string;
}

/**
 * What a generation call returns: either content, or a declared gap. A model that
 * cannot say "I don't know" invents a plausible formula; this union is what makes
 * saying it possible.
 */
export type LessonContentResult = LessonContent | LessonContentGap;

/** Narrowing helper: `true` when the generator reported a gap instead of content. */
export function isLessonContentGap(
  result: LessonContentResult,
): result is LessonContentGap {
  return typeof (result as LessonContentGap).gap === 'string';
}
