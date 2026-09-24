# mml-9 — Linear Regression

## mml-9.1 — Formulação Probabilística e Modelo de Verossimilhança

* **(a) Definições Formais e Notação Exata:**
  Dado um conjunto de treinamento \\(\mathcal{D} = \{(\boldsymbol{x}_1, y_1), \dots, (\boldsymbol{x}_N, y_N)\}\\) composto por \\(N\\) entradas \\(\boldsymbol{x}_n \in \mathbb{R}^D\\) e alvos ruidosos observados \\(y_n \in \mathbb{R}\\). O modelo assume uma relação com ruído Gaussiano aditivo:
  \\[y_n = f(\boldsymbol{x}_n) + \epsilon_n, \quad \epsilon_n \sim \mathcal{N}(0, \sigma^2)\\]
  onde \\(\epsilon_n\\) são variáveis aleatórias independentes e identicamente distribuídas (i.i.d.). A função de verossimilhança (*likelihood*) para uma única observação é:
  \\[p(y \mid \boldsymbol{x}, \boldsymbol{\theta}) = \mathcal{N}(y \mid \boldsymbol{x}^\top \boldsymbol{\theta}, \sigma^2)\\]
  Devido à independência condicional das observações dado o modelo, a verossimilhança conjunta de todo o conjunto de dados fatoriza-se como:
  \\[p(\boldsymbol{Y} \mid \boldsymbol{X}, \boldsymbol{\theta}) = \prod_{n=1}^N p(y_n \mid \boldsymbol{x}_n, \boldsymbol{\theta}) = \prod_{n=1}^N \mathcal{N}(y_n \mid \boldsymbol{x}_n^\top \boldsymbol{\theta}, \sigma^2)\\]
* **(b) Intuição Geométrica:**
  A modelagem probabilística insere uma distribuição de densidade Gaussiana 1D "em pé" e centrada sobre cada ponto da reta ou hiperplano gerado por \\(f(\boldsymbol{x}) = \boldsymbol{x}^\top\boldsymbol{\theta}\\). A largura dessa sino estatístico representa a variância do ruído de medição \\(\sigma^2\\).
* **(c) Exemplo Numérico Pequeno em 2D:**
  Para um modelo linear simples sem intercepto com \\(x \in \mathbb{R}\\) e \\(\theta \in \mathbb{R}\\), o modelo descreve retas no plano passando pela origem. Se \\(\theta = 2\\) e avaliamos no ponto \\(x_1 = 2\\), o modelo prevê uma média de \\(f(2) = 4\\), com densidade de probabilidade observada \\(y_1 \sim \mathcal{N}(4, \sigma^2)\\).
* **(d) Como aparece na Regressão Linear:**
  Fornece a justificativa probabilística para a função de perda quadrática clássica, transformando a busca por bons parâmetros na minimização da log-verossimilhança negativa.
* **(e) Fórmulas Relevantes:**
  * Modelo com ruído: \\(y = \boldsymbol{x}^\top\boldsymbol{\theta} + \epsilon, \quad \epsilon \sim \mathcal{N}(0, \sigma^2)\\)
  * Verossimilhança pontual: \\(p(y \mid \boldsymbol{x}, \boldsymbol{\theta}) = \mathcal{N}(y \mid \boldsymbol{x}^\top\boldsymbol{\theta}, \sigma^2)\\)
  * Verossimilhança conjunta: \\(p(\boldsymbol{Y} \mid \boldsymbol{X}, \boldsymbol{\theta}) = \prod_{n=1}^N \mathcal{N}(y_n \mid \boldsymbol{x}_n^\top\boldsymbol{\theta}, \sigma^2)\\)

---

## mml-9.2 — Estimativa de Máxima Verossimilhança (MLE)

* **(a) Definições Formais e Notação Exata:**
  A Estimativa de Máxima Verossimilhança obtém os parâmetros \\(\boldsymbol{\theta}_{\text{ML}}\\) que maximizam a verossimilhança conjunta ou, de forma equivalente, minimizam a log-verossimilhança negativa \\(\mathcal{L}(\boldsymbol{\theta})\\):
  \\[\mathcal{L}(\boldsymbol{\theta}) := -\log p(\boldsymbol{Y} \mid \boldsymbol{X}, \boldsymbol{\theta}) = \frac{1}{2\sigma^2} \sum_{n=1}^N (y_n - \boldsymbol{x}_n^\top\boldsymbol{\theta})^2 + \text{const}\\]
  Definindo a **matriz de design** \\(\boldsymbol{X} := [\boldsymbol{x}_1, \dots, \boldsymbol{x}_N]^\top \in \mathbb{R}^{N \times D}\\) e o vetor de alvos \\(\boldsymbol{y} := [y_1, \dots, y_N]^\top \in \mathbb{R}^N\\), a função de perda expressa-se em forma matricial por:
  \\[\mathcal{L}(\boldsymbol{\theta}) = \frac{1}{2\sigma^2} \|\boldsymbol{y} - \boldsymbol{X}\boldsymbol{\theta}\|^2\\]
  Derivando em relação a \\(\boldsymbol{\theta}\\) e igualando a zero, obtêm-se as **equações normais**, cuja solução única é:
  \\[\boldsymbol{\theta}_{\text{ML}} = (\boldsymbol{X}^\top\boldsymbol{X})^{-1}\boldsymbol{X}^\top\boldsymbol{y}\\]
* **(b) Intuição Geométrica:**
  Busca o vetor de parâmetros \\(\boldsymbol{\theta}\\) que minimiza a soma dos quadrados das distâncias verticais (resíduos) entre os pontos de dados observados \\(y_n\\) e a superfície predita pelo modelo \\(\boldsymbol{x}_n^\top\boldsymbol{\theta}\\).
* **(c) Exemplo Numérico Pequeno em 2D:**
  Dada uma matriz de design \\(1\text{D}\\) com \\(N=2\\) pontos: \\(\boldsymbol{X} = \begin{bmatrix} 1 \\ 2 \end{bmatrix}\\) e \\(\boldsymbol{y} = \begin{bmatrix} 2 \\ 5 \end{bmatrix}\\):
  1. \\(\boldsymbol{X}^\top\boldsymbol{X} = 1^2 + 2^2 = 5\\).
  2. \\(\boldsymbol{X}^\top\boldsymbol{y} = 1(2) + 2(5) = 12\\).
  3. \\(\theta_{\text{ML}} = \frac{12}{5} = 2,4\\).
  A reta de melhor ajuste Mínimos Quadrados é \\(\hat{y} = 2,4 x\\).
* **(d) Como aparece na Regressão Linear:**
  É a solução analítica clássica por Mínimos Quadrados Ordinários (OLS). A estimativa MLE para a variância do ruído \\(\sigma^2\\) é o erro quadrático médio empírico:
  \\[\sigma^2_{\text{ML}} = \frac{1}{N} \sum_{n=1}^N (y_n - \boldsymbol{x}_n^\top\boldsymbol{\theta}_{\text{ML}})^2\\]
* **(e) Fórmulas Relevantes:**
  * Função de Erro Quadrático: \\(\mathcal{L}(\boldsymbol{\theta}) = \frac{1}{2\sigma^2} \|\boldsymbol{y} - \boldsymbol{X}\boldsymbol{\theta}\|^2\\)
  * Solução MLE: \\(\boldsymbol{\theta}_{\text{ML}} = (\boldsymbol{X}^\top\boldsymbol{X})^{-1}\boldsymbol{X}^\top\boldsymbol{y}\\)
  * Estimativa da Variância do Ruído: \\(\sigma^2_{\text{ML}} = \frac{1}{N} \|\boldsymbol{y} - \boldsymbol{X}\boldsymbol{\theta}_{\text{ML}}\|^2\\)
  * Raiz do Erro Quadrático Médio (RMSE): \\(\text{RMSE} = \sqrt{\frac{1}{N} \|\boldsymbol{y} - \boldsymbol{X}\boldsymbol{\theta}\|^2}\\)

---

## mml-9.3 — Transformação não Linear de Características (Feature Mapping)

* **(a) Definições Formais e Notação Exata:**
  Para modelar curvas não lineares mantendo a propriedade de ser "linear nos parâmetros", aplica-se uma transformação de características \\(\boldsymbol{\phi}: \mathbb{R}^D \to \mathbb{R}^K\\) sobre os dados de entrada \\(\boldsymbol{x}\\):
  \\[p(y \mid \boldsymbol{x}, \boldsymbol{\theta}) = \mathcal{N}(y \mid \boldsymbol{\phi}^\top(\boldsymbol{x})\boldsymbol{\theta}, \sigma^2) \iff y = \boldsymbol{\phi}^\top(\boldsymbol{x})\boldsymbol{\theta} + \epsilon = \sum_{k=0}^{K-1} \theta_k \phi_k(\boldsymbol{x}) + \epsilon\\]
  A **matriz de características** (ou matriz de design transformada) \\(\boldsymbol{\Phi} \in \mathbb{R}^{N \times K}\\) é definida por:
  \\[\boldsymbol{\Phi} := \begin{bmatrix} \boldsymbol{\phi}^\top(\boldsymbol{x}_1) \\ \vdots \\ \boldsymbol{\phi}^\top(\boldsymbol{x}_N) \end{bmatrix} = \begin{bmatrix} \phi_0(\boldsymbol{x}_1) & \dots & \phi_{K-1}(\boldsymbol{x}_1) \\ \vdots & \ddots & \vdots \\ \phi_0(\boldsymbol{x}_N) & \dots & \phi_{K-1}(\boldsymbol{x}_N) \end{bmatrix} \in \mathbb{R}^{N \times K}\\]
* **(b) Intuição Geométrica:**
  Mapeia ("eleva") os dados de entrada de um espaço original \\(D\\)-dimensional para um espaço de características \\(K\\)-dimensional, onde a relação entre as características transformadas e a saída passa a ser descrita por um hiperplano linear.
* **(c) Exemplo Numérico Pequeno em 2D:**
  Na regressão polinomial em 1D, o vetor de características de grau 2 é \\(\boldsymbol{\phi}(x) = [1, x, x^2]^\top \in \mathbb{R}^3\\). Para dois pontos \\(x_1 = 1\\) e \\(x_2 = 2\\):
  \\[\boldsymbol{\Phi} = \begin{bmatrix} 1 & 1 & 1 \\ 1 & 2 & 4 \end{bmatrix} \in \mathbb{R}^{2 \times 3}\\]
* **(d) Como aparece na Regressão Linear:**
  Permite ajustar polinômios de grau \\(K-1\\) e outras funções complexas usando a mesma fórmula de solução closed-form:
  \\[\boldsymbol{\theta}_{\text{ML}} = (\boldsymbol{\Phi}^\top\boldsymbol{\Phi})^{-1}\boldsymbol{\Phi}^\top\boldsymbol{y}\\]
  Se o grau \\(K\\) for muito elevado em relação ao número de dados \\(N\\), ocorre **overfitting** (o erro de treino tende a zero, mas o erro de teste aumenta drasticamente).
* **(e) Fórmulas Relevantes:**
  * Modelo com características: \\(f(x) = \boldsymbol{\phi}^\top(\boldsymbol{x})\boldsymbol{\theta} = \sum_{k=0}^{K-1} \theta_k \phi_k(\boldsymbol{x})\\)
  * Matriz de características: \\(\boldsymbol{\Phi} \in \mathbb{R}^{N \times K}, \quad \boldsymbol{\Phi}_{nk} = \phi_k(\boldsymbol{x}_n)\\)
  * Estimador MLE com características: \\(\boldsymbol{\theta}_{\text{ML}} = (\boldsymbol{\Phi}^\top\boldsymbol{\Phi})^{-1}\boldsymbol{\Phi}^\top\boldsymbol{y}\\)

---

## mml-9.4 — Estimativa Máxima a Posteriori (MAP) e Regularização

* **(a) Definições Formais e Notação Exata:**
  A estimativa MAP define uma distribuição a priori Gaussiana sobre os parâmetros \\(p(\boldsymbol{\theta}) = \mathcal{N}(\mathbf{0}, b^2 \boldsymbol{I})\\). Minimizar a log-posterior negativa corresponde a:
  \\[-\log p(\boldsymbol{\theta} \mid \boldsymbol{X}, \boldsymbol{Y}) = \frac{1}{2\sigma^2} \|\boldsymbol{y} - \boldsymbol{\Phi}\boldsymbol{\theta}\|^2 + \frac{1}{2b^2} \|\boldsymbol{\theta}\|^2 + \text{const}\\]
  Igualando o gradiente a zero, a solução MAP analítica é:
  \\[\boldsymbol{\theta}_{\text{MAP}} = \left(\boldsymbol{\Phi}^\top\boldsymbol{\Phi} + \frac{\sigma^2}{b^2}\boldsymbol{I}\right)^{-1}\boldsymbol{\Phi}^\top\boldsymbol{y}\\]
* **(b) Intuição Geométrica:**
  O termo de regularização penaliza magnitudes elevadas no vetor de parâmetros \\(\boldsymbol{\theta}\\), restringindo o seu comprimento Euclidiano e impedindo que a curva do modelo oscile de forma extrema para se ajustar ao ruído.
* **(c) Exemplo Numérico Pequeno em 2D:**
  Se em um modelo escalar temos \\(\boldsymbol{\Phi}^\top\boldsymbol{\Phi} = 5\\) e \\(\boldsymbol{\Phi}^\top\boldsymbol{y} = 12\\) (cuja solução MLE era \\(2,4\\)), definindo a razão de regularização \\(\lambda = \frac{\sigma^2}{b^2} = 1\\):
  \\[\theta_{\text{MAP}} = (5 + 1)^{-1}(12) = \frac{12}{6} = 2,0\\]
  A priori encolheu a inclinação de \\(2,4\\) para \\(2,0\\).
* **(d) Como aparece na Regressão Linear:**
  A estimativa MAP com priori Gaussiana é equivalente à **Regressão Ridge** (regularização \\(L_2\\)). Quando utilizada uma priori Laplaciana (norma \\(L_1\\) \\(\|\boldsymbol{\theta}\|_1\\)), obtém-se o método **LASSO**, que zera coeficientes desnecessários e produz soluções esparsas.
* **(e) Fórmulas Relevantes:**
  * Teorema de Bayes para parâmetros: \\(\log p(\boldsymbol{\theta} \mid \boldsymbol{X}, \boldsymbol{Y}) = \log p(\boldsymbol{Y} \mid \boldsymbol{X}, \boldsymbol{\theta}) + \log p(\boldsymbol{\theta}) + \text{const}\\)
  * Função de perda regularizada (\\(L_2\\) / Ridge): \\(\|\boldsymbol{y} - \boldsymbol{\Phi}\boldsymbol{\theta}\|_2^2 + \lambda \|\boldsymbol{\theta}\|_2^2, \quad \lambda = \frac{\sigma^2}{b^2}\\)
  * Solução MAP: \\(\boldsymbol{\theta}_{\text{MAP}} = \left(\boldsymbol{\Phi}^\top\boldsymbol{\Phi} + \frac{\sigma^2}{b^2}\boldsymbol{I}\right)^{-1}\boldsymbol{\Phi}^\top\boldsymbol{y}\\)

---

## mml-9.5 — Regressão Linear Bayesiana (Bayesian Linear Regression)

* **(a) Definições Formais e Notação Exata:**
  Modela os parâmetros \\(\boldsymbol{\theta}\\) como uma variável aleatória com priori Gaussiana \\(p(\boldsymbol{\theta}) = \mathcal{N}(\boldsymbol{m}_0, \boldsymbol{S}_0)\\). A posterior de parâmetros \\(p(\boldsymbol{\theta} \mid \boldsymbol{X}, \boldsymbol{Y}) = \mathcal{N}(\boldsymbol{m}_N, \boldsymbol{S}_N)\\) é calculada exatamente via técnica de completar os quadrados (*completing the squares*):
  \\[\boldsymbol{S}_N = \left(\sigma^{-2}\boldsymbol{\Phi}^\top\boldsymbol{\Phi} + \boldsymbol{S}_0^{-1}\right)^{-1}\\]
  \\[\boldsymbol{m}_N = \boldsymbol{S}_N\left(\sigma^{-2}\boldsymbol{\Phi}^\top\boldsymbol{y} + \boldsymbol{S}_0^{-1}\boldsymbol{m}_0\right)\\]
* **(b) Intuição Geométrica:**
  A abordagem Bayesiana substitui a busca por uma única curva "ótima" por uma **distribuição de probabilidade sobre o espaço de todas as funções possíveis**. A incerteza preditiva é estreita onde há abundância de dados de treino e expande-se em regiões sem dados observados.
* **(c) Exemplo Numérico Pequeno em 2D:**
  Em um novo ponto de teste \\(\boldsymbol{x}_*\\), a distribuição preditiva sobre o alvo ruidoso \\(y_*\\) é:
  \\[p(y_* \mid \boldsymbol{X}, \boldsymbol{Y}, \boldsymbol{x}_*) = \mathcal{N}\left(\boldsymbol{\phi}^\top(\boldsymbol{x}_*)\boldsymbol{m}_N, \, \boldsymbol{\phi}^\top(\boldsymbol{x}_*)\boldsymbol{S}_N\boldsymbol{\phi}(\boldsymbol{x}_*) + \sigma^2\right)\\]
  A variância total decompõe-se na soma da incerteza dos parâmetros \\(\boldsymbol{\phi}^\top(\boldsymbol{x}_*)\boldsymbol{S}_N\boldsymbol{\phi}(\boldsymbol{x}_*)\\) com a variância do ruído de medição \\(\sigma^2\\).
* **(d) Como aparece na Regressão Linear:**
  Fornece limites de confiança preditiva (ex: faixas sombreadas de 67% e 95%) e permite calcular a **verossimilhança marginal** \\(p(\boldsymbol{Y} \mid \boldsymbol{X})\\) em forma fechada para seleção de modelos.
* **(e) Fórmulas Relevantes:**
  * Covariância a Posteriori: \\(\boldsymbol{S}_N = \left(\sigma^{-2}\boldsymbol{\Phi}^\top\boldsymbol{\Phi} + \boldsymbol{S}_0^{-1}\right)^{-1}\\)
  * Média a Posteriori: \\(\boldsymbol{m}_N = \boldsymbol{S}_N\left(\sigma^{-2}\boldsymbol{\Phi}^\top\boldsymbol{y} + \boldsymbol{S}_0^{-1}\boldsymbol{m}_0\right)\\)
  * Distribuição Preditiva Posterior: \\(p(y_* \mid \boldsymbol{X}, \boldsymbol{Y}, \boldsymbol{x}_*) = \mathcal{N}\left(\boldsymbol{\phi}^\top(\boldsymbol{x}_*)\boldsymbol{m}_N, \, \boldsymbol{\phi}^\top(\boldsymbol{x}_*)\boldsymbol{S}_N\boldsymbol{\phi}(\boldsymbol{x}_*) + \sigma^2\right)\\)
  * Distribuição de Funções sem Ruído: \\(p(f(\boldsymbol{x}_*)) = \mathcal{N}\left(\boldsymbol{\phi}^\top(\boldsymbol{x}_*)\boldsymbol{m}_N, \, \boldsymbol{\phi}^\top(\boldsymbol{x}_*)\boldsymbol{S}_N\boldsymbol{\phi}(\boldsymbol{x}_*)\right)\\)
  * Verossimilhança Marginal: \\(p(\boldsymbol{Y} \mid \boldsymbol{X}) = \mathcal{N}\left(\boldsymbol{Y} \mid \boldsymbol{X}\boldsymbol{m}_0, \, \boldsymbol{X}\boldsymbol{S}_0\boldsymbol{X}^\top + \sigma^2\boldsymbol{I}\right)\\)

---

## mml-9.6 — Máxima Verossimilhança como Projeção Ortogonal

* **(a) Definições Formais e Notação Exata:**
  O vetor de alvos predito no conjunto de treino é \\(\hat{\boldsymbol{y}} = \boldsymbol{\Phi}\boldsymbol{\theta}_{\text{ML}} = \boldsymbol{\Phi}(\boldsymbol{\Phi}^\top\boldsymbol{\Phi})^{-1}\boldsymbol{\Phi}^\top\boldsymbol{y}\\). A matriz de transformação:
  \\[\boldsymbol{P}_\pi := \boldsymbol{\Phi}(\boldsymbol{\Phi}^\top\boldsymbol{\Phi})^{-1}\boldsymbol{\Phi}^\top \in \mathbb{R}^{N \times N}\\]
  é uma **matriz de projeção ortogonal** que projeta o vetor de observações \\(\boldsymbol{y} \in \mathbb{R}^N\\) sobre o subespaço \\(K\\)-dimensional gerado pelas colunas da matriz de características \\(\boldsymbol{\Phi}\\).
* **(b) Intuição Geométrica:**
  O vetor de dados reais \\(\boldsymbol{y}\\) vive em um espaço \\(N\\)-dimensional. As \\(K\\) colunas da matriz \\(\boldsymbol{\Phi}\\) geram um subespaço de dimensão \\(K \le N\\). O estimador de máxima verossimilhança realiza uma **projeção ortogonal** de \\(\boldsymbol{y}\\) sobre esse subespaço, de modo que o vetor de resíduos/erros \\((\boldsymbol{y} - \hat{\boldsymbol{y}})\\) seja estritamente perpendicular a qualquer vetor contido no subespaço de características.
* **(c) Exemplo Numérico Pequeno em 2D:**
  Para \\(N=2\\) pontos de dados e \\(K=1\\) caracteristicas (reta pela origem), o vetor observação \\(\boldsymbol{y} \in \mathbb{R}^2\\) é projetado ortogonalmente sobre a reta unidimensional gerada pelo vetor coluna \\(\boldsymbol{X} \in \mathbb{R}^2\\).
* **(d) Como aparece na Regressão Linear:**
  Revela a equivalência geométrica entre a minimização de resíduos por mínimos quadrados e as projeções ortogonais de álgebra linear. Caso as funções de base sejam ortonormais (\\(\boldsymbol{\Phi}^\top\boldsymbol{\Phi} = \boldsymbol{I}\\)), a projeção simplifica-se para \\(\hat{\boldsymbol{y}} = \boldsymbol{\Phi}\boldsymbol{\Phi}^\top\boldsymbol{y} = \sum_{k=1}^K (\boldsymbol{\phi}_k \boldsymbol{\phi}_k^\top)\boldsymbol{y}\\).
* **(e) Fórmulas Relevantes:**
  * Reconstrução Mínimos Quadrados: \\(\hat{\boldsymbol{y}} = \boldsymbol{\Phi}\boldsymbol{\theta}_{\text{ML}} = \boldsymbol{\Phi}(\boldsymbol{\Phi}^\top\boldsymbol{\Phi})^{-1}\boldsymbol{\Phi}^\top\boldsymbol{y}\\)
  * Matriz de Projeção Ortogonal: \\(\boldsymbol{P}_\pi = \boldsymbol{\Phi}(\boldsymbol{\Phi}^\top\boldsymbol{\Phi})^{-1}\boldsymbol{\Phi}^\top\\)
  * Projeção em Base Ortonormal (\\(\boldsymbol{\Phi}^\top\boldsymbol{\Phi} = \boldsymbol{I}\\)): \\(\hat{\boldsymbol{y}} = \boldsymbol{\Phi}\boldsymbol{\Phi}^\top\boldsymbol{y} = \sum_{k=1}^K (\boldsymbol{\phi}_k \boldsymbol{\phi}_k^\top)\boldsymbol{y}\\)
