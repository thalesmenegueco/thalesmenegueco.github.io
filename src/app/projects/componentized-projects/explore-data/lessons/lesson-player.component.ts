import { Component, computed, inject, signal } from '@angular/core';
import { LessonService } from './lesson.service';
import { ExploreDataState } from '../state/explore-data.state';
import { validateStep, type ValidationResult } from './lesson.engine';
import type { AnswerOption, LessonStep } from './lesson.types';
import type { Field } from '../models/types';

@Component({
  selector: 'app-lesson-player',
  standalone: true,
  imports: [],
  templateUrl: './lesson-player.component.html',
  styleUrl: './lesson-player.component.scss',
})
export class LessonPlayerComponent {
  readonly service = inject(LessonService);
  readonly state = inject(ExploreDataState);

  readonly lesson = this.service.activeLesson;
  readonly step = this.service.currentStep;
  readonly progress = this.service.progress;
  readonly isComplete = this.service.isComplete;

  readonly answer = signal('');
  readonly feedback = signal<ValidationResult | null>(null);
  readonly validated = signal(false);

  private readonly appState = computed(() => ({
    dataset: this.state.dataset(),
    selectedFields: this.state.selectedFields(),
    activeSuggestion: this.state.activeSuggestion(),
  }));

  readonly progressPercent = computed(() => {
    const p = this.progress();
    return p.total ? Math.round((p.done / p.total) * 100) : 0;
  });

  readonly isLastStep = computed(() => {
    const p = this.progress();
    return p.done + 1 >= p.total;
  });

  check(): void {
    const step = this.step();
    if (!step) {
      return;
    }
    this.feedback.set(validateStep(step, this.appState(), this.answer()));
    this.validated.set(true);
  }

  next(): void {
    this.service.advance();
    this.answer.set('');
    this.feedback.set(null);
    this.validated.set(false);
  }

  exit(): void {
    this.service.exitLesson();
  }

  tryItYourself(): void {
    this.service.exitLesson();
    this.state.reset();
  }

  async useExample(): Promise<void> {
    const lesson = this.lesson();
    if (!lesson) {
      return;
    }
    const fields: Field[] = lesson.exampleFieldDescriptions.map((f) => ({
      name: f.name,
      type: f.type,
    }));
    await this.state.loadExample(lesson.exampleDatasetCsv, fields);
    this.answer.set('');
    this.feedback.set(null);
    this.validated.set(false);
  }

  choose(optionId: string): void {
    this.answer.set(optionId);
    this.feedback.set(null);
    this.validated.set(false);
  }

  onTextInput(event: Event): void {
    this.answer.set((event.target as HTMLTextAreaElement).value);
    this.feedback.set(null);
    this.validated.set(false);
  }

  optionsFor(step: LessonStep): AnswerOption[] {
    return step.validation.options ?? [];
  }
}
