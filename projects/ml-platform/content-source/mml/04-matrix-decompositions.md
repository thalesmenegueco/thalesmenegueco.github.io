# mml-4 — Matrix Decompositions

## mml-4.1 — Determinante e Traço (Determinant and Trace)

* **(a) Definições Formais e Notação Exata:**
  * **Determinante (Seção 4.1):** O determinante é uma função que mapeia uma matriz quadrada \\(\boldsymbol{A} \in \mathbb{R}^{n \times n}\\) para um escalar real, denotado por \\(\det(\boldsymbol{A})\\) ou \\(|\boldsymbol{A}|\\).
    * Para matrizes \\(2 \times 2\\): \\(\det\left(\begin{bmatrix} a_{11} & a_{12} \\ a_{21} & a_{22} \end{bmatrix}\right) = a_{11}a_{22} - a_{12}a_{21}\\).
    * Para matrizes triangulares \\(\boldsymbol{T} \in \mathbb{R}^{n \times n}\\): \\(\det(\boldsymbol{T}) = \prod_{i=1}^n T_{ii}\\).
    * **Expansão de Laplace (Geral \\(n \times n\\)):** Expansão ao longo da \\(i\\)-ésima linha:
      \\[\det(\boldsymbol{A}) = \sum_{j=1}^n (-1)^{i+j} a_{ij} \det(\boldsymbol{A}_{i, \setminus j})\\]
      onde \\(\boldsymbol{A}_{i, \setminus j} \in \mathbb{R}^{(n-1) \times (n-1)}\\) é a submatriz obtida removendo a linha \\(i\\) e a coluna \\(j\\).
    * **Teorema de Invertibilidade (Teorema 4.3):** \\(\det(\boldsymbol{A}) \neq 0 \iff \text{rk}(\boldsymbol{A}) = n\\) (isto é, \\(\boldsymbol{A}\\) possui posto cheio e é invertível).
  * **Traço (Definição 4.4):** O traço de uma matriz quadrada \\(\boldsymbol{A} \in \mathbb{R}^{n \times n}\\) é a soma de seus elementos diagonais:
    \\[\text{tr}(\boldsymbol{A}) := \sum_{i=1}^n a_{ii}\\]

* **(b) Intuição Geométrica:**
  * **Determinante:** Representa o **volume assinalado** (*signed volume*) do paralelepípedo \\(n\\)-dimensional gerado pelos vetores coluna da matriz \\(\boldsymbol{A}\\). O valor absoluto \\(|\det(\boldsymbol{A})|\\) mede a escala de variação de área/volume causada pela transformação linear \\(\boldsymbol{A}\\), e o sinal indica se a transformação preserva ou inverte a orientação do espaço.
  * **Traço:** É um invariante geométrico sob mudanças de base (\\(\text{tr}(\boldsymbol{S}^{-1}\boldsymbol{A}\boldsymbol{S}) = \text{tr}(\boldsymbol{A})\\)). Geometricamente, a soma dos valores próprios reflete a alteração do perímetro de um hipercubo unitário sob a transformação.

* **(c) Exemplo Numérico em 2D:**
  Dada a matriz \\(\boldsymbol{A} = \begin{bmatrix} 1 & 2 \\ 0 & 2 \end{bmatrix}\\):
  * Determinante: \\(\det(\boldsymbol{A}) = (1)(2) - (2)(0) = 2\\). O quadrado unitário no plano \\(2\text{D}\\) (área \\(= 1\\)) é transformado em um paralelogramo de área igual a \\(2\\).
  * Traço: \\(\text{tr}(\boldsymbol{A}) = 1 + 2 = 3\\).

* **(d) Aplicação nos Modelos (ML):**
  * **Gaussian Mixture Models (GMM) e Probabilidade:** O determinante \\(|\boldsymbol{\Sigma}|\\) da matriz de covariância aparece no denominador da função de densidade gaussiana multivariada \\(\mathcal{N}(\boldsymbol{x} \,|\, \boldsymbol{\mu}, \boldsymbol{\Sigma})\\) como fator de normalização de volume probabilístico.
  * **Mudança de Variáveis:** O determinante da matriz Jacobiana mede a mudança de volume local em transformações de distribuições contínuas.

* **(e) Fórmulas Relevantes:**
  * Expansão de Laplace: \\(\det(\boldsymbol{A}) = \sum_{j=1}^n (-1)^{i+j} a_{ij} \det(\boldsymbol{A}_{i, \setminus j})\\)
  * Permutação Cíclica do Traço: \\(\text{tr}(\boldsymbol{A}\boldsymbol{B}\boldsymbol{C}) = \text{tr}(\boldsymbol{C}\boldsymbol{A}\boldsymbol{B})\\)
  * Invariância sob Mudança de Base: \\(\text{tr}(\boldsymbol{B}) = \text{tr}(\boldsymbol{S}^{-1}\boldsymbol{A}\boldsymbol{S}) = \text{tr}(\boldsymbol{A})\\)
  * Polinômio Característico: \\(p_{\boldsymbol{A}}(\lambda) := \det(\boldsymbol{A} - \lambda \boldsymbol{I})\\)

---

## mml-4.2 — Autovalores e Autovetores (Eigenvalues and Eigenvectors)

* **(a) Definições Formais e Notação Exata:**
  * **Equação de Autovalor (Seção 4.2):** Seja \\(\boldsymbol{A} \in \mathbb{R}^{n \times n}\\). Um escalar \\(\lambda \in \mathbb{R}\\) (ou \\(\mathbb{C}\\)) e um vetor não-nulo \\(\boldsymbol{x} \in \mathbb{R}^n \setminus \{\boldsymbol{0}\}\\) satisfazem:
    \\[\boldsymbol{A}\boldsymbol{x} = \lambda \boldsymbol{x}\\]
    \\(\lambda\\) é um **autovalor** de \\(\boldsymbol{A}\\) e \\(\boldsymbol{x}\\) é seu **autovetor** correspondente.
  * **Subespaço Próprio / Eigenspace:** \\(E_\lambda = \text{ker}(\boldsymbol{A} - \lambda \boldsymbol{I})\\).
  * **Raízes do Polinômio Característico (Teorema 4.8):** \\(\lambda\\) é autovalor de \\(\boldsymbol{A} \iff \det(\boldsymbol{A} - \lambda \boldsymbol{I}) = 0\\).
  * **Matriz Defeituosa (Defective / Definição 4.13):** Uma matriz \\(\boldsymbol{A} \in \mathbb{R}^{n \times n}\\) é defeituosa se possui menos de \\(n\\) autovetores linearmente independentes (ou seja, a multiplicidade geométrica é estritamente menor que a algébrica).

* **(b) Intuição Geométrica:**
  Os autovetores definem **direções invariantes** da transformação linear \\(\boldsymbol{A}\\). Quando a transformação \\(\boldsymbol{A}\\) é aplicada a um autovetor \\(\boldsymbol{x}\\), a sua direção na reta não muda; ele é apenas escalado (esticado, comprimido ou invertido) pelo fator numérico dado pelo autovalor \\(\lambda\\).

* **(c) Exemplo Numérico em 2D:**
  Dada a matriz \\(\boldsymbol{A} = \begin{bmatrix} 4 & 2 \\ 1 & 3 \end{bmatrix}\\) (Exemplo 4.5):
  1. Polinômio característico: \\(\det(\boldsymbol{A} - \lambda \boldsymbol{I}) = (4-\lambda)(3-\lambda) - 2 = \lambda^2 - 7\lambda + 10 = (\lambda - 5)(\lambda - 2) = 0\\).
  2. Autovalores: \\(\lambda_1 = 5\\) e \\(\lambda_2 = 2\\).
  3. Autovetores: Para \\(\lambda_1 = 5 \implies \boldsymbol{x}_1 = \begin{bmatrix} 2 \\ 1 \end{bmatrix}\\); para \\(\lambda_2 = 2 \implies \boldsymbol{x}_2 = \begin{bmatrix} 1 \\ -1 \end{bmatrix}\\).

* **(d) Aplicação nos Modelos (ML):**
  * **Análise de Componentes Principais (PCA):** As direções de maior variância nos dados correspondem exatamente aos autovetores da matriz de covariância empírica dos dados \\(\boldsymbol{S}\\).
  * **PageRank do Google:** O vetor de relevância das páginas é o autovetor associado ao autovalor máximo \\(\lambda = 1\\) de uma matriz de transição estocástica.

* **(e) Fórmulas Relevantes:**
  * Equação de Autovalor: \\(\boldsymbol{A}\boldsymbol{x} = \lambda \boldsymbol{x}\\)
  * Equação Característica: \\(\det(\boldsymbol{A} - \lambda \boldsymbol{I}) = 0\\)
  * Determinante via Autovalores (Teorema 4.16): \\(\det(\boldsymbol{A}) = \prod_{i=1}^n \lambda_i\\)
  * Traço via Autovalores (Teorema 4.17): \\(\text{tr}(\boldsymbol{A}) = \sum_{i=1}^n \lambda_i\\)

---

## mml-4.3 — Decomposição de Cholesky (Cholesky Decomposition)

* **(a) Definição Formal e Notação Exata:**
  **Teorema de Cholesky (Seção 4.3):** Toda matriz simétrica e definida positiva (SPD) \\(\boldsymbol{A} \in \mathbb{R}^{n \times n}\\) pode ser fatorada de forma única como:
  \\[\boldsymbol{A} = \boldsymbol{L}\boldsymbol{L}^\top\\]
  onde \\(\boldsymbol{L} \in \mathbb{R}^{n \times n}\\) é uma **matriz triangular inferior** (*lower-triangular matrix*) com entradas diagonais estritamente positivas (\\(l_{ii} > 0\\)).

* **(b) Intuição Geométrica:**
  Funciona como uma operação de "raiz quadrada" adaptada para matrizes SPD (\\(\boldsymbol{A} = \boldsymbol{L}\boldsymbol{L}^\top \sim a = l \cdot l\\)). Ela descompõe um espaço de variância elíptica complexa em uma transformação linear triangular simples aplicada a um espaço com ruído esférico padrão.

* **(c) Exemplo Numérico em 2D:**
  Dada a matriz SPD \\(2 \times 2\\): \\(\boldsymbol{A} = \begin{bmatrix} 4 & 2 \\ 2 & 5 \end{bmatrix}\\):
  1. \\(l_{11} = \sqrt{a_{11}} = \sqrt{4} = 2\\).
  2. \\(l_{21} = \frac{a_{21}}{l_{11}} = \frac{2}{2} = 1\\).
  3. \\(l_{22} = \sqrt{a_{22} - l_{21}^2} = \sqrt{5 - 1^2} = \sqrt{4} = 2\\).
  
  Resultado: \\(\boldsymbol{L} = \begin{bmatrix} 2 & 0 \\ 1 & 2 \end{bmatrix}\\), verificando que \\(\boldsymbol{L}\boldsymbol{L}^\top = \begin{bmatrix} 2 & 0 \\ 1 & 2 \end{bmatrix}\begin{bmatrix} 2 & 1 \\ 0 & 2 \end{bmatrix} = \begin{bmatrix} 4 & 2 \\ 2 & 5 \end{bmatrix}\\).

* **(d) Aplicação nos Modelos (ML):**
  * **Amostragem em GMM e VAEs:** Permite reamostrar dados de uma Gaussiana multivariada \\(\mathcal{N}(\boldsymbol{\mu}, \boldsymbol{\Sigma})\\) transformando amostras isotrópicas \\(\boldsymbol{z} \sim \mathcal{N}(\mathbf{0}, \boldsymbol{I})\\) via \\(\boldsymbol{x} = \boldsymbol{\mu} + \boldsymbol{L}\boldsymbol{z}\\) (*reparametrization trick*).
  * **Cálculo Eficiente de Determinantes:** Como \\(\boldsymbol{L}\\) é triangular, \\(\det(\boldsymbol{A}) = \det(\boldsymbol{L})^2 = \left(\prod_{i=1}^n l_{ii}\right)^2\\).

* **(e) Fórmulas Relevantes:**
  * Fatoração de Cholesky: \\(\boldsymbol{A} = \boldsymbol{L}\boldsymbol{L}^\top\\)
  * Elementos diagonais: \\(l_{ii} = \sqrt{a_{ii} - \sum_{k=1}^{i-1} l_{ik}^2}\\)
  * Elementos fora da diagonal: \\(l_{ij} = \frac{1}{l_{jj}} \left( a_{ij} - \sum_{k=1}^{j-1} l_{ik}l_{jk} \right) \quad (i > j)\\)
  * Determinante Eficiente: \\(\det(\boldsymbol{A}) = \prod_{i=1}^n l_{ii}^2\\)

---

## mml-4.4 — Autodecomposição e Diagonalização (Eigendecomposition & Diagonalization)

* **(a) Definição Formal e Notação Exata:**
  **Teorema 4.20 (Autodecomposição):** Uma matriz quadrada \\(\boldsymbol{A} \in \mathbb{R}^{n \times n}\\) pode ser fatorada em:
  \\[\boldsymbol{A} = \boldsymbol{P}\boldsymbol{D}\boldsymbol{P}^{-1}\\]
  se e somente se seus autovetores formarem uma base de \\(\mathbb{R}^n\\). \\(\boldsymbol{P} \in \mathbb{R}^{n \times n}\\) contém os autovetores de \\(\boldsymbol{A}\\) dispostos nas colunas, e \\(\boldsymbol{D} \in \mathbb{R}^{n \times n}\\) é uma matriz diagonal contendo os autovalores correspondentes na diagonal principal.
  * **Teorema Espectral (Theorem 4.15 / 4.18):** Se \\(\boldsymbol{A}\\) for simétrica, seus autovetores formam uma base ortonormal, logo \\(\boldsymbol{P}\\) é ortogonal (\\(\boldsymbol{P}^{-1} = \boldsymbol{P}^\top\\)) e \\(\boldsymbol{A} = \boldsymbol{P}\boldsymbol{D}\boldsymbol{P}^\top\\).

* **(b) Intuição Geométrica:**
  Interpreta a ação de \\(\boldsymbol{A}\\) como uma sequência de três transformações:
  1. \\(\boldsymbol{P}^{-1}\\): Mudança de base da base canônica para a base própria (*eigenbasis*).
  2. \\(\boldsymbol{D}\\): Escalonamento independente (alongamento/compressão) ao longo dos eixos próprios pelos autovalores \\(\lambda_i\\).
  3. \\(\boldsymbol{P}\\): Mudança de base reversa, retornando ao sistema de coordenadas original.

* **(c) Exemplo Numérico em 2D:**
  Dada a matriz simétrica \\(\boldsymbol{A} = \frac{1}{2}\begin{bmatrix} 5 & -2 \\ -2 & 5 \end{bmatrix}\\) (Exemplo 4.11):
  * Autovalores: \\(\lambda_1 = \frac{7}{2}, \lambda_2 = \frac{3}{2}\\).
  * Autovetores ortonormais: \\(\boldsymbol{p}_1 = \frac{1}{\sqrt{2}}\begin{bmatrix} 1 \\ -1 \end{bmatrix}, \boldsymbol{p}_2 = \frac{1}{\sqrt{2}}\begin{bmatrix} 1 \\ 1 \end{bmatrix}\\).
  * Fatoração:
    \\[\boldsymbol{A} = \underbrace{\frac{1}{\sqrt{2}}\begin{bmatrix} 1 & 1 \\ -1 & 1 \end{bmatrix}}_{\boldsymbol{P}} \underbrace{\begin{bmatrix} 7/2 & 0 \\ 0 & 3/2 \end{bmatrix}}_{\boldsymbol{D}} \underbrace{\frac{1}{\sqrt{2}}\begin{bmatrix} 1 & -1 \\ 1 & 1 \end{bmatrix}}_{\boldsymbol{P}^\top} \quad\\]

* **(d) Aplicação nos Modelos (ML):**
  * **PCA:** Diagonalização da matriz de covariância empírica dos dados.
  * **Cálculo de Potências de Matrizes:** \\(\boldsymbol{A}^k = \boldsymbol{P}\boldsymbol{D}^k\boldsymbol{P}^{-1}\\), essencial em equações de diferença e cadeias de Markov.

* **(e) Fórmulas Relevantes:**
  * Diagonalização: \\(\boldsymbol{A} = \boldsymbol{P}\boldsymbol{D}\boldsymbol{P}^{-1}\\)
  * Fatoração Espectral (Matrizes Simétricas): \\(\boldsymbol{A} = \boldsymbol{P}\boldsymbol{D}\boldsymbol{P}^\top\\)
  * Potência Matricial: \\(\boldsymbol{A}^k = \boldsymbol{P}\boldsymbol{D}^k\boldsymbol{P}^{-1}\\)

---

## mml-4.5 — Decomposição em Valores Singulares (SVD)

* **(a) Definição Formal e Notação Exata:**
  **Teorema da SVD (Seção 4.5):** Qualquer matriz real \\(\boldsymbol{A} \in \mathbb{R}^{m \times n}\\) (quadrada ou retangular) pode ser decomposta em:
  \\[\boldsymbol{A} = \boldsymbol{U}\boldsymbol{\Sigma}\boldsymbol{V}^\top\\]
  onde:
  * \\(\boldsymbol{U} \in \mathbb{R}^{m \times m}\\) é uma matriz ortogonal cujas colunas \\(\boldsymbol{u}_i\\) são os **vetores singulares à esquerda** (autovetores de \\(\boldsymbol{A}\boldsymbol{A}^\top\\)).
  * \\(\boldsymbol{V} \in \mathbb{R}^{n \times n}\\) é uma matriz ortogonal cujas colunas \\(\boldsymbol{v}_i\\) são os **vetores singulares à direita** (autovetores de \\(\boldsymbol{A}^\top\boldsymbol{A}\\)).
  * \\(\boldsymbol{\Sigma} \in \mathbb{R}^{m \times n}\\) é uma matriz diagonal por blocos contendo os **valores singulares** não-negativos \\(\sigma_1 \ge \sigma_2 \ge \dots \ge \sigma_r > 0\\) na diagonal, onde \\(\sigma_i = \sqrt{\lambda_i(\boldsymbol{A}^\top\boldsymbol{A})}\\).
  * **Equação de Valor Singular:** \\(\boldsymbol{A}\boldsymbol{v}_i = \sigma_i \boldsymbol{u}_i\\).

* **(b) Intuição Geométrica:**
  Decompõe uma transformação linear geral \\(\Phi: \mathbb{R}^n \to \mathbb{R}^m\\) em três operações geométricas fundamentais:
  1. \\(\boldsymbol{V}^\top\\): Rotação / mudança de base no espaço de domínio \\(\mathbb{R}^n\\).
  2. \\(\boldsymbol{\Sigma}\\): Escalonamento pelas magnitudes \\(\sigma_i\\) e alteração de dimensão de \\(\mathbb{R}^n\\) para \\(\mathbb{R}^m\\).
  3. \\(\boldsymbol{U}\\): Rotação / mudança de base no espaço de contradomínio \\(\mathbb{R}^m\\).

* **(c) Exemplo Numérico em 2D / 3D:**
  Para a matriz \\(\boldsymbol{A} = \begin{bmatrix} 1 & 0 & 1 \\ -2 & 1 & 0 \end{bmatrix} \in \mathbb{R}^{2 \times 3}\\) (Exemplo 4.13):
  1. Matriz \\(\boldsymbol{A}^\top\boldsymbol{A} = \begin{bmatrix} 5 & -2 & 1 \\ -2 & 1 & 0 \\ 1 & 0 & 1 \end{bmatrix}\\) possui autovalores \\(6, 1, 0\\).
  2. Valores singulares: \\(\sigma_1 = \sqrt{6}\\), \\(\sigma_2 = \sqrt{1} = 1 \implies \boldsymbol{\Sigma} = \begin{bmatrix} \sqrt{6} & 0 & 0 \\ 0 & 1 & 0 \end{bmatrix}\\).
  3. Colunas de \\(\boldsymbol{U}\\): \\(\boldsymbol{u}_1 = \frac{1}{\sigma_1}\boldsymbol{A}\boldsymbol{v}_1 = \frac{1}{\sqrt{5}}\begin{bmatrix} 1 \\ -2 \end{bmatrix}\\) e \\(\boldsymbol{u}_2 = \frac{1}{\sqrt{5}}\begin{bmatrix} 2 \\ 1 \end{bmatrix}\\).

* **(d) Aplicação nos Modelos (ML):**
  * **PCA Sem Covariância:** A SVD é o mecanismo interno preferido para calcular os componentes principais diretamente sobre a matriz de dados \\(\boldsymbol{X} = \boldsymbol{U}\boldsymbol{\Sigma}\boldsymbol{V}^\top\\) sem necessitar computar explicitamente a matriz de covariância \\(\boldsymbol{X}^\top\boldsymbol{X}\\) (evitando instabilidade numérica).
  * **Sistemas de Recomendação:** Filtragem colaborativa em matrizes de avaliação (como o exemplo Usuário-Filme do livro).

* **(e) Fórmulas Relevantes:**
  * Decomposição SVD: \\(\boldsymbol{A} = \boldsymbol{U}\boldsymbol{\Sigma}\boldsymbol{V}^\top\\)
  * Equação dos Valores Singulares: \\(\boldsymbol{A}\boldsymbol{x}_i = \sigma_i \boldsymbol{u}_i\\)
  * Relação com Autovalores: \\(\sigma_i = \sqrt{\lambda_i(\boldsymbol{A}^\top\boldsymbol{A})} = \sqrt{\lambda_i(\boldsymbol{A}\boldsymbol{A}^\top)}\\)

---

## mml-4.6 — Aproximação Matricial e SVD Truncada (Matrix Approximation)

* **(a) Definições Formais e Notação Exata:**
  * **Soma de Matrizes de Posto 1:** Uma matriz \\(\boldsymbol{A} \in \mathbb{R}^{m \times n}\\) de posto \\(r\\) pode ser escrita exatamente como a soma de \\(r\\) matrizes de posto 1:
    \\[\boldsymbol{A} = \sum_{i=1}^r \sigma_i \boldsymbol{u}_i \boldsymbol{v}_i^\top = \sum_{i=1}^r \sigma_i \boldsymbol{A}_i\\]
    onde \\(\boldsymbol{A}_i := \boldsymbol{u}_i \boldsymbol{v}_i^\top \in \mathbb{R}^{m \times n}\\).
  * **Aproximação de Posto \\(k\\) / SVD Truncada (Seção 4.6):** Para \\(k < r\\), a aproximação de posto \\(k\\) é dada por:
    \\[\hat{\boldsymbol{A}}_{(k)} := \sum_{i=1}^k \sigma_i \boldsymbol{u}_i \boldsymbol{v}_i^\top\\]
  * **Norma Espectral (Definição 4.23):** \\(\|\boldsymbol{A}\|_2 := \max_{\boldsymbol{x} \neq \mathbf{0}} \frac{\|\boldsymbol{A}\boldsymbol{x}\|_2}{\|\boldsymbol{x}\|_2} = \sigma_1\\).
  * **Teorema de Eckart-Young (Teorema 4.25):** A matriz \\(\hat{\boldsymbol{A}}_{(k)}\\) é a **melhor aproximação possível** de posto \\(k\\) para \\(\boldsymbol{A}\\) sob a norma espectral, e o erro mínimo de aproximação é exatamente igual ao primeiro valor singular omitido:
    \\[\|\boldsymbol{A} - \hat{\boldsymbol{A}}_{(k)}\|_2 = \sigma_{k+1}\\]

* **(b) Intuição Geométrica:**
  A SVD ordena a informação da matriz em termos de "energia" ou variância decrescente dada pelos valores singulares \\(\sigma_1 \ge \sigma_2 \ge \dots\\). A SVD truncada descarta as direções e dimensões de menor relevância (ruído), projetando os dados sobre um subespaço ótimo de dimensão \\(k\\) que preserva ao máximo a geometria e a estrutura dos dados originais.

* **(c) Exemplo Numérico em 2D:**
  Seja uma matriz \\(2 \times 2\\) com decomposição SVD dada por:
  \\[\boldsymbol{A} = 10 \cdot \boldsymbol{u}_1 \boldsymbol{v}_1^\top + 0,2 \cdot \boldsymbol{u}_2 \boldsymbol{v}_2^\top\\]
  A aproximação de posto 1 é \\(\hat{\boldsymbol{A}}_{(1)} = 10 \cdot \boldsymbol{u}_1 \boldsymbol{v}_1^\top\\). O erro de aproximação medido pela norma espectral é \\(\|\boldsymbol{A} - \hat{\boldsymbol{A}}_{(1)}\|_2 = \sigma_2 = 0,2\\).

* **(d) Aplicação nos Modelos (ML):**
  * **Compressão de Imagens e Dados:** Compressão do dataset de imagens (como a foto de Stonehenge no livro, reduzindo a necessidade de armazenamento para \\(0.6\%\\) dos valores originais).
  * **Análise de Tópicos e Latent Semantic Analysis:** Descoberta de temas latentes em sistemas de recomendação de filmes (exemplo do livro mostrando que as preferências dos usuários são capturadas por um espaço \\(2\text{D}\\) formado pelos temas Sci-Fi e Cinema de Arte Francês).

* **(e) Fórmulas Relevantes:**
  * Decomposição em Posto 1: \\(\boldsymbol{A} = \sum_{i=1}^r \sigma_i \boldsymbol{u}_i \boldsymbol{v}_i^\top\\)
  * Aproximação Truncada de Posto \\(k\\): \\(\hat{\boldsymbol{A}}_{(k)} = \sum_{i=1}^k \sigma_i \boldsymbol{u}_i \boldsymbol{v}_i^\top\\)
  * Norma Espectral: \\(\|\boldsymbol{A}\|_2 = \sigma_1\\)
  * Erro de Aproximação de Eckart-Young: \\(\|\boldsymbol{A} - \hat{\boldsymbol{A}}_{(k)}\|_2 = \sigma_{k+1}\\)
