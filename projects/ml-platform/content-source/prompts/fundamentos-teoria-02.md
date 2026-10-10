# Prompt — `fundamentos-teoria-02` (Produto escalar, ângulos e projeções)

Segunda execução da Camada 3. O template está em [`../CAMADA3.md`](../CAMADA3.md); este
arquivo é o template **instanciado** com o manifesto e os trechos citados, pronto para colar
numa sessão nova — sem histórico, sem acesso ao repositório. É assim que ele deve rodar: o
gerador recebe o manifesto e a fonte, e nada mais.

**Como usar.** Cole o bloco abaixo inteiro numa sessão nova. A saída é um `LessonContent` (o
objeto literal, sem markdown em volta). Depois: **nível 1** (auditoria por prompt contra os
mesmos trechos que estão aqui), **nível 2** (`npm run validate:manifests` — o `numericExample`
desta lição já roda no motor, e `../../src/app/ml-engine/manifest-examples.spec.ts` já prova
`proj = (3.5, 3.5)` e `cos ω ≈ 0.9899`), e **nível 3** (o checklist de 4 itens do `CAMADA3.md`).

## O que este prompt tem de diferente do piloto

O arquivo do piloto ([`fundamentos-teoria-01.md`](./fundamentos-teoria-01.md)) é o registro do
que **produziu** a lição 01, e por isso não foi retroagido quando o template mudou. Este é
escrito contra o [`CAMADA3.md`](../CAMADA3.md) atual, e as três diferenças são deliberadas:

1. **A regra 6 está dita em voz alta.** O gerador não escreve `options`: as alternativas do
   passo da fórmula são do autor, no arquivo de runtime da lição, e a correta é uma
   `keyFormula` do manifesto, literal. O passo final **nomeia** a fórmula, e para aí.
2. **A regra de nomear o termo no passo em que o aluno o usa** — medida na leitura humana do
   piloto, em que o leitor fez a operação por um passo inteiro sem nome para ela.
3. **O escopo dos dois passos de exploração está declarado.** O objetivo desta lição tem duas
   metades — alinhamento (§3.2 e §3.4) e projeção como melhor aproximação (§3.8) — e o
   manifesto traz três `keyFormulas` de três seções diferentes. O piloto deixava a divisão para
   o gerador; aqui ela é dita, porque uma lição que fizesse produto escalar e depois nomeasse
   três fórmulas cumpriria o arco e não ensinaria metade do objetivo.

**O `ProjectionWidget` ainda não tem componente no runtime.** A descrição dele lá dentro é a
**interface contratada** — os controles que existirão, os quatro números que o aluno lê e o
encaixe que torna a perpendicular alcançável arrastando. Se a lição gerada mandar o aluno fazer
algo que não está ali, o defeito é da interface ou da prosa, e quem decide qual é o nível 3.

```text
Você está gerando o conteúdo de uma lição de um curso interativo de Machine Learning.
A lição é a segunda do módulo de teoria do Curso 1 (Fundamentos Matemáticos para ML).

Ela vem depois de `fundamentos-teoria-01` (Vetores), onde o aluno já montou uma posição como
combinação linear: a ideia de vetor, de soma e de multiplicação por escalar já está com ele.
**Produto escalar, ângulo e projeção não estão**, e é isso que esta lição introduz.

MANIFESTO DA LIÇÃO (o contrato — ele diz o que a lição tem de ter):

{
  "lessonId": "fundamentos-teoria-02",
  "moduleId": "fundamentos-teoria",
  "order": 2,
  "title": "Produto escalar, ângulos e projeções",
  "objective": "O aluno interpreta o produto escalar como medida de alinhamento entre vetores, e projeções como 'melhor aproximação' de um vetor na direção de outro.",
  "prerequisites": [
    "fundamentos-teoria-01"
  ],
  "sourceRefs": [
    "mml-3.2",
    "mml-3.4",
    "mml-3.8"
  ],
  "sourceFiles": [
    "mml/03-analytic-geometry.md"
  ],
  "widget": "ProjectionWidget",
  "widgetConfig": {
    "vectorA": [
      3,
      4
    ],
    "vectorB": [
      1,
      1
    ],
    "allowDrag": true
  },
  "keyFormulas": [
    "\\boldsymbol{x}^\\top \\boldsymbol{y} = \\sum_{i=1}^n x_i y_i",
    "\\cos \\omega = \\frac{\\langle \\boldsymbol{x}, \\boldsymbol{y} \\rangle}{\\|\\boldsymbol{x}\\| \\|\\boldsymbol{y}\\|}",
    "\\pi_U(\\boldsymbol{x}) = \\frac{\\boldsymbol{b}^\\top \\boldsymbol{x}}{\\|\\boldsymbol{b}\\|^2}\\boldsymbol{b}"
  ],
  "numericExample": {
    "description": "Projeção de (3,4) em (1,1): dot=7, |b|²=2, então proj=(3.5, 3.5)",
    "inputs": {
      "x": [
        3,
        4
      ],
      "y": [
        1,
        1
      ]
    },
    "expected": "proj = (3.5, 3.5); cosθ ≈ 0.9899",
    "expectedValues": [
      3.5,
      3.5,
      0.9899
    ],
    "sourceRef": "mml-3.8"
  },
  "completionCriterion": "Ao arrastar b, o aluno vê a projeção mudar de magnitude (b→horiz = proj grande em x) e prever quando cos θ = 0 (perpendicular ⇒ projeção nula).",
  "estimatedMinutes": 14,
  "status": "draft",
  "knownGaps": []
}

FONTE AUTORITATIVA (única fonte permitida — não use conhecimento externo):

--- mml/03-analytic-geometry.md, seção §3.2 ---

## mml-3.2 — Produtos Internos e Matrizes Definidas Positivas (Inner Products & SPD Matrices)

* **(a) Definição Formal e Notação Exata:**
  Um produto interno em um espaço vetorial \\(V\\) é uma mapeamento bilinear simétrico e positivo definido \\(\Omega: V \times V \to \mathbb{R}\\), denotado por \\(\langle \boldsymbol{x}, \boldsymbol{y} \rangle\\):
  1. **Simetria:** \\(\langle \boldsymbol{x}, \boldsymbol{y} \rangle = \langle \boldsymbol{y}, \boldsymbol{x} \rangle, \, \forall \boldsymbol{x}, \boldsymbol{y} \in V\\).
  2. **Positiva Definida:** \\(\forall \boldsymbol{x} \in V \setminus \{\boldsymbol{0}\}: \langle \boldsymbol{x}, \boldsymbol{x} \rangle > 0\\) e \\(\langle \boldsymbol{0}, \boldsymbol{0} \rangle = 0\\).
  
  O **produto escalar (dot product)** em \\(\mathbb{R}^n\\) é o caso particular \\(\boldsymbol{x}^\top \boldsymbol{y} = \sum_{i=1}^n x_i y_i\\).
  
  *Relação com Matrizes SPD:* Se \\(\boldsymbol{A} \in \mathbb{R}^{n \times n}\\) for uma matriz simétrica definida positiva (isto é, \\(\boldsymbol{x}^\top \boldsymbol{A} \boldsymbol{x} > 0, \forall \boldsymbol{x} \neq \boldsymbol{0}\\)), então \\(\langle \boldsymbol{x}, \boldsymbol{y} \rangle = \hat{\boldsymbol{x}}^\top \boldsymbol{A} \hat{\boldsymbol{y}}\\) define um produto interno válido em relação a uma base ordenada \\(B\\).

* **(b) Intuição Geométrica:**
  O produto interno estende e generaliza o produto escalar, servindo como a ferramenta fundamental para capturar a noção intuitiva de **similaridade geométrica** entre vetores no espaço. Vetores muito semelhantes produzem valores altos no produto interno, enquanto vetores muito distantes ou ortogonais produzem valores próximos de zero ou negativos.

* **(c) Exemplo Numérico em 2D:**
  Para \\(\boldsymbol{x} = \begin{bmatrix} 1 \\ 1 \end{bmatrix}\\) e \\(\boldsymbol{y} = \begin{bmatrix} 1 \\ 2 \end{bmatrix}\\):
  * Dot product padrão: \\(\langle \boldsymbol{x}, \boldsymbol{y} \rangle = 1(1) + 1(2) = 3\\).
  * Produto interno ponderado com \\(\boldsymbol{A} = \begin{bmatrix} 1 & -1/2 \\ -1/2 & 1 \end{bmatrix}\\):
    \\(\langle \boldsymbol{x}, \boldsymbol{y} \rangle = x_1 y_1 - \frac{1}{2}(x_1 y_2 + x_2 y_1) + x_2 y_2 = 1(1) - \frac{1}{2}(2 + 1) + 1(2) = 1,5\\).

* **(d) Aplicação nos Modelos (ML):**
  * **Support Vector Machines (Kernel Trick):** O *Kernel Trick* substitui o produto interno no espaço original por um produto interno em um espaço de características de alta dimensão \\(k(\boldsymbol{x}_i, \boldsymbol{x}_j) = \langle \phi(\boldsymbol{x}_i), \phi(\boldsymbol{x}_j) \rangle\\), sem necessidade de computar a transformação \\(\phi\\) explicitamente.
  * **GMM e Regressão:** Matrizes de covariância em distribuições Gaussianas são matrizes SPD que atuam na construção de produtos internos e distâncias de Mahalanobis.

* **(e) Fórmulas Relevantes:**
  * \\(\boldsymbol{x}^\top \boldsymbol{y} = \sum_{i=1}^n x_i y_i\\)
  * \\(\langle \boldsymbol{x}, \boldsymbol{y} \rangle = \hat{\boldsymbol{x}}^\top \boldsymbol{A} \hat{\boldsymbol{y}}\\)
  * **Desigualdade de Cauchy-Schwarz:** \\(|\langle \boldsymbol{x}, \boldsymbol{y} \rangle| \le \|\boldsymbol{x}\| \|\boldsymbol{y}\|\\)

--- mml/03-analytic-geometry.md, seção §3.4 ---

## mml-3.4 — Ângulos e Ortogonalidade (Angles & Orthogonality)

* **(a) Definição Formal e Notação Exata:**
  O **ângulo** \\(\omega \in [0, \pi]\\) entre dois vetores não-nulos \\(\boldsymbol{x}, \boldsymbol{y} \in V\\) é definido usando a desigualdade de Cauchy-Schwarz por:
  \\[\cos \omega = \frac{\langle \boldsymbol{x}, \boldsymbol{y} \rangle}{\|\boldsymbol{x}\| \|\boldsymbol{y}\|}\\].
  Dois vetores \\(\boldsymbol{x}, \boldsymbol{y}\\) são **ortogonais** (\\(\boldsymbol{x} \perp \boldsymbol{y}\\)) se e somente se \\(\langle \boldsymbol{x}, \boldsymbol{y} \rangle = 0\\).
  Uma matriz quadrada \\(\boldsymbol{A} \in \mathbb{R}^{n \times n}\\) é uma **matriz ortogonal** se suas colunas forem ortonormais, ou seja, \\(\boldsymbol{A}\boldsymbol{A}^\top = \boldsymbol{I} = \boldsymbol{A}^\top \boldsymbol{A}\\), implicando que \\(\boldsymbol{A}^{-1} = \boldsymbol{A}^\top\\).

* **(b) Intuição Geométrica:**
  O ângulo indica o grau de alinhamento das direções dos vetores. Quando \\(\omega = 0\\), os vetores possuem exatamente a mesma orientação (\\(\cos \omega = 1\\)). Quando \\(\omega = 90^\circ\\) (\\(\pi/2\\)), os vetores são perpendiculares/ortogonais (\\(\cos \omega = 0\\)). Matrizes ortogonais preservam comprimentos e ângulos, atuando como rotações ou reflexões do espaço.

* **(c) Exemplo Numérico em 2D:**
  Para \\(\boldsymbol{x} = \begin{bmatrix} 1 \\ 1 \end{bmatrix}\\) e \\(\boldsymbol{y} = \begin{bmatrix} 1 \\ 2 \end{bmatrix}\\) sob o *dot product*:
  \\[\cos \omega = \frac{1(1) + 1(2)}{\sqrt{2}\sqrt{5}} = \frac{3}{\sqrt{10}} \approx 0,9487 \implies \omega = \arccos\left(\frac{3}{\sqrt{10}}\right) \approx 0,32 \text{ rad} \approx 18^\circ\\].
  Para \\(\boldsymbol{x} = \begin{bmatrix} 1 \\ 1 \end{bmatrix}\\) e \\(\boldsymbol{y} = \begin{bmatrix} -1 \\ 1 \end{bmatrix}\\): \\(\langle \boldsymbol{x}, \boldsymbol{y} \rangle = 1(-1) + 1(1) = 0 \implies \omega = 90^\circ\\) (\\(\boldsymbol{x} \perp \boldsymbol{y}\\)).

* **(d) Aplicação nos Modelos (ML):**
  * **Regressão Linear:** A estimativa de Mínimos Quadrados garante que o vetor de resíduos/erros de previsão \\((\boldsymbol{y} - \boldsymbol{X}\boldsymbol{\theta})\\) seja estritamente ortogonal ao subespaço gerado pelos dados de entrada.
  * **PCA:** As direções dos componentes principais escolhidos são mutuamente ortogonais.

* **(e) Fórmulas Relevantes:**
  * \\(\cos \omega = \frac{\langle \boldsymbol{x}, \boldsymbol{y} \rangle}{\|\boldsymbol{x}\| \|\boldsymbol{y}\|}\\)
  * \\(\boldsymbol{x} \perp \boldsymbol{y} \iff \langle \boldsymbol{x}, \boldsymbol{y} \rangle = 0\\)
  * \\(\boldsymbol{A}\boldsymbol{A}^\top = \boldsymbol{I} \iff \boldsymbol{A}^{-1} = \boldsymbol{A}^\top\\)

--- mml/03-analytic-geometry.md, seção §3.8 ---

## mml-3.8 — Projeções Ortogonais (Orthogonal Projections)

* **(a) Definição Formal e Notação Exata:**
  1. **Projeção em Subespaço 1D (Reta):** Projetar \\(\boldsymbol{x} \in \mathbb{R}^n\\) em \\(U = \text{span}[\boldsymbol{b}]\\) busca \\(\pi_U(\boldsymbol{x}) = \lambda \boldsymbol{b}\\) com coordenada \\(\lambda = \frac{\boldsymbol{b}^\top \boldsymbol{x}}{\|\boldsymbol{b}\|^2}\\). A matriz de projeção é \\(\boldsymbol{P}_\pi = \frac{\boldsymbol{b}\boldsymbol{b}^\top}{\|\boldsymbol{b}\|^2}\\).
  2. **Projeção em Subespaço de Dimensão \\(M\\):** Para \\(U = \text{span}[\boldsymbol{b}_1, \dots, \boldsymbol{b}_M]\\) dado por colunas de \\(\boldsymbol{B} \in \mathbb{R}^{n \times M}\\), a projeção é \\(\pi_U(\boldsymbol{x}) = \boldsymbol{B}\boldsymbol{\lambda}\\). As coordenadas \\(\boldsymbol{\lambda}\\) satisfazem as **Equações Normais**:
     \\[\boldsymbol{B}^\top \boldsymbol{B} \boldsymbol{\lambda} = \boldsymbol{B}^\top \boldsymbol{x} \implies \boldsymbol{\lambda} = (\boldsymbol{B}^\top \boldsymbol{B})^{-1}\boldsymbol{B}^\top \boldsymbol{x}\\].
     A matriz de projeção é \\(\boldsymbol{P}_\pi = \boldsymbol{B}(\boldsymbol{B}^\top \boldsymbol{B})^{-1}\boldsymbol{B}^\top\\).
  3. **Projeção em Subespaço Afim \\(L = \boldsymbol{x}_0 + U\\):**
     \\[\pi_L(\boldsymbol{x}) = \boldsymbol{x}_0 + \pi_U(\boldsymbol{x} - \boldsymbol{x}_0)\\].
  4. **Ortogonalização de Gram-Schmidt:** Processo iterativo para transformar uma base \\((\boldsymbol{b}_1, \dots, \boldsymbol{b}_n)\\) em uma base ortogonal \\((\boldsymbol{u}_1, \dots, \boldsymbol{u}_n)\\), onde \\(\boldsymbol{u}_1 := \boldsymbol{b}_1\\) e \\(\boldsymbol{u}_k := \boldsymbol{b}_k - \pi_{\text{span}[\boldsymbol{u}_1, \dots, \boldsymbol{u}_{k-1}]}(\boldsymbol{b}_k)\\).

* **(b) Intuição Geométrica:**
  Encontra o ponto \\(\pi_U(\boldsymbol{x})\\) contido no subespaço \\(U\\) que está mais próximo de \\(\boldsymbol{x}\\), minimizando a distância \\(\|\boldsymbol{x} - \pi_U(\boldsymbol{x})\|\\). O vetor erro de projeção \\((\boldsymbol{x} - \pi_U(\boldsymbol{x}))\\) forma um ângulo reto (\\(90^\circ\\)) com qualquer vetor contido no subespaço \\(U\\).

* **(c) Exemplo Numérico em 2D:**
  Dada a reta gerada por \\(\boldsymbol{b} = \begin{bmatrix} 2 \\ 0 \end{bmatrix}\\) e o ponto \\(\boldsymbol{x} = \begin{bmatrix} 1 \\ 1 \end{bmatrix}\\):
  \\(\lambda = \frac{\boldsymbol{b}^\top \boldsymbol{x}}{\boldsymbol{b}^\top \boldsymbol{b}} = \frac{2(1)+0(1)}{2^2+0^2} = \frac{2}{4} = 0,5\\).
  Ponto projetado: \\(\pi_U(\boldsymbol{x}) = 0,5 \begin{bmatrix} 2 \\ 0 \end{bmatrix} = \begin{bmatrix} 1 \\ 0 \end{bmatrix}\\).
  Matriz de projeção: \\(\boldsymbol{P}_\pi = \frac{1}{4}\begin{bmatrix} 2 \\ 0 \end{bmatrix}\begin{bmatrix} 2 & 0 \end{bmatrix} = \begin{bmatrix} 1 & 0 \\ 0 & 0 \end{bmatrix}\\).

* **(d) Aplicação nos Modelos (ML):**
  * **Regressão Linear (MLE):** A solução clássica de Mínimos Quadrados \\(\boldsymbol{\theta}_{\text{ML}} = (\boldsymbol{\Phi}^\top \boldsymbol{\Phi})^{-1}\boldsymbol{\Phi}^\top \boldsymbol{y}\\) realiza exatamente uma projeção ortogonal do vetor de observações \\(\boldsymbol{y}\\) sobre o subespaço gerado pelas colunas da matriz de características \\(\boldsymbol{\Phi}\\).
  * **PCA:** Projeta dados de alta dimensão sobre o subespaço principal minimizando a perda de compressão quadrática.

* **(e) Fórmulas Relevantes:**
  * Projeção 1D: \\(\pi_U(\boldsymbol{x}) = \frac{\boldsymbol{b}^\top \boldsymbol{x}}{\|\boldsymbol{b}\|^2}\boldsymbol{b}\\)
  * Equações Normais: \\(\boldsymbol{B}^\top \boldsymbol{B} \boldsymbol{\lambda} = \boldsymbol{B}^\top \boldsymbol{x}\\)
  * Pseudo-inversa: \\((\boldsymbol{B}^\top \boldsymbol{B})^{-1}\boldsymbol{B}^\top\\)
  * Matriz de Projeção \\(M\\)-dimensional: \\(\boldsymbol{P}_\pi = \boldsymbol{B}(\boldsymbol{B}^\top \boldsymbol{B})^{-1}\boldsymbol{B}^\top\\)
  * Projeção Afim: \\(\pi_L(\boldsymbol{x}) = \boldsymbol{x}_0 + \pi_U(\boldsymbol{x} - \boldsymbol{x}_0)\\)

CONTRATO DE SAÍDA:

Gere a lição como um objeto TS que satisfaz `LessonContent` de
`libs/ml-engine/lesson-content.types.ts` (importável como `@ml/engine`). Os campos, sem
inventar, renomear ou omitir nenhum:

LessonContent:
  lessonId    string   — o do manifesto, sem alteração
  title       string   — o title do manifesto
  objective   string   — o objective do manifesto, reescrito como promessa ao aluno
  steps       LessonContentStep[]  — em ordem de descoberta

LessonContentStep:
  id                                string    — estável na lição: "passo-1", "passo-2", …
  title                             string    — curto e concreto
  narrative                         string[]  — 2 a 4 frases por bloco, um bloco por ideia
  katex                             string[]  — fórmulas em KaTeX, cópias literais da fonte
  widgetInteraction.widgetId        string    — "ProjectionWidget", sem alteração
  widgetInteraction.prompt          string    — instrução imperativa ao aluno
  widgetInteraction.expectedInsight string    — o que o aluno deve NOTAR neste passo
  checkpoint.question               string
  checkpoint.answer                 string
  sourceRefs                        string[]  — subconjunto de ["mml-3.2", "mml-3.4", "mml-3.8"]

O QUE VOCÊ NÃO ESCREVE (regra 6 do `CAMADA3.md`):

- **Não escreva `options`, distratores, nem "alternativas plausíveis".** O passo final oferece
  alternativas para o aluno *reconhecer* a fórmula, e as erradas são erradas de propósito —
  pedi-las a você é pedir a fórmula plausível e inventada que este pipeline existe para barrar.
  Elas são do autor, no arquivo de runtime da lição.
- **Não escreva a checagem de avanço nem o `hint` da recusa.** Como o aluno avança é conferido
  no runtime, sobre o estado da widget, e não no conteúdo.
- Não escreva HTML, link, lista, crase nem título dentro do texto: `narrative`, `checkpoint.*`,
  `prompt` e `expectedInsight` entendem **dois** construtores inline — `**negrito**` e
  `*itálico*` — e nada mais.

O que continua sendo seu: a prosa que leva o aluno até a fórmula, o `prompt` e o
`expectedInsight` da widget, o `checkpoint` — e o passo final **nomeia a fórmula** no `title`,
no `katex` e no `checkpoint`.

REGRAS DE FIDELIDADE:

1. Toda fórmula em `katex` vem literalmente da FONTE AUTORITATIVA, preservando a notação: copie
   os mesmos caracteres (`\boldsymbol{}`, `\langle`, `\rangle`, `\frac`, `\sum_{i=1}^n`,
   `\pi_U`, `^\top`, `\|\boldsymbol{x}\|`, `\begin{bmatrix} … \end{bmatrix}`). Não simplifique,
   não traduza símbolo, não reescreva. O passo final traz as **três** `keyFormulas` do
   manifesto, literais.
2. Cite a seção de origem em cada bloco do `narrative`, no formato [MML §3.2], [MML §3.4] ou
   [MML §3.8]. Só essas três seções existem para esta lição.
3. **Nunca cite uma seção de Further Reading.** A bibliografia não é conteúdo. Todo capítulo do
   MML fecha com uma seção chamada *Further Reading*; ela lista leituras, não ensina nada. As
   únicas seções que você pode citar aqui são §3.2, §3.4 e §3.8.
4. Use o exemplo numérico do manifesto como o exemplo da lição: **x = (3, 4)** projetado sobre a
   direção **b = (1, 1)**, com xᵀb = 7, λ = 3.5, projeção = (3.5, 3.5) e cos ω ≈ 0.9899. O
   widget **abre** nesses números — eles são o `numericExample.inputs` do manifesto — então a
   lição começa onde o aluno de fato começa. Números pequenos, no máximo 2 casas decimais; a
   exceção é o cosseno, que o manifesto fixa em 0.9899.
5. Português, com o termo técnico em inglês entre parênteses na primeira aparição.
6. Se a fonte não cobrir algo que o manifesto pede, devolva `{ "gap": "…" }` descrevendo o que
   falta, em vez de inventar. Um gap declarado é útil; uma fórmula plausível e inventada é o
   erro que este pipeline existe para impedir. Esta lição **não tem `knownGaps` declarado** —
   se você encontrar um buraco, é notícia, e o lugar dele é aqui.

REGRAS DE ARCO (o requisito didático — leia com atenção, é onde a geração costuma falhar):

O app de Cálculo, que já funciona, segue sempre o mesmo arco: o aluno explora e observa algumas
vezes, e SÓ NO ÚLTIMO passo a fórmula geral ganha nome. Medido nas 7 lições dele: todas
terminam nomeando a fórmula, todas abrem com exploração, e nenhuma abre pela fórmula.

- Gere **3 passos** (2 a 4 é o intervalo; 3 é o alvo para os 14 minutos estimados).
- Os passos 1 e 2 são **exploração**: o `narrative` descreve o que o aluno vê enquanto arrasta,
  sem enunciar a fórmula e sem entregar a conclusão. O `expectedInsight` diz qual conclusão ele
  deve tirar sozinho.
- **O passo 3 nomeia a fórmula**: o `title` diz que é a fórmula, o `katex` traz as três
  `keyFormulas` do manifesto, e o `checkpoint` pergunta ao aluno o que ele acabou de descobrir —
  a resposta é a fórmula.
- **Nenhum passo antes do último escreve `katex`.** Os quatro números que o widget imprime
  (produto escalar, cosseno, fator λ, comprimento da projeção) **podem** ser nomeados em prosa:
  nomear uma leitura não é enunciar a regra que a produz. O que não pode aparecer antes do passo
  3 é a igualdade geral — `xᵀy = Σ xᵢyᵢ`, `cos ω = ⟨x, y⟩ / (‖x‖ ‖y‖)`,
  `π_U(x) = (bᵀx / ‖b‖²) b`.
- **Escopo das duas explorações** — as duas metades do `objective`, uma por passo:

  - **passo 1, alinhamento (§3.2 e §3.4).** O aluno arrasta a ponta de **b** e vê o produto
    escalar e o cosseno crescerem juntos quando b aponta para o mesmo lado de x, caírem quando
    ele gira, e **ficarem negativos** quando b aponta para o lado oposto. É aqui que ele
    descobre que esse número mede alinhamento, e que ele é *assinado*.
  - **passo 2, a projeção (§3.8).** Com x parado, o aluno gira b e vê a projeção de x cair sobre
    a direção de b: λ cresce, diminui, troca de sinal — e **desaparece** quando b fica
    perpendicular a x, que é o estado que o `completionCriterion` do manifesto pede ("prever
    quando cos θ = 0"). O segmento de erro continua perpendicular a b o tempo todo, inclusive
    quando a projeção é nula e o erro é o próprio x.

- O primeiro bloco do primeiro passo abre com um **cenário concreto**: uma situação com números,
  que o aluno queira resolver e não possa calcular direto. O cenário **não** menciona "produto
  escalar", "ângulo", "projeção", "ortogonal" nem fórmula — ele dá a pergunta; a matemática vem
  depois, e é o aluno que a nomeia. Exemplo da voz (não copie este cenário, copie a forma): "Uma
  viga é puxada por dois cabos ao mesmo tempo, e você quer saber quanto da força de um cabo
  empurra a viga na direção do outro. Você tem os dois números, e não sabe o que fazer com
  eles."
- **Nomeie o termo no passo em que o aluno o usa, não depois.** Nomear a fórmula só no fim é o
  arco; esconder *vocabulário* até o fim é outra coisa. Então: o **passo 1** diz que o número que
  o aluno está lendo é o **produto escalar (dot product)**, e que o segundo número é o cosseno
  do **ângulo** entre os dois vetores; o **passo 2** diz que o ponto onde x cai sobre a direção
  de b é a **projeção ortogonal** de x. O que fica para o passo 3 é a **fórmula**, não o
  vocabulário. (Medido no piloto: o leitor fez a operação por um passo inteiro sem saber como
  chamá-la.)
- **Distinga o que se parece.** Esta lição tem quatro confusões à mão, e o texto precisa
  separá-las em voz alta, uma a uma:

  - **produto escalar é um número; projeção é um vetor.** O primeiro mede o quanto duas direções
    concordam; a segunda é um ponto do plano;
  - **o fator λ e o vetor projetado.** λ é *um* número que escala a direção **b**; a projeção é
    λ·b, um vetor. É a mesma armadilha de escalar × combinação linear da lição 01, com outras
    roupas;
  - **produto escalar igual a zero e cosseno igual a zero dizem a mesma coisa** —
    ortogonalidade —, e o aluno vê os dois números no painel ao mesmo tempo;
  - **"a melhor aproximação" não é a projeção mais longa.** O que faz da projeção a mais próxima
    de x é o erro (x menos a projeção) ser perpendicular à direção de b — é isso que o desenho
    mostra, e é isso que §3.8(b) diz com outras palavras.

- **Nada que o widget contradiga visualmente.** O widget é evidência: ou ele mostra a afirmação,
  ou o `narrative` diz explicitamente que aquele passo não é demonstrado ali. Medido no piloto:
  o texto afirmava que a operação nunca saía do plano e a janela fixa de ±5 unidades fazia o
  vetor sair do quadro — o aluno aprendia o contrário do que estava escrito. O caso análogo aqui
  é a perpendicular: se você escrever que o aluno consegue chegar a exatamente 90°, o widget tem
  de **encaixar** nesse ângulo, e ele encaixa.

O WIDGET:

O widget é o `ProjectionWidget`, em ℝ². Ele desenha dois vetores a partir da origem —
**x = (3, 4)**, o vetor que será projetado, e **b = (1, 1)**, a direção. Notação: o manifesto
guarda esses números em `numericExample.inputs.x` e `.y`, mas a §3.8 chama a direção de **b**, e
o `completionCriterion` também ("ao arrastar b"). Escreva **b**; não invente uma terceira letra.

Ele expõe **ao mesmo tempo**, num painel só — o manifesto declara um widget por lição e um passo
não pode configurá-lo, então cada `prompt` manda o aluno para um grupo diferente de controles:

- **vetores** — as pontas de x e de b são **arrastáveis**, e as coordenadas dos dois ficam
  impressas ao lado delas;
- **leitura** — quatro números, atualizados a cada arrasto: o produto escalar **xᵀb**, o cosseno
  **cos ω**, o fator **λ** e o **comprimento da projeção**;
- **desenho** — a projeção de x sobre a direção de b aparece tracejada, e o segmento de erro (x
  menos a projeção) é desenhado sempre perpendicular a b.

Quando o ângulo entre x e b chega perto de 90°, o widget **encaixa** b na perpendicular exata e
marca o estado como **ortogonal**. Isso existe para o aluno conseguir *chegar* a cos ω = 0
arrastando, e não apenas passar perto — é o mesmo mecanismo do alvo com tolerância da lição 01.

Uma nota de notação, para o texto não gastar a descoberta: o widget **não** imprime `π_U(x)` nem
a fórmula da projeção. Ele imprime os quatro números acima, com os rótulos acima. A notação da
§3.8 entra no passo 3, com as `katex`.

Escreva o `prompt` e o `expectedInsight` de cada passo sabendo disso — e lembre que o aluno
ainda não conhece a notação: o widget mostra o que a operação *faz*, não como ela se escreve.

ANTES DE RESPONDER, confira:

- [ ] Todo campo de `LessonContent` e de `LessonContentStep` está presente em todos os passos?
- [ ] Todo passo tem `id`, `title`, `narrative`, `katex`, `widgetInteraction` (com os três
      subcampos), `checkpoint` (com os dois) e `sourceRefs`?
- [ ] O passo 3 é o único que enuncia fórmula — e o único com `katex` não vazio?
- [ ] O passo 3 traz as três `keyFormulas` do manifesto, literais?
- [ ] Toda citação é §3.2, §3.4 ou §3.8 — nenhuma *Further Reading*?
- [ ] Toda fórmula em `katex` é uma cópia literal da fonte?
- [ ] O cenário de abertura é concreto, e não menciona produto escalar, ângulo, projeção nem
      notação?
- [ ] O exemplo do manifesto aparece — x = (3, 4), b = (1, 1), xᵀb = 7, λ = 3.5,
      projeção = (3.5, 3.5), cos ω ≈ 0.9899?
- [ ] O passo 1 nomeia **produto escalar** e **ângulo**, e o passo 2 nomeia **projeção
      ortogonal** — cada termo no passo em que é usado?
- [ ] Você não escreveu `options`, nem distratores, nem checagem de avanço, nem `hint`?

Responda apenas com o objeto, sem markdown em volta.
```
