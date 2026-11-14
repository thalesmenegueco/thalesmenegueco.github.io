# languages — a seção de Línguas (mandarim)

A segunda forma de aprender do VisuaLab: leitura guiada em chinês mandarim, com pinyin ligável,
caracteres simplificados ou tradicionais, espaço entre palavras e o significado de cada palavra ao
passar o mouse. Nada aqui passa pelo pipeline de lições de ML — o conteúdo é autorado, e o gate dele
são os specs, não `validate:manifests`.

## A decisão: uma seção, não um curso do catálogo de exatas (2026-11-09)

O hub (`studies/`) lista `StudySubject`s, e o contrato deles vem de `@shared/learning`: um
`ModuleKind` que é o vocabulário das exatas (`teoria`, `aplicada`, `processo`) e chaves de progresso
em `@shared/progress`. Um texto de leitura não é nenhuma dessas coisas — não tem widget, não tem
critério de conclusão, não tem progresso em `localStorage` hoje.

Três saídas estavam na mesa:

| | O que é | O que custava |
| :--- | :--- | :--- |
| (a) Esticar o catálogo | um `StudySubject` "Mandarim" com `kind: 'teoria'` | a etiqueta mentiria ("Teoria" para um conto), e o progresso teria de ser inventado para caber |
| (b) Mudar o contrato compartilhado | `ModuleKind` ganha valores de línguas | mexe em `libs/shared-learning` por uma necessidade que só este app tem, e não diz nada sobre **como** um texto é lido |
| **(c) Seção própria** ← **escolhida** | catálogo local `language-catalog.ts`, rotas próprias e um hub de leitura | a home não é "só exatas" e passa a renderizar duas formas de conteúdo |

**Por que (c):** a plataforma é "aprender explorando"; exatas foi a primeira matéria, não a
identidade. A seção tem um modelo de conteúdo que nada mais compartilha (dicionário + parágrafos
segmentados), um contrato de UI próprio (os quatro controles) e nenhuma promessa de conclusão. Tudo
isso cabe em `src/app/languages/` sem tocar em `@shared/*`.

O custo aceito: a home agora tem duas seções, e o título do site deixou de dizer "exatas
visualmente" para dizer "aprender visualmente".

## O modelo de conteúdo: dicionário + parágrafos segmentados

```
mandarin-expressions.ts   o BACKLOG — 28 expressões, uma por leitura, com status. Não entra em
        │                 runtime: é plano, e o `expression-source/` é a origem dele.
        │                 cobrado por `mandarin-expressions.spec.ts`
        ▼
mandarin-words.ts    o DICIONÁRIO — fonte única de pinyin, glosa pt-BR e forma tradicional.
        │
        ▼
mandarin-texts.ts    as LEITURAS — parágrafos como chaves separadas por espaço, tradução por
                     parágrafo, breakdown literal e nota de contexto opcionais.
        │            tokenização em `mandarin-content.ts`, no load do módulo
        ▼
MANDARIN_TEXTS       já resolvido: tokens, `wordCount`, `glossary`, `minutes`, `cover`.
```

Um parágrafo é escrito assim:

```ts
'今天 是 星期天 。 我 很 高兴 。',
```

e não como uma frase com pinyin embutido. Isso é a decisão que segura a coleção em pé:

1. **Consistência.** 很高兴 aparece em três leituras e é glosado uma vez. Corrigir um pinyin
   errado é uma edição, não dez.
2. **Duas formas por palavra.** O botão 简/繁 troca cada token pelo campo `traditional` do
   dicionário. Como a conversão é **por palavra**, ela é explícita: 乾淨 e 著急 não dependem de o
   navegador acertar um caractere isolado.
3. **Hover e glossário leem a mesma fonte.** O balão, a lista de glossário e o ruby usam o mesmo
   `MandarinWord`; não existe uma segunda cópia para divergir.

O tokenizador **não adivinha**: uma chave que não está no dicionário vira um token literal
(renderizado como texto, para a página não cair) e `mandarin-content.spec.ts` falha a build. Um erro
de digitação é teste vermelho, não uma palavra some da lição.

Limitações conhecidas do modelo, de propósito:

- **Conversão no nível da palavra**, não da frase. É o que dá garantia por entrada; não cobre
  variação regional de forma tradicional (里/裡, 台/臺).
- **Pinyin de base**, sem sandhi de tom (_一_ e _不_ aparecem com o tom de dicionário; em contexto
  falado mudam).
- **Sem áudio.** O escopo pedido era ler e descobrir palavras.

### Homógrafos: um `id` novo no dicionário abre um buraco no glossário (2026-11-10)

O dicionário prevê dois significados para os mesmos caracteres via `id` — a válvula de escape para
casos como `点` (hora, em 七点) ou `点` (pedir, no restaurante). **Antes do primeiro homógrafo de
verdade, o glossário precisa ser corrigido.** `mandarin-reader.component.html` lista as palavras com
`@for (word of text.glossary; track word.zh)`, e as duas entradas do homógrafo têm o mesmo `zh` (e o
mesmo pinyin, que é o ponto do homógrafo): o Angular chaveia a coleção com chave duplicada, lança
`NG0955` e derruba a página de leitura. O texto em si não sofre — ele renderiza tokens, que são
identidades distintas, e só o glossário usa `zh`.

Hoje não há `zh` repetido no dicionário, e não foi sorte: as sete leituras de 2026-11-10 tiveram de
contornar `点`, `把` e `家` por isso mesmo — daí `一把`, `一家` e `要不要` entrarem como palavras
inteiras. O conserto, quando o primeiro homógrafo for necessário, é uma linha (chavear pelo índice,
não pelo caractere):

```html
@for (word of text.glossary; track $index) {
```

`track word.zh + word.pinyin` **não** resolve: um homógrafo tem som idêntico por definição. O gate
não pega esse buraco — `mandarin-content.spec.ts` não testa `zh` duplicado, porque a chave do
dicionário (`id ?? zh`) é única por construção. Quem adicionar um `id` novo abre este arquivo antes.

## A experiência de leitura

Os quatro controles são estado local da página, não da rota — todos descrevem **como** o texto é
lido, não **qual** texto está aberto. Eles resetam ao trocar de leitura, de propósito: pinyin
ligado, simplificado e sem espaço é o ponto de partida que um iniciante quer em todo texto novo.

| Controle | O que faz | Onde mora |
| :--- | :--- | :--- |
| Pinyin | mostra/esconde o `<rt>` de cada `<ruby>`; a linha **não reflui** ao esconder | `.hide-pinyin rt { display: none }` |
| 简 / 繁 | troca a forma exibida de cada palavra pelo campo `traditional` | `scriptWord()` no componente |
| Espaço entre palavras | margem **só entre palavras vizinhas** (`.word + .word`); pontuação fica colada | CSS, classe `show-spaces` |
| Tradução | mostra o parágrafo pt-BR equivalente, alinhado por índice | `text.translation[p]` |

Além deles:

- **A capa 16:9** abre a leitura, entre o cabeçalho e a barra de controles — é a mesma ilustração
  que o card mostrava no hub, no tamanho da página (seção de capas, abaixo).
- **Hover/Toque numa palavra** mostra um balão com pinyin e significado. Clique fixa (útil no
  celular e para comparar duas palavras); `Enter`/`Espaço` fixam pelo teclado. No teclado, o foco
  visível também abre o balão — `:focus-visible` sem JS extra.
- **Nota de contexto** (quando existe) e **glossário** fecham a página: o glossário é a lista de
  palavras do texto com pinyin e glosa, já com a forma simplificada/tradicional escolhida.

## Tema claro/escuro (2026-11-09)

O topo de cada página da seção — o hub de leitura e cada texto — tem um botão **Tema claro**. Ele
não é um ajuste da plataforma inteira: as exatas continuam escuras, e o card "Línguas" da home
também. A decisão é que ler é um uso diferente de explorar widget, e quem lê à noite pode preferir
papel quente; ninguém precisa de um tema global para isso.

| Aspecto | Decisão |
| :--- | :--- |
| Preferência | `localStorage`, chave `visualab:languages-theme` — sobrevive a recarregar e a ir do hub para um texto |
| Primeira visita | acompanha `prefers-color-scheme`; sem preferência do sistema, escuro |
| Troca | estado no serviço `LanguageTheme` (`provideIn: 'root'`); a página host recebe `.theme-light` e `<html>` recebe `lang-theme-light` |
| Cores | as duas paletas vivem em `_language-theme.scss`, como variáveis de papel (`--lang-card-bg`, `--lang-tip-bg`, …). São declaradas **uma vez no documento** — `:root` (escuro) e `html.lang-theme-light` (claro) em `src/styles.scss` — e herdadas pelos dois componentes, que não redefinem token nenhum |
| Chrome ao redor | `<html>` recebe `lang-theme-light` enquanto **alguma** página da seção está montada (contador de páginas no serviço), para body, nav, footer e as margens do body acompanharem; a regra mora em `src/styles.scss` |

Os controles de leitura (pinyin, 简/繁, espaço, tradução) e o tema são estados independentes: trocar
o tema não mexe no texto, e trocar de texto não devolve o tema ao padrão — só os controles de
leitura resetam, porque o padrão deles é o ponto de partida de aprendizagem.

Deep link não pisca: um script inline em `src/index.html` aplica a classe `lang-theme-light`
**antes** do bootstrap do Angular, lendo a mesma chave e os mesmos defaults do serviço — é uma
cópia mínima e marcada em comentário, não uma segunda fonte de verdade.

O que o toggle **não** faz: não altera o tema das lições de exatas (decisão de produto, não
limitação técnica), e não anima a troca além do necessário — a preferência é sobre contraste, não
sobre ornamento.

## As capas: uma ilustração 16:9 por texto (2026-11-12)

Toda leitura tem uma ilustração, e ela aparece **duas vezes**: como miniatura no
card do hub (`language-hub`) e como capa no topo da leitura (`mandarin-reader`).
É a mesma imagem em dois tamanhos, não duas imagens que podem divergir.

```
public/img/mandarin/<id>.webp        1280×720 — capa da leitura
public/img/mandarin/<id>-card.webp    640×360 — miniatura do card (metade)
```

O `<id>` é o mesmo `id` do texto em `mandarin-texts.ts` (`hsk1-meu-domingo`), e o
caminho é **derivado**, não autorado: `mandarinCover(id)` em `mandarin-content.ts`
monta o par, e `MandarinText.cover` chega ao componente já resolvido. Autorar 17
caminhos à mão criaria 17 lugares onde o nome do arquivo pode não bater com o
`id` — e o sintoma seria uma imagem quebrada, que nenhum teste de navegador
consegue pegar. Assim o nome do arquivo e o id são o mesmo fato.

| Decisão | Por quê |
| :--- | :--- |
| **16:9 exato**, sem `background-size` no caminho | todas as imagens nascem 1536×864; a moldura (`aspect-ratio: 16 / 9`) e o `object-fit: cover` existem para o dia em que uma não for — a caixa não muda, a imagem é recortada |
| **Dois tamanhos** | o card tem ~285–400 px de largura e baixaria uma imagem de 1280 px; a capa tem 920 px e baixaria uma de 640 px borrada. Duas variantes custam 34 arquivos e ~1,35 MB no total |
| **WebP, não PNG** | as 17 originais em PNG somavam **27 MB** (1,26–2,41 MB cada) para uma galeria que mostra as 17 de uma vez. As mesmas imagens em WebP q82/q80 somam 1,35 MB — 20× menor sem diferença visível na tela |
| **`alt=""`, decorativo** | em ambos os lugares o título do texto está imediatamente ao lado da imagem; descrever a ilustração em `alt` faria o leitor de tela anunciar a mesma coisa duas vezes |
| **`width`/`height` declarados** | a caixa 16:9 é reservada antes de a imagem chegar: nenhum salto de layout no grid dos cards |
| `loading="lazy"` no card, **não** na capa | no hub são 17 imagens abaixo da dobra; na leitura a capa é o topo da página e é o maior elemento visível — adiá-la só atrapalharia |

Os **originais em PNG ficam fora do que é publicado**, em `image-source/mandarin/`
(1536×864, ~27 MB). `public/` é copiado inteiro para o build; `image-source/` não.
Eles são o master para regerar outro recorte (por exemplo uma imagem de Open
Graph 1200×630) e não são versionados — se não interessarem, apagar a pasta não
quebra nada, e as duas variantes WebP continuam sendo o que a aplicação serve.

O que o gate cobre: `mandarin-content.spec.ts` verifica que **toda** leitura tem o
par derivado do seu id, que os caminhos são únicos e que a chave é `[a-z0-9-]`
(logo, nome de arquivo válido). O que ele **não** pode verificar é existência de
arquivo — o teste roda no navegador, e `public/` é servido, não lido. Por isso
"adicionar um texto" tem um passo de imagem: esquecê-lo não deixa o teste
vermelho, deixa a imagem quebrada.

## Expressões: o sanduíche, e por que o foco é registro (2026-11-13)

A coleção ganhou uma quarta categoria, `expressoes`, e o texto que a inaugura é
`hsk3-toco-e-o-coelho` (守株待兔). As quatro decisões que a definem, e o motivo de cada uma:

| Decisão | Por quê |
| :--- | :--- |
| **Uma leitura por expressão** | cada 成语 tem a sua imagem, o seu uso e a sua armadilha de tradução; agrupar três num texto devolve o formato de glossário que a plataforma existe para não ser |
| **Fábula e cena moderna no mesmo texto** | a fábula mostra a imagem, a cena moderna mostra a **fala**. Separá-las em dois textos custaria duas capas e nunca mostraria a passagem de uma para a outra |
| **`expressoes` é um foco novo, não `cultura`** | os outros três focos são **tópicos**; este é um **registro**. Um 成语 pertence à fala escrita/formal, um 谚语 à fala de conselho, uma expressão moderna à internet |
| **`literal` é um campo, não um `note` mais comprido** | “守 = vigiar, 株 = toco” e “diz-se a um colega para criticar” são dois trabalhos diferentes; um campo por trabalho, e o spec cobra o primeiro |

A estrutura de cada leitura é um **sanduíche de sete parágrafos**:

1. **1–3 · a fábula.** Os caracteres do 成语 aparecem como palavras normais do dicionário
   (`农夫`, `兔子`, `树桩`), nunca em bloco. O leitor monta a imagem antes de receber o nome.
2. **4 · a ponte.** `故事 很 老 。 但是 这样 的 人 今天 也 有 。` — uma frase, e o leitor sabe que
   o texto vai pular de século.
3. **5–7 · a cena moderna.** Alguém repete o erro de hoje, e a expressão aparece **inteira, em
   bloco** (`守株待兔`), na boca de um terceiro. O parágrafo 7 é o mais importante: a **reação** do
   personagem é onde a expressão deixa de ser etiqueta e vira algo que se diz a alguém.

Isso é "explorar antes de nomear" aplicado ao idioma: o aluno vê a imagem (fábula), vê a
consequência (cena) e só então a fórmula ganha nome — exatamente o que as lições de exatas fazem com
uma fórmula.

### O bloco e os caracteres, no mesmo dicionário

Um 成语 entra no dicionário como **uma** entrada (`守株待兔` → `shǒu zhū dài tù`), e os caracteres
que a fábula usa entram como palavras comuns (`树桩`, `兔子`, `田`). Não é duplicação: são chaves
diferentes (`zh` distinto), e as duas existem porque as duas são verdade — o bloco é fixo, as
palavras não são. Efeito colateral bem-vindo: como o pinyin fica no bloco, `一` e `不` podem ser
escritos com o sandhi que um falante realmente diz (`yì zhī`, `bú yào`) sem a limitação de sandhi
que o dicionário tem palavra a palavra.

A regra editorial que sobra disso, para as próximas 25:

> **Tem fábula (8): conte a fábula.** 塞翁失马, 画蛇添足, 亡羊补牢, 半途而废, 守株待兔, 对牛弹琴,
> 掩耳盗铃, 井底之蛙.
> **Não tem (18): encene a imagem literal.** 一石二鸟 → a pedra e os dois pássaros; 天上不会掉馅饼 →
> alguém esperando a torta cair do céu; 得寸进尺 → um palmo, depois um metro.

### Calques: os pares ficam, a lição vai na nota

`一石二鸟` e `天下没有免费的午餐` são **calques** — a primeira é moderna (séc. XX, do inglês), a
segunda traduz o "there is no such thing as a free lunch". A tentação é trocá-las pelas nativas
(`一举两得`, `天上不会掉馅饼`). **Decisão: ficam as duas**, porque as duas são o que as pessoas
realmente dizem, e porque o fato interessante não é "é falsa" — é "é jovem". Um 成语 de 30 anos ao
lado de um de 2.000 ensina que a categoria não é fóssil.

O par é entregue **em notas**, nunca num texto só: uma leitura que compara duas expressões precisaria
de vocabulário abstrato (`翻译`, `说法`, `借用`) — a mais difícil da coleção — e não tem nem fábula
nem imagem para explorar. Assim cada expressão continua com o seu texto, e a nota de cada uma aponta
para a gêmea. As duas gêmeas entram no backlog como pendentes.

### O backlog: uma planilha que virou gate (2026-11-13)

As 26 expressões vivem em [`./mandarin-expressions.ts`](./mandarin-expressions.ts) — uma linha por
leitura a escrever, 28 no total (26 da planilha + as 2 gêmeas nativas) — e não mais na planilha.

**Por que um `.ts` e não o `.xlsx`.** O gate é `./mandarin-expressions.spec.ts`, que roda no
navegador, sem sistema de arquivos: um `.xlsx` não pode ser um teste, um módulo TypeScript pode. A
planilha foi para `../expression-source/` (fora de `public/`, portanto fora do que é servido) e
ficou **congelada como proveniência** — editá-la não muda nada no app.

A linha é um `MandarinWord` com metadados editoriais, e isso é o que faz o gate valer:

```
mandarin-expressions.ts          O PLANO — 28 linhas, cada uma com status
        │
        ├──► mandarin-content.spec.ts       (o que a leitura tem de cumprir)
        └──► mandarin-expressions.spec.ts   (o que o plano tem de cumprir)
```

O spec cobra os dois sentidos:

| Asserção | O que impede |
| :--- | :--- |
| `'escrito'` → `textId` existe, é `expressoes`, e o bloco aparece **uma vez, como um token** | uma linha marcada como pronta que nenhuma leitura ensina |
| a linha `'escrito'` é **idêntica** à entrada do dicionário (`zh`, `traditional`, `pinyin`, `meaning`) | o plano e a leitura descrevendo duas glosas para os mesmos caracteres — quando divergem, **o dicionário ganha**, porque é ele que o aluno lê no balão |
| `'pendente'` → o bloco **não aparece** em nenhuma leitura | um status que ficou para trás depois da leitura escrita |
| toda leitura `expressoes` é reivindicada por **exatamente uma** linha | uma leitura de expressão que o backlog não conhece |
| as gêmeas apontam de volta uma para a outra | uma nota prometendo uma expressão que não existe |

O que ele não cobre: se a fábula está bem contada, se o registro está certo, e o pinyin das linhas
`'pendente'` (que é o da planilha, e é re-decidido quando a linha vira `'escrito'`, onde aí sim ele
passa a ser comparado).

### O que esta entrega **não** inclui

- **As capas.** Nenhuma das leituras de expressão tem `<id>.webp` nem `<id>-card.webp` ainda: o card
  do hub e a capa da leitura ficam quebrados até alguém soltar os dois arquivos em
  `public/img/mandarin/`. O spec não acusa (ele não lê o sistema de arquivos), como a seção de capas
  já avisa.
- **As 25 leituras restantes.** Três escritas (`守株待兔`, `画蛇添足`, `井底之蛙`), 25 pendentes no
  backlog.
- **Revisão por falante nativo.** O gate cobre forma, não idiomaticidade: um pinyin errado ou um
  registro deslocado passam verdes.

## O conteúdo é original

As leituras foram escritas para este projeto. A **ideia** vem do [Mandarin Bean](https://mandarinbean.com/)
— texto curto, nivelado e com pinyin alternável — e é creditada por isso; nenhum texto foi copiado
dele nem de qualquer outro site. A vantagem de escrever em vez de copiar não é jurídica: é poder
corrigir, traduzir para pt-BR e ajustar o vocabulário sem pedir licença a ninguém.

O nível (HSK 1–5) é **editorial**: descreve o vocabulário-alvo do texto, não uma certificação por
lista oficial. Os textos cobrem os cinco níveis e os quatro focos, e é isso que o spec verifica.

O nível de uma leitura de `expressoes` descreve a **narração**, não o bloco: 守株待兔 é HSK 3 porque a
fábula e a cena são HSK 3, e o 成语 — vocabulário de HSK 6 — fica acima do nível de propósito.
Fingir que o bloco é HSK 3 seria a mentira fácil; o `literal` e a nota existem justamente para o
leitor esbarrar no bloco sabendo o que ele é.

## O que o gate cobre

`mandarin-content.spec.ts` é o contrato do conteúdo:

- toda chave de parágrafo resolve para o dicionário ou é pontuação conhecida;
- o dicionário não tem chave duplicada e nenhuma entrada fica sem uso;
- toda entrada tem as duas formas, pinyin com acentos (sem número de tom) e glosa;
- toda leitura tem título, chamada, parágrafo e tradução alinhada um a um;
- toda leitura em `expressoes` traz o `literal` que decompõe os caracteres da expressão;
- toda leitura tem o par de capas derivado do seu `id`, e nenhum caminho se repete;
- nenhum parágrafo tem mais de `MAX_WORDS_PER_PARAGRAPH` palavras nem mais de três frases;
- `wordCount`, `glossary` e `minutes` são derivados de fato, não digitados.

O que ele **não** cobre: revisão por falante nativo, avaliação didática da progressão, áudio,
sandhi, a existência dos arquivos de capa (o teste roda no navegador, sem sistema de arquivos) e a
unicidade de `zh` entre entradas (o caso dos homógrafos, na seção acima). Se um pinyin
está errado, o spec não sabe — o dicionário é o único lugar onde essa correção entra.

O backlog tem o seu próprio contrato, `mandarin-expressions.spec.ts`: status nos dois sentidos,
linha `'escrito'` idêntica ao dicionário, toda leitura de expressão reivindicada, gêmeas simétricas.
A tabela das asserções está na seção do backlog, acima.

## Como adicionar um texto

1. Escreva o parágrafo em `mandarin-texts.ts`, com uma chave por palavra e a pontuação como token.
   Tradução com **um parágrafo por parágrafo** da leitura.
2. Toda chave nova entra em `mandarin-words.ts`, com `traditional` explícito (mesmo quando igual),
   pinyin com acentos e glosa curta em pt-BR. Se a leitura precisar de dois significados para os
   mesmos caracteres, leia antes a seção de homógrafos: o `id` só funciona depois que o glossário
   deixar de chavear por `zh`.
3. Solte as duas capas em `public/img/mandarin/`, nomeadas pelo `id` do texto:
   `<id>.webp` (1280×720) e `<id>-card.webp` (640×360). Nada no código muda — o caminho é derivado
   do `id` — mas **sem os dois arquivos o card e a capa ficam quebrados**, e o teste não acusa isso.
   O master 1536×864 do qual as duas saem mora em `image-source/mandarin/` (ver a seção de capas).
4. Se a leitura ensina uma expressão (`focus: 'expressoes'`), o `literal` é obrigatório: a
   decomposição dos caracteres vai nele, e o uso/registro vai no `note`. O spec cobra o primeiro.
5. A linha correspondente em `mandarin-expressions.ts` muda para `status: 'escrito'`, ganha o
   `textId` e **passa a ter exatamente os campos do dicionário** (`zh`, `traditional`, `pinyin`,
   `meaning`). Divergir é teste vermelho — e quando divergem, quem manda é o dicionário.
6. Rode da **raiz do monorepo**:

   ```bash
   npm run test:headless     # o gate de conteúdo e os specs de UI
   npx ng build ml-platform --configuration production
   ```

O spec aponta a linha que falhou (chave desconhecida, parágrafo longo, tradução desalinhada, palavra
do dicionário sem uso). O leitor e o hub não precisam de código novo: o card e a rota aparecem
sozinhos porque ambos leem `MANDARIN_TEXTS`.

## O que ainda não existe

- **Progresso por texto.** `@shared/progress` guarda lições concluídas; "li este texto" não é a
  mesma coisa. Quando existir, é decisão própria (lido? vocabulário revisado?), não uma chave
  reaproveitada.
- **Um segundo idioma.** A rota já é `/linguas/:trackId/:textId` e `LANGUAGE_TRACKS` é a lista —
  adicionar outro idioma é um leitor novo (o de mandarim não é genérico) e mais um card.
- **Áudio, busca, vocabulário salvo.** Fora do escopo desta primeira entrega.
