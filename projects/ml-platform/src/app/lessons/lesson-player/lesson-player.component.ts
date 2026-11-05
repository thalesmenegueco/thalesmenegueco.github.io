import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import type { LessonContent, LessonContentStep } from '@ml/engine';
import { KatexComponent } from '@shared/katex';
import { ProjectionWidgetComponent } from '../../widgets/projection/projection.component';
import { VectorSpaceWidgetComponent } from '../../widgets/vector-space/vector-space.component';
import { RichTextComponent } from '../rich-text.component';
import type { LessonRuntime, WidgetSnapshot } from '../runtime/lesson-runtime.types';
import { validateStep, validationMessage } from '../runtime/validate-step';
import { hasWidgetComponent } from './widget-registry';

/**
 * Renders a generated `LessonContent` against its `LessonRuntime`, one step at a time.
 *
 * **It no longer advances for free.** Until 2026-10-05 this component consumed the generation
 * contract directly with no translation layer — shape (c) — and the visible consequence was
 * that a student could click "próximo" three times, mark the lesson done, and have the hub count
 * it, without touching the widget. Every manifest's required `completionCriterion` ("o sistema
 * confirma que v = Σ cᵢbᵢ") described a check nothing performed. Now the step's check decides,
 * the refusal carries a message, and a lesson can only be finished once **every** step's check
 * has been met at least once.
 *
 * Two inputs, and the split is the decision (b) of `../README.md`:
 *
 *   - `lesson` is the **generated** content — prose, formulas, checkpoint, source refs. What the
 *     author audited against the book, byte for byte;
 *   - `runtime` is the **authored** pedagogy — how the student advances, which alternatives the
 *     formula step offers, and the widget's initial state read from the manifest's own
 *     `widgetConfig` + `numericExample.inputs` (through the generated bindings fixture).
 *
 * Neither knows about the other: they are joined by `contentStepId`. That is what lets the
 * content be regenerated without moving a single validation, and a validation be retuned
 * without touching a word the audit signed off on.
 *
 * **The player no longer knows any widget's vocabulary.** It used to read
 * `numericExample.inputs.c` and `.base` and pass them as `[target]`/`[bases]` — first as the
 * constant `[2, 3]` copied out of `fundamentos-teoria-01`'s example, later from the fixture. That
 * worked only because there was one widget: the second one initialises from `inputs.x`/`.y`, and
 * the third will use something else. So each widget now receives the binding **whole** (plus the
 * `lessonId`, for its error messages) and reads its own inputs — see
 * `../runtime/widget-contract.ts`. Rendering stays a static `@switch`, because a dynamic outlet
 * cannot bind an output; `./widget-registry.ts` records which ids have a component and why the
 * two lists coexist.
 */
@Component({
  selector: 'app-lesson-player',
  standalone: true,
  imports: [
    KatexComponent,
    VectorSpaceWidgetComponent,
    ProjectionWidgetComponent,
    RichTextComponent,
    JsonPipe,
  ],
  templateUrl: './lesson-player.component.html',
  styleUrl: './lesson-player.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonPlayerComponent {
  readonly lesson = input.required<LessonContent>();
  readonly runtime = input.required<LessonRuntime>();

  /** Emitted when the student marks the lesson finished, once every step's check was met. */
  readonly finished = output<string>();

  protected readonly index = signal(0);
  protected readonly revealed = signal(false);
  protected readonly reviewMode = signal(false);
  protected readonly markedDone = signal(false);

  /** Why the last advance was refused, if it was. */
  protected readonly feedback = signal<string | null>(null);

  /** The alternative the student picked on a formula step. */
  protected readonly chosenOption = signal<string | null>(null);

  /** Steps whose check has been satisfied. Completion means every step id is in here. */
  protected readonly satisfiedIds = signal<readonly string[]>([]);

  /** What the widget last reported. Reset on every step change, so a stale value cannot pass. */
  private readonly reported = signal<WidgetSnapshot | undefined>(undefined);

  protected readonly step = computed<LessonContentStep>(() => this.lesson().steps[this.index()]);
  protected readonly total = computed(() => this.lesson().steps.length);
  protected readonly isLast = computed(() => this.index() >= this.total() - 1);

  protected readonly runtimeStep = computed(() =>
    this.runtime().steps.find((candidate) => candidate.contentStepId === this.step().id),
  );

  protected readonly options = computed(() => this.runtimeStep()?.options ?? []);

  protected readonly everyStepSatisfied = computed(() =>
    this.lesson().steps.every((s) => this.satisfiedIds().includes(s.id)),
  );

  protected readonly isSatisfied = computed(() => this.satisfiedIds().includes(this.step().id));

  /**
   * Whether the widget named by the runtime has a component at all.
   *
   * Two different failures look identical in the template otherwise, and they want different
   * readers: an id that is **not** in the registry is content pointing at a widget nobody has
   * built yet (a roadmap state, and the lesson simply is not playable), while an id that **is**
   * in the registry but has no `@case` is a code defect in this template. The second one has no
   * other detector — a spec cannot read the template — so it names itself here instead.
   */
  protected readonly widgetRegistered = computed(() =>
    hasWidgetComponent(this.runtime().widget.widgetId),
  );

  protected go(to: number): void {
    const clamped = Math.max(0, Math.min(this.total() - 1, to));
    if (clamped !== this.index()) {
      this.index.set(clamped);
      this.resetStepState();
    }
  }

  protected next(): void {
    const runtimeStep = this.runtimeStep();

    // A step already satisfied stays satisfied: coming back to it through the dots should not
    // ask the student to prove it twice.
    if (runtimeStep && !this.isSatisfied() && !validateStep(runtimeStep.validation, this.reported())) {
      this.feedback.set(validationMessage(runtimeStep.validation, runtimeStep.hint));
      return;
    }

    this.satisfiedIds.update((ids) => (ids.includes(this.step().id) ? ids : [...ids, this.step().id]));
    this.feedback.set(null);
    this.go(this.index() + 1);
  }

  protected prev(): void {
    this.go(this.index() - 1);
  }

  protected onWidgetSnapshot(snapshot: WidgetSnapshot): void {
    this.reported.set(snapshot);
    // Interacting is itself the answer to a refusal: clear the message rather than let it sit
    // there while the student does exactly what it asked.
    this.feedback.set(null);
  }

  /** Picking an alternative is reported like a widget state — `{ option: <id> }`. */
  protected chooseOption(id: string): void {
    this.chosenOption.set(id);
    this.reported.set({ option: id });
    this.feedback.set(null);
  }

  protected optionFeedback(): string | null {
    const chosen = this.chosenOption();
    if (!chosen) {
      return null;
    }
    return this.options().find((option) => option.id === chosen)?.feedback ?? null;
  }

  protected toggleAnswer(): void {
    this.revealed.update((open) => !open);
  }

  protected toggleReview(): void {
    this.reviewMode.update((on) => !on);
  }

  /**
   * Conclude the lesson — and **check the last step first**, exactly as `next()` checks every
   * other one.
   *
   * This was missing, and it made every ML lesson unfinishable: only `next()` ever added a step to
   * `satisfiedIds`, and `next()` is unreachable on the last step, where this button replaces it.
   * So `everyStepSatisfied()` was always false there, `finish()` always refused with "faltam 1
   * passo", and `finished` never fired — the hub could not count a lesson that the student had in
   * fact completed. Found on 2026-10-28 while wiring lesson 02, by a spec that clicked the real
   * button instead of asserting on its label.
   *
   * The refusal at the end is still needed, and this does not weaken it: a student who jumps to the
   * last step through the dots gets the last step marked here and is then told which earlier steps
   * are missing.
   */
  protected finish(): void {
    const runtimeStep = this.runtimeStep();
    if (runtimeStep && !this.isSatisfied() && !validateStep(runtimeStep.validation, this.reported())) {
      this.feedback.set(validationMessage(runtimeStep.validation, runtimeStep.hint));
      return;
    }

    this.satisfiedIds.update((ids) =>
      ids.includes(this.step().id) ? ids : [...ids, this.step().id],
    );

    if (!this.everyStepSatisfied()) {
      const missing = this.lesson().steps.filter((s) => !this.satisfiedIds().includes(s.id));
      this.feedback.set(
        `Faltam ${missing.length} passo(s) para concluir: ${missing.map((s) => s.title).join('; ')}. ` +
          'Use os pontos no cabeçalho para voltar até eles.',
      );
      return;
    }

    if (!this.markedDone()) {
      this.markedDone.set(true);
      this.finished.emit(this.lesson().lessonId);
    }
  }

  private resetStepState(): void {
    this.revealed.set(false);
    this.feedback.set(null);
    this.chosenOption.set(null);
    this.reported.set(undefined);
  }

  /** `mml-2.4` → `MML §2.4`, so the citation reads like the book's table of contents. */
  protected refLabel(ref: string): string {
    const [book, address] = ref.split('-');
    return `${book.toUpperCase()} §${address}`;
  }
}
