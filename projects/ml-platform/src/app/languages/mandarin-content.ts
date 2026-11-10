/**
 * Turns the authored readings into what the reader renders.
 *
 * The collection is small, static and authored, so the tokenisation happens
 * once, at module load: `MANDARIN_TEXTS` is already resolved, and the reader
 * never does dictionary lookups per keystroke. Everything that could be wrong
 * about a paragraph — an unknown key, a missing translation, a paragraph that
 * became a wall of text — is asserted in `./mandarin-content.spec.ts`, which is
 * the gate this file is built to survive.
 *
 * Unknown keys do **not** throw here: a bad key becomes a literal token so a
 * reading still renders (as text the author can see) instead of taking the whole
 * page down. The spec is what makes that state impossible to merge.
 */
import type {
  MandarinText,
  MandarinTextSource,
  MandarinToken,
  MandarinWord,
} from './mandarin.types';
import { MANDARIN_TEXT_SOURCES } from './mandarin-texts';
import { MANDARIN_WORDS } from './mandarin-words';

/**
 * The punctuation a paragraph may contain as its own token. Anything else that
 * is not a dictionary key is an authoring error (`mandarin-content.spec.ts`).
 */
export const MANDARIN_PUNCTUATION: readonly string[] = [
  '。',
  '，',
  '？',
  '！',
  '、',
  '：',
  '“',
  '”',
  '（',
  '）',
  '……',
  '—',
];

/**
 * Editorial ceiling: a paragraph above this many words is rejected by the spec.
 * The collection's promise is "short texts" — the rule is enforced, not hoped
 * for, so no reading can quietly turn into a wall of text.
 */
export const MAX_WORDS_PER_PARAGRAPH = 30;

/** Reading speed used for the estimate. Deliberately slow — annotated reading. */
const WORDS_PER_MINUTE = 25;

const PUNCTUATION = new Set(MANDARIN_PUNCTUATION);

/** Dictionary key of a word: its explicit `id`, or its simplified form. */
export function mandarinWordKey(word: MandarinWord): string {
  return word.id ?? word.zh;
}

const WORD_INDEX: ReadonlyMap<string, MandarinWord> = new Map(
  MANDARIN_WORDS.map((word) => [mandarinWordKey(word), word]),
);

/** The dictionary, exposed for the integrity spec (and future search). */
export const MANDARIN_WORD_INDEX: ReadonlyMap<string, MandarinWord> = WORD_INDEX;

/** True for a token the renderer should treat as punctuation rather than a word. */
export function isMandarinPunctuation(value: string): boolean {
  return PUNCTUATION.has(value);
}

export function tokenizeMandarinParagraph(paragraph: string): MandarinToken[] {
  return paragraph
    .trim()
    .split(/\s+/)
    .filter((key) => key.length > 0)
    .map((key): MandarinToken => {
      const word = WORD_INDEX.get(key);
      return word ? { word, literal: '' } : { word: null, literal: key };
    });
}

export function tokenizeMandarinText(source: MandarinTextSource): MandarinText {
  const tokens = source.paragraphs.map(tokenizeMandarinParagraph);

  const glossary: MandarinWord[] = [];
  const seen = new Set<MandarinWord>();
  let wordCount = 0;

  for (const paragraph of tokens) {
    for (const token of paragraph) {
      if (!token.word) {
        continue;
      }

      wordCount += 1;
      if (!seen.has(token.word)) {
        seen.add(token.word);
        glossary.push(token.word);
      }
    }
  }

  return {
    ...source,
    tokens,
    wordCount,
    glossary,
    minutes: Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE)),
  };
}

/** Every reading, tokenised once at load. Source order doubles as display order. */
export const MANDARIN_TEXTS: readonly MandarinText[] = MANDARIN_TEXT_SOURCES.map(
  tokenizeMandarinText,
);

/** Resolves a route parameter to a reading; `undefined` when it does not exist. */
export function findMandarinText(
  id: string | null | undefined,
): MandarinText | undefined {
  if (!id) {
    return undefined;
  }

  return MANDARIN_TEXTS.find((text) => text.id === id);
}
