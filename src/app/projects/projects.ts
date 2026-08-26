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

  topProjects: CardItem[] = [
    {
      name: "Explore Dados",
      description: 'Análise exploratória: envie um CSV/XLSX e veja quais gráficos fazem sentido 📊',
      image: 'https://www.svgrepo.com/show/489257/piechart.svg',
      link: './tools/explore-data'
    },
    {
      name: "Cálculo I",
      description: 'Aprenda limites e derivadas resolvendo problemas reais — entender antes de memorizar',
      image: 'icons/calculus.svg',
      link: './tools/calculus'
    },
    {
      name: "Gerencie Projetos",
      description: 'Gerenciador de Projetos com lista de tarefas, ficam salvas no seu navegador 😉',
      image: 'https://www.svgrepo.com/show/489271/style.svg',
      link: './tools/project-manager'
    },
    {
      name: "OCR & Tradução",
      description: 'Extraia textos de imagens e traduza com o Chrome (PT/EN/FR/IT/DE) 🌐💬',
      image: 'https://www.svgrepo.com/show/489265/search-document.svg',
      link: './tools/ocr'
    }
  ];

  interests: CardItem[] = [
    {
      name: "LLM Local",
      description: 'Rode um LLM no navegador (local/privado) ou online via Cloudflare',
      image: 'https://www.svgrepo.com/show/489246/code-mobile.svg',
      link: './tools/test-llms'
    },
    {
      name: "Cálculos Simples",
      description: 'Ferramenta para calcular: hipotenusa e cateto (trângulo ret.)',
      image: 'https://www.svgrepo.com/show/489257/piechart.svg',
      link: './tools/calcular-hipotenusa'
    },
    {
      name: "Meça isto!",
      description: 'Meça desenhos técnicos: cole uma imagem, calibre a régua e tire medidas no canvas',
      image: 'icons/measure-it.svg',
      link: './tools/measure-it'
    },
    {
      name: "Precificação",
      description: 'Cálculo para precificação de semijoias - Markup (em JS Vanilla)',
      image: 'https://www.svgrepo.com/show/489278/add-wallet.svg',
      link: './tools/precificacao-semijoias'
    }
  ];

}
