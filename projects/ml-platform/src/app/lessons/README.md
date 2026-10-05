# lessons — o runtime provisório do Curso 1

Conteúdo gerado da Camada 3 e o player que o exibe. Existe para dar o que **avaliar**: a
primeira lição do Curso 1, jogável, antes de decidir a forma definitiva do runtime de ML.

## Por que isto é provisório, e o que exatamente está em aberto

`LessonPlayerComponent` consome `LessonContentStep` — o contrato de **geração** de
`@ml/engine` — **direto, sem camada de tradução**. Isso é uma escolha, não um atalho: é o que
permite jogar o piloto sem antes decidir qual é o modelo de runtime do ML. As três formas
possíveis estão registradas em [`manifests/README.md`](../../manifests/README.md) e repetidas
aqui porque é este arquivo que muda quando a decisão for tomada:

| | O que é | O que custa |
| :--- | :--- | :--- |
| **(a)** Estender o contrato | `LessonContent` ganha `scenario`; o passo declara o tipo de validação e traz `options` com `feedback` | o arco passa a ser projetado na geração |
| **(b)** Segunda passagem | o contrato fica só prosa; uma passagem separada vira `checkpoint` em `Validation` | a pedagogia muda de lugar, não de dono |
| **(c)** Runtime próprio do ML | sem cenário, checkpoint textual, sem avanço conferido por máquina | mais barato, e a lição deixa de travar progresso |

O player atual **é a forma (c)** — é o que sai de graça quando não se traduz nada. Isso
importa para a avaliação: o piloto mostra como é a opção mais barata antes de você escolher
entre as três, e o que ele não tem (cenário, `formulaMatch` com alternativas, avanço
conferido) é exatamente o que (a) e (b) acrescentariam.

## Dois buracos do contrato, contornados e não escondidos

1. **Não há `scenario`.** O cenário de abertura da lição vive na primeira frase do primeiro
   bloco de `narrative`, e o `objective` faz as vezes de promessa. Em
   `fundamentos-teoria-01.ts` isso está dito no comentário do arquivo.
2. **Não há configuração de widget por passo.** Um passo nomeia um `widgetId` mas não pode
   configurá-lo. Em vez de adivinhar um modo pelo índice do passo, o
   `VectorSpaceWidget` expõe as três operações de `widgetConfig.availableOps` — combinação,
   soma e escala — **ao mesmo tempo, num painel só**, e o `prompt` de cada passo manda o
   aluno para um grupo diferente de controles.

## Um campo de projeto que não aparece ao aluno

`widgetInteraction.expectedInsight` diz o que o aluno *deve* notar. Mostrar isso entregaria a
descoberta em que o passo se apoia — então ele fica atrás do toggle **modo avaliação**, no
cabeçalho do player, junto com os `sourceRefs` do passo. É affordance de quem audita, não de
quem aprende.

## Onde as coisas moram

```
lessons/
  README.md                      ← este arquivo
  rich-text.component.ts         ← renderiza a ênfase da prosa (2 construtores)
  rich-text.pipe.ts              ← o parser, exportado para ser testado direto
  lesson-player/                 ← renderiza um LessonContent, passo a passo
  fundamentos-teoria/
    fundamentos-teoria-01.ts     ← o conteúdo gerado (Camada 3)
    fundamentos-teoria-01.spec.ts ← guarda o arco, não o texto
    fundamentos-teoria.component.* ← a página do módulo, com progresso
../widgets/vector-space/         ← o widget contratado pelo manifesto
```

Não há `lesson.types.ts`: o player usa o contrato de `@ml/engine` direto, e é isso que
mantém a forma (c) sem tradução. Um modelo de runtime próprio só nasce se a decisão for (a)
ou (b).

O mapeamento **nome → componente** de widget é feito dentro do player, num `@switch` sobre
`widgetInteraction.widgetId`. É a ponte que o `manifests/README.md` descreve como
"o manifesto nomeia o widget, e o runtime mapeia depois" — hoje ela existe, com um caso.

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

Como o player é autoavaliado, a conclusão é um botão: "marcar lição como concluída" no último
passo. Não há verificação — é a limitação da forma (c), visível na tela.

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
