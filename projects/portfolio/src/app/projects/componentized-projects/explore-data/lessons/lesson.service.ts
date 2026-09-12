import { Injectable, computed, signal } from '@angular/core';
import type { Lesson, LessonStep } from './lesson.types';
import { LESSONS } from './lesson-data/lessons';

/**
 * Holds the lesson catalog and the current lesson's progress (which lesson is
 * active, current step, completed steps). Provided at the ExploreData component
 * level so progress resets on navigation.
 */
@Injectable()
export class LessonService {
  readonly lessons = LESSONS;

  private readonly _activeLessonId = signal<string | null>(null);
  private readonly _currentStepIndex = signal(0);
  private readonly _completedStepIds = signal<string[]>([]);

  readonly activeLessonId = this._activeLessonId.asReadonly();
  readonly currentStepIndex = this._currentStepIndex.asReadonly();
  readonly completedStepIds = this._completedStepIds.asReadonly();

  readonly activeLesson = computed<Lesson | null>(() => {
    const id = this._activeLessonId();
    return id ? (LESSONS.find((l) => l.id === id) ?? null) : null;
  });

  readonly currentStep = computed<LessonStep | null>(() => {
    const lesson = this.activeLesson();
    return lesson?.steps[this._currentStepIndex()] ?? null;
  });

  readonly isComplete = computed<boolean>(() => {
    const lesson = this.activeLesson();
    return !!lesson && this._currentStepIndex() >= lesson.steps.length;
  });

  readonly progress = computed(() => {
    const lesson = this.activeLesson();
    return {
      done: this._completedStepIds().length,
      total: lesson?.steps.length ?? 0,
    };
  });

  startLesson(id: string): void {
    this._activeLessonId.set(id);
    this._currentStepIndex.set(0);
    this._completedStepIds.set([]);
  }

  exitLesson(): void {
    this._activeLessonId.set(null);
    this._currentStepIndex.set(0);
    this._completedStepIds.set([]);
  }

  /** Mark the current step complete and advance to the next one. */
  advance(): void {
    const lesson = this.activeLesson();
    if (!lesson) {
      return;
    }
    const step = lesson.steps[this._currentStepIndex()];
    if (step && !this._completedStepIds().includes(step.id)) {
      this._completedStepIds.update((ids) => [...ids, step.id]);
    }
    this._currentStepIndex.update((i) => i + 1);
  }

  isStepComplete(stepId: string): boolean {
    return this._completedStepIds().includes(stepId);
  }
}
