# VisuaLab — `ml-platform`

**O nome da plataforma é VisuaLab.** `ml-platform` é o nome **técnico** do app dentro do
monorepo `learning-gallery`: é o que aparece em `angular.json`, em `npx ng build ml-platform`,
no `vercel.json` e nos nomes de pacote internos. O nome que o aluno lê — o `<title>` da aba, o
`og:title`, o cabeçalho do site e o host canônico [`www.visualab.dev`](https://www.visualab.dev/)
— é **VisuaLab**. Quando os dois aparecem juntos, o técnico é `ml-platform` e o de produto é
VisuaLab; nenhum dos dois substitui o outro.

Este arquivo é o **índice**. Cada assunto tem o seu README, mais fundo e mais completo; a tabela
[Por onde ler](#por-onde-ler) diz qual abrir para cada pergunta. Nada aqui duplica o que já está
lá — se este arquivo divergir de um deles, o outro está certo.

## TL;DR

- VisuaLab é um hub de cursos interativos de exatas; **este app é o do Machine Learning**, e o
  Cálculo é a matéria irmã que já está no ar. Além das exatas, há uma **seção de Línguas**
  (`/linguas`): leitura em mandarim com pinyin, simplificado/tradicional e glosas por palavra.
- A parte difícil não é a UI: é o **pipeline de conteúdo gerado** — fonte imutável → contrato →
  geração → auditoria. Três camadas, descritas abaixo em cinco linhas.
- **Nenhum comando roda desta pasta.** `package.json` e `angular.json` estão na **raiz do
  monorepo**, dois níveis acima. Use `npx ng serve ml-platform`, nunca `ng serve`.
- Estado hoje: **12 manifestos contratados, 1 lição com conteúdo gerado e auditado**. O módulo
  diz "1 de 7" na tela de propósito — a plataforma não finge que terminou o que não terminou.

## O que é

Um site onde se aprende exatas **explorando antes de nomear**: o aluno mexe numa widget, lê um
número, e só no último passo da lição a fórmula ganha nome. O hub (`studies/`) lista as matérias;
cada módulo é uma página.

O catálogo tem cinco matérias: **Cálculo** (no ar, com três módulos) e os **quatro cursos de ML** —
Fundamentos Matemáticos para ML, Aprendizado Supervisionado, Redes Neurais do Zero e Aprendizado
Não-Supervisionado. Só o primeiro deles tem lições contratadas; os outros três são `coming-soon`
na tela, e a fonte deles (NNDL) ainda está vazia de propósito. Ver
[`content-source/README.md`](content-source/README.md).

**A seção de Línguas é a segunda forma de aprender da plataforma** — mesma ideia ("explore antes de
nomear"), outro material. Em `/linguas` ficam textos curtos em mandarim organizados por nível HSK
(1–5) e por foco (histórias, cultura, humor), com quatro controles de leitura: pinyin que liga e
desliga, caracteres simplificados ou tradicionais, espaço entre as palavras e tradução; ao passar o
mouse (ou tocar) numa palavra aparece o pinyin e o significado. A seção tem tema claro/escuro
próprio (o resto da plataforma continua escuro) e a escolha fica salva neste navegador. O conteúdo é **original e autorado**,
não gerado — e por isso o gate dele são os specs de conteúdo, não o pipeline de lições. Ver
[`src/app/languages/README.md`](src/app/languages/README.md).

Duas coisas definem a arquitetura:

1. **Curso é dado, não código.** Matérias, módulos, títulos e status vivem em
   [`src/app/studies/study-catalog.ts`](src/app/studies/study-catalog.ts); o componente que
   ensina cada módulo é código, e o vínculo nome→componente mora em
   [`src/app/app.routes.ts`](src/app/app.routes.ts). Um módulo `coming-soon` simplesmente não
   tem binding, e por isso não tem rota — nada de rota escrita à mão por curso.
2. **Conteúdo de lição é derivado, nunca autorado no improviso.** O que o aluno lê numa lição do
   ML é gerado a partir de um contrato e de um trecho de livro, e depois auditado. Ver adiante.

## O modelo de confiança, em cinco linhas

O problema real do projeto é que conteúdo gerado por LLM erra de um jeito específico: **inventa
uma fórmula plausível**. O pipeline existe para tornar isso impossível de passar despercebido.

```
content-source/           a FONTE — dump do livro fatiado por capítulo, imutável.
  mml/  nndl/             O ID de cada heading é o número da seção (`## mml-5.2 — …`),
                          conferido contra `manifests/book-sections.json`.
      │
      ▼
manifests/*.json          o CONTRATO — 12 arquivos: objetivo, `sourceRefs`, widget,
                          `keyFormulas` (fatias literais da fonte), critério de conclusão.
      │                   gate: `npm run validate:manifests`
      ▼
geração (Camada 3)        a PROSA — prompt em `content-source/CAMADA3.md`, só a fonte
                          entregue; a saída de escape é `{ "gap": … }`
      │                   auditoria em 3 níveis (prompt, teste numérico, checklist)
      ▼
lessons/*.runtime.ts      a PEDAGOGIA — checagem por passo, alternativas do passo
                          da fórmula e números iniciais da widget; à mão, de propósito.
```

A frase que explica quase todas as decisões deste repositório: **endereço errado é endereço
válido**. Um `sourceRef` pode resolver para um heading que existe e ainda assim apontar para a
seção errada do livro — por isso os IDs são números de seção, por isso
`manifests/book-sections.json` existe, e por isso duas fixtures carregam hash próprio.

**A seção de Línguas fica fora deste pipeline, de propósito.** Um texto de leitura não é derivado de
um livro: é escrito para a plataforma, e a falha típica não é uma fórmula inventada, é um pinyin
errado ou uma tradução desalinhada. O gate dela é `mandarin-content.spec.ts` (toda chave resolve,
parágrafo curto, tradução um a um, dicionário sem entrada órfã), não `validate:manifests`.

## Onde você está

Este diretório é **um projeto** de um workspace Angular com dois apps e cinco libs. Os arquivos
de configuração que mandam em tudo **não estão aqui**:

| O que | Onde | Por quê |
| :--- | :--- | :--- |
| `package.json`, `angular.json`, `tsconfig.json` | **raiz do monorepo** (`../..`) | há dois apps; o workspace é um só |
| `vercel.json`, `.github/workflows/ci.yml` | raiz do monorepo | deploy e CI são do repositório, não do app |
| `@ml/engine` (motor de ML) e `@shared/*` | `../../libs/` | são libs compartilhadas, importadas como fonte |

Aqui só existem `tsconfig.app.json` e `tsconfig.spec.json`, que estendem os da raiz. Consequência
prática: `cd projects/ml-platform && npm run …` **falha** (não há `package.json`), e `ng serve`
sozinho **falha** ("Cannot determine project", dois apps disputam o comando). Rode tudo da raiz,
sempre nomeando o projeto.

## Comandos

Da **raiz do monorepo**, com Node 22 (`.nvmrc`):

| Comando | O que faz | Quando |
| :--- | :--- | :--- |
| `npx ng serve ml-platform` | servidor de desenvolvimento em `http://localhost:4200/` | trabalhar na UI |
| `npm run validate:manifests` | o gate: schema, `sourceRefs` contra a fonte **e** contra o livro, notação das fórmulas, `prerequisites` sem ciclo, e as duas fixtures em dia | **antes de todo commit** que toque em `manifests/` ou `content-source/` |
| `npm run examples:build` | regenera `src/app/ml-engine/manifest-examples.generated.ts` | ao mudar `numericExample.expectedValues` |
| `npm run bindings:build` | regenera `src/app/lessons/runtime/lesson-bindings.generated.ts` | ao mudar `widgetConfig` ou `numericExample.inputs` |
| `npm run test:headless` | `ng test ml-platform`, no Chrome headless | antes de commitar código |
| `npx ng build ml-platform --configuration production` | o build de produção; é exatamente o que o deploy roda | conferir bundle e budgets |

As duas fixtures são **geradas, nunca escritas à mão**, e o gate falha se ficarem velhas — um
teste verde provando números antigos é pior do que teste nenhum. Elas são separadas porque servem
a consumidores diferentes: uma inicializa a widget, a outra prova o número. Uma correção de
proveniência que não mexe em número de widget não deve invalidar o binding.

A ordem `bindings:build`/`examples:build` → `validate:manifests` → `test:headless` é o loop; o
gate no meio existe para você descobrir a fixture defasada antes do teste reclamar de outra coisa.

## Por onde ler

| README | Abra quando a pergunta for |
| :--- | :--- |
| [`content-source/README.md`](content-source/README.md) | "de onde vem este conteúdo?" — mapa arquivo→capítulo, hashes do dump, quais IDs de seção existem e **quais buracos são propositais** |
| [`content-source/PIPELINE.md`](content-source/PIPELINE.md) | "como o pipeline funciona e por quê?" — as três camadas, a verificação em 3 níveis, e os 8 prompts da Camada 1 |
| [`content-source/CAMADA3.md`](content-source/CAMADA3.md) | "vou gerar uma lição, o que o gerador precisa cumprir?" — contrato de saída campo a campo, o arco pergunta→exploração→fórmula, e as regras 5 e 6 |
| [`manifests/README.md`](manifests/README.md) | "o que é um manifesto?" — todos os campos, a decisão de notação das fórmulas, o que o gate pega e **o que ele não pega**, o estado das 12 lições |
| [`src/app/lessons/README.md`](src/app/lessons/README.md) | "como o conteúdo vira tela?" — a decisão da forma **(b)**, o player, o progresso, e o registro da auditoria da lição 01 |
| [`src/app/lessons/runtime/README.md`](src/app/lessons/runtime/README.md) | "como o aluno é impedido de avançar de graça?" — o protocolo do snapshot, os três tipos de checagem, a fixture de bindings |
| [`src/app/ml-engine/README.md`](src/app/ml-engine/README.md) | "por que os specs do motor não moram no motor?" — a restrição do Karma que explica a pasta |
| [`src/app/languages/README.md`](src/app/languages/README.md) | "como funciona a seção de Línguas?" — por que é seção e não curso, o dicionário + parágrafos segmentados, os quatro controles e o gate de conteúdo |
| [`brand/README.md`](brand/README.md) | "de onde veio o ícone?" — arte de origem, os dois sha256, e por que o PNG não vai para `public/` |

## O que tem aqui dentro

```
projects/ml-platform/
├── README.md               ← este índice
├── brand/                  ← arte de origem do ícone (fora do bundle) + registro
├── content-source/         ← Camada 1: a fonte, imutável
│   ├── mml/ nndl/          ← um arquivo por capítulo do livro
│   ├── prompts/            ← execuções da Camada 3 (não são fonte: citam headings de propósito)
│   └── PIPELINE.md CAMADA3.md
├── manifests/              ← Camada 2: 12 contratos + schema + registries + book-sections
├── syllabus-content/       ← o dump bruto do NotebookLM, origem da Camada 1
├── public/                 ← favicon.ico e os ícones das matérias
└── src/
    ├── index.html          ← <title>, canonical e og:* — o nome VisuaLab vive aqui também
    ├── styles.scss
    └── app/
        ├── app.routes.ts   ← liga módulo do catálogo → componente; gera as rotas
        ├── studies/        ← o hub e o catálogo (dados, não código)
        ├── languages/      ← Línguas: hub de leitura, dicionário e leitor de mandarim
        ├── lessons/        ← lição gerada + runtime escrito à mão + player
        ├── widgets/        ← as widgets que os manifestos contratam
        ├── ml-engine/      ← specs do motor (o motor é lib — ver o README da pasta)
        ├── calculus/ calculus-practice/ calculus-process-lab/   ← Cálculo
        └── _ml-shared.scss
```

## Estado atual

Medido em **2026-10-09**, pelos comandos acima, não de memória:

- **12 manifestos, 0 erros** no gate (7 do módulo teoria, 5 do aplicada). A saída traz 2 avisos e
  1 nota conhecidos, cada um nomeado em [`manifests/README.md`](manifests/README.md) — nenhum é
  surpresa.
- **57 headings** endereçáveis na fonte, todos conferidos contra o sumário do livro (52 IDs de
  seção + 5 de capítulo). O número sai do próprio gate.
- **1 de 12 lições** tem conteúdo: `fundamentos-teoria-01`, `status: "audited"`, jogável de ponta
  a ponta. As outras 11 são contratos sem derivado, e é por isso que o módulo anuncia "1 de 7".
- **2 widgets implementadas** (`VectorSpaceWidget`, da lição 01, e `ProjectionWidget`, da lição
  02 — esta ainda sem conteúdo gerado); as outras 33 são nomes registrados em
  `manifests/registries.json`, à espera de uma lição que as contrate.
- Só o Curso 1 (Fundamentos) tem lições contratadas. Cálculo está no ar com três módulos; as
  outras três matérias de ML estão em `coming-soon`, e os limites delas estão declarados em
  [`content-source/README.md`](content-source/README.md).
- A seção de Línguas está no ar em `/linguas`: **10 textos** (2 por nível HSK, de 1 a 5) cobrindo
  histórias, cultura e humor, com dicionário de 273 palavras (cada entrada com simplificado,
  tradicional, pinyin e glosa pt-BR) e tema claro/escuro persistido por seção. O gate é
  `npm run test:headless` — a suíte inteira passou com ela (`149 SUCCESS` em 2026-11-09, mais os
  specs do tema), e o build de produção gera os dois chunks lazy
  (`mandarin-reader-component`, `language-hub-component`).

## O que não é aqui

- **Cálculo** (`calculus/`, `calculus-practice/`, `calculus-process-lab/`) é matéria irmã, com
  runtime, widgets e formato de dados próprios. Ele é o **exemplo que funciona** — o arco didático
  de `CAMADA3.md` foi medido nas 7 lições dele. O motor de lições do Cálculo **não** foi promovido
  a lib compartilhada, e a nota de escopo de `../../libs/shared-learning/index.ts` registra por
  quê: contrato de lição desenhado do zero em vez de fundir dois engines.
- **O motor** (`@ml/engine`) e as libs `@shared/*` vivem em `../../libs/`, fora deste app.
- **A seção de Línguas não é pipeline.** Os textos são autorados, não gerados da fonte; o gate dela
  são os specs de conteúdo (`src/app/languages/mandarin-content.spec.ts`), e o modelo de dados
  (dicionário + parágrafos segmentados) não é compartilhado com as lições de ML. Ver
  [`src/app/languages/README.md`](src/app/languages/README.md).
- **O portfolio** (`../portfolio/`) é o outro app do workspace.

## Armadilhas conhecidas

1. **Rodar comando da pasta errada.** Sem `package.json` aqui e sem `defaultProject` no
   workspace, `ng serve` e `ng build` puros falham — e a mensagem do CLI sugere "mudar para a
   pasta do projeto", conselho que também não funciona neste layout. Sempre da raiz, nomeando o
   projeto.
2. **`ng test` grava em `dist/test-out/`, na raiz do monorepo** — não dentro do projeto. Um
   ambiente que só permite escrever em `projects/ml-platform/` vê `ENOENT` antes de qualquer teste.
3. **Specs moram em `src/`, inclusive os do motor.** O builder do Karma só coleta sob o
   `sourceRoot` do projeto, então um spec em `libs/` é invisível. A explicação inteira está em
   [`src/app/ml-engine/README.md`](src/app/ml-engine/README.md).
4. **Mudar a fonte reabre `keyFormulas`.** Reextrair uma seção pode trocar a grafia de um operador
   (`\dim` → `\text{dim}` → `\operatorname{dim}`), e aí o gate recusa toda lição que cita aquela
   seção até a fórmula ser recopiada. Não é regressão: é a regra de notação funcionando.
5. **Os números deste README envelhecem; os comandos não.** Se algum divergir, o gate é a fonte e
   este arquivo está velho — prefira citar a saída de `npm run validate:manifests` a repetir o
   número.

## Deploy

Build e hospedagem são definidos na raiz do monorepo, não aqui: `../../vercel.json` roda
`npx ng build ml-platform --configuration production` e publica `dist/ml-platform/browser`, com
rewrite de tudo para `index.html` (é um SPA). O host canônico é `https://www.visualab.dev/`,
declarado em [`src/index.html`](src/index.html) — o apex redireciona para o `www`.

O CI (`../../.github/workflows/ci.yml`) roda em todo PR para `main`: o gate
`validate:manifests` e `ng test` para os dois apps, mais um build de produção de cada um. Ou seja,
um manifesto que cite seção inexistente ou uma fixture defasada **não passa no PR** — não depende
de alguém lembrar de rodar o gate.

## Convenções

- **Idioma:** docs e conteúdo em pt-BR; identificadores, comentários de código e mensagens de
  commit em inglês. Os termos técnicos aparecem em inglês entre parênteses na primeira aparição.
- **Nunca edite um trecho extraído.** Se o conteúdo está errado, a extração é regerada. A única
  exceção é a normalização de headings, que é endereço e formato, não conteúdo.
- **Decisão sem registro é opinião.** As escolhas deste projeto estão datadas e justificadas nos
  READMEs, com o que foi medido e o que ficou em aberto. Ao mudar uma delas, mude o registro —
  e mova as pendências que ela fecha.
