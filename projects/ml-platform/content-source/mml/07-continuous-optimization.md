# mml-7 — Continuous Optimization

## mml-7.1 — Otimização Não-Restrita e Descida do Gradiente (Gradient Descent & SGD)

#### **(a) Definições Formais e Notação Exata**
Dado um problema de otimização contínua não-restrito para uma função objetivo diferenciável \\(f: \mathbb{R}^n \to \mathbb{R}\\), o objetivo é encontrar um ponto de mínimo local \\(x^* \in \arg\min_x f(x)\\). 
O algoritmo de **Descida do Gradiente (Gradient Descent)** gera uma sequência de estimativas \\(\{x_0, x_1, x_2, \dots\}\\) a partir de um ponto inicial \\(x_0\\) usando a regra de atualização iterativa:
\\[x_{i+1} = x_i - \gamma_i ((\nabla f)(x_i))^\top\\]
onde \\(\gamma_i \ge 0\\) representa a taxa de aprendizado ou tamanho do passo (*step-size*).
Quando a função de perda em machine learning é decomposta como a soma dos erros sobre \\(N\\) amostras observadas, \\(L(\theta) = \sum_{n=1}^N L_n(\theta)\\), a atualização em lote (**Batch Gradient Descent**) é dada por:
\\[\theta_{i+1} = \theta_i - \gamma_i \sum_{n=1}^N (\nabla L_n(\theta_i))^\top\\]
No **Stochastic Gradient Descent (SGD)**, a atualização utiliza apenas um ponto de dado (ou mini-batch) por iteração, reduzindo a complexidade computacional por passo:
\\[\theta_{i+1} = \theta_i - \gamma_i (\nabla L_n(\theta_i))^\top\\]

#### **(b) Intuição Geométrica**
O vetor gradiente \\((\nabla f)(x_i)\\) aponta na direção de maior crescimento da superfície da função. Consequentemente, o vetor oposto \\(-\nabla f(x_i)\\) aponta para a direção de descida mais íngreme, sendo perpendicular às linhas de nível (curvas de contorno de valor constante) da função. O parâmetro \\(\gamma_i\\) controla a distância percorrida nessa direção ao longo da superfície.

#### **(c) Exemplo Numérico em 2D**
Considere a otimização da função quadrática bidimensional de \\(f: \mathbb{R}^2 \to \mathbb{R}\\):
\\[f\left(\begin{bmatrix} x_1 \\ x_2 \end{bmatrix}\right) = \frac{1}{2} \begin{bmatrix} x_1 \\ x_2 \end{bmatrix}^\top \begin{bmatrix} 2 & 1 \\ 1 & 20 \end{bmatrix} \begin{bmatrix} x_1 \\ x_2 \end{bmatrix} - \begin{bmatrix} 5 \\ 3 \end{bmatrix}^\top \begin{bmatrix} x_1 \\ x_2 \end{bmatrix}\\]
Cujo gradiente é dado por \\(\nabla f(x) = \begin{bmatrix} x_1 \\ x_2 \end{bmatrix}^\top \begin{bmatrix} 2 & 1 \\ 1 & 20 \end{bmatrix} - \begin{bmatrix} 5 \\ 3 \end{bmatrix}^\top\\).
Iniciando no ponto \\(x_0 = [-3, -1]^\top\\) com tamanho de passo \\(\gamma = 0,085\\), obtém-se o primeiro passo \\(x_1 = [-1,98; 1,21]^\top\\) e o segundo ponto \\(x_2 = [-1,32; -0,42]^\top\\), convergindo progressivamente para o centro das elipses de contorno no ponto mínimo.

#### **(d) Aplicação nos Modelos**
* **Regressão Linear:** O otimizador SGD é utilizado para encontrar os parâmetros de peso \\(\theta\\) que minimizam a perda de mínimos quadrados ou a verossimilhança negativa em grandes conjuntos de dados.
* **GMM e Redes Neurais:** É a ferramenta numérica padrão para otimizar funções de perda não-convexas onde não há solução em forma fechada.

#### **(e) Fórmulas Relevantes**
* **Regra da Descida do Gradiente:** \\(x_{i+1} = x_i - \gamma_i ((\nabla f)(x_i))^\top\\)
* **Perda Empírica Acumulada:** \\(L(\theta) = \sum_{n=1}^N L_n(\theta)\\)
* **Atualização por Batch GD:** \\(\theta_{i+1} = \theta_i - \gamma_i \sum_{n=1}^N (\nabla L_n(\theta_i))^\top\\)

---

## mml-7.2 — Otimização Restrita e Multiplicadores de Lagrange (Constrained Optimization & Lagrange Multipliers)

#### **(a) Definições Formais e Notação Exata**
Em problemas de minimização restrita, busca-se minimizar \\(f(x)\\) sujeito a restrições de igualdade ou desigualdade \\(g_i(x) \le 0\\) para \\(i = 1, \dots, m\\).
Incorporam-se as restrições na função objetivo através dos **Multiplicadores de Lagrange** \\(\lambda_i \ge 0\\). A função **Lagrangiana** Primal \\(\mathcal{L}(x, \lambda)\\) é definida como:
\\[\mathcal{L}(x, \lambda) = f(x) + \sum_{i=1}^m \lambda_i g_i(x) = f(x) + \lambda^\top g(x)\\]
onde exige-se a restrição de não-negatividade dos multiplicadores \\(\lambda \ge \mathbf{0}\\).

#### **(b) Intuição Geométrica**
Quando restrições são impostas, o mínimo irrestrito da função pode ficar fora da **região viável** (*feasible region*). Na solução ótima restrita localizada na fronteira do conjunto viável, o gradiente da função objetivo \\(\nabla f(x)\\) e o gradiente da restrição \\(\nabla g(x)\\) tornam-se perfeitamente colineares e opostos (\\(\nabla f(x) = -\lambda \nabla g(x)\\)), anulando qualquer componente de movimento que reduza o custo sem violar a fronteira.

#### **(c) Exemplo Numérico em 2D**
Considere a minimização de uma função de duas variáveis sujeita a restrições de caixa \\(-1 \le x_1 \le 1\\) e \\(-1 \le x_2 \le 1\\). O mínimo não-restrito encontra-se no ponto exterior \\((2, 0)\\), mas o sistema de multiplicadores de Lagrange força a solução a se deslocar exatamente para o bordo do quadrado viável no ponto \\((1, 0)\\).

#### **(d) Aplicação nos Modelos**
* **Classificação (Support Vector Machines - SVM):** A maximização da margem com a restrição de classificação correta \\(y_n(w^\top x_n + b) \ge 1\\) é formalizada pela função Lagrangiana e resolvida na forma dual.
* **PCA:** Usado na maximização da variância projetada sujeita à restrição de norma unitária \\(\|b_1\|^2 = 1\\).

#### **(e) Fórmulas Relevantes**
* **Função Lagrangiana Primal:** \\(\mathcal{L}(x, \lambda) = f(x) + \lambda^\top g(x)\\) com \\(\lambda \ge \mathbf{0}\\)
* **Condição de Estacionariedade:** \\(\nabla_x \mathcal{L}(x, \lambda) = \mathbf{0}\\)

---

## mml-7.3 — Otimização Convexa, Conjuntos e Funções Convexas (Convex Optimization, Sets & Functions)

#### **(a) Definições Formais e Notação Exata**
* **Conjunto Convexo (Definição 7.2):** Um conjunto \\(C\\) é convexo se, para quaisquer \\(x, y \in C\\) e qualquer escalar \\(\theta \in\\), a combinação linear pertencer ao conjunto:
  \\[\theta x + (1 - \theta) y \in C\\]
* **Função Convexa:** Uma função \\(f: \mathbb{R}^n \to \mathbb{R}\\) é convexa se cumpre a **Desigualdade de Jensen** para todo \\(\theta \in\\):
  \\[f(\theta x + (1 - \theta)y) \le \theta f(x) + (1 - \theta)f(y)\\]
* **Critério de Primeira Ordem (Gradiente):** Se \\(f\\) for diferenciável, ela é convexa se e somente se para todo \\(x, y\\):
  \\[f(y) \ge f(x) + \nabla_x f(x)^\top (y - x)\\]
* **Critério de Segunda Ordem (Hessiana):** Se \\(f\\) for duplamente diferenciável, \\(f\\) é convexa se e somente se sua matriz Hessiana \\(\nabla_x^2 f(x)\\) for semi-definida positiva (PSD) em todo o seu domínio.

#### **(b) Intuição Geométrica**
* **Conjunto Convexo:** O segmento de reta direto conectando qualquer par de pontos do conjunto permanece totalmente interior ao conjunto.
* **Função Convexa:** A corda retilínea unindo dois pontos do gráfico da função fica sempre situada *acima* da curva da função. Geometricamente, o plano tangente de \\(1^\text{a}\\) ordem em qualquer ponto situa-se sempre *abaixo* de todo o gráfico. Em funções convexas, qualquer mínimo local é garantidamente o **mínimo global**.

#### **(c) Exemplo Numérico em 2D**
Considere a função de entropia negativa \\(f(x) = x \log_2 x\\) definida para \\(x > 0\\). Avaliando a convexidade entre \\(x = 2\\) e \\(y = 4\\) no ponto médio (\\(\theta = 0,5\\)):
* Lado esquerdo (ponto médio): \\(f(0,5 \cdot 2 + 0,5 \cdot 4) = f(3) = 3 \log_2 3 \approx 4,75\\).
* Lado direito (combinação das saídas): \\(0,5 f(2) + 0,5 f(4) = 0,5(2) + 0,5(8) = 5,0\\).
Como \\(4,75 \le 5,0\\), a condição de convexidade é satisfeita. A reta tangente em \\(x=2\\) é \\(y \approx 6,9\\), mantendo-se estritamente abaixo do valor real \\(f(4) = 8\\).

#### **(d) Aplicação nos Modelos**
* **Regressão Linear / Mínimos Quadrados:** A função de perda quadrática \\(\|y - X\theta\|^2\\) possui Hessiana \\(X^\top X \succeq \mathbf{0}\\), assegurando convexidade e um único mínimo global.
* **SVM:** O problema de maximização da margem é convexo, prevenindo a estagnação em mínimos locais.

#### **(e) Fórmulas Relevantes**
* **Desigualdade de Jensen (Convexidade):** \\(f(\theta x + (1-\theta)y) \le \theta f(x) + (1-\theta)f(y)\\)
* **Aproximação Tangencial Inferior (1ª Ordem):** \\(f(y) \ge f(x) + \nabla_x f(x)^\top (y - x)\\)
* **Condição Hessiana PSD (2ª Ordem):** \\(\nabla_x^2 f(x) \succeq \mathbf{0}\\)

---

## mml-7.4 — Programação Linear (LP) e Programação Quadrática (QP)

#### **(a) Definições Formais e Notação Exata**
* **Programação Linear (Linear Programming - LP):** Problema onde a função objetivo e as restrições são afins/lineares:
  \\[\min_{x \in \mathbb{R}^d} c^\top x \quad \text{sujeito a} \quad A x \le b\\]
* **Programação Quadrática (Quadratic Programming - QP):** Problema com função objetivo quadrática e restrições afins:
  \\[\min_{x \in \mathbb{R}^d} \frac{1}{2} x^\top Q x + c^\top x \quad \text{sujeito a} \quad A x \le b\\]
  onde \\(Q \in \mathbb{R}^{d \times d}\\) é uma matriz simétrica definida positiva (SPD) que garante convexidade.

#### **(b) Intuição Geométrica**
* **Programação Linear:** A função objetivo forma linhas de nível retas paralelas, enquanto o conjunto de restrições forma um polígono/polítopo viável convexo no espaço. O valor ótimo é sempre atingido em um dos vértices (cantos) do polítopo.
* **Programação Quadrática:** As curvas de nível da função objetivo são elípses concêntricas. O ótimo restrito atinge o contorno elíptico de menor valor objetivo que tangencia o polígono de restrições.

#### **(c) Exemplo Numérico em 2D**
Considere o problema de Programação Quadrática em \\(\mathbb{R}^2\\):
\\[\min_{x \in \mathbb{R}^2} \frac{1}{2} \begin{bmatrix} x_1 \\ x_2 \end{bmatrix}^\top \begin{bmatrix} 2 & 1 \\ 1 & 4 \end{bmatrix} \begin{bmatrix} x_1 \\ x_2 \end{bmatrix} + \begin{bmatrix} 5 \\ 3 \end{bmatrix}^\top \begin{bmatrix} x_1 \\ x_2 \end{bmatrix} \quad \text{sujeito a} \quad \begin{bmatrix} 1 & 0 \\ -1 & 0 \\ 0 & 1 \\ 0 & -1 \end{bmatrix} \begin{bmatrix} x_1 \\ x_2 \end{bmatrix} \le \begin{bmatrix} 1 \\ 1 \\ 1 \\ 1 \end{bmatrix}\\]
As restrições delimitam uma caixa quadrada viável \\([-1, 1] \times [-1, 1]\\). O ponto mínimo restrito é encontrado no Ponto de Sela (*Saddle Point*) da Lagrangiana na borda da caixa.

#### **(d) Aplicação nos Modelos**
* **Support Vector Machines (SVM):** O problema de otimização de margem rígida e suave da SVM é formulado e resolvido diretamente através de um programa quadrático (QP).

#### **(e) Fórmulas Relevantes**
* **Formulação Primal de QP:** \\(\min_x \frac{1}{2} x^\top Q x + c^\top x\\) s.t. \\(A x \le b\\)
* **Lagrangiana Dual de QP:** \\(D(\lambda) = -\frac{1}{2}(c + A^\top \lambda)^\top Q^{-1}(c + A^\top \lambda) - \lambda^\top b\\)
* **Problema Dual de QP:** \\(\max_{\lambda \ge \mathbf{0}} D(\lambda)\\)

---

## mml-7.5 — Transformada de Legendre-Fenchel e Conjugado Convexo (Convex Conjugate & Duality)

#### **(a) Definições Formais e Notação Exata**
**Conjugado Convexo / Transformada de Legendre-Fenchel (Definição 7.4):** O conjugado convexo \\(f^*\\) de uma função \\(f: \mathbb{R}^D \to \mathbb{R}\\) é definido por:
\\[f^*(s) = \sup_{x \in \mathbb{R}^D} (\langle s, x \rangle - f(x))\\]
adotando o produto escalar habitual \\(\langle s, x \rangle = s^\top x\\).

#### **(b) Intuição Geométrica**
Qualquer função ou conjunto convexo pode ser descrito de forma equivalente pela coleção de seus **hiperplanos de suporte** (*supporting hyperplanes*). Para cada vetor de inclinação/gradiente \\(s\\), a transformada calcula o intercepto \\(c\\) da reta \\(y = s^\top x + c\\) ajustada de modo que ela tangencie a função \\(f(x)\\) por baixo. O conjugado \\(f^*(s)\\) representa o valor desse intercepto em função da inclinação \\(s\\).

#### **(c) Exemplo Numérico em 2D**
Para a função quadrática \\(f(y) = \frac{\lambda}{2} y^\top K^{-1} y\\) construída sobre uma matriz definida positiva \\(K \in \mathbb{R}^{n \times n}\\) e escalar \\(\lambda > 0\\):
Derivando a expressão \\(s^\top y - \frac{\lambda}{2} y^\top K^{-1} y\\) em relação a \\(y\\) e igualando a zero, encontra-se o ponto ótimo \\(y = \frac{1}{\lambda} K s\\).
Substituindo esse valor na definição de supremum, deriva-se a função conjugada:
\\[f^*(\alpha) = \frac{1}{2\lambda} \alpha^\top K \alpha\\]

#### **(d) Aplicação nos Modelos**
* **Suavização da Perda em SVM:** Utilizado para derivar a formulação dual da SVM e para suavizar a função de perda não-diferenciável *Hinge Loss* \\(\max\{0, 1 - t\}\\), permitindo o uso de métodos de gradiente de segunda ordem (como L-BFGS).

#### **(e) Fórmulas Relevantes**
* **Definição do Conjugado Convexo:** \\(f^*(s) = \sup_x (s^\top x - f(x))\\)
* **Conjugado da Soma de Perdas:** \\(\mathcal{L}^*(z) = \sum_{i=1}^n \ell_i^*(z_i)\\) para \\(\mathcal{L}(t) = \sum_{i=1}^n \ell_i(t_i)\\)
