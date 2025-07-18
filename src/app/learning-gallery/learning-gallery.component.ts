import { Component } from '@angular/core';

@Component({
  selector: 'app-learning-gallery',
  standalone: true,
  imports: [],
  templateUrl: './learning-gallery.component.html',
  styleUrl: './learning-gallery.component.scss'
})
export class LearningGalleryComponent {
  public readonly title = 'Learning Gallery'; // só pra falar que tem algo aqui
}
