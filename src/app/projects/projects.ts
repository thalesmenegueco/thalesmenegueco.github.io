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
    {
      name: "Projetos",
      description: 'Gerenciador de Projetos com lista de tarefas, ficam salvas no seu navegador 😉',
      image: 'https://www.svgrepo.com/show/489271/style.svg',
      link: './tools/project-manager'
    },
    {
      name: "OCR & Tradução",
      description: 'Extraia textos de imagens e traduza com o Chrome (PT/EN/FR/IT/DE)',
      image: 'https://www.svgrepo.com/show/489265/search-document.svg',
      link: './tools/ocr'
    },
    {
      name: "LLM Local",
      description: 'Baixe e rode um LLM (Qwen 0.5B) direto no seu navegador',
      image: 'https://www.svgrepo.com/show/489259/robot.svg',
      link: './tools/test-llms'
    },
    {
      name: "Cálculos Simples",
      description: 'Ferramenta para calcular: hipotenusa e cateto (trângulo ret.)',
      image: 'https://www.svgrepo.com/show/489257/piechart.svg',
      link: './tools/calcular-hipotenusa'
    },
    {
      name: "Precificação",
      description: 'Cálculo para precificação de semijoias - Markup (em JS Vanilla)',
      image: 'https://www.svgrepo.com/show/489278/add-wallet.svg',
      link: './tools/precificacao-semijoias'
    }
  ];

}
