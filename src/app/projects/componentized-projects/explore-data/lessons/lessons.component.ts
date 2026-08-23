import { Component, inject } from '@angular/core';
import { LessonService } from './lesson.service';
import { LessonListComponent } from './lesson-list.component';
import { LessonPlayerComponent } from './lesson-player.component';

@Component({
  selector: 'app-lessons',
  standalone: true,
  imports: [LessonListComponent, LessonPlayerComponent],
  styles: [':host { display: block; }'],
  template: `
    @if (service.activeLessonId()) {
      <app-lesson-player />
    } @else {
      <app-lesson-list />
    }
  `,
})
export class LessonsComponent {
  readonly service = inject(LessonService);
}
