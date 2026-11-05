# runtime — a pedagogia que não vem do livro

O **modelo de runtime** de uma lição de ML: como o aluno avança, quais alternativas o passo da
fórmula oferece, e com que números a widget abre. É a forma **(b)** das três que estavam na mesa
em [`../README.md`](../README.md), decidida em **2026-10-05**.

## Por que isto existe

`LessonContent` (em `@ml/engine`) é o contrato de **geração**: prosa, fórmulas e checkpoint, tudo
rastreável a uma seção do livro e auditável contra `content-source/`. Ele não sabe nada de widget
— de propósito. Três coisas que uma lição precisa em runtime não cabiam nele, e não deveriam:

| O que falta no contrato de geração | Por que não pode entrar nele |
| :--- | :--- |
| **Como o aluno avança** | `completionCriterion` é campo obrigatório do manifesto e está escrito como algo observável na widget ("o sistema confirma que v = Σ cᵢbᵢ"). Na forma (c) ninguém observava: o aluno clicava três vezes e o hub contava a lição. |
| **As alternativas do passo da fórmula** | Um distrator é matemática **deliberadamente errada**. Pedir isso ao gerador é pedir exatamente o que o pipeline existe para impedir (`../content-source/CAMADA3.md`). Ficam escritas à mão, como os `FormulaOption[]` do Cálculo. |
| **O estado inicial da widget** | O manifesto já declara — em `widgetConfig` e `numericExample.inputs` — e nada lia: o player carregava um `widgetTarget: Vec2 = [2, 3]` copiado à mão do exemplo da lição 01. |

A ponte entre conteúdo e runtime é `contentStepId`. Nem o conteúdo nem o runtime conhecem o
outro: o conteúdo pode ser regerado sem mover uma validação, e uma validação pode ser ajustada
sem tocar numa palavra que a auditoria assinou.

## O que mora aqui

| Arquivo | Papel |
| :--- | :--- |
| `lesson-runtime.types.ts` | `LessonRuntime`, `RuntimeStep`, `RuntimeValidation`, `RuntimeFormulaOption`, `WidgetSnapshot`, `RuntimeWidgetBinding` |
| `widget-contract.ts` | `MlWidgetComponent` — o que **todo** widget recebe (`lessonId`, `binding`) e reporta (`snapshotChange`), mais os leitores `requireVector`/`readVectors`/`readFlag` |
| `validate-step.ts` | O portão puro: `validateStep(validation, snapshot)` + `validationMessage(validation, hint)` |
| `validate-step.spec.ts` | Os testes do portão — sem TestBed, sem widget, sem DOM |
| `lesson-bindings.generated.ts` | **Gerado** por `npm run bindings:build` a partir dos manifestos — não edite à mão |

O runtime de cada lição fica ao lado do conteúdo dela, em
`../fundamentos-teoria/fundamentos-teoria-01.runtime.ts`.

## O protocolo

**A widget recebe o binding inteiro** — `lessonId` e `binding` (`widgetId` + `config` +
`numericExample.inputs`, direto da fixture gerada), e nada mais. Ela lê os próprios inputs com
`requireVector`, que falha alto e nomeia o manifesto quando o campo não existe. O player não
conhece o vocabulário de nenhuma widget: essa foi a mudança que a segunda lição forçou em
2026-10-28 — antes dele passava `[target]`/`[bases]` lidos de `inputs.c`/`.base`, o que só
funcionava porque havia uma widget (ver [`../README.md`](../README.md)).

**A widget reporta um snapshot** — um `Record<string, number | string | boolean>`, só escalares —
a cada interação. `VectorSpaceWidget` emite `reached`, `c1`, `c2`, `lambda` e `distance`;
`ProjectionWidget` emite `dot`, `cos`, `lambda`, `projectionLength` e `orthogonal`. A widget é a
única coisa que sabe o que o estado dela significa, então é ela que nomeia os campos.

**Geometria não se arredonda; leitura sim.** O readout do `ProjectionWidget` mostra quatro casas
decimais, mas o desenho sai dos valores exatos: arredondar λ antes de calcular a projeção movia o
pé em ~1e-4 e o erro deixava de ser *exatamente* perpendicular a **b** — a única identidade que
aquela lição existe para mostrar. Um teste pegou isso com 1e-4 de folga.

**O passo declara uma checagem sobre um campo nomeado.** Três tipos, porque um widget de ML serve
vários passos — `VectorSpaceWidget` é explorado de três jeitos na mesma lição, diferente do
Cálculo, onde cada passo costuma ter o seu widget:

```ts
{ type: 'equals', field: 'reached', value: true }        // um estado que o aluno teve de alcançar
{ type: 'within', field: 'lambda', range: [-3, -0.5] }   // leve este controle para esta faixa
{ type: 'formula', correctAnswer: 'a' }                  // escolheu a fórmula certa
```

**Ela reprova fechado.** Um campo que a widget nunca reporta não passa "por omissão": o passo fica
impossível e o aluno lê o que fazer. É a diferença entre este runtime e a forma (c), onde todo
passo passava *porque* nada era conferido. Um typo num campo é falha alta no navegador, e
`validate-step.spec.ts` guarda isso.

**A recusa explica.** Cada passo pode trazer um `hint` escrito pelo autor, que vence a mensagem
genérica do tipo — é a diferença entre um portão que ensina e um que só bloqueia.

## Os números da widget vêm do manifesto

`lesson-bindings.generated.ts` é `widget` + `widgetConfig` + `numericExample.inputs` de cada
manifesto, pelo mesmo mecanismo de `manifest-examples.generated.ts`: specs rodam no Karma (um
navegador) e não leem arquivos do repositório, então a fonte única é assada numa fixture que o
gate recusa quando fica velha.

A fixture carrega um `bindingsHash` e `npm run validate:manifests` **falha** se ela ficar para
trás — uma fixture velha faria a lição abrir com números que nenhum teste prova mais. Ela não
hasheia `title`, `objective`, `sourceRefs` nem `expectedValues`: nada disso chega a uma widget, e
hasheá-los faria uma correção de proveniência invalidar uma fixture ainda correta.

**Um detalhe de desenho:** `fundamentos-teoria-02` declara os mesmos números duas vezes —
`widgetConfig.vectorA` e `numericExample.inputs.x`. Os dois são candidatos a fonte, e o runtime
usa **`inputs`**, porque é o campo que o gate já prova: o exemplo reproduz no motor
(`manifest-examples.spec.ts`) e os números aparecem no texto do exemplo. Quando um manifesto
declarar os dois divergindo, a divergência é do manifesto, e o lugar de consertá-la é lá.

## O que este runtime não carrega

- **`scenario`.** O prompt de geração já abre o primeiro bloco de `narrative` com um cenário
  concreto, e é prosa sobre a fonte. Movê-lo ou copiá-lo poria um fato em dois arquivos — a mesma
  deriva que o repositório recusou para o `subjectId` (`../../../../manifests/README.md`,
  *Decisões tomadas*, item 6).
- **Configuração de widget por passo.** O manifesto declara **um** `widget` por lição, e a lição é
  jogada nele. Um passo não configura o widget: ele manda o aluno para um grupo dos controles que
  a widget já expõe (`widgetConfig.availableOps`), que é como `VectorSpaceWidget` serve três
  passos. Isso continua em aberto — e só vira campo se uma lição realmente precisar de dois modos
  diferentes no mesmo widget.
- **A prosa.** Ela continua sendo do gerador, auditada contra o livro. O runtime decide *quando o
  aluno pode seguir*, nunca *o que ele lê*.

## Verificação

```bash
npm run bindings:build       # regenera a fixture a partir dos manifestos
npm run validate:manifests   # confere, entre outras coisas, que ela não ficou velha
npm run test:headless        # validate-step.spec.ts + as specs da lição
```

O `fundamentos-teoria-01.spec.ts` guarda o acordo entre as três partes: todo passo do conteúdo tem
um passo de runtime e vice-versa, a widget do binding é a do manifesto e o conteúdo não inventa
outra, cada checagem nomeia um campo que a widget de fato reporta, e o passo 2 não pede nada que o
próprio prompt não tenha mandado o aluno fazer.

**Toda lição nova repete essa conferência de cobertura**, e é uma obrigação, não um enfeite: um
passo de conteúdo **sem** passo de runtime avança livre, porque o player não tem o que checar —
falhar fechado ali travaria o aluno com uma mensagem sem sentido, e o defeito é de autoria, não de
uso. O mesmo raciocínio do `manifest-examples.spec.ts`, que **falha de propósito** quando um
exemplo tem `expectedValues` e não tem avaliador: cobertura ausente tem de ser barulhenta, e o
lugar barulhento é o teste. Enquanto isso, o **modo avaliação** marca na tela os passos sem
checagem, para a lacuna aparecer na leitura humana em vez de só no navegador de quem joga.
