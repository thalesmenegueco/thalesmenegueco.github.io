# mml-9 — Linear Regression

## mml-9.1 — Formulação do Problema (Problem Formulation)

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

## mml-9.2 — Estimativa de Parâmetros (Parameter Estimation)

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

## mml-9.2.1 — Estimativa de Máxima Verossimilhança (Maximum Likelihood Estimation)

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

## mml-9.2.2 — Overfitting na Regressão Linear (Overfitting in Linear Regression)

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

## mml-9.2.3 — Estimativa Máxima a Posteriori (Maximum A Posteriori Estimation)

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

## mml-9.2.4 — Estimativa MAP como Regularização (MAP Estimation as Regularization)

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

## mml-9.3 — Regressão Linear Bayesiana (Bayesian Linear Regression)

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

## mml-9.4 — Máxima Verossimilhança como Projeção Ortogonal (Maximum Likelihood as Orthogonal Projection)

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
