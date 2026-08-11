# Simple Math Component — Implementation Plan

## Goal
Implement logic, template, and styles for the `SimpleMath` component (right triangle Pythagorean theorem calculator), with tab-based architecture extensible for future calculators. Icons via Unicode emoji, labels in pt-BR, dark-theme design matching site standards.

## Site Conventions (from codebase)
- **Theme**: Dark — `--color-bg: rgb(5,5,5)`, `--color-surface: rgb(75,71,71)`, `--color-nav-bg: #333`, `--color-text: whitesmoke`, `--color-text-accent: #ffa300`, `--color-text-secondary: #ec0dcf`, `--color-border: white`
- **Shapes**: `--radius-card: 40px`, `--shadow-card-hover: 14px 14px`
- **Font**: Roboto (Google Fonts, imported in `styles.scss`)
- **Framework**: Angular 20 standalone components, template-driven forms (`ngModel` from `@angular/forms`)

---

## Tasks

### 1. TypeScript Logic (`simple-math.ts`)

**Imports**: `FormsModule` (for `ngModel`)

**Interfaces/types**:
```ts
interface CalculatorTab { id: string; label: string; icon: string; }
type TriangleMode = 'hypotenuse' | 'leg';
```

**State**:
- `tabs: CalculatorTab[]` — single entry for v1: `{ id: 'right-triangle', label: 'Triângulo Retângulo', icon: '📐' }`
- `activeTabId = 'right-triangle'` — bound to tab buttons
- `switchTab(id)` method
- Triangle state: `mode: TriangleMode = 'hypotenuse'`, `legA`, `legB`, `leg`, `hypotenuse` (number inputs), `result: number | null`, `errorMessage: string | null`

**Methods**:
- `setMode(mode: TriangleMode)` — switches mode, clears result/error
- `calculate()`:
  1. Clear previous result/error
  2. Parse inputs to numbers, validate (positive, non-zero; for leg mode: leg < hypotenuse)
  3. Hypotenuse: `Math.sqrt(legA² + legB²)` → round to 4 decimal places
  4. Leg: `Math.sqrt(hypotenuse² - leg²)` → round to 4 decimal places
  5. Set `result` or `errorMessage` accordingly
- `onInputChange()` — clears result/error on any input change (bound via `(input)` or `(ngModelChange)`)

**Edge cases handled**:
- Empty/NaN inputs → "Preencha todos os campos."
- Zero or negative values → "Os valores devem ser maiores que zero."
- Leg ≥ hypotenuse (leg mode) → "O cateto deve ser menor que a hipotenusa."
- Infinity (overflow) → "Valor muito grande."

---

### 2. Template (`simple-math.html`)

**Structure**:
```
.simple-math-container
  .tab-bar
    button.tab-button (× tabs, active state on activeTabId)
  .calculator-area
    @if activeTabId === 'right-triangle'
      .calculator-card
        h2 "Calcular Triângulo Retângulo"
        .mode-toggle (two buttons: Encontrar Hipotenusa / Encontrar Cateto)
        form (ngSubmit → calculate())
          @if mode === 'hypotenuse'
            label + .input-group(icon 📏 + input legA)
            label + .input-group(icon 📏 + input legB)
          @if mode === 'leg'
            label + .input-group(icon 📏 + input leg)
            label + .input-group(icon 📐 + input hypotenuse)
          button[type=submit] "Calcular"
        .result (ngIf result !== null)
        .error (ngIf errorMessage !== null)
    @else (placeholder for future tabs)
```

**Icon pattern per input**:
```html
<label for="legA">Cateto A:</label>
<div class="input-group">
  <span class="input-icon">📏</span>
  <input type="number" id="legA" [(ngModel)]="legA" name="legA" (input)="onInputChange()" min="0.0001" step="any" required>
</div>
```

---

### 3. Styles (`simple-math.scss`)

**Tab bar**: `--color-nav-bg` background, `border-radius: 20px`, flex row, gap. Tab buttons: transparent bg, `--color-text`, padding, border-radius, cursor pointer. Active tab: `--color-text-accent` color, bold, subtle bottom border.

**Calculator card**: `--color-surface` background, `border: 4px solid var(--color-border)`, `border-radius: var(--radius-card)`, padding 30px, max-width 500px, centered.

**Mode toggle**: flex row of two pill buttons. Inactive: `--color-surface` bg, `--color-text` text, thin border. Active: `--color-text-accent` bg, dark text. Rounded corners, smooth transition. Connected look (no gap between buttons).

**Input groups**: flex row, `background: rgba(255,255,255,0.08)`, `border: 1px solid rgba(255,255,255,0.2)`, `border-radius: 10px`, focus-within border → `--color-text-accent`. Icon span: 1.2rem, margin-right 10px, no-select. Input: transparent bg, no border, no outline, flex:1, color: `--color-text`, padding: 12px 0, Roboto 1rem.

**Labels**: block, margin-bottom 6px, `--color-text`, font-weight 500.

**Submit button**: full width, `--color-text-secondary` bg, dark text (#111), bold, padding 12px, border-radius 10px, cursor pointer, hover lighten. Transition on background.

**Result**: margin-top 16px, padding 16px, `border-left: 4px solid var(--color-text-secondary)`, bg `rgba(236,13,207,0.1)`. "Resultado:" label + numeric value in white, large font.

**Error**: margin-top 16px, `color: #ff6b6b`, with ⚠️ prefix. Padding, rounded border.

**Responsive**: max-width 500px with auto margins. On narrow screens (< 480px): full width, reduced padding.

---

### 4. Route Registration (`app-routing.module.ts`)

- Import `SimpleMath` from `./projects/componentized-projects/simple-math/simple-math`
- Add route: `{ path: 'tools/calcular-hipotenusa', component: SimpleMath }`
- (The existing card link in `projects.ts` already points to `./tools/calcular-hipotenusa`)

---

### 5. Unit Tests (`simple-math.spec.ts`)

Replace the existing placeholder test with:
1. **Creation**: component should create
2. **Tab switching**: `switchTab` updates `activeTabId`
3. **Mode toggling**: `setMode('leg')` changes `mode` and clears result/error
4. **Hypotenuse calc**: legA=3, legB=4 → result=5
5. **Leg calc**: leg=3, hypotenuse=5 → result=4
6. **Validation — empty**: empty inputs → error message
7. **Validation — negative**: negative input → error message
8. **Validation — leg ≥ hypotenuse**: leg=5, hypotenuse=4 → error message
9. **Input change clears result**: set result, call `onInputChange` → result null, error null

---

## Files Changed
- `src/app/projects/componentized-projects/simple-math/simple-math.ts` — full rewrite
- `src/app/projects/componentized-projects/simple-math/simple-math.html` — full rewrite
- `src/app/projects/componentized-projects/simple-math/simple-math.scss` — full write
- `src/app/projects/componentized-projects/simple-math/simple-math.spec.ts` — rewrite tests
- `src/app/app-routing.module.ts` — add import + route

## Validation
- `npm run test` — all 9 tests pass
- `npm run build` — production build succeeds
- Visual: the page renders at `/tools/calcular-hipotenusa`, matches dark theme, inputs visible, tab bar shows, toggle works, calculations produce correct results
