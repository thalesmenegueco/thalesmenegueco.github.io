import type { LessonRuntime } from '../runtime/lesson-runtime.types';
import { LESSON_BINDINGS } from '../runtime/lesson-bindings.generated';

/**
 * The **runtime** of `fundamentos-teoria-01` — authored, not generated.
 *
 * This file is the second pass of shape (b): it says how the student advances and which
 * alternatives the formula step offers, and it is the only part of the pilot that is *not*
 * derived from `content-source/mml/02-linear-algebra.md`. The content file stays exactly what
 * the author audited; nothing here changes a word of it.
 *
 * ## The three checks, and why these
 *
 * Each one encodes the manifest's `completionCriterion` — which until now was a required field
 * nothing observed, since the student could click through the lesson and mark it done:
 *
 *   1. `reached` — "o aluno monta um vetor alvo usando combinação linear **e o sistema confirma
 *      que v = Σ cᵢbᵢ**". The widget already computed `confirmed` (distance to the target
 *      within tolerance); the check just asks for it.
 *   2. `lambda` in `[-3, -0.5]` — step 2's own prompt tells the student to take λ to zero and
 *      then negative and watch the movement reverse. The check is a proxy for having done that
 *      walk, and it is a proxy by construction: "did you explore" is not a fact the widget can
 *      report, only "is this control here now".
 *   3. The formula choice — the arc's climax. Cálculo gates the equivalent step with
 *      `formulaMatch`, and `CAMADA3.md` recorded that the ML contract had no such thing. It
 *      does now, and it lives here rather than in the generated content because a distractor
 *      is *deliberately wrong* mathematics.
 *
 * ## Why every option is a real formula from §2.4/§2.5
 *
 * The pipeline's hardest rule is that no invented formula reaches a lesson — the gate even
 * refuses a rewritten `keyFormula`. So the distractors are not fabricated wrong answers: they
 * are the two **sibling formulas the lesson teaches the student to separate**, quoted literally
 * from the same two sections. The wrong choices are wrong *questions answered*, not wrong
 * mathematics, which is both safer to write and better to learn from: the option that says
 * `λx = (λx₁, …, λxₙ)ᵀ` is exactly the confusion step 2 and step 3 spent a paragraph each
 * dismantling.
 */
export const FUNDAMENTOS_TEORIA_01_RUNTIME: LessonRuntime = {
  lessonId: 'fundamentos-teoria-01',

  // `widget`, `widgetConfig` and `numericExample.inputs` of the manifest, through the generated
  // fixture — so `target` below is the lesson's own `(2, 3)` by contract, not by hand.
  widget: LESSON_BINDINGS['fundamentos-teoria-01'],

  steps: [
    {
      contentStepId: 'passo-1',
      validation: { type: 'equals', field: 'reached', value: true },
      hint: 'Ajuste c₁ e c₂ até o vetor v cair sobre o alvo marcado no plano.',
    },

    {
      contentStepId: 'passo-2',
      validation: { type: 'within', field: 'lambda', range: [-3, -0.5] },
      hint:
        'Leve λ para um valor negativo e observe: o movimento v inverte de sentido, e ' +
        'continua na mesma reta que passa pela origem.',
    },

    {
      contentStepId: 'passo-3',
      validation: { type: 'formula', correctAnswer: 'a' },
      optionsPrompt:
        'Qual das três fórmulas é a que você acabou de usar para chegar à posição do robô?',
      hint: 'Escolha a fórmula que descreve o que você montou, não a que descreve outra operação.',
      options: [
        {
          id: 'a',
          // Literal de §2.5(a) — e a primeira `keyFormula` do manifesto.
          latex: String.raw`\boldsymbol{v} = \sum_{i=1}^k \lambda_i \boldsymbol{x}_i`,
          feedback:
            'Correto. Foi isso que você fez: um coeficiente para cada direção, os produtos ' +
            'somados. Com as duas direções do robô, 2·(1, 0) + 3·(0, 1) = (2, 3).',
        },
        {
          id: 'b',
          // Literal de §2.4(e) — a regra do escalar, que o passo 2 acabou de contrastar.
          latex: String.raw`\lambda \boldsymbol{x} = (\lambda x_1, \dots, \lambda x_n)^\top`,
          feedback:
            'Essa é a regra do **escalar**: *um* número só, aplicado a *todas* as coordenadas ' +
            'de um mesmo vetor. A combinação linear usa um número diferente para cada vetor ' +
            'antes de somar — é essa diferença que a fórmula da alternativa anterior escreve.',
        },
        {
          id: 'c',
          // Literal de §2.5(e) — o teste de independência linear, o outro vizinho da ideia.
          latex: String.raw`\sum_{i=1}^k \lambda_i \boldsymbol{x}_i = \mathbf{0} \iff \lambda_1 = \dots = \lambda_k = 0`,
          feedback:
            'Essa equação é o **teste de independência linear**: ela pergunta quando uma ' +
            'combinação dá zero. É uma pergunta sobre os vetores, não o nome do que você ' +
            'construiu para chegar a uma posição.',
        },
      ],
    },
  ],
};
