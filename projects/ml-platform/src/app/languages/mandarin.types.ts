/**
 * The shapes the Mandarin reading collection is authored in.
 *
 * Two formats live side by side, on purpose:
 *
 *   - `MandarinTextSource` is what a person writes: paragraphs as one string of
 *     space-separated dictionary keys and punctuation, so a reading stays
 *     readable in the editor and long enough sentences are easy to spot.
 *   - `MandarinText` is what the reader consumes: the same paragraphs already
 *     tokenised into words and literals, with the glossary resolved.
 *
 * `tokenizeMandarinText()` in `./mandarin-content.ts` turns one into the other at
 * module load.
 * The tokeniser never guesses: a key that is not in the dictionary becomes a
 * literal token (rendered like punctuation), and `mandarin-content.spec.ts`
 * fails the build when that happens — a typo in a paragraph is a test failure,
 * not a Chinese word that silently disappears from the lesson.
 */

import type { HskLevel, MandarinFocus } from './language-catalog';

/** One dictionary entry: a word the reader can render in two scripts and gloss. */
export interface MandarinWord {
  /**
   * Authoring key. Defaults to `zh`; only a homograph that means two different
   * things needs one (e.g. two readings of the same character).
   */
  id?: string;
  /** Simplified form, as authored in the paragraphs. */
  zh: string;
  /** Traditional form. Required even when identical, so the conversion is visible. */
  traditional: string;
  /** Pinyin with tone marks. */
  pinyin: string;
  /** Short gloss in pt-BR — the tooltip and the glossary show this verbatim. */
  meaning: string;
}

/** One rendered token of a paragraph. */
export interface MandarinToken {
  /** Dictionary entry; `null` for punctuation. */
  word: MandarinWord | null;
  /** Literal text for punctuation, or the unrecognised key as a visible fallback. */
  literal: string;
}

/** A reading, as authored. */
export interface MandarinTextSource {
  /** URL-safe id, unique across the collection. */
  id: string;
  level: HskLevel;
  focus: MandarinFocus;
  /** Display title, pt-BR. */
  title: string;
  /** The same title in Chinese. */
  titleZh: string;
  /** One line of pt-BR, shown on the hub card. */
  teaser: string;
  /**
   * One string per paragraph: dictionary keys and punctuation separated by
   * spaces. Keep sentences short — `mandarin-content.spec.ts` enforces a size
   * limit so no reading turns into a wall of text.
   */
  paragraphs: string[];
  /** pt-BR translation, one entry per paragraph — the reader shows it on demand. */
  translation: string[];
  /** Optional pt-BR note that explains a cultural point. */
  note?: string;
}

/** A reading, as the reader consumes it. */
export interface MandarinText extends MandarinTextSource {
  /** The authored paragraphs, tokenised. */
  tokens: MandarinToken[][];
  /** Number of word tokens — the unit `minutes` is estimated from. */
  wordCount: number;
  /** Words in order of first appearance, already de-duplicated. */
  glossary: MandarinWord[];
  /** Rough reading-time estimate in whole minutes, never below 1. */
  minutes: number;
}
