import { StudySubject } from './study.types';

/**
 * The study catalogue for "Exatas em Movimento".
 *
 * Each discipline exposes two modules — Teoria and Matemática aplicada — so
 * students first understand the concept and then apply it. Add new subjects
 * here as they are created.
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
    ],
  },
];
