# content-source

Fonte de conteúdo do `ml-platform`: um arquivo markdown por capítulo de livro, que
alimenta a geração das lições dos 4 cursos.

> **Sobre os nomes dos cursos.** Os quatro cursos foram batizados depois que este
> arquivo foi escrito, e por um tempo tiveram nomes de trabalho — *Regressor Linear*,
> *Classificador*, *Rede Neural*, *Clusterizador* — que descreviam o **artefato** que cada
> curso constrói, não o assunto. Eles sobrevivem em [`../syllabus-content/methodology.md`](../syllabus-content/methodology.md),
> que é artefato e não se edita, e dentro dos trechos já extraídos (o item "(d) Como o
> Conceito Aparece nos Outros Modelos (Regressor Linear, Classificador, Rede Neural,
> Clusterizador)" é a marca deles). O catálogo atual usa os nomes de assunto, e o mapeamento
> é 1:1:

| Nome de trabalho (dump-02) | Nome atual (catálogo) |
| :--- | :--- |
| Curso 1 — Regressor Linear | **Fundamentos Matemáticos para ML** (constrói o regressor) |
| Curso 2 — Classificador | **Aprendizado Supervisionado** |
| Curso 3 — Rede Neural | **Redes Neurais do Zero** |
| Curso 4 — Clusterizador | **Aprendizado Não-Supervisionado** |

> A troca está registrada em [`../src/app/studies/study-catalog.ts`](../src/app/studies/study-catalog.ts),
> onde os **ids** (`regressao-classificacao` e companhia) foram mantidos de propósito: são
> chaves internas, e renomeá-las orfanaria o progresso salvo de quem já usou a plataforma.

**Estado: Curso 1 completo na fonte, e as âncoras conferidas contra o livro.** Já extraídos: MML
caps. **1, 2, 3, 4, 5, 6, 7, 9** (com IDs ancorados no número da seção do livro) e caps. **11, 12**
(extraídos, ainda sem IDs — ver pendências). Faltam apenas os **4 capítulos do NNDL** (Curso 3),
que continuam vazios de propósito.

> **Rodada complementar (2026-10-04).** Uma segunda extração — prompts em
> [`PIPELINE.md`](./PIPELINE.md#prompts-de-extração--camada-1-rodada-complementar-2026-10-04),
> saída em [`../syllabus-content/MML_cursos_1_2_4_complemento.md`](../syllabus-content/MML_cursos_1_2_4_complemento.md)
> — trouxe a **§5.1** e a **§5.5**, que faltavam, e corrigiu **oito âncoras** que a primeira
> extração tinha inventado. O livro estava aberto: `mml-book.pdf`, Draft 2024-01-15. As correções
> estão na tabela de buracos abaixo, uma a uma, com o número que o livro realmente usa.

O processo de geração — camadas, prompts, auditoria e checklist — está em
[`PIPELINE.md`](./PIPELINE.md). Os contratos das lições estão em
[`../manifests/`](../manifests/README.md): **12 manifestos, 12 validando** (`npm run validate:manifests`).

---

## Registro do dump

| Campo | Valor |
| :--- | :--- |
| Data do dump | **2026-09-19** (dump-02) · **2026-10-04** (dump-03) |
| Versão | **dump-03** |
| Material de origem | [`../syllabus-content/`](../syllabus-content/) |
| Idioma do conteúdo | pt-BR |
| Conteúdo dos capítulos | 10 de 12 capítulos com arquivo de destino (caps. 1–7, 9, 11 e 12); os caps. 8 e 10 estão no dump e ainda não têm destino |

### Arquivos de origem (fixados por hash)

Os hashes identificam exatamente o dump que originou esta estrutura. Se algum arquivo
de `syllabus-content/` mudar, o hash muda e a versão sobe — as lições derivadas precisam
ser reconferidas.

| Arquivo de origem | Linhas | SHA-256 | Modificado em |
| :--- | ---: | :--- | :--- |
| `methodology.md` | 163 | `2fa4d3e9c5e44e84e0fffac1987f4c551903940f55cd2c2d4e5d67dd31f04ae9` | 2026-09-20 19:02 |
| `MML_cursos_1_2_4.md` | 2388 | `f917444f5d97b9e20b85c1a8799b81efdc284aeeab9b54dc78edabb3b9c4d2a8` | 2026-09-19 14:52 |
| `MML_cursos_1_2_4_complemento.md` | 1066 | `395f448303ed05bc711849c50749031373f4958966b5300106e4f13601e0eeae` | 2026-10-04 |
| `NNDL_curso_3.md` | 271 | `68c054f296eac409b6e72dad1dbc91629133ffc5c89caaaafc4a8d3b75e8e26e` | 2026-09-19 14:41 |

**Por que `dump-02` → `dump-03`:** entrou um arquivo novo em `syllabus-content/` — a extração
complementar. Ele é a origem **das seções completadas e reancoradas**, não do Curso 1 inteiro:
`MML_cursos_1_2_4.md` continua sendo a origem da estrutura, e o hash dele **não mudou**. As lições
afetadas são as que citam §2.7, §5, §6.4.6/§6.7, §7.3 e §9 — na prática, `fundamentos-teoria-03`
(que citava o endereço errado) e as três `aplicada` que citam §9.2; todas foram reconferidas.

**Por que `dump-01` → `dump-02`:** `methodology.md` mudou (hash novo, 156 → 163 linhas).
A mudança foi de formatação — as tabelas quebradas viraram tabelas markdown válidas — e o
vocabulário de widgets e o mapeamento passo→capítulo continuam os mesmos. Por isso **nenhuma
lição precisa ser reconferida**; a versão sobe só para a rastreabilidade ficar honesta.
`MML_cursos_1_2_4.md` e `NNDL_curso_3.md` não mudaram — o cap. 6 foi fatiado deles, então a
versão do dump **não** sobe de novo por causa disso.

Livros de referência:

- **MML** — *Mathematics for Machine Learning*, Deisenroth, Faisal & Ong.
- **NNDL** — *Neural Networks and Deep Learning*, Michael Nielsen.

---

## Mapa: arquivo de destino → fonte

### `mml/` — Mathematics for Machine Learning (Parte I e II)

| Arquivo | Capítulo | IDs de seção | Status |
| :--- | :--- | :--- | :--- |
| `mml/01-introduction.md` | Cap. 1 — Introduction and Motivation | — (só o ID de capítulo `mml-1`) | Extraído no dump-03 |
| `mml/02-linear-algebra.md` | Cap. 2 — Linear Algebra | §2.1, §2.3–§2.8, §2.7.3 (8) | Extraído |
| `mml/03-analytic-geometry.md` | Cap. 3 — Analytic Geometry | §3.1–§3.9 (9) | Extraído |
| `mml/04-matrix-decompositions.md` | Cap. 4 — Matrix Decompositions | §4.1–§4.6 (6) | Extraído |
| `mml/05-derivatives-gradients.md` | Cap. 5 — Vector Calculus | §5.1–§5.8 (8) | Extraído — §5.1 e §5.5 no dump-03 |
| `mml/06-probability.md` | Cap. 6 — Probability and Distributions | §6.1, §6.3–§6.7, §6.4.6 (7) | Extraído — §6.7 separada no dump-03 |
| `mml/07-continuous-optimization.md` | Cap. 7 — Continuous Optimization | §7.1–§7.3, §7.3.1–§7.3.3 (6) | Extraído — §7.3.1–§7.3.3 no dump-03 |
| `mml/09-linear-regression.md` | Cap. 9 — Linear Regression | §9.1–§9.2, §9.2.1–§9.2.4, §9.3–§9.4 (8) | Reancorado no dump-03 |
| `mml/11-gaussian-mixture.md` | Cap. 11 — Density Estimation with GMM | — | Extraído sem IDs — pendência 1 |
| `mml/12-classification.md` | Cap. 12 — Classification (SVM) | — | Extraído sem IDs — pendência 2 |

**52 IDs de seção** nos 7 capítulos ancorados, mais 5 IDs de capítulo (`# mml-1`, `# mml-4`,
`# mml-6`, `# mml-7`, `# mml-9`).

### `nndl/` — Neural Networks and Deep Learning

| Arquivo | Capítulo | IDs de seção | Status |
| :--- | :--- | :--- | :--- |
| `nndl/01-recognition.md` | Cap. 1 — Using neural nets to recognize handwritten digits | — | vazio — pendência 4 |
| `nndl/02-backprop.md` | Cap. 2 — How the backpropagation algorithm works | — | vazio — pendência 4 |
| `nndl/03-techniques.md` | Cap. 3 — Improving the way neural networks learn | — | vazio — pendência 4 |
| `nndl/04-visual-proof.md` | Cap. 4 — A visual proof that neural nets can compute any function | — | vazio — pendência 4 |

---

## Numeração: o ID é a seção do livro

O ID de um heading é o **número da seção do livro** — `## mml-5.2 — Derivadas Parciais e
Gradiente`. Assim um `sourceRef` de manifesto lê igual ao sumário do MML, e a citação que o
gerador escreve (`[MML §5.2]`) aponta para o mesmo lugar que o endereço.

Quando a extração funde duas seções num tópico ou não traz uma seção, **a sequência pula** — e
isso é informação, não desleixo. Um ID ausente diz exatamente o que falta na fonte:

| Arquivo | IDs | Buracos na sequência e por quê |
| :--- | :--- | :--- |
| `mml/02` | 2.1, 2.3, 2.4, 2.5, 2.6, 2.7, 2.7.3, 2.8 | **§2.2** dentro de `mml-2.1` (§2.1+§2.2 juntos); **§2.7.1 e §2.7.2** dentro de `mml-2.7` (representação matricial e mudança de base juntas). O ID `mml-2.7.3` foi **corrigido no dump-03**: era `mml-2.7.1`, que no livro é *Matrix Representation of Linear Mappings* — imagem e núcleo são §2.7.3 |
| `mml/03` | 3.1–3.9 | nenhum — alinhado 1:1 com o livro |
| `mml/04` | 4.1–4.6 | nenhum — alinhado 1:1 com o livro |
| `mml/05` | 5.1–5.8 | nenhum — **§5.1 e §5.5 entraram no dump-03** e a sequência fechou. A §5.5 continua também dentro de `mml-5.4`, no item "(e) Fórmulas Relevantes (Identidades Úteis - Seção 5.5)" da extração antiga: duplicação conhecida, mantida porque editar trecho extraído não é permitido |
| `mml/06` | 6.1, 6.3, 6.4, 6.4.6, 6.5, 6.6, 6.7 | **§6.2** dentro de `mml-6.1`; **§6.4.1–6.4.3** dentro de `mml-6.4`. A **§6.7** ganhou heading próprio no dump-03 (antes dividia o ID com a §6.4.6, cujo assunto real é *Inner Products of Random Variables*). A §6.7 continua **fora de ordem**, antes de §6.5/§6.6, porque a extração a pôs ali |
| `mml/07` | 7.1, 7.2, 7.3, 7.3.1, 7.3.2, 7.3.3 | nenhum — **corrigido no dump-03**: a extração antiga usava `mml-7.4` (LP+QP juntos) e `mml-7.5` (Legendre-Fenchel), e nenhuma das duas existe no livro — §7.4 é *Further Reading*, e LP/QP/Legendre são **subseções de §7.3** |
| `mml/09` | 9.1, 9.2, 9.2.1–9.2.4, 9.3, 9.4 | nenhum — **reancorado no dump-03**. A extração antiga tinha seis blocos inventados: `mml-9.3` era *Feature Mapping* (conteúdo de §9.2), `mml-9.4` era MAP/regularização (conteúdo de §9.2.3/§9.2.4), `mml-9.5` era regressão Bayesiana (que é **§9.3**) e `mml-9.6` era MLE como projeção ortogonal (que é **§9.4**). O livro não tem §9.5 nem §9.6 — §9.5 é *Further Reading* |

Evidência usada, em ordem de força:

0. **O próprio livro** (`mml-book.pdf`, Draft 2024-01-15) — o sumário e os headings das seções. É
   o que o dump-03 usou, e é a única evidência que não depende de interpretação. Quando as três
   abaixo divergirem dele, ele ganha.
1. **As anotações "Seção Exata" do dump** (`MML_cursos_1_2_4.md`), que dizem, por tópico, a que
   seção do livro ele corresponde — ex. "Derivadas Parciais e Gradiente" → "Seção 5.2".
2. **Anotações dentro do próprio capítulo extraído** — ex. em `mml/05` o texto diz "Gradiente
   (Seção 5.2)", "Matriz Jacobiana (Seção 5.3)", "gradientes de matrizes (Seção 5.4)" e
   "identidades úteis (Seção 5.5)"; em `mml/06` os próprios títulos dos tópicos trazem "(Seções
   6.1 e 6.2)", "(Seção 6.3)", "(Seções 6.4.1 a 6.4.3)", "(Seções 6.4.6 e 6.7)", "(Seção 6.5)",
   "(Seção 6.6)".
3. **Título do tópico** — ex. "Máxima Verossimilhança como Projeção Ortogonal" = §9.4 do MML.

O que **não** tem evidência fica marcado como pendência em vez de receber um número inventado:
chutar um ID seria pior do que não ter ID, porque o gerador passaria a citar uma seção que não é
aquela.

---

## Pendências

1. **`mml/11-gaussian-mixture.md` não tem seções endereçáveis.** A extração aplicou o template
   (a)–(e) ao **capítulo inteiro** ("Definições Formais", "Intuição Geométrica", …) em vez de
   separar §11.1–§11.5, e como os IDs são números do livro não há como numerar esses headings sem
   mentir. Caminho correto: re-extrair com um heading por seção.
2. **`mml/12-classification.md` sem IDs.** Os headings trazem as seções do livro embutidas — 12.1,
   12.2, **12.2.5**, 12.3, **12.3.2**, 12.4 — então a numeração é conhecida, mas converter exige
   confirmar se "Hinge Loss" (§12.2.5) e "Convex Hull" (§12.3.2) viram IDs de subseção ou ficam
   como tópicos de §12.2/§12.3.
3. ~~**Subseções de `mml/07` e `mml/09` a confirmar no sumário do MML.**~~ **Resolvida no dump-03.**
   O livro diz: §7.4 é *Further Reading* (não existe §7.5; LP/QP/Legendre são §7.3.1/§7.3.2/§7.3.3)
   e o Cap. 9 vai até §9.4 (*Maximum Likelihood as Orthogonal Projection*) mais §9.5 *Further
   Reading*. Os seis IDs inventados foram corrigidos e o buraco fechou — a sequência de §7 e §9
   agora bate 1:1 com o livro.
4. **NNDL vazio e sem IDs.** Os 4 capítulos do Curso 3 estão por extrair; o gate já recusa
   qualquer manifesto que os cite (`arquivo sem IDs de seção`). É o único bloqueio de fonte que
   resta — o Curso 1 está completo.
5. **Capítulos sem arquivo de destino:** Cap. 8 (*When Models Meet Data*), Cap. 10
   (*Dimensionality Reduction with PCA*). Ambos aparecem no plano (Curso 2 e Curso 4) e existem no
   dump. PCA é o mais crítico: o Curso 4 depende dele para visualizar clusters — candidato a
   `10-dimensionality-reduction.md`. O **Cap. 1** saiu desta lista no dump-03: virou
   `mml/01-introduction.md`.
6. **Rótulo dos blocos (a)–(e) não é uniforme entre arquivos.** As extrações do dump-02 usam
   bullets indentados (`* **(a) …:**`); as do dump-03, para §2.7.3, §6.4.6/§6.7, §7.3.1–§7.3.3 e
   Cap. 1, vieram com `**(a) …**` em negrito, e para §5.1/§5.5 com `### (a) …`. O **conteúdo** está
   íntegro e endereçado em todos — é rótulo. Uniformizar significa reextrair aquelas seções com o
   template escrito por extenso (ver a nota no fim de [`PIPELINE.md`](./PIPELINE.md)).

## Regras desta pasta

- Um arquivo por capítulo; o nome nunca muda depois de gerado (lições referenciam o caminho).
- Toda seção tem **ID estável como heading**, no formato `## mml-<seção do livro> — Título`. Esse
  ID é o endereço citado nos manifests (`sourceRefs`) e nas citações dentro das lições. O
  separador é travessão (`—`), não hífen: é o que o gate procura.
- A lição é contratada em [`../manifests/`](../manifests/README.md) antes de ser gerada; o gate
  `npm run validate:manifests` confere se cada `sourceRef` do manifesto existe mesmo como heading
  aqui dentro — **e** se aquele endereço é uma seção que o livro tem, contra
  [`../manifests/book-sections.json`](../manifests/book-sections.json). Sem a segunda metade, um ID
  inventado na extração passava: o heading existia, então o ref resolvia. O mesmo gate varre **todo**
  heading desta pasta, inclusive os que nenhum manifesto cita ainda, e recusa endereço de
  *Further Reading* (bibliografia não é conteúdo). O que ele não consegue julgar é um número válido
  com o assunto trocado sem título comparável — a tabela de cobertura está em
  [`../manifests/README.md`](../manifests/README.md).
- **Ao criar um heading, confira o número no `book-sections.json`** antes de escrever o ref no
  manifesto. É uma consulta de um arquivo, e é o único detector para o caso que o gate não pega.
- Nunca edite um trecho extraído: se o conteúdo está errado, regenere a extração. A exceção é
  exatamente a normalização de headings (`### **1. …**` → `## mml-5.2 — …`), que é formato e
  endereço, não conteúdo — nela o corpo do texto não é tocado.
- A **notação** das fórmulas é a deste arquivo. Os manifestos cortam a fórmula literalmente daqui
  (`keyFormulas`) e o gate recusa fórmula reescrita — assim "fórmula plausível mas inventada" não
  passa. A intenção (quais fórmulas a lição ensina) é do manifesto; a notação é da fonte.
- Ao gerar um capítulo, atualize a coluna **Status** e a contagem de IDs na tabela acima, e o
  registro de hashes se o dump tiver mudado.
