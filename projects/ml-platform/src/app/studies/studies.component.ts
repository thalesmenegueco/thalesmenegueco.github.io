import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ModuleKind,
  moduleKindLabel as labelForModuleKind,
} from '@shared/learning';
import { PROGRESS_KEYS, ProgressStore, type ProgressKey } from '@shared/progress';
import { HeroMotionComponent } from './hero-motion.component';
import { STUDY_SUBJECTS } from './study-catalog';

/**
 * Which storage key holds each module's completion list.
 *
 * The key strings themselves live in `@shared/progress` and are byte-identical
 * to the ones the three original per-feature services persisted, so a student's
 * saved progress survives this move intact. A module with no entry here is
 * simply not tracked yet — every `coming-soon` course.
 */
const PROGRESS_KEY_BY_MODULE: Record<string, ProgressKey> = {
  'calculo-teoria': PROGRESS_KEYS.calculus,
  'calculo-aplicada': PROGRESS_KEYS.calculusPractice,
  'calculo-processo': PROGRESS_KEYS.calculusProcess,
};

@Component({
  selector: 'app-studies',
  standalone: true,
  imports: [HeroMotionComponent, RouterLink],
  templateUrl: './studies.component.html',
  styleUrl: './studies.component.scss',
})
export class StudiesComponent {
  readonly subjects = STUDY_SUBJECTS;

  private readonly progress = inject(ProgressStore);

  /** Completed items per module id. Only tracked modules get an entry. */
  private readonly completedByModule: Record<string, number> = {};

  /** Completed items across every tracked module — the hub's aggregate. */
  readonly completedTotal: number;

  constructor() {
    // Read once: the hub is a static index, and returning to it re-creates the
    // component, so the numbers are fresh on every visit without subscribing to
    // anything. The keys are read through ProgressStore, which already guards
    // the absent / unparseable / storage-unavailable cases.
    let total = 0;

    for (const subject of this.subjects) {
      for (const module of subject.modules) {
        const key = PROGRESS_KEY_BY_MODULE[module.id];
        if (!key) {
          continue;
        }

        const completed = this.progress.load(key).length;
        this.completedByModule[module.id] = completed;
        total += completed;
      }
    }

    this.completedTotal = total;
  }

  completedFor(moduleId: string): number {
    return this.completedByModule[moduleId] ?? 0;
  }

  moduleKindLabel(kind: ModuleKind): string {
    return labelForModuleKind(kind);
  }
}
