import { Component } from '@angular/core';
import { CardProject } from './components/card-project/card-project';
import { Interest } from '../../models/interest';


@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CardProject],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class ProjectsComponent {

  interests: Interest[] = [
    { name: "Precificação",
      description: 'Cálculo para precificação de semijoias - SPA',
      image: 'https://investidorsardinha.r7.com/wp-content/uploads/2021/09/precificacao-o-que-e-metodos-e-como-fazer-3-1024x684.jpg',
      link: './pages/precificacao-semijoias/index.html'
    }
  ];

}
