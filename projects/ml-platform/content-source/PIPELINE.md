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
