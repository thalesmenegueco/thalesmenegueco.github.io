# Camada 3 — template de geração de lição

Este é o prompt da **Camada 3**: manifesto + trechos de `content-source/` entram, conteúdo
de lição sai. Ele existe porque a Camada 2 já fechou o *o quê* (objetivo, refs, widget,
fórmulas, critério de conclusão) e sobra o *como* — e o "como" é onde a geração deriva.

> **Por que este arquivo existe, e não uma seção no `PIPELINE.md`.** O `PIPELINE.md` guarda
> os prompts da Camada 1 (extração) e o plano das três camadas. Este é o prompt da Camada 3,
> que vai rodar uma vez por lição — 12 vezes só no Curso 1. Ele fica separado para poder ser
> citado, versionado e corrigido por medição, como os prompts de extração passaram a ser.

Assim como na Camada 1, **duas regras valem para toda geração**, e são o que torna a saída
utilizável como derivado de uma fonte:

1. **Só a FONTE AUTORITATIVA entregue.** Nada de conhecimento externo. Quando algo que o
   manifesto pede não está na fonte, a resposta é o escape hatch, não uma frase plausível.
2. **Todo bloco cita a seção de onde veio**, no formato `[MML §2.5]`, e toda citação é uma
   seção que o livro tem — ver a regra 5 abaixo.

---

## Regra 5, medida em 2026-10-04: nunca cite uma seção de *Further Reading*

O gate confere `sourceRefs` de manifesto e headings de `content-source/` contra
`book-sections.json`, e recusa endereço de *Further Reading* — bibliografia não é conteúdo.
**Ele não lê citações dentro de texto.** A reextração da §2.7.3 provou o buraco: o texto
gerado citou `[MML §9.4, §9.5]` para a ponte com o Regressor Linear, e a §9.5 é a
*Further Reading* do capítulo 9 — a bibliografia, não uma seção de conteúdo. A extração
anterior tinha o mesmo defeito apontando para a §11.5.

Ou seja: essa classe de erro passa por todo gate que existe hoje. A única defesa mecânica
possível é no prompt. Portanto:

> Não cite seções de *Further Reading*. Todo capítulo do MML termina o conteúdo em `N.M` e
> fecha com uma seção chamada *Further Reading*; ela lista leituras, não ensina nada. Se a
> afirmação que você quer fazer só existe na bibliografia, ela não existe na fonte — use o
> escape hatch.

A lista de endereços que o livro tem está em `manifests/book-sections.json`; os que são
bibliografia estão marcados lá com o título *Further Reading*.

---

## Contrato de saída: os campos, um por um

A saída satisfaz `LessonContent` de [`../../libs/ml-engine/lesson-content.types.ts`](../../libs/ml-engine/lesson-content.types.ts)
(importável como `@ml/engine`). **Não invente campos, não renomeie campos, não omita campos.**
Um campo a menos é uma lição que o runtime não consegue montar.

### `LessonContent` — a lição inteira

| Campo | O que é | De onde vem |
| :--- | :--- | :--- |
| `lessonId` | O id do manifesto | copiado do manifesto, sem alteração |
| `title` | Título exibido | o `title` do manifesto |
| `objective` | O que o aluno entende ao fim | o `objective` do manifesto, reescrito como promessa ao aluno |
| `steps` | Os passos, em ordem de descoberta | seu trabalho — ver o arco abaixo |

### `LessonContentStep` — cada passo

| Campo | Tipo | O que é |
| :--- | :--- | :--- |
| `id` | `string` | Estável dentro da lição: `passo-1`, `passo-2`, … |
| `title` | `string` | Título do passo, curto e concreto |
| `narrative` | `string[]` | **2 a 4 frases por bloco, um bloco por ideia.** É aqui que a ordem de descoberta acontece |
| `katex` | `string[]` | Fórmulas em KaTeX, **copiadas literalmente** das seções citadas |
| `widgetInteraction.widgetId` | `string` | O `widget` do manifesto, sem alteração |
| `widgetInteraction.prompt` | `string` | Instrução imperativa ao aluno, no widget |
| `widgetInteraction.expectedInsight` | `string` | O que o aluno deve **notar**. É o insight do passo |
| `checkpoint.question` | `string` | Pergunta de autoavaliação do passo |
| `checkpoint.answer` | `string` | A resposta, para o aluno conferir |
| `sourceRefs` | `string[]` | Seções de `content-source/` que o passo usa — só as que estão no `sourceRefs` do manifesto |

### Ênfase no texto: exatamente dois construtores

`narrative`, `checkpoint.question`, `checkpoint.answer`, `widgetInteraction.prompt` e
`expectedInsight` são renderizados como texto pelo player, e ele entende **dois** construtores
inline — nem um a mais:

| Sintaxe | Vira |
| :--- | :--- |
| `**termo**` | `<strong>termo</strong>` |
| `*termo*` | `<em>termo</em>` |

Nada de HTML, link markdown, lista, título ou crase. O player não é um parser de markdown: ele
conhece dois construtores para que o que uma lição pode conter continue sendo um conjunto
fechado que quem revisa consegue segurar na cabeça — a mesma razão pela qual as `keyFormulas`
aceitam só LaTeX padrão, "sem macros próprias nem sintaxe inventada".

**Por que a regra é necessária.** A fonte que o gerador lê é markdown cheio de `**` — toda
seção extraída rotula seus blocos `**(a) Definições Formais e Notação Exata:**`. A ênfase vaza
para a prosa gerada por construção do insumo, não por acidente. Medido em 2026-10-04: a
primeira versão do player interpolava o texto cru e o leitor viu `**combinação linear**` com
os asteriscos na tela. A correção foi o player renderizar a ênfase, e não a geração parar de
usá-la — assim uma geração futura não consegue reproduzir a falha escrevendo `**termo**`.

Use ênfase para o **termo que está sendo introduzido**, não para dar peso à frase. Se um
parágrafo tem três trechos em negrito, provavelmente nenhum deles precisava.

### O escape hatch

Se a fonte não cobre o que o manifesto pede, devolva **`{ "gap": "…" }`** no lugar do
conteúdo, descrevendo exatamente o que falta. Isso não é falha: é o sinal que evita
alucinação, e o destino dele é o campo `knownGaps` do manifesto, onde a decisão é do autor.

---

## O arco: pergunta → exploração → fórmula

Este é o requisito didático, e ele é **estrutural, não estilístico**. O app de Cálculo é o
exemplo que funciona, e o arco dele está codificado em `steps[].validation` — não na prosa.
Medido nas 7 lições de [`../src/app/calculus/lesson-data.ts`](../src/app/calculus/lesson-data.ts):

| Lição | Passos | Arco de validações, em ordem |
| :--- | ---: | :--- |
| what-is-a-limit | 3 | limitTableCompletion → limitTableCompletion → **formulaMatch** |
| limits-do-not-exist | 3 | modeSelection → modeSelection → **formulaMatch** |
| continuity | 3 | continuityToggle → continuityToggle → **formulaMatch** |
| slope-of-curve | 2 | range → **formulaMatch** |
| secant-to-tangent | 2 | range → **formulaMatch** |
| derivative-as-function | 3 | range → positiveDerivative → **formulaMatch** |
| derivative-rules | 4 | ruleSelection → ruleSelection → ruleSelection → **formulaMatch** |

**7 de 7 terminam nomeando a fórmula; 7 de 7 abrem com uma validação exploratória.** O
padrão é: o aluno mexe no widget e lê um número (ou escolhe um modo, ou observa um
comportamento), algumas vezes, e **só no último passo** a fórmula geral ganha nome. A
fórmula nunca abre a lição.

O que isso exige na prática:

- **2 a 4 passos.** Menos que 2 não tem arco; mais que 4 estoura os ~15 minutos.
- **O último passo nomeia a fórmula.** `title` diz que é a fórmula, `katex` traz a fórmula, e
  o `checkpoint` pergunta ao aluno o que ele acabou de descobrir — a resposta é a fórmula.
- **Todo passo anterior é exploração.** O `narrative` descreve o que ele vê, não o que ele
  deve concluir; a conclusão é do aluno, e o `expectedInsight` diz qual ela é.
- **Nenhum passo anterior enuncia a fórmula.** Se o passo 1 já dá a fórmula, os passos
  seguintes viram ilustração — que é o modo padrão de escrever, e o modo errado aqui.
- **Nomeie o termo no passo em que o aluno o usa, não depois.** Nomear a fórmula só no fim é
  o arco; esconder *vocabulário* até o fim é outra coisa. Se um passo pede que o aluno
  multiplique um vetor por um número, esse passo diz que o número se chama **escalar** —
  senão ele faz a operação por um passo inteiro sem saber como chamá-la. (Medido em
  2026-10-04: o leitor do piloto só encontrou a palavra no passo 3.)
- **Nada que o widget contradiga visualmente.** Se o texto afirma que uma operação nunca sai
  do plano e o desenho mostra o vetor saindo do quadro, o aluno aprende o contrário do que
  está escrito. O widget é evidência: ou ele mostra a afirmação, ou o `narrative` diz
  explicitamente que aquele passo não é demonstrado ali. (Medido na mesma leitura: a janela
  fixa de ±5 unidades fazia `λv` sumir do quadro enquanto o passo 2 dizia que nada sai do
  plano. A correção foi o widget derivar a escala do ponto mais distante e imprimir o
  tamanho da janela — o quadro é uma janela, o plano não tem borda.)
- **Distinga operações que se parecem.** Escalar aplica **um** número a **todas** as
  coordenadas; combinação usa **um número por vetor**. São duas operações diferentes com
  nomes parecidos, e o livro usa `λ` para as duas (`λᵢ` em §2.5, `λ` em §2.4(e)) — o texto
  precisa separá-las em voz alta, e o widget precisa rotular os controles de acordo.

### Exemplo de arco: `derivative-rules` (4 passos, 3 explorações + fórmula)

Este é o exemplar do arco porque é o único com **exploração repetida** (três passos no mesmo
widget, cada um sobre uma estrutura diferente) e porque o passo final tem `options` com
`feedback` por alternativa — o aluno escolhe e recebe o porquê, certo ou errado.

```
scenario: 'Uma empresa acompanha sua receita como preço vezes quantidade. Os dois valores
mudam ao longo do tempo. Em outro problema, o volume de um balão depende do raio, e o raio
depende do tempo. Como calcular a mudança final sem perder o caminho entre as variáveis?'

objectives:
  - Reconhecer quando uma função é uma potência simples.
  - Entender duas quantidades variando em um produto.
  - Acompanhar mudanças encadeadas.

passo 1  'Uma variável elevada a uma potência'
         widget: rulePlayground | validação: ruleSelection 'power'
         instruction: 'Ajuste o expoente e observe como a inclinação da função muda.
                       Este é o cenário mais simples.'
         explanation: 'Para uma potência, a regra do produto entre o expoente e a potência
                       reduzida organiza o limite em uma forma rápida.'

passo 2  'Receita: preço vezes quantidade'
         widget: rulePlayground | validação: ruleSelection 'product'
         instruction: 'Selecione produto. Observe que tanto o preço quanto a quantidade
                       podem contribuir para a mudança total da receita.'
         explanation: R'(t) = p'(t)q(t) + p(t)q'(t)

passo 3  'Raio, volume e tempo'
         widget: rulePlayground | validação: ruleSelection 'chain'
         instruction: 'Selecione cadeia. O raio muda com o tempo, e o volume muda com o
                       raio. A taxa final precisa atravessar essas duas relações.'
         explanation: dV/dt = (dV/dr)·(dr/dt)

passo 4  'As regras são atalhos'          ← o passo da fórmula
         widget: formulaMatch | validação: formulaMatch (correctAnswer 'a')
         instruction: 'Escolha a ideia comum às três regras.'
         options:
           a) 'Cada regra é uma forma organizada de calcular uma taxa de mudança'
              feedback: 'Correto. As regras não substituem a ideia de derivada; elas
                         tornam o cálculo mais eficiente.'
           b) 'Cada regra é uma fórmula sem relação com limites'
              feedback: 'As regras são consequências da definição da derivada e das
                         propriedades dos limites.'

summary:
  content: 'As regras de derivação refletem diferentes estruturas de problemas: uma
            potência, um produto de quantidades ou uma cadeia de dependências.'
  keyTakeaway: 'Antes de escolher uma regra, identifique como as variáveis estão
                relacionadas no problema.'
```

E a voz do cenário de abertura, de `what-is-a-limit` — um problema concreto, com um número
que o aluno quer saber e não pode calcular direto:

```
scenario: 'Você está analisando os dados de um carro entre os marcos 2 e 3 de uma estrada.
O velocímetro falhou exatamente no marco 2, mas os dados de distância ao redor desse ponto
ainda estão disponíveis. Como estimar o comportamento do carro quando ele se aproxima do
marco 2?'
```

Note o que o cenário **não** faz: não menciona limite, derivada, nem fórmula. Ele dá uma
pergunta prática; a matemática vem depois, e é o aluno que a nomeia.

### O que o contrato atual não expressa (limite conhecido)

`LessonContentStep` não tem `scenario` nem `options`/`feedback`, e o `checkpoint` é
pergunta-e-resposta em texto, não uma validação que o runtime possa conferir. Então, hoje:

- **O cenário de abertura vai no `narrative` do primeiro bloco**, como primeira frase, e o
  `objective` faz as vezes de promessa. Se o Curso 1 for ficar com a forma do Cálculo, isso
  é uma extensão do contrato — a decisão está registrada em `../src/app/lessons/README.md`.
- **O passo da fórmula nomeia no `title` e no `checkpoint`, e o aluno se autoavalia.** O
  equivalente do `formulaMatch` ainda não existe no contrato do ML.
- O `widgetId` é o **nome** do widget em `registries.json` (PascalCase), não um enum de
  runtime: o mapeamento nome→componente é feito no player.

Nada disso deve ser inventado pela geração. Gere dentro do contrato e registre o que faltou
como `gap`; a decisão de estender é do autor.

---

## Verificação: o que acontece depois de gerar

Geração confiável é geração **mais** auditoria. Os três níveis estão em
[`PIPELINE.md`](./PIPELINE.md#verificação--o-passo-que-a-maioria-pula-e-não-deveria):

| Nível | Como | O que pega |
| :--- | :--- | :--- |
| 1. Auditoria por prompt | cole a saída + a mesma FONTE e peça **só a lista de divergências** | fórmula alterada, notação inconsistente, afirmação que a fonte não tem |
| 2. Teste unitário | `numericExample` roda no `@ml/engine`; a prosa tem de conter os mesmos números | exemplo que não reproduz |
| 3. Checklist humano (4 itens) | você, lendo a lição | o que nenhum gate vê |

Os quatro itens do checklist humano, e o quarto é o que decide a lição:

1. As fórmulas batem com o livro?
2. O insight da widget é realmente "visível" ao interagir?
3. **A sequência discovery-based funciona (pergunta → exploração → fórmula)?**
4. Dá para completar em menos de ~15 minutos?

O que o gate **não** cobre, e por isso é trabalho humano declarado: se a fórmula escolhida é a
mais didática para aquela lição; se o `expectedInsight` descreve algo que a widget de fato
mostra; e toda citação dentro do texto (regra 5).
