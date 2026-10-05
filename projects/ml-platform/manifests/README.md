# manifests — Camada 2 do pipeline

Um arquivo JSON por lição: o **contrato** que a geração precisa acertar. Antes de gerar
conteúdo, o manifesto já diz o que a lição tem, de qual seção do livro ela vem, qual widget a
sustenta, de quais lições ela depende e como saber que o aluno terminou.

Vive fora de `content-source/` de propósito: lá dentro são os dumps extraídos, imutáveis; aqui
são contratos derivados. Um `git diff` em `content-source/` continua mostrando só o que mudou na
fonte.

| Arquivo | Papel |
| :--- | :--- |
| `manifest.schema.json` | JSON Schema (draft 2020-12) — a definição normativa dos campos |
| `registries.json` | Vocabulário fechado: nomes de widget e IDs de dataset |
| `book-sections.json` | Vocabulário fechado dos **endereços que o livro tem** (`mml-2.7.3` → "Image and Kernel"), fixado por edição. Não é manifesto: é a régua contra a qual o gate confere todo `sourceRef` **e** todo heading de `content-source/` |
| `fundamentos-*.json` | Os 12 manifestos do Curso 1 (7 do módulo teoria, 5 do aplicada) |

### Por que existe o `book-sections.json`

Porque um `sourceRef` pode resolver e mesmo assim mentir. O gate conferia que `mml-9.5` existia
como heading — e existia, porque a extração o tinha escrito. O que ele não tinha como saber é que
o livro **não tem** §9.6, e que §9.5 é *Further Reading*. Oito IDs assim conviveram com o gate verde
até 2026-10-04 (ver `content-source/README.md`, § A rodada complementar). Endereço errado é endereço
válido, e um gate que só olha o arquivo extraído nunca vê a diferença.

O que ele confere agora, e o que não confere:

| Situação | Resultado |
| :--- | :--- |
| O endereço não existe no livro (`mml-7.5`, `mml-9.6`) | **erro**, com a lista de endereços do capítulo |
| O endereço existe mas é bibliografia (`mml-7.4`, `mml-9.5` = *Further Reading*) | **erro** — nenhuma lição se ancora em bibliografia |
| O número é válido, mas o título entre parênteses do heading é o de **outro** endereço | **nota**, e o gate diz qual endereço tem aquele título |
| O número é válido e o heading não repete o título do livro em inglês | **nada** — não há como julgar sem ler. Foi o caso de dois dos oito |

Ou seja: dos oito endereços errados de 2026-10-04, este gate pega seis (quatro como erro, dois como
nota). Os outros dois — um heading com "(MAP)" de sigla e outro que só citava um intervalo de seções
— não têm título comparável; para esses o único detector é olhar o sumário, e por isso o
`book-sections.json` existe: conferir um endereço passa a ser uma consulta de um arquivo.

Atualizar o arquivo é conferir o PDF: headings `^N.M Título` (seções — os *exercises* também são
`N.M` e **não** entram) e `^N.M.K Título` (subseções), mais os títulos de capítulo. A receita está
no `$comment` do próprio `book-sections.json`.

## Os três comandos do loop

```bash
npm run validate:manifests   # contrato, endereços, notação das fórmulas, prerequisites
npm run examples:build       # regenera a fixture de testes a partir dos manifestos
npm run test:headless        # roda os testes (motor + exemplos numéricos)
```

---

## Campos

Obrigatórios estão marcados; o resto é opcional e existe porque tem uso declarado.

| Campo | Obrig. | O que é | Como é conferido |
| :--- | :--: | :--- | :--- |
| `lessonId` | ✓ | Endereço estável da lição, `fundamentos-teoria-05` | precisa ser `<moduleId>-<order>` com 2 dígitos |
| `moduleId` | ✓ | Módulo do catálogo (`fundamentos-teoria`) | deve existir em `STUDY_SUBJECTS` — confira à mão ao criar |
| `order` | ✓ | Posição dentro do módulo | entra no `lessonId` |
| `title` | ✓ | Título exibido | — |
| `objective` | ✓ | O que o aluno entende ao fim, em termos observáveis | mínimo de 20 caracteres |
| `prerequisites` | ✓ | lessonIds que vêm antes | cada um precisa existir como manifesto; o grafo não pode ter ciclo |
| `sourceRefs` | ✓ | IDs de seção que sustentam a lição (`mml-5.2`) | cada ref precisa existir como heading em `content-source/` **e** ser um endereço que o livro tem (`book-sections.json`) |
| `sourceFiles` | ✓ | Arquivos entregues ao prompt (contexto mínimo) | existir em disco, e cobrir todo `sourceRef` e toda fórmula |
| `widget` | ✓ | Widget em PascalCase, ou `null` em lição conceitual | precisa estar em `registries.json` |
| `keyFormulas` | ✓ | Fórmulas em LaTeX, **cortadas literalmente** da fonte | cada uma tem de aparecer no texto dos `sourceFiles` |
| `completionCriterion` | ✓ | Como saber que o aluno completou, observável na widget | mínimo de 20 caracteres |
| `slug` | | Id legível para o runtime (`derivada-e-gradiente`) | — |
| `widgetConfig` | | Hiperparâmetros iniciais da widget | dataset citado precisa estar em `registries.json` (aviso) |
| `numericExample` | | `description`, `inputs`, `expected`, `expectedValues`, `sourceRef` | `sourceRef` em `sourceRefs`; `expectedValues` é o que o teste compara |
| `estimatedMinutes` | | Tempo alvo | teto 25 no schema; acima de 15 o gate avisa |
| `status` | | `draft` \| `generated` \| `audited` \| `published` | — |
| `knownGaps` | | Buraco conhecido entre manifesto e fonte | destino do `{ "gap": … }` da regra 4 |

---

## Notação das fórmulas: a fonte decide, o manifesto escolhe o quê

**Decisão de 2026-09-22.** O manifesto guarda a **intenção** — quais fórmulas a lição ensina. A
**notação** vem da fonte da verdade, copiada literalmente:

```json
"keyFormulas": [
  "\\boldsymbol{v} = \\sum_{i=1}^k \\lambda_i \\boldsymbol{x}_i",
  "\\boldsymbol{x} + \\boldsymbol{y} = (x_1 + y_1, \\dots, x_n + y_n)^\\top"
]
```

Por que a notação do livro, e não uma simplificada:

- **mantenível** — é a única escolha que o gate consegue provar: `validate:manifests` normaliza
  espaços e exige que cada fórmula apareça no texto dos `sourceFiles`. Fórmula reescrita à mão
  não é verificável, e "plausível mas inventada" é exatamente o erro que o pipeline existe para
  impedir;
- **exibível** — é o LaTeX que a extração já usa (`\boldsymbol`, `\mathbb`, `^\top`, `\frac`,
  `\operatorname`), que o KaTeX renderiza sem tradução;
- **tratável por IA** — LaTeX padrão, uma string por fórmula, sem macros próprias nem sintaxe
  inventada: o gerador copia, não interpreta.

O custo aceito: `\boldsymbol{x}` (negrito itálico, do livro) em vez de `\mathbf{x}`. É a
notação que o aluno vê no material de referência, então a lição e o livro não divergem.

**`\operatorname{}` entrou em 2026-10-04**, na reextração da §2.7.3 (`mml-2.7.3`): ela saiu com
`\operatorname{ker}`, `\operatorname{Im}`, `\operatorname{dim}` e `\operatorname{rk}`, e é hoje a
única seção do corpus escrita assim — as outras usam `\dim` (`mml/02`, `mml/03`), `\text{rk}`
(`mml/02`, `mml/04`, `mml/09`) e `\text{ker}` (`mml/04`). Por isso **a lista acima é ilustrativa,
não normativa**: o que vale é a regra literal, cada `keyFormula` copiada do `sourceFiles` que a
própria lição entrega.

Esse macro já trocou duas vezes, sempre na mesma seção — `\dim` → `\text{dim}` no dump-03 →
`\operatorname{dim}` nesta reextração — porque o extrator não tem uma convenção para operadores e
escolhe uma a cada passagem. A consequência prática: **reextrair uma seção reabre o `keyFormulas`
de toda lição que a cita.** Foi o que aconteceu aqui — o gate recusou `fundamentos-teoria-03` até a
fórmula do teorema da nulidade e posto ser recopiada da fonte nova. Deixar `\dim`, `\text{rk}` e
`\operatorname{rk}` convivendo é aceitável, porque o gate confere contra o arquivo e não contra
uma convenção; uniformizá-los é decisão consciente, não algo a delegar ao próximo prompt.

As fórmulas dos 12 manifestos foram extraídas mecanicamente do texto da fonte, não redigitadas.

---

## `sourceRefs` são números de seção do livro

`mml-10` (capítulo inteiro), `mml-6.4` (seção) ou `mml-2.7.1` (subseção) — o mesmo número que
aparece no sumário do MML. O gate resolve cada um procurando o heading correspondente no arquivo.
Consequência útil: **as sequências de ID pulam onde uma seção não foi extraída** — `mml/05` vai de
5.4 para 5.6 porque §5.1 e §5.5 não têm heading, e isso denuncia o buraco em vez de escondê-lo.
Mapa completo em
[`../content-source/README.md`](../content-source/README.md#numeração-o-id-é-a-seção-do-livro).

`status` no fluxo: `draft` → `generated` → `audited` → `published`. Onze das doze lições estão
em `draft`; `fundamentos-teoria-01` está em **`audited`** — conteúdo gerado, os três níveis de
verificação cumpridos, incluindo o checklist humano (o registro está em
[`../src/app/lessons/README.md`](../src/app/lessons/README.md)). Ela chega a `published` quando
o deploy que a serve for conferido no ar.

---

## Registries

`registries.json` é o vocabulário compartilhado entre manifests, widgets e testes:

- **`widgets`** — 35 nomes: 34 do mapeamento passo→widget de `methodology.md` + `DatasetExplorerWidget`,
  que entrou pelos manifests do Curso 1. Um `widget` fora da lista **falha** o gate.
- **`datasets`** — `houses-synthetic`, `standard-5pt`, `customers-synthetic`. Dataset desconhecido
  em `widgetConfig` gera **aviso**, porque a config da widget é livre.

Quando o registro de widgets do runtime existir em TS, este JSON deve passar a ser **gerado** a
partir dele, para as duas listas não divergirem.

---

## Estado das 12 lições do Curso 1

Todas passam o gate, e todas as fórmulas são literais na fonte. A coluna **Status** é o campo
`status` do próprio manifesto: `draft` é contrato sem derivado, e só `fundamentos-teoria-01`
tem conteúdo gerado — ela é o piloto da Camada 3, e o registro da verificação dela está em
[`../src/app/lessons/README.md`](../src/app/lessons/README.md).

| Lição | Fonte | Widget | Exemplo | Status |
| :--- | :--- | :--- | :--- | :--- |
| `fundamentos-teoria-01` Vetores | `mml-2.4`, `mml-2.5` | VectorSpaceWidget | verificado | **audited** |
| `fundamentos-teoria-02` Produto escalar e projeções | `mml-3.2`, `mml-3.4`, `mml-3.8` | ProjectionWidget | verificado | draft |
| `fundamentos-teoria-03` Matrizes como transformações | `mml-2.7`, `mml-2.7.3` | MatrixTransformWidget | verificado | draft |
| `fundamentos-teoria-04` Autovalores e autovetores | `mml-4.2` | EigenWidget | verificado | draft |
| `fundamentos-teoria-05` O gradiente | `mml-5.2`–`mml-5.4` | GradientWidget | verificado | draft |
| `fundamentos-teoria-06` Gradiente descendente | `mml-7.1` | GradientDescentWidget | verificado | draft |
| `fundamentos-teoria-07` Probabilidade | `mml-6.4`–`mml-6.6` | DistributionWidget | verificado | draft |
| `fundamentos-aplicada-01` O problema: preço de casas | `mml-9.1`, `mml-9.2` | DatasetExplorerWidget | verificado | draft |
| `fundamentos-aplicada-02` Treinando com GD | `mml-9.2`, `mml-5.3` | LinearRegressionWidget | verificado | draft |
| `fundamentos-aplicada-03` Learning rate | `mml-7.1`, `mml-9.2` | LinearRegressionWidget | qualitativo | draft |
| `fundamentos-aplicada-04` Equação normal | `mml-9.2` | NormalEquationWidget | verificado | draft |
| `fundamentos-aplicada-05` Sandbox | — (sandbox) | LinearRegressionWidget | sem exemplo | draft |

Cadeia de dependência: 01 → 02 → {03, 05} → 06 → aplicada 02 → {03, 04} → 05, com `teoria-07` e
`aplicada-01` como raízes independentes.

---

## Testes: onde vivem e o que provam

O motor (`libs/ml-engine`, alias `@ml/engine`) é matemática pura: vetores, matrizes, regressão
linear, probabilidade e o registro de funções que um manifesto pode citar em `inputs.f`.

Os testes ficam em
[`../src/app/ml-engine/`](../src/app/ml-engine/README.md) — e não ao lado do motor — porque o
builder do Karma só coleta specs sob o `sourceRoot` do projeto. São dois níveis:

| Arquivo | O que prova |
| :--- | :--- |
| `engine.spec.ts` | A matemática do motor, com valores conferidos à mão (projeção de (3,4) em (1,1) = (3.5, 3.5); autovalores de [[4,1],[2,3]] = 5 e 2; equação normal de X=[[1,1],[1,2]] = [-1, 2]) |
| `manifest-examples.spec.ts` | Cada `numericExample` dos manifestos, rodado no motor — o **nível 2** de verificação do `PIPELINE.md` |

A fixture `manifest-examples.generated.ts` é gerada dos manifestos por `npm run examples:build` e
carrega um `manifestsHash`. Três travas mantêm isso honesto:

1. o gate **falha** se a fixture ficar defasada (um teste verde provando números antigos é pior do
   que teste nenhum);
2. a fixture é gerada, nunca escrita à mão, então exemplo e teste não podem divergir;
3. o teste também confere que os números aparecem no texto do exemplo, para a prosa do aluno não
   divergir do que o teste prova.

Um exemplo sem `expectedValues` (qualitativo, como o de `aplicada-03`) não é verificado — o gate
emite nota e o teste aparece como *skipped*, em vez de fingir cobertura.

Lição nova com `expectedValues` e sem avaliador registrado **falha** de propósito: cobertura
ausente tem de ser barulhenta.

---

## O contrato de geração (Camada 3)

`LessonContentStep` e `LessonContent` estão definidos em
[`libs/ml-engine/lesson-content.types.ts`](../../../libs/ml-engine/lesson-content.types.ts).

Não se chama `LessonStep` porque esse nome já é do app de Cálculo
(`src/app/calculus/calculus.types.ts`), onde um passo é um modelo de **runtime** (enum de widget +
união de validação). O contrato de geração descreve só o que o gerador produz — prosa, fórmulas,
interação e checkpoint — e `libs/shared-learning/index.ts` registra a mesma decisão pelo outro
lado: o motor de ML é desenhado do zero, sem fundir engines.

A ponte entre os dois é o manifesto: ele nomeia o `widget`, e o runtime mapeia depois. Conteúdo
nunca inventa widget; ele descreve o que o aluno faz com o que o manifesto escolheu. Cada passo
carrega `sourceRefs`, para a auditoria conferir que toda afirmação é rastreável à seção citada.

---

## Decisões tomadas (e por quê)

1. **`sourceRefs` são números de seção do livro** (2026-09-20), reancorando `mml/02` e `mml/05`.
   Antes os IDs eram ordinais do arquivo e `mml-5.2` apontava para a Jacobiana enquanto o
   manifesto pedia o gradiente — endereço errado é endereço válido, e o gate não pegaria.
2. **`keyFormulas` são fatias literais da fonte** (2026-09-22) — ver a seção de notação acima.
3. **`prerequisites` é obrigatório.** É a espinha dorsal do encadeamento discovery.
4. **Lição sandbox pode não ter fonte.** O par `sourceRefs`/`sourceFiles` precisa ser coerente
   (ambos vazios ou ambos preenchidos); o gate emite nota, não erro, quando os dois estão vazios.
5. **`estimatedMinutes`: 25 é o teto, 15 é o alvo.** Acima de 15 o gate avisa.
6. **`subjectId` não é campo.** Já está dentro do `moduleId`; duplicar abriria espaço para divergir.

---

## Correções aplicadas aos manifestos do autor

Transcritos como escritos, com as exceções abaixo — todas para o arquivo ser JSON válido, para o
ref apontar para a seção certa, ou para a notação ser a da fonte. Nenhum título, objetivo,
critério ou descrição foi reescrito, exceto onde indicado.

| Lição | Correção | Motivo |
| :--- | :--- | :--- |
| `fundamentos-teoria-06` | `start: [−1.5, 1.8]` → `[-1.5, 1.8]` | o sinal era U+2212: o arquivo não fazia parse |
| `fundamentos-aplicada-02` | `"convergiu"` → `\"convergiu\"` | aspas não escapadas: o arquivo não fazia parse |
| `fundamentos-aplicada-01` | `sourceRefs` ganhou `mml-9.2` | o `numericExample.sourceRef` já era `mml-9.2` |
| `fundamentos-teoria-03` | `sourceRefs` perdeu `mml-2.7.2`; `numericExample.sourceRef` → `mml-2.7.1` | a extração trouxe imagem e núcleo num tópico só. **O endereço virou `mml-2.7.3` no dump-03**, quando o livro foi conferido: §2.7.1 é *Matrix Representation of Linear Mappings* |
| `fundamentos-teoria-05` | `sourceRefs` `mml-5.1`–`5.3` → `mml-5.2`–`5.4` | §5.1 não foi extraída |
| `fundamentos-teoria-02` | `sourceRefs` ganhou `mml-3.4`, `mml-3.8` | as fórmulas de ângulo e projeção vivem nessas seções |
| `fundamentos-aplicada-02` | `sourceRefs` ganhou `mml-5.3`; `sourceFiles` ganhou `mml/05` | a fórmula do gradiente da perda é de §5.3 |
| `fundamentos-aplicada-02` | **números corrigidos**: gradientes `[-3,-2]` → `[-4,-7]`, `θ=[0.3,0.2]` → `θ=[0.4,0.7]` | o exemplo não reproduzia com a própria fórmula declarada; o teste agora prova |
| `fundamentos-teoria-04` | `inputs` ganhou `probes: [[1,1],[1,-2]]` | os autovetores que a descrição já declarava, para o teste não hardcodar |
| todos | `expectedValues` acrescentado | é o que o teste compara |
| todos | `keyFormulas` reextraídas da fonte | decisão de notação |

---

## Pendências nos manifestos (o gate não pega)

1. **`fundamentos-teoria-05`: o exemplo não vem da fonte.** `f(x,y) = x² + y²` não aparece em
   `mml/05`; o exemplo conferível da seção é `f(x₁,x₂) = x₁²x₂ + x₁x₂³` em `(1,2)` → `[12, 13]`.
   O exemplo atual é verificável à mão e agora é testado, mas não é o do livro.
2. **`fundamentos-aplicada-03` não tem `expectedValues`.** O `expected` é qualitativo ("converge em
   ~50 épocas com MSE < 0.01") e os `inputs` não fixam o dataset, então não há o que comparar.
   Para virar testável, o exemplo precisa de dados concretos em `inputs`.
3. **Typos preservados:** `widgetConfig.gradie` (`fundamentos-teoria-03`) e `"differe"`
   (`fundamentos-teoria-06`).
4. **`knownGaps` declarados** em `teoria-02`, `aplicada-01` e `aplicada-05` — cada um precisa da
   decisão do autor (nota autônoma dentro da lição?) antes de gerar aquela lição. `teoria-01` não
   tem gap nenhum.

## O que o validador não cobre

- **Intenção do ref e do exemplo.** O gate prova que o ref existe, que a fórmula está literalmente
  na fonte e que o número reproduz no motor. Não prova que a fórmula escolhida é a mais didática
  para aquela lição — isso é o checklist humano.
- **`moduleId` contra o catálogo.** Provar que `fundamentos-teoria` existe em `STUDY_SUBJECTS` exige
  importar o catálogo TS. O lugar certo é um spec do app.
- **ajv como dependência direta.** Hoje ele só existe como transitiva do Angular CLI. `npm i -D ajv`
  quando o gate entrar em CI.
