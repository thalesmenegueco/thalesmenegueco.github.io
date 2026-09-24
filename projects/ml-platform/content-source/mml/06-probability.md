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

## mml-6.4.6 — Geometria de Variáveis Aleatórias e Mudança de Variáveis (Seções 6.4.6 e 6.7)

* **(a) Definições Formais e Notação Exata:**
  * **Espaço Vetorial de V.A.s (Seção 6.4.6):** Para V.A.s com média zero, o **produto interno** é definido como \\(\langle X, Y \rangle := \text{Cov}[x, y]\\).
  * **Norma Induzida:** \\(\|X\| = \sqrt{\text{Cov}[x, x]} = \sqrt{\mathbb{V}[x]} = \sigma[x]\\) (o desvio padrão é o comprimento do vetor).
  * **Ângulo Entre V.A.s:** \\(\cos \theta = \frac{\langle X, Y \rangle}{\|X\|\|Y\|} = \frac{\text{Cov}[x, y]}{\sigma[x]\sigma[y]} = \text{corr}[x, y]\\).
  * **Mudança de Variáveis em Densidades (Teorema 6.16):** Para uma transformação bijetiva e diferenciável \\(\boldsymbol{y} = \boldsymbol{U}(\boldsymbol{x})\\), a pdf de \\(\boldsymbol{Y}\\) é dada por:
    \\[f_Y(\boldsymbol{y}) = f_X(\boldsymbol{U}^{-1}(\boldsymbol{y})) \cdot \left| \det \left( \frac{d\boldsymbol{U}^{-1}(\boldsymbol{y})}{d\boldsymbol{y}} \right) \right|\\]
* **(b) Intuição Geométrica:**
  * **Geometria de V.A.s:** Variáveis aleatórias funcionam como vetores geométricos. Duas V.A.s não correlacionadas (\\(\text{Cov}[x, y] = 0\\)) são **ortogonais** (\\(\theta = 90^\circ, \cos \theta = 0\\)). Para V.A.s ortogonais, a soma das variâncias obedece estritamente ao **Teorema de Pitágoras**: \\(\mathbb{V}[x + y] = \mathbb{V}[x] + \mathbb{V}[y]\\).
  * **Mudança de Variáveis:** O valor absoluto do determinante da matriz Jacobiana \\(|\det(\boldsymbol{J})|\\) atua como um fator de ajuste/escala de volume local que estica ou comprime o espaço para garantir que a massa total de probabilidade continue somando \\(1\\) após a transformação não-linear.
* **(c) Exemplo Numérico em 2D:**
  Seja \\(\boldsymbol{X} \sim \mathcal{N}(\mathbf{0}, \boldsymbol{I}_2)\\) e uma transformação linear \\(\boldsymbol{Y} = \boldsymbol{A}\boldsymbol{X}\\) com \\(\boldsymbol{A} = \begin{bmatrix} a & b \\ c & d \end{bmatrix}\\) (Exemplo 6.17). Como \\(\boldsymbol{X} = \boldsymbol{A}^{-1}\boldsymbol{Y}\\), o determinante da Jacobiana inversa é \\(\left|\det\left(\frac{\partial \boldsymbol{A}^{-1}\boldsymbol{y}}{\partial \boldsymbol{y}}\right)\right| = |ad - bc|^{-1}\\), resultando na densidade transformada de uma Gaussiana com covariância \\(\boldsymbol{\Sigma} = \boldsymbol{A}\boldsymbol{A}^\top\\).
* **(d) Aplicação nos Modelos (ML):**
  * Base teórica para transformações de distribuições em modelos gerativos profundos (*Normalizing Flows* e *Reparametrization Trick* em VAEs).
  * A ortogonalidade entre o erro de previsão \\(\epsilon\\) e as variáveis explicativas na **Regressão Linear** reflete a falta de correlação geométrica.
* **(e) Fórmulas Relevantes:**
  * Produto interno probabilístico: \\(\langle X, Y \rangle = \text{Cov}[x, y]\\)
  * Teorema de Pitágoras de Variâncias: \\(\mathbb{V}[x + y] = \mathbb{V}[x] + \mathbb{V}[y] \iff \text{Cov}[x, y] = 0\\)
  * Fórmula de Mudança de Variáveis: \\(f_Y(\boldsymbol{y}) = f_X(\boldsymbol{A}^{-1}\boldsymbol{y}) |\det(\boldsymbol{A})|^{-1}\\)

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
