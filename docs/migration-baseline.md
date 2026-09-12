# Migration Baseline — recorded before Phase 1

Companion to [`migration-implementation-plan.md`](./migration-implementation-plan.md).
Captured at the end of **Phase 0**, on branch `migration/monorepo`, from commit `a3b315a`.

This file is the reference the later phase gates compare against. If a number here
moves without a phase saying it should, something regressed.

---

## 1. Environment

| Tool | Version |
|---|---|
| Node | 22.22.0 |
| npm | 11.18.0 |
| Angular CLI | 20.3.15 |
| `@angular/core` / `@angular/build` | 20.1.0 |
| TypeScript | 5.8.3 |
| Chrome (headless, for Karma) | 151.0.0.0 at `/usr/bin/google-chrome` |

CI runs Node 24; local is Node 22. Worth aligning eventually — not a Phase 0 blocker.

---

## 2. Route inventory (16 entries: 13 component routes + 3 redirects)

Source: `src/app/app-routing.module.ts`.

| # | Path | Component | Loading |
|---|---|---|---|
| 1 | `project-gallery` | `LearningGalleryComponent` | **eager** |
| 2 | `tools` | `ProjectsComponent` | **eager** |
| 3 | `tools/precificacao-semijoias` | `PrecificacaoPageComponent` | **eager** |
| 4 | `tools/calcular-hipotenusa` | `SimpleMath` | **eager** |
| 5 | `tools/project-manager` | `ProjectManager` | **eager** |
| 6 | `tools/ocr` | `OcrComponent` | lazy |
| 7 | `tools/test-llms` | `TestLlms` | lazy |
| 8 | `tools/explore-data` | `ExploreData` | lazy |
| 9 | `tools/measure-it` | `MeasureIt` | lazy |
| 10 | `estudos` | `StudiesComponent` | **eager** |
| 11 | `estudos/calculo/teoria` | `CalculusComponent` | lazy |
| 12 | `estudos/calculo/aplicada` | `CalculusPracticeComponent` | lazy |
| 13 | `estudos/calculo/processo` | `CalculusProcessLabComponent` | lazy |
| — | `tools/calculus` | → `/estudos/calculo/teoria` | redirect |
| — | `''` | → `/project-gallery` | redirect |
| — | `**` | → `/project-gallery` | redirect |

**6 of 13 routes are eager**, including `estudos` and both `tools` hub pages. Rows 10–13 are the surface Phase 3 moves to `ml-platform`.

24 `*.spec.ts` files exist across the app.

---

## 3. Bundle baseline

`npx ng build --configuration production --base-href /` → `dist/learning-gallery/browser`, 16 MB total.

Library mapping below was **verified by grepping each emitted chunk** for library markers, not inferred from names.

| Asset | Size | Bytes | Contains |
|---|---|---|---|
| `worker-JBXFQEKZ.js` | 5.75 MB | 6,026,498 | web-llm (worker) |
| `chunk-POHH5IVY.js` | 5.69 MB | 5,970,750 | web-llm (main thread) |
| `chunk-YLHB66PS.js` | 1.12 MB | 1,174,789 | echarts |
| `worker-2ULGKPPQ.js` | 0.83 MB | 873,249 | transformers + onnxruntime |
| `chunk-VCZYEVXI.js` | 0.66 MB | 692,924 | echarts + xlsx |
| `chunk-EOMRYFDT.js` | 0.26 MB | 269,734 | katex |
| `main-CTXD2HQZ.js` | 0.19 MB | 194,949 | app shell |
| `chunk-Z4WU6HNH.js` | 0.14 MB | 151,017 | — |
| `chunk-HVZXHZ36.js` | 0.08 MB | 81,512 | katex |
| `chunk-YQIZLLSC.js` | 0.04 MB | 46,312 | — |
| `chunk-PWAJRG4E.js` | 0.04 MB | 43,449 | tesseract.js |
| `polyfills-B6TNHZQ6.js` | 0.03 MB | 34,579 | polyfills |
| `chunk-TUYF7SHR.js` | 0.03 MB | 33,508 | katex |
| `chunk-KIEJEPT7.js` | 0.03 MB | 30,249 | katex |
| `chunk-JLYPE4PS.js` | 0.02 MB | 23,019 | measure-it |
| `styles-MU42YPF5.css` | 11 KB | 11,195 | global styles |

**Initial payload = `main` + `polyfills` + `styles` = 240,723 B (~235 KB).**
Everything else is a lazy chunk: ~13.4 MB that a gallery visitor never downloads.

### Confirms §0 of the plan

- The recruiter-facing payload is already ~235 KB.
- All five heavy libraries (web-llm, transformers/onnxruntime, echarts, xlsx, tesseract) are already lazy-isolated.
- The bundle argument for the migration is indeed already banked; the migration's value is identity, independent deploy, and keeping *future* TF.js/D3/Plotly out.

### Reproducibility

The build is **byte-reproducible**: a fresh `npm ci` + rebuild produced content hashes identical to the pre-existing `dist/` (`main-CTXD2HQZ.js`, `chunk-POHH5IVY.js`, `worker-JBXFQEKZ.js` all unchanged).

**This upgrades the Phase 1 gate.** The plan said "same chunk inventory, sizes within noise"; the stronger and cheaper check is that the content hashes are *identical*. A hash change after a behaviour-preserving move is a real regression signal.

---

## 4. Test baseline — NOT GREEN (2 pre-existing failures)

`CHROME_BIN=/usr/bin/google-chrome npx ng test --watch=false --browsers=ChromeHeadless`

```
TOTAL: 2 FAILED, 190 SUCCESS   (192 specs)
```

Both failures are stale specs, present before any migration work, and both concern portfolio-only code:

| Spec | Error | Cause |
|---|---|---|
| `src/app/app.spec.ts:21` "App should render title" | `Expected undefined to contain 'Hello, learning-gallery'` | Leftover Angular scaffold test. It queries `h1` for `Hello, learning-gallery`; `app.component.html` renders a `<nav><h2>Thales Menegueço</h2>` and has never contained an `h1`. |
| `src/app/shared/sign-language-translation.spec.ts:20` "should create" | `NG0904: unsafe value used in a resource URL context` | The spec instantiates the component without its `linkForVideo` input, so `[src]` binds `undefined` through `ɵɵsanitizeResourceUrl`. |

**Consequence for phase gates:** from here on, "tests pass" means **190 passing / 2 known failures**, not zero failures. Both specs are in code that stays in the portfolio, so they are not resolved by the move — fix or delete them in Phase 4 cleanup.

---

## 5. Build warnings baseline

`ng build` exits 0 but emits six warnings. Recorded so Phase 3's stricter budgets don't get blamed for them.

**Component-style budget** (`anyComponentStyle`: warn 6 kB / error 12 kB) — four files already exceed the warning threshold:

| File | Size | Over by |
|---|---|---|
| `project-manager.scss` | 10.53 kB | 4.53 kB |
| `calculus.component.scss` | 8.78 kB | 2.78 kB |
| `calculus-process-lab.component.scss` | 8.44 kB | 2.44 kB |
| `calculus-practice.component.scss` | 7.75 kB | 1.75 kB |

Note the split: three of the four are **Cálculo** files that Phase 3 moves to `ml-platform`, so they stop warning in the portfolio build and start warning in the platform build. `project-manager.scss` stays.

**CommonJS optimization bailouts** (2):
- `tesseract.js` ← `ocr/services/ocr.service.ts` (stays in portfolio)
- `papaparse` ← `explore-data/ingestion/ingestion.service.ts` (stays in portfolio)

**KaTeX** is currently split across **four** chunks (`EOMRYFDT`, `HVZXHZ36`, `TUYF7SHR`, `KIEJEPT7` ≈ 0.40 MB combined), all serving only the Cálculo modules. Two consequences: Phase 3 removes ~0.40 MB from the portfolio build entirely, and `libs/shared-katex` is the natural place to consolidate the duplication.

---

## 6. Changes applied in Phase 0

| Change | File |
|---|---|
| Branched `migration/monorepo` off `main` | — |
| Removed pnpm lockfile (tracked) | `pnpm-lock.yaml` |
| Removed invalid pnpm workspace manifest (tracked) | `pnpm-workspace.yaml` |
| `npm install` → `npm ci` | `.github/workflows/deploy.yml` |
| Removed redundant global CLI install; build now uses the pinned devDependency | `.github/workflows/deploy.yml` |

### Why pnpm was dropped

`pnpm-workspace.yaml` was not a valid workspace manifest: it declared no `packages:` key and its `allowBuilds` values were the literal placeholder strings `'set this to true or false'`. It would have failed or silently done nothing. `package-lock.json` was in sync (`npm ci --dry-run` → "up to date") and CI already ran npm, so npm is the real package manager here. The single-root-`package.json` decision needs no pnpm workspace file at all.

### CI correctness fix

`deploy.yml` ran `ng build` on the assumption that a separate `npm install -g @angular/cli` step put `ng` on `PATH`. That global install is redundant — `@angular/cli` is a pinned devDependency — but removing it means `ng` is only in `node_modules/.bin`, which GitHub Actions does not add to `PATH` for later steps. The build step therefore had to become `npx ng build` in the same commit, or CI would break.

### Environment finding (not a repo issue)

`npm ci` fails with `EROFS` where the npm cache (`~/.npm/_cacache`) is not writable — it deletes `node_modules` *before* writing, so the failure leaves the tree with no dependencies. Workaround used here: `npm ci --cache /tmp/npm-cache-dsh`. GitHub-hosted runners have a writable cache, so **CI is unaffected**; this only matters for sandboxed or read-only-HOME environments.

---

## 7. Findings that adjust later phases

| # | Finding | Effect on the plan |
|---|---|---|
| F1 | `src/404.html` is **dead code**. It is the classic `spa-github-pages` stub (`sessionStorage.redirect = location.href` + meta refresh), but nothing in the app ever *reads* `sessionStorage.redirect`, and CI's `cp index.html 404.html` overwrites the emitted copy anyway. Two contradictory SPA-fallback strategies coexist; the CI one wins. | Phase 4 step 3 builds redirect stubs on top of this. Decide deliberately: either adopt the stub properly (read `sessionStorage.redirect` on boot) or drop the file and keep the CI `cp`. Do not leave both. |
| F2 | Build is byte-reproducible (identical hashes across clean installs). | Phase 1's gate becomes an **exact hash comparison** instead of a size comparison. Stronger and cheaper. |
| F3 | The suite is not green: 2 stale specs fail. | Every later gate compares against "190 / 2 known failures". Fix or delete both in Phase 4 cleanup. |
| F4 | 4 SCSS files already exceed the component-style budget warning. | Phase 3 app budgets must account for this; three of the four move to `ml-platform` with the Cálculo modules. |
| F5 | KaTeX is split across 4 chunks (~0.40 MB) only used by Cálculo. | Quantifies what Phase 3 removes from the portfolio; `libs/shared-katex` should consolidate the split. |
| F6 | 6 of 13 routes are eager, including `estudos`. | Phase 4's removal of rows 10–13 should measurably shrink `main`. Confirm against the 194,949 B baseline. |
| F7 | The `papaparse` and `tesseract.js` CommonJS bailouts are both in portfolio-only code. | Out of scope for this migration; recorded so they are not mistaken for regressions. |

---

## 8. Phase 0 gate result

| Gate criterion | Result |
|---|---|
| Branch created, tree clean | ✅ `migration/monorepo` off `main` |
| Lockfile standardised | ✅ npm; pnpm artifacts removed |
| CI uses the pinned toolchain | ✅ `npm ci` + `npx ng` |
| Fresh install reproduces the build | ✅ byte-identical output |
| Production build succeeds | ✅ exit 0, 6 known warnings |
| Tests pass | ⚠️ 190 pass / 2 **pre-existing** failures (recorded above, §4) |

**Cleared to proceed to Phase 1.** The one gate that is not fully green is the test suite, and it was never green — the two failures predate this work and are now documented instead of unknown.

---

## 9. Correction — the hash gate is unsound (found in Phase 2)

§3 claims the build is byte-reproducible, and §8 records Phase 1 passing an exact
hash comparison against the §3 reference hashes. **Both claims are wrong.** They
were discovered while setting up the Phase 2 baseline, and they matter because
Phases 2–5 were all scheduled to gate on hash identity.

### 9.1 What was measured

| Build | Source | `main` | Size |
|---|---|---|---|
| §3 reference | pre-migration, recorded in Phase 0 | `main-CTXD2HQZ.js` | 194,949 B |
| Rebuilt | pre-migration commit `a3b315a` | `main-JZCIFOK5.js` | 194,949 B |
| Rebuilt | Phase 1 tip `d184237` | `main-F322HZ5U.js` | 194,949 B |

Three different hashes, three identical sizes. The same pattern holds across the
chunk set: a fresh build of `a3b315a` produces `chunk-KHDGQ7EC.js` where §3 lists
`chunk-YQIZLLSC.js` for the same 46,312-byte asset — while a fresh Phase 1 build
*does* produce `chunk-YQIZLLSC.js`. **The §3 reference hashes cannot be
reproduced from any commit in this repository.**

Individual builds *are* internally reproducible: a cache-cleared rebuild of the
same tree reproduced all 23 assets byte-for-byte (checked with `md5sum`, not just
names). So this is not build flakiness. Hashes are simply not stable across
source-tree changes or build environments.

### 9.2 Why hashes move when code does not

Angular's `outputHashing: "all"` makes a chunk's bytes depend on the emitted
names of the chunks it imports. One real change therefore renames a cascade of
chunks, and every chunk referencing a renamed chunk changes too — **including
`main`**, whose size stays identical only because chunk names are fixed-width
(`chunk-XXXXXXXX.js` is always 8 hash characters). An exact hash comparison reads
that cascade as drift.

### 9.3 Phase 1 was nevertheless sound

Verified with `tools/bundle-diff.mjs`, which normalises every
`chunk-XXXXXXXX.js` / `worker-XXXXXXXX.js` reference to a placeholder before
comparing:

- 23 assets before and after; **only 2** differ once references are normalised.
- Both differences are pure minified-identifier renaming — `lb as o` becoming
  `lb as n`, with the matching usage sites renamed consistently. A mangler
  artifact of the module path change (`src/` → `projects/portfolio/src/`), not a
  code change.
- Every asset size identical, all 16 entries matching §3 exactly.
- **All 923 string literals identical** apart from chunk-name references, and the
  number multiset identical. (The one apparent extra `63` was the extraction
  regex reading the new `chunk-63C5T2LC` name.)
- `git diff a3b315a d184237` confirms **no application source file was modified**
  — only `angular.json`, the tsconfigs, CI, `.gitignore` and `vercel.json`.

**Conclusion: Phase 1 shipped no semantic change.** The live site serves the same
application. But the gate that was supposed to establish that was invalid, and it
passed for the wrong reason.

### 9.4 The gate to use instead

```bash
node tools/bundle-diff.mjs <baselineDir> dist/portfolio/browser
```

Expect drift only in chunks that actually contain the refactored code. Combine it
with the asset size table. **Do not gate on raw content hashes.**

---

## 10. Phase 2 gate result — four libs extracted

Branch `migration/monorepo`, commits `05bf585` … `0a42f10`.

| # | Lib | Commit |
|---|---|---|
| — | `tools/bundle-diff.mjs` (the gate itself) | `05bf585` |
| 1 | `libs/shared-plotting` (+ theme decoupling) | `3d64c46` |
| 2 | `libs/shared-katex` (CDN dropped) | `7410119` |
| 3 | `libs/shared-progress` (3 services → 1 store) | `34f5d07` |
| 4 | `libs/shared-learning` | `0a42f10` |

20 import sites rewritten, matching the plan's consumer list exactly.

**Baseline for the comparison** was rebuilt from `d184237` (the Phase 1 tip) into
`dist/baseline-pre-phase2`, which is gitignored; regenerate it with
`git stash`/checkout + `npx ng build portfolio --configuration production` if it
is missing.

### 10.1 Bundle outcome, cumulative across all four libs

| Measure | Before | After | Δ |
|---|---|---|---|
| JS/CSS assets | 23 | 23 | 0 |
| `main-*.js` | 194,949 B | 195,027 B | **+78 B** (+0.04%) |
| `styles-*.css` | 11,195 B | 36,619 B | +25,424 B (KaTeX, intended) |
| Total JS + CSS | 15,665,896 B | 15,691,581 B | +25,685 B (+0.16%) |
| Initial payload | 240,723 B | 266,147 B | +25,424 B (+10.6%) |
| Hashed KaTeX font files | 0 (CDN) | 60 (~1.2 MB, in `media/`) | +60 |
| Component-style warnings | 4 | 4 | unchanged to the byte |
| Tests | 2 F / 190 P | 2 F / 190 P | unchanged |

Drift is confined to the 4 lazy Cálculo chunks plus the stylesheet. No asset was
added or removed, no palette literal is duplicated more than before, and the
KaTeX CSS is not duplicated into any JS chunk.

The **+78 B on `main`** is the only unexpected number and it is explained:
`estudos` is an *eager* route (route inventory, §2 row 10), so the module-kind
label helper hoisted in §10 lib 4 lands in the initial chunk. A bounded diff of
the normalised `main` shows the sole difference is the import-alias list — one
extra binding plus the resulting minifier renaming.

The **+25,424 B on `styles`** is the one intentional behaviour change in Phase 2:
KaTeX's stylesheet and fonts are now bundled locally instead of fetched from
`cdn.jsdelivr.net`. See §10.3.

### 10.2 Behaviour-preservation evidence

- **Storage keys.** All three `localStorage` keys (`calculus-completed-lessons`,
  `calculus-practice-completed`, `calculus-process-completed`) occur exactly once
  in the emitted bundle before and after. No student's saved progress is
  orphaned. `localStorage` is origin-scoped, which is what the plan's risk R2 is
  about.
- **Palette CSS.** All **four** emitted `--color-*` token blocks are
  byte-identical to before, so collapsing five copies of the palette into one
  `_plot-tokens.scss` partial is pixel-neutral.
- **Canvas drawing.** `drawGrid` / `drawPoint` read `DEFAULT_PLOT_THEME`, whose
  values are the exact literals they previously hardcoded
  (`#0c1213`, `rgba(151, 166, 161, 0.12)`, `rgba(231, 236, 233, 0.5)`), and the
  statement order is unchanged. No palette literal is duplicated more than before
  (`rgba(151, 166, 161, 0.12)` and `rgba(231, 236, 233, 0.5)` still occur once;
  `#0c1213` still twice).
- **`PlotCanvasComponent`** now emits
  `border:1px solid var(--plot-border-color, #263432)` /
  `background:var(--plot-bg, #0c1213)` with host bindings supplying the defaults,
  so an unthemed use renders identically while a host app can restyle without
  forking.

### 10.3 The one intentional change: KaTeX's stylesheet

The plan specified importing `katex/dist/katex.min.css` inside the lib's own
component stylesheet. **That does not work**, verified by building it:

1. **Emulated encapsulation breaks it.** `katex.render()` builds its DOM
   imperatively, so those elements never get Angular's `_ngcontent-*` attribute,
   while Angular rewrote **427 KaTeX selectors** to `.katex[_ngcontent-xyz]`.
   Maths would have rendered unstyled with fallback fonts — a silent regression,
   not a build error.
2. **It blows the component-style budget.** Inlining produced a **25.5 kB**
   component style against a 12 kB error limit, failing the build.

KaTeX's CSS must therefore stay **global** — it styles DOM the lib does not own.
The CDN dependency was still removed by seeding
`node_modules/katex/dist/katex.min.css` into each app's `angular.json` `styles`
array, after the app's own `styles.scss`. Verified: 0 scoped KaTeX selectors, both
`body` rules preserved, no `cdn.jsdelivr` reference left, and every font URL
rewritten to a hashed `./media/KaTeX_*` asset.

The cost is +25,424 B on the initial stylesheet, replacing a render-blocking
third-party request. It is **transient**: Phase 4 removes Cálculo from the
portfolio entirely, at which point the style entry belongs to `ml-platform`.

### 10.4 Phase 2 gate result

| Gate criterion | Result |
|---|---|
| `npx ng build portfolio --configuration production` | ✅ exit 0 |
| `npx ng build ml-platform` | ✅ exit 0 (9.3 s) |
| Asset inventory unchanged | ✅ 23 JS/CSS assets before and after |
| Drift confined to refactored code | ✅ 4 lazy Cálculo chunks + the stylesheet |
| Initial chunk | ⚠️ +78 B, explained in §10.1 (`estudos` is eager) |
| Palette/CSS pixel-neutral | ✅ four token blocks byte-identical |
| Storage keys preserved | ✅ all three, byte-identical |
| Component-style warnings | ✅ the same 4, unchanged to the byte |
| Tests | ⚠️ **2 FAILED, 190 SUCCESS** — the documented baseline, same two specs |
| Cálculo routes render identically | ✅ **Confirmed by hand** — see below |

**The browser check was completed by hand.** No browser-automation harness is
available in this environment, so the check could not be automated; the author
served the app (`npx ng serve portfolio`) and confirms that the three Cálculo
pages (`/estudos/calculo/teoria`, `/aplicada`, `/processo`) render normally with
their styling intact. That closes the gate.

The automated evidence stands alongside it: byte-identical component CSS,
byte-identical palette token blocks, identical canvas drawing constants in
identical statement order, and a bundle whose only real drift is in the chunks
that were deliberately refactored.

**Phase 2 complete and cleared.** Phase 3 prerequisites are listed in
[`migration-implementation-plan.md`](./migration-implementation-plan.md) § Phase 3.
