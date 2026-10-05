# Pipeline de conteúdo — ml-platform

Plano de referência para transformar os `.md` brutos do NotebookLM em conteúdo de lição
confiável. Versionado em **2026-09-20**, na versão **dump-01** (ver `README.md`).

> **Ajustes em relação ao texto original do autor**, aplicados para não contradizer o repositório:
> 1. O mapa da Camada 1 citava `10-classification.md` e `12-gaussian-mixture.md`; os arquivos
>    foram renomeados para **`11-gaussian-mixture.md`** e **`12-classification.md`**, seguindo o
>    número do capítulo do livro (decisão de 2026-09-20).
> 2. O texto de `05-derivatives-gradients.md` citava "§5.1–§5.3", mas o arquivo extraído cobre
>    §5.1–§5.6. Por decisão de 2026-09-20 o material extra é **mantido** como consulta, e o
>    manifesto da lição 05 cita apenas `mml-5.1` a `mml-5.3`.

O princípio central: os `.md` extraídos **não são as lições** — eles são a fonte da verdade.
Trate-os como um banco de dados imutável, e as lições como derivados gerados sob demanda,
sempre verificáveis contra a fonte. Isso é o que torna a geração confiável em vez de uma
loteria a cada prompt.

---

## Camada 1 — Transforme os artefatos em fonte da verdade versionada

Os `.md` do NotebookLM saem como um bloco gigante. Um prompt que recebe 40KB de contexto
misturado produz respostas genéricas. Divida cada artefato por capítulo/seção, com IDs estáveis:

```
content-source/
├── mml/
│   ├── 02-linear-algebra.md
│   ├── 03-analytic-geometry.md
│   ├── 04-matrix-decompositions.md
│   ├── 05-derivatives-gradients.md      ← contém §5.1–§5.3
│   ├── 07-continuous-optimization.md
│   ├── 09-linear-regression.md          ← contém §9.1–§9.3
│   ├── 11-gaussian-mixture.md           ← §11.1–§11.5
│   └── 12-classification.md             ← §12.1–§12.5
├── nndl/
│   ├── 01-recognition.md                ← §1.1–§1.7
│   ├── 02-backprop.md
│   ├── 03-techniques.md
│   └── 04-visual-proof.md
└── README.md                            ← registra data do dump e versão
```

### Três regras que fazem toda a diferença na confiabilidade

1. **Nunca edite um trecho extraído.** Se algo estiver errado, o erro veio da extração — você
   regera a extração, não corrige o arquivo "no dedo". Isso mantém a cadeia de confiança intacta.
2. **Cada arquivo guarda o ID da seção como heading** (`## mml-9.2 — Parameter Estimation`).
   O ID é o endereço que os prompts vão citar.
3. **Versione no repositório.** Quando você trocar de livro ou re-extrair, um `git diff` mostra
   exatamente o que mudou no conteúdo — e você revalida só as lições afetadas.

---

## Camada 2 — Crie um manifesto por lição (o "contrato" de cada passo)

Antes de gerar qualquer conteúdo, você define o que a lição precisa ter, em um arquivo pequeno
e auditável:

```json
{
  "lessonId": "fundamentos-teoria-05",
  "title": "Derivada e Gradiente",
  "objective": "O aluno entende o gradiente como direção de maior crescimento e o vê apontando para o mínimo da função de custo",
  "sourceRefs": ["mml-5.1", "mml-5.2", "mml-5.3"],
  "widget": "GradientWidget",
  "keyFormulas": ["gradiente ∇f(x,y) = [∂f/∂x, ∂f/∂y]"],
  "completionCriterion": "O aluno prevê corretamente a direção do gradiente em 3 pontos da widget"
}
```

Isso resolve o maior risco do pipeline: **deriva**. Sem manifesto, o prompt "gere a lição de
gradiente" produz algo diferente toda vez, e você não tem como saber se esqueceu algo do livro.
Com manifesto, a geração tem um alvo fechado — e o `sourceRefs` garante que nada do mapeamento
livro→lição se perca.

---

## Camada 3 — O loop de geração: um prompt por passo, com contexto mínimo

A regra de ouro: **nunca** peça "gere a lição X" passando os dois `.md` inteiros. Passe o
manifesto + apenas os trechos referenciados. O prompt padrão:

```text
Você está gerando conteúdo de uma lição de um curso interativo de ML.

MANIFESTO DA LIÇÃO:
[cole o JSON da Camada 2]

FONTE AUTORITATIVA (única fonte permitida — não use conhecimento externo):
[cole apenas os arquivos mml/05-derivatives-gradients.md]

CONTRATO DE SAÍDA:
Gere o conteúdo como objeto TS tipado que satisfaz `LessonContentStep` de
`libs/ml-engine/lesson-content.types.ts` (importável como `@ml/engine`):
id, title, narrative[], katex[], widgetInteraction { widgetId, prompt,
expectedInsight }, checkpoint { question, answer } e sourceRefs[] com as seções
citadas — o mesmo vocabulário do manifesto.

O nome NÃO é `LessonStep` de propósito: esse já é o modelo de runtime do app de
Cálculo. Este é o contrato de geração, e vive no motor.

REGRAS DE FIDELIDADE:
1. Toda fórmula deve vir literalmente da FONTE AUTORITATIVA, preservando
   a notação do livro (ex: ∇, transposta ᵀ, espaços ℝⁿ).
2. Cite a seção de origem em cada bloco: ex. "[MML §5.2]".
3. O exemplo numérico deve ser verificável à mão (números pequenos, ≤ 2 casas).
4. Se a fonte não cobrir algo que o manifesto pede, retorne
   { "gap": "..." } em vez de inventar.
```

O item 4 é o mais importante de todos: a opção de admitir um gap é o que impede alucinação.
Um modelo que "não pode" dizer que não sabe vai inventar uma fórmula plausível. Um modelo com
saída de escape sinaliza o buraco, e você resolve (nota autônoma, novo prompt de extração no
NotebookLM, ou ajuste do manifesto).

---

## Verificação — o passo que a maioria pula (e não deveria)

Geração confiável = geração + auditoria. Três níveis, do barato ao caro:

### 1. Auditoria por prompt (após gerar cada passo)

```text
Verifique o conteúdo abaixo contra a FONTE AUTORITATIVA. Liste TODAS as
divergências: fórmulas alteradas, notação inconsistente, exemplos numéricos
incorretos, afirmações que não existem na fonte. Responda apenas com a
lista de problemas — não regenere o conteúdo.

CONTEÚDO GERADO: [cole o output]
FONTE: [cole os mesmos trechos da geração]
```

### 2. Testes unitários nos exemplos numéricos

Se a lição diz "com learning rate 0.1, o MSE cai de 4.2 para 1.8 em 3 iterações", isso vira um
teste no `ml-engine`:

```ts
// O teste real não é escrito à mão: a fixture é gerada dos manifestos
// (`npm run examples:build`) e o spec despacha por lessonId para o motor.
'fundamentos-aplicada-02': (i) => {
  const design = designMatrix(vectorOf(i['X'], 'X'));
  const y = vectorOf(i['y'], 'y');
  const initial = vectorOf(i['init'], 'init');
  return [
    ...mseGradient(design, y, initial),
    ...gradientDescentStep(design, y, initial, numberOf(i['lr'], 'lr')),
  ];
},
```

Implementado em `libs/ml-engine` (motor) + `src/app/ml-engine` (specs). O teste
compara cada número de `expectedValues` com o que o motor devolve **e** confere que
esse número aparece no texto do exemplo — prosa e conta não podem divergir.

Se o teste falha, ou a lição está errada ou o código está — e você descobre antes de publicar.
Bônus: esses testes viram a suíte de regressão do `ml-engine`, que é código que alunos verão
rodando.

### 3. Checklist humano (curto, 4 itens, por lição)

- As fórmulas batem com o livro?
- O insight da widget é realmente "visível" ao interagir?
- A sequência discovery-based funciona (pergunta → exploração → fórmula)?
- Dá para completar em menos de ~15 minutos?

---

## O fluxo completo por lição

1. **Escrever manifesto** (você, 10 min — baseado no mapeamento livro→lição)
2. **Gerar passo a passo** (1 prompt por passo, com trechos mínimos)
3. **Auditar** (prompt de verificação + teste unitário do exemplo numérico)
4. **Revisar** (checklist de 4 itens)
5. **Commit** (lição + teste no mesmo commit, rastreável)
6. **Próxima lição**

---

## Duas observações finais de escala

- **Gere em lotes curtos, não em surto.** Para o seu caso, o padrão que funciona melhor é
  1 sessão = 1 módulo teórico (5–7 lições), começando pelo Curso 1. TDAH-friendly e cada commit
  fecha uma unidade coerente.
- **A Camada 1 é um investimento único; as Camadas 2–3 se pagam a cada lição.** No dia em que
  você adicionar o *Grokking* ou o Géron, o pipeline inteiro se mantém — só entram arquivos novos
  em `content-source/` e manifests apontando para eles.

> Esse processo de manifesto → geração → auditoria vai se repetir umas **30+ vezes** ao longo do
> projeto.

---

## Aderência ao plano (estado do repositório em 2026-09-20)

| Exigência do plano | Estado | Ação necessária |
| :--- | :--- | :--- |
| Camada 1: divisão por capítulo | **feito** — 12 arquivos + README | — |
| Camada 1: IDs de seção estáveis (`## mml-5.2 — …`) | **feito nos caps. 2, 3, 4, 5, 6, 7 e 9** — **46 IDs de seção** + 4 de capítulo, **ancorados no número da seção do livro**; a sequência pula onde a extração não trouxe a seção | caps. 11 e 12 extraídos sem IDs (11 precisa re-extração; 12 depende de confirmar §12.2.5/§12.3.2) |
| Camada 1: versionamento + hashes do dump | **feito** (`README.md`, `dump-01`) | atualizar a cada re-extração |
| Camada 2: manifests por lição | **feito** — `../manifests/` com schema v2, `registries.json` (widgets + datasets) e os **12 manifestos do Curso 1**; gate `npm run validate:manifests` valida endereços, registries e prerequisites — **12 de 12 verdes** | gerar o conteúdo (Camada 3) |
| Camada 2: `keyFormulas` literais da fonte | **feito** — as fórmulas dos 12 manifestos foram extraídas mecanicamente da fonte, e o gate recusa fórmula que não esteja literalmente nos `sourceFiles` | ao criar lição: copiar da fonte, não reescrever |
| Camada 3: contrato de conteúdo | **feito** — `LessonContentStep` / `LessonContent` / `LessonContentGap` em `libs/ml-engine/lesson-content.types.ts` | usar como contrato de saída do prompt |
| Camada 3: prompt templates versionados | **parcial** — os prompts estão neste arquivo, que é versionado, mas ainda não como templates separados com placeholders | extrair quando a primeira lição for gerada |
| Verificação: motor para os testes numéricos | **feito** — `libs/ml-engine` (vetores, matrizes, regressão, probabilidade, registro de funções) com specs em `src/app/ml-engine`; `npm run test:headless` roda 56 specs, incluindo os 10 exemplos numéricos verificáveis | acrescentar avaliador ao criar lição com `expectedValues` |
| Checklist humano + commits rastreáveis | processo, não código | — |

> **O que mudou desde este retrato (2026-09-20).** A tabela acima é um instantâneo datado e
> fica como está; para o estado atual, a fonte é o resto do repositório. Os deltas: os IDs
> ancorados passaram de **46 seções + 4 capítulos** para **52 seções + 5 capítulos** (57
> headings, contados pelo gate) depois do dump-03; o **template da Camada 3 foi extraído**
> para [`CAMADA3.md`](./CAMADA3.md), com o prompt do piloto em
> [`prompts/`](./prompts/); a **primeira lição foi gerada e auditada**
> (`fundamentos-teoria-01`, ver [`../src/app/lessons/README.md`](../src/app/lessons/README.md)),
> então a ação pendente da Camada 2 está cumprida para ela; e `npm run test:headless` roda
> **74 specs**, não 56.

**Numeração resolvida (2026-09-20):** os IDs passaram a ser o **número da seção do livro**
(`## mml-5.2 — Derivadas Parciais e Gradiente`), reancorando `mml/02` e `mml/05`. Antes o ID era
ordinal do arquivo, e em 02/05 isso estava deslocado: `mml-5.2` existia e resolvia, mas apontava
para a Jacobiana enquanto o manifesto pedia o gradiente — endereço errado é endereço válido, então
o gate não tinha como pegar. Agora os buracos na sequência (sem §2.2, sem §5.1 nem §5.5) denunciam
o que a extração não trouxe. Ver
[`../content-source/README.md`](../content-source/README.md#numeração-o-id-é-a-seção-do-livro).

### Sobre o contrato de conteúdo

O contrato de geração **não se chama `LessonStep`** — esse nome é do app de Cálculo, onde o passo
é um modelo de runtime (validação, opções, enum de widget). O contrato do ML é
`LessonContentStep`, em `libs/ml-engine/lesson-content.types.ts`, e descreve apenas o que o
gerador produz. O manifesto é a ponte: ele nomeia o widget e o critério de conclusão, e o runtime
mapeia depois. Nota histórica: esta seção era uma dúvida em aberto até 2026-09-22; a decisão
segue registrada em `../manifests/README.md`.

---

## Prompts de extração — Camada 1 (rodada complementar, 2026-10-04)

Os oito prompts que produziram [`../syllabus-content/MML_cursos_1_2_4_complemento.md`](../syllabus-content/MML_cursos_1_2_4_complemento.md).
Rodam no NotebookLM com o livro carregado (`mml-book.pdf`, Draft 2024-01-15), **um prompt por vez**.
Respondem aos três defeitos que a primeira extração deixou: uma seção faltando, âncoras inventadas e
uma seção sem endereço própria.

Duas regras valem para todos eles, e são o que torna a saída utilizável como fonte:

1. **Só o arquivo carregado** — nada de conhecimento externo; quando algo não está no livro, a
   resposta escreve "não encontrado no arquivo" em vez de preencher.
2. **Todo bloco começa repetindo o número e o título exatos da seção**, para a âncora poder ser
   conferida contra o sumário em vez de presumida.

O **Prompt 0 é obrigatório e vem primeiro**: ele verifica a numeração contra a cópia carregada, e é
o que impede os outros sete de mirarem seções que não existem.

### Prompt 0 — sumário do arquivo (verificação de âncora)

```text
Liste o sumário completo do livro Mathematics for Machine Learning (Deisenroth, Faisal & Ong) que está carregado neste notebook, exatamente como está no arquivo.

Para cada capítulo: número e título. Para cada seção e subseção: número e título, incluindo as subseções (5.1.1, 7.3.1, 9.2.3, ...).

Regras:
- Copie número e título como aparecem; não traduza, não agrupe, não resuma.
- Só o arquivo carregado. Se algo não estiver lá, escreva "não encontrado no arquivo".
- Ao final: informe a edição/versão do arquivo (ex.: Draft 2024-01-15) e quantos capítulos ele tem.

Formato: uma linha por item — "5.1.2 — Differentiation Rules".
```

### Prompt 1 — §5.1, a seção que faltava

```text
Extraia do MML a Seção 5.1 (Differentiation of Univariate Functions), incluindo as subseções 5.1.1 (Taylor Series) e 5.1.2 (Differentiation Rules).

Use o mesmo template (a)–(e) das extrações de capítulo já feitas:
(a) Definições Formais e Notação Exata
(b) Intuição Geométrica
(c) Exemplo Numérico Pequeno em 2D
(d) Como o Conceito Aparece nos Outros Modelos (Regressor Linear, Classificador, Rede Neural, Clusterizador)
(e) Fórmulas Relevantes

Regras:
- Fonte única: só o livro carregado. Nenhum conhecimento externo.
- Preserve a notação do livro em LaTeX, no formato \( ... \) e \[ ... \] que já usamos.
- Escreva em português, com o termo técnico em inglês entre parênteses na primeira aparição.
- Exemplo numérico verificável à mão: números pequenos, no máximo 2 casas.
- Cite a seção de origem em cada bloco, no formato [MML §5.1.2].
- Se um item do template não existir nesta seção, escreva "não há" — não invente.
- Comece a resposta repetindo o número e o título exatos da seção, para eu conferir a âncora.
```

### Prompt 2 — §5.5 como seção própria

```text
Extraia do MML a Seção 5.5 (Useful Identities for Computing Gradients) como uma seção própria e endereçável — não como apêndice da 5.4.

Traga a tabela completa de identidades exatamente como o livro a apresenta, com a notação preservada (∇, transposta ᵀ, tr(·), ⊗), em LaTeX no formato \( ... \) e \[ ... \].

Estrutura da resposta:
1. Primeiro, número e título exatos da seção, como aparecem no livro.
2. Depois o template (a)–(e): definições e notação; intuição; um exemplo numérico pequeno em 2D usando duas ou três das identidades; onde cada identidade reaparece nos quatro modelos do curso; e a lista de fórmulas.
3. Ao final, uma lista só das identidades, uma por linha, em LaTeX puro, para eu conferir contra a fonte.

Regras: só o livro carregado; nada de conhecimento externo; se algo não estiver no arquivo, escreva "não encontrado no arquivo".
```

### Prompt 3 — Capítulo 9 reancorado

```text
Extraia do MML o Capítulo 9 (Linear Regression) de novo, mas agora **uma seção por bloco, com o número da seção do livro no título de cada bloco** — sem agrupar tópicos e sem renumerar.

Blocos pedidos, nesta ordem:
1. §9.1 Problem Formulation
2. §9.2 Parameter Estimation
3. §9.2.1 Maximum Likelihood Estimation
4. §9.2.2 Overfitting in Linear Regression
5. §9.2.3 Maximum A Posteriori Estimation
6. §9.2.4 MAP Estimation as Regularization
7. §9.3 Bayesian Linear Regression
8. §9.4 Maximum Likelihood as Orthogonal Projection

Para cada bloco, use o template (a)–(e) na íntegra.

Regras:
- Só o livro carregado; nenhum conhecimento externo.
- Não junte duas seções num bloco, mesmo que o conteúdo seja curto.
- Preserve a notação em LaTeX no formato \( ... \) e \[ ... \]; cite a origem em cada bloco como [MML §9.2.3].
- Português, com o termo técnico em inglês entre parênteses na primeira aparição.
- Se um bloco pedido não existir no arquivo, escreva "não existe no arquivo" em vez de preencher com o que vier depois.

Comece com o número e o título exatos de cada seção, um por linha, e só então o conteúdo.
```

### Prompt 4 — Capítulo 7 reancorado

```text
No MML, a Seção 7.3 é Convex Optimization. Extraia as três subseções dela, cada uma como bloco próprio e endereçável, com o número exato no título:

1. §7.3.1 Linear Programming
2. §7.3.2 Quadratic Programming
3. §7.3.3 Legendre–Fenchel Transform and Convex Conjugate

Para cada bloco, template (a)–(e), notação em LaTeX no formato \( ... \) e \[ ... \], português com o termo técnico em inglês entre parênteses, e a origem citada como [MML §7.3.1].

Regras: só o livro carregado; não misture as três; se uma delas não existir no arquivo, diga isso em vez de preencher.

Depois do conteúdo, responda separadamente, em duas linhas, só o número e o título exatos de:
- a Seção 7.4 do livro;
- a Seção 7.5, se ela existir;
conforme o arquivo carregado.
```

### Prompt 5 — Capítulo 2, o endereço de imagem/núcleo

```text
No MML, a Seção 2.7 é Linear Mappings. Antes de extrair, responda com o número e o título exatos, como aparecem no arquivo carregado:
- o que é a §2.7.1?
- o que é a §2.7.2?
- o que é a §2.7.3?

Depois, extraia a subseção que trata de **imagem (range) e núcleo (kernel / null space)**, sob o número que você acabou de confirmar — não sob outro.

Conteúdo: definição formal de imagem e de núcleo, a relação com posto e com injetividade/sobrejetividade, o teorema da nulidade e posto (rank-nullity), um exemplo numérico pequeno com matriz 2×2, e como isso reaparece no Regressor Linear (subespaço gerado pelas colunas de Φ) e no PCA. Template (a)–(e), LaTeX no formato \( ... \) e \[ ... \].

Regras: só o livro carregado; nada de conhecimento externo; se a subseção não existir, escreva "não existe no arquivo".
```

### Prompt 6 — Capítulo 6, mudança de variáveis

```text
No MML, responda primeiro, com o número e o título exatos conforme o arquivo carregado:
- qual é o título da §6.4.6?
- qual é o título da §6.7?

Depois extraia a §6.7 (Change of Variables / Inverse Transform) como bloco próprio e endereçável sob o número §6.7 — ela hoje está sem endereço. Template (a)–(e), com a fórmula da transformação de densidades em LaTeX exatamente como no livro, um exemplo numérico pequeno, e onde isso reaparece nos modelos (mudança de variáveis em distribuições no Clusterizador/GMM).

Se a §6.4.6 tiver conteúdo próprio diferente desse, extraia-o também, em bloco separado, sob o número §6.4.6.

Regras: só o livro carregado; nada de conhecimento externo; não junte as duas seções.
```

### Prompt 7 — Capítulo 1 (abertura do curso)

```text
Extraia do MML o Capítulo 1 (Introduction and Motivation): a motivação do livro, a ideia de dados como vetores, o par modelo/preditor e o aprendizado como otimização — incluindo a §1.1 (Finding Words for Intuitions).

Use o template (a)–(e). Como o próprio livro diz que este capítulo não traz definições formais nem fórmulas deduzidas, nos itens (a) e (e) escreva exatamente o que o livro oferece e marque o resto como "não há" — não importe formalismo do Capítulo 2.

Regras: só o livro carregado; nada de conhecimento externo; português com o termo técnico em inglês entre parênteses.
```

### O que os prompts 4, 5 e 6 não fixaram

O template (a)–(e) foi escrito por extenso nos prompts 1, 2 e 3, e só citado nos prompts 4, 5, 6 e 7 —
que então devolveram estruturas próprias ("Problema Primal / Derivação do Lagrangiano…"). O conteúdo
está correto e endereçado; o rótulo dos blocos é que não é o da casa. Se a uniformidade importar para
a geração, reextraia essas quatro seções com os itens (a)–(e) escritos por extenso, como no Prompt 1.
