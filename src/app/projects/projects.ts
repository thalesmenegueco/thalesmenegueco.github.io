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
    { name: "Project Manager",
      description: 'Minimalist project manager with nested task lists',
      image: 'https://www.svgrepo.com/show/489271/style.svg',
      link: './tools/project-manager'
    },
    { name: "OCR & Tradução",
      description: 'Extraia e traduza textos de imagens — 100% offline, direto no navegador',
      image: 'https://www.svgrepo.com/show/489265/search-document.svg',
      link: './tools/ocr'
    },
{ name: "Cálculos Simples",
      description: 'Ferramenta para calcular: hipotenusa e catetos de um triângulo retângulo',
      image: 'https://www.svgrepo.com/show/489257/piechart.svg',
      link: './tools/calcular-hipotenusa'
    },
{ name: "Precificação",
      description: 'Cálculo para precificação de semijoias - SPA',
      image: 'https://www.svgrepo.com/show/489278/add-wallet.svg',
      link: './tools/precificacao-semijoias'
    }
  ];

}
