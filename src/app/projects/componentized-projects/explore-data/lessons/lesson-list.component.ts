import { Component, inject } from '@angular/core';
import { LessonService } from './lesson.service';

@Component({
  selector: 'app-lesson-list',
  standalone: true,
  imports: [],
  templateUrl: './lesson-list.component.html',
  styleUrl: './lesson-list.component.scss',
})
export class LessonListComponent {
  readonly service = inject(LessonService);
  readonly lessons = this.service.lessons;

  difficultyLabel(difficulty: string): string {
    switch (difficulty) {
      case 'beginner':
        return 'Iniciante';
      case 'intermediate':
        return 'Intermediário';
      case 'advanced':
        return 'Avançado';
      default:
        return difficulty;
    }
  }
}
