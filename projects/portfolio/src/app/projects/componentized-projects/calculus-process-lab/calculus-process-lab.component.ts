import { Component, computed, signal } from '@angular/core';
import { KatexComponent } from '../calculus/components/katex/katex.component';
import { ProcessVisualizationComponent } from './process-visualization.component';
import { RC_CHARGING_PROCESS } from './process-data';
import { computeMetrics } from './process-engine';
import { Metric, ProcessStage } from './process.types';
import { ProcessProgressService } from './services/process-progress.service';

@Component({
  selector: 'app-calculus-process-lab',
  standalone: true,
  imports: [KatexComponent, ProcessVisualizationComponent],
  templateUrl: './calculus-process-lab.component.html',
  styleUrl: './calculus-process-lab.component.scss',
})
export class CalculusProcessLabComponent {
  readonly process = RC_CHARGING_PROCESS;

  readonly currentStageIndex = signal(0);
  readonly completedIds = signal<string[]>([]);
  readonly time = signal(3);
  readonly h = signal(1);
  readonly approachDistance = signal(0.7);

  readonly currentStage = computed(
    () => this.process.stages[this.currentStageIndex()],
  );

  readonly isFirst = computed(() => this.currentStageIndex() === 0);
  readonly isLast = computed(
    () => this.currentStageIndex() === this.process.stages.length - 1,
  );

  readonly progressPercent = computed(
    () => (this.completedIds().length / this.process.stages.length) * 100,
  );

  readonly metrics = computed<Metric[]>(() => {
    const stage = this.currentStage();
    if (stage.controls === 'none') {
      return stage.metrics;
    }
    return computeMetrics(
      stage.controls,
      this.time(),
      this.h(),
      this.approachDistance(),
    );
  });

  readonly showCompletion = computed(() => {
    const lastIndex = this.process.stages.length - 1;
    return (
      this.currentStageIndex() === lastIndex &&
      this.completedIds().includes(this.process.stages[lastIndex].id)
    );
  });

  constructor(private progress: ProcessProgressService) {
    this.completedIds.set(this.progress.load());
  }

  isCompleted(stage: ProcessStage): boolean {
    return this.completedIds().includes(stage.id);
  }

  selectStage(index: number): void {
    this.currentStageIndex.set(index);
    this.scrollToTop();
  }

  goPrevious(): void {
    if (this.currentStageIndex() === 0) {
      return;
    }
    this.currentStageIndex.update((i) => i - 1);
    this.scrollToTop();
  }

  goNext(): void {
    if (this.currentStageIndex() >= this.process.stages.length - 1) {
      return;
    }
    this.currentStageIndex.update((i) => i + 1);
    this.scrollToTop();
  }

  completeStage(): void {
    const stage = this.currentStage();
    if (!this.completedIds().includes(stage.id)) {
      this.completedIds.update((ids) => [...ids, stage.id]);
      this.progress.save(this.completedIds());
    }
  }

  resetProgress(): void {
    if (!confirm('Deseja apagar o progresso deste processo?')) {
      return;
    }
    this.completedIds.set([]);
    this.progress.save([]);
    this.currentStageIndex.set(0);
    this.time.set(3);
    this.h.set(1);
    this.approachDistance.set(0.7);
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
