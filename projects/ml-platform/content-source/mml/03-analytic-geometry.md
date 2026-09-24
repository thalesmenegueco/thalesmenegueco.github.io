
## mml-3.1 — Normas (Norms)

* **(a) Definição Formal e Notação Exata:**
  Uma norma em um espaço vetorial \\(V\\) é uma função \\(\|\cdot\| : V \to \mathbb{R}\\), \\(\boldsymbol{x} \mapsto \|\boldsymbol{x}\|\\), que atribui a cada vetor um número real representando seu comprimento. Para todo \\(\lambda \in \mathbb{R}\\) e \\(\boldsymbol{x}, \boldsymbol{y} \in V\\), satisfaz:
  1. **Homogeneidade Absoluta:** \\(\|\lambda \boldsymbol{x}\| = |\lambda| \|\boldsymbol{x}\|\\).
  2. **Desigualdade Triangular:** \\(\|\boldsymbol{x} + \boldsymbol{y}\| \le \|\boldsymbol{x}\| + \|\boldsymbol{y}\|\\).
  3. **Positiva Definida:** \\(\|\boldsymbol{x}\| \ge 0\\) e \\(\|\boldsymbol{x}\| = 0 \iff \boldsymbol{x} = \boldsymbol{0}\\).
  
  *Exemplos de normas em \\(\mathbb{R}^n\\):*
  * **Norma Manhattan (\\(\ell_1\\)):** \\(\|\boldsymbol{x}\|_1 := \sum_{i=1}^n |x_i|\\).
  * **Norma Euclidiana (\\(\ell_2\\)):** \\(\|\boldsymbol{x}\|_2 := \sqrt{\sum_{i=1}^n x_i^2} = \sqrt{\boldsymbol{x}^\top \boldsymbol{x}}\\).

* **(b) Intuição Geométrica:**
  A norma mede a distância da ponta do vetor orientado até a origem. A forma geométrica do conjunto de vetores de comprimento unitário (\\(\|\boldsymbol{x}\| = 1\\)) varia segundo a norma: na norma \\(\ell_1\\), forma um losango/diamante em 2D; na norma \\(\ell_2\\), forma um círculo perfeito.

* **(c) Exemplo Numérico em 2D:**
  Para o vetor \\(\boldsymbol{x} = \begin{bmatrix} 1 \\ 1 \end{bmatrix} \in \mathbb{R}^2\\):
  * Norma \\(\ell_1\\): \\(\|\boldsymbol{x}\|_1 = |1| + |1| = 2\\).
  * Norma \\(\ell_2\\): \\(\|\boldsymbol{x}\|_2 = \sqrt{1^2 + 1^2} = \sqrt{2} \approx 1,414\\).

* **(d) Aplicação nos Modelos (ML):**
  * **Regressão Linear:** A norma \\(\ell_2\\) ao quadrado mede o erro de ajuste nos mínimos quadrados \\(\|\boldsymbol{y} - \boldsymbol{X}\boldsymbol{\theta}\|_2^2\\). A norma \\(\ell_2\\) e a norma \\(\ell_1\\) atuam como termos de regularização (Ridge e LASSO, respectivamente) para evitar *overfitting*.
  * **Support Vector Machines (SVM):** A margem de separação entre classes é maximizada através da minimização da norma do vetor de pesos \\(\frac{1}{2}\|\boldsymbol{w}\|^2\\).

* **(e) Fórmulas Relevantes:**
  * \\(\|\lambda \boldsymbol{x}\| = |\lambda| \|\boldsymbol{x}\|\\)
  * \\(\|\boldsymbol{x} + \boldsymbol{y}\| \le \|\boldsymbol{x}\| + \|\boldsymbol{y}\|\\)
  * \\(\|\boldsymbol{x}\|_1 = \sum_{i=1}^n |x_i|\\)
  * \\(\|\boldsymbol{x}\|_2 = \sqrt{\boldsymbol{x}^\top \boldsymbol{x}}\\)

---

## mml-3.2 — Produtos Internos e Matrizes Definidas Positivas (Inner Products & SPD Matrices)

* **(a) Definição Formal e Notação Exata:**
  Um produto interno em um espaço vetorial \\(V\\) é uma mapeamento bilinear simétrico e positivo definido \\(\Omega: V \times V \to \mathbb{R}\\), denotado por \\(\langle \boldsymbol{x}, \boldsymbol{y} \rangle\\):
  1. **Simetria:** \\(\langle \boldsymbol{x}, \boldsymbol{y} \rangle = \langle \boldsymbol{y}, \boldsymbol{x} \rangle, \, \forall \boldsymbol{x}, \boldsymbol{y} \in V\\).
  2. **Positiva Definida:** \\(\forall \boldsymbol{x} \in V \setminus \{\boldsymbol{0}\}: \langle \boldsymbol{x}, \boldsymbol{x} \rangle > 0\\) e \\(\langle \boldsymbol{0}, \boldsymbol{0} \rangle = 0\\).
  
  O **produto escalar (dot product)** em \\(\mathbb{R}^n\\) é o caso particular \\(\boldsymbol{x}^\top \boldsymbol{y} = \sum_{i=1}^n x_i y_i\\).
  
  *Relação com Matrizes SPD:* Se \\(\boldsymbol{A} \in \mathbb{R}^{n \times n}\\) for uma matriz simétrica definida positiva (isto é, \\(\boldsymbol{x}^\top \boldsymbol{A} \boldsymbol{x} > 0, \forall \boldsymbol{x} \neq \boldsymbol{0}\\)), então \\(\langle \boldsymbol{x}, \boldsymbol{y} \rangle = \hat{\boldsymbol{x}}^\top \boldsymbol{A} \hat{\boldsymbol{y}}\\) define um produto interno válido em relação a uma base ordenada \\(B\\).

* **(b) Intuição Geométrica:**
  O produto interno estende e generaliza o produto escalar, servindo como a ferramenta fundamental para capturar a noção intuitiva de **similaridade geométrica** entre vetores no espaço. Vetores muito semelhantes produzem valores altos no produto interno, enquanto vetores muito distantes ou ortogonais produzem valores próximos de zero ou negativos.

* **(c) Exemplo Numérico em 2D:**
  Para \\(\boldsymbol{x} = \begin{bmatrix} 1 \\ 1 \end{bmatrix}\\) e \\(\boldsymbol{y} = \begin{bmatrix} 1 \\ 2 \end{bmatrix}\\):
  * Dot product padrão: \\(\langle \boldsymbol{x}, \boldsymbol{y} \rangle = 1(1) + 1(2) = 3\\).
  * Produto interno ponderado com \\(\boldsymbol{A} = \begin{bmatrix} 1 & -1/2 \\ -1/2 & 1 \end{bmatrix}\\):
    \\(\langle \boldsymbol{x}, \boldsymbol{y} \rangle = x_1 y_1 - \frac{1}{2}(x_1 y_2 + x_2 y_1) + x_2 y_2 = 1(1) - \frac{1}{2}(2 + 1) + 1(2) = 1,5\\).

* **(d) Aplicação nos Modelos (ML):**
  * **Support Vector Machines (Kernel Trick):** O *Kernel Trick* substitui o produto interno no espaço original por um produto interno em um espaço de características de alta dimensão \\(k(\boldsymbol{x}_i, \boldsymbol{x}_j) = \langle \phi(\boldsymbol{x}_i), \phi(\boldsymbol{x}_j) \rangle\\), sem necessidade de computar a transformação \\(\phi\\) explicitamente.
  * **GMM e Regressão:** Matrizes de covariância em distribuições Gaussianas são matrizes SPD que atuam na construção de produtos internos e distâncias de Mahalanobis.

* **(e) Fórmulas Relevantes:**
  * \\(\boldsymbol{x}^\top \boldsymbol{y} = \sum_{i=1}^n x_i y_i\\)
  * \\(\langle \boldsymbol{x}, \boldsymbol{y} \rangle = \hat{\boldsymbol{x}}^\top \boldsymbol{A} \hat{\boldsymbol{y}}\\)
  * **Desigualdade de Cauchy-Schwarz:** \\(|\langle \boldsymbol{x}, \boldsymbol{y} \rangle| \le \|\boldsymbol{x}\| \|\boldsymbol{y}\|\\)

---

## mml-3.3 — Comprimentos, Distâncias e Métricas (Lengths, Distances & Metrics)

* **(a) Definição Formal e Notação Exata:**
  Todo produto interno induz uma norma natural \\(\|\boldsymbol{x}\| := \sqrt{\langle \boldsymbol{x}, \boldsymbol{x} \rangle}\\).
  A **distância** entre dois vetores \\(\boldsymbol{x}, \boldsymbol{y} \in V\\) é definida como \\(d(\boldsymbol{x}, \boldsymbol{y}) := \|\boldsymbol{x} - \boldsymbol{y}\| = \sqrt{\langle \boldsymbol{x}-\boldsymbol{y}, \boldsymbol{x}-\boldsymbol{y} \rangle}\\).
  Uma função \\(d: V \times V \to \mathbb{R}\\) é uma **métrica** se cumprir:
  1. **Positiva Definida:** \\(d(\boldsymbol{x}, \boldsymbol{y}) \ge 0\\) e \\(d(\boldsymbol{x}, \boldsymbol{y}) = 0 \iff \boldsymbol{x} = \boldsymbol{y}\\).
  2. **Simetria:** \\(d(\boldsymbol{x}, \boldsymbol{y}) = d(\boldsymbol{y}, \boldsymbol{x})\\).
  3. **Desigualdade Triangular:** \\(d(\boldsymbol{x}, \boldsymbol{z}) \le d(\boldsymbol{x}, \boldsymbol{y}) + d(\boldsymbol{y}, \boldsymbol{z})\\).
  Se o produto interno for o *dot product*, a distância é denominada **Distância Euclidiana**.

* **(b) Intuição Geométrica:**
  Mede a separação física em linha reta entre dois pontos no espaço vetorial. Diferente do produto interno (que cresce quanto mais similares forem os vetores), a distância/métrica se comporta no sentido oposto: vetores muito similares possuem distância pequena.

* **(c) Exemplo Numérico em 2D:**
  Para \\(\boldsymbol{x} = \begin{bmatrix} 1 \\ 1 \end{bmatrix}\\) e \\(\boldsymbol{y} = \begin{bmatrix} 1 \\ 2 \end{bmatrix}\\):
  \\(d(\boldsymbol{x}, \boldsymbol{y}) = \|\boldsymbol{x} - \boldsymbol{y}\|_2 = \left\| \begin{bmatrix} 0 \\ -1 \end{bmatrix} \right\|_2 = \sqrt{0^2 + (-1)^2} = 1\\).

* **(d) Aplicação nos Modelos (ML):**
  * **PCA e Regressão Linear:** O erro de reconstrução no PCA e a perda de mínimos quadrados na regressão medem a menor distância Euclidiana entre os dados originais e suas projeções.
  * **GMM:** Mede a proximidade de pontos aos centros de componentes gaussianos.

* **(e) Fórmulas Relevantes:**
  * \\(d(\boldsymbol{x}, \boldsymbol{y}) = \|\boldsymbol{x} - \boldsymbol{y}\| = \sqrt{\langle \boldsymbol{x}-\boldsymbol{y}, \boldsymbol{x}-\boldsymbol{y} \rangle}\\)
  * \\(d(\boldsymbol{x}, \boldsymbol{z}) \le d(\boldsymbol{x}, \boldsymbol{y}) + d(\boldsymbol{y}, \boldsymbol{z})\\)

---

## mml-3.4 — Ângulos e Ortogonalidade (Angles & Orthogonality)

* **(a) Definição Formal e Notação Exata:**
  O **ângulo** \\(\omega \in [0, \pi]\\) entre dois vetores não-nulos \\(\boldsymbol{x}, \boldsymbol{y} \in V\\) é definido usando a desigualdade de Cauchy-Schwarz por:
  \\[\cos \omega = \frac{\langle \boldsymbol{x}, \boldsymbol{y} \rangle}{\|\boldsymbol{x}\| \|\boldsymbol{y}\|}\\].
  Dois vetores \\(\boldsymbol{x}, \boldsymbol{y}\\) são **ortogonais** (\\(\boldsymbol{x} \perp \boldsymbol{y}\\)) se e somente se \\(\langle \boldsymbol{x}, \boldsymbol{y} \rangle = 0\\).
  Uma matriz quadrada \\(\boldsymbol{A} \in \mathbb{R}^{n \times n}\\) é uma **matriz ortogonal** se suas colunas forem ortonormais, ou seja, \\(\boldsymbol{A}\boldsymbol{A}^\top = \boldsymbol{I} = \boldsymbol{A}^\top \boldsymbol{A}\\), implicando que \\(\boldsymbol{A}^{-1} = \boldsymbol{A}^\top\\).

* **(b) Intuição Geométrica:**
  O ângulo indica o grau de alinhamento das direções dos vetores. Quando \\(\omega = 0\\), os vetores possuem exatamente a mesma orientação (\\(\cos \omega = 1\\)). Quando \\(\omega = 90^\circ\\) (\\(\pi/2\\)), os vetores são perpendiculares/ortogonais (\\(\cos \omega = 0\\)). Matrizes ortogonais preservam comprimentos e ângulos, atuando como rotações ou reflexões do espaço.

* **(c) Exemplo Numérico em 2D:**
  Para \\(\boldsymbol{x} = \begin{bmatrix} 1 \\ 1 \end{bmatrix}\\) e \\(\boldsymbol{y} = \begin{bmatrix} 1 \\ 2 \end{bmatrix}\\) sob o *dot product*:
  \\[\cos \omega = \frac{1(1) + 1(2)}{\sqrt{2}\sqrt{5}} = \frac{3}{\sqrt{10}} \approx 0,9487 \implies \omega = \arccos\left(\frac{3}{\sqrt{10}}\right) \approx 0,32 \text{ rad} \approx 18^\circ\\].
  Para \\(\boldsymbol{x} = \begin{bmatrix} 1 \\ 1 \end{bmatrix}\\) e \\(\boldsymbol{y} = \begin{bmatrix} -1 \\ 1 \end{bmatrix}\\): \\(\langle \boldsymbol{x}, \boldsymbol{y} \rangle = 1(-1) + 1(1) = 0 \implies \omega = 90^\circ\\) (\\(\boldsymbol{x} \perp \boldsymbol{y}\\)).

* **(d) Aplicação nos Modelos (ML):**
  * **Regressão Linear:** A estimativa de Mínimos Quadrados garante que o vetor de resíduos/erros de previsão \\((\boldsymbol{y} - \boldsymbol{X}\boldsymbol{\theta})\\) seja estritamente ortogonal ao subespaço gerado pelos dados de entrada.
  * **PCA:** As direções dos componentes principais escolhidos são mutuamente ortogonais.

* **(e) Fórmulas Relevantes:**
  * \\(\cos \omega = \frac{\langle \boldsymbol{x}, \boldsymbol{y} \rangle}{\|\boldsymbol{x}\| \|\boldsymbol{y}\|}\\)
  * \\(\boldsymbol{x} \perp \boldsymbol{y} \iff \langle \boldsymbol{x}, \boldsymbol{y} \rangle = 0\\)
  * \\(\boldsymbol{A}\boldsymbol{A}^\top = \boldsymbol{I} \iff \boldsymbol{A}^{-1} = \boldsymbol{A}^\top\\)

---

## mml-3.5 — Base Ortonormal (Orthonormal Basis - ONB)

* **(a) Definição Formal e Notação Exata:**
  Uma base \\(\{\boldsymbol{b}_1, \dots, \boldsymbol{b}_n\}\\) de um espaço com produto interno \\(V\\) é uma **base ortonormal (ONB)** se satisfizer:
  1. \\(\langle \boldsymbol{b}_i, \boldsymbol{b}_j \rangle = 0\\) para \\(i \neq j\\) (vetores ortogonais entre si).
  2. \\(\langle \boldsymbol{b}_i, \boldsymbol{b}_i \rangle = 1\\) para todo \\(i\\) (comprimento de cada vetor é 1).

* **(b) Intuição Geométrica:**
  Representa um sistema de eixos de coordenadas perfeitamente perpendiculares entre si, em que cada eixo possui escala unitária estandardizada, simplificando imensamente projeções e cálculos geométricos.

* **(c) Exemplo Numérico em 2D:**
  A base canônica \\(\{\boldsymbol{e}_1, \boldsymbol{e}_2\}\\) de \\(\mathbb{R}^2\\) é uma ONB. Outro exemplo em \\(\mathbb{R}^2\\) é:
  \\[\boldsymbol{b}_1 = \frac{1}{\sqrt{2}}\begin{bmatrix} 1 \\ 1 \end{bmatrix}, \quad \boldsymbol{b}_2 = \frac{1}{\sqrt{2}}\begin{bmatrix} 1 \\ -1 \end{bmatrix}\\]
  pois \\(\boldsymbol{b}_1^\top \boldsymbol{b}_2 = 0\\) e \\(\|\boldsymbol{b}_1\| = 1 = \|\boldsymbol{b}_2\|\\).

* **(d) Aplicação nos Modelos (ML):**
  Utilizada no **PCA** para formar a matriz de projeção \\(\boldsymbol{B} = [\boldsymbol{b}_1, \dots, \boldsymbol{b}_M]\\) com colunas ortonormais, o que simplifica a inversão matricial já que \\(\boldsymbol{B}^\top \boldsymbol{B} = \boldsymbol{I}\\).

* **(e) Fórmulas Relevantes:**
  * \\(\langle \boldsymbol{b}_i, \boldsymbol{b}_j \rangle = \delta_{ij}\\) (onde \\(\delta_{ij} = 1\\) se \\(i=j\\), e \\(0\\) se \\(i \neq j\\))

---

## mml-3.6 — Complemento Ortogonal e Vetor Normal (Orthogonal Complement & Normal Vector)

* **(a) Definição Formal e Notação Exata:**
  Dado um subespaço \\(U \subseteq V\\) de dimensão \\(M\\) em um espaço \\(V\\) de dimensão \\(D\\), seu **complemento ortogonal** \\(U^\perp\\) é um subespaço de dimensão \\(D-M\\) contendo todos os vetores de \\(V\\) ortogonais a qualquer vetor de \\(U\\):
  \\[U^\perp := \{\boldsymbol{x} \in V : \langle \boldsymbol{x}, \boldsymbol{u} \rangle = 0, \, \forall \boldsymbol{u} \in U\}\\].
  Todo vetor \\(\boldsymbol{x} \in V\\) pode ser decomposto unicamente como \\(\boldsymbol{x} = \sum_{m=1}^M \lambda_m \boldsymbol{b}_m + \sum_{j=1}^{D-M} \psi_j \boldsymbol{b}_j^\perp\\).
  O vetor unitário \\(\boldsymbol{w}\\) (\\(\|\boldsymbol{w}\|=1\\)) ortogonal a um plano/hiperplano \\(U\\) é o **vetor normal** de \\(U\\).

* **(b) Intuição Geométrica:**
  Decompõe o espaço total em duas partes perpendiculares. Para um plano 2D em um espaço 3D, seu complemento ortogonal é uma reta 1D gerada pelo vetor normal \\(\boldsymbol{w}\\) apontando para fora do plano.

* **(c) Exemplo Numérico em 2D:**
  Se \\(U = \text{span}\left(\begin{bmatrix} 1 \\ 2 \end{bmatrix}\right) \subset \mathbb{R}^2\\), seu complemento ortogonal é \\(U^\perp = \text{span}\left(\begin{bmatrix} -2 \\ 1 \end{bmatrix}\right)\\), pois \\(\begin{bmatrix} 1 \\ 2 \end{bmatrix}^\top \begin{bmatrix} -2 \\ 1 \end{bmatrix} = 0\\).

* **(d) Aplicação nos Modelos (ML):**
  O vetor normal \\(\boldsymbol{w}\\) define a orientação e a inclinação de hiperplanos separadores em algoritmos de **Classificação (SVM)** (\\(\langle \boldsymbol{w}, \boldsymbol{x} \rangle + b = 0\\)). O erro de aproximação do PCA reside inteiramente no complemento ortogonal.

* **(e) Fórmulas Relevantes:**
  * \\(U \cap U^\perp = \{\boldsymbol{0}\}\\) e \\(\dim(U) + \dim(U^\perp) = D\\)
  * Decomposição única: \\(\boldsymbol{x} = \boldsymbol{x}_U + \boldsymbol{x}_{U^\perp}\\) com \\(\boldsymbol{x}_U \in U, \boldsymbol{x}_{U^\perp} \in U^\perp\\)

---

## mml-3.7 — Produto Interno de Funções (Inner Product of Functions)

* **(a) Definição Formal e Notação Exata:**
  Para duas funções contínuas \\(u, v : \mathbb{R} \to \mathbb{R}\\), o produto interno em um intervalo \\([a, b]\\) é definido pela integral definida:
  \\[\langle u, v \rangle := \int_a^b u(x)v(x) \, dx\\].
  Se a integral for igual a 0, as funções \\(u\\) e \\(v\\) são **ortogonais**.

* **(b) Intuição Geométrica:**
  Generaliza a soma de produtos elemento a elemento do produto escalar de vetores discretos (\\(\sum x_i y_i\\)) para vetores contínuos com infinitos componentes, substituindo o somatório por uma integral.

* **(c) Exemplo Numérico / Conceitual:**
  Para \\(u(x) = \sin(x)\\) e \\(v(x) = \cos(x)\\) no intervalo \\([-\pi, \pi]\\):
  \\[\langle u, v \rangle = \int_{-\pi}^\pi \sin(x)\cos(x) \, dx = 0\\]
  Como o integrando \\(f(x) = \sin(x)\cos(x)\\) é uma função ímpar, o resultado avalia para \\(0\\), demonstrando que as funções seno e cosseno são ortogonais.

* **(d) Aplicação nos Modelos (ML):**
  Pilar teórico de séries de Fourier, Processos Gaussianos e métodos Kernel em aprendizado não-linear.

* **(e) Fórmulas Relevantes:**
  * \\(\langle u, v \rangle = \int_a^b u(x)v(x) \, dx\\)

---

## mml-3.8 — Projeções Ortogonais (Orthogonal Projections)

* **(a) Definição Formal e Notação Exata:**
  1. **Projeção em Subespaço 1D (Reta):** Projetar \\(\boldsymbol{x} \in \mathbb{R}^n\\) em \\(U = \text{span}[\boldsymbol{b}]\\) busca \\(\pi_U(\boldsymbol{x}) = \lambda \boldsymbol{b}\\) com coordenada \\(\lambda = \frac{\boldsymbol{b}^\top \boldsymbol{x}}{\|\boldsymbol{b}\|^2}\\). A matriz de projeção é \\(\boldsymbol{P}_\pi = \frac{\boldsymbol{b}\boldsymbol{b}^\top}{\|\boldsymbol{b}\|^2}\\).
  2. **Projeção em Subespaço de Dimensão \\(M\\):** Para \\(U = \text{span}[\boldsymbol{b}_1, \dots, \boldsymbol{b}_M]\\) dado por colunas de \\(\boldsymbol{B} \in \mathbb{R}^{n \times M}\\), a projeção é \\(\pi_U(\boldsymbol{x}) = \boldsymbol{B}\boldsymbol{\lambda}\\). As coordenadas \\(\boldsymbol{\lambda}\\) satisfazem as **Equações Normais**:
     \\[\boldsymbol{B}^\top \boldsymbol{B} \boldsymbol{\lambda} = \boldsymbol{B}^\top \boldsymbol{x} \implies \boldsymbol{\lambda} = (\boldsymbol{B}^\top \boldsymbol{B})^{-1}\boldsymbol{B}^\top \boldsymbol{x}\\].
     A matriz de projeção é \\(\boldsymbol{P}_\pi = \boldsymbol{B}(\boldsymbol{B}^\top \boldsymbol{B})^{-1}\boldsymbol{B}^\top\\).
  3. **Projeção em Subespaço Afim \\(L = \boldsymbol{x}_0 + U\\):**
     \\[\pi_L(\boldsymbol{x}) = \boldsymbol{x}_0 + \pi_U(\boldsymbol{x} - \boldsymbol{x}_0)\\].
  4. **Ortogonalização de Gram-Schmidt:** Processo iterativo para transformar uma base \\((\boldsymbol{b}_1, \dots, \boldsymbol{b}_n)\\) em uma base ortogonal \\((\boldsymbol{u}_1, \dots, \boldsymbol{u}_n)\\), onde \\(\boldsymbol{u}_1 := \boldsymbol{b}_1\\) e \\(\boldsymbol{u}_k := \boldsymbol{b}_k - \pi_{\text{span}[\boldsymbol{u}_1, \dots, \boldsymbol{u}_{k-1}]}(\boldsymbol{b}_k)\\).

* **(b) Intuição Geométrica:**
  Encontra o ponto \\(\pi_U(\boldsymbol{x})\\) contido no subespaço \\(U\\) que está mais próximo de \\(\boldsymbol{x}\\), minimizando a distância \\(\|\boldsymbol{x} - \pi_U(\boldsymbol{x})\|\\). O vetor erro de projeção \\((\boldsymbol{x} - \pi_U(\boldsymbol{x}))\\) forma um ângulo reto (\\(90^\circ\\)) com qualquer vetor contido no subespaço \\(U\\).

* **(c) Exemplo Numérico em 2D:**
  Dada a reta gerada por \\(\boldsymbol{b} = \begin{bmatrix} 2 \\ 0 \end{bmatrix}\\) e o ponto \\(\boldsymbol{x} = \begin{bmatrix} 1 \\ 1 \end{bmatrix}\\):
  \\(\lambda = \frac{\boldsymbol{b}^\top \boldsymbol{x}}{\boldsymbol{b}^\top \boldsymbol{b}} = \frac{2(1)+0(1)}{2^2+0^2} = \frac{2}{4} = 0,5\\).
  Ponto projetado: \\(\pi_U(\boldsymbol{x}) = 0,5 \begin{bmatrix} 2 \\ 0 \end{bmatrix} = \begin{bmatrix} 1 \\ 0 \end{bmatrix}\\).
  Matriz de projeção: \\(\boldsymbol{P}_\pi = \frac{1}{4}\begin{bmatrix} 2 \\ 0 \end{bmatrix}\begin{bmatrix} 2 & 0 \end{bmatrix} = \begin{bmatrix} 1 & 0 \\ 0 & 0 \end{bmatrix}\\).

* **(d) Aplicação nos Modelos (ML):**
  * **Regressão Linear (MLE):** A solução clássica de Mínimos Quadrados \\(\boldsymbol{\theta}_{\text{ML}} = (\boldsymbol{\Phi}^\top \boldsymbol{\Phi})^{-1}\boldsymbol{\Phi}^\top \boldsymbol{y}\\) realiza exatamente uma projeção ortogonal do vetor de observações \\(\boldsymbol{y}\\) sobre o subespaço gerado pelas colunas da matriz de características \\(\boldsymbol{\Phi}\\).
  * **PCA:** Projeta dados de alta dimensão sobre o subespaço principal minimizando a perda de compressão quadrática.

* **(e) Fórmulas Relevantes:**
  * Projeção 1D: \\(\pi_U(\boldsymbol{x}) = \frac{\boldsymbol{b}^\top \boldsymbol{x}}{\|\boldsymbol{b}\|^2}\boldsymbol{b}\\)
  * Equações Normais: \\(\boldsymbol{B}^\top \boldsymbol{B} \boldsymbol{\lambda} = \boldsymbol{B}^\top \boldsymbol{x}\\)
  * Pseudo-inversa: \\((\boldsymbol{B}^\top \boldsymbol{B})^{-1}\boldsymbol{B}^\top\\)
  * Matriz de Projeção \\(M\\)-dimensional: \\(\boldsymbol{P}_\pi = \boldsymbol{B}(\boldsymbol{B}^\top \boldsymbol{B})^{-1}\boldsymbol{B}^\top\\)
  * Projeção Afim: \\(\pi_L(\boldsymbol{x}) = \boldsymbol{x}_0 + \pi_U(\boldsymbol{x} - \boldsymbol{x}_0)\\)

---

## mml-3.9 — Rotações (Rotations)

* **(a) Definição Formal e Notação Exata:**
  Uma **rotação em \\(\mathbb{R}^2\\)** por um ângulo \\(\theta\\) (no sentido anti-horário) é representada pela matriz de transformação:
  \\[\boldsymbol{R}(\theta) = \begin{bmatrix} \cos \theta & -\sin \theta \\ \sin \theta & \cos \theta \end{bmatrix} \in \mathbb{R}^{2 \times 2}\\].
  Em \\(\mathbb{R}^n\\), a **Rotação de Givens** \\(\boldsymbol{R}_{ij}(\theta)\\) rotaciona um plano bidimensional \\(ij\\) fixando as outras \\(n-2\\) dimensões.

* **(b) Intuição Geométrica:**
  Gira os vetores em torno da origem fixada sem alterar suas formas ou tamanhos. Preserva distâncias (\\(\|\boldsymbol{R}\boldsymbol{x} - \boldsymbol{R}\boldsymbol{y}\| = \|\boldsymbol{x} - \boldsymbol{y}\|\\)) e ângulos entre vetores.

* **(c) Exemplo Numérico em 2D:**
  Rotacionar \\(\boldsymbol{x} = \begin{bmatrix} 1 \\ 0 \end{bmatrix}\\) por \\(\theta = 90^\circ\\) (\\(\pi/2\\)):
  \\[\boldsymbol{R}(\pi/2) \boldsymbol{x} = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix} \begin{bmatrix} 1 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ 1 \end{bmatrix}\\].

* **(d) Aplicação nos Modelos (ML):**
  Forma o componente central das mudanças de base em algoritmos de decomposição matricial, como a Decomposição em Valores Singulares (**SVD**) e a Diagonalização por Autovetores, permitindo alinhar os eixos dos dados com as direções de maior variância.

* **(e) Fórmulas Relevantes:**
  * \\(\boldsymbol{R}(\theta) = \begin{bmatrix} \cos \theta & -\sin \theta \\ \sin \theta & \cos \theta \end{bmatrix}\\)
  * Preservação de distância: \\(\|\boldsymbol{R}\boldsymbol{x} - \boldsymbol{R}\boldsymbol{y}\| = \|\boldsymbol{x} - \boldsymbol{y}\|\\)
  