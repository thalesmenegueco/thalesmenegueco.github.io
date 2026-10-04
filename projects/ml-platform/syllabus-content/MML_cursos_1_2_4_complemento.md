# MML — extração complementar (dump-03)

Saída do NotebookLM numa **segunda rodada de extração**, dirigida a três problemas que a
extração de [`MML_cursos_1_2_4.md`](./MML_cursos_1_2_4.md) deixou em aberto:

1. **uma seção que faltava** — a §5.1 (*Differentiation of Univariate Functions*) e a §5.5
   (*Useful Identities for Computing Gradients*), que o plano do Curso 1 pede mas o dump nunca
   trouxe;
2. **âncoras inventadas** — os IDs `mml-7.4`, `mml-7.5`, `mml-2.7.1`, `mml-9.3`–`mml-9.6` foram
   atribuídos na extração sem que a seção existisse no livro (ou nomeando outro assunto);
3. **uma seção sem endereço** — a §6.7 dividia heading com a §6.4.6, e o Capítulo 1 não tinha
   arquivo de destino.

Os prompts desta rodada estão em [`../content-source/PIPELINE.md`](../content-source/PIPELINE.md)
(§ *Prompts de extração — Camada 1*). O que originou a estrutura do Curso 1 continua sendo
`MML_cursos_1_2_4.md`; este arquivo é o material de origem **das seções completadas e
reancoradas**.

| Campo | Valor |
| :--- | :--- |
| Data da extração | **2026-10-04** |
| Arquivo do livro | `mml-book.pdf`, **Draft (2024-01-15)**, 12 capítulos |
| Idioma da saída | pt-BR (títulos das seções no original, em inglês) |

---

## Prompt 0 — sumário do arquivo (verificação de âncora)

Abaixo está o sumário do livro **Mathematics for Machine Learning** (Deisenroth, Faisal & Ong) extraído do arquivo `mml-book.pdf`.

*Nota:* No sumário oficial do arquivo (`Contents`), os títulos estão listados até o nível de seções (ex.: 5.1, 7.3, 9.2). As subseções de três dígitos (ex.: 5.1.1, 7.3.1, 9.2.3) existem ao longo dos capítulos no corpo do texto, mas **não estão presentes no sumário do arquivo**.

---

### Sumário

**Part I — Mathematical Foundations**
**1 — Introduction and Motivation**
1.1 — Finding Words for Intuitions
1.2 — Two Ways to Read This Book
1.3 — Exercises and Feedback
*(Subseções de 3 dígitos como 1.1.1: não encontrado no sumário do arquivo)*

**2 — Linear Algebra**
2.1 — Systems of Linear Equations
2.2 — Matrices
2.3 — Solving Systems of Linear Equations
2.4 — Vector Spaces
2.5 — Linear Independence
2.6 — Basis and Rank
2.7 — Linear Mappings
2.8 — Affine Spaces
2.9 — Further Reading
*(Subseções de 3 dígitos como 2.3.1: não encontrado no sumário do arquivo)*

**3 — Analytic Geometry**
3.1 — Norms
3.2 — Inner Products
3.3 — Lengths and Distances
3.4 — Angles and Orthogonality
3.5 — Orthonormal Basis
3.6 — Orthogonal Complement
3.7 — Inner Product of Functions
3.8 — Orthogonal Projections
3.9 — Rotations
3.10 — Further Reading
*(Subseções de 3 dígitos como 3.8.1: não encontrado no sumário do arquivo)*

**4 — Matrix Decompositions**
4.1 — Determinant and Trace
4.2 — Eigenvalues and Eigenvectors
4.3 — Cholesky Decomposition
4.4 — Eigendecomposition and Diagonalization
4.5 — Singular Value Decomposition
4.6 — Matrix Approximation
4.7 — Matrix Phylogeny
4.8 — Further Reading
*(Subseções de 3 dígitos como 4.5.1: não encontrado no sumário do arquivo)*

**5 — Vector Calculus**
5.1 — Differentiation of Univariate Functions
5.2 — Partial Differentiation and Gradients
5.3 — Gradients of Vector-Valued Functions
5.4 — Gradients of Matrices
5.5 — Useful Identities for Computing Gradients
5.6 — Backpropagation and Automatic Differentiation
5.7 — Higher-Order Derivatives
5.8 — Linearization and Multivariate Taylor Series
5.9 — Further Reading
*(Subseções de 3 dígitos como 5.1.1, 5.1.2: não encontrado no sumário do arquivo)*

**6 — Probability and Distributions**
6.1 — Construction of a Probability Space
6.2 — Discrete and Continuous Probabilities
6.3 — Sum Rule, Product Rule, and Bayes’ Theorem
6.4 — Summary Statistics and Independence
6.5 — Gaussian Distribution
6.6 — Conjugacy and the Exponential Family
6.7 — Change of Variables/Inverse Transform
6.8 — Further Reading
*(Subseções de 3 dígitos como 6.1.1, 6.4.1: não encontrado no sumário do arquivo)*

**7 — Continuous Optimization**
7.1 — Optimization Using Gradient Descent
7.2 — Constrained Optimization and Lagrange Multipliers
7.3 — Convex Optimization
7.4 — Further Reading
*(Subseções de 3 dígitos como 7.3.1: não encontrado no sumário do arquivo)*

**Part II — Central Machine Learning Problems**
**8 — When Models Meet Data**
8.1 — Data, Models, and Learning
8.2 — Empirical Risk Minimization
8.3 — Parameter Estimation
8.4 — Probabilistic Modeling and Inference
8.5 — Directed Graphical Models
8.6 — Model Selection
*(Subseções de 3 dígitos como 8.2.1: não encontrado no sumário do arquivo)*

**9 — Linear Regression**
9.1 — Problem Formulation
9.2 — Parameter Estimation
9.3 — Bayesian Linear Regression
9.4 — Maximum Likelihood as Orthogonal Projection
9.5 — Further Reading
*(Subseções de 3 dígitos como 9.2.1, 9.2.3: não encontrado no sumário do arquivo)*

**10 — Dimensionality Reduction with Principal Component Analysis**
10.1 — Problem Setting
10.2 — Maximum Variance Perspective
10.3 — Projection Perspective
10.4 — Eigenvector Computation and Low-Rank Approximations
10.5 — PCA in High Dimensions
10.6 — Key Steps of PCA in Practice
10.7 — Latent Variable Perspective
10.8 — Further Reading
*(Subseções de 3 dígitos como 10.2.1, 10.3.1: não encontrado no sumário do arquivo)*

**11 — Density Estimation with Gaussian Mixture Models**
11.1 — Gaussian Mixture Model
11.2 — Parameter Learning via Maximum Likelihood
11.3 — EM Algorithm
11.4 — Latent-Variable Perspective
11.5 — Further Reading
*(Subseções de 3 dígitos como 11.2.1: não encontrado no sumário do arquivo)*

**12 — Classification with Support Vector Machines**
12.1 — Separating Hyperplanes
12.2 — Primal Support Vector Machine
12.3 — Dual Support Vector Machine
12.4 — Kernels
12.5 — Numerical Solution
12.6 — Further Reading
*(Subseções de 3 dígitos como 12.2.1: não encontrado no sumário do arquivo)*

---

### Informações sobre o arquivo
- **Edição/Versão do arquivo:** Draft (2024-01-15)
- **Quantidade de capítulos:** 12 capítulos (divididos em Part I e Part II)

---

## Prompt 1 — §5.1 Differentiation of Univariate Functions

**5.1 Differentiation of Univariate Functions**

---

### (a) Definições Formais e Notação Exata

* **Quociente de Diferenças (Difference Quotient)** [MML §5.1]:
  Para uma função univariada \\(y = f(x)\\), com \\(x, y \in \mathbb{R}\\), o quociente de diferenças calcula a inclinação da reta secante que passa por dois pontos no gráfico de \\(f\\):
  \\[
  \frac{\delta y}{\delta x} := \frac{f(x + \delta x) - f(x)}{\delta x}
  \\]
* **Derivada (Derivative)** [MML §5.1]:
  Para \\(h > 0\\), a derivada de uma função univariada \\(f\\) em \\(x\\) é definida formalmente como o limite do quociente de diferenças quando \\(h \to 0\\):
  \\[
  \frac{\mathrm{d}f}{\mathrm{d}x} := \lim_{h \to 0} \frac{f(x + h) - f(x)}{h}
  \\]
  A derivada aponta na direção de crescimento mais íngreme (steepest ascent) de \\(f\\).
* **Polinômio de Taylor (Taylor Polynomial)** [MML §5.1.1]:
  O polinômio de Taylor de grau \\(n\\) de uma função \\(f: \mathbb{R} \to \mathbb{R}\\) avaliado no ponto \\(x_0\\) é definido por:
  \\[
  T_n(x) := \sum_{k=0}^n \frac{f^{(k)}(x_0)}{k!} (x - x_0)^k
  \\]
  em que \\(f^{(k)}(x_0)\\) representa a \\(k\\)-ésima derivada de \\(f\\) em \\(x_0\\) e \\(\frac{f^{(k)}(x_0)}{k!}\\) são os coeficientes do polinômio (com a convenção \\(t^0 := 1\\) para todo \\(t \in \mathbb{R}\\)).
* **Série de Taylor (Taylor Series)** [MML §5.1.1]:
  Para uma função suave (smooth function) \\(f \in \mathcal{C}^\infty\\), \\(f: \mathbb{R} \to \mathbb{R}\\), a série de Taylor em \\(x_0\\) é dada por:
  \\[
  T_\infty(x) = \sum_{k=0}^\infty \frac{f^{(k)}(x_0)}{k!} (x - x_0)^k
  \\]
  Para o caso particular de \\(x_0 = 0\\), a série é denominada série de Maclaurin (Maclaurin series). Se \\(f(x) = T_\infty(x)\\), a função é chamada de analítica (analytic).
* **Composição de Funções (Function Composition)** [MML §5.1.2]:
  A notação \\(g \circ f\\) indica a composição de funções \\(x \mapsto f(x) \mapsto g(f(x))\\).

---

### (b) Intuição Geométrica

* **Secante e Tangente** [MML §5.1]:
  O quociente de diferenças \\(\frac{\delta y}{\delta x}\\) representa a inclinação média da função entre os pontos \\(x_0\\) e \\(x_0 + \delta x\\), correspondendo geometricamente à inclinação de uma reta secante (secant line). Ao tomar o limite \\(\delta x \to 0\\) (ou \\(h \to 0\\)), a reta secante se transforma na reta tangente (tangent) ao gráfico da função no ponto \\(x\\), cuja inclinação é exatamente a derivada \\(\frac{\mathrm{d}f}{\mathrm{d}x}\\).
* **Aproximação Local por Polinômios de Taylor** [MML §5.1.1]:
  Um polinômio de Taylor de grau \\(n\\) constrói uma aproximação polinomial da função \\(f\\) em uma vizinhança (neighborhood) ao redor de \\(x_0\\). Polinômios de ordem superior (como \\(T_1, T_5, T_{10}\\)) fornecem aproximações progressivamente mais precisas e de alcance mais global em relação ao ponto de expansão.

---

### (c) Exemplo Numérico Pequeno em 2D

A Seção 5.1 apresenta dois exemplos numéricos explícitos e verificáveis à mão:

1. **Aproximação por Polinômio de Taylor** [MML §5.1.1] (Exemplo 5.3):
   Considere o polinômio \\(f(x) = x^4\\) e o ponto de expansão \\(x_0 = 1\\). Calculando as derivadas em \\(x_0 = 1\\):
   * \\(f(1) = 1\\)
   * \\(f'(1) = 4(1)^3 = 4\\)
   * \\(f''(1) = 12(1)^2 = 12\\)
   * \\(f^{(3)}(1) = 24(1) = 24\\)
   * \\(f^{(4)}(1) = 24\\)
   * \\(f^{(5)}(1) = 0\\) e \\(f^{(6)}(1) = 0\\)

   O polinômio de Taylor \\(T_6(x)\\) é construído como:
   \\[
   T_6(x) = 1 + 4(x - 1) + \frac{12}{2!}(x - 1)^2 + \frac{24}{3!}(x - 1)^3 + \frac{24}{4!}(x - 1)^4 + 0
   \\]
   \\[
   T_6(x) = 1 + 4(x - 1) + 6(x - 1)^2 + 4(x - 1)^3 + 1(x - 1)^4
   \\]
   Ao expandir e agrupar os termos, obtém-se exatamente \\(T_6(x) = x^4 = f(x)\\), mostrando que a representação é exata para polinômios de grau menor ou igual a \\(n\\).

2. **Aplicação da Regra da Cadeia** [MML §5.1.2] (Exemplo 5.5):
   Para derivar \\(h(x) = (2x + 1)^4\\), define-se a composição \\(h(x) = g(f(x))\\) com \\(f(x) = 2x + 1\\) e \\(g(f) = f^4\\).
   * Derivadas individuais: \\(f'(x) = 2\\) e \\(g'(f) = 4f^3\\).
   * Pela regra da cadeia: \\(h'(x) = g'(f) f'(x) = 4(2x + 1)^3 \cdot 2 = 8(2x + 1)^3\\).
   * Avaliação numérica no ponto \\(x = 0\\): \\(f(0) = 1\\), \\(g'(1) = 4(1)^3 = 4\\), resultando em \\(h'(0) = 4 \cdot 2 = 8\\).

---

### (d) Como o Conceito Aparece nos Outros Modelos (Regressor Linear, Classificador, Rede Neural, Clusterizador)

Não há [MML §5.1]. A Seção 5.1 (com suas subseções 5.1.1 e 5.1.2) é estritamente dedicada à revisão do cálculo escalar univariado do ensino médio e não menciona nem aplica diretamente esses modelos específicos de aprendizado de máquina nesse trecho do texto.

---

### (e) Fórmulas Relevantes

* **Quociente de Diferenças** [MML §5.1]:
  \\[
  \frac{\delta y}{\delta x} := \frac{f(x + \delta x) - f(x)}{\delta x}
  \\]
* **Definição de Derivada** [MML §5.1]:
  \\[
  \frac{\mathrm{d}f}{\mathrm{d}x} := \lim_{h \to 0} \frac{f(x + h) - f(x)}{h}
  \\]
* **Polinômio de Taylor de Grau \\(n\\)** [MML §5.1.1]:
  \\[
  T_n(x) := \sum_{k=0}^n \frac{f^{(k)}(x_0)}{k!} (x - x_0)^k
  \\]
* **Série de Taylor** [MML §5.1.1]:
  \\[
  T_\infty(x) = \sum_{k=0}^\infty \frac{f^{(k)}(x_0)}{k!} (x - x_0)^k
  \\]
* **Séries de Potência de \\(\cos(x)\\) e \\(\sin(x)\\)** [MML §5.1.1]:
  \\[
  \cos(x) = \sum_{k=0}^\infty (-1)^k \frac{1}{(2k)!} x^{2k}
  \\]
  \\[
  \sin(x) = \sum_{k=0}^\infty (-1)^k \frac{1}{(2k + 1)!} x^{2k+1}
  \\]
* **Regra do Produto (Product Rule)** [MML §5.1.2]:
  \\[
  (f(x)g(x))' = f'(x)g(x) + f(x)g'(x)
  \\]
* **Regra do Quociente (Quotient Rule)** [MML §5.1.2]:
  \\[
  \left(\frac{f(x)}{g(x)}\right)' = \frac{f'(x)g(x) - f(x)g'(x)}{(g(x))^2}
  \\]
* **Regra da Soma (Sum Rule)** [MML §5.1.2]:
  \\[
  (f(x) + g(x))' = f'(x) + g'(x)
  \\]
* **Regra da Cadeia (Chain Rule)** [MML §5.1.2]:
  \\[
  (g(f(x)))' = (g \circ f)'(x) = g'(f(x))f'(x)
  \\]

---

## Prompt 2 — §5.5 Useful Identities for Computing Gradients

**5.5 Useful Identities for Computing Gradients**

---

### (a) Definições Formais e Notação Exata

* **Operadores e Funções Matriciais** [MML §5.5]:
  * \\(\mathrm{tr}(\cdot)\\): Traço de uma matriz (trace), definido como a soma dos elementos de sua diagonal principal (Definição 4.4) [MML §5.5].
  * \\(\det(\cdot)\\): Determinante de uma matriz quadrada (determinant, Seção 4.1) [MML §5.5].
  * \\(f(\mathbf{X})^{-1}\\): Inversa de uma função matricial \\(f(\mathbf{X})\\) (inverse), assumindo que a matriz seja invertível [MML §5.5].
* **Convenção de Notação e Layout** [MML §5.3, §5.5]:
  * Vetores são representados em negrito minúsculo (ex.: \\(\mathbf{x}, \mathbf{a}, \mathbf{b}, \mathbf{s} \in \mathbb{R}^D\\)) e matrizes em negrito maiúsculo (ex.: \\(\mathbf{X}, \mathbf{W}, \mathbf{B}, \mathbf{A}\\)) [MML §5.5].
  * Utiliza-se o layout de numerador (numerator layout) para a ordenação das dimensões dos gradientes [MML §5.3].
  * \\(\mathbf{X}^\top\\) indica a transposta da matriz \\(\mathbf{X}\\) [MML §5.5].
* **Generalização para Tensores e Contração** [MML §5.5 (Remark)]:
  * Quando as derivadas parciais envolvem funções multivariadas em relação a matrizes, os resultados intermediários podem ser tensores de ordem superior (multidimensional arrays) [MML §5.5].
  * Para um tensor de dimensão \\(D \times D \times E \times F\\), o traço generaliza-se para uma matriz de dimensão \\(E \times F\\), sendo um caso especial de contração de tensores (tensor contraction) [MML §5.5].
  * A "transposição" de um tensor refere-se à troca/permutação de suas duas primeiras dimensões (swapping the first two dimensions) [MML §5.5].

---

### (b) Intuição Geométrica

* **Atalhos Algébricos Diretos** [MML §5.5]:
  As identidades da Seção 5.5 funcionam como regras de derivação direta para expressões matriciais e vetoriais de uso frequente em aprendizado de máquina, evitando a necessidade de expandir e calcular derivadas parciais escalares componente a componente [MML §5.5].
* **Ajuste Dimensional e Métrica** [MML §5.5]:
  Em termos geométricos, identidades como \\(\frac{\partial}{\partial \mathbf{s}} (\mathbf{x} - \mathbf{A}\mathbf{s})^\top \mathbf{W} (\mathbf{x} - \mathbf{A}\mathbf{s}) = -2(\mathbf{x} - \mathbf{A}\mathbf{s})^\top \mathbf{W}\mathbf{A}\\) fornecem o vetor de taxa de variação de uma distância quadrática ponderada pela matriz de precisão/ponderação simétrica \\(\mathbf{W}\\), orientando a direção de ajuste geométrico no espaço vetorial [MML §5.5, §7.1].

---

### (c) Exemplo Numérico Pequeno em 2D

*não encontrado no arquivo na Seção 5.5* [MML §5.5] (a Seção 5.5 é constituída estritamente por uma tabela contendo as 10 identidades algébricas e um *Remark* explicativo sobre tensores, sem apresentar exemplos numéricos calculados no texto desta seção).

---

### (d) Como o Conceito Aparece nos Outros Modelos (Regressor Linear, Classificador, Rede Neural, Clusterizador)

* **Regressor Linear (Linear Regression — Capítulo 9)** [MML §5.3, §5.5, §9.2]:
  A identidade (5.108) \\(\frac{\partial}{\partial \mathbf{s}} (\mathbf{x} - \mathbf{A}\mathbf{s})^\top \mathbf{W} (\mathbf{x} - \mathbf{A}\mathbf{s}) = -2(\mathbf{x} - \mathbf{A}\mathbf{s})^\top \mathbf{W}\mathbf{A}\\) (para \\(\mathbf{W}\\) simétrica) e a identidade (5.107) para formas quadráticas são diretamente aplicadas para derivar o gradiente da função de perda de mínimos quadrados (least-squares loss) \\(L(\boldsymbol{\theta}) = \frac{1}{2\sigma^2}(\mathbf{y} - \mathbf{\Phi}\boldsymbol{\theta})^\top(\mathbf{y} - \mathbf{\Phi}\boldsymbol{\theta})\\) em relação aos parâmetros \\(\boldsymbol{\theta}\\), resultando na equação normal do modelo [MML §5.3 (Exemplo 5.11), §9.2.1 (Eq. 9.11a-b)].
* **Clusterizador / Mistura de Gaussianas (Density Estimation with GMMs — Capítulo 11)** [MML §5.5, §11.2.3]:
  As identidades (5.101) \\(\frac{\partial}{\partial \mathbf{X}} \det(f(\mathbf{X})) = \det(f(\mathbf{X}))\mathrm{tr}\left(f(\mathbf{X})^{-1}\frac{\partial f(\mathbf{X})}{\partial \mathbf{X}}\right)\\) e (5.103) \\(\frac{\partial \mathbf{a}^\top \mathbf{X}^{-1} \mathbf{b}}{\partial \mathbf{X}} = -(\mathbf{X}^{-1})^\top \mathbf{a}\mathbf{b}^\top (\mathbf{X}^{-1})^\top\\) são **explicitamente citadas e aplicadas** nas Equações (11.33) e (11.34) para diferenciar o determinante e a forma quadrática inversa da distribuição Gaussiana ao derivar o passo M de atualização das matrizes de covariância \\(\mathbf{\Sigma}_k\\) no algoritmo EM [MML §11.2.3 (Eq. 11.33, 11.34)].
* **Rede Neural (Deep Networks / Backpropagation — Seção 5.6)** [MML §5.5, §5.6.1]:
  As identidades de produtos matriciais e vetoriais (como 5.104–5.106) são utilizadas nas etapas de diferenciação automática para derivar as perdas em relação aos pesos \\(\mathbf{A}_j\\) e vieses \\(\mathbf{b}_j\\) em cada camada durante o backward pass [MML §5.6.1].
* **Classificador / Máquinas de Vetores de Suporte (SVM — Capítulo 12)** [MML §12.3] e **Redução de Dimensionalidade (PCA — Capítulo 10)** [MML §10.3.1]:
  A identidade da forma quadrática (5.107) \\(\frac{\partial \mathbf{x}^\top \mathbf{B} \mathbf{x}}{\partial \mathbf{x}} = \mathbf{x}^\top (\mathbf{B} + \mathbf{B}^\top)\\) reaparece na otimização da variância/reconstrução do PCA \\(\text{tr}(\mathbf{b}_j^\top \mathbf{S} \mathbf{b}_j)\\) [MML §10.3.1 (Eq. 10.43b)] e na diferenciação do Lagrangiano do SVM para obter o vetor de pesos ótimo \\(\mathbf{w} = \sum_{n=1}^N \alpha_n y_n \mathbf{x}_n\\) [MML §12.3 (Eq. 12.35, 12.38)].

---

### (e) Fórmulas Relevantes

Tabela de identidades para cálculo de gradientes [MML §5.5 (Eq. 5.99–5.108)]:

* **Transposta de função matricial** [MML Eq. 5.99]:
  \\[
  \frac{\partial}{\partial \mathbf{X}} f(\mathbf{X})^\top = \left(\frac{\partial f(\mathbf{X})}{\partial \mathbf{X}}\right)^\top
  \\]
* **Traço de função matricial** [MML Eq. 5.100]:
  \\[
  \frac{\partial}{\partial \mathbf{X}} \mathrm{tr}(f(\mathbf{X})) = \mathrm{tr}\left(\frac{\partial f(\mathbf{X})}{\partial \mathbf{X}}\right)
  \\]
* **Determinante de função matricial** [MML Eq. 5.101]:
  \\[
  \frac{\partial}{\partial \mathbf{X}} \det(f(\mathbf{X})) = \det(f(\mathbf{X})) \mathrm{tr}\left(f(\mathbf{X})^{-1} \frac{\partial f(\mathbf{X})}{\partial \mathbf{X}}\right)
  \\]
* **Inversa de função matricial** [MML Eq. 5.102]:
  \\[
  \frac{\partial}{\partial \mathbf{X}} f(\mathbf{X})^{-1} = -f(\mathbf{X})^{-1} \frac{\partial f(\mathbf{X})}{\partial \mathbf{X}} f(\mathbf{X})^{-1}
  \\]
* **Forma quadrática com inversa** [MML Eq. 5.103]:
  \\[
  \frac{\partial \mathbf{a}^\top \mathbf{X}^{-1} \mathbf{b}}{\partial \mathbf{X}} = -(\mathbf{X}^{-1})^\top \mathbf{a} \mathbf{b}^\top (\mathbf{X}^{-1})^\top
  \\]
* **Produto escalar linear (vetor à direita)** [MML Eq. 5.104]:
  \\[
  \frac{\partial \mathbf{x}^\top \mathbf{a}}{\partial \mathbf{x}} = \mathbf{a}^\top
  \\]
* **Produto escalar linear (vetor à esquerda)** [MML Eq. 5.105]:
  \\[
  \frac{\partial \mathbf{a}^\top \mathbf{x}}{\partial \mathbf{x}} = \mathbf{a}^\top
  \\]
* **Forma bilinear com matriz** [MML Eq. 5.106]:
  \\[
  \frac{\partial \mathbf{a}^\top \mathbf{X} \mathbf{b}}{\partial \mathbf{X}} = \mathbf{a} \mathbf{b}^\top
  \\]
* **Forma quadrática com matriz** [MML Eq. 5.107]:
  \\[
  \frac{\partial \mathbf{x}^\top \mathbf{B} \mathbf{x}}{\partial \mathbf{x}} = \mathbf{x}^\top (\mathbf{B} + \mathbf{B}^\top)
  \\]
* **Forma quadrática de erro ponderado** [MML Eq. 5.108]:
  \\[
  \frac{\partial}{\partial \mathbf{s}} (\mathbf{x} - \mathbf{A}\mathbf{s})^\top \mathbf{W} (\mathbf{x} - \mathbf{A}\mathbf{s}) = -2(\mathbf{x} - \mathbf{A}\mathbf{s})^\top \mathbf{W}\mathbf{A} \quad \text{(para } \mathbf{W} \text{ simétrica)}
  \\]

---

### Lista das Identidades (LaTeX Puro)

\\[ \frac{\partial}{\partial \mathbf{X}} f(\mathbf{X})^\top = \left(\frac{\partial f(\mathbf{X})}{\partial \mathbf{X}}\right)^\top \\]
\\[ \frac{\partial}{\partial \mathbf{X}} \mathrm{tr}(f(\mathbf{X})) = \mathrm{tr}\left(\frac{\partial f(\mathbf{X})}{\partial \mathbf{X}}\right) \\]
\\[ \frac{\partial}{\partial \mathbf{X}} \det(f(\mathbf{X})) = \det(f(\mathbf{X}))\mathrm{tr}\left(f(\mathbf{X})^{-1}\frac{\partial f(\mathbf{X})}{\partial \mathbf{X}}\right) \\]
\\[ \frac{\partial}{\partial \mathbf{X}} f(\mathbf{X})^{-1} = -f(\mathbf{X})^{-1}\frac{\partial f(\mathbf{X})}{\partial \mathbf{X}}f(\mathbf{X})^{-1} \\]
\\[ \frac{\partial \mathbf{a}^\top \mathbf{X}^{-1}\mathbf{b}}{\partial \mathbf{X}} = -(\mathbf{X}^{-1})^\top \mathbf{a}\mathbf{b}^\top (\mathbf{X}^{-1})^\top \\]
\\[ \frac{\partial \mathbf{x}^\top \mathbf{a}}{\partial \mathbf{x}} = \mathbf{a}^\top \\]
\\[ \frac{\partial \mathbf{a}^\top \mathbf{x}}{\partial \mathbf{x}} = \mathbf{a}^\top \\]
\\[ \frac{\partial \mathbf{a}^\top \mathbf{X}\mathbf{b}}{\partial \mathbf{X}} = \mathbf{a}\mathbf{b}^\top \\]
\\[ \frac{\partial \mathbf{x}^\top \mathbf{B}\mathbf{x}}{\partial \mathbf{x}} = \mathbf{x}^\top (\mathbf{B} + \mathbf{B}^\top) \\]
\\[ \frac{\partial}{\partial \mathbf{s}} (\mathbf{x}-\mathbf{A}\mathbf{s})^\top \mathbf{W}(\mathbf{x}-\mathbf{A}\mathbf{s}) = -2(\mathbf{x}-\mathbf{A}\mathbf{s})^\top \mathbf{W}\mathbf{A} \\]

---

## Prompt 3 — Capítulo 9 reancorado (§9.1–§9.4)

9.1 Problem Formulation
9.2 Parameter Estimation
9.2.1 Maximum Likelihood Estimation
9.2.2 Overfitting in Linear Regression
9.2.3 Maximum A Posteriori Estimation
9.2.4 MAP Estimation as Regularization
9.3 Bayesian Linear Regression
9.4 Maximum Likelihood as Orthogonal Projection

---

### §9.1 Problem Formulation

#### (a) Definições Formais e Notação Exata
* **Modelo Probabilístico de Regressão com Ruído Gaussiano (Gaussian Measurement Noise)** [MML §9.1]:
  Considera-se o modelo de regressão com a função de verossimilhança:
  \\[
  p(y \mid \mathbf{x}) = \mathcal{N}(y \mid f(\mathbf{x}), \sigma^2)
  \\]
  em que \\(\mathbf{x} \in \mathbb{R}^D\\) são as entradas e \\(y \in \mathbb{R}\\) são as observações ruidosas (targets).
* **Relação Funcional com Ruído Aditivo** [MML §9.1]:
  \\[
  y = f(\mathbf{x}) + \epsilon
  \\]
  em que \\(\epsilon \sim \mathcal{N}(0, \sigma^2)\\) é o ruído de medição independente e identicamente distribuído (i.i.d.) com média 0 e variância \\(\sigma^2\\).
* **Regressão Linear Paramétrica (Linear Regression)** [MML §9.1]:
  Aplica-se a modelos paramétricos em que os parâmetros \\(\boldsymbol{\theta} \in \mathbb{R}^D\\) aparecem linearmente. O caso em que a relação é linear tanto nos parâmetros quanto nas entradas é:
  \\[
  p(y \mid \mathbf{x}, \boldsymbol{\theta}) = \mathcal{N}(y \mid \mathbf{x}^\top\boldsymbol{\theta}, \sigma^2) \iff y = \mathbf{x}^\top\boldsymbol{\theta} + \epsilon, \quad \epsilon \sim \mathcal{N}(0, \sigma^2)
  \\]
* **Verossimilhança (Likelihood)** [MML §9.1]:
  A verossimilhança \\(p(y \mid \mathbf{x}, \boldsymbol{\theta})\\) é a função de densidade de probabilidade de \\(y\\) avaliada em \\(\mathbf{x}^\top\boldsymbol{\theta}\\). Sem o ruído de observação, a relação seria determinística e corresponderia a uma delta de Dirac (Dirac delta).

#### (b) Intuição Geométrica
* **Retas passando pela Origem** [MML §9.1]:
  Para \\(x, \theta \in \mathbb{R}\\), o modelo \\(y = x\theta + \epsilon\\) descreve retas no plano que passam pela origem, em que o parâmetro \\(\theta\\) representa a inclinação (slope) da reta [MML §9.1, Exemplo 9.1].

#### (c) Exemplo Numérico Pequeno em 2D
*não há no arquivo na §9.1* [MML §9.1] (a Seção 9.1 apresenta a formulação teórica do problema e a intuição das retas no Exemplo 9.1 sem disponibilizar cálculos numéricos explícitos à mão nesta seção).

#### (d) Como o Conceito Aparece nos Outros Modelos
*não há no arquivo na §9.1* [MML §9.1].

#### (e) Fórmulas Relevantes
* **Função de Verossimilhança** [MML §9.1, Eq. 9.1]:
  \\[
  p(y \mid \mathbf{x}) = \mathcal{N}(y \mid f(\mathbf{x}), \sigma^2)
  \\]
* **Modelo de Observação com Ruído** [MML §9.1, Eq. 9.2]:
  \\[
  y = f(\mathbf{x}) + \epsilon, \quad \epsilon \sim \mathcal{N}(0, \sigma^2)
  \\]
* **Modelo Linear Paramétrico** [MML §9.1, Eq. 9.3–9.4]:
  \\[
  p(y \mid \mathbf{x}, \boldsymbol{\theta}) = \mathcal{N}(y \mid \mathbf{x}^\top\boldsymbol{\theta}, \sigma^2) \iff y = \mathbf{x}^\top\boldsymbol{\theta} + \epsilon
  \\]

---

### §9.2 Parameter Estimation

#### (a) Definições Formais e Notação Exata
* **Conjunto de Treinamento (Training Set)** [MML §9.2]:
  Definido por \\(\mathcal{D} := \{(\mathbf{x}_1, y_1), \dots, (\mathbf{x}_N, y_N)\}\\) contendo \\(N\\) entradas \\(\mathbf{x}_n \in \mathbb{R}^D\\) e alvos escalares \\(y_n \in \mathbb{R}\\).
* **Fatoração da Verossimilhança (Likelihood Factorization)** [MML §9.2]:
  Pela independência condicional de \\(y_i\\) e \\(y_j\\) dados seus respectivos \\(\mathbf{x}_i, \mathbf{x}_j\\), a verossimilhança sobre todo o conjunto de dados fatora como:
  \\[
  p(\mathbf{Y} \mid \mathbf{X}, \boldsymbol{\theta}) = \prod_{n=1}^N p(y_n \mid \mathbf{x}_n, \boldsymbol{\theta}) = \prod_{n=1}^N \mathcal{N}(y_n \mid \mathbf{x}_n^\top\boldsymbol{\theta}, \sigma^2)
  \\]
  em que \\(\mathbf{X} := \{\mathbf{x}_1, \dots, \mathbf{x}_N\}\\) e \\(\mathbf{Y} := \{y_1, \dots, y_N\}\\).
* **Distribuição Preditiva para Novo Ponto (Predictive Distribution)** [MML §9.2]:
  Em uma entrada arbitrária de teste (test input) \\(\mathbf{x}_*\\), usando a estimativa de parâmetros \\(\boldsymbol{\theta}^*\\):
  \\[
  p(y_* \mid \mathbf{x}_*, \boldsymbol{\theta}^*) = \mathcal{N}(y_* \mid \mathbf{x}_*^\top\boldsymbol{\theta}^*, \sigma^2)
  \\]

#### (b) Intuição Geométrica
*não há no arquivo na §9.2* [MML §9.2] (a interpretação geométrica da estimativa de parâmetros por projeção ortogonal é detalhada na Seção 9.4).

#### (c) Exemplo Numérico Pequeno em 2D
*não há no arquivo na §9.2* [MML §9.2].

#### (d) Como o Conceito Aparece nos Outros Modelos
*não há no arquivo na §9.2* [MML §9.2].

#### (e) Fórmulas Relevantes
* **Fatoração da Verossimilhança** [MML §9.2, Eq. 9.5b]:
  \\[
  p(\mathbf{Y} \mid \mathbf{X}, \boldsymbol{\theta}) = \prod_{n=1}^N \mathcal{N}(y_n \mid \mathbf{x}_n^\top\boldsymbol{\theta}, \sigma^2)
  \\]
* **Distribuição de Predição no Teste** [MML §9.2, Eq. 9.6]:
  \\[
  p(y_* \mid \mathbf{x}_*, \boldsymbol{\theta}^*) = \mathcal{N}(y_* \mid \mathbf{x}_*^\top\boldsymbol{\theta}^*, \sigma^2)
  \\]

---

### §9.2.1 Maximum Likelihood Estimation

#### (a) Definições Formais e Notação Exata
* **Estimador de Máxima Verossimilhança (Maximum Likelihood Estimation - MLE)** [MML §9.2.1]:
  Procura os parâmetros \\(\boldsymbol{\theta}_{\text{ML}}\\) que maximizam a verossimilhança dos dados de treinamento:
  \\[
  \boldsymbol{\theta}_{\text{ML}} \in \arg\max_{\boldsymbol{\theta}} p(\mathbf{Y} \mid \mathbf{X}, \boldsymbol{\theta})
  \\]
* **Função de Log-Verossimilhança Negativa / Função de Erro (Negative Log-Likelihood / Error Function)** [MML §9.2.1]:
  Minimizar o logaritmo negativo da verossimilhança equivale a minimizar a soma dos erros quadráticos:
  \\[
  \mathcal{L}(\boldsymbol{\theta}) := \frac{1}{2\sigma^2} \sum_{n=1}^N (y_n - \mathbf{x}_n^\top\boldsymbol{\theta})^2 = \frac{1}{2\sigma^2}(\mathbf{y} - \mathbf{X}\boldsymbol{\theta})^\top(\mathbf{y} - \mathbf{X}\boldsymbol{\theta}) = \frac{1}{2\sigma^2} \|\mathbf{y} - \mathbf{X}\boldsymbol{\theta}\|^2
  \\]
  em que \\(\mathbf{X} := [\mathbf{x}_1, \dots, \mathbf{x}_N]^\top \in \mathbb{R}^{N \times D}\\) é a matriz de design (design matrix) e \\(\mathbf{y} := [y_1, \dots, y_N]^\top \in \mathbb{R}^N\\) é o vetor de alvos.
* **Solução Analítica Fechada / Equações Normais (Closed-Form Solution / Normal Equations)** [MML §9.2.1]:
  Igualando o gradiente a zero (\\(\frac{\mathrm{d}\mathcal{L}}{\mathrm{d}\boldsymbol{\theta}} = \mathbf{0}^\top\\)):
  \\[
  \boldsymbol{\theta}_{\text{ML}} = (\mathbf{X}^\top\mathbf{X})^{-1}\mathbf{X}^\top\mathbf{y}
  \\]
  assumindo que \\(\mathbf{X}^\top\mathbf{X}\\) é positiva definida (o que ocorre se \\(\text{rk}(\mathbf{X}) = D\\)).
* **MLE com Transformações Não Lineares / Atributos (Features / Polynomial Regression)** [MML §9.2.1]:
  Ao aplicar uma transformação não linear de atributos \\(\boldsymbol{\phi}: \mathbb{R}^D \to \mathbb{R}^K\\), o modelo permanece linear nos parâmetros: \\(y = \boldsymbol{\phi}^\top(\mathbf{x})\boldsymbol{\theta} + \epsilon\\). Definindo a matriz de atributos (feature matrix) \\(\boldsymbol{\Phi} \in \mathbb{R}^{N \times K}\\) com \\(\boldsymbol{\Phi}_{ij} = \phi_j(\mathbf{x}_i)\\), a solução é:
  \\[
  \boldsymbol{\theta}_{\text{ML}} = (\boldsymbol{\Phi}^\top\boldsymbol{\Phi})^{-1}\boldsymbol{\Phi}^\top\mathbf{y}
  \\]
* **Estimador da Variância do Ruído (Noise Variance Estimation)** [MML §9.2.1]:
  Derivando a log-verossimilhança em relação a \\(\sigma^2 > 0\\) e igualando a zero, obtém-se a média empírica das distâncias quadráticas:
  \\[
  \sigma^2_{\text{ML}} = \frac{1}{N} \sum_{n=1}^N (y_n - \boldsymbol{\phi}^\top(\mathbf{x}_n)\boldsymbol{\theta})^2
  \\]

#### (b) Intuição Geométrica
* **Superfície Quadrática e Mínimo Único** [MML §9.2.1]:
  A função de erro \\(\mathcal{L}(\boldsymbol{\theta})\\) é estritamente quadrática em \\(\boldsymbol{\theta}\\), o que garante a existência de um único mínimo global. O termo \\(\|\mathbf{y} - \mathbf{X}\boldsymbol{\theta}\|^2\\) mede a distância quadrática no espaço de dados entre o vetor de observações reais \\(\mathbf{y}\\) e as predições do modelo \\(\mathbf{X}\boldsymbol{\theta}\\).

#### (c) Exemplo Numérico Pequeno em 2D
* **Matriz de Atributos para Polinômio de 2ª Ordem** [MML §9.2.1] (Exemplo 9.4):
  Para um polinômio de segundo grau e \\(N\\) pontos de treinamento \\(x_n \in \mathbb{R}\\), a matriz de atributos \\(\boldsymbol{\Phi}\\) é construída elevando a entrada original a um espaço de atributos \\(3\\)-dimensional:
  \\[
  \boldsymbol{\Phi} = \begin{bmatrix} 1 & x_1 & x_1^2 \\ 1 & x_2 & x_2^2 \\ \vdots & \vdots & \vdots \\ 1 & x_N & x_N^2 \end{bmatrix} \in \mathbb{R}^{N \times 3}
  \\]

#### (d) Como o Conceito Aparece nos Outros Modelos
*não há no arquivo na §9.2.1* [MML §9.2.1].

#### (e) Fórmulas Relevantes
* **Estimador MLE Sem Atributos** [MML §9.2.1, Eq. 9.12c]:
  \\[
  \boldsymbol{\theta}_{\text{ML}} = (\mathbf{X}^\top\mathbf{X})^{-1}\mathbf{X}^\top\mathbf{y}
  \\]
* **Estimador MLE com Atributos Não Lineares** [MML §9.2.1, Eq. 9.19]:
  \\[
  \boldsymbol{\theta}_{\text{ML}} = (\boldsymbol{\Phi}^\top\boldsymbol{\Phi})^{-1}\boldsymbol{\Phi}^\top\mathbf{y}
  \\]
* **Estimador da Variância do Ruído** [MML §9.2.1, Eq. 9.22]:
  \\[
  \sigma^2_{\text{ML}} = \frac{1}{N} \sum_{n=1}^N (y_n - \boldsymbol{\phi}^\top(\mathbf{x}_n)\boldsymbol{\theta})^2
  \\]

---

### §9.2.2 Overfitting in Linear Regression

#### (a) Definições Formais e Notação Exata
* **Erro Quadrático Médio da Raiz (Root Mean Square Error - RMSE)** [MML §9.2.2]:
  Métrica de avaliação normalizada para comparar conjuntos de dados de diferentes tamanhos, preservando a mesma escala e unidade dos alvos \\(y_n\\):
  \\[
  \text{RMSE} = \sqrt{\frac{1}{N}\|\mathbf{y} - \boldsymbol{\Phi}\boldsymbol{\theta}\|^2} = \sqrt{\frac{1}{N} \sum_{n=1}^N (y_n - \boldsymbol{\phi}^\top(\mathbf{x}_n)\boldsymbol{\theta})^2}
  \\]
* **Comportamento do Erro de Treinamento e Teste (Training and Test Error)** [MML §9.2.2]:
  O erro de treinamento (training error) nunca aumenta à medida que o grau do polinômio \\(M\\) cresce. O sobreajuste (overfitting) manifesta-se quando um modelo de alta flexibilidade obtém erro de treinamento próximo de zero, mas apresenta um erro de teste (test error) extremamente alto ao prever dados não vistos.

#### (b) Intuição Geométrica
* **Grau do Polinômio vs. Flexibilidade da Curva** [MML §9.2.2]:
  Polinômios de baixo grau (ex.: \\(M=0\\) constante, \\(M=1\\) reta) resultam em subajuste (underfitting), ajustando mal os dados. Polinômios de grau moderado (ex.: \\(M=3, \dots, 6\\)) interpolam a tendência dos dados de forma suave. Polinômios de grau muito alto (ex.: \\(M=9\\) para \\(N=10\\) pontos) ajustam o próprio ruído das observações, criando oscilações selvagens entre os pontos [MML §9.2.2, Fig. 9.5].

#### (c) Exemplo Numérico Pequeno em 2D
* **Ajuste Polinomial em \\(N = 10\\) Pontos de Dados** [MML §9.2.2] (Figuras 9.4, 9.5, 9.6):
  A partir de \\(N = 10\\) observações geradas por \\(y_n = -\sin(x_n/5) + \cos(x_n) + \epsilon\\) com \\(\epsilon \sim \mathcal{N}(0, 0.22^2)\\), testa-se \\(M = 0\\) até \\(M = 9\\):
  * A melhor capacidade de generalização (menor RMSE em um conjunto de teste independente de 200 pontos) ocorre em \\(M = 4\\).
  * Para \\(M \ge N\\) (isto é, \\(M \ge 10\\)), o número de parâmetros supera o número de dados, a matriz \\(\boldsymbol{\Phi}^\top\boldsymbol{\Phi}\\) torna-se não invertível e o sistema linear torna-se subdeterminado, existindo infinitos estimadores de máxima verossimilhança [MML §9.2.2].

#### (d) Como o Conceito Aparece nos Outros Modelos
*não há no arquivo na §9.2.2* [MML §9.2.2].

#### (e) Fórmulas Relevantes
* **Erro Quadrático Médio da Raiz (RMSE)** [MML §9.2.2, Eq. 9.23]:
  \\[
  \text{RMSE} = \sqrt{\frac{1}{N} \sum_{n=1}^N (y_n - \boldsymbol{\phi}^\top(\mathbf{x}_n)\boldsymbol{\theta})^2}
  \\]

---

### §9.2.3 Maximum A Posteriori Estimation

#### (a) Definições Formais e Notação Exata
* **Estimativa de Máximo A Posteriori (Maximum A Posteriori - MAP Estimation)** [MML §9.2.3]:
  Incorpora um prior \\(p(\boldsymbol{\theta})\\) sobre os parâmetros para reprimir valores plausíveis antes de observar os dados. Pelo Teorema de Bayes:
  \\[
  p(\boldsymbol{\theta} \mid \mathbf{X}, \mathbf{Y}) = \frac{p(\mathbf{Y} \mid \mathbf{X}, \boldsymbol{\theta}) p(\boldsymbol{\theta})}{p(\mathbf{Y} \mid \mathbf{X})}
  \\]
* **Minimização da Log-Posteriori Negativa** [MML §9.2.3]:
  O estimador \\(\boldsymbol{\theta}_{\text{MAP}}\\) minimiza a soma do log-likelihood negativo e do log-prior negativo:
  \\[
  \boldsymbol{\theta}_{\text{MAP}} \in \arg\min_{\boldsymbol{\theta}} \{ -\log p(\mathbf{Y} \mid \mathbf{X}, \boldsymbol{\theta}) - \log p(\boldsymbol{\theta}) \}
  \\]
* **Log-Posteriori Negativa com Prior Gaussiano** [MML §9.2.3]:
  Assumindo um prior Gaussiano isotrópico conjugado \\(p(\boldsymbol{\theta}) = \mathcal{N}(\mathbf{0}, b^2 \mathbf{I})\\):
  \\[
  -\log p(\boldsymbol{\theta} \mid \mathbf{X}, \mathbf{Y}) = \frac{1}{2\sigma^2}(\mathbf{y} - \boldsymbol{\Phi}\boldsymbol{\theta})^\top(\mathbf{y} - \boldsymbol{\Phi}\boldsymbol{\theta}) + \frac{1}{2b^2}\boldsymbol{\theta}^\top\boldsymbol{\theta} + \text{const}
  \\]
* **Solução Fechada da Estimativa MAP** [MML §9.2.3]:
  Igualando o gradiente da log-posteriori negativa a \\(\mathbf{0}^\top\\):
  \\[
  \boldsymbol{\theta}_{\text{MAP}} = \left( \boldsymbol{\Phi}^\top\boldsymbol{\Phi} + \frac{\sigma^2}{b^2} \mathbf{I} \right)^{-1} \boldsymbol{\Phi}^\top \mathbf{y}
  \\]

#### (b) Intuição Geométrica
* **Garantia de Invertibilidade e Controle de Amplitude** [MML §9.2.3]:
  A única diferença em relação à solução MLE é a adição do termo \\(\frac{\sigma^2}{b^2} \mathbf{I}\\) dentro da matriz invertível. Como \\(\boldsymbol{\Phi}^\top\boldsymbol{\Phi}\\) é simétrica e positiva semidefinida, somar \\(\frac{\sigma^2}{b^2} \mathbf{I}\\) torna a matriz estritamente positiva definida, garantindo que a inversa sempre exista e que a solução seja única, além de reprimir os pesos para que não assumam amplitudes gigantescas [MML §9.2.3, Eq. 9.31].

#### (c) Exemplo Numérico Pequeno em 2D
* **Ajuste MAP para Regressão Polinomial** [MML §9.2.3] (Exemplo 9.6):
  Ao adotar o prior \\(p(\boldsymbol{\theta}) = \mathcal{N}(\mathbf{0}, \mathbf{I})\\) (com \\(b^2 = 1\\)) para polinômios de grau 6 e 8 em \\(N = 10\\) pontos, a estimativa MAP (linha laranja na Figura 9.7) impede que a função sofra as oscilações extremas vistas no MLE (linha azul), mantendo a curva ajustada relativamente suave [MML §9.2.3, Fig. 9.7].

#### (d) Como o Conceito Aparece nos Outros Modelos
*não há no arquivo na §9.2.3* [MML §9.2.3].

#### (e) Fórmulas Relevantes
* **Teorema de Bayes para os Parâmetros** [MML §9.2.3, Eq. 9.24]:
  \\[
  p(\boldsymbol{\theta} \mid \mathbf{X}, \mathbf{Y}) = \frac{p(\mathbf{Y} \mid \mathbf{X}, \boldsymbol{\theta}) p(\boldsymbol{\theta})}{p(\mathbf{Y} \mid \mathbf{X})}
  \\]
* **Log-Posteriori Negativa com Prior Gaussiano** [MML §9.2.3, Eq. 9.28]:
  \\[
  -\log p(\boldsymbol{\theta} \mid \mathbf{X}, \mathbf{Y}) = \frac{1}{2\sigma^2}(\mathbf{y} - \boldsymbol{\Phi}\boldsymbol{\theta})^\top(\mathbf{y} - \boldsymbol{\Phi}\boldsymbol{\theta}) + \frac{1}{2b^2}\boldsymbol{\theta}^\top\boldsymbol{\theta} + \text{const}
  \\]
* **Estimador MAP** [MML §9.2.3, Eq. 9.31]:
  \\[
  \boldsymbol{\theta}_{\text{MAP}} = \left( \boldsymbol{\Phi}^\top\boldsymbol{\Phi} + \frac{\sigma^2}{b^2} \mathbf{I} \right)^{-1} \boldsymbol{\Phi}^\top \mathbf{y}
  \\]

---

### §9.2.4 MAP Estimation as Regularization

#### (a) Definições Formais e Notação Exata
* **Mínimos Quadrados Regularizados (Regularized Least Squares)** [MML §9.2.4]:
  Estratégia de minimização da perda agregando um termo de penalização à magnitude dos parâmetros:
  \\[
  \|\mathbf{y} - \boldsymbol{\Phi}\boldsymbol{\theta}\|^2 + \lambda \|\boldsymbol{\theta}\|_2^2
  \\]
  em que o primeiro termo é o termo de ajuste aos dados (data-fit term ou misfit term) e o segundo termo é o regularizador (regularizer), controlado pelo parâmetro de regularização \\(\lambda \ge 0\\).
* **Solução dos Mínimos Quadrados Regularizados** [MML §9.2.4]:
  \\[
  \boldsymbol{\theta}_{\text{RLS}} = (\boldsymbol{\Phi}^\top\boldsymbol{\Phi} + \lambda \mathbf{I})^{-1} \boldsymbol{\Phi}^\top \mathbf{y}
  \\]
  que é **exatamente idêntica** à estimativa MAP \\(\boldsymbol{\theta}_{\text{MAP}}\\), definindo \\(\lambda = \frac{\sigma^2}{b^2}\\).
* **Regularizador LASSO (Least Absolute Shrinkage and Selection Operator)** [MML §9.2.4] (Remark):
  Ao utilizar a norma \\(p = 1\\) (isto é, \\(\|\boldsymbol{\theta}\|_1\\)), a penalização promove soluções esparsas em que muitos componentes \\(\theta_d = 0\\), atuando diretamente na seleção de variáveis (variable selection).

#### (b) Intuição Geométrica
* **Equivalência entre Penalização e Prior** [MML §9.2.4]:
  O termo de penalização \\(\lambda \|\boldsymbol{\theta}\|_2^2\\) corresponde rigorosamente ao log-prior Gaussiano negativo \\(-\log p(\boldsymbol{\theta}) = \frac{1}{2b^2}\|\boldsymbol{\theta}\|_2^2 + \text{const}\\) com \\(\lambda = \frac{1}{2b^2}\\) [MML §9.2.4, Eq. 9.33]. O regularizador impõe uma força contrária que puxa o vetor de parâmetros para a origem.

#### (c) Exemplo Numérico Pequeno em 2D
*não há no arquivo na §9.2.4* [MML §9.2.4] (a seção estabelece a equivalência algébrica analítica entre regularização \\(\lambda\\) e o quociente de variâncias \\(\frac{\sigma^2}{b^2}\\)).

#### (d) Como o Conceito Aparece nos Outros Modelos
*não há no arquivo na §9.2.4* [MML §9.2.4].

#### (e) Fórmulas Relevantes
* **Perda dos Mínimos Quadrados Regularizados** [MML §9.2.4, Eq. 9.32]:
  \\[
  \|\mathbf{y} - \boldsymbol{\Phi}\boldsymbol{\theta}\|^2 + \lambda \|\boldsymbol{\theta}\|_2^2
  \\]
* **Solução RLS** [MML §9.2.4, Eq. 9.34]:
  \\[
  \boldsymbol{\theta}_{\text{RLS}} = (\boldsymbol{\Phi}^\top\boldsymbol{\Phi} + \lambda \mathbf{I})^{-1} \boldsymbol{\Phi}^\top \mathbf{y}
  \\]
* **Relação de Equivalência com MAP** [MML §9.2.4, Eq. 9.34]:
  \\[
  \lambda = \frac{\sigma^2}{b^2}
  \\]

---

### §9.3 Bayesian Linear Regression

#### (a) Definições Formais e Notação Exata
* **Regressão Linear Bayesiana (Bayesian Linear Regression)** [MML §9.3]:
  Abandona a busca por estimativas pontuais (point estimates) de \\(\boldsymbol{\theta}\\). Em vez disso, calcula a distribuição a posteriori completa sobre os parâmetros e faz predições integrando (tomando a média) sobre todos os parâmetros plausíveis.
* **Modelo Probabilístico** [MML §9.3.1]:
  * Prior: \\(p(\boldsymbol{\theta}) = \mathcal{N}(\mathbf{m}_0, \mathbf{S}_0)\\)
  * Verossimilhança: \\(p(y \mid \mathbf{x}, \boldsymbol{\theta}) = \mathcal{N}(y \mid \boldsymbol{\phi}^\top(\mathbf{x})\boldsymbol{\theta}, \sigma^2)\\)
  * Modelo Conjunto: \\(p(y, \boldsymbol{\theta} \mid \mathbf{x}) = p(y \mid \mathbf{x}, \boldsymbol{\theta}) p(\boldsymbol{\theta})\\)
* **Predições pelo Prior (Prior Predictions)** [MML §9.3.2]:
  Integrando os parâmetros sob o prior:
  \\[
  p(y_* \mid \mathbf{x}_*) = \int p(y_* \mid \mathbf{x}_*, \boldsymbol{\theta}) p(\boldsymbol{\theta}) \mathrm{d}\boldsymbol{\theta} = \mathcal{N}(y_* \mid \boldsymbol{\phi}^\top(\mathbf{x}_*)\mathbf{m}_0, \boldsymbol{\phi}^\top(\mathbf{x}_*)\mathbf{S}_0\boldsymbol{\phi}(\mathbf{x}_*) + \sigma^2)
  \\]
* **Distribuição A Posteriori dos Parâmetros (Parameter Posterior)** [MML §9.3.3, Teorema 9.1]:
  Dada por uma Gaussiana \\(p(\boldsymbol{\theta} \mid \mathbf{X}, \mathbf{Y}) = \mathcal{N}(\boldsymbol{\theta} \mid \mathbf{m}_N, \mathbf{S}_N)\\) cujos parâmetros são calculados completando quadrados no log-espaço:
  \\[
  \mathbf{S}_N = (\mathbf{S}_0^{-1} + \sigma^{-2}\boldsymbol{\Phi}^\top\boldsymbol{\Phi})^{-1}
  \\]
  \\[
  \mathbf{m}_N = \mathbf{S}_N(\mathbf{S}_0^{-1}\mathbf{m}_0 + \sigma^{-2}\boldsymbol{\Phi}^\top\mathbf{y})
  \\]
* **Predições A Posteriori (Posterior Predictions)** [MML §9.3.4]:
  \\[
  p(y_* \mid \mathbf{X}, \mathbf{Y}, \mathbf{x}_*) = \int p(y_* \mid \mathbf{x}_*, \boldsymbol{\theta}) p(\boldsymbol{\theta} \mid \mathbf{X}, \mathbf{Y}) \mathrm{d}\boldsymbol{\theta} = \mathcal{N}(y_* \mid \boldsymbol{\phi}^\top(\mathbf{x}_*)\mathbf{m}_N, \boldsymbol{\phi}^\top(\mathbf{x}_*)\mathbf{S}_N\boldsymbol{\phi}(\mathbf{x}_*) + \sigma^2)
  \\]
  Para valores funcionais sem ruído \\(f(\mathbf{x}_*) = \boldsymbol{\phi}^\top(\mathbf{x}_*)\boldsymbol{\theta}\\):
  \\[
  \mathbb{E}[f(\mathbf{x}_*) \mid \mathbf{X}, \mathbf{Y}] = \boldsymbol{\phi}^\top(\mathbf{x}_*)\mathbf{m}_N, \quad \mathbb{V}_{\boldsymbol{\theta}}[f(\mathbf{x}_*) \mid \mathbf{X}, \mathbf{Y}] = \boldsymbol{\phi}^\top(\mathbf{x}_*)\mathbf{S}_N\boldsymbol{\phi}(\mathbf{x}_*)
  \\]
* **Evidência do Modelo / Verossimilhança Marginal (Model Evidence / Marginal Likelihood)** [MML §9.3.5]:
  Integral da verossimilhança ponderada pelo prior sobre todo o espaço de parâmetros:
  \\[
  p(\mathbf{Y} \mid \mathbf{X}) = \int p(\mathbf{Y} \mid \mathbf{X}, \boldsymbol{\theta}) p(\boldsymbol{\theta}) \mathrm{d}\boldsymbol{\theta} = \mathcal{N}(\mathbf{Y} \mid \mathbf{X}\mathbf{m}_0, \mathbf{X}\mathbf{S}_0\mathbf{X}^\top + \sigma^2\mathbf{I})
  \\]

#### (b) Intuição Geométrica
* **Média Preditiva e Faixas de Incerteza (Confidence Bounds)** [MML §9.3.4]:
  A média preditiva \\(\boldsymbol{\phi}^\top(\mathbf{x}_*)\mathbf{m}_N\\) coincide exatamente com a função gerada pela estimativa MAP. No entanto, o modelo Bayesiano fornece barras/faixas de incerteza (shaded confidence bounds de 67% e 95%), onde a variância preditiva cresce drasticamente em regiões sem dados de treinamento, sinalizando a falta de informação [MML §9.3.4, Fig. 9.10, 9.11].

#### (c) Exemplo Numérico Pequeno em 2D
* **Distribuição sobre Funções (Prior/Posterior over Functions)** [MML §9.3.2, §9.3.4] (Exemplos 9.7, 9.8):
  Para polinômios de grau 5 e prior \\(p(\boldsymbol{\theta}) = \mathcal{N}(\mathbf{0}, \frac{1}{4}\mathbf{I})\\), amostragem de funções \\(f_i(\cdot) = \boldsymbol{\phi}^\top(\cdot)\boldsymbol{\theta}_i\\) é realizada sorteando vetores de parâmetros \\(\boldsymbol{\theta}_i \sim p(\boldsymbol{\theta})\\) (prior) ou \\(\boldsymbol{\theta}_i \sim \mathcal{N}(\mathbf{m}_N, \mathbf{S}_N)\\) (posterior) avaliados em 200 pontos no intervalo \\([-5, 5]\\) [MML §9.3.2, §9.3.4].

#### (d) Como o Conceito Aparece nos Outros Modelos
*não há no arquivo na §9.3* [MML §9.3].

#### (e) Fórmulas Relevantes
* **Matriz de Covariância a Posteriori** [MML §9.3.3, Eq. 9.43b]:
  \\[
  \mathbf{S}_N = (\mathbf{S}_0^{-1} + \sigma^{-2}\boldsymbol{\Phi}^\top\boldsymbol{\Phi})^{-1}
  \\]
* **Média a Posteriori** [MML §9.3.3, Eq. 9.43c]:
  \\[
  \mathbf{m}_N = \mathbf{S}_N(\mathbf{S}_0^{-1}\mathbf{m}_0 + \sigma^{-2}\boldsymbol{\Phi}^\top\mathbf{y})
  \\]
* **Distribuição Preditiva a Posteriori** [MML §9.3.4, Eq. 9.57c]:
  \\[
  p(y_* \mid \mathbf{X}, \mathbf{Y}, \mathbf{x}_*) = \mathcal{N}(y_* \mid \boldsymbol{\phi}^\top(\mathbf{x}_*)\mathbf{m}_N, \boldsymbol{\phi}^\top(\mathbf{x}_*)\mathbf{S}_N\boldsymbol{\phi}(\mathbf{x}_*) + \sigma^2)
  \\]
* **Verossimilhança Marginal** [MML §9.3.5, Eq. 9.64b]:
  \\[
  p(\mathbf{Y} \mid \mathbf{X}) = \mathcal{N}(\mathbf{Y} \mid \mathbf{X}\mathbf{m}_0, \mathbf{X}\mathbf{S}_0\mathbf{X}^\top + \sigma^2\mathbf{I})
  \\]

---

### §9.4 Maximum Likelihood as Orthogonal Projection

#### (a) Definições Formais e Notação Exata
* **Reconstrução de Mínimos Quadrados como Projeção Ortogonal** [MML §9.4]:
  No modelo univariado simples \\(y = x\theta + \epsilon\\), o estimador de máxima verossimilhança é \\(\theta_{\text{ML}} = \frac{\mathbf{X}^\top\mathbf{y}}{\mathbf{X}^\top\mathbf{X}}\\), com \\(\mathbf{X} = [x_1, \dots, x_N]^\top \in \mathbb{R}^N\\) e \\(\mathbf{y} = [y_1, \dots, y_N]^\top \in \mathbb{R}^N\\). A reconstrução dos alvos no conjunto de treinamento é:
  \\[
  \mathbf{X}\theta_{\text{ML}} = \mathbf{X}\frac{\mathbf{X}^\top\mathbf{y}}{\mathbf{X}^\top\mathbf{X}} = \frac{\mathbf{X}\mathbf{X}^\top}{\mathbf{X}^\top\mathbf{X}}\mathbf{y}
  \\]
  em que \\(\mathbf{P}_\pi = \frac{\mathbf{X}\mathbf{X}^\top}{\mathbf{X}^\top\mathbf{X}} \in \mathbb{R}^{N \times N}\\) é a matriz de projeção ortogonal (projection matrix) que projeta o vetor de observações \\(\mathbf{y} \in \mathbb{R}^N\\) sobre o subespaço unidimensional gerado por \\(\mathbf{X}\\).
* **Projeção no Caso Geral com Atributos** [MML §9.4]:
  Para atributos \\(\boldsymbol{\phi}(\mathbf{x}) \in \mathbb{R}^K\\), a estimativa \\(\boldsymbol{\theta}_{\text{ML}} = (\boldsymbol{\Phi}^\top\boldsymbol{\Phi})^{-1}\boldsymbol{\Phi}^\top\mathbf{y}\\) projeta ortogonalmente o vetor de alvos \\(\mathbf{y} \in \mathbb{R}^N\\) sobre o subespaço \\(K\\)-dimensional de \\(\mathbb{R}^N\\) gerado pelas colunas da matriz de atributos \\(\boldsymbol{\Phi}\\).
* **Caso Especial com Atributos Ortonormais** [MML §9.4]:
  Se as colunas de \\(\boldsymbol{\Phi}\\) formam uma base ortonormal (ONB), então \\(\boldsymbol{\Phi}^\top\boldsymbol{\Phi} = \mathbf{I}\\), e a projeção simplifica para a soma das projeções individuais sobre cada vetor de base:
  \\[
  \boldsymbol{\Phi}(\boldsymbol{\Phi}^\top\boldsymbol{\Phi})^{-1}\boldsymbol{\Phi}^\top\mathbf{y} = \boldsymbol{\Phi}\boldsymbol{\Phi}^\top\mathbf{y} = \sum_{k=1}^K \boldsymbol{\phi}_k \boldsymbol{\phi}_k^\top \mathbf{y}
  \\]

#### (b) Intuição Geométrica
* **Minimização do Erro Ortogonal** [MML §9.4]:
  A solução de máxima verossimilhança encontra o vetor dentro do subespaço gerado pelas colunas de \\(\boldsymbol{\Phi}\\) que se encontra geometricamente mais próximo do vetor de observações \\(\mathbf{y}\\). Essa menor distância (menor erro quadrático residual) é obtida perpendicularmente através de uma projeção ortogonal [MML §9.4, Fig. 9.12b].

#### (c) Exemplo Numérico Pequeno em 2D
*não há no arquivo na §9.4* [MML §9.4] (a seção ilustra conceitualmente o vetor \\(\mathbf{X} \in \mathbb{R}^N\\) gerando o subespaço unidimensional e a matriz de projeção ortogonal sem trazer um vetor numérico pequeno resolvido à mão na §9.4).

#### (d) Como o Conceito Aparece nos Outros Modelos
* **Projeções Ortogonais (Analytic Geometry — Capítulo 3)** [MML §3.8, §9.4]:
  Conecta-se diretamente à Seção 3.8, compartilhando a mesma estrutura formal de matriz de projeção \\(\mathbf{B}(\mathbf{B}^\top\mathbf{B})^{-1}\mathbf{B}^\top\\).
* **Redução de Dimensionalidade / PCA (Chapter 10)** [MML §9.4, §10.3]:
  Conecta-se à reconstrução via projeção em subespaços de menor dimensão, em que o PCA busca a projeção ortogonal que minimiza o erro médio de reconstrução quadrático.

#### (e) Fórmulas Relevantes
* **Projeção Ortogonal Unidimensional** [MML §9.4, Eq. 9.67]:
  \\[
  \mathbf{X}\theta_{\text{ML}} = \frac{\mathbf{X}\mathbf{X}^\top}{\mathbf{X}^\top\mathbf{X}}\mathbf{y}
  \\]
* **Matriz de Projeção no Subespaço de Atributos** [MML §9.4, Eq. 9.70–9.71]:
  \\[
  \mathbf{P}_\pi = \boldsymbol{\Phi}(\boldsymbol{\Phi}^\top\boldsymbol{\Phi})^{-1}\boldsymbol{\Phi}^\top
  \\]
* **Projeção com Base Ortonormal** [MML §9.4, Eq. 9.71]:
  \\[
  \boldsymbol{\Phi}\boldsymbol{\Phi}^\top\mathbf{y} = \left(\sum_{k=1}^K \boldsymbol{\phi}_k \boldsymbol{\phi}_k^\top\right) \mathbf{y}
  \\]
---

## Prompt 4 — Capítulo 7 reancorado (§7.3.1–§7.3.3)

### §7.3.1 Linear Programming [MML §7.3.1]

**(a) Definição / Conceito Central:**
A programação linear (*linear programming* / *linear program*) é o caso especial de otimização convexa (*convex optimization*) no qual a função objetivo (*objective function*) e todas as restrições (*constraints*) são funções lineares nos parâmetros \\( \boldsymbol{x} \in \mathbb{R}^d \\).

**(b) Problema Primal / Formulação Matemática:**
O problema primal (*primal problem*) de um programa linear com \\( d \\) variáveis e \\( m \\) restrições lineares é formulado como:
\\[ \min_{\boldsymbol{x} \in \mathbb{R}^d} \boldsymbol{c}^\top \boldsymbol{x} \\]
sujeito a (*subject to*)
\\[ \boldsymbol{A}\boldsymbol{x} \leqslant \boldsymbol{b} \\]
onde \\( \boldsymbol{A} \in \mathbb{R}^{m \times d} \\), \\( \boldsymbol{b} \in \mathbb{R}^m \\) e \\( \boldsymbol{c} \in \mathbb{R}^d \\).

**(c) Derivação do Lagrangiano / Relação Dual:**
Introduzindo o vetor de multiplicadores de Lagrange (*Lagrange multipliers*) não negativos \\( \boldsymbol{\lambda} \in \mathbb{R}^m \\) (\\( \boldsymbol{\lambda} \geqslant \mathbf{0} \\)), o Lagrangiano (*Lagrangian*) é dado por:
\\[ L(\boldsymbol{x}, \boldsymbol{\lambda}) = \boldsymbol{c}^\top \boldsymbol{x} + \boldsymbol{\lambda}^\top (\boldsymbol{A}\boldsymbol{x} - \boldsymbol{b}) = (\boldsymbol{c} + \boldsymbol{A}^\top \boldsymbol{\lambda})^\top \boldsymbol{x} - \boldsymbol{\lambda}^\top \boldsymbol{b} \\]
Ao calcular a derivada parcial de \\( L(\boldsymbol{x}, \boldsymbol{\lambda}) \\) em relação a \\( \boldsymbol{x} \\) e igualar a zero, obtém-se a condição de estacionariedade:
\\[ \boldsymbol{c} + \boldsymbol{A}^\top \boldsymbol{\lambda} = \mathbf{0} \\]
Com essa condição satisfeita, o Lagrangiano dual resulta em \\( D(\boldsymbol{\lambda}) = -\boldsymbol{\lambda}^\top \boldsymbol{b} \\).

**(d) Problema Dual / Resultado Dual:**
A maximização da função dual \\( D(\boldsymbol{\lambda}) \\) sob as restrições derivadas define o problema dual de otimização (*dual optimization problem*) com \\( m \\) variáveis duais:
\\[ \max_{\boldsymbol{\lambda} \in \mathbb{R}^m} -\boldsymbol{b}^\top \boldsymbol{\lambda} \\]
sujeito a
\\[ \boldsymbol{c} + \boldsymbol{A}^\top \boldsymbol{\lambda} = \mathbf{0} \\]
\\[ \boldsymbol{\lambda} \geqslant \mathbf{0} \\]

**(e) Propriedades, Exemplos e Aplicações em Machine Learning:**
- **Escolha de Resolução:** Pode-se optar por resolver o problema primal (com \\( d \\) variáveis) ou o dual (com \\( m \\) variáveis), dependendo de qual dimensão for menor.
- **Uso em Prática:** Programas lineares constituem uma das abordagens mais utilizadas na indústria.
- **Geometria:** A função objetivo linear gera linhas de contorno lineares (*linear contour lines*), e a região viável (*feasible region*) é um poliedro delimitado pelas restrições; a solução ótima localiza-se em um dos vértices da região viável.

---

### §7.3.2 Quadratic Programming [MML §7.3.2]

**(a) Definição / Conceito Central:**
A programação quadrática (*quadratic programming* / *quadratic program*) é o problema de otimização convexa no qual a função objetivo é quadrática convexa e as restrições são afins (*affine constraints*).

**(b) Problema Primal / Formulação Matemática:**
O problema primal com \\( d \\) variáveis e \\( m \\) restrições lineares é definido como:
\\[ \min_{\boldsymbol{x} \in \mathbb{R}^d} \frac{1}{2} \boldsymbol{x}^\top \boldsymbol{Q}\boldsymbol{x} + \boldsymbol{c}^\top \boldsymbol{x} \\]
sujeito a
\\[ \boldsymbol{A}\boldsymbol{x} \leqslant \boldsymbol{b} \\]
onde \\( \boldsymbol{A} \in \mathbb{R}^{m \times d} \\), \\( \boldsymbol{b} \in \mathbb{R}^m \\), \\( \boldsymbol{c} \in \mathbb{R}^d \\), e a matriz simétrica \\( \boldsymbol{Q} \in \mathbb{R}^{d \times d} \\) é definida positiva (*positive definite*), garantindo que a função objetivo seja convexa.

**(c) Derivação do Lagrangiano / Relação Dual:**
Associando os multiplicadores de Lagrange \\( \boldsymbol{\lambda} \geqslant \mathbf{0} \\), o Lagrangiano é:
\\[ L(\boldsymbol{x}, \boldsymbol{\lambda}) = \frac{1}{2} \boldsymbol{x}^\top \boldsymbol{Q}\boldsymbol{x} + \boldsymbol{c}^\top \boldsymbol{x} + \boldsymbol{\lambda}^\top (\boldsymbol{A}\boldsymbol{x} - \boldsymbol{b}) = \frac{1}{2} \boldsymbol{x}^\top \boldsymbol{Q}\boldsymbol{x} + (\boldsymbol{c} + \boldsymbol{A}^\top \boldsymbol{\lambda})^\top \boldsymbol{x} - \boldsymbol{\lambda}^\top \boldsymbol{b} \\]
Igualando a derivada de \\( L(\boldsymbol{x}, \boldsymbol{\lambda}) \\) em relação a \\( \boldsymbol{x} \\) a zero:
\\[ \boldsymbol{Q}\boldsymbol{x} + (\boldsymbol{c} + \boldsymbol{A}^\top \boldsymbol{\lambda}) = \mathbf{0} \\]
Como \\( \boldsymbol{Q} \\) é definida positiva e portanto invertível (*invertible*), obtém-se \\( \boldsymbol{x} = -\boldsymbol{Q}^{-1}(\boldsymbol{c} + \boldsymbol{A}^\top \boldsymbol{\lambda}) \\). Substituindo essa expressão no Lagrangiano primal, chega-se ao Lagrangiano dual:
\\[ D(\boldsymbol{\lambda}) = -\frac{1}{2} (\boldsymbol{c} + \boldsymbol{A}^\top \boldsymbol{\lambda})^\top \boldsymbol{Q}^{-1}(\boldsymbol{c} + \boldsymbol{A}^\top \boldsymbol{\lambda}) - \boldsymbol{\lambda}^\top \boldsymbol{b} \\]

**(d) Problema Dual / Resultado Dual:**
O problema dual de otimização consiste em maximizar \\( D(\boldsymbol{\lambda}) \\) sujeito à não-negatividade dos multiplicadores:
\\[ \max_{\boldsymbol{\lambda} \in \mathbb{R}^m} -\frac{1}{2} (\boldsymbol{c} + \boldsymbol{A}^\top \boldsymbol{\lambda})^\top \boldsymbol{Q}^{-1}(\boldsymbol{c} + \boldsymbol{A}^\top \boldsymbol{\lambda}) - \boldsymbol{\lambda}^\top \boldsymbol{b} \\]
sujeito a
\\[ \boldsymbol{\lambda} \geqslant \mathbf{0} \\]

**(e) Propriedades, Exemplos e Aplicações em Machine Learning:**
- **Geometria:** As linhas de contorno (*contour lines*) de uma função objetivo quadrática com matriz \\( \boldsymbol{Q} \\) definida positiva possuem formato elíptico.
- **Aplicação em ML:** A programação quadrática tem papel fundamental no aprendizado de máquina, constituindo a base matemática para a formulação das Máquinas de Vetores de Suporte (*Support Vector Machines* - SVMs) discutidas no Capítulo 12.

---

### §7.3.3 Legendre–Fenchel Transform and Convex Conjugate [MML §7.3.3]

**(a) Definição / Conceito Central:**
A transformada de Legendre–Fenchel (*Legendre–Fenchel transform*), também chamada de conjugada convexa (*convex conjugate*), é uma transformação de uma função convexa e diferenciável \\( f(\boldsymbol{x}) \\) em uma função dependente de suas tangentes ou gradientes \\( \boldsymbol{s}(\boldsymbol{x}) = \nabla_{\boldsymbol{x}} f(\boldsymbol{x}) \\), baseada na propriedade de que conjuntos convexos podem ser descritos por seus hiperplanos de suporte (*supporting hyperplanes*).

**(b) Problema Primal / Formulação Matemática:**
A conjugada convexa \\( f^* \\) de uma função \\( f : \mathbb{R}^D \to \mathbb{R} \\) é formalmente definida por:
\\[ f^*(\boldsymbol{s}) = \sup_{\boldsymbol{x} \in \mathbb{R}^D} (\langle \boldsymbol{s}, \boldsymbol{x} \rangle - f(\boldsymbol{x})) \\]
Considerando o produto interno padrão (*standard dot product*) \\( \langle \boldsymbol{s}, \boldsymbol{x} \rangle = \boldsymbol{s}^\top \boldsymbol{x} \\), tem-se:
\\[ f^*(\boldsymbol{s}) = \sup_{\boldsymbol{x} \in \mathbb{R}^D} (\boldsymbol{s}^\top \boldsymbol{x} - f(\boldsymbol{x})) \\]
Esta definição não necessita formalmente que a função \\( f \\) seja convexa ou diferenciável.

**(c) Derivação do Lagrangiano / Relação Dual:**
Para funções convexas e diferenciáveis, o supremo é único e atingido quando \\( \boldsymbol{s} = \nabla_{\boldsymbol{x}} f(\boldsymbol{x}_0) \\). Nesses casos, existe uma correspondência direta sem necessidade do supremo:
\\[ f^*(\boldsymbol{s}) = \boldsymbol{s}^\top \boldsymbol{x}_0 - f(\boldsymbol{x}_0) \\]
Além disso, a transformada de Legendre–Fenchel permite derivar problemas de otimização dual diretamente sem restrições explícitas; para um problema da forma \\( \min_{\boldsymbol{x}} f(\boldsymbol{A}\boldsymbol{x}) + g(\boldsymbol{x}) \\), a relação dual equivale a:
\\[ \min_{\boldsymbol{x}} (f(\boldsymbol{A}\boldsymbol{x}) + g(\boldsymbol{x})) = \max_{\boldsymbol{u}} (-f^*(\boldsymbol{u}) - g^*(-\boldsymbol{A}^\top \boldsymbol{u})) \\]

**(d) Problema Dual / Resultado Dual:**
A transformação converte o problema de minimização primal na maximização de funções conjugadas no espaço dual. Por exemplo, para a função quadrática \\( f(\boldsymbol{y}) = \frac{\lambda}{2} \boldsymbol{y}^\top \boldsymbol{K}^{-1} \boldsymbol{y} \\) (com \\( \boldsymbol{K} \\) definida positiva), a maximização em relação a \\( \boldsymbol{y} \\) fornece a conjugada dual:
\\[ f^*(\boldsymbol{\alpha}) = \frac{1}{2\lambda} \boldsymbol{\alpha}^\top \boldsymbol{K} \boldsymbol{\alpha} \\]

**(e) Propriedades, Exemplos e Aplicações em Machine Learning:**
- **Soma de Perdas:** Para objetivos de treinamento definidos como a soma de perdas individuais \\( \mathcal{L}(\boldsymbol{t}) = \sum_{i=1}^n \ell_i(t_i) \\), a conjugada convexa decompoe-se na soma das conjugadas de cada perda individual:
\\[ \mathcal{L}^*(\boldsymbol{z}) = \sum_{i=1}^n \ell_i^*(z_i) \\]
- **Involutividade:** Em funções convexas, a aplicação consecutiva da transformada de Legendre duas vezes recupera a função original.
- **Aplicações em ML:** A perda conjugada (*conjugate loss*) é extremamente conveniente para derivar a formulação dual em modelos de aprendizado de máquina com funções de perda convexas aplicadas independentemente a cada exemplo do conjunto de dados.

---

7.4 Further Reading
A Seção 7.5 não existe no livro carregado.

---

## Prompt 5 — §2.7.3 Image and Kernel

Conforme solicitado no arquivo carregado (**MML**), os números e títulos exatos das subseções da **Seção 2.7 (Linear Mappings)** são:

- **§2.7.1:** Matrix Representation of Linear Mappings
- **§2.7.2:** Basis Change
- **§2.7.3:** Image and Kernel

---

### §2.7.3 Image and Kernel [MML §2.7.3]

**(a) Definição / Conceito Central:**
Para uma transformação linear \\( \Phi : V \to W \\) entre dois espaços vetoriais \\( V \\) (domínio / *domain*) e \\( W \\) (contradomínio / *codomain*):
- O **núcleo / espaço nulo** (*kernel* / *null space*), denotado por \\( \text{ker}(\Phi) \\), é o conjunto de todos os vetores \\( \boldsymbol{v} \in V \\) que \\( \Phi \\) mapeia no elemento neutro \\( \mathbf{0}_W \in W \\):
\\[ \text{ker}(\Phi) := \Phi^{-1}(\mathbf{0}_W) = \{ \boldsymbol{v} \in V : \Phi(\boldsymbol{v}) = \mathbf{0}_W \} \\]
- A **imagem / alcance** (*image* / *range*), denotada por \\( \text{Im}(\Phi) \\), é o conjunto de todos os vetores \\( \boldsymbol{w} \in W \\) que podem ser alcançados por \\( \Phi \\) a partir de algum vetor em \\( V \\):
\\[ \text{Im}(\Phi) := \Phi(V) = \{ \boldsymbol{w} \in W \mid \exists \boldsymbol{v} \in V : \Phi(\boldsymbol{v}) = \boldsymbol{w} \} \\]
Intuitivamente, o núcleo é um subespaço vetorial de \\( V \\) (\\( \text{ker}(\Phi) \subseteq V \\)) e a imagem é um subespaço vetorial de \\( W \\) (\\( \text{Im}(\Phi) \subseteq W \\)). O vetor nulo \\( \mathbf{0}_V \\) sempre pertence ao núcleo, pois \\( \Phi(\mathbf{0}_V) = \mathbf{0}_W \\), portanto o núcleo nunca é vazio.

**(b) Relação com Posto e com Injetividade/Sobrejetividade:**
- **Espaço das Colunas e Posto (*Column Space and Rank*):** Para uma matriz de transformação \\( \boldsymbol{A} \in \mathbb{R}^{m \times n} \\) associada à transformação linear \\( \Phi : \mathbb{R}^n \to \mathbb{R}^m, \boldsymbol{x} \mapsto \boldsymbol{A}\boldsymbol{x} \\), a imagem \\( \text{Im}(\Phi) \\) é o subespaço gerado pelas colunas de \\( \boldsymbol{A} \\), denominado espaço das colunas (*column space*):
\\[ \text{Im}(\Phi) = \text{span}[\boldsymbol{a}_1, \ldots, \boldsymbol{a}_n] \subseteq \mathbb{R}^m \\]
A dimensão da imagem é igual ao posto da matriz (*rank*): \\( \text{dim}(\text{Im}(\Phi)) = \text{rk}(\boldsymbol{A}) \\). O núcleo \\( \text{ker}(\Phi) \\) representa o conjunto de soluções gerais do sistema linear homogêneo \\( \boldsymbol{A}\boldsymbol{x} = \mathbf{0} \\).
- **Injetividade (*Injective*):** A transformação \\( \Phi \\) é injetiva (um-para-um / *one-to-one*) se e somente se o núcleo contiver apenas o vetor nulo:
\\[ \text{ker}(\Phi) = \{ \mathbf{0}_V \} \iff \text{dim}(\text{ker}(\Phi)) = 0 \\]
- **Sobrejetividade (*Surjective*):** \\( \Phi \\) é sobrejetiva se e somente se sua imagem for igual a todo o contradomínio \\( W \\):
\\[ \text{Im}(\Phi) = W \iff \text{dim}(\text{Im}(\Phi)) = \text{dim}(W) \\]
- **Bijetividade (*Bijective*):** Se \\( \text{dim}(V) = \text{dim}(W) \\), vale a equivalência: \\( \Phi \text{ é injetiva} \iff \Phi \text{ é sobrejetiva} \iff \Phi \text{ é bijetiva} \\).

**(c) Teorema da Nulidade e Posto (*Rank-Nullity Theorem*):**
Também chamado de Teorema Fundamental das Transformaçoes Lineares (*fundamental theorem of linear mappings*), estabelece que para espaços vetoriais \\( V, W \\) e uma transformação linear \\( \Phi : V \to W \\):
\\[ \text{dim}(\text{ker}(\Phi)) + \text{dim}(\text{Im}(\Phi)) = \text{dim}(V) \\]
Consequências diretas do teorema:
- Se \\( \text{dim}(\text{Im}(\Phi)) < \text{dim}(V) \\), então o núcleo é não trivial (\\( \text{dim}(\text{ker}(\Phi)) \geqslant 1 \\)) e o sistema homogêneo \\( \boldsymbol{A}_\Phi \boldsymbol{x} = \mathbf{0} \\) possui infinitas soluções.

**(d) Exemplo Numérico Pequeno com Matriz 2×2:**
Considere a transformação linear \\( \Phi : \mathbb{R}^2 \to \mathbb{R}^2 \\) representada pela matriz \\( \boldsymbol{A} \in \mathbb{R}^{2 \times 2} \\):
\\[ \boldsymbol{A} = \begin{bmatrix} 1 & 2 \\ 1 & 2 \end{bmatrix} \\]
- **Cálculo da Imagem \\( \text{Im}(\Phi) \\):** A imagem é dada pelo subespaço gerado pelas colunas de \\( \boldsymbol{A} \\):
\\[ \text{Im}(\Phi) = \text{span}\left[ \begin{bmatrix} 1 \\ 1 \end{bmatrix}, \begin{bmatrix} 2 \\ 2 \end{bmatrix} \right] = \text{span}\left[ \begin{bmatrix} 1 \\ 1 \end{bmatrix} \right] \\]
Portanto, a dimensão da imagem é \\( \text{dim}(\text{Im}(\Phi)) = \text{rk}(\boldsymbol{A}) = 1 \\).
- **Cálculo do Núcleo \\( \text{ker}(\Phi) \\):** Resolve-se o sistema homogêneo \\( \boldsymbol{A}\boldsymbol{x} = \mathbf{0} \\):
\\[ \begin{bmatrix} 1 & 2 \\ 1 & 2 \end{bmatrix} \begin{bmatrix} x_1 \\ x_2 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix} \implies x_1 + 2x_2 = 0 \implies x_1 = -2x_2 \\]
Logo, o núcleo é a reta gerada pelo vetor \\( \begin{bmatrix} -2 \\ 1 \end{bmatrix} \\):
\\[ \text{ker}(\Phi) = \text{span}\left[ \begin{bmatrix} -2 \\ 1 \end{bmatrix} \right] \\]
Sua dimensão é \\( \text{dim}(\text{ker}(\Phi)) = 1 \\).
- **Verificação do Teorema da Nulidade e Posto:**
\\[ \text{dim}(\text{ker}(\Phi)) + \text{dim}(\text{Im}(\Phi)) = 1 + 1 = 2 = \text{dim}(\mathbb{R}^2) \\]

**(e) Propriedades, Exemplos e Aplicações em Machine Learning:**
- **Regressor Linear (*Linear Regression* - MML §9.4):** A solução de verossimilhança máxima (*maximum likelihood estimate*) \\( \boldsymbol{y} \approx \boldsymbol{\Phi}\boldsymbol{\theta}_{\text{ML}} \\) na regressão linear pode ser interpretada como uma projeção ortogonal (*orthogonal projection*) do vetor de alvos/observações \\( \boldsymbol{y} \in \mathbb{R}^N \\) sobre um subespaço \\( K \\)-dimensional de \\( \mathbb{R}^N \\) gerado pelas colunas da matriz de características / matriz de design (*feature matrix / design matrix*) \\( \boldsymbol{\Phi} \in \mathbb{R}^{N \times K} \\), ou seja, a imagem / espaço das colunas \\( \text{Im}(\boldsymbol{\Phi}) \\).
- **Análise de Componentes Principais (*Principal Component Analysis* - PCA - MML §10.1–10.3 e §4.5):** No PCA, busca-se projetar dados de alta dimensão sobre um subespaço principal (*principal subspace*) de menor dimensão \\( U \subseteq \mathbb{R}^D \\), gerado pelas colunas da matriz de projeção \\( \boldsymbol{B} \in \mathbb{R}^{D \times M} \\), onde o subespaço corresponde à imagem \\( \text{Im}(\boldsymbol{B}) \\). Além disso, na Decomposição em Valores Singulares (SVD - MML §4.5) utilizada para calcular os componentes, os vetores singulares à direita correspondentes a valores singulares nulos fornecem uma base ortonormal para o núcleo (*kernel / null space*) da matriz de dados.
- **Ressalva da Terminologia em ML (MML §12.4 Remark):** O livro destaca que a palavra *kernel* possui múltiplos significados em Machine Learning: (1) o núcleo / espaço nulo de uma transformação linear na Álgebra Linea (MML §2.7.3); (2) a função de núcleo em métodos de *kernel* (como o truque do *kernel* / *kernel trick* em SVMs - MML §12.4); e (3) o *kernel* de suavização na estimação de densidade (*kernel density estimation* - MML §11.5).

---

## Prompt 6 — Capítulo 6: §6.4.6 e §6.7 separados

Conforme o arquivo carregado (**MML**), os números e títulos exatos das seções solicitadas são:

- **Título da §6.4.6:** Inner Products of Random Variables [MML §6.4.6]
- **Título da §6.7:** Change of Variables/Inverse Transform [MML §6.7]

---

### §6.4.6 Inner Products of Random Variables [MML §6.4.6]

**(a) Definição / Conceito Central:**
Variáveis aleatórias podem ser consideradas vetores em um espaço vetorial (*vector space*). Para variáveis aleatórias com média zero (\\( \mathbb{E}[X] = 0, \mathbb{E}[Y] = 0 \\)), pode-se definir um produto interno (*inner product*) utilizando a covariância:
\\[ \langle X, Y \rangle := \text{Cov}[x, y] \\]
Esta definição satisfaz as propriedades de um produto interno: é simétrica, definida positiva (para variáveis não determinísticas) e linear em relação a ambos os argumentos.

**(b) Formulação Matemática:**
- **Produto Interno (*Inner Product*):** \\( \langle X, Y \rangle = \text{Cov}[x, y] \\)
- **Norma / Comprimento (*Length / Norm*):** O comprimento de uma variável aleatória é dado pela raiz quadrada de sua variância, isto é, o seu desvio padrão (*standard deviation*):
\\[ \|X\| = \sqrt{\langle X, X \rangle} = \sqrt{\text{Cov}[x, x]} = \sqrt{\text{V}[x]} = \sigma[x] \\]
Variáveis aleatórias "mais longas" possuem maior incerteza; uma variável com comprimento zero é determinística.
- **Ângulo e Correlação (*Angle and Correlation*):** O cosseno do ângulo \\( \theta \\) entre duas variáveis aleatórias \\( X \\) e \\( Y \\) corresponde à correlação (*correlation*) entre elas:
\\[ \cos \theta = \frac{\langle X, Y \rangle}{\|X\| \|Y\|} = \frac{\text{Cov}[x, y]}{\sqrt{\text{V}[x]\text{V}[y]}} = \text{corr}[x, y] \\]

**(c) Derivação e Relação Geométrica:**
- **Ortogonalidade e Não-Correlacionamento:** Duas variáveis aleatórias são ortogonais (\\( X \perp Y \iff \langle X, Y \rangle = 0 \\)) se e somente se sua covariância for nula (\\( \text{Cov}[x, y] = 0 \\)), ou seja, se forem não-correlacionadas.
- **Teorema de Pitágoras para Variâncias:** Para duas variáveis não-correlacionadas, a variância da soma equivale à soma das variâncias:
\\[ \text{V}[x + y] = \text{V}[x] + \text{V}[y] \\]
Geometricamente, isso corresponde ao Teorema de Pitágoras (\\( c^2 = a^2 + b^2 \\)) para triângulos retângulos no espaço vetorial de variáveis aleatórias.

**(d) Distâncias entre Distribuições e Geometria da Informação:**
- **Inadequação da Distância Euclidiana:** A distância euclidiana simples não é ideal para comparar distribuições de probabilidade devido às restrições de que as densidades/massas devem ser não-negativas e somar 1.
- **Variedade Estatística (*Statistical Manifold*):** Essas restrições fazem com que as distribuições de probabilidade habitem um espaço geométrico chamado variedade estatística (*statistical manifold*), estudado pela **geometria da informação** (*information geometry*).
- **Divergências:** O cálculo de distâncias em variedades estatísticas é realizado por meio de divergências, notadamente a **divergência de Kullback–Leibler** (*Kullback–Leibler divergence*), que é um caso especial de divergências de Bregman (*Bregman divergences*) e \\( f \\)-divergências (*f-divergences*).

**(e) Propriedades e Aplicações em Machine Learning:**
- **Regressão e PCA:** A interpretação de variáveis aleatórias como vetores e normas como desvios fundamenta a projeção ortogonal na Regressão Linear (MML Capítulo 9) e a busca por direções de variância máxima no PCA (MML Capítulo 10).
- **Inferência Variacional e Estimação de Densidade:** A divergência de Kullback–Leibler e a geometria da informação reaparecem diretamente ao mensurar a diferença entre distribuições reais e aproximadas em modelos probabilísticos e misturas de Gaussianas (MML Capítulo 11).

---

### §6.7 Change of Variables/Inverse Transform [MML §6.7]

**(a) Definição / Conceito Central:**
A técnica de mudança de variáveis (*change of variables*) e a transformada inversa (*inverse transform*) fornecem métodos formais para determinar a distribuição de probabilidade de uma nova variável aleatória \\( Y = U(X) \\) obtida a partir de uma transformação da variável \\( X \\).

**(b) Formulação Matemática:**
- **Técnica da Função de Distribuição (*Distribution Function Technique*):**
  1. Encontra-se a função de distribuição acumulada - FDA (*cumulative distribution function* - CDF) de \\( Y \\):
  \\[ F_Y(y) = P(Y \leqslant y) = P(U(X) \leqslant y) \\]
  2. Diferencia-se a FDA para obter a função densidade de probabilidade - FDP (*probability density function* - PDF):
  \\[ f(y) = \frac{\text{d}}{\text{d}y} F_Y(y) \\]
- **Fórmula de Mudança de Variável Univariada (*Univariate Change of Variables*):** Para uma função invertível \\( U \\):
\\[ f(y) = f_x(U^{-1}(y)) \cdot \left| \frac{\text{d}}{\text{d}y} U^{-1}(y) \right| \\]
- **Fórmula de Mudança de Variável Multivariada (*Multivariate Change of Variables* - Teorema 6.16):** Para \\( \boldsymbol{y} = U(\boldsymbol{x}) \\) diferenciável e invertível:
\\[ f(\boldsymbol{y}) = f_x(U^{-1}(\boldsymbol{y})) \cdot \left| \det\left( \frac{\partial}{\partial \boldsymbol{y}} U^{-1}(\boldsymbol{y}) \right) \right| \\]

**(c) Derivação Matemática e Relações:**
- **Regra de Substituição e Teorema Fundamental do Cálculo:** A derivação fundamenta-se na regra de substituição do cálculo integral \\( \int f(g(x))g'(x)\text{d}x = \int f(u)\text{d}u \\) e na diferenciação de integrais com limites variáveis.
- **Fator de Escala Jacobiano:** O termo diferencial \\( \left| \frac{\text{d}}{\text{d}y} U^{-1}(y) \right| \\) no caso univariado ou o valor absoluto do determinante Jacobiano (*Jacobian determinant*) \\( \left| \det(J) \right| \\) no caso multivariado mede o quanto um volume ou área unitária se expande ou contrai ao aplicar a transformação \\( U \\).
- **Transformada Integral de Probabilidade (*Probability Integral Transform* - Teorema 6.15):** Se \\( X \\) é uma variável contínua com FDA estritamente monotônica \\( F_X(x) \\), a variável \\( Y := F_X(X) \\) possui distribuição uniforme no intervalo \\( \\).

**(d) Exemplo Numérico Pequeno (Exemplo 6.16 no MML):**
Seja \\( X \\) uma variável aleatória contínua com FDP \\( f(x) = 3x^2 \\) para \\( 0 \leqslant x \leqslant 1 \\). Deseja-se encontrar a FDP de \\( Y = X^2 \\):
1. **Cálculo da FDA de \\( Y \\):**
\\[ F_Y(y) = P(Y \leqslant y) = P(X^2 \leqslant y) = P(X \leqslant y^{1/2}) = F_X(y^{1/2}) = \int_0^{y^{1/2}} 3t^2 \text{d}t = [t^3]_{t=0}^{t=y^{1/2}} = y^{3/2} \\]
para \\( 0 \leqslant y \leqslant 1 \\).
2. **Obtenção da FDP por diferenciação:**
\\[ f(y) = \frac{\text{d}}{\text{d}y} F_Y(y) = \frac{\text{d}}{\text{d}y} \left( y^{3/2} \right) = \frac{3}{2} y^{1/2} \quad \text{para } 0 \leqslant y \leqslant 1 \\]

**(e) Onde Reaparece nos Modelos e Aplicações em Machine Learning:**
- **Geração de Amostras (*Sampling*):** O Teorema da Transformada Integral de Probabilidade é a base de algoritmos de amostragem no computador, como a transformação de Box–Muller para gerar amostras gaussianas a partir de distribuições uniformes (MML §6.5.4, §6.7.1).
- **Transformações Afins em Modelos Gaussianos e GMM (*Clusterizador*):** Em modelos de mistura de Gaussianas (*Gaussian Mixture Models* - GMM - MML Capítulo 11), a transformação de componentes por matrizes afins \\( \boldsymbol{y} = \boldsymbol{A}\boldsymbol{x} + \boldsymbol{b} \\) resulta em novas Gaussianas cujas densidades usam o fator de escala do determinante da matriz de covariância/Jacobiana (MML §6.5.3 e Exemplo 6.17 no MML §6.7.2).
- **Deep Learning e Normalizing Flows:** A mudança de variáveis multivariada via determinantes de matrizes Jacobianas reaparece no treinamento de redes neurais profundas por meio do truque da reparametrização (*reparametrization trick* / *infinite perturbation analysis* - MML §5.3) e no modelo de *normalizing flows* (MML §6.8).

---

## Prompt 7 — Capítulo 1 (abertura do curso)

### §1 Introduction and Motivation [MML §1]

**(a) Definição / Conceito Central / Intuição Inicial:**
- **Motivação do Livro:** O livro é projetado para atuar como um guia (*guidebook*) para a literatura matemática por trás do aprendizado de máquina (*machine learning*), conectando a matemática do ensino médio/física a textos técnicos avançados. O conteúdo possui estrutura modular, permitindo a leitura tanto pela abordagem *bottom-up* (construindo conceitos desde as bases matemáticas até as aplicações) quanto *top-down* (partindo das necessidades práticas até os pré-requisitos matemáticos).
- **Três Conceitos Centrais:** O aprendizado de máquina trata do projeto de algoritmos para extrair automaticamente informações e padrões valiosos a partir de dados. A disciplina fundamenta-se em três conceitos essenciais: **dados** (*data*), **modelo** (*model*) e **aprendizado** (*learning*).
- **§1.1 Finding Words for Intuitions — Ambiguidade de Termos:** Destaca-se que vários termos em aprendizado de máquina possuem ambiguidades conceituais. Em particular, a expressão "algoritmo de aprendizado de máquina" é utilizada em dois sentidos principais:
  1. **Preditor** (*predictor*): O sistema que realiza predições com base em dados de entrada.
  2. **Treinamento** (*training*): O sistema que adapta os parâmetros internos do preditor para que ele desempenhe bem em dados futuros não vistos.
- **Dados como Vetores (*Data as Vectors*):** Assume-se que os dados numéricos foram previamente convertidos para uma representação adequada para programas de computador, sendo pensados como vetores. O texto apresenta três perspectivas para vetores: uma sequência/arranjo de números (*array of numbers*, visão da ciência da computação), uma seta com direção e magnitude (visão da física), ou um objeto que obedece a regras de adição e escalonamento (visão matemática).
- **Modelo (*Model*):** Descreve uma simplificação do processo (real e desconhecido) gerador dos dados, capturando aspectos relevantes para extrair padrões ocultos e prever acontecimentos no mundo real sem a necessidade de realizar experimentos físicos.
- **Aprendizado como Otimização (*Learning as Optimization*):** O aprendizado consiste em encontrar automaticamente estruturas e padrões nos dados ajustando/otimizando os parâmetros do modelo em relação a uma função de utilidade. O treinamento é comparado analogamente a escalar uma montanha (*climbing a hill*) até alcançar o seu topo (máximo de uma medida de desempenho). O objetivo final do aprendizado é a capacidade de generalização para dados futuros não vistos (*unseen data*).

**(b) Problema Primal / Formulação Matemática:**
Não há. Conforme explicitado no próprio texto, este capítulo inicial dedica-se apenas a estabelecer intuições e conceitos em linguagem geral, não apresentando definições formais, equações deduzidas ou sistemas matemáticos formais.

**(c) Derivação do Lagrangiano / Relação Dual:**
Não há.

**(d) Problema Dual / Resultado Dual:**
Não há.

**(e) Propriedades, Exemplos e Aplicações em Machine Learning:**
- **Exemplos Oferecidos no Capítulo 1:** O capítulo exemplifica a extração automática de padrões citando a identificação de tópicos compartilhados em um acervo de documentos (livros em bibliotecas) e a regressão (*regression setting*) como um mapeamento de entradas para saídas numéricas reais.
- **Quatro Pilares de Machine Learning:** O livro organiza a aplicação prática dos conceitos matemáticos em quatro pilares desenvolvidos na Parte II:
  1. Regressão (*Regression*)
  2. Redução de Dimensionalidade (*Dimensionality Reduction*)
  3. Estimação de Densidade (*Density Estimation*)
  4. Classificação (*Classification*)
- **Outras Propriedades ou Formalismos Deduzidos:** Não há neste capítulo (o desenvolvimento formal e matemático inicia-se a partir do Capítulo 2).
