import type { LessonContent } from '@ml/engine';

/**
 * `fundamentos-teoria-01` — **generated content** (Camada 3), revision 2.
 *
 * Produced from `manifests/fundamentos-teoria-01.json` and the two sections it cites
 * in `content-source/mml/02-linear-algebra.md` (§2.4 and §2.5), by the prompt in
 * `content-source/prompts/fundamentos-teoria-01.md`. It is a *derivative*: the manifest
 * is the contract, `content-source/` is the truth, and this file is neither.
 *
 * The arc is Cálculo's — explore, observe, and name the formula only at the end:
 *
 *   1. Dois números, uma posição      — a position is an ordered pair (no formula)
 *   2. Somar e esticar                — closure under + and · (no formula)
 *   3. A fórmula da combinação linear — the three `keyFormulas` of the manifest
 *
 * Steps 1 and 2 carry `katex: []` deliberately. The contract says `katex` holds formulas
 * **copied literally from the cited source**, and the source's formulas are the general
 * ones; putting them in an exploratory step would name the rule before the student finds
 * it. Numeric instances live in the `narrative` as prose for the same reason.
 *
 * **What revision 2 changed, and why.** A first read-through by the author found step 2
 * failing in two ways, both real:
 *
 *   - the widget showed the *opposite* of the step's claim. Its view was fixed at ±5 units,
 *     so pushing `λ` sent `λv` off the frame while the text said these operations never
 *     leave the plane. The widget now derives its scale from the outermost point and prints
 *     the window size, and the narrative says out loud that the frame is a window, not the
 *     space — the plane has no edge;
 *   - the step never named the **escalar**, and never separated it from the combination.
 *     The reader only saw the distinction at step 3. Step 2 now names the term with the
 *     robot's own numbers (`2·(1,0) = (2,0)`), and step 3 draws the contrast explicitly:
 *     a scalar is *one* number applied to *every* coordinate; a combination is a
 *     *different* number for *each* vector.
 *
 * Known contract limits, recorded rather than worked around: there is no `scenario` field,
 * so the opening scenario rides in the first `narrative` block; and there is no per-step
 * widget configuration, so the widget exposes all three operations of the manifest's
 * `widgetConfig.availableOps` at once and each step's `prompt` directs the student to a
 * different group. See `../README.md`.
 */
export const FUNDAMENTOS_TEORIA_01: LessonContent = {
  lessonId: 'fundamentos-teoria-01',
  title: 'Vetores: a matéria-prima dos dados',
  objective:
    'Ao fim desta lição você escreve uma posição como par ordenado de números, reconhece que somar e multiplicar por escalar não saem do plano, e descreve qualquer ponto como combinação linear de duas direções de base.',

  steps: [
    {
      id: 'passo-1',
      title: 'Dois números, uma posição',
      narrative: [
        'Um robô de limpeza se move num piso quadriculado e só entende duas coisas: dar um passo para o leste, que muda a posição em (1, 0), ou um passo para o norte, que muda a posição em (0, 1). Há uma mancha de sujeira na posição (2, 3) e o robô está parado na origem. Quantos passos em cada direção ele precisa dar? [MML §2.4]',
        'Antes de responder, repare no que está sendo anotado. A posição do robô é apenas um par ordenado de números: a primeira coordenada diz quanto ele andou para o leste, a segunda quanto andou para o norte. A ordem faz parte da informação — (2, 3) não é a mesma posição que (3, 2). [MML §2.4]',
        'Na widget, use o grupo 1: ajuste c₁ e c₂ e acompanhe o ponto resultante se mover pelo plano. Os dois números que você escolhe *são* a posição; não há mais nada a descobrir além deles. [MML §2.4]',
        'Repare também na origem: é a posição neutra, nenhum passo em nenhuma direção — e é onde o robô está agora. [MML §2.4]',
      ],
      katex: [],
      widgetInteraction: {
        widgetId: 'VectorSpaceWidget',
        prompt:
          'No grupo 1, comece com c₁ = 0 e c₂ = 0 e observe o resultado cair na origem. Depois mova um coeficiente de cada vez, até o vetor resultante v coincidir com o alvo marcado no plano.',
        expectedInsight:
          'Uma posição no plano é exatamente um par ordenado de números: a lista de quanto se andou em cada direção. Trocar a ordem dos números troca a posição.',
      },
      checkpoint: {
        question:
          'Para chegar a (2, 3) partindo da origem, quantos passos para o leste e quantos para o norte? E se a ordem dos dois números fosse trocada, onde o robô chegaria?',
        answer:
          '2 passos para o leste e 3 para o norte. Com a ordem trocada ele chegaria a (3, 2) — uma posição diferente, porque o par é ordenado: a primeira coordenada é sempre o leste e a segunda é sempre o norte.',
      },
      sourceRefs: ['mml-2.4'],
    },

    {
      id: 'passo-2',
      title: 'Somar e esticar',
      narrative: [
        'Agora use os grupos 2 e 3 da widget: um segundo movimento, que você soma a v, e o número λ, que estica o movimento v. [MML §2.4]',
        'Repare primeiro numa coisa sobre o desenho. O quadro da widget é uma **janela**, não o espaço: quando um vetor cresce e a janela se afasta, ele continua no mesmo plano. O plano ℝ² não tem borda, e nenhuma das duas operações consegue produzir algo que não seja outro par ordenado de números. [MML §2.4]',
        'Somar é o mais direto: (2, 1) somado a (1, 3) dá (3, 4) — primeiro com primeiro, segundo com segundo. O resultado é um par de números como qualquer outro. [MML §2.4]',
        'Esticar é multiplicar por um número, e esse número tem nome: **escalar**. Se o robô andasse um quadrado por vez em (1, 0), multiplicar esse movimento por 2 é andar 2 quadrados na mesma direção: 2·(1, 0) = (2, 0). O mesmo número multiplica **cada** coordenada do movimento — se v = (2, 3), então 2v = (4, 6). Multiplicar por 0 devolve a origem, e multiplicar por um número negativo inverte o sentido sem sair da reta. [MML §2.4]',
        'O que as duas operações têm em comum: o resultado nunca sai do plano, e uma reta que passa pela origem nunca é abandonada por elas. Pegue dois pontos de uma reta que **não** passa pela origem, some, e o resultado cai fora. É por isso que a origem não é um detalhe. [MML §2.4]',
      ],
      katex: [],
      widgetInteraction: {
        widgetId: 'VectorSpaceWidget',
        prompt:
          'No grupo 2, ajuste w e compare v, w e v + w. No grupo 3, leve λ de 1 para 2 e depois para 0,5, para 0 e para um valor negativo, observando o movimento crescer, encolher e inverter. As duas direções da base ficam onde estão: o que λ escala é o movimento v.',
        expectedInsight:
          'Somar dois movimentos soma coordenada a coordenada; multiplicar por um escalar aplica o mesmo número a cada coordenada. As duas operações devolvem sempre outro par de números no mesmo plano — e uma reta pela origem sobrevive às duas, o que a torna um subespaço. Se o vetor parece sair do quadro, foi a janela que se afastou: o plano não tem borda.',
      },
      checkpoint: {
        question:
          'Na situação do robô, um passo leste move (1, 0). Suponha que ele andasse um quadrado por vez nessa direção: por qual número multiplicamos esse movimento para chegar à coordenada (2, 0)? E que nome damos a esse número?',
        answer:
          'Multiplicamos por 2: 2·(1, 0) = (2, 0). Esse número pelo qual multiplicamos um vetor é o **escalar**. Repare que ele multiplica cada coordenada pelo mesmo fator: se o movimento fosse (2, 3), então 2·(2, 3) = (4, 6) — as duas coordenadas dobraram juntas.',
      },
      sourceRefs: ['mml-2.4'],
    },

    {
      id: 'passo-3',
      title: 'A fórmula da combinação linear',
      narrative: [
        'Você fez a mesma coisa o tempo todo: escolheu quanto usar de cada direção e somou os pedaços. Isso tem nome. [MML §2.5]',
        'Dados vetores x₁, …, x_k e um número λᵢ para cada um, o vetor que resulta da soma dos pedaços é uma **combinação linear** deles. [MML §2.5]',
        'Aqui vale separar duas coisas que se parecem na widget. No grupo 3, λ é **um** número aplicado a **todas** as coordenadas de v — é o escalar de λx. No grupo 1, c₁ e c₂ são os **λᵢ** da fórmula: um número **diferente** para **cada** vetor da base. Foi assim que você chegou a (2, 3): c₁ = 2 multiplicou b₁ e c₂ = 3 multiplicou b₂. Escalar usa um fator só; combinação usa um fator por vetor. [MML §2.4, §2.5]',
        'No problema do robô, os vetores eram as duas direções fixas e os coeficientes eram as quantidades de passos: a posição (2, 3) é 2·(1, 0) + 3·(0, 1). As duas operações que você explorou no passo anterior são exatamente as que aparecem nas fórmulas abaixo. [MML §2.5]',
        'Quando as duas direções não são colineares, elas cobrem o plano inteiro: todo ponto é uma combinação linear delas. Com as direções do robô, os coeficientes são literalmente a posição. É esse o passo que vai permitir, mais adiante, escrever um dado como combinação de vetores de base. [MML §2.5]',
      ],
      katex: [
        String.raw`\boldsymbol{v} = \sum_{i=1}^k \lambda_i \boldsymbol{x}_i`,
        String.raw`\boldsymbol{x} + \boldsymbol{y} = (x_1 + y_1, \dots, x_n + y_n)^\top`,
        String.raw`\lambda \boldsymbol{x} = (\lambda x_1, \dots, \lambda x_n)^\top`,
      ],
      widgetInteraction: {
        widgetId: 'VectorSpaceWidget',
        prompt:
          'Deixe os coeficientes nos valores que resolvem o alvo e leia a confirmação na widget: v = c₁b₁ + c₂b₂, com os números substituídos. Depois mude um coeficiente e veja a igualdade deixar de valer.',
        expectedInsight:
          'A fórmula não é uma regra nova: é o nome do que você já fez. E ela usa um coeficiente por vetor (λᵢ, um para cada xᵢ) — diferente do escalar do passo anterior, que era um número só aplicado a todas as coordenadas.',
      },
      checkpoint: {
        question:
          'Escreva a posição (2, 3) como combinação linear das duas direções do robô. Em seguida, diga em uma frase o que é uma combinação linear e o que a diferencia de multiplicar por um escalar.',
        answer:
          'v = 2·(1, 0) + 3·(0, 1) = (2, 3). Uma combinação linear é o resultado de multiplicar cada vetor de um conjunto por um número próprio e somar todos esses produtos — é isso que a fórmula v = Σ λᵢxᵢ escreve. A diferença para o escalar é que o escalar aplica um único número a todas as coordenadas de um mesmo vetor, enquanto a combinação usa um número diferente para cada vetor antes de somar.',
      },
      sourceRefs: ['mml-2.4', 'mml-2.5'],
    },
  ],
};
