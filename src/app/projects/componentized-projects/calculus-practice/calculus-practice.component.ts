import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KatexComponent } from '../calculus/components/katex/katex.component';
import { ProblemVisualizationComponent } from './problem-visualization.component';
import { AREA_LABELS, AppliedProblem, ProblemArea } from './calculus-practice.types';
import { APPLIED_PROBLEMS } from './problem-data';
import { CalculusPracticeProgressService } from './services/calculus-practice-progress.service';

type AreaFilter = ProblemArea | 'all';

interface Feedback {
  kind: 'success' | 'error';
  text: string;
}

@Component({
  selector: 'app-calculus-practice',
  standalone: true,
  imports: [FormsModule, KatexComponent, ProblemVisualizationComponent],
  templateUrl: './calculus-practice.component.html',
  styleUrl: './calculus-practice.component.scss',
})
export class CalculusPracticeComponent {
  readonly problems = APPLIED_PROBLEMS;
  readonly areas: ProblemArea[] = [
    'elétrica',
    'mecânica',
    'arquitetura',
    'programação',
    'economia',
  ];

  readonly currentIndex = signal(0);
  readonly completedIds = signal<string[]>([]);
  readonly filter = signal<AreaFilter>('all');
  readonly showHint = signal(false);
  readonly showSolution = signal(false);
  readonly feedback = signal<Feedback | null>(null);

  answerText = '';

  readonly visibleProblems = computed(() =>
    this.problems
      .map((problem, index) => ({ problem, index }))
      .filter(
        ({ problem }) =>
          this.filter() === 'all' || problem.area === this.filter(),
      ),
  );

  readonly currentProblem = computed<AppliedProblem>(
    () => this.problems[this.currentIndex()],
  );

  readonly progressPercent = computed(
    () => (this.completedIds().length / this.problems.length) * 100,
  );

  constructor(private progress: CalculusPracticeProgressService) {
    this.completedIds.set(this.progress.load());
  }

  areaLabel(area: ProblemArea): string {
    return AREA_LABELS[area];
  }

  selectProblem(index: number): void {
    this.currentIndex.set(index);
    this.resetExerciseState();
    this.scrollToTop();
  }

  nextProblem(): void {
    const visible = this.visibleProblems();
    if (visible.length === 0) {
      return;
    }
    const currentVisibleIndex = visible.findIndex(
      (item) => item.index === this.currentIndex(),
    );
    const next =
      currentVisibleIndex === -1 ? 0 : (currentVisibleIndex + 1) % visible.length;
    this.currentIndex.set(visible[next].index);
    this.resetExerciseState();
    this.scrollToTop();
  }

  onFilterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.filter.set(value as AreaFilter);
    const first = this.visibleProblems()[0];
    if (first) {
      this.currentIndex.set(first.index);
    }
    this.resetExerciseState();
  }

  checkAnswer(): void {
    const problem = this.currentProblem();
    const answer = this.parseAnswer();

    if (answer === null) {
      this.feedback.set({
        kind: 'error',
        text: 'Digite um valor numérico antes de verificar.',
      });
      return;
    }

    const correct = Math.abs(answer - problem.answer) <= problem.tolerance;

    if (correct) {
      if (!this.completedIds().includes(problem.id)) {
        this.completedIds.update((ids) => [...ids, problem.id]);
        this.progress.save(this.completedIds());
      }
      this.feedback.set({
        kind: 'success',
        text: 'Resposta correta. Agora observe como a derivada aparece dentro da situação prática.',
      });
      this.showSolution.set(true);
    } else {
      this.feedback.set({
        kind: 'error',
        text: 'Ainda não. Use a dica, observe a visualização e revise qual quantidade deve ser derivada.',
      });
    }
  }

  toggleHint(): void {
    this.showHint.update((value) => !value);
  }

  resetProgress(): void {
    if (!confirm('Deseja apagar o progresso dos exercícios?')) {
      return;
    }
    this.completedIds.set([]);
    this.progress.save([]);
    this.currentIndex.set(0);
    this.resetExerciseState();
  }

  private parseAnswer(): number | null {
    const raw = this.answerText.trim();
    if (raw === '') {
      return null;
    }
    const value = Number(raw.replace(',', '.'));
    return Number.isFinite(value) ? value : null;
  }

  private resetExerciseState(): void {
    this.answerText = '';
    this.showHint.set(false);
    this.showSolution.set(false);
    this.feedback.set(null);
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
