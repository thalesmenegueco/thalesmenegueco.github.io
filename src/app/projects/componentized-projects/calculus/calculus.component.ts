import { Component, ElementRef, ViewChild, computed, signal } from '@angular/core';
import { LESSONS } from './lesson-data';
import { Lesson } from './calculus.types';
import { validateStep, validationMessage } from './calculus.engine';
import { CalculusProgressService } from './services/calculus-progress.service';
import { RichMathTextComponent } from './components/rich-math-text/rich-math-text.component';
import { LimitExplorerComponent } from './components/limit-explorer/limit-explorer.component';
import { DiscontinuityExplorerComponent } from './components/discontinuity-explorer/discontinuity-explorer.component';
import { ContinuityExplorerComponent } from './components/continuity-explorer/continuity-explorer.component';
import { AverageSlopeExplorerComponent } from './components/average-slope-explorer/average-slope-explorer.component';
import { TangentLineExplorerComponent } from './components/tangent-line-explorer/tangent-line-explorer.component';
import { DerivativeFunctionExplorerComponent } from './components/derivative-function-explorer/derivative-function-explorer.component';
import { RulePlaygroundComponent } from './components/rule-playground/rule-playground.component';
import { FormulaMatchComponent } from './components/formula-match/formula-match.component';

@Component({
  selector: 'app-calculus',
  standalone: true,
  imports: [
    RichMathTextComponent,
    LimitExplorerComponent,
    DiscontinuityExplorerComponent,
    ContinuityExplorerComponent,
    AverageSlopeExplorerComponent,
    TangentLineExplorerComponent,
    DerivativeFunctionExplorerComponent,
    RulePlaygroundComponent,
    FormulaMatchComponent,
  ],
  templateUrl: './calculus.component.html',
  styleUrl: './calculus.component.scss',
})
export class CalculusComponent {
  @ViewChild('summaryCard') summaryCard?: ElementRef<HTMLElement>;

  readonly lessons = LESSONS;

  protected readonly currentLessonIndex = signal(0);
  protected readonly currentStepIndex = signal(0);
  readonly completedIds = signal<string[]>([]);
  readonly widgetValue = signal<unknown>(undefined);
  readonly feedback = signal<string | null>(null);
  readonly showSummary = signal(false);

  readonly currentLesson = computed(
    () => this.lessons[this.currentLessonIndex()],
  );
  readonly currentStep = computed(
    () => this.currentLesson().steps[this.currentStepIndex()],
  );
  readonly isLastStep = computed(
    () => this.currentStepIndex() === this.currentLesson().steps.length - 1,
  );
  readonly progressPercent = computed(
    () => (this.completedIds().length / this.lessons.length) * 100,
  );
  // Changing this key forces the widget subtree to be recreated per step,
  // so each widget starts from its default state.
  readonly stepKey = computed(
    () => `${this.currentLessonIndex()}-${this.currentStepIndex()}`,
  );

  readonly navigation = computed(() => {
    const groups = new Map<string, { lesson: Lesson; index: number }[]>();
    this.lessons.forEach((lesson, index) => {
      const list = groups.get(lesson.unit) ?? [];
      list.push({ lesson, index });
      groups.set(lesson.unit, list);
    });
    return [...groups.entries()].map(([unit, items]) => ({ unit, items }));
  });

  constructor(private progress: CalculusProgressService) {
    this.completedIds.set(this.progress.load());
  }

  selectLesson(index: number): void {
    this.currentLessonIndex.set(index);
    this.currentStepIndex.set(0);
    this.resetStepState();
  }

  onWidgetValue(value: unknown): void {
    this.widgetValue.set(value);
  }

  back(): void {
    if (this.currentStepIndex() === 0) {
      return;
    }
    this.currentStepIndex.update((i) => i - 1);
    this.resetStepState();
  }

  next(): void {
    const step = this.currentStep();

    if (!validateStep(step.validation, this.widgetValue())) {
      this.feedback.set(validationMessage(step.validation));
      return;
    }

    const lesson = this.currentLesson();

    if (!this.isLastStep()) {
      this.currentStepIndex.update((i) => i + 1);
      this.resetStepState();
      return;
    }

    if (!this.completedIds().includes(lesson.id)) {
      this.completedIds.update((ids) => [...ids, lesson.id]);
      this.progress.save(this.completedIds());
    }

    this.showSummary.set(true);
    this.scrollToSummary();
  }

  resetProgress(): void {
    if (!confirm('Reiniciar todo o progresso desta aplicação?')) {
      return;
    }
    this.completedIds.set([]);
    this.progress.save([]);
    this.currentLessonIndex.set(0);
    this.currentStepIndex.set(0);
    this.resetStepState();
  }

  private resetStepState(): void {
    this.widgetValue.set(undefined);
    this.feedback.set(null);
    this.showSummary.set(false);
  }

  private scrollToSummary(): void {
    requestAnimationFrame(() => {
      this.summaryCard?.nativeElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    });
  }
}
