# Prompt piloto — `fundamentos-teoria-01` (Vetores)

Primeira execução da Camada 3. O template está em [`../CAMADA3.md`](../CAMADA3.md); este
arquivo é o template **instanciado** com o manifesto e os trechos citados, pronto para colar
numa sessão nova — sem histórico, sem acesso ao repositório. É assim que ele deve rodar: o
gerador recebe o manifesto e a fonte, e nada mais.

**Como usar.** Cole o bloco abaixo inteiro numa sessão nova. A saída é um `LessonContent`
(o objeto literal, sem markdown em volta). Depois: nível 1 (prompt de auditoria contra os
mesmos trechos), nível 2 (`npm run validate:manifests` — o `numericExample` do manifesto já
roda no motor), e nível 3 (o checklist de 4 itens do `CAMADA3.md`).

Por que esta lição: é a mais limpa das 12 — slots canônicos, um arquivo de origem, exemplo
verificável à mão, nenhum `knownGap` declarado e 12 minutos estimados. Se o arco
pergunta → exploração → fórmula não sobreviver aqui, não sobrevive em nenhuma.

**Nota de revisão (2026-10-04).** O resultado da primeira execução foi lido por inteiro pelo
autor e devolveu dois defeitos reais no passo 2 — o widget contradizia o texto (a janela fixa
fazia `λv` sair do quadro enquanto o passo dizia que nada sai do plano) e o termo *escalar*
só aparecia no passo 3, depois de o aluno ter feito a operação por um passo inteiro sem nome
para ela. O prompt abaixo é o que rodou; as duas regras que faltavam foram acrescentadas ao
[`../CAMADA3.md`](../CAMADA3.md) e **não** foram retroagidas neste arquivo, para ele continuar
sendo o registro do que produziu esta lição. Ao gerar a próxima, use o template atualizado.

---

```text
Você está gerando o conteúdo de uma lição de um curso interativo de Machine Learning.
A lição é a primeira do módulo de teoria do Curso 1 (Fundamentos Matemáticos para ML).

MANIFESTO DA LIÇÃO (o contrato — ele diz o que a lição tem de ter):

{
  "lessonId": "fundamentos-teoria-01",
  "moduleId": "fundamentos-teoria",
  "order": 1,
  "title": "Vetores: a matéria-prima dos dados",
  "objective": "O aluno escreve vetor como lista ordenada, entende espaço vetorial ℝⁿ como conjunto fechado por soma e multiplicação por escalar, e descreve qualquer ponto/dado como combinação linear de vetores base.",
  "prerequisites": [],
  "sourceRefs": ["mml-2.4", "mml-2.5"],
  "sourceFiles": ["mml/02-linear-algebra.md"],
  "widget": "VectorSpaceWidget",
  "widgetConfig": {
    "space": "2d",
    "bases": [[1, 0], [0, 1]],
    "availableOps": ["sum", "scale", "linearCombination"]
  },
  "keyFormulas": [
    "\\boldsymbol{v} = \\sum_{i=1}^k \\lambda_i \\boldsymbol{x}_i",
    "\\boldsymbol{x} + \\boldsymbol{y} = (x_1 + y_1, \\dots, x_n + y_n)^\\top",
    "\\lambda \\boldsymbol{x} = (\\lambda x_1, \\dots, \\lambda x_n)^\\top"
  ],
  "numericExample": {
    "description": "Combinar linearmente: v = 2·(1,0) + 3·(0,1)",
    "inputs": { "c": [2, 3], "base": [[1, 0], [0, 1]] },
    "expected": "v = (2, 3)",
    "expectedValues": [2, 3],
    "sourceRef": "mml-2.5"
  },
  "completionCriterion": "Na widget, o aluno monta um vetor alvo usando combinação linear e o sistema confirma que v = Σ cᵢ bᵢ.",
  "estimatedMinutes": 12,
  "status": "draft",
  "knownGaps": []
}

FONTE AUTORITATIVA (única fonte permitida — não use conhecimento externo):

--- mml/02-linear-algebra.md, seção §2.4 ---

## mml-2.4 — Espaços Vetoriais e Subespaços

* **(a) Definições Formais e Notação Exata:**
  * **Espaço Vetorial:** Estrutura \(V = (V, +, \cdot)\) composta por um conjunto \(V\) e duas operações (adição \(+: V \times V \to V\) e multiplicação escalar \(\cdot: \mathbb{R} \times V \to V\)) que satisfazem as propriedades de grupo abeliano sob adição e distributividade/associatividade sob multiplicação escalar.
  * **Subespaço Vetorial (Seção 2.4.3):** Um subconjunto \(U \subseteq V\) é um subespaço de \(V\) se \(U \neq \emptyset\) e \(U\) for fechado sob adição e multiplicação por escalar (ou seja, \(\mathbf{0} \in U\) e \(\forall \boldsymbol{x}, \boldsymbol{y} \in U, \lambda, \psi \in \mathbb{R} \implies \lambda\boldsymbol{x} + \psi\boldsymbol{y} \in U\)).
* **(b) Intuição Geométrica:**
  O espaço vetorial \(\mathbb{R}^2\) representa todo o plano 2D centrado na origem \((0,0)\). Um **subespaço vetorial** em \(\mathbb{R}^2\) só pode ser: o ponto de origem \(\{\mathbf{0}\}\), qualquer reta que passe necessariamente pela origem, ou todo o plano \(\mathbb{R}^2\). A propriedade de **fechamento** garante que operações vetoriais nunca saem do subespaço.
* **(c) Exemplo Numérico em 2D:**
  O conjunto de pontos \(U = \left\{ \boldsymbol{x} \in \mathbb{R}^2 : x_2 = 3x_1 \right\} = \text{span}\left(\begin{bmatrix} 1 \\ 3 \end{bmatrix}\right)\) forma uma reta passando pela origem em \(\mathbb{R}^2\), constituindo um subespaço vetorial válido.
* **(d) Aplicação nos Modelos:**
  Os dados de entrada são representados como vetores pertencentes ao espaço vetorial \(\mathbb{R}^D\). Em técnicas de redução de dimensionalidade (como PCA e Autoencoders), busca-se encontrar um subespaço vetorial de menor dimensão que capture a maior parte da estrutura dos dados.
* **(e) Fórmulas Relevantes:**
  * Adição em \(\mathbb{R}^n\): \(\boldsymbol{x} + \boldsymbol{y} = (x_1 + y_1, \dots, x_n + y_n)^\top\).
  * Multiplicação escalar em \(\mathbb{R}^n\): \(\lambda \boldsymbol{x} = (\lambda x_1, \dots, \lambda x_n)^\top\).

--- mml/02-linear-algebra.md, seção §2.5 ---

## mml-2.5 — Combinação Linear e Independência Linear

* **(a) Definições Formais e Notação Exata:**
  * **Combinação Linear:** Para vetores \(\boldsymbol{x}_1, \dots, \boldsymbol{x}_k \in V\) e escalares \(\lambda_1, \dots, \lambda_k \in \mathbb{R}\), o vetor \(\boldsymbol{v} = \sum_{i=1}^k \lambda_i \boldsymbol{x}_i\) é uma combinação linear.
  * **Independência Linear (Seção 2.5):** Os vetores \(\{\boldsymbol{x}_1, \dots, \boldsymbol{x}_k\}\) são **linearmente independentes** se a equação:
    \[\sum_{i=1}^k \lambda_i \boldsymbol{x}_i = \mathbf{0}\]
    tiver como única solução os escalares triviais \(\lambda_1 = \lambda_2 = \dots = \lambda_k = 0\). Se existir algum \(\lambda_i \neq 0\), eles são **linearmente dependentes**.
* **(b) Intuição Geométrica:**
  Dois vetores em \(\mathbb{R}^2\) são linearmente independentes se apontam para direções não colineares (não estão na mesma reta); juntos, eles cobrem (*span*) todo o plano 2D. O livro ilustra com um exemplo geográfico: descrever a localização de Kigali a partir de Nairóbi combinando "506 km a Noroeste" e "374 km a Sudoeste" é suficiente; adicionar "751 km a Oeste" é uma informação redundante (combinação linear das anteriores), tornando o conjunto de três vetores linearmente dependente.
* **(c) Exemplo Numérico em 2D:**
  Os vetores \(\boldsymbol{x}_1 = \begin{bmatrix} 1 \\ 0 \end{bmatrix}\) e \(\boldsymbol{x}_2 = \begin{bmatrix} 0 \\ 1 \end{bmatrix}\) são linearmente independentes. Adicionar o vetor \(\boldsymbol{x}_3 = \begin{bmatrix} 2 \\ 3 \end{bmatrix} = 2\boldsymbol{x}_1 + 3\boldsymbol{x}_2\) cria um conjunto linearmente dependente.
* **(d) Aplicação nos Modelos:**
  Garante a ausência de multicolinearidade perfeita na matriz de dados de entrada \(\boldsymbol{X}\). Para que a matriz \(\boldsymbol{X}^\top\boldsymbol{X}\) da Regressão Linear seja invertível, suas colunas (recursos/features) precisam ser linearmente independentes.
* **(e) Fórmulas Relevantes:**
  * Teste de independência linear: \(\sum_{i=1}^k \lambda_i \boldsymbol{x}_i = \mathbf{0} \iff \lambda_1 = \dots = \lambda_k = 0\).

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
  id                              string    — estável na lição: "passo-1", "passo-2", …
  title                           string    — curto e concreto
  narrative                       string[]  — 2 a 4 frases por bloco, um bloco por ideia
  katex                           string[]  — fórmulas em KaTeX, copiadas literalmente da fonte
  widgetInteraction.widgetId      string    — "VectorSpaceWidget", sem alteração
  widgetInteraction.prompt        string    — instrução imperativa ao aluno
  widgetInteraction.expectedInsight string  — o que o aluno deve NOTAR neste passo
  checkpoint.question             string
  checkpoint.answer               string
  sourceRefs                      string[]  — subconjunto de ["mml-2.4", "mml-2.5"]

REGRAS DE FIDELIDADE:

1. Toda fórmula em `katex` vem literalmente da FONTE AUTORITATIVA, preservando a notação:
   copie os mesmos caracteres (`\boldsymbol{}`, `\mathbf{}`, `^\top`, `\sum_{i=1}^k`,
   `\mathbb{R}`, `\begin{bmatrix} … \end{bmatrix}`). Não simplifique, não traduza símbolo,
   não reescreva.
2. Cite a seção de origem em cada bloco do `narrative`, no formato [MML §2.4] ou [MML §2.5].
   Só essas duas seções existem para esta lição.
3. **Nunca cite uma seção de Further Reading.** A bibliografia não é conteúdo. Todo capítulo
   do MML fecha com uma seção chamada *Further Reading*; ela lista leituras, não ensina nada.
   As únicas seções que você pode citar aqui são §2.4 e §2.5.
4. Use o exemplo numérico do manifesto como o exemplo da lição: v = 2·(1,0) + 3·(0,1), com
   o resultado v = (2, 3). Números pequenos, no máximo 2 casas, verificáveis à mão.
5. Português, com o termo técnico em inglês entre parênteses na primeira aparição.
6. Se a fonte não cobrir algo que o manifesto pede, devolva `{ "gap": "…" }` descrevendo o
   que falta, em vez de inventar. Um gap declarado é útil; uma fórmula plausível e inventada
   é o erro que este pipeline existe para impedir.

REGRAS DE ARCO (o requisito didático — leia com atenção, é onde a geração costuma falhar):

O app de Cálculo, que já funciona, segue sempre o mesmo arco: o aluno explora e observa
algumas vezes, e SÓ NO ÚLTIMO passo a fórmula geral ganha nome. Medido nas 7 lições dele:
todas terminam nomeando a fórmula, todas abrem com exploração, e nenhuma abre pela fórmula.

- Gere **3 passos** (2 a 4 é o intervalo; 3 é o alvo para 12 minutos).
- Os passos 1 e 2 são **exploração**: o `narrative` descreve o que o aluno vê enquanto mexe
  no widget, sem enunciar a fórmula e sem entregar a conclusão. O `expectedInsight` diz qual
  conclusão ele deve tirar sozinho.
- O passo 3 **nomeia a fórmula**: o `title` diz que é a fórmula, o `katex` traz as fórmulas
  relevantes, e o `checkpoint` pergunta ao aluno o que ele acabou de descobrir.
- **Nenhum passo antes do último enuncia a fórmula.** Se o passo 1 já dá a fórmula, os outros
  viram ilustração — esse é o modo padrão de escrever e é o modo errado aqui.
- O primeiro bloco do primeiro passo abre com um **cenário concreto**: um problema prático,
  com números, que o aluno queira resolver e não possa calcular direto. O cenário não
  menciona "espaço vetorial" nem "combinação linear" — ele dá a pergunta; a matemática vem
  depois, e é o aluno que a nomeia. Exemplo da voz do Cálculo (não copie o conteúdo, copie a
  forma): "Você está analisando os dados de um carro entre os marcos 2 e 3 de uma estrada. O
  velocímetro falhou exatamente no marco 2, mas os dados de distância ao redor desse ponto
  ainda estão disponíveis. Como estimar o comportamento do carro quando ele se aproxima do
  marco 2?"

O widget é o `VectorSpaceWidget`, em ℝ², com a base canônica b₁ = (1,0) e b₂ = (0,1). Ele
mostra os vetores da base, dois coeficientes c₁ e c₂ que o aluno ajusta, o vetor resultante
v = c₁b₁ + c₂b₂ desenhado no plano, e um vetor alvo que o aluno tenta alcançar. Três
operações disponíveis: soma, multiplicação por escalar e combinação linear. Escreva o
`prompt` e o `expectedInsight` de cada passo sabendo disso — e lembre que o aluno ainda não
conhece a notação.

ANTES DE RESPONDER, confira:

- [ ] Todo campo de `LessonContent` e de `LessonContentStep` está presente em todos os passos?
- [ ] Todo passo tem `id`, `title`, `narrative`, `katex`, `widgetInteraction` (com os três
      subcampos), `checkpoint` (com os dois) e `sourceRefs`?
- [ ] O passo 3 é o único que enuncia a fórmula?
- [ ] Toda citação é §2.4 ou §2.5 — nenhuma *Further Reading*?
- [ ] Toda fórmula em `katex` é uma cópia literal da fonte?
- [ ] O cenário de abertura é concreto e não menciona a notação?
- [ ] O exemplo do manifesto (v = 2·(1,0) + 3·(0,1) = (2,3)) aparece?

Responda apenas com o objeto, sem markdown em volta.
```
