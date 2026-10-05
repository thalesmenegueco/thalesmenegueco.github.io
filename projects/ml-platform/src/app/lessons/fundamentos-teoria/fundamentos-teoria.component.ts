import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { PROGRESS_KEYS, ProgressStore } from '@shared/progress';
import { FUNDAMENTOS_TEORIA_01 } from './fundamentos-teoria-01';
import { LessonPlayerComponent } from '../lesson-player/lesson-player.component';

/**
 * The `fundamentos-teoria` module page — Curso 1's theory module, hosting its first lesson.
 *
 * The module is contracted for **seven** theory lessons (`manifests/fundamentos-teoria-01`
 * through `-07`, all passing `npm run validate:manifests`). Only the first has generated
 * content; the other six are manifests without a derivative, and the page says so rather
 * than implying the module is complete.
 *
 * Progress is stored under its own key. The three `calculo-*` keys are byte-identical to
 * what the original per-feature services persisted, so they are frozen; this one is new and
 * therefore free to be named for what it is. A module with no key is simply untracked, which
 * is how the hub treats the remaining `coming-soon` courses.
 */
@Component({
  selector: 'app-fundamentos-teoria',
  standalone: true,
  imports: [LessonPlayerComponent],
  templateUrl: './fundamentos-teoria.component.html',
  styleUrl: './fundamentos-teoria.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FundamentosTeoriaComponent {
  private readonly progress = inject(ProgressStore);

  protected readonly lesson = FUNDAMENTOS_TEORIA_01;
  protected readonly plannedLessonCount = 7;

  private readonly completedIds = signal<string[]>([]);

  protected readonly done = computed(() => this.completedIds().includes(this.lesson.lessonId));

  constructor() {
    // Read once on creation, like the hub does: this page is re-created on every visit, so
    // the numbers are fresh without subscribing to anything.
    this.completedIds.set(this.progress.load(PROGRESS_KEYS.mlFundamentos));
  }

  protected onFinished(lessonId: string): void {
    if (this.completedIds().includes(lessonId)) {
      return;
    }
    const next = [...this.completedIds(), lessonId];
    this.completedIds.set(next);
    this.progress.save(PROGRESS_KEYS.mlFundamentos, next);
  }
}
