import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RevealDirective } from '../ui/reveal.directive';
import { SectionHeadingComponent } from '../ui/section-heading';

/** A numbered step of the "how I build" tile. */
interface BuildStep {
  title: string;
  body: string;
}

interface Stat {
  value: string;
  label: string;
}

/**
 * The manifesto: who is behind the page and in what order things get made.
 *
 * The bento is two tiles plus a stats strip — not four equal cards — so the
 * manifesto reads as the main voice and the process as its supporting
 * column. The chips carry the interests that do not need a paragraph.
 */
@Component({
  selector: 'app-about-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, SectionHeadingComponent],
  templateUrl: './about.section.html',
  styleUrl: './about.section.scss',
})
export class AboutSectionComponent {
  readonly chips = [
    'Acessibilidade',
    'Educação',
    'Idiomas',
    'Exatas',
    'Dados',
    'Cultura surda',
  ] as const;

  readonly steps: readonly BuildStep[] = [
    {
      title: 'Imagino',
      body: 'Uma ideia que parece impossível no navegador é só o começo da pergunta certa.',
    },
    {
      title: 'Prototipo',
      body: 'O rascunho vira algo clicável o mais rápido possível: é o protótipo que revela o que o papel esconde.',
    },
    {
      title: 'Coloco no ar',
      body: 'Publicado e aberto para quem quiser usar — e para o próximo erro que me ensina algo.',
    },
  ];

  readonly stats: readonly Stat[] = [
    { value: '6', label: 'ferramentas no lab' },
    { value: '2', label: 'produtos no ar' },
    { value: '1', label: 'canal sobre cultura surda' },
  ];
}
