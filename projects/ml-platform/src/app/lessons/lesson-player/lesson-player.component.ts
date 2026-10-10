import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import type { LessonContent, LessonContentStep } from '@ml/engine';
import { KatexComponent } from '@shared/katex';
import {
  VectorSpaceWidgetComponent,
  type Vec2,
} from '../../widgets/vector-space/vector-space.component';
import { RichTextComponent } from '../rich-text.component';
import type { LessonRuntime, WidgetSnapshot } from '../runtime/lesson-runtime.types';
import { validateStep, validationMessage } from '../runtime/validate-step';

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
 * The widget's target is no longer a constant here. It used to be `widgetTarget: Vec2 = [2, 3]`
 * — a hand copy of `fundamentos-teoria-01`'s example, which the second lesson would have had to
 * duplicate.
 */
@Component({
  selector: 'app-lesson-player',
  standalone: true,
  imports: [KatexComponent, VectorSpaceWidgetComponent, RichTextComponent, JsonPipe],
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
   * The widget's initial target, from the manifest's `numericExample.inputs.c`.
   *
   * It throws instead of defaulting: a plausible fallback would be a second copy of the lesson's
   * own number, and a lesson whose widget has no target is a contract bug that should name
   * itself rather than draw the wrong picture.
   */
  protected readonly widgetTarget = computed<Vec2>(() => {
    const c = this.runtime().widget.inputs?.['c'];
    if (Array.isArray(c) && typeof c[0] === 'number' && typeof c[1] === 'number') {
      return [c[0], c[1]];
    }
    throw new Error(
      `${this.runtime().lessonId}: o manifesto não declara numericExample.inputs.c — ` +
        'a widget não tem alvo para desenhar. Veja manifests/README.md, campo numericExample.',
    );
  });

  /** The widget's base vectors, from the manifest's `numericExample.inputs.base`. */
  protected readonly widgetBases = computed<Vec2[]>(() => {
    const base = this.runtime().widget.inputs?.['base'];
    if (Array.isArray(base)) {
      const pairs = base.filter(
        (row): row is Vec2 =>
          Array.isArray(row) && typeof row[0] === 'number' && typeof row[1] === 'number',
      );
      if (pairs.length > 0) {
        return pairs;
      }
    }
    return [
      [1, 0],
      [0, 1],
    ];
  });

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

  protected finish(): void {
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
