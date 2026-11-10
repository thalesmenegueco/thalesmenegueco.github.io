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
mandarin-words.ts    o DICIONÁRIO — fonte única de pinyin, glosa pt-BR e forma tradicional.
        │
        ▼
mandarin-texts.ts    as LEITURAS — parágrafos como chaves separadas por espaço, tradução por
                     parágrafo e nota de contexto opcional.
        │            tokenização em `mandarin-content.ts`, no load do módulo
        ▼
MANDARIN_TEXTS       já resolvido: tokens, `wordCount`, `glossary`, `minutes`.
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

## O conteúdo é original

As leituras foram escritas para este projeto. A **ideia** vem do [Mandarin Bean](https://mandarinbean.com/)
— texto curto, nivelado e com pinyin alternável — e é creditada por isso; nenhum texto foi copiado
dele nem de qualquer outro site. A vantagem de escrever em vez de copiar não é jurídica: é poder
corrigir, traduzir para pt-BR e ajustar o vocabulário sem pedir licença a ninguém.

O nível (HSK 1–5) é **editorial**: descreve o vocabulário-alvo do texto, não uma certificação por
lista oficial. Os textos cobrem os cinco níveis e os três focos, e é isso que o spec verifica.

## O que o gate cobre

`mandarin-content.spec.ts` é o contrato do conteúdo:

- toda chave de parágrafo resolve para o dicionário ou é pontuação conhecida;
- o dicionário não tem chave duplicada e nenhuma entrada fica sem uso;
- toda entrada tem as duas formas, pinyin com acentos (sem número de tom) e glosa;
- toda leitura tem título, chamada, parágrafo e tradução alinhada um a um;
- nenhum parágrafo tem mais de `MAX_WORDS_PER_PARAGRAPH` palavras nem mais de três frases;
- `wordCount`, `glossary` e `minutes` são derivados de fato, não digitados.

O que ele **não** cobre: revisão por falante nativo, avaliação didática da progressão, áudio,
sandhi e a unicidade de `zh` entre entradas (o caso dos homógrafos, na seção acima). Se um pinyin
está errado, o spec não sabe — o dicionário é o único lugar onde essa correção entra.

## Como adicionar um texto

1. Escreva o parágrafo em `mandarin-texts.ts`, com uma chave por palavra e a pontuação como token.
   Tradução com **um parágrafo por parágrafo** da leitura.
2. Toda chave nova entra em `mandarin-words.ts`, com `traditional` explícito (mesmo quando igual),
   pinyin com acentos e glosa curta em pt-BR. Se a leitura precisar de dois significados para os
   mesmos caracteres, leia antes a seção de homógrafos: o `id` só funciona depois que o glossário
   deixar de chavear por `zh`.
3. Rode da **raiz do monorepo**:

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
