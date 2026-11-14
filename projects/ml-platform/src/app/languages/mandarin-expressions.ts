/**
 * The expression backlog — every 成语, 谚语 and modern phrase the collection
 * intends to teach, one row per reading, with the status of each row.
 *
 * **Why this is a `.ts` file and not the spreadsheet it came from.** The sheet
 * lives in `../expression-source/` (not published) and is the origin of these
 * rows, but it cannot be the *gate*: the gate is
 * `./mandarin-expressions.spec.ts`, which runs in a browser with no filesystem.
 * A checked-in module is the only form a test can read, so the sheet is frozen
 * as provenance — edit this file, not it. Moving it out of `public/` was part
 * of the same move: everything under `public/` is served to the world, and a
 * working sheet is not a lesson.
 *
 * A row is a `MandarinWord` plus editorial metadata on purpose: when a reading
 * is written, the row ***is*** the dictionary entry for the block, and the spec
 * asserts the two agree on `pinyin`, `traditional` and `meaning`. The plan and
 * the thing built from the plan cannot drift.
 *
 * When they disagree, **the dictionary wins**: `zh`/`pinyin`/`meaning` describe
 * what the learner reads in the tooltip, so the sheet's sentence-style glosses
 * ("Matar dois coelhos com uma cajadada só") become the terse dictionary voice
 * ("matar dois coelhos; resolver duas coisas de uma vez") at the moment the row
 * turns `'escrito'`. The `'pendente'` rows keep the sheet's wording: it is the
 * plan's intent, not a claim about the tooltip.
 *
 * `status` is asserted in both directions:
 *
 *   - `'escrito'` requires a `textId` that resolves to a real reading **and**
 *     whose tokens contain this block as one word;
 *   - `'pendente'` must not appear as a block in any reading — a status that
 *     lags behind the content is how a backlog starts lying.
 *
 * `twin` links a calque to the native expression that fills the same slot
 * (`一石二鸟` ↔ `一举两得`). The pair is taught through the notes of two separate
 * readings, never inside one text, because a text that compares two expressions
 * needs abstract vocabulary and has neither a fable nor a picture to explore.
 * See "Expressões" in `./README.md`.
 *
 * `category` is the register, and it is a different axis from the reader's
 * focus: a chengyu belongs to written or slightly formal speech, a proverb to
 * advice given out loud, a modern phrase to the internet. All three are
 * `focus: 'expressoes'` in the reading that teaches them.
 *
 * The pinyin below is transcribed from the sheet, which is inconsistent about
 * sandhi (`yī shí èr niǎo` next to `bú rù hǔ xué`). It is re-decided when the
 * block enters `./mandarin-words.ts`, where a single entry can carry the
 * spoken form — the spec only compares the two once the row is `'escrito'`.
 */
import type { MandarinWord } from './mandarin.types';

/** Register of an expression — the axis that decides *when a person says it*. */
export type ExpressionCategory = 'chengyu' | 'proverbio' | 'moderno';

/** Where the expression is the natural choice of words. */
export type ExpressionRegion = 'ambos' | 'continente' | 'taiwan';

/** Whether a reading already teaches it. Both values are asserted by the spec. */
export type ExpressionStatus = 'escrito' | 'pendente';

/** One row of the backlog: a dictionary entry plus what is left to do with it. */
export interface MandarinExpression extends MandarinWord {
  category: ExpressionCategory;
  region: ExpressionRegion;
  status: ExpressionStatus;
  /** The reading that teaches it. Required when `status` is `'escrito'`. */
  textId?: string;
  /** The native twin of a calque, and vice versa. Symmetric, asserted. */
  twin?: string;
}

export const MANDARIN_EXPRESSIONS: readonly MandarinExpression[] = [
  // ---------- 成语 (chengyu) — fixos em quatro caracteres ----------
  { zh: '一石二鸟', traditional: '一石二鳥', pinyin: 'yī shí èr niǎo', meaning: 'Matar dois coelhos com uma cajadada só', category: 'chengyu', region: 'ambos', status: 'pendente', twin: '一举两得' },
  { zh: '塞翁失马', traditional: '塞翁失馬', pinyin: 'sài wēng shī mǎ', meaning: 'Há males que vêm para bem', category: 'chengyu', region: 'ambos', status: 'pendente' },
  { zh: '画蛇添足', traditional: '畫蛇添足', pinyin: 'huà shé tiān zú', meaning: 'estragar o que já estava bom por acrescentar demais', category: 'chengyu', region: 'ambos', status: 'escrito', textId: 'hsk3-cobra-e-os-pes' },
  { zh: '亡羊补牢', traditional: '亡羊補牢', pinyin: 'wáng yáng bǔ láo', meaning: 'Depois da casa arrombada, trancar a porta', category: 'chengyu', region: 'ambos', status: 'pendente' },
  { zh: '半途而废', traditional: '半途而廢', pinyin: 'bàn tú ér fèi', meaning: 'Desistir no meio do caminho', category: 'chengyu', region: 'ambos', status: 'pendente' },
  { zh: '守株待兔', traditional: '守株待兔', pinyin: 'shǒu zhū dài tù', meaning: 'esperar que a sorte se repita, sem fazer nada', category: 'chengyu', region: 'ambos', status: 'escrito', textId: 'hsk3-toco-e-o-coelho' },
  { zh: '对牛弹琴', traditional: '對牛彈琴', pinyin: 'duì niú tán qín', meaning: 'Pérolas aos porcos', category: 'chengyu', region: 'ambos', status: 'pendente' },
  { zh: '掩耳盗铃', traditional: '掩耳盜鈴', pinyin: 'yǎn ěr dào líng', meaning: 'Achar que ninguém vê porque você não vê', category: 'chengyu', region: 'ambos', status: 'pendente' },
  { zh: '入乡随俗', traditional: '入鄉隨俗', pinyin: 'rù xiāng suí sú', meaning: 'Em Roma, faça como os romanos', category: 'chengyu', region: 'ambos', status: 'pendente' },
  { zh: '知足常乐', traditional: '知足常樂', pinyin: 'zhī zú cháng lè', meaning: 'Quem se contenta é feliz', category: 'chengyu', region: 'ambos', status: 'pendente' },
  { zh: '井底之蛙', traditional: '井底之蛙', pinyin: 'jǐng dǐ zhī wā', meaning: 'alguém de visão estreita; quem acha que seu mundo é o mundo', category: 'chengyu', region: 'ambos', status: 'escrito', textId: 'hsk4-sapo-no-poco' },
  { zh: '得寸进尺', traditional: '得寸進尺', pinyin: 'dé cùn jìn chǐ', meaning: 'Dar a mão e querer o braço', category: 'chengyu', region: 'ambos', status: 'pendente' },
  { zh: '一帆风顺', traditional: '一帆風順', pinyin: 'yī fān fēng shùn', meaning: 'Que tudo corra bem', category: 'chengyu', region: 'ambos', status: 'pendente' },
  { zh: '万事如意', traditional: '萬事如意', pinyin: 'wàn shì rú yì', meaning: 'Que tudo dê certo', category: 'chengyu', region: 'ambos', status: 'pendente' },
  // ---------- 谚语 (proverbios) — conselho que se diz, não imagem que se mostra ----------
  { zh: '天下没有免费的午餐', traditional: '天下沒有免費的午餐', pinyin: 'tiānxià méiyǒu miǎnfèi de wǔcān', meaning: 'Não existe almoço grátis', category: 'proverbio', region: 'ambos', status: 'pendente', twin: '天上不会掉馅饼' },
  { zh: '吃一堑长一智', traditional: '吃一塹長一智', pinyin: 'chī yí qiàn zhǎng yí zhì', meaning: 'Aprende-se com os próprios erros', category: 'proverbio', region: 'ambos', status: 'pendente' },
  { zh: '好事多磨', traditional: '好事多磨', pinyin: 'hǎo shì duō mó', meaning: 'Coisas boas exigem paciência', category: 'proverbio', region: 'ambos', status: 'pendente' },
  { zh: '三个臭皮匠，胜过诸葛亮', traditional: '三個臭皮匠，勝過諸葛亮', pinyin: 'sān ge chòu píjiàng, shèngguò Zhūgě Liàng', meaning: 'Duas cabeças pensam melhor que uma', category: 'proverbio', region: 'ambos', status: 'pendente' },
  { zh: '种瓜得瓜，种豆得豆', traditional: '種瓜得瓜，種豆得豆', pinyin: 'zhòng guā dé guā, zhòng dòu dé dòu', meaning: 'Cada um colhe o que planta', category: 'proverbio', region: 'ambos', status: 'pendente' },
  { zh: '眼不见为净', traditional: '眼不見為淨', pinyin: 'yǎn bú jiàn wéi jìng', meaning: 'O que os olhos não veem, o coração não sente', category: 'proverbio', region: 'ambos', status: 'pendente' },
  { zh: '活到老学到老', traditional: '活到老學到老', pinyin: 'huó dào lǎo xué dào lǎo', meaning: 'Nunca é tarde para aprender', category: 'proverbio', region: 'ambos', status: 'pendente' },
  { zh: '不入虎穴，焉得虎子', traditional: '不入虎穴，焉得虎子', pinyin: 'bú rù hǔ xué, yān dé hǔ zǐ', meaning: 'Quem não arrisca não petisca', category: 'proverbio', region: 'ambos', status: 'pendente' },
  // ---------- Expressões modernas — registro de internet, voz jovem ----------
  { zh: '躺平', traditional: '躺平', pinyin: 'tǎng píng', meaning: 'Desistir da competição, deixar a vida levar', category: 'moderno', region: 'continente', status: 'pendente' },
  { zh: '内卷', traditional: '內卷', pinyin: 'nèi juǎn', meaning: 'Competição excessiva e sem fim', category: 'moderno', region: 'continente', status: 'pendente' },
  { zh: '小确幸', traditional: '小確幸', pinyin: 'xiǎo què xìng', meaning: 'Pequenas felicidades do dia a dia', category: 'moderno', region: 'taiwan', status: 'pendente' },
  { zh: '吃饱没', traditional: '吃飽沒', pinyin: 'chī bǎo méi', meaning: 'Já comeu? (cumprimento)', category: 'moderno', region: 'taiwan', status: 'pendente' },
  // ---------- Gêmeas nativas — a expressão nativa que ocupa o lugar do calque ----------
  // Nenhuma das duas está escrita ainda. Quando uma for, a leitura dela carrega a
  // nota que aponta para o calque, e esta linha muda para 'escrito'.
  { zh: '一举两得', traditional: '一舉兩得', pinyin: 'yì jǔ liǎng dé', meaning: 'uma ação, dois ganhos; resolver duas coisas de uma vez', category: 'chengyu', region: 'ambos', status: 'pendente', twin: '一石二鸟' },
  { zh: '天上不会掉馅饼', traditional: '天上不會掉餡餅', pinyin: 'tiān shàng bú huì diào xiàn bǐng', meaning: 'não cai torta do céu; nada cai do céu de graça', category: 'proverbio', region: 'ambos', status: 'pendente', twin: '天下没有免费的午餐' },
];
