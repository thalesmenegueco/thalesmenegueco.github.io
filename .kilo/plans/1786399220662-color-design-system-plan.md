# Color Design System Overhaul Plan

## Goal
Reorganize the existing color palette into a centralized, semantic design system using CSS custom properties, eliminate SCSS variable duplication, merge identical card components, and remove dead code.

## Current Architecture Problems
- 3 identical sets of SCSS variables redeclared across 9 files with conflicting `$primary-color` values (`#ffa300` vs `#2b05ff`)
- `#2b05ff` is declared but never actually used in any selector — dead code
- CSS reset duplicated in 4 component SCSS files (ineffective due to Angular view encapsulation)
- Layout classes (`.flex-interests`, `.container-flex-page-title-translation`, `.welcome`) duplicated across 3 component files
- `InterestComponent` and `CardProject` are 100% identical — same template, styles, inputs
- `DialogCardShadow` is dead code (imported nowhere, only its own spec file)
- `Interest` model name is misleading — used for projects too
- The precificacao sub-project has a better-organized CSS custom properties system that the main app completely lacks

## Palette: Keep Existing Colors

| Semantic Token              | Value                 | Current Usage                              |
|-----------------------------|-----------------------|--------------------------------------------|
| `--color-bg`                | `rgb(5, 5, 5)`        | Page background                            |
| `--color-surface`           | `rgb(75, 71, 71)`     | Card backgrounds                           |
| `--color-nav-bg`            | `#333`                | Nav & footer backgrounds                   |
| `--color-text`              | `whitesmoke`          | Main text color                            |
| `--color-text-accent`       | `#ffa300`             | h1 headings, current `$primary-color`      |
| `--color-text-secondary`    | `#ec0dcf`             | h2 headings, links, current `$secondary-color` |
| `--color-border`            | `rgba(255,255,255,1)` | Card borders                               |
| `--radius-card`             | `40px`                | Card border-radius                         |
| `--shadow-card-hover`       | `14px 14px`           | Card hover shadow offset (color inherited) |

Remove `#2b05ff` entirely — it's declared in 3 files but never used in any selector.

## Implementation Tasks (Ordered)

### Phase 1: Centralize color tokens in `styles.scss`
1. Add `:root { ... }` block in `src/styles.scss` with all CSS custom properties listed above.
2. Convert existing SCSS variable usage in `styles.scss` to CSS custom property references (e.g., `color: var(--color-text-accent)`).
3. Add shared layout utility classes to `styles.scss`: `.flex-cards`, `.page-header`, `.welcome`. These are currently duplicated in `home.component.scss`, `learning-gallery.component.scss`, and `projects.scss`.

### Phase 2: Merge `InterestComponent` + `CardProject` → single `CardComponent`
4. Create `src/app/shared/card/card.ts` — merge inline template + inputs from both. Use `app-card` as selector.
5. Create `src/app/shared/card/card.scss` — merge styles, convert all SCSS vars + hardcoded colors to CSS custom property references. Remove duplicated CSS reset.
6. Rename `src/models/interest.ts` → `src/models/card-item.ts`, rename `Interest` type → `CardItem`.
7. Delete `interest.ts`, `interest.scss`, `card-project.ts`, `card-project.scss`.
8. Update `LearningGalleryComponent` to import `CardComponent` instead of `InterestComponent`, use `<app-card>`.
9. Update `ProjectsComponent` to import `CardComponent` instead of `CardProject`, use `<app-card>`.

### Phase 3: Update remaining component SCSS files
10. Update `app.component.scss` — remove SCSS var redeclarations, replace `#333` with `var(--color-nav-bg)`, remove CSS reset (already in global).
11. Update `home.component.scss` — remove SCSS var redeclarations, remove duplicated layout classes.
12. Update `learning-gallery.component.scss` — remove SCSS var redeclarations, remove duplicated layout classes.
13. Update `projects.scss` — remove SCSS var redeclarations, remove duplicated layout classes.

### Phase 4: Clean up dead code
14. Delete `src/app/shared/dialog-card-shadow/` entirely (4 files: `.ts`, `.html`, `.scss`, `.spec.ts`).

### Phase 5: Verify
15. Run `ng build` to confirm no compilation errors.
16. Run `ng test` to confirm tests pass.

## Files Changed
- **Modified:** `src/styles.scss`, `src/app/app.component.scss`, `src/app/home/home.component.scss`, `src/app/learning-gallery/learning-gallery.component.scss`, `src/app/learning-gallery/learning-gallery.component.ts`, `src/app/projects/projects.scss`, `src/app/projects/projects.ts`
- **Created:** `src/app/shared/card/card.ts`, `src/app/shared/card/card.scss`
- **Renamed:** `src/models/interest.ts` → `src/models/card-item.ts`
- **Deleted:** `src/app/learning-gallery/components/interest/interest.ts`, `src/app/learning-gallery/components/interest/interest.scss`, `src/app/projects/components/card-project/card-project.ts`, `src/app/projects/components/card-project/card-project.scss`, `src/app/shared/dialog-card-shadow/` (4 files)

## Risks & Notes
- Angular ViewEncapsulation.Emulated prevents component SCSS from leaking, so the duplicated CSS resets were always dead anyway.
- The `Interest` model is imported in `learning-gallery.component.ts` and `projects.ts` — both need the rename.
- The `Interest` model is also imported in `interest.ts` — this goes away with the component merge.
- No runtime visual change expected — this is a pure refactor preserving the existing look.
- The precificacao sub-project's CSS custom properties won't collide because they're scoped inside the embedded page, not the Angular app.
