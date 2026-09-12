import { Component } from '@angular/core';
import { HeroMotionComponent } from './hero-motion.component';
import { STUDY_SUBJECTS } from './study-catalog';
import { ModuleKind } from './study.types';

@Component({
  selector: 'app-studies',
  standalone: true,
  imports: [HeroMotionComponent],
  templateUrl: './studies.component.html',
  styleUrl: './studies.component.scss',
})
export class StudiesComponent {
  readonly subjects = STUDY_SUBJECTS;

  private readonly kindLabels: Record<ModuleKind, string> = {
    teoria: 'Teoria',
    aplicada: 'Matemática aplicada',
    processo: 'Processo',
  };

  moduleKindLabel(kind: ModuleKind): string {
    return this.kindLabels[kind];
  }
}
