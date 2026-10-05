import { StudySubject } from '@shared/learning';

/**
 * The VisuaLab study catalogue.
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
 * **The four ML courses are now named.** The provisional working titles that
 * used to live here are gone; the curriculum below is the author's:
 *
 *   1. Fundamentos Matemáticos para ML
 *   2. Aprendizado Supervisionado
 *   3. Redes Neurais do Zero
 *   4. Aprendizado Não-Supervisionado
 *
 * Naming them also settles the ambiguity this file used to flag.
 * `docs/structure-migration.md` specifies "4 cursos, cada com 2 módulos" without
 * saying whether Cálculo counts as one of the four. All four named courses are
 * **ML** courses, so the plan's "4 cursos × 2 módulos" describes the ML half of
 * the catalogue and `calculo` is a fifth, pre-existing subject with three
 * modules of its own. If the intent was four subjects in total, delete one ML
 * entry and nothing else changes.
 *
 * The course **names** are the author's. The module titles, taglines and
 * descriptions wrapped around them were authored in the same pass and are still
 * the softest part of this file — treat the prose as a first draft to revise.
 *
 * **Ids are deliberately unchanged.** They are internal keys rather than display
 * text, and the three surviving ML ids still describe their subject accurately
 * (`regressao-classificacao` *is* supervised learning). Only the three
 * `calculo-*` ids are bound to persisted progress keys — see
 * `PROGRESS_KEY_BY_MODULE` in `studies.component.ts` — so renaming an ML subject
 * cannot orphan anyone's saved progress.
 *
 * Icons: one per subject is enough, since a module that does not exist yet has
 * no activity of its own to depict. Cálculo is the exception — each of its
 * modules is a different activity and carries its own icon.
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

  {
    id: 'fundamentos',
    name: 'Fundamentos Matemáticos para ML',
    tagline: 'A matemática que o ML reusa, sem decorar notação.',
    modules: [
      {
        id: 'fundamentos-teoria',
        kind: 'teoria',
        // Available because the first of its seven contracted lessons has content. The
        // `meta` line says "1 de 7" rather than "7 lições" for the same reason: the route
        // opens on a pilot, and the catalogue should not imply the module is finished.
        status: 'available',
        title: 'Vetores, matrizes e derivadas',
        description:
          'Um exemplo é um vetor, um dataset é uma matriz, e o erro tem uma direção. Explore as três ideias antes de encarar a notação.',
        route: '/fundamentos/teoria',
        icon: 'icons/fundamentals.svg',
        meta: ['1 de 7 lições', 'Aprendizagem por descoberta'],
      },
      {
        id: 'fundamentos-aplicada',
        kind: 'aplicada',
        status: 'coming-soon',
        title: 'Do problema à conta',
        description:
          'Traduzir uma pergunta sobre dados em produto de matrizes e gradiente — e conferir o resultado na mão.',
        route: null,
        icon: 'icons/fundamentals.svg',
        meta: ['Em breve'],
      },
    ],
  },
  {
    id: 'regressao-classificacao',
    name: 'Aprendizado Supervisionado',
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
        meta: ['Em breve'],
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
        meta: ['Em breve'],
      },
    ],
  },
  {
    id: 'redes-neurais',
    name: 'Redes Neurais do Zero',
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
        meta: ['Em breve'],
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
        meta: ['Em breve'],
      },
    ],
  },
  {
    id: 'nao-supervisionado',
    name: 'Aprendizado Não-Supervisionado',
    tagline: 'Encontrar estrutura quando ninguém deu a resposta.',
    modules: [
      {
        id: 'nao-supervisionado-teoria',
        kind: 'teoria',
        status: 'coming-soon',
        title: 'Grupos que ninguém rotulou',
        description:
          'Como o algoritmo percebe que existem grupos nos dados quando nenhuma coluna diz a qual grupo cada ponto pertence.',
        route: null,
        icon: 'icons/unsupervised.svg',
        meta: ['Em breve'],
      },
      {
        id: 'nao-supervisionado-aplicada',
        kind: 'aplicada',
        status: 'coming-soon',
        title: 'Reduzir para enxergar',
        description:
          'Comprimir dezenas de variáveis em duas para revelar padrões que a tabela esconde.',
        route: null,
        icon: 'icons/unsupervised.svg',
        meta: ['Em breve'],
      },
    ],
  },
];
