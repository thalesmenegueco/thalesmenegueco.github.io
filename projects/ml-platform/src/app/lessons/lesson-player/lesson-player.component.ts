import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import type { LessonContent, LessonContentStep } from '@ml/engine';
import { KatexComponent } from '@shared/katex';
import { VectorSpaceWidgetComponent, type Vec2 } from '../../widgets/vector-space/vector-space.component';
import { RichTextComponent } from '../rich-text.component';

/**
 * Renders a generated `LessonContent`, one step at a time.
 *
 * **Provisional on purpose.** This player deliberately consumes `LessonContentStep` — the
 * *generation* contract — with no translation layer, so the pilot can be played without
 * deciding what the ML *runtime* model should be. It has no `scenario` field, no machine
 * checked advancement and no `options`/`feedback`: the checkpoint is a question whose answer
 * the student reveals and judges for themselves. That is one of the three shapes on the
 * table in `../README.md`, surfaced here as a visible limitation rather than a silent one.
 * When that decision lands, this component is the thing that changes.
 *
 * Two things the contract cannot carry, handled rather than hidden:
 *
 *   - the step's widget target has no field, so it is the constant below, mirroring the
 *     manifest's `numericExample`;
 *   - `widgetInteraction.expectedInsight` is a *design* field — showing it would give away
 *     the discovery the step is built on — so it stays hidden behind the review toggle,
 *     which exists so an author can audit the arc while playing it.
 */
@Component({
  selector: 'app-lesson-player',
  standalone: true,
  imports: [KatexComponent, VectorSpaceWidgetComponent, RichTextComponent],
  templateUrl: './lesson-player.component.html',
  styleUrl: './lesson-player.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonPlayerComponent {
  readonly lesson = input.required<LessonContent>();

  /** Emitted when the student marks the lesson finished. */
  readonly finished = output<string>();

  protected readonly index = signal(0);
  protected readonly revealed = signal(false);
  protected readonly reviewMode = signal(false);
  protected readonly markedDone = signal(false);

  /**
   * Widget target for the pilot, mirroring `numericExample` of
   * `manifests/fundamentos-teoria-01.json`. There is no field for it in `LessonContentStep`.
   */
  protected readonly widgetTarget: Vec2 = [2, 3];

  protected readonly step = computed<LessonContentStep>(() => this.lesson().steps[this.index()]);
  protected readonly total = computed(() => this.lesson().steps.length);
  protected readonly isLast = computed(() => this.index() >= this.total() - 1);

  protected go(to: number): void {
    const clamped = Math.max(0, Math.min(this.total() - 1, to));
    if (clamped !== this.index()) {
      this.index.set(clamped);
      this.revealed.set(false);
    }
  }

  protected next(): void {
    this.go(this.index() + 1);
  }

  protected prev(): void {
    this.go(this.index() - 1);
  }

  protected toggleAnswer(): void {
    this.revealed.update((open) => !open);
  }

  protected toggleReview(): void {
    this.reviewMode.update((on) => !on);
  }

  protected finish(): void {
    if (!this.markedDone()) {
      this.markedDone.set(true);
      this.finished.emit(this.lesson().lessonId);
    }
  }

  /** `mml-2.4` → `MML §2.4`, so the citation reads like the book's table of contents. */
  protected refLabel(ref: string): string {
    const [book, address] = ref.split('-');
    return `${book.toUpperCase()} §${address}`;
  }
}
