# Migration Plan — `portfolio` + `ml-platform` monorepo

Implementation plan for [`structure-migration.md`](./structure-migration.md).

**Decisions locked in** (confirmed with the author):

| Question | Decision |
|---|---|
| What moves out of the portfolio? | `estudos/*` (the Cálculo modules) **+** all new ML courses. The `tools/*` lab (explore-data, ocr, test-llms, measure-it, project-manager, precificação) stays in the portfolio as showcased work. |
| Dependency strategy | **Single root `package.json`**, two build targets. One install, one lockfile. |
| Where does `ml-platform` deploy? | **Vercel or Netlify + custom domain**, from this same repository. |

---

## 0. Reality check before committing to this

The source doc justifies the split mainly with bundle weight: *"TF.js sozinho (1.2MB minified) já é provavelmente maior que todo o bundle atual do seu portfólio."*

That premise no longer matches the repository. The heavy dependencies are **already in the tree**, and they are **already isolated behind lazy routes**:

| Dependency | Imported by | Isolation today |
|---|---|---|
| `@mlc-ai/web-llm`, `@huggingface/transformers` | `test-llms/*` | lazy route + dedicated workers |
| `echarts`, `ngx-echarts`, `arquero`, `papaparse`, `xlsx`, `simple-statistics` | `explore-data/*` | lazy route |
| `tesseract.js` | `ocr/*` | lazy route |
| `katex` | `calculus*/*` | lazy route (CSS still from CDN) |

Measured production output of the current build (`dist/learning-gallery/browser`):

```
main-CTXD2HQZ.js       194,949 B   <- the recruiter's actual payload
polyfills-B6TNHZQ6.js   34,579 B
styles-MU42YPF5.css     11,195 B
chunk-POHH5IVY.js    5,970,750 B   <- explore-data / llm lazy chunks
worker-JBXFQEKZ.js   6,026,498 B
chunk-YLHB66PS.js    1,174,789 B
worker-2ULGKPPQ.js     873,249 B
```

So: the initial bundle is **already ~230 KB**, and the 14 MB of heavy chunks never touch a recruiter's session.

**Consequence for this plan.** The technical argument in the doc is largely already satisfied by lazy loading. The remaining arguments for the migration are real but different, and they are the ones to hold onto:

1. **Product identity** — a teaching site needs its own shell, tone, nav, and SEO; a portfolio's nav ("🤓 Projetos") is actively wrong for a student two hours into a module.
2. **Independent deploys** — edge caching and per-PR previews matter precisely because the chunks are 6 MB; GitHub Pages gives neither.
3. **Independent evolution** — user accounts, comments, saved models, four courses. None of that should be able to break the portfolio.
4. **Future weight** — TF.js, D3 and Plotly are *not yet* in the tree. This migration is what keeps them out of the portfolio when they arrive.

Do not oversell bundle savings as the payoff; if Phase 3–5 ever feel expensive, the honest justification is 1–4, not "the bundle is smaller".

---

## 1. Target layout

```text
thalesmenegueco.github.io/            # repo stays as the workspace root
├── angular.json                      # TWO projects: portfolio, ml-platform
├── tsconfig.json                     # references + `paths` -> libs/*
├── package.json                      # single root manifest
├── projects/
│   ├── portfolio/                    # App 1 -> thalesmenegueco.github.io (unchanged URL)
│   │   ├── src/{main.ts,index.html,404.html,styles.scss,app/**}
│   │   ├── tsconfig.app.json
│   │   └── tsconfig.spec.json
│   └── ml-platform/                  # App 2 -> custom domain (Vercel/Netlify)
│       └── src/**                    # own shell, own identity, own budgets
├── libs/
│   ├── shared-plotting/              # PlotCanvasComponent, plotting.ts, plot theme
│   ├── shared-katex/                 # KatexComponent, RichMathTextComponent
│   ├── shared-progress/              # keyed localStorage progress store
│   └── shared-learning/              # StudySubject model, module kinds, lesson contract
├── cloudflare-worker/test-llms/      # unchanged (separate deployable, see R5)
└── .github/workflows/                # portfolio deploy (unchanged) + PR build guard (new)
```

Angular project names: `learning-gallery` → **`portfolio`**, plus new **`ml-platform`**. Output: `dist/portfolio/browser`, `dist/ml-platform/browser`.

**Libs are source folders wired by `tsconfig` `paths`, not ng-packagr packages.** Rationale: they are internal-only (never published), and source imports give instant HMR through lib code and keep `ng build` a single-pass operation. Buildable ng-packagr libs would add a rebuild step between editing a widget and seeing it in either app. Revisit only if a lib is ever published.

---

## 2. Hard constraints

- **Never rename the GitHub repository.** `thalesmenegueco.github.io` only serves the user site at the domain root while the repo keeps that exact name. Directory renames are free; repo renames are not.
- **Two sites cannot be served from one GitHub Pages repo.** The portfolio keeps `gh-pages`; the platform must live on Vercel/Netlify (or a second repo). This is not a preference, it's a platform limit.
- **`localStorage` is origin-scoped.** Progress saved on `thalesmenegueco.github.io` is unreadable from a new domain. See R2 — this needs a deliberate answer, not a silent break.
- **Do not change existing storage keys** (`calculus-completed-lessons`, `calculus-practice-completed`, `calculus-process-completed`) during the refactor.

---

## 3. Phases

Each phase ends at a gate. Phases 1 and 2 are behaviour-preserving; 3–5 change product surface.

### Phase 0 — Baseline & hygiene

1. Branch `migration/monorepo` off `main`; confirm `git status` is clean.
2. **Resolve the lockfile ambiguity.** The repo currently carries both `package-lock.json` (npm) and `pnpm-lock.yaml`, while `.github/workflows/deploy.yml` runs `npm install` — so neither lockfile is actually enforced. Also `pnpm-workspace.yaml` is not a valid workspace manifest: it declares no `packages:` and its `allowBuilds` values are literal placeholders (`'set this to true or false'`).
   **Recommendation:** standardise on **npm** (CI already does), delete `pnpm-lock.yaml` and `pnpm-workspace.yaml`, and switch CI to `npm ci`. A single root `package.json` needs no pnpm workspace file at all.
3. Record the baseline: route inventory, the dist size table in §0, and whether the test suite is green.

```bash
npm ci
npx ng build --configuration production
npx ng test --watch=false --browsers=ChromeHeadless
```

Gate: build and tests pass; baseline sizes recorded. (`google-chrome` is present locally at `/usr/bin/google-chrome`; export `CHROME_BIN` if a sandbox/CI environment needs it.)

### Phase 1 — Workspace conversion (behaviour-preserving)

1. Move the app with history preserved:
   ```bash
   mkdir -p projects/portfolio
   git mv src projects/portfolio/src
   git mv tsconfig.app.json projects/portfolio/tsconfig.app.json
   git mv tsconfig.spec.json projects/portfolio/tsconfig.spec.json
   ```
   `src/404.html` travels with `src/`.
2. Rewrite `angular.json`: project key `learning-gallery` → `portfolio`; `root: "projects/portfolio"`; `sourceRoot: "projects/portfolio/src"`; `outputPath: "dist/portfolio"`; update the `assets` entry `src/404.html` → `projects/portfolio/src/404.html`, the `browser` entry, `styles`, and `tsConfig` paths for both `build` and `test` targets.
3. Update root `tsconfig.json` `references` to the new spec/app paths.
4. **Remove `rootDir` from both per-project tsconfigs.** They currently set `"rootDir": "./src"`, which will reject path-mapped files living under `libs/` once Phase 2 lands. `@angular/build` compiles with esbuild and does not need `rootDir` for emit; rely on `include` plus transitive inclusion of imported files.
5. Generate the second app skeleton (verify flags with `npx ng generate application --help` first, then accept generated defaults):
   ```bash
   npx ng generate application ml-platform --style=scss --routing \
     --project-root projects/ml-platform
   ```
   This adds the `ml-platform` entry to `angular.json` automatically.
6. Update `.github/workflows/deploy.yml` **in the same commit** as the project rename, since it hardcodes both the build and the publish path: `npm ci`, `npx ng build portfolio --configuration production --base-href /`, `publish_dir: ./dist/portfolio/browser`.

Gate (baseline recorded in [`migration-baseline.md`](./migration-baseline.md)):
- `npx ng build portfolio` — **content hashes identical to the baseline**. The build is byte-reproducible (verified in Phase 0), so an exact hash comparison is a stronger and cheaper check than a size comparison. Reference hashes: `main-CTXD2HQZ.js` 194,949 B, `chunk-POHH5IVY.js` 5,970,750 B, `worker-JBXFQEKZ.js` 6,026,498 B; initial payload 240,723 B.
- `npx ng build ml-platform` — empty shell builds.
- Push the branch and confirm the portfolio still deploys and serves at the existing URL. **Do not proceed until this is confirmed** — this is the one step that can silently break the live site.

### Phase 2 — Extract shared libs

Five extractions, all moves rather than rewrites except where noted.

1. **`libs/shared-plotting`** — from `calculus/components/plot-canvas/**`, `calculus/plotting.ts`, `calculus/calculus.palette.ts`.
   *Required change, not a plain move:* the extraction is where the two current identity leakages get fixed, or the platform inherits the portfolio's theme.
   - `plot-canvas.component.scss` hardcodes `border: 1px solid #263432` and `background: #0c1213`.
   - `calculus.palette.ts` hardcodes the full palette, and its own comment admits `calculus.component.scss` duplicates those values as CSS custom properties.
   Export `DEFAULT_PLOT_THEME` from the lib plus an optional theme input on `PlotCanvasComponent`, so the platform can restyle without forking. Collapse the acknowledged SCSS/TS duplication into that single source.
2. **`libs/shared-katex`** — from `calculus/components/katex/**` and `calculus/components/rich-math-text/**`.
   *Required change:* KaTeX's stylesheet is currently loaded globally from a CDN by `src/styles.scss` (`@import 'https://cdn.jsdelivr.net/npm/katex@0.18.4/dist/katex.min.css'`). A shared lib must not depend on the host app's global styles — import `katex/dist/katex.min.css` inside the lib's own component so it is self-contained (and drops the CDN dependency for both apps).
3. **`libs/shared-progress`** — replace three byte-identical services with one keyed store. Verified: `calculus/services/calculus-progress.service.ts`, `calculus-practice/services/calculus-practice-progress.service.ts` and `calculus-process-lab/services/process-progress.service.ts` differ **only** in the `STORAGE_KEY` constant. Expose `ProgressStore` with the key supplied by the caller, and keep the three keys byte-identical.
4. **`libs/shared-learning`** — `studies/study.types.ts` (`StudySubject`, `StudyModule`, `ModuleKind`, `ModuleStatus`) and the module-kind label map currently inlined in `studies.component.ts`. This is what makes the platform's four courses × two modules each a **data** problem rather than a routing problem.
   *Conditional:* only promote `explore-data/lessons/lesson.types.ts` and its pure validators into this lib if the ML courses will actually reuse the EDA lesson engine. If the ML courses get a new engine, define the shared lesson contract fresh and leave the EDA engine where it is — do not merge two engines speculatively.
5. Add `paths` to root `tsconfig.json`:
   ```jsonc
   "paths": {
     "@shared/plotting": ["libs/shared-plotting/index.ts"],
     "@shared/katex":    ["libs/shared-katex/index.ts"],
     "@shared/progress": ["libs/shared-progress/index.ts"],
     "@shared/learning": ["libs/shared-learning/index.ts"]
   }
   ```
   Each lib gets a barrel `index.ts`, and an optional `tsconfig.lib.json` for editor scoping.
6. Rewrite the ~20 import sites. The complete consumer set (verified by grep):
   - `PlotCanvasComponent`: average-slope-explorer, continuity-explorer, derivative-function-explorer, discontinuity-explorer, limit-explorer, tangent-line-explorer.
   - `plotting.ts` (`drawGrid`/`drawCurve`/`drawPoint`/`PlotSize`): the same six plus `calculus-practice/{visualizations.ts,problem-visualization.component.ts}` and `calculus-process-lab/{process-visualizations.ts,process-visualization.component.ts}`.
   - `KatexComponent`: formula-match, rule-playground, rich-math-text, `calculus-practice.component.ts`, `calculus-process-lab.component.ts`.
   - `RichMathTextComponent`: `calculus.component.ts`.

Gate: `npx ng build portfolio` and `npx ng test`; all three Cálculo routes render pixel-identically; the initial chunk is unchanged within noise. Leave selectors (`app-plot-canvas`, `app-katex`) as they are — renaming them is Phase 6 optional polish, not migration work.

> "Tests pass" means **190 passing / 2 known failures** throughout — see `migration-baseline.md` §4. The suite was never green; the two stale specs are not caused by, and not fixed by, this migration.

### Phase 3 — Build the ml-platform app

1. Move (not copy) the study surface into `projects/ml-platform/src/app/`: `studies/**`, `calculus/**`, `calculus-practice/**`, `calculus-process-lab/**`.
2. Give the app its own shell: `index.html` (own title/description/OG tags), `styles.scss` (own design tokens — do **not** import the portfolio's `--color-*` set; the doc's point is a different visual identity), nav/footer, `app.config.ts` with `provideRouter(routes)`.
3. Routing: a hub at `/` rendering `STUDY_SUBJECTS`, plus a generalised module route such as `/curso/:subjectId/:moduleKind/:moduleId` so four courses × two modules are data-driven. Keep the familiar Cálculo paths (`/calculo/teoria`, `/calculo/aplicada`, `/calculo/processo`) resolvable.
4. Expand `STUDY_SUBJECTS` from the single `calculo` subject to the four-course catalog. Keep unbuilt courses as `status: 'coming-soon'` so the hub can ship before all four exist — the type already models this.
5. Every module route must be `loadComponent`-lazy. This is the constraint that keeps TF.js/D3/Plotly out of the platform shell, and it is also what makes the future weights survivable.
6. Budgets, in `angular.json`:
   - `portfolio` — keep the existing strict `initial` 700 KB warn / 1 MB error. Its job is to stay light; let it fail the build if it stops being light.
   - `ml-platform` — `initial` warn 500 KB / error 1 MB, plus a `lazy` chunk budget. Heavy widgets are expected, so bound them rather than the total.
7. Progress: inject `ProgressStore` per module with the three existing keys; surface an aggregate progress read on the hub.

Gate: `ng build ml-platform` succeeds; the shell chunk contains no `katex`/`echarts`/`tfjs` marker (verify by grepping `dist/ml-platform/browser`); every route loads lazily.

### Phase 4 — Portfolio-side redirects and cross-links

1. Remove the moved routes from `projects/portfolio/src/app/app-routing.module.ts` (lines 28–32 today: `estudos`, the three `estudos/calculo/*` lazy routes, and the `tools/calculus` redirect).
2. **Keep `/estudos` as a thin landing page in the portfolio** that presents the platform and links out. It costs almost nothing, it is genuinely good portfolio content ("I built an interactive ML learning platform"), and it preserves the nav entry's meaning.
3. Add redirect stubs for the three old deep URLs → absolute platform URLs. GitHub Pages cannot issue real 301s, so use a component that calls `window.location.replace(...)`; the existing `404.html` SPA fallback keeps those paths resolving.
4. Cross-link: add a "Plataforma de ML interativa" card in `learning-gallery.component.ts` (the `interests: CardItem[]` array) pointing at the platform; add "feito por Thales Menegueço" in the platform footer pointing at the portfolio. Both apps already have the data shapes for this (`CardItem`).
5. Opportunistic cleanup while touching these files:
   - `src/app/app.module.ts` is dead — `main.ts` bootstraps via `bootstrapApplication(AppComponent, appConfig)` and never references the NgModule. Delete it.
   - `app-routing.module.ts` exports a plain `Routes` array, not a module. Rename to `app.routes.ts` and fix the two importers (`app.config.ts`, and the NgModule being deleted).

Gate: every old URL resolves to something sensible (real content or a redirect); no 404 regressions; portfolio initial chunk drops (Cálculo's KaTeX-bound chunks leave the app entirely).

### Phase 5 — Deploy split

1. **Portfolio** — `.github/workflows/deploy.yml` remains the only Pages workflow. Add `actions/setup-node` npm caching. Publish dir already updated in Phase 1.
2. **ml-platform** — connect the same repository to Vercel (or Netlify) with:
   - Build command: `npx ng build ml-platform --configuration production`
   - Output directory: `dist/ml-platform/browser`
   - SPA rewrite: all paths → `/index.html`
   - `base href="/"` (root of the custom domain)
   Both hosts support a monorepo "root directory" setting, so no repo split is needed.
3. **Domain** — set it on the platform only. The doc's `ml.thalesmenegueco.dev` is a good default; a short ownable name (`visualml.dev`, `seeml.dev`) is the alternative. The portfolio keeps `thalesmenegueco.github.io` untouched.
4. **PR build guard** — a new workflow that builds **both** apps on every pull request:
   ```bash
   npx ng build portfolio --configuration production
   npx ng build ml-platform --configuration production
   ```
   This is the one genuinely new CI cost of the monorepo, and it is what stops a `libs/` change from breaking the other app unnoticed. Given Phase 2 put both apps on shared source libs, skipping this would make the split dishonest.
5. **Cache headers** — set long-lived immutable caching on hashed `chunk-*`/`worker-*` assets at the edge. With 6 MB workers in the tree, this — not the bundle size — is where the Vercel-over-Pages argument actually pays off.

Gate: pushing to `main` deploys the portfolio to its existing URL; the platform deploys from the same repo at its own domain; a PR preview builds both apps green.

### Phase 6 — Cleanup (optional)

1. Remove dependencies from the root `package.json` that **neither** app imports after the split. With a single root manifest this is per-dependency work, not per-app — check both apps before removing.
2. If install weight becomes painful, revisit the deferred option: per-project `package.json` + pnpm workspace, so the portfolio's `node_modules` never contains TF.js/Plotly. Not needed for correctness.
3. Add unit tests for the newly shared code where they're cheap and valuable: `plotting.ts` scale/axis helpers, and `ProgressStore` (including the storage-unavailable path the old services already guarded).
4. Optional: unify lib component selector prefixes; move these planning docs out of `src/assets/other_files/` into a `docs/` folder. Note `src/assets` is **not** in `angular.json`'s `assets`, so these files are already not shipped — treat the folder as documentation, not web content.

---

## 4. Risk register

| # | Risk | Impact | Mitigation |
|---|---|---|---|
| R1 | Renaming the GitHub repo to match a new workspace name | Breaks the user site: `<user>.github.io` must keep that exact repo name | Only rename local directories. Never the remote repo. |
| R2 | `localStorage` is origin-scoped: a student's progress on `thalesmenegueco.github.io` is unreadable from the new domain | Silent loss of a student's saved work — directly contradicts the platform's reason to exist | Do not jump straight to redirects. Keep the old Cálculo routes serving in the portfolio through at least one release, then offer a one-time export (JSON via URL hash or copy-paste) before adding the redirect stub. Decide this deliberately. |
| R3 | Files moving outside `src/` collide with `rootDir: "./src"` in the per-project tsconfigs | Build/editor errors mid-Phase-2 | Handled in Phase 1 step 4 — drop `rootDir` before the libs exist. |
| R4 | Dual lockfiles (`package-lock.json` + `pnpm-lock.yaml`), invalid `pnpm-workspace.yaml`, CI using `npm install` instead of `npm ci` | Non-reproducible installs; a workspace file that breaks if pnpm is ever run | Phase 0: standardise on npm, delete the pnpm artefacts, switch CI to `npm ci`. |
| R5 | `cloudflare-worker/test-llms/` is a third deployable with its own `package.json`, outside the workspace and outside CI | Untracked deploy drift | Unchanged under the chosen scope (it serves a tool that stays in the portfolio), but flag it: it deserves its own workflow eventually. |
| R6 | The platform is where TF.js/D3/Plotly will land; without budgets the shell chunk creeps | The exact problem this migration exists to prevent, reintroduced in the new app | Per-app budgets in Phase 3 plus the bundle check in the Phase 5 PR workflow. |
| R7 | Karma needs a test target per app; the `@angular/build:karma` builder infers config implicitly today | Tests silently stop covering one app after the split | Confirm both `ng test portfolio` and `ng test ml-platform` targets exist and run in the Phase 5 workflow. Chrome is available locally at `/usr/bin/google-chrome`. |
| R8 | The doc's bundle rationale is stale (§0) | Risk of doing a large migration for a benefit already banked | Judge go/no-go on identity, independent deploys, and future weight — not on initial bundle size. |

---

## 5. Commit sequencing

One commit per step, each independently buildable:

1. `chore: standardise on npm, remove pnpm lockfile + invalid workspace file`
2. `refactor: move app to projects/portfolio, rename project to portfolio` (+ CI path updates, **one commit**)
3. `feat: add ml-platform app skeleton`
4. `refactor: extract libs/shared-plotting` (incl. theme decoupling)
5. `refactor: extract libs/shared-katex` (incl. self-contained CSS)
6. `refactor: extract libs/shared-progress, unify three duplicate services`
7. `refactor: extract libs/shared-learning`
8. `feat: move estudos surface into ml-platform`
9. `feat(ml-platform): four-course catalog, generalised module routing, budgets`
10. `feat: platform landing + redirect stubs + cross-links`
11. `chore: remove dead NgModule, rename app-routing.module.ts`
12. `ci: deploy ml-platform + PR build guard for both apps`

Commit 2 is the only one that touches the live deployment path. Verify the deployed site immediately after it, before continuing.

---

## 6. Explicitly out of scope

- Splitting into two repositories (the doc's monorepo choice is kept).
- Migrating Karma → Vitest (`@angular/build:unit-test` exists but nothing requires it).
- Rewriting `explore-data`'s lesson engine, or merging it with the ML lesson engine speculatively.
- Renaming the GitHub repository or moving the portfolio off GitHub Pages.
- The actual ML course content (the four courses, TF.js widgets, D3/Plotly visualisations) — this plan only builds the container they will live in.

---

## 7. Command reference

```bash
npm ci                                                        # install (single root manifest)
npx ng build portfolio --configuration production             # portfolio build
npx ng build ml-platform --configuration production           # platform build
npx ng serve portfolio --port 4200                            # portfolio dev server
npx ng serve ml-platform --port 4300                          # platform dev server (run side by side)
npx ng test portfolio --watch=false --browsers=ChromeHeadless
npx ng test ml-platform --watch=false --browsers=ChromeHeadless
```

Two dev servers on separate ports is the workflow this layout buys: change `libs/shared-plotting` and both apps hot-reload, because libs are source imports rather than built packages.
