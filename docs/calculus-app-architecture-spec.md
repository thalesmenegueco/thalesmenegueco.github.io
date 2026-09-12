# Calculus I Learning App — Architecture & Build Spec

## Core idea
Reuse the lesson-engine pattern from the EDA app (JSON-defined lessons, step
validation, guided discovery) but swap the domain: instead of exploring a
user's dataset, the user explores **functions** — dragging points, adjusting
sliders on formula parameters, and watching the formula's meaning change
visually before ever being asked to "know" it.

Your instinct — "show how changing variables affects the formula, then use
that to solve a practical problem" — is exactly how derivative/integral
intuition should be taught (this mirrors how 3Blue1Brown / Desmos-style
tools work). The architecture below is built around that.

---

## Libraries

| Need | Library | Why |
|---|---|---|
| Function plotting (2D) | **function-plot** (built on D3) | Purpose-built for `y = f(x)` graphs — plots multiple functions overlaid (e.g. f(x) and f'(x)), supports annotations, lightweight (~50kb) |
| Math expression parsing + numeric eval | **math.js** | Safely parse a user- or lesson-defined expression string (`"x^2 - 3*x"`) into a callable function; handles derivatives numerically too |
| Symbolic differentiation (optional but valuable) | **nerdamer** (with the Calculus add-on) | Actual symbolic diff/integration — lets you show the *formula* for f'(x), not just numeric slope, which matters for teaching |
| Formula rendering (LaTeX) | **KaTeX** | Much faster render than MathJax, good enough LaTeX coverage for Calc I; render `\frac{d}{dx}` notation properly instead of plain text |
| Sliders / interactive controls | Angular Material slider, bound to signals | No extra library needed |
| 3D (optional, later) | **Plotly.js** | Only if you extend toward multivariable calc later; skip for Calc I v1 |

Avoid Desmos's API — it's proprietary/licensed and not meant for embedding
a full third-party learning product; function-plot + math.js gives you
equivalent capability under your control.

---

## New interactive widgets (the core novel work vs. the EDA app)

These are the components the whole app is built around — build these first,
lessons plug into them.

### 1. `FunctionPlotter`
Generic component: given an expression string + domain, renders the curve.
Supports plotting multiple functions at once (e.g. f(x) in blue, f'(x) in
red) so lessons can show a function and its derivative side by side.

```ts
interface FunctionPlotterConfig {
  functions: { expression: string; color: string; label: string }[];
  domain: [number, number];
  range?: [number, number];
  annotations?: PlotAnnotation[]; // points, tangent lines, shaded regions
}
```

### 2. `TangentLineExplorer`
The core "derivative intuition" widget. User drags a point along f(x); the
tangent line at that point updates live, and its slope (= f'(x) at that
point) is displayed numerically and, optionally, symbolically via nerdamer.

Bonus mode: animate the **secant line approaching the tangent** as h → 0 —
this directly visualizes the limit definition of the derivative
(the actual formula, not just the result), which is the concept students
usually memorize without ever seeing.

### 3. `RiemannSumVisualizer`
User adjusts `n` (number of rectangles) with a slider under a curve; the
rectangles redraw live and the running sum is shown, converging visually
toward the definite integral as n grows. Toggle between left/right/midpoint
sums to show why the choice matters (and stops mattering as n → ∞).

### 4. `LimitExplorer`
A table of x-values approaching a target point from both sides, paired with
a graph that zooms in near that point. Makes "limit" concrete as a pattern
in a table before it's stated as notation.

### 5. `ParameterSliderPlayground`
Generic, reused across many lessons: given `f(x; a, b, c, ...)`, render
sliders for each parameter, live-update the plot. This is your "show how
the formula changes the graph" mechanism — e.g. sliders for a, b, c in
`a*x^2 + b*x + c` show how each term reshapes a parabola.

### 6. `OptimizationVisualizer`
For applied problems (e.g. "minimize the material for a box of fixed
volume"): plots the objective function, highlights the critical point where
f'(x) = 0, and ties it back to the physical picture (a diagram of the box)
so the abstract max/min connects to the concrete problem.

---

## Lesson engine — what's reused vs. extended

**Reused as-is from the EDA app:**
- `Lesson`, `LessonStep`, `LessonProgress` types
- JSON-as-data lesson definitions
- Step sequencing, hints, explanations, summary pattern

**New step `action` types to add:**
- `sliderManipulation` — validate that user moved a parameter into a target range (e.g. "make the parabola open downward")
- `tangentPointSelection` — validate the user dragged the tangent point near a target x-value
- `riemannSumAdjustment` — validate n reached a threshold, or the sum is within tolerance of the true integral
- `limitTableCompletion` — validate the user correctly read/predicted the limiting value from the table
- `formulaMatch` — user picks which formula (from options, via KaTeX-rendered choices) matches what they just saw graphically

The validation logic stays in the same place architecturally (pure
functions checking app state against a target), just with new detectors
for these math-specific interactions instead of dataset-based ones.

---

## Suggested folder structure

```
src/app/
  core/
    models/           # Function, Lesson, LessonStep types (extends EDA pattern)
    math/
      expression-evaluator.service.ts   # math.js wrapper
      symbolic-math.service.ts          # nerdamer wrapper (derivative/integral formulas)
  widgets/
    function-plotter/
    tangent-line-explorer/
    riemann-sum-visualizer/
    limit-explorer/
    parameter-slider-playground/
    optimization-visualizer/
  lessons/
    lesson-list/
    lesson-player/
    lesson-data/       # JSON lesson definitions
  shared/
    katex-renderer/    # wraps KaTeX for inline formula display
```

---

## Lesson roadmap (Calculus I)

### Unit 1 — Limits & Continuity (foundation)
1. **What Is a Limit?** — `LimitExplorer`, approach a point from both sides via a table + zooming graph
2. **When Limits Don't Exist** — jump discontinuities, vertical asymptotes, visually and via the table
3. **Continuity** — connect limit existing + matching function value; visualize a "broken" graph vs. a smooth one

### Unit 2 — The Derivative (core concept)
4. **Slope of a Curve: The Problem** — motivate via "average speed vs. speed *right now*" (practical framing)
5. **From Secant to Tangent** — `TangentLineExplorer` in secant-animation mode: show the limit definition of the derivative *as a picture*, not a formula first
6. **The Derivative as a Function** — `FunctionPlotter` showing f(x) and f'(x) together; drag the point on f(x), watch f'(x) trace out
7. **Power Rule, Product Rule, Chain Rule** — `ParameterSliderPlayground` per rule: e.g. for product rule, show f(x)·g(x) and how the derivative formula emerges from both curves' local behavior, not just algebra

### Unit 3 — Applications of the Derivative (practical problems — your emphasis)
8. **Related Rates** — classic ladder-sliding-down-a-wall problem, animated, with sliders for time; connect the rates via the diagram, not just the equation
9. **Optimization** — `OptimizationVisualizer`: box/fence/cost minimization problems, drag toward the critical point, see the objective function's minimum visually before naming it "where f'(x) = 0"
10. **Curve Sketching** — use f' and f'' sign changes to predict shape, then reveal the actual curve to confirm

### Unit 4 — The Integral
11. **Area Under a Curve: The Problem** — motivate via "distance from a velocity graph" (ties directly back to Unit 2's derivative-as-rate framing)
12. **Riemann Sums** — `RiemannSumVisualizer`, converge n → ∞ interactively
13. **The Fundamental Theorem of Calculus** — show antiderivative + Riemann sum converging to the same value, connecting the two halves of the course visually
14. **Applications: Area Between Curves, Average Value** — practical framing again (e.g. average temperature over a day from a temperature function)

Each unit's last lesson should loop back to an earlier widget so concepts
compound rather than reset — e.g. Lesson 13 reuses both
`RiemannSumVisualizer` and a symbolic antiderivative side-by-side.

---

## Example lesson JSON (Lesson 5 — From Secant to Tangent)

```json
{
  "id": "secant-to-tangent",
  "title": "From Secant to Tangent",
  "description": "See where the derivative formula actually comes from — by watching a line get closer and closer to a curve.",
  "unit": "derivative-core",
  "estimatedTime": "8 min",
  "objectives": [
    "Understand a secant line as an average rate of change",
    "See the tangent line emerge as h approaches 0",
    "Connect this picture to the limit definition of the derivative"
  ],
  "targetFunction": "x^2",
  "steps": [
    {
      "id": "step-1",
      "title": "Two Points, One Line",
      "instruction": "Drag point B closer to point A. Watch the line connecting them — this is called a secant line.",
      "widget": "tangentLineExplorer",
      "widgetConfig": { "mode": "secant", "fixedPointX": 2, "function": "x^2" },
      "validation": {
        "type": "sliderManipulation",
        "targetParam": "h",
        "targetRange": [0.05, 0.2]
      },
      "explanation": "The secant line's slope is the AVERAGE rate of change between A and B: (f(B) - f(A)) / (B - A). As B gets closer to A, this average gets closer to something specific."
    },
    {
      "id": "step-2",
      "title": "What Happens as h → 0?",
      "instruction": "Keep dragging B even closer to A. What does the slope value approach?",
      "widget": "tangentLineExplorer",
      "widgetConfig": { "mode": "secant", "fixedPointX": 2, "function": "x^2" },
      "validation": {
        "type": "sliderManipulation",
        "targetParam": "h",
        "targetRange": [0.001, 0.01]
      },
      "explanation": "As h shrinks toward 0, the secant line becomes indistinguishable from the TANGENT line — the line that just touches the curve at one point. Its slope is the derivative at that point."
    },
    {
      "id": "step-3",
      "title": "Name the Formula",
      "instruction": "You just watched (f(a+h) - f(a)) / h as h → 0. This IS the definition of the derivative. Which formula matches what you saw?",
      "action": "formulaMatch",
      "validation": {
        "type": "formulaMatch",
        "correctAnswer": "a"
      },
      "options": [
        { "id": "a", "latex": "f'(a) = \\lim_{h \\to 0} \\frac{f(a+h) - f(a)}{h}", "feedback": "Exactly — this is what you just watched happen visually." },
        { "id": "b", "latex": "f'(a) = f(a) \\cdot h", "feedback": "Not quite — think about what you were dividing, not multiplying." }
      ],
      "explanation": "Now the formula isn't abstract — it's a description of exactly what you just saw: a secant line's slope, as the gap shrinks to nothing."
    }
  ],
  "summary": {
    "title": "What You Learned",
    "content": "The derivative formula isn't arbitrary — it's the slope of a secant line, taken to its limit as the two points merge into one. This is why derivatives measure instantaneous rate of change.",
    "keyTakeaway": "Every derivative rule you'll learn next (power rule, product rule, chain rule) is just a shortcut for this same limit — computed once and for all for a whole family of functions."
  }
}
```

---

## Checklist for DeepSeek

> **Build the following for a Calculus I learning app (Angular, reusing the
> lesson-engine architecture from the EDA app):**
>
> 1. **Math core services** (`core/math/`):
>    - `expression-evaluator.service.ts` — wraps math.js to safely parse and
>      numerically evaluate expression strings like `"x^2 - 3*x"`
>    - `symbolic-math.service.ts` — wraps nerdamer to compute symbolic
>      derivatives/integrals for display (not just numeric values)
>
> 2. **Widget components** (`widgets/`), each a standalone Angular
>    component with clear @Input() config and signal-based internal state:
>    - `FunctionPlotter` — wraps function-plot, supports multiple overlaid
>      functions + annotations (points, tangent lines, shaded regions)
>    - `TangentLineExplorer` — draggable point on a curve; secant-to-tangent
>      animation mode; displays numeric AND symbolic slope
>    - `RiemannSumVisualizer` — adjustable n, left/right/midpoint toggle,
>      running sum display, convergence toward true integral value
>    - `LimitExplorer` — table of approaching x-values + zooming graph
>    - `ParameterSliderPlayground` — generic sliders bound to named
>      parameters in an expression string, live-replots on change
>    - `OptimizationVisualizer` — objective function plot + critical point
>      highlight + a simple diagram tying it to the physical problem
>
> 3. **Lesson engine extension**: extend the existing `LessonStep`
>    `action`/`validation` types with `sliderManipulation`,
>    `tangentPointSelection`, `riemannSumAdjustment`,
>    `limitTableCompletion`, `formulaMatch` — validators are pure functions
>    checking widget state against a target, same pattern as the EDA app's
>    chart-type/field validators.
>
> 4. **KaTeX integration**: a shared `katex-renderer` component that takes
>    a LaTeX string and renders it — used for formula display in lesson
>    steps and `formulaMatch` options.
>
> 5. **Lesson content**: implement Unit 1 (Limits) and Unit 2 (Derivative
>    core) first — 7 lessons — using the JSON schema above as the pattern.
>    Each lesson should motivate the *problem* before showing the formula,
>    per the pedagogical goal: understanding over memorization.
>
> **Do NOT** build a general-purpose CAS or symbolic solver — nerdamer
> covers the Calc I derivative/integral needs; don't reinvent it.
