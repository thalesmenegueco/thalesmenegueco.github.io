import { PLATFORM_LINKS } from '../platform-links';

/**
 * The portfolio's content, in one place.
 *
 * The one-page portfolio and the `/tools` lab both read from here, so a tool
 * is renamed, re-blurbed or re-linked exactly once. Nothing in this file is
 * presentation: components decide how a tool or a project looks, this file
 * only says what exists.
 */

/** Profile strings the shell and the sections share. */
export const PROFILE = {
  name: 'Thales Menegueço',
  eyebrow: 'Portfólio · ferramentas e experimentos',
  /** First line of the hero — plain ink. */
  heroLine: 'Eu construo',
  /** Second line — the one that gets the aurora gradient. */
  heroAccent: 'o que imagino.',
  heroLead:
    'Ferramentas, cursos e experimentos que parecem vir de outro mundo — e rodam no seu navegador. Feito com Angular, acessibilidade e um pouco de mágica.',
  github: 'https://github.com/thalesmenegueco',
  linkedin: 'https://www.linkedin.com/in/thales-menegueco/',
  sinalFala: 'https://www.tiktok.com/@sinal.fala',
} as const;

/**
 * The nav's targets, in page order.
 *
 * Ids are the section ids the sections render; `ScrollSpy` tracks the same
 * ids, so the nav and the page cannot drift apart without this file changing.
 */
export const NAV_LINKS = [
  { id: 'sobre', label: 'Sobre' },
  { id: 'projetos', label: 'Projetos' },
  { id: 'ferramentas', label: 'Ferramentas' },
  { id: 'trajetoria', label: 'Trajetória' },
  { id: 'contato', label: 'Contato' },
] as const;

export type NavLink = (typeof NAV_LINKS)[number];

export type FlagshipId = 'sinalize' | 'visualab';

/**
 * The two projects with a real product behind them.
 *
 * Sinalize! leads because it is the larger statement — free Libras for people
 * who never had access — and VisuaLab follows as the teaching platform. Both
 * show a screenshot of the running thing rather than an icon: a print says
 * more in a glance than a glyph.
 */
export interface FlagshipProject {
  id: FlagshipId;
  index: string;
  name: string;
  kicker: string;
  description: string;
  image: string;
  imageAlt: string;
  /**
   * The screenshot's real intrinsic size, bound as `width`/`height` on the
   * `<img>` so the browser reserves the right box before the lazy image
   * decodes. A wrong pair here is a real defect, not a nicety: the layout
   * shifts once the image lands, and an anchor click that was already scrolling
   * to the section lands short by exactly the shift.
   */
  imageWidth: number;
  imageHeight: number;
  href: string;
  cta: string;
  tags: readonly string[];
}

export const FLAGSHIP_PROJECTS: readonly FlagshipProject[] = [
  {
    id: 'sinalize',
    index: '01',
    name: 'Sinalize!',
    kicker: 'Acessibilidade · Libras',
    description:
      'Uma plataforma gratuita para aprender Libras. Nasceu de uma pergunta simples: e se o acesso à língua de sinais não dependesse de sorte?',
    image: 'images/sinalize-preview.png',
    imageAlt: 'Tela inicial do Sinalize!, a plataforma de Libras',
    imageWidth: 738,
    imageHeight: 690,
    href: 'https://www.sinalize.org',
    cta: 'Conhecer o Sinalize!',
    tags: ['Libras', 'Educação', 'Acessibilidade'],
  },
  {
    id: 'visualab',
    index: '02',
    name: 'VisuaLab',
    kicker: 'Exatas · cursos interativos',
    description:
      'Cursos de exatas em que se entende o conceito explorando — arrastando um ponto, movendo um parâmetro — antes de decorar a fórmula.',
    image: 'images/visualab-preview.png',
    imageAlt: 'Tela inicial da VisuaLab, plataforma de cursos de exatas',
    imageWidth: 407,
    imageHeight: 437,
    href: PLATFORM_LINKS.hub,
    cta: 'Abrir a VisuaLab',
    tags: ['Cálculo', 'Machine Learning', 'Interativo'],
  },
];

/** The icons the tool cards draw; `ui/icon.ts` owns the actual paths. */
export type ToolIcon =
  | 'chart'
  | 'kanban'
  | 'scan'
  | 'chip'
  | 'triangle'
  | 'ruler'
  | 'wallet';

/** One entry of the tools lab, shared by `/` and `/tools`. */
export interface ToolItem {
  slug: string;
  name: string;
  blurb: string;
  href: string;
  icon: ToolIcon;
  tag: string;
}

export const TOOLS: readonly ToolItem[] = [
  {
    slug: 'explore-data',
    name: 'Explore Dados',
    blurb:
      'Envie um CSV ou XLSX e veja na hora quais gráficos fazem sentido para os seus dados — e quais não fazem.',
    href: '/tools/explore-data',
    icon: 'chart',
    tag: 'Dados',
  },
  {
    slug: 'project-manager',
    name: 'Gerencie Projetos',
    blurb:
      'Quadro de projetos com tarefas, prazos e dependências — salvas no próprio navegador.',
    href: '/tools/project-manager',
    icon: 'kanban',
    tag: 'Produtividade',
  },
  {
    slug: 'ocr',
    name: 'OCR & Tradução',
    blurb:
      'Extraia texto de uma imagem e traduza entre PT, EN, FR, IT e DE, sem sair da página.',
    href: '/tools/ocr',
    icon: 'scan',
    tag: 'Idiomas',
  },
  {
    slug: 'measure-it',
    name: 'Meça isto!',
    blurb:
      'Cole um desenho técnico, calibre a régua e tire medidas direto no canvas, com anotações.',
    href: '/tools/measure-it',
    icon: 'ruler',
    tag: 'Engenharia',
  },
  {
    slug: 'calcular-hipotenusa',
    name: 'Cálculos Simples',
    blurb:
      'Hipotenusa e catetos de um triângulo retângulo, com o passo a passo do cálculo.',
    href: '/tools/calcular-hipotenusa',
    icon: 'triangle',
    tag: 'Exatas',
  },
  {
    slug: 'precificacao-semijoias',
    name: 'Precificação',
    blurb:
      'Markup e preço de venda de semijoias, somando banhos, custos e margem desejada.',
    href: '/tools/precificacao-semijoias',
    icon: 'wallet',
    tag: 'Negócios',
  },
];

/**
 * The trajectory, told as stages rather than years.
 *
 * The years are deliberately absent: this is the story of how the projects
 * followed each other, and inventing dates would be the one thing on the page
 * that could be wrong. Add real years here when they are worth stating.
 */
export interface Milestone {
  step: string;
  title: string;
  body: string;
  /** The last node reads as "now" and pulses softly. */
  current?: boolean;
}

export const MILESTONES: readonly Milestone[] = [
  {
    step: '01',
    title: 'Curiosidade',
    body: 'Comecei construindo coisas para mim mesmo: uma ideia na cabeça, um rascunho no papel e a teimosia de ver se funcionava no navegador.',
  },
  {
    step: '02',
    title: 'Comunicação',
    body: 'O Sinalize! nasceu dessa teimosia aplicada a outra pergunta: e se o acesso à Libras fosse gratuito para quem nunca teve?',
  },
  {
    step: '03',
    title: 'Ensino',
    body: 'A VisuaLab levou a mesma lógica para as exatas: primeiro fazer o conceito ser visível e tocável, depois a notação.',
  },
  {
    step: '04',
    title: 'Agora',
    body: 'Este lab reúne as ferramentas de tudo isso — e as próximas ideias já estão no rascunho.',
    current: true,
  },
];

export type SocialIcon = 'github' | 'linkedin' | 'tiktok';

export interface SocialLink {
  name: string;
  handle: string;
  href: string;
  icon: SocialIcon;
}

export const SOCIALS: readonly SocialLink[] = [
  {
    name: 'GitHub',
    handle: 'thalesmenegueco',
    href: PROFILE.github,
    icon: 'github',
  },
  {
    name: 'LinkedIn',
    handle: 'thales-menegueco',
    href: PROFILE.linkedin,
    icon: 'linkedin',
  },
  {
    name: 'Sinal Fala',
    handle: '@sinal.fala',
    href: PROFILE.sinalFala,
    icon: 'tiktok',
  },
];
