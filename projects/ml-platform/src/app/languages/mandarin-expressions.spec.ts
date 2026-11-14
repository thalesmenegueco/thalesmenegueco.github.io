import {
  MANDARIN_EXPRESSIONS,
  type MandarinExpression,
} from './mandarin-expressions';
import {
  MANDARIN_TEXTS,
  MANDARIN_WORD_INDEX,
  mandarinWordKey,
} from './mandarin-content';

/**
 * The gate for the expression backlog.
 *
 * `mandarin-expressions.ts` is a plan — 28 expressions, one reading each — and a
 * plan that is never checked against the collection is a list of good
 * intentions. This spec makes it a contract in both directions:
 *
 *   - a row marked `'escrito'` must point at a reading that **actually contains
 *     the block**, and must agree with the dictionary entry the reader renders;
 *   - a row marked `'pendente'` must **not** appear as a block anywhere, so the
 *     status cannot quietly lag behind the content;
 *   - every reading under `focus: 'expressoes'` must be claimed by exactly one
 *     row, so no expression reading exists that the backlog does not know about.
 *
 * What it does not cover: whether the fable is told well, whether the register is
 * right, or whether the pinyin of a `'pendente'` row is correct. Those are
 * editorial, and the last one is not even a claim yet — the sheet's pinyin is
 * re-decided when the row turns `'escrito'`.
 */
describe('Expressões backlog', () => {
  /** Every reading whose tokens contain `zh` as one word, with the count. */
  function blockTokens(zh: string): { textId: string; count: number }[] {
    return MANDARIN_TEXTS.map((text) => ({
      textId: text.id,
      count: text.tokens
        .flat()
        .filter((token) => token.word !== null && token.word.zh === zh).length,
    })).filter((entry) => entry.count > 0);
  }

  function dictionaryWord(expression: MandarinExpression) {
    return MANDARIN_WORD_INDEX.get(mandarinWordKey(expression));
  }

  const written = MANDARIN_EXPRESSIONS.filter(
    (expression) => expression.status === 'escrito',
  );

  it('lists every expression once', () => {
    const keys = MANDARIN_EXPRESSIONS.map((expression) => expression.zh);

    expect(new Set(keys).size).toBe(keys.length);
  });

  it('links every written expression to the reading that teaches it', () => {
    expect(written.length)
      .withContext('ao menos uma expressão escrita')
      .toBeGreaterThan(0);

    for (const expression of written) {
      const label = expression.zh;
      const textId = expression.textId ?? '';

      expect(textId).withContext(`${label}: textId`).not.toBe('');

      const text = MANDARIN_TEXTS.find((candidate) => candidate.id === textId);

      expect(text).withContext(`${label}: leitura “${textId}” existe`).toBeDefined();
      expect(String(text?.focus))
        .withContext(`${label}: a leitura é de expressões`)
        .toBe('expressoes');

      // The block must be one token, not four characters that happen to sit
      // next to each other: that single token is what the reader hovers.
      const found = blockTokens(expression.zh);

      expect(found.length)
        .withContext(`${label}: aparece em exatamente uma leitura`)
        .toBe(1);
      expect(String(found[0]?.textId))
        .withContext(`${label}: na leitura “${textId}”`)
        .toBe(textId);
      expect(found[0]?.count ?? 0)
        .withContext(`${label}: dito uma vez, em bloco`)
        .toBe(1);
    }
  });

  it('keeps every written expression identical to its dictionary entry', () => {
    // The dictionary is what the learner reads in the tooltip, so it wins every
    // disagreement: this is the assertion that stops the plan and the built
    // reading from describing two different glosses for the same four characters.
    for (const expression of written) {
      const word = dictionaryWord(expression);
      const label = expression.zh;

      expect(word).withContext(`${label}: entrada no dicionário`).toBeDefined();
      expect(String(word?.zh)).withContext(`${label}: zh`).toBe(expression.zh);
      expect(String(word?.traditional))
        .withContext(`${label}: traditional`)
        .toBe(expression.traditional);
      expect(String(word?.pinyin))
        .withContext(`${label}: pinyin`)
        .toBe(expression.pinyin);
      expect(String(word?.meaning))
        .withContext(`${label}: meaning`)
        .toBe(expression.meaning);
    }
  });

  it('does not let a pending expression hide in a reading', () => {
    // A row that is still 'pendente' while its block is already taught is a
    // backlog that lost track of itself — and it would also mean a reading was
    // written without its row being updated to 'escrito'.
    const stale = MANDARIN_EXPRESSIONS.filter(
      (expression) => expression.status === 'pendente',
    )
      .filter((expression) => blockTokens(expression.zh).length > 0)
      .map((expression) => expression.zh);

    expect(stale).toEqual([]);
  });

  it('claims every expression reading exactly once', () => {
    const claimed = written.map((expression) => expression.textId ?? '');

    for (const text of MANDARIN_TEXTS.filter(
      (candidate) => candidate.focus === 'expressoes',
    )) {
      expect(claimed.filter((textId) => textId === text.id))
        .withContext(`${text.id}: uma linha da planilha aponta para ela`)
        .toEqual([text.id]);
    }

    expect(new Set(claimed).size)
      .withContext('nenhuma leitura é reivindicada por duas linhas')
      .toBe(claimed.length);
  });

  it('pairs every calque with a native twin, symmetrically', () => {
    // 一石二鸟 ↔ 一举两得 and 天下没有免费的午餐 ↔ 天上不会掉馅饼. The pair is
    // taught through two notes in two separate readings, so the link has to be
    // recorded somewhere a test can read — this is that somewhere.
    const paired = MANDARIN_EXPRESSIONS.filter((row) => row.twin);

    // Two pairs, and both ends of each pair carry the link.
    expect(paired.length)
      .withContext('dois calques e duas gêmeas')
      .toBe(4);

    for (const expression of paired) {
      const twin = MANDARIN_EXPRESSIONS.find(
        (row) => row.zh === expression.twin,
      );

      expect(twin)
        .withContext(`${expression.zh}: gêmea “${expression.twin}”`)
        .toBeDefined();
      expect(String(twin?.twin))
        .withContext(`${expression.zh}: a gêmea aponta de volta`)
        .toBe(expression.zh);
      expect(String(twin?.category))
        .withContext(`${expression.zh}: a gêmea mantém o registro`)
        .toBe(expression.category);
    }
  });

  it('covers all three registers and both regions of use', () => {
    const categories = new Set(MANDARIN_EXPRESSIONS.map((row) => row.category));
    const regions = new Set(MANDARIN_EXPRESSIONS.map((row) => row.region));

    for (const category of ['chengyu', 'proverbio', 'moderno'] as const) {
      expect(categories.has(category)).withContext(category).toBeTrue();
    }

    for (const region of ['ambos', 'continente', 'taiwan'] as const) {
      expect(regions.has(region)).withContext(region).toBeTrue();
    }
  });

  it('reports its own progress', () => {
    // Not decoration: the platform says "1 de 7" on purpose instead of pretending
    // a section is finished, and the backlog is the same honesty for expressions.
    expect(written.length).withContext('escritas').toBeGreaterThan(0);
    expect(written.length)
      .withContext('escritas')
      .toBeLessThan(MANDARIN_EXPRESSIONS.length);
    expect(MANDARIN_EXPRESSIONS.length)
      .withContext('26 da planilha + 2 gêmeas nativas')
      .toBe(28);
  });
});
