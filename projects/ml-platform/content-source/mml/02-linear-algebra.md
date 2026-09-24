## mml-2.1 — Sistemas de Equações Lineares e Representação Matricial

* **(a) Definições Formais e Notação Exata:**
  * **Sistema de Equações Lineares:** Um sistema de \\(m\\) equações lineares com \\(n\\) incógnitas \\(x_1, \dots, x_n\\) é expresso por:
    \\[\sum_{j=1}^n a_{ij}x_j = b_i, \quad i = 1, \dots, m \quad\\]
  * **Matriz (Definição 2.1):** Uma matriz real \\((m, n)\\) é uma \\(m \cdot n\\)-tupla ordenada de elementos \\(a_{ij} \in \mathbb{R}\\) arranjados em \\(m\\) linhas e \\(n\\) colunas:
    \\[\boldsymbol{A} = \begin{bmatrix} a_{11} & a_{12} & \dots & a_{1n} \\ a_{21} & a_{22} & \dots & a_{2n} \\ \vdots & \dots & \ddots & \vdots \\ a_{m1} & a_{m2} & \dots & a_{mn} \end{bmatrix} \in \mathbb{R}^{m \times n} \quad\\]
  * **Forma Compacta:** O sistema é escrito como \\(\boldsymbol{A}\boldsymbol{x} = \boldsymbol{b}\\), onde \\(\boldsymbol{x} \in \mathbb{R}^n\\) e \\(\boldsymbol{b} \in \mathbb{R}^m\\).
* **(b) Intuição Geométrica:**
  Em \\(\mathbb{R}^2\\), cada equação linear em duas variáveis \\(x_1, x_2\\) representa uma **reta no plano**. O conjunto solução do sistema representa a **interseção** dessas retas. O sistema pode ter exatamente uma solução (retas concorrentes), infinitas soluções (retas coincidentes) ou nenhuma solução (retas paralelas).
* **(c) Exemplo Numérico em 2D:**
  Considere o sistema de duas equações:
  \\[\begin{cases} 2x_1 - 4x_2 = 1 \\ 4x_1 + 4x_2 = 5 \end{cases}\\]
  Geometricamente, representa o cruzamento de duas retas no plano no único ponto de interseção \\((x_1, x_2) = (1, 1/2)\\).
* **(d) Aplicação nos Modelos (Regressão Linear / ML):**
  Na **Regressão Linear**, os dados de entrada e alvos são organizados na forma matricial \\(\boldsymbol{X}\boldsymbol{\theta} = \boldsymbol{y}\\). Quando o sistema não possui solução exata (inconsistente devido ao ruído nas medições), a regressão linear resolve o problema de mínimos quadrados para encontrar os parâmetros ideais \\(\boldsymbol{\theta}\\).
* **(e) Fórmulas Relevantes:**
  * Multiplicação de matrizes: \\(c_{ij} = \sum_{l=1}^n a_{il}b_{lj}\\) para \\(\boldsymbol{C} = \boldsymbol{A}\boldsymbol{B} \in \mathbb{R}^{m \times k}\\) com \\(\boldsymbol{A} \in \mathbb{R}^{m \times n}, \boldsymbol{B} \in \mathbb{R}^{n \times k}\\).
  * Representação compacta do sistema: \\(\boldsymbol{A}\boldsymbol{x} = \boldsymbol{b}\\).

---

## mml-2.3 — Inversa, Transposta e Eliminação Gaussiana

* **(a) Definições Formais e Notação Exata:**
  * **Inversa de uma Matriz (Definição 2.3):** Para uma matriz quadrada \\(\boldsymbol{A} \in \mathbb{R}^{n \times n}\\), se existir \\(\boldsymbol{B} \in \mathbb{R}^{n \times n}\\) tal que \\(\boldsymbol{A}\boldsymbol{B} = \boldsymbol{I}_n = \boldsymbol{B}\boldsymbol{A}\\), então \\(\boldsymbol{B}\\) é a inversa de \\(\boldsymbol{A}\\), denotada por \\(\boldsymbol{A}^{-1}\\).
  * **Transposta:** A transposta de \\(\boldsymbol{A} \in \mathbb{R}^{m \times n}\\) é \\(\boldsymbol{A}^\top \in \mathbb{R}^{n \times m}\\), onde \\(a_{ij}^\top = a_{ji}\\).
  * **Matriz Simétrica (Definição 2.5):** Uma matriz quadrada é simétrica se \\(\boldsymbol{A} = \boldsymbol{A}^\top\\).
  * **Eliminação Gaussiana:** Algoritmo que aplica **operações elementares de linha** na matriz aumentada \\([\boldsymbol{A} \,|\, \boldsymbol{b}]\\) para transformá-la na forma escalonada por linhas (REF/RREF) sem alterar o conjunto solução.
* **(b) Intuição Geométrica:**
  A matriz inversa \\(\boldsymbol{A}^{-1}\\) realiza o processo geométrico oposto de \\(\boldsymbol{A}\\), "desfazendo" a transformação linear espacial. A eliminação Gaussiana preserva o ponto ou espaço de interseção geométrico enquanto simplifica a descrição algébrica do sistema.
* **(c) Exemplo Numérico em 2D:**
  Para uma matriz \\(2 \times 2\\) geral \\(\boldsymbol{A} = \begin{bmatrix} a_{11} & a_{12} \\ a_{21} & a_{22} \end{bmatrix}\\), a inversa é dada por:
  \\[\boldsymbol{A}^{-1} = \frac{1}{a_{11}a_{22} - a_{12}a_{21}} \begin{bmatrix} a_{22} & -a_{12} \\ -a_{21} & a_{11} \end{bmatrix}\\]
  se e somente se o determinante \\(a_{11}a_{22} - a_{12}a_{21} \neq 0\\).
* **(d) Aplicação nos Modelos:**
  * **Regressão Linear:** A solução analítica de Mínimos Quadrados utiliza a **Pseudo-inversa de Moore-Penrose**: \\(\boldsymbol{\theta} = (\boldsymbol{X}^\top\boldsymbol{X})^{-1}\boldsymbol{X}^\top\boldsymbol{y}\\).
  * **GMM e Classificação:** As matrizes de covariância \\(\boldsymbol{\Sigma}\\) são matrizes quadradas simétricas (\\(\boldsymbol{\Sigma} = \boldsymbol{\Sigma}^\top\\)) que precisam ser invertidas no cálculo de densidades gaussianas.
* **(e) Fórmulas Relevantes:**
  * Inversa do produto: \\((\boldsymbol{A}\boldsymbol{B})^{-1} = \boldsymbol{B}^{-1}\boldsymbol{A}^{-1}\\).
  * Transposta do produto: \\((\boldsymbol{A}\boldsymbol{B})^\top = \boldsymbol{B}^\top\boldsymbol{A}^\top\\).
  * Solução da Pseudo-inversa: \\(\boldsymbol{x} = (\boldsymbol{A}^\top\boldsymbol{A})^{-1}\boldsymbol{A}^\top\boldsymbol{b}\\).

---

## mml-2.4 — Espaços Vetoriais e Subespaços

* **(a) Definições Formais e Notação Exata:**
  * **Espaço Vetorial:** Estrutura \\(V = (V, +, \cdot)\\) composta por um conjunto \\(V\\) e duas operações (adição \\(+: V \times V \to V\\) e multiplicação escalar \\(\cdot: \mathbb{R} \times V \to V\\)) que satisfazem as propriedades de grupo abeliano sob adição e distributividade/associatividade sob multiplicação escalar.
  * **Subespaço Vetorial (Seção 2.4.3):** Um subconjunto \\(U \subseteq V\\) é um subespaço de \\(V\\) se \\(U \neq \emptyset\\) e \\(U\\) for fechado sob adição e multiplicação por escalar (ou seja, \\(\mathbf{0} \in U\\) e \\(\forall \boldsymbol{x}, \boldsymbol{y} \in U, \lambda, \psi \in \mathbb{R} \implies \lambda\boldsymbol{x} + \psi\boldsymbol{y} \in U\\)).
* **(b) Intuição Geométrica:**
  O espaço vetorial \\(\mathbb{R}^2\\) representa todo o plano 2D centrado na origem \\((0,0)\\). Um **subespaço vetorial** em \\(\mathbb{R}^2\\) só pode ser: o ponto de origem \\(\{\mathbf{0}\}\\), qualquer reta que passe necessariamente pela origem, ou todo o plano \\(\mathbb{R}^2\\). A propriedade de **fechamento** garante que operações vetoriais nunca saem do subespaço.
* **(c) Exemplo Numérico em 2D:**
  O conjunto de pontos \\(U = \left\{ \boldsymbol{x} \in \mathbb{R}^2 : x_2 = 3x_1 \right\} = \text{span}\left(\begin{bmatrix} 1 \\ 3 \end{bmatrix}\right)\\) forma uma reta passando pela origem em \\(\mathbb{R}^2\\), constituindo um subespaço vetorial válido.
* **(d) Aplicação nos Modelos:**
  Os dados de entrada são representados como vetores pertencentes ao espaço vetorial \\(\mathbb{R}^D\\). Em técnicas de redução de dimensionalidade (como PCA e Autoencoders), busca-se encontrar um subespaço vetorial de menor dimensão que capture a maior parte da estrutura dos dados.
* **(e) Fórmulas Relevantes:**
  * Adição em \\(\mathbb{R}^n\\): \\(\boldsymbol{x} + \boldsymbol{y} = (x_1 + y_1, \dots, x_n + y_n)^\top\\).
  * Multiplicação escalar em \\(\mathbb{R}^n\\): \\(\lambda \boldsymbol{x} = (\lambda x_1, \dots, \lambda x_n)^\top\\).

---

## mml-2.5 — Combinação Linear e Independência Linear

* **(a) Definições Formais e Notação Exata:**
  * **Combinação Linear:** Para vetores \\(\boldsymbol{x}_1, \dots, \boldsymbol{x}_k \in V\\) e escalares \\(\lambda_1, \dots, \lambda_k \in \mathbb{R}\\), o vetor \\(\boldsymbol{v} = \sum_{i=1}^k \lambda_i \boldsymbol{x}_i\\) é uma combinação linear.
  * **Independência Linear (Seção 2.5):** Os vetores \\(\{\boldsymbol{x}_1, \dots, \boldsymbol{x}_k\}\\) são **linearmente independentes** se a equação:
    \\[\sum_{i=1}^k \lambda_i \boldsymbol{x}_i = \mathbf{0}\\]
    tiver como única solução os escalares triviais \\(\lambda_1 = \lambda_2 = \dots = \lambda_k = 0\\). Se existir algum \\(\lambda_i \neq 0\\), eles são **linearmente dependentes**.
* **(b) Intuição Geométrica:**
  Dois vetores em \\(\mathbb{R}^2\\) são linearmente independentes se apontam para direções não colineares (não estão na mesma reta); juntos, eles cobrem (*span*) todo o plano 2D. O livro ilustra com um exemplo geográfico: descrever a localização de Kigali a partir de Nairóbi combinando "506 km a Noroeste" e "374 km a Sudoeste" é suficiente; adicionar "751 km a Oeste" é uma informação redundante (combinação linear das anteriores), tornando o conjunto de três vetores linearmente dependente.
* **(c) Exemplo Numérico em 2D:**
  Os vetores \\(\boldsymbol{x}_1 = \begin{bmatrix} 1 \\ 0 \end{bmatrix}\\) e \\(\boldsymbol{x}_2 = \begin{bmatrix} 0 \\ 1 \end{bmatrix}\\) são linearmente independentes. Adicionar o vetor \\(\boldsymbol{x}_3 = \begin{bmatrix} 2 \\ 3 \end{bmatrix} = 2\boldsymbol{x}_1 + 3\boldsymbol{x}_2\\) cria um conjunto linearmente dependente.
* **(d) Aplicação nos Modelos:**
  Garante a ausência de multicolinearidade perfeita na matriz de dados de entrada \\(\boldsymbol{X}\\). Para que a matriz \\(\boldsymbol{X}^\top\boldsymbol{X}\\) da Regressão Linear seja invertível, suas colunas (recursos/features) precisam ser linearmente independentes.
* **(e) Fórmulas Relevantes:**
  * Teste de independência linear: \\(\sum_{i=1}^k \lambda_i \boldsymbol{x}_i = \mathbf{0} \iff \lambda_1 = \dots = \lambda_k = 0\\).

---

## mml-2.6 — Base e Posto (Rank)

* **(a) Definições Formais e Notação Exata:**
  * **Base (Seção 2.6.1):** Um conjunto ordenado \\(B = (\boldsymbol{b}_1, \dots, \boldsymbol{b}_n)\\) de vetores de \\(V\\) é uma **base** de \\(V\\) se for linearmente independente e gerar \\(V\\) (\\(\text{span}[B] = V\\)). A cardinalidade da base determina a dimensão \\(\dim(V) = n\\).
  * **Posto/Rank (Seção 2.6.2):** O **posto de uma matriz** \\(\boldsymbol{A} \in \mathbb{R}^{m \times n}\\), denotado por \\(\text{rk}(\boldsymbol{A})\\), é o número máximo de colunas (ou linhas) linearmente independentes. Se \\(\text{rk}(\boldsymbol{A}) = \min(m, n)\\), diz-se que a matriz tem **posto cheio** (*full rank*).
* **(b) Intuição Geométrica:**
  A base define um sistema de coordenadas completo no espaço. O posto de uma matriz de transformação representa a dimensão do espaço transformado gerado por suas colunas (o quanto a transformação preserva ou achata o espaço original).
* **(c) Exemplo Numérico em 2D:**
  A base canônica de \\(\mathbb{R}^2\\) é dada por \\(B = \left( \begin{bmatrix} 1 \\ 0 \end{bmatrix}, \begin{bmatrix} 0 \\ 1 \end{bmatrix} \right)\\). A matriz \\(\boldsymbol{A} = \begin{bmatrix} 1 & 2 \\ 2 & 4 \end{bmatrix}\\) possui posto \\(\text{rk}(\boldsymbol{A}) = 1\\) (as colunas são colineares), o que significa que ela achata todo o plano \\(\mathbb{R}^2\\) transformando-o em uma única reta de dimensão 1.
* **(d) Aplicação nos Modelos:**
  Determina a invertibilidade das matrizes nos algoritmos de treino. Na Regressão Linear com matriz de características \\(\boldsymbol{\Phi} \in \mathbb{R}^{N \times K}\\), a matriz \\(\boldsymbol{\Phi}^\top\boldsymbol{\Phi}\\) é invertível se e somente se \\(\text{rk}(\boldsymbol{\Phi}) = K\\) (posto cheio nas colunas).
* **(e) Fórmulas Relevantes:**
  * Propriedade do posto: \\(\text{rk}(\boldsymbol{A}) \le \min(m, n)\\) para \\(\boldsymbol{A} \in \mathbb{R}^{m \times n}\\).

---

## mml-2.7 — Mapeamentos Lineares e Mudança de Base

* **(a) Definições Formais e Notação Exata:**
  * **Mapeamento Linear (Definição 2.15):** Uma função \\(\Phi: V \to W\\) entre espaços vetoriais é uma **transformação linear** se preserva a estrutura vetorial:
    \\[\forall \boldsymbol{x}, \boldsymbol{y} \in V, \, \forall \lambda, \psi \in \mathbb{R}: \Phi(\lambda \boldsymbol{x} + \psi \boldsymbol{y}) = \lambda \Phi(\boldsymbol{x}) + \psi \Phi(\boldsymbol{y}) \quad\\]
  * **Matriz de Transformação (Definição 2.19):** Dadas as bases ordenadas \\(B = (\boldsymbol{b}_1, \dots, \boldsymbol{b}_n)\\) de \\(V\\) e \\(C = (\boldsymbol{c}_1, \dots, \boldsymbol{c}_m)\\) de \\(W\\), a matriz \\(\boldsymbol{A}_\Phi \in \mathbb{R}^{m \times n}\\) representa \\(\Phi\\) se a \\(j\\)-ésima coluna contiver as coordenadas de \\(\Phi(\boldsymbol{b}_j)\\) em relação à base \\(C\\), satisfazendo \\(\hat{\boldsymbol{y}} = \boldsymbol{A}_\Phi \hat{\boldsymbol{x}}\\).
  * **Mudança de Base (Teorema 2.20):** Para novas bases \\(\tilde{B}\\) de \\(V\\) e \\(\tilde{C}\\) de \\(W\\):
    \\[\tilde{\boldsymbol{A}}_\Phi = \boldsymbol{T}^{-1} \boldsymbol{A}_\Phi \boldsymbol{S} \quad\\]
* **(b) Intuição Geométrica:**
  Uma transformação linear altera a grade do espaço vetorial (aplicando rotações, escalonamentos, cisalhamentos ou reflexões), mantendo a origem fixa e as linhas da grade paralelas e igualmente espaçadas. Mudar a base equivale a alterar a "perspectiva" ou os eixos do sistema de coordenadas usados para descrever o mesmo ponto geométrico no espaço.
* **(c) Exemplo Numérico em 2D:**
  * Rotação de \\(45^\circ\\) (\\(\pi/4\\)) em \\(\mathbb{R}^2\\):
    \\[\boldsymbol{A}_1 = \begin{bmatrix} \cos(\pi/4) & -\sin(\pi/4) \\ \sin(\pi/4) & \cos(\pi/4) \end{bmatrix} = \frac{1}{\sqrt{2}}\begin{bmatrix} 1 & -1 \\ 1 & 1 \end{bmatrix} \quad\\]
  * O vetor \\(\boldsymbol{x} = \begin{bmatrix} 2 \\ 3 \end{bmatrix}\\) na base canônica \\((e_1, e_2)\\) possui coordenadas \\(\frac{1}{2}\begin{bmatrix} -1 \\ 5 \end{bmatrix}\\) quando representado na base \\(\boldsymbol{b}_1 = \begin{bmatrix} 1 \\ -1 \end{bmatrix}, \boldsymbol{b}_2 = \begin{bmatrix} 1 \\ 1 \end{bmatrix}\\).
* **(d) Aplicação nos Modelos:**
  * **Regressão Linear e Redes Neurais:** As camadas e pesos operam como transformações lineares das entradas (\\(\boldsymbol{y} = \boldsymbol{A}\boldsymbol{x}\\)).
  * **Redução de Dimensionalidade (PCA):** A mudança de base é usada para encontrar um novo sistema de coordenadas ordenado pelas direções de maior variância (diagonalizando a matriz de transformação).
* **(e) Fórmulas Relevantes:**
  * Condição de linearidade: \\(\Phi(\lambda \boldsymbol{x} + \psi \boldsymbol{y}) = \lambda \Phi(\boldsymbol{x}) + \psi \Phi(\boldsymbol{y})\\).
  * Mapeamento de coordenadas: \\(\hat{\boldsymbol{y}} = \boldsymbol{A}_\Phi \hat{\boldsymbol{x}}\\).
  * Relação de mudança de base: \\(\tilde{\boldsymbol{A}}_\Phi = \boldsymbol{T}^{-1}\boldsymbol{A}_\Phi \boldsymbol{S}\\).

---

## mml-2.7.1 — Imagem (Range) e Núcleo (Kernel / Null Space)

* **(a) Definições Formais e Notação Exata:**
  Para uma transformação linear \\(\Phi: V \to W\\):
  * **Núcleo / Null Space (Definição 2.23):**
    \\[\text{ker}(\Phi) := \Phi^{-1}(\mathbf{0}_W) = \{\boldsymbol{v} \in V : \Phi(\boldsymbol{v}) = \mathbf{0}_W\} \quad\\]
  * **Imagem / Range (Definição 2.23):**
    \\[\text{Im}(\Phi) := \Phi(V) = \{\boldsymbol{w} \in W : \exists \boldsymbol{v} \in V, \, \Phi(\boldsymbol{v}) = \boldsymbol{w}\} \quad\\]
  * **Teorema do Posto-Nulidade (Rank-Nullity Theorem / Teorema 2.24):**
    \\[\dim(\text{ker}(\Phi)) + \dim(\text{Im}(\Phi)) = \dim(V) \quad\\]
* **(b) Intuição Geométrica:**
  * O **Núcleo** \\(\text{ker}(\Phi)\\) representa o subespaço em \\(V\\) que é "colapsado" totalmente no ponto de origem \\(\mathbf{0}_W\\) do contradomínio.
  * A **Imagem** \\(\text{Im}(\Phi)\\) é o subespaço dentro de \\(W\\) contendo todos os pontos que podem ser "alcançados" a partir do domínio \\(V\\).
* **(c) Exemplo Numérico em 2D:**
  Dada a transformação \\(\Phi: \mathbb{R}^2 \to \mathbb{R}^2\\) com matriz \\(\boldsymbol{A} = \begin{bmatrix} 1 & 0 \\ 0 & 0 \end{bmatrix}\\):
  * \\(\text{Im}(\Phi) = \text{span}\left(\begin{bmatrix} 1 \\ 0 \end{bmatrix}\right)\\) (linha horizontal do eixo \\(x_1\\), dimensão 1).
  * \\(\text{ker}(\Phi) = \text{span}\left(\begin{bmatrix} 0 \\ 1 \end{bmatrix}\right)\\) (eixo vertical \\(x_2\\), dimensão 1, pois todo \\((0, x_2)\\) se torna \\((0,0)\\)).
  * Pelo Teorema do Posto-Nulidade: \\(\dim(\text{ker}) + \dim(\text{Im}) = 1 + 1 = 2 = \dim(\mathbb{R}^2)\\).
* **(d) Aplicação nos Modelos:**
  O núcleo de uma matriz de dados indica direções nas quais as variações das entradas são completamente anuladas (perda de informação). O Teorema do Posto-Nulidade é a base matemática para analisar a solubilidade e a singularidade de sistemas homogêneos \\(\boldsymbol{A}\boldsymbol{x} = \mathbf{0}\\) na otimização de modelos.
* **(e) Fórmulas Relevantes:**
  * Teorema do Posto-Nulidade: \\(\dim(\text{ker}(\Phi)) + \dim(\text{Im}(\Phi)) = \dim(V)\\).
  * Critério de Injetividade: \\(\Phi\\) é injetiva \\(\iff \text{ker}(\Phi) = \{\mathbf{0}_V\}\\).

---

## mml-2.8 — Espaços e Mapeamentos Afins

* **(a) Definições Formais e Notação Exata:**
  * **Subespaço Afim (Definição 2.25):** Seja \\(V\\) um espaço vetorial, \\(\boldsymbol{x}_0 \in V\\) e \\(U \subseteq V\\) um subespaço vetorial. O conjunto:
    \\[L = \boldsymbol{x}_0 + U = \{\boldsymbol{x}_0 + \boldsymbol{u} : \boldsymbol{u} \in U\} \quad\\]
    é um **subespaço afim** de \\(V\\). O vetor \\(\boldsymbol{x}_0\\) é o ponto de suporte (*support point*) e \\(U\\) é o espaço de direção (*direction space*).
  * **Mapeamento Afim (Definição 2.26):** Uma função \\(\phi: V \to W\\) composta por uma transformação linear \\(\Phi: V \to W\\) e uma translação por \\(\boldsymbol{a} \in W\\):
    \\[\phi(\boldsymbol{x}) = \boldsymbol{a} + \Phi(\boldsymbol{x}) \quad\\]
* **(b) Intuição Geométrica:**
  Um espaço afim é um subespaço vetorial retilíneo que foi **deslocado para fora da origem**.
  * Linha afim em 1D: Reta deslocada que não precisa passar por \\((0,0)\\) (\\(\boldsymbol{y} = \boldsymbol{x}_0 + \lambda \boldsymbol{b}_1\\)).
  * Plano afim em 2D: Plano deslocado na direção de dois vetores (\\(\boldsymbol{y} = \boldsymbol{x}_0 + \lambda_1 \boldsymbol{b}_1 + \lambda_2 \boldsymbol{b}_2\\)).
  * Hiperplano afim: Subespaço afim de dimensão \\((n-1)\\) em \\(\mathbb{R}^n\\).
* **(c) Exemplo Numérico em 2D:**
  Em \\(\mathbb{R}^2\\), a reta \\(x_2 = 2x_1 + 3\\) é um subespaço afim unidimensional. Ela é representada por \\(L = \boldsymbol{x}_0 + U\\), onde \\(\boldsymbol{x}_0 = \begin{bmatrix} 0 \\ 3 \end{bmatrix}\\) (ponto onde cruza o eixo \\(y\\)) e \\(U = \text{span}\left(\begin{bmatrix} 1 \\ 2 \end{bmatrix}\right)\\) é o subespaço vetorial de direção.
* **(d) Aplicação nos Modelos:**
  * **Regressão Linear:** O preditor padrão \\(f(\boldsymbol{x}) = \boldsymbol{\theta}^\top \boldsymbol{x} + \theta_0\\) é um mapeamento afim (onde \\(\theta_0\\) é o termo de intercepto/bias de translação).
  * **Classificação (SVM):** O hiperplano separador de classes \\(\{\boldsymbol{x} \in \mathbb{R}^D : \langle \boldsymbol{w}, \boldsymbol{x} \rangle + b = 0\}\\) é um hiperplano afim.
* **(e) Fórmulas Relevantes:**
  * Equação paramétrica afim: \\(\boldsymbol{y} = \boldsymbol{x}_0 + \sum_{i=1}^{k} \lambda_i \boldsymbol{b}_i\\).
  * Mapeamento afim: \\(\phi(\boldsymbol{x}) = \boldsymbol{a} + \Phi(\boldsymbol{x})\\).