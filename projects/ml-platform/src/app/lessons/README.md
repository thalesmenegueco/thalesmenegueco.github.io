# lessons — o runtime do Curso 1

Conteúdo gerado da Camada 3, o runtime que o acompanha, e o player que exibe os dois.

## A decisão: forma (b), em 2026-10-05

Três formas estavam na mesa, e a escolha existia porque o piloto precisava ser jogável **antes**
de o runtime de ML ser decidido:

| | O que é | O que custava |
| :--- | :--- | :--- |
| (a) Estender o contrato | `LessonContent` ganha `scenario`, validação por passo e `options` com `feedback` | o gerador passaria a escrever os distratores — matemática plausível e errada, o erro que o pipeline existe para impedir — e a lição 01 teria de ser regerada e reauditada |
| **(b) Segunda passagem** ← **escolhida** | o contrato de geração fica só prosa; uma passagem separada vira as checagens | um arquivo pequeno por lição, escrito à mão |
| (c) Runtime próprio do ML | sem cenário, checkpoint textual, avanço livre | a lição deixa de travar progresso — e `completionCriterion`, campo obrigatório do manifesto, passa a não valer nada |

**Por que (b), e não (a) nem (c):**

1. **O manifesto já é o binding da widget, e nada lia.** `numericExample.inputs` é o estado
   inicial da widget em 10 dos 11 exemplos. O player carregava `widgetTarget: Vec2 = [2, 3]` — uma
   cópia à mão do exemplo da lição 01 — e a segunda lição exigiria uma segunda constante. O
   runtime passou a ler o manifesto, pela fixture gerada `runtime/lesson-bindings.generated.ts`.
2. **Distrator é matemática errada de propósito.** No Cálculo eles são escritos à mão em
   `lesson-data.ts`; entregá-los ao gerador contradiz a regra mais dura do pipeline e quebraria a
   auditoria de nível 1 ("toda fórmula é fatia literal da fonte"), que teria de ganhar uma exceção.
3. **A forma (c) já não existia como descrita.** "Sem camada de tradução" não sobrevive à segunda
   lição: outra widget, outros números, outra configuração. O que (c) economizava era só a
   validação — o binding havia de ser construído de qualquer jeito.

## O que o player consome

`LessonPlayerComponent` recebe **dois** inputs, e a separação é a decisão:

| Input | O que é | Quem escreve |
| :--- | :--- | :--- |
| `lesson` | `LessonContent` — prosa, fórmulas, checkpoint, `sourceRefs` | o gerador, a partir do manifesto e da fonte |
| `runtime` | `LessonRuntime` — checagem por passo, alternativas da fórmula, binding da widget | o autor |

O conteúdo não sabe que o runtime existe e vice-versa: os dois se encontram por `contentStepId`. A
página do módulo (`fundamentos-teoria.component.*`) monta os dois e passa adiante — o player não
procura nada por conta própria.

## O avanço agora é conferido

Até 2026-10-05 o player avançava de graça: o aluno clicava "próximo" três vezes, marcava a lição
como concluída, e o hub contava — sem tocar na widget. Todo `completionCriterion` dos manifestos
("o sistema confirma que v = Σ cᵢbᵢ") descrevia uma checagem que ninguém fazia.

Agora:

- cada passo tem uma checagem sobre um **campo nomeado do snapshot da widget** (`runtime/`);
- a recusa traz mensagem — o `hint` do autor quando existe;
- **os pontos do cabeçalho continuam navegação livre** (são affordance de quem audita e de quem
  volta), mas concluir exige que **todos** os passos tenham sido cumpridos alguma vez, e o botão
  diz quais faltam;
- um passo já cumprido continua cumprido: voltar a ele pelos pontos não pede a prova duas vezes.

O que isso **não** é: uma correção de resposta. O `checkpoint` continua sendo pergunta e resposta
para conferência própria; a checagem é sobre o que o aluno fez no widget. E `expectedInsight`
segue atrás do **modo avaliação**, agora junto com a checagem do passo em JSON — campos de projeto
não aparecem para quem aprende.

## Dois buracos do contrato, um resolvido e um em aberto

1. **`scenario` — em aberto, de propósito.** O cenário de abertura vive na primeira frase do
   primeiro bloco de `narrative`, e o `objective` faz as vezes de promessa. Ele é prosa sobre a
   fonte e já é gerado; um campo só para ele seria um slot de renderização, não informação nova.
2. **Configuração de widget por passo — em aberto, e agora explícita.** Um passo nomeia um
   `widgetId` mas não pode configurá-lo. `VectorSpaceWidget` expõe as três operações de
   `widgetConfig.availableOps` — combinação, soma e escala — **ao mesmo tempo, num painel só**, e o
   `prompt` de cada passo manda o aluno para um grupo diferente de controles. O binding é **por
   lição**, porque o manifesto declara um widget por lição.

## Onde as coisas moram

```
lessons/
  README.md                      ← este arquivo
  rich-text.component.ts         ← renderiza a ênfase da prosa (2 construtores)
  rich-text.pipe.ts              ← o parser, exportado para ser testado direto
  runtime/                       ← o modelo de runtime: tipos, portão puro e a fixture de bindings
  lesson-player/                 ← renderiza um LessonContent contra um LessonRuntime
  fundamentos-teoria/
    fundamentos-teoria-01.ts          ← o conteúdo gerado (Camada 3)
    fundamentos-teoria-01.runtime.ts  ← a pedagogia escrita à mão (checagens + alternativas)
    fundamentos-teoria-01.spec.ts     ← guarda o arco, o acordo com o manifesto e o portão
    fundamentos-teoria.component.*    ← a página do módulo, com progresso
../widgets/vector-space/         ← a widget contratada pelo manifesto
```

Não há `lesson.types.ts` fora de `runtime/`: o player consome o contrato de geração **e** o modelo
de runtime, e nenhum dos dois é traduzido para um terceiro. Um modelo de runtime próprio do
Cálculo não foi reusado — `libs/shared-learning/index.ts` registra a decisão de não fundir
engines.

O mapeamento **nome → componente** de widget é feito dentro do player, num `@switch` sobre
`runtime().widget.widgetId` — o nome que o **manifesto** contrata, não o que o conteúdo escreveu
(uma spec guarda que os dois coincidem). É a ponte que o `manifests/README.md` descreve como "o
manifesto nomeia o widget, e o runtime mapeia depois" — hoje ela existe, com um caso.

## Ênfase no texto, e por que o player tem um renderizador

`narrative`, `checkpoint.*`, `widgetInteraction.prompt` e `expectedInsight` passam por
`RichTextComponent` (`rich-text.component.ts` + `rich-text.pipe.ts`), que entende **dois**
construtores: `**negrito**` e `*itálico*`. Nada de HTML, link, lista ou crase — e nada de
`innerHTML`: os segmentos viram nós de texto, `<strong>` e `<em>`, então não há superfície de
injeção nem sanitizador para confiar.

Isso existe por causa do insumo, não do acaso. A fonte que o gerador lê é markdown cheio de
`**` — toda seção extraída rotula seus blocos `**(a) Definições Formais e Notação Exata:**` —
então a ênfase vaza para a prosa gerada por construção. A primeira versão do player
interpolava o texto cru e o leitor viu os asteriscos na tela. A correção foi o player
renderizar, e não a geração parar de usar: assim uma geração futura não reproduz a falha
escrevendo `**termo**`. A regra e a sintaxe permitida estão em
[`../../content-source/CAMADA3.md`](../../content-source/CAMADA3.md).

O irmão disso para matemática inline é o `RichMathTextComponent` de `@shared/katex`, que
divide a string em `$$…$$`. Os dois são separados porque o `narrative` do ML carrega ênfase e
o `explanation` do Cálculo nunca teve.

## Progresso

`PROGRESS_KEYS.mlFundamentos` (`ml-fundamentos-teoria-completed`) é a chave do módulo. As três
chaves `calculo-*` são dados de usuário congelados e não foram tocadas; esta é nova. O hub lê
o total por módulo em `PROGRESS_KEY_BY_MODULE` (`studies.component.ts`) — um módulo sem
entrada ali simplesmente não é rastreado, que é o caso dos outros cursos.

A conclusão continua sendo um botão — "marcar lição como concluída" no último passo —, mas desde
2026-10-05 ela exige que **todos** os passos tenham tido a checagem cumprida. O que o botão não
faz é corrigir a resposta do `checkpoint`: a autoavaliação segue sendo do aluno, e a checagem é
sobre o que ele fez no widget. É a diferença entre travar o progresso e conferir o aprendizado —
esta forma confere o arco percorrido, não a prosa lida.

## Verificação de `fundamentos-teoria-01` — os três níveis, e o que cada um provou

`status: "audited"` no manifesto. Registro do que foi de fato conferido, em **2026-10-04** —
porque "auditada" é uma afirmação, e uma afirmação sem registro é uma opinião.

| Nível | Como | Resultado |
| :--- | :--- | :--- |
| 1. Auditoria contra a fonte | cada afirmação do `narrative` e do `checkpoint` comparada com §2.4 e §2.5, procurando fórmula alterada, notação inconsistente e afirmação ausente da fonte | **nenhuma divergência**; uma abreviação aceita (abaixo) |
| 2. Teste do exemplo numérico | `manifest-examples.spec.ts` roda o `numericExample` do manifesto no `@ml/engine` e confere que os mesmos números aparecem na prosa | passa: `c = (2, 3)` sobre a base canônica dá `v = (2, 3)` |
| 3. Checklist humano (4 itens) | leitura do autor, jogando a lição no navegador | passa, **depois** de corrigir dois defeitos que ela encontrou (abaixo) |

**O que a leitura humana encontrou** — e é o argumento de que este nível não é cerimônia:

1. O widget mostrava o **oposto** do que o passo 2 dizia: a janela fixa de ±5 unidades fazia
   `λv` sair do quadro enquanto o texto afirmava que nada sai do plano. O widget agora deriva a
   escala do ponto mais distante, imprime o tamanho da janela, e o `narrative` diz que o quadro
   é uma janela — o plano não tem borda. Há quatro specs guardando isso, incluindo o pior caso
   com todos os controles no máximo.
2. O passo 2 nunca **nomeava o escalar**, e não separava escalar de combinação — o leitor só viu
   a diferença no passo 3. O passo 2 agora nomeia o termo com os números do robô
   (`2·(1,0) = (2,0)`) e o passo 3 contrasta os dois em voz alta. Duas regras gerais saíram
   disso para [`CAMADA3.md`](../../content-source/CAMADA3.md).

**O que a automação guarda.** O arco — a regra que nenhum gate consegue ver — está em
`fundamentos-teoria-01.spec.ts`: 2 a 4 passos, **só o último enuncia a fórmula**, o passo final
traz as três `keyFormulas` do manifesto literalmente, todo passo cita só as seções contratadas,
o cenário de abertura não enuncia o conceito que o aluno vai descobrir, e o passo 2 nomeia o
escalar. Esses testes protegem **estrutura e proveniência**; se a prosa é *didática* continua
sendo o checklist humano, e por isso este parágrafo existe.

**A única abreviação aceita.** O passo 3 escreve `v = Σ λᵢxᵢ` em prosa, enquanto o bloco
`katex` traz a fórmula exata (`\boldsymbol{v} = \sum_{i=1}^k \lambda_i \boldsymbol{x}_i`). É
referência ao que está exibido logo acima, não uma segunda notação: a fórmula que o aluno lê em
KaTeX é literal da fonte.

### O que a auditoria de 2026-10-04 **não** cobriu

`status: "audited"` vale para o **conteúdo** (`fundamentos-teoria-01.ts`), e é isso que o
registro acima afirma. O runtime (`fundamentos-teoria-01.runtime.ts`) chegou depois, em
2026-10-05, e é **pedagogia escrita à mão, não derivada do livro** — não passa pela auditoria de
nível 1 e não deveria: um distrator é errado de propósito. O que dá para provar por máquina, o
spec prova:

| Afirmação | Quem garante |
| :--- | :--- |
| a alternativa correta é uma `keyFormula` do manifesto, literal | `fundamentos-teoria-01.spec.ts`, contra a lista do manifesto |
| as duas alternativas erradas são fórmulas reais de §2.4(e) e §2.5(e), não matemática inventada | **leitura humana** — é a mesma classe de conferência da regra 5 do `CAMADA3.md` |
| a checagem do passo 2 não pede nada que o prompt não tenha mandado o aluno fazer | `fundamentos-teoria-01.spec.ts`, comparando a validação com o `prompt` do conteúdo |
| nenhuma checagem nomeia um campo que a widget não reporta | `fundamentos-teoria-01.spec.ts`, contra a lista de campos do `VectorSpaceWidget` |
| a recusa de avanço explica o que fazer | `runtime/validate-step.spec.ts` (mensagem por tipo) + o `hint` de cada passo |

O nível 3 — o checklist de 4 itens do `CAMADA3.md` — volta a valer para o runtime: a pergunta
"a sequência discovery-based funciona?" agora tem uma resposta observável na tela (o aluno só
passa quando explora), e é isso que a próxima leitura humana deve conferir.
