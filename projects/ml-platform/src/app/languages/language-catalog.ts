/**
 * The languages catalogue — VisuaLab's second kind of learning.
 *
 * The exatas catalogue (`studies/study-catalog.ts`) is driven by the
 * `@shared/learning` contract, whose `ModuleKind` union is the exatas
 * vocabulary (teoria/aplicada/processo). Languages are not that vocabulary, so
 * they get their own small catalogue instead of a `kind` stretched to mean
 * something it does not: a track here is a language, and its texts are
 * readings, not lessons with a widget.
 *
 * That split is deliberate and recorded in `./README.md`.
 */

/** HSK levels the reading collection is organised by. */
export type HskLevel = 1 | 2 | 3 | 4 | 5;

/** Editorial focus of a reading. */
export type MandarinFocus = 'historias' | 'cultura' | 'humor';

export const HSK_LEVELS: readonly HskLevel[] = [1, 2, 3, 4, 5];

/** Display order of the focus filters — the same order the cards are recommended in. */
export const MANDARIN_FOCUS_ORDER: readonly MandarinFocus[] = [
  'historias',
  'cultura',
  'humor',
];

export const MANDARIN_FOCUS_LABELS: Record<MandarinFocus, string> = {
  historias: 'Histórias',
  cultura: 'Cultura',
  humor: 'Humor',
};

/** A language track. One entry today; the reader UI is keyed by it. */
export interface LanguageTrack {
  id: 'mandarim';
  name: string;
  nameZh: string;
  tagline: string;
  description: string;
  /** Asset path relative to `<base href="/">`. */
  icon: string;
  /** Route of the track's reading hub. */
  route: string;
}

export const LANGUAGE_TRACKS: readonly LanguageTrack[] = [
  {
    id: 'mandarim',
    name: 'Mandarim',
    nameZh: '中文',
    tagline: 'Textos curtos com pinyin e glosas, do HSK 1 ao 5.',
    description:
      'Histórias do dia a dia, cultura e humor em chinês, com pinyin ligável, caracteres simplificados ou tradicionais e o significado de cada palavra ao passar o mouse.',
    icon: 'icons/mandarin.svg',
    route: '/linguas',
  },
];

export function focusLabel(focus: MandarinFocus): string {
  return MANDARIN_FOCUS_LABELS[focus];
}
