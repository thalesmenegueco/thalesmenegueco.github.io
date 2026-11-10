import { HSK_LEVELS, MANDARIN_FOCUS_ORDER } from './language-catalog';
import {
  MAX_WORDS_PER_PARAGRAPH,
  MANDARIN_TEXTS,
  MANDARIN_WORD_INDEX,
  findMandarinText,
  isMandarinPunctuation,
} from './mandarin-content';
import { MANDARIN_TEXT_SOURCES } from './mandarin-texts';
import { MANDARIN_WORDS } from './mandarin-words';
import type { MandarinToken, MandarinWord } from './mandarin.types';

/**
 * The content gate for the language collection.
 *
 * These readings are authored, not generated, so the failure mode is not an
 * invented formula — it is a typo that silently drops a word (an unknown key
 * renders as text) or a gloss that contradicts the paragraph. The spec turns
 * every one of those into a build failure.
 */
describe('Mandarin reading content', () => {
  function wordTokens(tokens: MandarinToken[][]): MandarinToken[] {
    return tokens.flat().filter((token) => token.word !== null);
  }

  it('resolves every paragraph token to a word or known punctuation', () => {
    const unresolved: string[] = [];

    for (const text of MANDARIN_TEXTS) {
      for (const paragraph of text.tokens) {
        for (const token of paragraph) {
          if (!token.word && !isMandarinPunctuation(token.literal)) {
            unresolved.push(`${text.id}: “${token.literal}”`);
          }
        }
      }
    }

    expect(unresolved).toEqual([]);
  });

  it('authors every dictionary entry exactly once', () => {
    const keys = MANDARIN_WORDS.map((word) => word.id ?? word.zh);

    expect(new Set(keys).size).toBe(MANDARIN_WORDS.length);
    expect(MANDARIN_WORD_INDEX.size).toBe(MANDARIN_WORDS.length);
  });

  it('describes every word with both scripts, tone-marked pinyin and a gloss', () => {
    // Tone marks only — a tone number is not pinyin a learner can read. The
    // ASCII apostrophe is the standard syllable separator (fāng'àn, píng'ān).
    const pinyinPattern =
      /^[a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüńǹ']+(\s[a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüńǹ']+)*$/i;

    for (const word of MANDARIN_WORDS) {
      const label = word.id ?? word.zh;

      expect(word.zh).withContext(`${label}: simplified`).toBeTruthy();
      expect(word.traditional).withContext(`${label}: traditional`).toBeTruthy();
      expect(word.meaning).withContext(`${label}: meaning`).toBeTruthy();
      expect(word.pinyin)
        .withContext(`${label}: pinyin “${word.pinyin}”`)
        .toMatch(pinyinPattern);
    }
  });

  it('keeps the dictionary lean: every entry appears in at least one reading', () => {
    const used = new Set<MandarinToken['word']>();

    for (const text of MANDARIN_TEXTS) {
      for (const token of wordTokens(text.tokens)) {
        used.add(token.word);
      }
    }

    const unused = MANDARIN_WORDS.filter((word) => !used.has(word));

    expect(unused.map((word) => word.zh)).toEqual([]);
  });

  it('offers every HSK level and every focus in the catalogue', () => {
    const levels = new Set(MANDARIN_TEXTS.map((text) => text.level));
    const focuses = new Set(MANDARIN_TEXTS.map((text) => text.focus));

    for (const level of HSK_LEVELS) {
      expect(levels.has(level)).withContext(`level ${level}`).toBeTrue();
    }

    for (const focus of MANDARIN_FOCUS_ORDER) {
      expect(focuses.has(focus)).withContext(focus).toBeTrue();
    }
  });

  it('keeps text ids unique and URL-safe', () => {
    const ids = MANDARIN_TEXTS.map((text) => text.id);

    expect(new Set(ids).size).toBe(ids.length);

    for (const id of ids) {
      expect(id).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it('keeps a pt-BR translation paragraph for every Chinese paragraph', () => {
    for (const text of MANDARIN_TEXTS) {
      expect(text.translation.length).withContext(text.id).toBe(text.paragraphs.length);

      for (const line of text.translation) {
        expect(line.trim()).withContext(text.id).not.toBe('');
      }
    }
  });

  it('keeps every paragraph short enough to scan', () => {
    for (const text of MANDARIN_TEXTS) {
      for (const [index, paragraph] of text.tokens.entries()) {
        const words = paragraph.filter((token) => token.word !== null).length;
        const sentences = paragraph.filter(
          (token) => token.word === null && '。？！'.includes(token.literal),
        ).length;

        // A reading that needs a scrollbar inside a paragraph is the failure this
        // limit exists to prevent; three sentences is the editorial ceiling.
        expect(words)
          .withContext(`${text.id} · par. ${index + 1} · ${words} words`)
          .toBeLessThanOrEqual(MAX_WORDS_PER_PARAGRAPH);
        expect(sentences)
          .withContext(`${text.id} · par. ${index + 1} · ${sentences} sentences`)
          .toBeLessThanOrEqual(3);
      }
    }
  });

  it('computes the glossary and reading time from the words actually used', () => {
    for (const text of MANDARIN_TEXTS) {
      const tokens = wordTokens(text.tokens);
      const firstAppearance: MandarinWord[] = [];

      for (const token of tokens) {
        const word = token.word;
        if (word && !firstAppearance.includes(word)) {
          firstAppearance.push(word);
        }
      }

      expect(text.wordCount).withContext(text.id).toBe(tokens.length);
      expect(text.glossary).withContext(text.id).toEqual(firstAppearance);
      expect(text.minutes).withContext(text.id).toBeGreaterThanOrEqual(1);
      expect(text.minutes).withContext(text.id).toBeLessThanOrEqual(10);
    }
  });

  it('never renders an empty reading', () => {
    for (const text of MANDARIN_TEXTS) {
      expect(text.paragraphs.length).withContext(text.id).toBeGreaterThan(0);
      expect(text.wordCount).withContext(text.id).toBeGreaterThan(0);
      expect(text.title.trim()).withContext(text.id).not.toBe('');
      expect(text.teaser.trim()).withContext(text.id).not.toBe('');
    }
  });

  it('resolves a text by id and refuses an unknown one', () => {
    const sample = MANDARIN_TEXTS[0];

    expect(findMandarinText(sample.id)).toBe(sample);
    expect(findMandarinText('nao-existe')).toBeUndefined();
    expect(findMandarinText(null)).toBeUndefined();
    expect(findMandarinText(undefined)).toBeUndefined();
  });

  it('treats punctuation as punctuation and characters as words', () => {
    expect(isMandarinPunctuation('。')).toBeTrue();
    expect(isMandarinPunctuation('，')).toBeTrue();
    expect(isMandarinPunctuation('我')).toBeFalse();
  });

  it('declares readings in the same source file the reader imports', () => {
    // The indirection exists so the authored file and the tokenised collection
    // cannot describe different numbers of readings.
    expect(MANDARIN_TEXTS.length).toBe(MANDARIN_TEXT_SOURCES.length);
  });
});
