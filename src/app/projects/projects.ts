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
      link: './tools/precificacao-semijoias'
    },
    { name: "Cálculos Simples",
      description: 'Ferramenta para calcular: hipotenusa e catetos de um triângulo retângulo',
      image: 'https://cdn-icons-png.flaticon.com/512/4650/4650631.png',
      link: './tools/calcular-hipotenusa'
    },
    { name: "Project Manager",
      description: 'Minimalist project manager with nested task lists',
      image: 'https://cdn-icons-png.flaticon.com/512/1087/1087815.png',
      link: './tools/project-manager'
    },
    { name: "OCR & Tradução",
      description: 'Extraia e traduza textos de imagens — 100% offline, direto no navegador',
      image: 'assets/ocr-card.png',
      link: './tools/ocr'
    }
  ];

}
