/**
 * The **runtime model** of an ML lesson — shape **(b)** of the three shapes that used to be on
 * the table in [`../README.md`](../README.md), decided on 2026-10-05.
 *
 * ## Why this file exists at all
 *
 * `@ml/engine`'s `LessonContent` is the *generation* contract: prose, formulas and a
 * checkpoint, every claim traceable to a section of the book, auditable by comparing it with
 * `content-source/`. It deliberately knows nothing about widgets (see the docstring of
 * `lesson-content.types.ts`). Three things a lesson needs at runtime therefore have no home in
 * it, and never should:
 *
 *   - **how the student advances** — `completionCriterion` is a required manifest field
 *     written as something observable in the widget ("o sistema confirma que v = Σ cᵢbᵢ"), and
 *     in shape (c) nothing observed it: the student could click through a lesson untouched and
 *     the hub would count it as done;
 *   - **which formula alternatives the last step offers** — the distractors are
 *     *intentionally wrong* mathematics, and asking the generator for plausible-but-wrong
 *     formulas is precisely the failure the pipeline exists to prevent
 *     (`content-source/CAMADA3.md`). They are authored here, like Cálculo's
 *     `FormulaOption[]` in `src/app/calculus/lesson-data.ts`;
 *   - **the widget's initial state** — which the manifest already declares, in
 *     `widgetConfig` and `numericExample.inputs`, and which nothing read: the player carried a
 *     hand-copied `widgetTarget: [2, 3]` that duplicated `teoria-01`'s example numbers.
 *
 * So this layer binds content to runtime without touching either: the generated content stays
 * exactly what was audited, the manifest stays the contract, and the pedagogy that is **not
 * derived from the book** lives in one small authored file per lesson.
 *
 * ## One home per fact
 *
 * `scenario` is deliberately **not** a field here. The generation prompt already opens the
 * first `narrative` block with a concrete scenario, it is prose about the source, and moving
 * or copying it would put one fact in two files — the same drift this repository rejected for
 * `subjectId` (`manifests/README.md`, *Decisões tomadas*, item 6).
 */

/**
 * What a widget reports after the student interacts with it.
 *
 * Scalar keys only, on purpose: a snapshot is meant to be assertable in one line, and a nested
 * structure would invite the validation language to grow into a query language. The widget
 * decides which keys describe its own subject — `VectorSpaceWidget` reports `reached`,
 * `lambda`, `c1` and `c2`; a projection widget would report `cos` and the projection's
 * magnitude. Nothing outside the widget knows the key names except the runtime step that
 * asserts them, and an unknown key **fails closed** (see `validate-step.ts`).
 */
export type WidgetSnapshot = Record<string, number | string | boolean>;

/**
 * A step's machine check — the ML counterpart of Cálculo's `Validation` union
 * (`src/app/calculus/calculus.types.ts`), expressed against **named snapshot fields** instead
 * of a type per widget, because one ML widget serves several steps: `VectorSpaceWidget` is
 * explored three different ways inside a single lesson.
 */
export type RuntimeValidation =
  /** The named field holds this exact value — a state the student had to reach. */
  | { type: 'equals'; field: string; value: string | number | boolean }
  /** The named field is a number inside the range — "move this control there". */
  | { type: 'within'; field: string; range: [number, number] }
  /**
   * The student picked the right formula among the step's `options`.
   *
   * Spelled as its own type rather than as `equals` on the `option` field: the intent differs
   * (this one is an answer, not an exploration state), the refusal message differs, and the
   * player needs to know it renders alternatives.
   */
  | { type: 'formula'; correctAnswer: string };

/** One alternative of the formula step. `latex` is rendered by KaTeX, `feedback` per choice. */
export interface RuntimeFormulaOption {
  id: string;
  latex: string;
  /** Shown whichever choice it belongs to — the wrong ones teach by saying why. */
  feedback: string;
}

/** What one step of the lesson requires of the student. Keyed to content by `contentStepId`. */
export interface RuntimeStep {
  /** Matches `LessonContentStep.id` — `passo-1`, `passo-2`, … */
  contentStepId: string;
  validation: RuntimeValidation;
  /** Required by a `formula` validation, ignored otherwise. Two or more alternatives. */
  options?: RuntimeFormulaOption[];
  /**
   * What the student is asked when the step offers alternatives. Authored, because the
   * question is pedagogy: the generated content's `checkpoint` asks the student to explain the
   * idea, while this one asks them to *recognise* it, and the two are not the same sentence.
   */
  optionsPrompt?: string;
  /** Author's own wording for a refused advance; falls back to a per-type generic message. */
  hint?: string;
}

/**
 * The widget's initial state, **read from the manifest** — `manifests/<lessonId>.json`'s
 * `widget`, `widgetConfig` and `numericExample.inputs` — through the generated fixture
 * `lesson-bindings.generated.ts`, whose hash the gate checks. That is what removes the
 * hand-copied numbers from the player and makes the widget, the manifest's `expectedValues` and
 * the lesson's prose provably share one source.
 */
export interface RuntimeWidgetBinding {
  /** PascalCase name from `registries.json`, the manifest's `widget`. */
  widgetId: string;
  /** The manifest's `widgetConfig` — `availableOps`, `bases`, `presets`, … */
  config: Record<string, unknown>;
  /** The manifest's `numericExample.inputs`, or `null` for a contract without an example. */
  inputs: Record<string, unknown> | null;
}

/**
 * A lesson at runtime: its widget binding plus one entry per content step.
 *
 * The binding is **per lesson, not per step**, because the manifest declares one `widget` per
 * lesson — the contract says a lesson is played on one widget, and a lesson that needed two
 * would be a manifest change first. A step cannot configure its own widget; it directs the
 * student to a group of the controls the widget already exposes (`widgetConfig.availableOps`),
 * which is how `VectorSpaceWidget` serves three steps at once.
 */
export interface LessonRuntime {
  lessonId: string;
  widget: RuntimeWidgetBinding;
  steps: RuntimeStep[];
}
