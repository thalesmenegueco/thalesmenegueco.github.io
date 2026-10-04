# mml-6 — Probability

## mml-6.1 — Espaço de Probabilidade, Variáveis Aleatórias e Densidades (Seções 6.1 e 6.2)

* **(a) Definições Formais e Notação Exata:**
  * **Espaço de Probabilidade:** Tripla \\((\Omega, \mathcal{A}, P)\\), em que \\(\Omega\\) é o espaço amostral (*sample space*), \\(\mathcal{A}\\) é o espaço de eventos (\\(\sigma\\)-álgebra) e \\(P: \mathcal{A} \to\\) é a medida de probabilidade.
  * **Variável Aleatória (V.A.):** Função \\(X: \Omega \to \mathcal{T}\\) que mapeia resultados do espaço amostral \\(\Omega\\) para um espaço alvo \\(\mathcal{T}\\) (tipicamente \\(\mathbb{R}^D\\)).
  * **Função Densidade de Probabilidade (pdf):** Para uma V.A. contínua real multivariada \\(\boldsymbol{X}\\) com estados \\(\boldsymbol{x} \in \mathbb{R}^D\\), a função \\(f: \mathbb{R}^D \to \mathbb{R}\\) é uma pdf (Definição 6.1) se satisfizer:
    1. \\(\forall \boldsymbol{x} \in \mathbb{R}^D : f(\boldsymbol{x}) \ge 0\\)
    2. \\(\int_{\mathbb{R}^D} f(\boldsymbol{x}) d\boldsymbol{x} = 1\\)
  * **Função de Distribuição Acumulada (cdf):** Para \\(\boldsymbol{x} = [x_1, \dots, x_D]^\top\\), \\(F_X(\boldsymbol{x}) = P(X_1 \le x_1, \dots, X_D \le x_D)\\).
* **(b) Intuição Geométrica:**
  A densidade de probabilidade \\(p(\boldsymbol{x})\\) atribui uma "massa" ou "altura" sobre cada ponto do espaço vetorial \\(\mathbb{R}^D\\). A probabilidade de um evento contido em uma região do plano ou espaço equivale geometricamente ao **volume total sob a superfície da densidade** contida dentro das fronteiras dessa região, sendo o volume sob todo o espaço exatamente igual a \\(1\\).
* **(c) Exemplo Numérico em 2D:**
  * *Caso Discreto:* Uma tabela de distribuição conjunta bidimensional \\(3 \times 5\\) com entradas \\(P(X = x_i, Y = y_j) = \frac{n_{ij}}{N}\\) somando \\(1\\) em toda a grade.
  * *Caso Contínuo:* Uma distribuição uniforme 2D sobre o retângulo \\([0.9, 1.6] \times\\), em que a altura da densidade é constante \\(f(x_1, x_2) = \frac{1}{0.7 \times 1} \approx 1.428\\) para que o volume do bloco seja \\(1\\).
* **(d) Aplicação nos Modelos (ML):**
  A variável aleatória \\(\boldsymbol{X} \in \mathbb{R}^D\\) modela o vetor de características (*features*) e as observações ruidosas de alvos \\(y_n\\) na **Regressão Linear** e no **GMM**, permitindo quantificar a incerteza dos dados e do modelo.
* **(e) Fórmulas Relevantes:**
  * Integração da pdf: \\(\int_{\mathbb{R}^D} f(\boldsymbol{x}) d\boldsymbol{x} = 1\\)
  * Definição da cdf multivariada: \\(F_X(\boldsymbol{x}) = P(X_1 \le x_1, \dots, X_D \le x_D)\\)

---

## mml-6.3 — Regras da Probabilidade: Regra da Soma, do Produto e Teorema de Bayes (Seção 6.3)

* **(a) Definições Formais e Notação Exata:**
  * **Regra da Soma (Marginalização):** 
    \\[p(\boldsymbol{x}) = \int p(\boldsymbol{x}, \boldsymbol{y}) d\boldsymbol{y} \quad \text{(contínuo)} \quad \text{ou} \quad p(\boldsymbol{x}) = \sum_{\boldsymbol{y}} p(\boldsymbol{x}, \boldsymbol{y}) \quad \text{(discreto)}\\]
  * **Regra do Produto:** 
    \\[p(\boldsymbol{x}, \boldsymbol{y}) = p(\boldsymbol{y} | \boldsymbol{x}) p(\boldsymbol{x}) = p(\boldsymbol{x} | \boldsymbol{y}) p(\boldsymbol{y})\\]
  * **Teorema de Bayes:** 
    \\[p(\boldsymbol{\theta} | \boldsymbol{x}) = \frac{p(\boldsymbol{x} | \boldsymbol{\theta}) p(\boldsymbol{\theta})}{p(\boldsymbol{x})}, \quad \text{onde } p(\boldsymbol{x}) = \int p(\boldsymbol{x} | \boldsymbol{\theta}) p(\boldsymbol{\theta}) d\boldsymbol{\theta}\\]
* **(b) Intuição Geométrica:**
  * **Marginalização:** É o ato de **projetar/colapsar** uma superfície de distribuição de probabilidade conjunta 2D sobre um único eixo de coordenada, somando/integrando a massa ao longo da dimensão descartada.
  * **Condicionamento:** Equivale a fazer um **corte ortogonal estrito** (uma fatia 1D) na superfície conjunta ao longo de uma linha de valor fixado (ex: \\(y = y_0\\)) e re-escalar/normalizar a área dessa fatia para que ela volte a somar \\(1\\).
* **(c) Exemplo Numérico em 2D:**
  Dada uma distribuição bivariada Gaussiana \\(p(x_1, x_2)\\) com média \\(\boldsymbol{\mu} =^\top\\) e covariância \\(\boldsymbol{\Sigma} = \begin{bmatrix} 0.3 & -1 \\ -1 & 5 \end{bmatrix}\\) (Exemplo 6.6):
  * A marginal \\(p(x_1)\\) ignora \\(x_2\\) e resulta na Gaussiana 1D \\(\mathcal{N}(0, 0.3)\\).
  * A condicional \\(p(x_1 | x_2 = -1)\\) fatia o plano na reta \\(x_2 = -1\\), resultando na Gaussiana 1D deslocada \\(\mathcal{N}(0.6, 0.1)\\).
* **(d) Aplicação nos Modelos (ML):**
  * **Regressão Linear Bayesiana:** O Teorema de Bayes atualiza a distribuição a priori sobre os parâmetros \\(p(\boldsymbol{\theta})\\) para obter a distribuição a posteriori \\(p(\boldsymbol{\theta} | \boldsymbol{X}, \boldsymbol{y})\\).
  * **Gaussian Mixture Models (GMM):** Utilizado no algoritmo EM para calcular a probabilidade a posteriori de pertencimento (*responsabilidade*) \\(r_{nk} = P(z_n = k | \boldsymbol{x}_n)\\) de um ponto a cada componente.
* **(e) Fórmulas Relevantes:**
  * Regra da Soma: \\(p(\boldsymbol{x}) = \int p(\boldsymbol{x}, \boldsymbol{y}) d\boldsymbol{y}\\)
  * Regra do Produto: \\(p(\boldsymbol{x}, \boldsymbol{y}) = p(\boldsymbol{x}|\boldsymbol{y})p(\boldsymbol{y})\\)
  * Teorema de Bayes: \\(p(\boldsymbol{\theta}|\boldsymbol{x}) = \frac{p(\boldsymbol{x}|\boldsymbol{\theta})p(\boldsymbol{\theta})}{\int p(\boldsymbol{x}|\boldsymbol{\theta})p(\boldsymbol{\theta})d\boldsymbol{\theta}}\\)

---

## mml-6.4 — Estatísticas de Resumo: Média, Variância, Covariância e Correlação (Seções 6.4.1 a 6.4.3)

* **(a) Definições Formais e Notação Exata:**
  * **Média / Valor Esperado (Definição 6.3 / 6.4):** Operador linear \\(\mathbb{E}_X[\boldsymbol{x}] = \int \boldsymbol{x} p(\boldsymbol{x}) d\boldsymbol{x} = \boldsymbol{\mu} \in \mathbb{R}^D\\).
  * **Covariância Multivariada (Definição 6.6):** Para V.A.s \\(\boldsymbol{X} \in \mathbb{R}^D\\) e \\(\boldsymbol{Y} \in \mathbb{R}^E\\):
    \\[\text{Cov}[\boldsymbol{x}, \boldsymbol{y}] = \mathbb{E}[\boldsymbol{x}\boldsymbol{y}^\top] - \mathbb{E}[\boldsymbol{x}]\mathbb{E}[\boldsymbol{y}]^\top \in \mathbb{R}^{D \times E}\\]
  * **Matriz de Covariância (Definição 6.7):** Matriz simétrica e positiva definida \\(\boldsymbol{\Sigma} \in \mathbb{R}^{D \times D}\\):
    \\[\mathbb{V}_X[\boldsymbol{x}] = \text{Cov}[\boldsymbol{x}, \boldsymbol{x}] = \mathbb{E}[(\boldsymbol{x} - \boldsymbol{\mu})(\boldsymbol{x} - \boldsymbol{\mu})^\top] = \mathbb{E}[\boldsymbol{x}\boldsymbol{x}^\top] - \boldsymbol{\mu}\boldsymbol{\mu}^\top\\]
  * **Correlação (Definição 6.8):** \\(\text{corr}[x_i, x_j] = \frac{\text{Cov}[x_i, x_j]}{\sigma(x_i)\sigma(x_j)} \in [-1, 1]\\).
* **(b) Intuição Geométrica:**
  O vetor de média \\(\boldsymbol{\mu}\\) localiza o **ponto de equilíbrio/centro de gravidade** da distribuição no espaço \\(\mathbb{R}^D\\). A matriz de covariância \\(\boldsymbol{\Sigma}\\) rege a **forma e orientação da dispersão elíptica**: as variâncias marginais na diagonal principal ditam a largura ao longo dos eixos, e os termos de covariância fora da diagonal rotacionam os eixos principais da elipse no plano 2D.
* **(c) Exemplo Numérico em 2D:**
  Considere o dataset 2D com distribuição que possui covariância cruzada positiva \\(\text{Cov}[x_1, x_2] = 2.0\\), variâncias \\(\sigma_1^2 = 8.4\\) e \\(\sigma_2^2 = 1.7\\) e média \\(\boldsymbol{\mu} = ^\top\\):
  \\[\boldsymbol{\Sigma} = \begin{bmatrix} 8.4 & 2.0 \\ 2.0 & 1.7 \end{bmatrix}\\]
  Geometricamente, gera uma elipse de pontos inclinada positivamente do quadrante inferior esquerdo para o superior direito no plano \\((x_1, x_2)\\).
* **(d) Aplicação nos Modelos (ML):**
  * **PCA:** Baseia-se na maximização da variância projetada computada através da matriz de covariância empírica dos dados \\(\boldsymbol{S} = \frac{1}{N}\sum_{n=1}^N (\boldsymbol{x}_n - \bar{\boldsymbol{x}})(\boldsymbol{x}_n - \bar{\boldsymbol{x}})^\top\\).
  * **GMM:** Cada componente Gaussiano possui seu próprio vetor de médias \\(\boldsymbol{\mu}_k\\) e matriz de covariância \\(\boldsymbol{\Sigma}_k\\) aprendidos pelo algoritmo EM.
* **(e) Fórmulas Relevantes:**
  * Operador Valor Esperado: \\(\mathbb{E}[f(\boldsymbol{x})] = \int f(\boldsymbol{x})p(\boldsymbol{x})d\boldsymbol{x}\\)
  * Decomposição da Covariância: \\(\text{Cov}[\boldsymbol{x}, \boldsymbol{y}] = \mathbb{E}[\boldsymbol{x}\boldsymbol{y}^\top] - \mathbb{E}[\boldsymbol{x}]\mathbb{E}[\boldsymbol{y}]^\top\\)
  * Transformação Afim da Média: \\(\mathbb{E}[\boldsymbol{A}\boldsymbol{x} + \boldsymbol{b}] = \boldsymbol{A}\mathbb{E}[\boldsymbol{x}] + \boldsymbol{b}\\)
  * Transformação Afim da Variância: \\(\mathbb{V}[\boldsymbol{A}\boldsymbol{x} + \boldsymbol{b}] = \boldsymbol{A}\mathbb{V}[\boldsymbol{x}]\boldsymbol{A}^\top\\)

---

## mml-6.4.6 — Produto Interno de Variáveis Aleatórias (Inner Products of Random Variables)

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

## mml-6.7 — Mudança de Variáveis / Transformada Inversa (Change of Variables/Inverse Transform)

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

## mml-6.5 — Distribuição Gaussiana Multivariada (Seção 6.5)

* **(a) Definições Formais e Notação Exata:**
  * **Densidade Gaussiana Multivariada:** Para \\(\boldsymbol{x} \in \mathbb{R}^D\\), caracterizada pelo vetor de médias \\(\boldsymbol{\mu} \in \mathbb{R}^D\\) e matriz de covariância SPD \\(\boldsymbol{\Sigma} \in \mathbb{R}^{D \times D}\\):
    \\[p(\boldsymbol{x} | \boldsymbol{\mu}, \boldsymbol{\Sigma}) = (2\pi)^{-\frac{D}{2}} |\boldsymbol{\Sigma}|^{-\frac{1}{2}} \exp \left( -\frac{1}{2} (\boldsymbol{x} - \boldsymbol{\mu})^\top \boldsymbol{\Sigma}^{-1} (\boldsymbol{x} - \boldsymbol{\mu}) \right)\\]
  * **Partição em Blocos:** Para \\(\boldsymbol{x} = \begin{bmatrix} \boldsymbol{x}_a \\ \boldsymbol{x}_b \end{bmatrix}\\), com \\(\boldsymbol{\mu} = \begin{bmatrix} \boldsymbol{\mu}_a \\ \boldsymbol{\mu}_b \end{bmatrix}\\) e \\(\boldsymbol{\Sigma} = \begin{bmatrix} \boldsymbol{\Sigma}_{aa} & \boldsymbol{\Sigma}_{ab} \\ \boldsymbol{\Sigma}_{ba} & \boldsymbol{\Sigma}_{bb} \end{bmatrix}\\):
    * **Marginal (Seção 6.5.1):** \\(p(\boldsymbol{x}_a) = \mathcal{N}(\boldsymbol{x}_a | \boldsymbol{\mu}_a, \boldsymbol{\Sigma}_{aa})\\).
    * **Condicional (Seção 6.5.1):** \\(p(\boldsymbol{x}_a | \boldsymbol{x}_b) = \mathcal{N}(\boldsymbol{x}_a | \boldsymbol{\mu}_{a|b}, \boldsymbol{\Sigma}_{a|b})\\), onde:
      \\[\boldsymbol{\mu}_{a|b} = \boldsymbol{\mu}_a + \boldsymbol{\Sigma}_{ab}\boldsymbol{\Sigma}_{bb}^{-1}(\boldsymbol{x}_b - \boldsymbol{\mu}_b)\\]
      \\[\boldsymbol{\Sigma}_{a|b} = \boldsymbol{\Sigma}_{aa} - \boldsymbol{\Sigma}_{ab}\boldsymbol{\Sigma}_{bb}^{-1}\boldsymbol{\Sigma}_{ba}\\]
  * **Produto de Gaussianas (Seção 6.5.2):** \\(\mathcal{N}(\boldsymbol{x} | \boldsymbol{a}, \boldsymbol{A}) \mathcal{N}(\boldsymbol{x} | \boldsymbol{b}, \boldsymbol{B}) = c \cdot \mathcal{N}(\boldsymbol{x} | \boldsymbol{c}, \boldsymbol{C})\\), com \\(\boldsymbol{C} = (\boldsymbol{A}^{-1} + \boldsymbol{B}^{-1})^{-1}\\) e \\(\boldsymbol{c} = \boldsymbol{C}(\boldsymbol{A}^{-1}\boldsymbol{a} + \boldsymbol{B}^{-1}\boldsymbol{b})\\).
* **(b) Intuição Geométrica:**
  A densidade forma um "sino" tridimensional centrado em \\(\boldsymbol{\mu}\\). Os contornos de nível de igual probabilidade \\((\boldsymbol{x} - \boldsymbol{\mu})^\top \boldsymbol{\Sigma}^{-1} (\boldsymbol{x} - \boldsymbol{\mu}) = \text{constante}\\) formam **elipsoides** centrados em \\(\boldsymbol{\mu}\\). Onde os eixos principais são os autovetores de \\(\boldsymbol{\Sigma}\\) e o comprimento dos semi-eixos é proporcional a \\(\sqrt{\lambda_i}\\) (raízes dos autovalores).
* **(c) Exemplo Numérico em 2D:**
  Dada a bivariada \\(p(x_1, x_2) = \mathcal{N}\left( \begin{bmatrix} 0 \\ 2 \end{bmatrix}, \begin{bmatrix} 0.3 & -1 \\ -1 & 5 \end{bmatrix} \right)\\):
  * A média condicional de \\(x_1\\) dado \\(x_2 = -1\\) é:
    \\(\mu_{x_1 | x_2 = -1} = 0 + (-1)(5)^{-1}(-1 - 2) = \frac{3}{5} = 0.6\\).
  * A variância condicional é:
    \\(\sigma^2_{x_1 | x_2 = -1} = 0.3 - (-1)(5)^{-1}(-1) = 0.3 - 0.2 = 0.1\\).
  * Portanto, \\(p(x_1 | x_2 = -1) = \mathcal{N}(0.6, 0.1)\\).
* **(d) Aplicação nos Modelos (ML):**
  * **Regressão Linear Bayesiana:** A verossimilhança \\(p(\boldsymbol{y}|\boldsymbol{X}, \boldsymbol{\theta}) = \mathcal{N}(\boldsymbol{y} | \boldsymbol{\Phi}\boldsymbol{\theta}, \sigma^2 \boldsymbol{I})\\) e a priori \\(p(\boldsymbol{\theta}) = \mathcal{N}(\boldsymbol{m}_0, \boldsymbol{S}_0)\\) são ambas Gaussianas. Devido à propriedade de conjugação do produto de Gaussianas, a posterior \\(p(\boldsymbol{\theta}|\boldsymbol{X}, \boldsymbol{y})\\) e a distribuição preditiva \\(p(y_*|\boldsymbol{x}_*)\\) possuem soluções analíticas exatas em forma de Gaussianas.
  * **GMM:** Define a densidade de probabilidade de cada cluster na mistura.
* **(e) Fórmulas Relevantes:**
  * Densidade multivariada: \\(p(\boldsymbol{x}|\boldsymbol{\mu}, \boldsymbol{\Sigma}) = (2\pi)^{-\frac{D}{2}} |\boldsymbol{\Sigma}|^{-\frac{1}{2}} \exp\left(-\frac{1}{2}(\boldsymbol{x}-\boldsymbol{\mu})^\top \boldsymbol{\Sigma}^{-1}(\boldsymbol{x}-\boldsymbol{\mu})\right)\\)
  * Média da condicional: \\(\boldsymbol{\mu}_{a|b} = \boldsymbol{\mu}_a + \boldsymbol{\Sigma}_{ab}\boldsymbol{\Sigma}_{bb}^{-1}(\boldsymbol{x}_b - \boldsymbol{\mu}_b)\\)
  * Covariância da condicional: \\(\boldsymbol{\Sigma}_{a|b} = \boldsymbol{\Sigma}_{aa} - \boldsymbol{\Sigma}_{ab}\boldsymbol{\Sigma}_{bb}^{-1}\boldsymbol{\Sigma}_{ba}\\)
  * Transformação Linear de Gaussiana: \\(\boldsymbol{X} \sim \mathcal{N}(\boldsymbol{\mu}, \boldsymbol{\Sigma}) \implies \boldsymbol{A}\boldsymbol{X} \sim \mathcal{N}(\boldsymbol{A}\boldsymbol{\mu}, \boldsymbol{A}\boldsymbol{\Sigma}\boldsymbol{A}^\top)\\)

---

## mml-6.6 — Conjugação, Estatísticas Suficientes e Família Exponencial (Seção 6.6)

* **(a) Definições Formais e Notação Exata:**
  * **Distribuição a Priori Conjugada (Seção 6.6.1):** Uma priori \\(p(\boldsymbol{\theta})\\) é conjugada para a verossimilhança \\(p(\boldsymbol{x}|\boldsymbol{\theta})\\) se a distribuição a posteriori \\(p(\boldsymbol{\theta}|\boldsymbol{x})\\) pertence à mesma família funcional/paramétrica que \\(p(\boldsymbol{\theta})\\).
  * **Estatística Suficiente (Seção 6.6.2):** Uma função \\(\boldsymbol{\phi}(\boldsymbol{x})\\) é uma estatística suficiente para os parâmetros \\(\boldsymbol{\theta}\\) se contiver toda a informação necessária para estimar \\(\boldsymbol{\theta}\\) a partir dos dados (Teorema da Fatoração de Fisher-Neyman: \\(p(\boldsymbol{x}|\boldsymbol{\theta}) = h(\boldsymbol{x})g_{\boldsymbol{\theta}}(\boldsymbol{\phi}(\boldsymbol{x}))\\)).
  * **Família Exponencial (Seção 6.6.3):** Família de distribuições parametrizadas por \\(\boldsymbol{\theta} \in \mathbb{R}^D\\) na forma:
    \\[p(\boldsymbol{x} | \boldsymbol{\theta}) = h(\boldsymbol{x}) \exp \left( \langle \boldsymbol{\theta}, \boldsymbol{\phi}(\boldsymbol{x}) \rangle - A(\boldsymbol{\theta}) \right)\\]
    onde \\(\boldsymbol{\theta}\\) são os parâmetros naturais, \\(\boldsymbol{\phi}(\boldsymbol{x})\\) é o vetor de estatísticas suficientes, \\(h(\boldsymbol{x})\\) é o fator de escala de base e \\(A(\boldsymbol{\theta})\\) é a função **log-partição** (normalizador).
* **(b) Intuição Geométrica:**
  A família exponencial define um **manifold estatístico conexo e suave**. A atualização Bayesiana com uma priori conjugada reduz-se a uma operação simples de **adição vetorial direta** no espaço de parâmetros: os parâmetros da posterior são obtidos somando-se as estatísticas suficientes observadas nos dados aos hiperparâmetros da priori.
* **(c) Exemplo Numérico em 2D:**
  Para a distribuição de Bernoulli \\(p(x|\mu) = \mu^x(1-\mu)^{1-x}\\) para \\(x \in \{0, 1\}\\) (Exemplo 6.14):
  * Reescrevendo na Família Exponencial:
    \\(p(x|\mu) = \exp\left[ x \log \frac{\mu}{1-\mu} + \log(1-\mu) \right]\\).
  * Parâmetro natural: \\(\theta = \log \frac{\mu}{1-\mu}\\) (função logit).
  * Estatística suficiente: \\(\phi(x) = x\\).
  * Inversão: \\(\mu = \frac{1}{1 + \exp(-\theta)}\\) (função sigmoide/logística).
  * Priori conjugada: Distribuição Beta\\((\alpha, \beta)\\). Observando \\(h\\) sucessos em \\(N\\) ensaios, a posteriori é exatamente \\(\text{Beta}(\alpha + h, \beta + N - h)\\).
* **(d) Aplicação nos Modelos (ML):**
  * **Classificação e GLMs (Modelos Lineares Generalizados):** A função de ativação sigmoide \\(\sigma(\theta) = \frac{1}{1 + e^{-\theta}}\\) usada na Regressão Logística e em Redes Neurais é a inversa direta do parâmetro natural da distribuição de Bernoulli na família exponencial.
  * **Regressão Linear Bayesiana:** Utiliza a conjugação Gaussiana-Gaussiana para calcular a posterior em forma fechada.
* **(e) Fórmulas Relevantes:**
  * Forma da Família Exponencial: \\(p(\boldsymbol{x}|\boldsymbol{\theta}) = h(\boldsymbol{x}) \exp(\boldsymbol{\theta}^\top \boldsymbol{\phi}(\boldsymbol{x}) - A(\boldsymbol{\theta}))\\)
  * Mapeamento do parâmetro Bernoulli para natural: \\(\theta = \log\left(\frac{\mu}{1-\mu}\right)\\)
  * Mapeamento natural para média (Sigmoide): \\(\mu = \frac{1}{1 + \exp(-\theta)}\\)
  * Atualização de posterior Beta-Binomial: \\(\text{Beta}(\alpha + h, \beta + N - h)\\)
