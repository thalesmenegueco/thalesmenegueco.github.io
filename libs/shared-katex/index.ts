/**
 * `@shared/katex` — KaTeX rendering for both apps.
 *
 * Extracted from the Cálculo feature. Carries its own KaTeX stylesheet and web
 * fonts, so importing it is enough to render maths: no global stylesheet in the
 * host app and no CDN dependency.
 *
 * Selectors are still `app-katex` / `app-rich-math-text`; renaming them is
 * optional Phase 6 polish, not migration work.
 */
export { KatexComponent } from './katex/katex.component';
export { RichMathTextComponent } from './rich-math-text/rich-math-text.component';
