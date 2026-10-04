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

## mml-7.3.1 — Programação Linear (Linear Programming)

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

## mml-7.3.2 — Programação Quadrática (Quadratic Programming)

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

## mml-7.3.3 — Transformada de Legendre–Fenchel e Conjugado Convexo (Legendre–Fenchel Transform and Convex Conjugate)

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