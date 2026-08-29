import { StudySubject } from './study.types';

/**
 * The study catalogue for "Exatas em Movimento".
 *
 * Each discipline exposes its learning moments — Teoria, Matemática aplicada
 * and Processo — so students understand the concept, apply it, and follow it
 * through a complete mathematical chain. Add new subjects here as they are
 * created.
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
        route: '/estudos/calculo/teoria',
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
        route: '/estudos/calculo/aplicada',
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
        route: '/estudos/calculo/processo',
        icon: 'icons/process.svg',
        meta: ['8 etapas', '1 problema completo'],
      },
    ],
  },
];
