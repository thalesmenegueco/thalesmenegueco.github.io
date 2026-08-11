import { Component } from '@angular/core';
import { CardComponent } from '../shared/card/card';
import { CardItem } from '../../models/card-item';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class ProjectsComponent {

  interests: CardItem[] = [
    { name: "Precificação",
      description: 'Cálculo para precificação de semijoias - SPA',
      image: 'https://investidorsardinha.r7.com/wp-content/uploads/2021/09/precificacao-o-que-e-metodos-e-como-fazer-3-1024x684.jpg',
      link: './projects/precificacao-semijoias'
    }
  ];

}
