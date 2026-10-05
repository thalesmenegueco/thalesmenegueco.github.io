import { Pipe, PipeTransform } from '@angular/core';

/** A run of lesson text with the emphasis it carries. */
export interface RichSegment {
  text: string;
  emphasis: 'none' | 'bold' | 'italic';
}

/**
 * `**bold**` or `*italic*`, at least one non-space character on each side.
 *
 * The flanking rule is CommonMark's, and it earns its keep here: without it a line about
 * multiplication — `2 * x * 3` — would italicise ` x `. Requiring non-space at both ends
 * means only deliberate emphasis matches.
 */
const TOKEN = /\*\*(\S(?:[^*\n]*\S)?)\*\*|\*(\S(?:[^*\n]*\S)?)\*/g;

/**
 * Splits lesson text into plain, bold and italic runs.
 *
 * Exported so it can be tested directly: the parser is the part with edge cases, and a pipe
 * is a thin wrapper around it.
 */
export function parseRichText(input: string): RichSegment[] {
  const segments: RichSegment[] = [];
  let last = 0;

  for (const match of input.matchAll(TOKEN)) {
    const index = match.index ?? 0;
    if (index > last) {
      segments.push({ text: input.slice(last, index), emphasis: 'none' });
    }
    // Group 1 is the bold alternative, group 2 the italic one.
    segments.push(
      match[1] !== undefined
        ? { text: match[1], emphasis: 'bold' }
        : { text: match[2], emphasis: 'italic' },
    );
    last = index + match[0].length;
  }

  if (last < input.length) {
    segments.push({ text: input.slice(last), emphasis: 'none' });
  }

  return segments;
}

/**
 * Renders the inline emphasis the lesson content uses.
 *
 * **Why this exists.** `narrative` and the `checkpoint` fields are prose, but the material a
 * generator reads — `content-source/` — is markdown full of `**bold**` (every extracted
 * section labels its blocks `**(a) Definições Formais e Notação Exata:**`). Emphasis
 * therefore leaks into generated prose by design of its input, not by accident: a first
 * version of this player interpolated the text raw and the reader saw the asterisks. Handling
 * it here means a future generation cannot reproduce that failure by writing `**termo**`.
 *
 * Deliberately **not** a markdown parser, and deliberately **not** `innerHTML`. The repo's own
 * rule for formulas — "LaTeX padrão, sem macros próprias nem sintaxe inventada" — applies to
 * prose too: this supports exactly two constructs, so what a lesson may contain stays a closed
 * set that a reviewer can hold in their head. Everything is built from text nodes and
 * `<strong>`/`<em>` elements, so there is no injection surface and no sanitiser to trust.
 *
 * `@shared/katex`'s `RichMathTextComponent` is the sibling of this for inline `$$…$$` maths;
 * the two are separate because the ML narrative contract carries emphasis and Cálculo's
 * explanation never has.
 */
@Pipe({ name: 'richText', standalone: true, pure: true })
export class RichTextPipe implements PipeTransform {
  transform(value: string | null | undefined): RichSegment[] {
    return parseRichText(value ?? '');
  }
}
