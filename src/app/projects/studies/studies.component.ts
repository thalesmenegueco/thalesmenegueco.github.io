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

  moduleKindLabel(kind: ModuleKind): string {
    return kind === 'teoria' ? 'Teoria' : 'Matemática aplicada';
  }
}
