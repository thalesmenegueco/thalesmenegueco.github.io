# content-source

Fonte de conteúdo do `ml-platform`: um arquivo markdown por capítulo de livro, que
alimenta a geração das lições dos 4 cursos (Regressor Linear, Classificador, Rede
Neural, Clusterizador).

**Estado: esqueleto apenas — nenhum capítulo foi gerado ainda.** Os arquivos de
capítulo estão vazios de propósito; eles serão preenchidos na fase de geração.

---

## Registro do dump

| Campo | Valor |
| :--- | :--- |
| Data do dump | **2026-09-19** |
| Versão | **dump-01** |
| Material de origem | [`../syllabus-content/`](../syllabus-content/) |
| Idioma do conteúdo | pt-BR |
| Conteúdo dos capítulos | não gerado (somente estrutura) |

### Arquivos de origem (fixados por hash)

Os hashes identificam exatamente o dump que originou esta estrutura. Se algum arquivo
de `syllabus-content/` mudar, o hash muda — nesse caso a versão sobe para `dump-02` e as
lições derivadas precisam ser reconferidas.

| Arquivo de origem | Linhas | SHA-256 | Modificado em |
| :--- | ---: | :--- | :--- |
| `methodology.md` | 156 | `94ce696a0f7ed4f365dd820e546a8c75c629af02fa7c9d32908a15484edece0c` | 2026-09-19 13:53 |
| `MML_cursos_1_2_4.md` | 2388 | `f917444f5d97b9e20b85c1a8799b81efdc284aeeab9b54dc78edabb3b9c4d2a8` | 2026-09-19 14:52 |
| `NNDL_curso_3.md` | 271 | `68c054f296eac409b6e72dad1dbc91629133ffc5c89caaaafc4a8d3b75e8e26e` | 2026-09-19 14:41 |

Livros de referência:

- **MML** — *Mathematics for Machine Learning*, Deisenroth, Faisal & Ong.
- **NNDL** — *Neural Networks and Deep Learning*, Michael Nielsen.

---

## Mapa: arquivo de destino → fonte

### `mml/` — Mathematics for Machine Learning (Parte I e II)

| Arquivo | Capítulo | Seções | Status |
| :--- | :--- | :--- | :--- |
| `mml/02-linear-algebra.md` | Cap. 2 — Linear Algebra | §2.1–§2.8 | vazio |
| `mml/03-analytic-geometry.md` | Cap. 3 — Analytic Geometry | §3.1–§3.9 | vazio |
| `mml/04-matrix-decompositions.md` | Cap. 4 — Matrix Decompositions | §4.1–§4.6 | vazio |
| `mml/05-derivatives-gradients.md` | Cap. 5 — Vector Calculus | §5.1–§5.3 | vazio |
| `mml/07-continuous-optimization.md` | Cap. 7 — Continuous Optimization | §7.1–§7.5 | vazio |
| `mml/09-linear-regression.md` | Cap. 9 — Linear Regression | §9.1–§9.3 | vazio |
| `mml/10-classification.md` | Cap. 12 — Classification (SVM) | §12.1–§12.5 | vazio — ver pendência 1 |
| `mml/12-gaussian-mixture.md` | Cap. 11 — Density Estimation with GMM | §11.1–§11.5 | vazio — ver pendência 1 |

### `nndl/` — Neural Networks and Deep Learning

| Arquivo | Capítulo | Seções | Status |
| :--- | :--- | :--- | :--- |
| `nndl/01-recognition.md` | Cap. 1 — Using neural nets to recognize handwritten digits | §1.1–§1.7 | vazio |
| `nndl/02-backprop.md` | Cap. 2 — How the backpropagation algorithm works | Cap. 2 | vazio |
| `nndl/03-techniques.md` | Cap. 3 — Improving the way neural networks learn | Cap. 3 | vazio |
| `nndl/04-visual-proof.md` | Cap. 4 — A visual proof that neural nets can compute any function | Cap. 4 | vazio |

---

## Pendências antes de gerar conteúdo

1. **Numeração dos capítulos MML de ML (arquivos `10-` e `12-`).** A estrutura pedida seguiu
   a numeração de `methodology.md` (cap. 10 = classificação, cap. 12 = GMM), mas o dump
   detalhado `MML_cursos_1_2_4.md` — alinhado ao sumário real do livro — usa
   **Cap. 10 = Dimensionality Reduction with PCA**, **Cap. 11 = Density Estimation with GMM**
   (§11.5 traz K-means como caso limite) e **Cap. 12 = Classification** (§12.1–§12.5, SVM).
   Ou seja, o número do arquivo e o número do capítulo estão trocados. Duas saídas:
   renomear para `11-gaussian-mixture.md` + `12-classification.md` (mantém o número do livro),
   ou manter os nomes e tratar o número como índice interno do curso (documentar aqui).
2. **Capítulos sem arquivo de destino:** Cap. 6 (*Probability and Distributions*), Cap. 8
   (*When Models Meet Data*) e Cap. 10 (*Dimensionality Reduction with PCA*). Os três aparecem
   no plano de `methodology.md` (probabilidade no Curso 1, Bayes/risco empírico no Curso 2,
   PCA no Curso 4) e existem no dump, mas não têm arquivo nesta estrutura.
3. **PCA sem destino** é consequência da pendência 1: se `10-classification.md` virar
   classificação, o conteúdo de PCA (Cap. 10) fica órfão — provavelmente merece um
   `10-dimensionality-reduction.md` próprio, já que o Curso 4 depende dele.

## Regras desta pasta

- Um arquivo por capítulo; o nome nunca muda depois de gerado (lições referenciam o caminho).
- Cada arquivo é um dump de referência, não a lição final: a lição é escrita a partir dele.
- Ao regenerar ou trocar o dump, atualize a tabela de hashes e a versão acima.
