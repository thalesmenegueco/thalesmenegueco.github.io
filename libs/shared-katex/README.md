# `@shared/katex`

KaTeX rendering shared by the portfolio and the ML platform.

```ts
import { KatexComponent, RichMathTextComponent } from '@shared/katex';
```

`KatexComponent` renders one LaTeX expression into its host; `RichMathTextComponent`
renders a string containing inline `$$...$$` segments. Selectors are still
`app-katex` / `app-rich-math-text`; renaming them is optional Phase 6 polish.

## Required host setup: register KaTeX's global stylesheet

**Each app that uses this lib must list KaTeX's stylesheet in its `angular.json`
`styles` array:**

```jsonc
"styles": [
  "projects/<app>/src/styles.scss",
  "node_modules/katex/dist/katex.min.css"
]
```

This is a deliberate deviation from the migration plan, which specified importing
`katex/dist/katex.min.css` inside the lib's own component stylesheet. That does
not work, for two independent reasons — both verified by building it:

1. **Emulated encapsulation breaks it.** `katex.render()` builds its output DOM
   imperatively, so the generated elements never receive Angular's
   `_ngcontent-*` attribute. Angular rewrites a component stylesheet's selectors
   to `.katex[_ngcontent-xyz]`, which then matches nothing. The build showed
   **427 KaTeX selectors rewritten** this way — maths would have rendered
   unstyled, with fallback fonts.
2. **It blows the component-style budget.** KaTeX's stylesheet is ~25 kB, and
   inlining it into a component stylesheet produced a **25.5 kB** component style
   against a 12 kB error budget, failing the build.

Loading it as a seeded global style avoids both problems and still drops the CDN
dependency the plan wanted to remove: the CSS and all 60 web-font files are
bundled from the installed `katex` package and served from the app's own origin,
instead of being fetched from `cdn.jsdelivr.net`.

**Ordering note.** The stylesheet must be listed *after* the app's own
`styles.scss`. KaTeX's CSS contains a `body { position: relative }` and a
`body { counter-reset: ... }` rule, so it should not be allowed to win a
specificity tie against app rules. Listing it after also keeps any literal
`@import` in `styles.scss` (the Google Fonts one) at the top of the emitted
stylesheet, where it is valid.

## Keeping the version honest

The stylesheet version is pinned by `katex` in the root `package.json`. The CDN
import this replaced was pinned to the same `0.18.4`, so the switch is
version-for-version.
