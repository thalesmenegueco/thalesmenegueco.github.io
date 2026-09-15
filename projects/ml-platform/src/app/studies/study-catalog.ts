import { StudySubject } from '@shared/learning';

/**
 * The VisualML study catalogue.
 *
 * Each subject exposes its learning moments — Teoria, Matemática aplicada and
 * Processo — so a student understands the concept, applies it, and then follows
 * it through a complete chain. Adding a course is adding an entry here: the hub
 * renders whatever this array holds, and `app.routes.ts` generates a lazy route
 * for every module that has a component to render. That is the whole point of
 * the data model — a new course is data, not routing work.
 *
 * ---
 *
 * ⚠️ **PLACEHOLDER CONTENT — read before launch.**
 *
 * `docs/structure-migration.md` specifies the platform as "4 cursos, cada com 2
 * módulos" but never names them, and naming a curriculum is product work rather
 * than container work. The three ML subjects below are **working titles**, added
 * to exercise the data model end to end: a subject with modules, `coming-soon`
 * status, `route: null`, and one icon per subject. Their names, taglines, titles
 * and descriptions carry no authority — replace them.
 *
 * `calculo` is the one real course. It moved here from the portfolio in Phase 3
 * and is live.
 *
 * The plan's wording ("expand from the single `calculo` subject to the
 * four-course catalog") is ambiguous about whether Cálculo counts as one of the
 * four. This file reads it as four subjects in total — Cálculo plus three ML
 * courses. If the intent was four ML courses *in addition* to Cálculo, add one
 * more entry and nothing else changes.
 *
 * Icons: one per subject is enough while the modules are placeholders, unlike
 * Cálculo, where each module is a different activity and carries its own.
 */
export const STUDY_SUBJECTS: StudySubject[] = [
  {
    id: 'calculo',
    name: 'Cálculo',
    tagline: 'Limites e derivadas, do conceito à aplicação.',
    modules: [
      {
        id: 'calculo-teoria',
        kind: 'teoria',
        status: 'available',
        title: 'Cálculo I — Entender antes de memorizar',
        description:
          'Aprenda limites e derivadas explorando problemas reais: observe, experimente e só então dê nome à ideia matemática.',
        route: '/calculo/teoria',
        icon: 'icons/calculus.svg',
        meta: ['7 lições', 'Aprendizagem por descoberta'],
      },
      {
        id: 'calculo-aplicada',
        kind: 'aplicada',
        status: 'available',
        title: 'Matemática aplicada ao Cálculo',
        description:
          'Use o que aprendeu para resolver problemas de movimento, otimização e taxas de variação em situações reais.',
        route: '/calculo/aplicada',
        icon: 'icons/applied-math.svg',
        meta: ['6 exercícios', 'Resposta numérica'],
      },
      {
        id: 'calculo-processo',
        kind: 'processo',
        status: 'available',
        title: 'Cálculo em processo',
        description:
          'Acompanhe um problema real — da situação física à derivada — vendo a matemática emergir etapa por etapa.',
        route: '/calculo/processo',
        icon: 'icons/process.svg',
        meta: ['8 etapas', '1 problema completo'],
      },
    ],
  },

  // --- Everything below is provisional. See the warning above. ---
  {
    id: 'fundamentos',
    name: 'Fundamentos de ML',
    tagline: 'O que significa aprender a partir de dados.',
    modules: [
      {
        id: 'fundamentos-teoria',
        kind: 'teoria',
        status: 'coming-soon',
        title: 'Do dado ao modelo',
        description:
          'O que é um dataset, o que é aprender, e por que um modelo erra — construindo a intuição antes da matemática.',
        route: null,
        icon: 'icons/fundamentals.svg',
        meta: ['Em breve', 'Título provisório'],
      },
      {
        id: 'fundamentos-aplicada',
        kind: 'aplicada',
        status: 'coming-soon',
        title: 'Primeiras decisões com dados',
        description:
          'Escolher variáveis, separar treino e teste, e ler um resultado sem se enganar.',
        route: null,
        icon: 'icons/fundamentals.svg',
        meta: ['Em breve', 'Título provisório'],
      },
    ],
  },
  {
    id: 'regressao-classificacao',
    name: 'Regressão e classificação',
    tagline: 'Prever um número e prever uma categoria.',
    modules: [
      {
        id: 'regressao-classificacao-teoria',
        kind: 'teoria',
        status: 'coming-soon',
        title: 'Ajustar e separar',
        description:
          'A reta que melhor explica os dados e a fronteira que melhor divide as classes.',
        route: null,
        icon: 'icons/regression.svg',
        meta: ['Em breve', 'Título provisório'],
      },
      {
        id: 'regressao-classificacao-aplicada',
        kind: 'aplicada',
        status: 'coming-soon',
        title: 'Métricas que importam',
        description:
          'Erro médio, acurácia, precisão e recall: o que cada número esconde.',
        route: null,
        icon: 'icons/regression.svg',
        meta: ['Em breve', 'Título provisório'],
      },
    ],
  },
  {
    id: 'redes-neurais',
    name: 'Redes neurais',
    tagline: 'Camadas, pesos e o que acontece entre elas.',
    modules: [
      {
        id: 'redes-neurais-teoria',
        kind: 'teoria',
        status: 'coming-soon',
        title: 'Um neurônio por vez',
        description:
          'Da soma ponderada à função de ativação, montando a rede peça por peça.',
        route: null,
        icon: 'icons/neural-networks.svg',
        meta: ['Em breve', 'Título provisório'],
      },
      {
        id: 'redes-neurais-aplicada',
        kind: 'aplicada',
        status: 'coming-soon',
        title: 'Treinar de verdade',
        description:
          'Gradiente, épocas e overfitting vistos acontecendo, não só definidos.',
        route: null,
        icon: 'icons/neural-networks.svg',
        meta: ['Em breve', 'Título provisório'],
      },
    ],
  },
];
