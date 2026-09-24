## mml-5.2 — Derivadas Parciais e Gradiente de Funções Escalares

* **(a) Definições Formais e Notação Exata:**
  Para uma função escalar multivariada \\(f: \mathbb{R}^n \to \mathbb{R}\\) que mapeia um vetor \\(\boldsymbol{x} = [x_1, \dots, x_n]^\top \in \mathbb{R}^n\\) para um número real:
  * **Derivada Parcial:** É a derivada de \\(f\\) em relação a uma variável \\(x_i\\), mantendo todas as outras variáveis constantes:
    \\[\frac{\partial f(\boldsymbol{x})}{\partial x_i} = \lim_{\delta x \to 0} \frac{f(x_1, \dots, x_i + \delta x, \dots, x_n) - f(x_1, \dots, x_n)}{\delta x}\\]
  * **Gradiente (Seção 5.2):** É o vetor linha formado pela coleção de todas as derivadas parciais de \\(f\\) (adotando o *layout do numerador* ou *numerator layout*):
    \\[\nabla_{\boldsymbol{x}} f = \frac{df}{d\boldsymbol{x}} = \left[ \frac{\partial f(\boldsymbol{x})}{\partial x_1}, \, \frac{\partial f(\boldsymbol{x})}{\partial x_2}, \, \dots, \, \frac{\partial f(\boldsymbol{x})}{\partial x_n} \right] \in \mathbb{R}^{1 \times n}\\]

* **(b) Intuição Geométrica:**
  O gradiente aponta na **direção de maior crescimento (steepest ascent)** da função no ponto \\(\boldsymbol{x}\\). Geometricamente, o vetor gradiente negativo \\(-\nabla f(\boldsymbol{x})\\) é perpendicular às linhas de nível (curvas de contorno) da superfície da função e indica a direção de descida mais íngreme.

* **(c) Exemplo Numérico Pequeno em 2D:**
  Considere a função de duas variáveis \\(f(x_1, x_2) = x_1^2 x_2 + x_1 x_2^3\\):
  * Derivada parcial em relação a \\(x_1\\): \\(\frac{\partial f}{\partial x_1} = 2x_1 x_2 + x_2^3\\).
  * Derivada parcial em relação a \\(x_2\\): \\(\frac{\partial f}{\partial x_2} = x_1^2 + 3x_1 x_2^2\\).
  * Gradiente no ponto \\(\boldsymbol{x} =^\top\\):
    \\[\frac{df}{d\boldsymbol{x}}(1, 2) = \left[ 2(1)(2) + 2^3, \; 1^2 + 3(1)(2^2) \right] = [12, \, 13] \in \mathbb{R}^{1 \times 2}\\]

* **(d) Aplicação nos Modelos (Regressão Linear / ML):**
  Na **Regressão Linear**, a função de perda de mínimos quadrados é \\(L(\boldsymbol{\theta}) = \frac{1}{2\sigma^2} \|\boldsymbol{y} - \boldsymbol{\Phi}\boldsymbol{\theta}\|_2^2\\). O gradiente da perda em relação ao vetor de parâmetros \\(\boldsymbol{\theta}\\) guia a atualização por **Gradient Descent** para encontrar os pesos ideais.

* **(e) Fórmulas Relevantes:**
  * Gradiente (vetor linha): \\(\frac{df}{d\boldsymbol{x}} = \left[ \frac{\partial f}{\partial x_1}, \dots, \frac{\partial f}{\partial x_n} \right] \in \mathbb{R}^{1 \times n}\\)
  * Regra da cadeia multivariada para \\(h(t) = f(g(t))\\): \\(\frac{dh}{dt} = \frac{\partial f}{\partial \boldsymbol{x}} \frac{\partial \boldsymbol{x}}{\partial t} \in \mathbb{R}\\)

---

## mml-5.3 — Matriz Jacobiana (Gradiente de Funções Vetoriais)

* **(a) Definições Formais e Notação Exata:**
  Para uma função vetorial \\(\boldsymbol{f}: \mathbb{R}^n \to \mathbb{R}^m\\) que mapeia um vetor de entrada \\(\boldsymbol{x} \in \mathbb{R}^n\\) para um vetor de saída \\(\boldsymbol{f}(\boldsymbol{x}) = [f_1(\boldsymbol{x}), \dots, f_m(\boldsymbol{x})]^\top \in \mathbb{R}^m\\) (Seção 5.3):
  * **Matriz Jacobiana:** É a matriz de dimensão \\(m \times n\\) cujas linhas contêm os gradientes das funções componentes \\(f_i\\):
    \\[\boldsymbol{J} = \frac{d\boldsymbol{f}(\boldsymbol{x})}{d\boldsymbol{x}} = \begin{bmatrix} \frac{\partial f_1(\boldsymbol{x})}{\partial x_1} & \dots & \frac{\partial f_1(\boldsymbol{x})}{\partial x_n} \\ \vdots & \ddots & \vdots \\ \frac{\partial f_m(\boldsymbol{x})}{\partial x_1} & \dots & \frac{\partial f_m(\boldsymbol{x})}{\partial x_n} \end{bmatrix} \in \mathbb{R}^{m \times n}\\]
    onde \\(J_{ij} = \frac{\partial f_i}{\partial x_j}\\).

* **(b) Intuição Geométrica:**
  A matriz Jacobiana representa a **melhor aproximação linear local** de uma transformação não-linear no ponto considerado. O valor absoluto do seu determinante \\(|\det(\boldsymbol{J})|\\) (quando \\(m = n\\)) mede o **fator de escala de variação de área ou volume** entre o espaço de entrada e o espaço transformado.

* **(c) Exemplo Numérico Pequeno em 2D:**
  Dada a transformação linear \\(\boldsymbol{f}(\boldsymbol{x}) = \boldsymbol{A}\boldsymbol{x}\\) para \\(\boldsymbol{A} \in \mathbb{R}^{2 \times 2}\\) e \\(\boldsymbol{x} \in \mathbb{R}^2\\):
  \\[f_1(\boldsymbol{x}) = A_{11}x_1 + A_{12}x_2, \quad f_2(\boldsymbol{x}) = A_{21}x_1 + A_{22}x_2\\]
  A Jacobiana é simplesmente a própria matriz da transformação:
  \\[\boldsymbol{J} = \frac{d\boldsymbol{f}}{d\boldsymbol{x}} = \begin{bmatrix} A_{11} & A_{12} \\ A_{21} & A_{22} \end{bmatrix} = \boldsymbol{A} \in \mathbb{R}^{2 \times 2}\\]

* **(d) Aplicação nos Modelos (GMM / Mudança de Variáveis):**
  Na **Estimativa de Densidade e GMM**, a Jacobiana é usada na **técnica de mudança de variáveis** (*change of variables*) para transformar distribuições de probabilidade de variáveis aleatórias contínuas, onde o fator \\(|\det(\boldsymbol{J})|\\) garante a conservação da massa total de probabilidade.

* **(e) Fórmulas Relevantes:**
  * Matriz Jacobiana: \\(\boldsymbol{J} = \frac{d\boldsymbol{f}}{d\boldsymbol{x}} \in \mathbb{R}^{m \times n}\\) com \\(J_{ij} = \frac{\partial f_i}{\partial x_j}\\)
  * Regra da Cadeia Vetorial: \\(\frac{d(\boldsymbol{g} \circ \boldsymbol{f})}{d\boldsymbol{x}} = \frac{d\boldsymbol{g}}{d\boldsymbol{f}} \frac{d\boldsymbol{f}}{d\boldsymbol{x}} \in \mathbb{R}^{k \times n}\\) para \\(\boldsymbol{f}: \mathbb{R}^n \to \mathbb{R}^m, \boldsymbol{g}: \mathbb{R}^m \to \mathbb{R}^k\\)
  * Derivada da perda quadrática: \\(\frac{\partial \|\boldsymbol{y} - \boldsymbol{\Phi}\boldsymbol{\theta}\|_2^2}{\partial \boldsymbol{\theta}} = -2(\boldsymbol{y} - \boldsymbol{\Phi}\boldsymbol{\theta})^\top \boldsymbol{\Phi} \in \mathbb{R}^{1 \times D}\\)

---

## mml-5.4 — Gradientes de Matrizes e Tensores

* **(a) Definições Formais e Notação Exata:**
  Quando se calcula a derivada de uma função cujas entradas ou saídas são matrizes (Seção 5.4):
  * Se \\(f: \mathbb{R}^{M \times N} \to \mathbb{R}\\), o gradiente \\(\frac{\partial f}{\partial \boldsymbol{A}} \in \mathbb{R}^{1 \times (M \times N)}\\) pode ser arranjado como uma matriz de dimensão \\(M \times N\\) ou como um vetor achatado (*flattened*) de tamanho \\(MN\\).
  * Se \\(\boldsymbol{f}: \mathbb{R}^{N} \to \mathbb{R}^M\\) com \\(\boldsymbol{f}(\boldsymbol{x}) = \boldsymbol{A}\boldsymbol{x}\\), o gradiente em relação à matriz \\(\boldsymbol{A}\\) é um **tensor de ordem 3** de dimensão \\(M \times (M \times N)\\) ou \\(M \times M \times N\\).

* **(b) Intuição Geométrica:**
  Estende o conceito de taxa de variação para espaços de dimensão superior. O gradiente matricial rastreia como pequenas perturbações em cada entrada de uma grade matricial afetam a saída do sistema.

* **(c) Exemplo Numérico Pequeno em 2D:**
  Para \\(f(\boldsymbol{A}) = \text{tr}(\boldsymbol{A})\\), onde \\(\boldsymbol{A} \in \mathbb{R}^{2 \times 2}\\):
  \\[f(\boldsymbol{A}) = A_{11} + A_{22}\\]
  A derivada de \\(f\\) em relação a cada elemento de \\(\boldsymbol{A}\\) é:
  \\[\frac{\partial f}{\partial \boldsymbol{A}} = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} = \boldsymbol{I}_2\\]

* **(d) Aplicação nos Modelos (Classificação / Redes Neurais):**
  Em **Redes Neurais (MLP)** e **Classificadores**, é necessário calcular a derivada da função de perda em relação às matrizes de pesos \\(\boldsymbol{W}^{(l)}\\) de cada camada intermediária para realizar a atualização do modelo.

* **(e) Fórmulas Relevantes (Identidades Úteis - Seção 5.5):**
  * \\(\frac{\partial \boldsymbol{a}^\top \boldsymbol{X} \boldsymbol{b}}{\partial \boldsymbol{X}} = \boldsymbol{a}\boldsymbol{b}^\top\\)
  * \\(\frac{\partial \boldsymbol{x}^\top \boldsymbol{B} \boldsymbol{x}}{\partial \boldsymbol{x}} = \boldsymbol{x}^\top(\boldsymbol{B} + \boldsymbol{B}^\top)\\)
  * \\(\frac{\partial}{\partial \boldsymbol{s}} (\boldsymbol{x} - \boldsymbol{A}\boldsymbol{s})^\top \boldsymbol{W} (\boldsymbol{x} - \boldsymbol{A}\boldsymbol{s}) = -2(\boldsymbol{x} - \boldsymbol{A}\boldsymbol{s})^\top \boldsymbol{W}\boldsymbol{A}\\) (para \\(\boldsymbol{W}\\) simétrica)
  * \\(\frac{\partial \text{tr}(\boldsymbol{f}(\boldsymbol{X}))}{\partial \boldsymbol{X}} = \text{tr}\left( \frac{\partial \boldsymbol{f}(\boldsymbol{X})}{\partial \boldsymbol{X}} \right)\\)

---

## mml-5.6 — Backpropagation e Diferenciação Automática

* **(a) Definições Formais e Notação Exata:**
  O algoritmo de **Backpropagation** (Seção 5.6) é uma aplicação eficiente da regra da cadeia para calcular gradientes em Grafos de Computação compostos por funções encadeadas:
  * Para uma função composta \\(y = f_K(f_{K-1}(\dots f_1(\boldsymbol{x})\dots))\\), define-se o *Forward Pass* (fluxo de ativações para a frente) e o *Backward Pass* (propagação dos erros e derivadas parciais para trás via Jacobiana).
  * **Modo Reverso (Reverse Mode Auto-Diff):** Aplica a associatividade da multiplicação matricial da direita para a esquerda:
    \\[\frac{dy}{d\boldsymbol{x}} = \left(\frac{dy}{db} \frac{db}{da}\right) \frac{da}{d\boldsymbol{x}}\\]

* **(b) Intuição Geométrica:**
  Permite navegar de forma reversa sobre a topologia do grafo de computação, decompondo uma função não-linear altamente complexa em uma sequência de transformações locais simples e propagando a sinalização do erro do topo até os parâmetros de entrada.

* **(c) Exemplo Numérico Pequeno em 2D:**
  Seja o grafo de computação \\(a = x^2\\), \\(b = \exp(a)\\), \\(y = b\\):
  1. *Forward:* Para \\(x = 1 \implies a = 1, b = e \approx 2,718, y = e\\).
  2. *Local Derivatives:* \\(\frac{\partial a}{\partial x} = 2x = 2\\), \\(\frac{\partial b}{\partial a} = e^a = e\\), \\(\frac{\partial y}{\partial b} = 1\\).
  3. *Backward:* \\(\frac{\partial y}{\partial x} = \frac{\partial y}{\partial b} \cdot \frac{\partial b}{\partial a} \cdot \frac{\partial a}{\partial x} = 1 \cdot e \cdot 2 = 2e \approx 5,436\\).

* **(d) Aplicação nos Modelos (Perceptron Multicamada / Redes Neurais):**
  É a espinha dorsal computacional do **Perceptron Multicamada (MLP)** para calcular o gradiente da função de perda \\(L\\) com respeito aos pesos \\(\boldsymbol{A}_i\\) e vieses \\(\boldsymbol{b}_i\\) em todas as camadas \\(i = 1, \dots, K\\):
  \\[\frac{\partial L}{\partial \boldsymbol{A}_i} = \frac{\partial L}{\partial \boldsymbol{f}_K} \frac{\partial \boldsymbol{f}_K}{\partial \boldsymbol{f}_{K-1}} \dots \frac{\partial \boldsymbol{f}_{i+1}}{\partial \boldsymbol{A}_i}\\]

* **(e) Fórmulas Relevantes:**
  * Regra da Cadeia em Grafos: \\(\frac{\partial f}{\partial x} = \sum_{j \in \text{parents}(x)} \frac{\partial f}{\partial z_j} \frac{\partial z_j}{\partial x}\\)
  * Camada de Rede Neural: \\(\boldsymbol{f}_i = \sigma(\boldsymbol{A}_{i-1}\boldsymbol{x}_{i-1} + \boldsymbol{b}_{i-1})\\)

---

## mml-5.7 — Matriz Hessiana e Derivadas de Ordem Superior

* **(a) Definições Formais e Notação Exata:**
  Para uma função escalar duplamente diferenciável \\(f: \mathbb{R}^n \to \mathbb{R}\\) (Seção 5.7):
  * **Matriz Hessiana:** É a matriz quadrada de dimensão \\(n \times n\\) contendo todas as derivadas parciais de segunda ordem:
    \\[\boldsymbol{H} = \nabla_{\boldsymbol{x}}^2 f(\boldsymbol{x}) = \begin{bmatrix} \frac{\partial^2 f}{\partial x_1^2} & \frac{\partial^2 f}{\partial x_1 \partial x_2} & \dots & \frac{\partial^2 f}{\partial x_1 \partial x_n} \\ \frac{\partial^2 f}{\partial x_2 \partial x_1} & \frac{\partial^2 f}{\partial x_2^2} & \dots & \frac{\partial^2 f}{\partial x_2 \partial x_n} \\ \vdots & \vdots & \ddots & \vdots \\ \frac{\partial^2 f}{\partial x_n \partial x_1} & \frac{\partial^2 f}{\partial x_n \partial x_2} & \dots & \frac{\partial^2 f}{\partial x_n^2} \end{bmatrix} \in \mathbb{R}^{n \times n}\\]
  * Pelo **Teorema de Schwarz**, se as derivadas parciais de segunda ordem forem contínuas, a ordem de diferenciação não importa (\\(\frac{\partial^2 f}{\partial x_i \partial x_j} = \frac{\partial^2 f}{\partial x_j \partial x_i}\\)), tornando a matriz Hessiana **simétrica** (\\(\boldsymbol{H} = \boldsymbol{H}^\top\\)).

* **(b) Intuição Geométrica:**
  A matriz Hessiana mede a **curvatura local** da superfície da função em torno do ponto \\(\boldsymbol{x}\\).
  * Se \\(\boldsymbol{H}\\) for **definida positiva** no ponto crítico (\\(\nabla f = \mathbf{0}\\)), a superfície tem o formato de uma "tigela" e o ponto é um **mínimo local**.
  * Se \\(\boldsymbol{H}\\) tiver autovalores positivos e negativos, o ponto crítico é um **ponto de sela** (*saddle point*).

* **(c) Exemplo Numérico Pequeno em 2D:**
  Dada a função \\(f(x, y) = x^2 + 2xy + 3y^2\\):
  1. Derivadas de 1ª ordem: \\(\frac{\partial f}{\partial x} = 2x + 2y\\), \\(\frac{\partial f}{\partial y} = 2x + 6y\\).
  2. Derivadas de 2ª ordem: \\(\frac{\partial^2 f}{\partial x^2} = 2\\), \\(\frac{\partial^2 f}{\partial y^2} = 6\\), \\(\frac{\partial^2 f}{\partial x \partial y} = 2\\).
  3. Matriz Hessiana:
     \\[\boldsymbol{H} = \begin{bmatrix} 2 & 2 \\ 2 & 6 \end{bmatrix}\\]

* **(d) Aplicação nos Modelos (Otimização Continuada / Newton-Raphson):**
  A Hessiana é usada nos **métodos de otimização de segunda ordem** (como o Método de Newton) e na análise de convexidade da função de perda da **Regressão Linear** e de **GMMs**, onde a Hessiana positiva definida garante convergência global para o mínimo.

* **(e) Fórmulas Relevantes:**
  * Matriz Hessiana: \\(H_{ij} = \frac{\partial^2 f}{\partial x_i \partial x_j}\\)
  * Simetria (Teorema de Schwarz): \\(\frac{\partial^2 f}{\partial x \partial y} = \frac{\partial^2 f}{\partial y \partial x} \implies \boldsymbol{H} = \boldsymbol{H}^\top\\)

---

## mml-5.8 — Linearização e Séries de Taylor Multivariadas

* **(a) Definições Formais e Notação Exata:**
  A **Série de Taylor Multivariada** (Seção 5.8) aproxima uma função diferenciável \\(f: \mathbb{R}^n \to \mathbb{R}\\) em torno de um ponto de suporte \\(\boldsymbol{x}_0\\):
  \\[f(\boldsymbol{x}) = f(\boldsymbol{x}_0) + D_{\boldsymbol{x}}^1 f(\boldsymbol{x}_0) \boldsymbol{\delta} + \frac{1}{2!} D_{\boldsymbol{x}}^2 f(\boldsymbol{x}_0) \boldsymbol{\delta}^2 + \frac{1}{3!} D_{\boldsymbol{x}}^3 f(\boldsymbol{x}_0) \boldsymbol{\delta}^3 + \dots\\]
  onde \\(\boldsymbol{\delta} = \boldsymbol{x} - \boldsymbol{x}_0\\), \\(D_{\boldsymbol{x}}^1 f(\boldsymbol{x}_0) = \nabla_{\boldsymbol{x}} f(\boldsymbol{x}_0)\\) é o gradiente e \\(D_{\boldsymbol{x}}^2 f(\boldsymbol{x}_0) = \boldsymbol{H}(\boldsymbol{x}_0)\\) é a matriz Hessiana.
  * **Linearização (Aproximação de 1ª ordem):**
    \\[f(\boldsymbol{x}) \approx f(\boldsymbol{x}_0) + \nabla_{\boldsymbol{x}} f(\boldsymbol{x}_0) (\boldsymbol{x} - \boldsymbol{x}_0)\\]
  * **Aproximação Quadrática (2ª ordem):**
    \\[f(\boldsymbol{x}) \approx f(\boldsymbol{x}_0) + \nabla_{\boldsymbol{x}} f(\boldsymbol{x}_0) (\boldsymbol{x} - \boldsymbol{x}_0) + \frac{1}{2} (\boldsymbol{x} - \boldsymbol{x}_0)^\top \boldsymbol{H}(\boldsymbol{x}_0) (\boldsymbol{x} - \boldsymbol{x}_0)\\]

* **(b) Intuição Geométrica:**
  A aproximação de 1ª ordem substitui a superfície complexa da função por um **plano tangente** no ponto \\(\boldsymbol{x}_0\\). A aproximação de 2ª ordem ajusta um **paraboloide quadrático** local que captura a inclinação e a curvatura da superfície.

* **(c) Exemplo Numérico Pequeno em 2D:**
  Dada a função \\(f(x, y) = x^2 + 2xy + 3y^2\\), expandida em torno de \\((x_0, y_0) = (1, 2)\\):
  1. \\(f(1, 2) = 1^2 + 2(1)(2) + 3(2^2) = 13\\).
  2. Gradiente em \\((1, 2)\\): \\(\nabla f(1, 2) = [6, \, 14]\\).
  3. Hessiana em \\((1, 2)\\): \\(\boldsymbol{H} = \begin{bmatrix} 2 & 2 \\ 2 & 6 \end{bmatrix}\\).
  4. Expansão de Taylor até 2ª ordem:
     \\[f(x, y) \approx 13 + [6, \, 14] \begin{bmatrix} x - 1 \\ y - 2 \end{bmatrix} + \frac{1}{2} \begin{bmatrix} x - 1 & y - 2 \end{bmatrix} \begin{bmatrix} 2 & 2 \\ 2 & 6 \end{bmatrix} \begin{bmatrix} x - 1 \\ y - 2 \end{bmatrix}\\]

* **(d) Aplicação nos Modelos (ML):**
  A linearização por Séries de Taylor é fundamental em **algoritmos de otimização contínua** (como aproximações locais de perdas convexas) e no **Filtro de Kalman Estendido** (EKF) para linearizar equações de transição não-lineares.

* **(e) Fórmulas Relevantes:**
  * Linearização de 1ª ordem: \\(f(\boldsymbol{x}) \approx f(\boldsymbol{x}_0) + \nabla_{\boldsymbol{x}} f(\boldsymbol{x}_0)(\boldsymbol{x} - \boldsymbol{x}_0)\\)
  * Aproximação Quadrática: \\(f(\boldsymbol{x}) \approx f(\boldsymbol{x}_0) + \nabla f(\boldsymbol{x}_0)\boldsymbol{\delta} + \frac{1}{2}\boldsymbol{\delta}^\top \boldsymbol{H}(\boldsymbol{x}_0)\boldsymbol{\delta}\\)

---