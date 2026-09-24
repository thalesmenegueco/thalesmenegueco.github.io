## Capítulo 12

### **1. Hiperplanos Separadores e Classificação Linear (Seção 12.1)**

* **(a) Definições Formais e Notação Exata:**
  * **Problema de Classificação Binária:** Dado um conjunto de dados de treinamento supervisionado \\(\mathcal{D} = \{(\boldsymbol{x}_1, y_1), \dots, (\boldsymbol{x}_N, y_N)\}\\), em que cada entrada é representada por um vetor de características \\(\boldsymbol{x}_n \in \mathbb{R}^D\\) e cada rótulo assume valores discretos \\(y_n \in \{+1, -1\}\\).
  * **Função Classificadora Afim:** Parametrizada pelo vetor de pesos \\(\boldsymbol{w} \in \mathbb{R}^D\\) e pelo termo de intercepto/bias \\(b \in \mathbb{R}\\):
    \\[f(\boldsymbol{x}) = \langle \boldsymbol{w}, \boldsymbol{x} \rangle + b\\]
  * **Hiperplano Separador:** O subespaço afim de dimensão \\((D-1)\\) definido pelo conjunto de pontos onde a função se anula:
    \\[\{\boldsymbol{x} \in \mathbb{R}^D : f(\boldsymbol{x}) = \langle \boldsymbol{w}, \boldsymbol{x} \rangle + b = 0\}\\]
  * **Condição de Separação Linear Perfeita:** Exige que todos os exemplos da classe positiva (\\(y_n = +1\\)) fiquem de um lado do hiperplano e os da classe negativa (\\(y_n = -1\\)) fiquem do outro lado:
    \\[y_n (\langle \boldsymbol{w}, \boldsymbol{x}_n \rangle + b) \ge 0, \quad \forall n = 1, \dots, N\\]

* **(b) Intuição Geométrica:**
  O hiperplano atua como uma "fronteira de decisão" plana que divide o espaço \\(D\\)-dimensional em dois semi-espaços. O vetor de pesos \\(\boldsymbol{w}\\) é o **vetor normal** perpendicular ao hiperplano, apontando diretamente para a região da classe positiva (\\(+1\\)). O parâmetro \\(b\\) controla o deslocamento do hiperplano em relação à origem do sistema de coordenadas.

* **(c) Exemplo Numérico em 2D:**
  Considere em \\(\mathbb{R}^2\\) o vetor normal \\(\boldsymbol{w} =^\top\\) e o bias \\(b = -2\\).
  * A equação do hiperplano é \\(x_1 + x_2 - 2 = 0\\) (a reta \\(x_2 = -x_1 + 2\\)).
  * Para o ponto \\(\boldsymbol{x}_1 =^\top\\): \\(f(\boldsymbol{x}_1) = 2 + 2 - 2 = 2 > 0 \implies\\) classificado como \\(+1\\).
  * Para o ponto \\(\boldsymbol{x}_2 = ^\top\\): \\(f(\boldsymbol{x}_2) = 0 + 0 - 2 = -2 < 0 \implies\\) classificado como \\(-1\\).

* **(d) Como Aparece em ML:**
  É a extensão da Regressão Linear para problemas com alvos discretos. Enquanto a Regressão Linear prevê um valor contínuo \\(y \in \mathbb{R}\\), o classificador linear converte essa saída contínua no sinal discreto \\(\text{sign}(f(\boldsymbol{x})) \in \{+1, -1\}\\).

* **(e) Fórmulas Relevantes:**
  * Função preditora: \\(f(\boldsymbol{x}) = \langle \boldsymbol{w}, \boldsymbol{x} \rangle + b\\)
  * Equação do hiperplano: \\(\langle \boldsymbol{w}, \boldsymbol{x} \rangle + b = 0\\)
  * Condição unificada de separação: \\(y_n (\langle \boldsymbol{w}, \boldsymbol{x}_n \rangle + b) \ge 0\\)

---

### **2. Margem e SVM Primal (Hard & Soft Margin - Seção 12.2)**

* **(a) Definições Formais e Notação Exata:**
  * **Distância ao Hiperplano:** A distância ortogonal \\(r\\) de um ponto \\(\boldsymbol{x}_a\\) ao hiperplano é dada pela projeção ortogonal na direção do vetor unitário \\(\frac{\boldsymbol{w}}{\|\boldsymbol{w}\|}\\):
    \\[r = \frac{y_a (\langle \boldsymbol{w}, \boldsymbol{x}_a \rangle + b)}{\|\boldsymbol{w}\|}\\]
  * **SVM de Margem Rígida (*Hard Margin SVM*):** Para dados linearmente separáveis, escala-se o problema de modo que o ponto mais próximo satisfaça \\(y_a (\langle \boldsymbol{w}, \boldsymbol{x}_a \rangle + b) = 1\\), resultando em uma margem \\(r = \frac{1}{\|\boldsymbol{w}\|}\\). A maximização da margem é formulada como:
    \\[\min_{\boldsymbol{w}, b} \frac{1}{2}\|\boldsymbol{w}\|^2 \quad \text{sujeito a} \quad y_n (\langle \boldsymbol{w}, \boldsymbol{x}_n \rangle + b) \ge 1, \quad \forall n = 1, \dots, N\\]
  * **SVM de Margem Suave (*Soft Margin SVM*):** Para dados não-separáveis linearmente, introduzem-se variáveis de folga (*slack variables*) \\(\xi_n \ge 0\\) para tolerar violações da margem:
    \\[\min_{\boldsymbol{w}, b, \boldsymbol{\xi}} \frac{1}{2}\|\boldsymbol{w}\|^2 + C \sum_{n=1}^N \xi_n \quad \text{sujeito a} \quad y_n (\langle \boldsymbol{w}, \boldsymbol{x}_n \rangle + b) \ge 1 - \xi_n \quad \text{e} \quad \xi_n \ge 0\\]
    onde \\(C > 0\\) é o parâmetro de regularização que controla o *trade-off* entre a largura da margem e os erros de classificação.

* **(b) Intuição Geométrica:**
  A margem é a largura da "estrada" ou "corredor de segurança" de amortecimento situado entre as duas classes. Maximizar essa distância reduz a complexidade do modelo e melhora a capacidade de generalização. Quando os dados se sobrepõem, as variáveis de folga \\(\xi_n\\) medem a distância relativa na qual um ponto invade o corredor da margem ou atravessa para o lado errado do hiperplano.

* **(c) Exemplo Numérico em 2D:**
  Considere dois pontos da classe \\(+1\\) em \\(^\top\\) e \\(^\top\\), e dois pontos da classe \\(-1\\) em \\([-1, 0]^\top\\) e \\([0, -1]^\top\\).
  * O hiperplano de margem máxima é dado por \\(x_1 + x_2 - 1 = 0\\), em que \\(\boldsymbol{w} =^\top\\) e \\(b = -1\\).
  * Para o ponto \\(^\top\\), temos \\(1(1 + 2 - 1) = 2 \ge 1\\).
  * A norma é \\(\|\boldsymbol{w}\| = \sqrt{1^2 + 1^2} = \sqrt{2}\\), portanto a distância ao hiperplano é \\(r = \frac{1}{\sqrt{2}}\\), gerando uma margem total do corredor de \\(2r = \sqrt{2}\\).

* **(d) Como Aparece em ML:**
  O termo \\(\frac{1}{2}\|\boldsymbol{w}\|^2\\) atua exatamente como um termo de **regularização \\(L_2\\) (Ridge)** que impede pesos excessivamente grandes, enquanto o termo de erro força o ajuste aos dados de treinamento.

* **(e) Fórmulas Relevantes:**
  * Distância do ponto ao hiperplano: \\(r = \frac{y_n(\langle \boldsymbol{w}, \boldsymbol{x}_n \rangle + b)}{\|\boldsymbol{w}\|}\\)
  * Largura da margem estandardizada: \\(r = \frac{1}{\|\boldsymbol{w}\|}\\)
  * Problema Primal da Hard Margin SVM: \\(\min_{\boldsymbol{w}, b} \frac{1}{2}\|\boldsymbol{w}\|^2\\) s.t. \\(y_n(\langle \boldsymbol{w}, \boldsymbol{x}_n \rangle + b) \ge 1\\)
  * Problema Primal da Soft Margin SVM: \\(\min_{\boldsymbol{w},b,\boldsymbol{\xi}} \frac{1}{2}\|\boldsymbol{w}\|^2 + C\sum_{n=1}^N \xi_n\\) s.t. \\(y_n(\langle \boldsymbol{w}, \boldsymbol{x}_n \rangle + b) \ge 1 - \xi_n, \xi_n \ge 0\\)

---

### **3. Perspectiva da Função de Perda (Hinge Loss - Seção 12.2.5)**

* **(a) Definições Formais e Notação Exata:**
  O problema de otimização da SVM de margem suave pode ser reescrito na forma não-restrita de Minimização do Risco Empírico Regularizado:
  \\[\min_{\boldsymbol{w}, b} \underbrace{\frac{1}{2} \|\boldsymbol{w}\|^2}_{\text{Regularizador}} + C \sum_{n=1}^N \underbrace{\max\{0, 1 - y_n(\langle \boldsymbol{w}, \boldsymbol{x}_n \rangle + b)\}}_{\text{Termo de Perda (Hinge Loss)}}\\]
  A **Função de Perda Hinge** (*Hinge Loss*) é definida formalmente como:
  \\[\ell(t) = \max\{0, 1 - t\}, \quad \text{onde } t = y_n f(\boldsymbol{x}_n) = y_n(\langle \boldsymbol{w}, \boldsymbol{x}_n \rangle + b)\\]

* **(b) Intuição Geométrica:**
  A *Hinge Loss* é uma aproximação convexa suave e limite superior para a perda 0-1 (que conta erros discretos). Se o ponto estiver do lado correto e fora do limite da margem (\\(t \ge 1\\)), a perda é **exatamente zero**. Se o ponto estiver dentro do corredor de margem ou do lado errado (\\(t < 1\\)), a perda cresce linearmente com a distância de penetração.

* **(c) Exemplo Numérico em 2D:**
  Se um ponto tem \\(y_n = +1\\):
  * Se \\(f(\boldsymbol{x}_n) = 1,5 \implies t = 1,5 \ge 1 \implies \ell(1,5) = \max\{0, 1 - 1,5\} = 0\\) (perda zero).
  * Se \\(f(\boldsymbol{x}_n) = 0,5 \implies t = 0,5 < 1 \implies \ell(0,5) = \max\{0, 1 - 0,5\} = 0,5\\) (dentro da margem).
  * Se \\(f(\boldsymbol{x}_n) = -0,5 \implies t = -0,5 \implies \ell(-0,5) = \max\{0, 1 - (-0,5)\} = 1,5\\) (erro de classificação).

* **(d) Como Aparece em ML:**
  Diferente da Regressão Linear (que utiliza a perda quadrática \\((y - \hat{y})^2\\)) e da Regressão Logística (que utiliza a perda logística contínua em todo o espaço), a *Hinge Loss* é nula para pontos além da margem, o que concede à SVM a propriedade de **esparsidade**: apenas os pontos na margem ou violando-a afetam o modelo final.

* **(e) Fórmulas Relevantes:**
  * Definição da Hinge Loss: \\(\ell(t) = \max\{0, 1 - t\}\\)
  * Minimização do Risco Empírico: \\(\min_{\boldsymbol{w}, b} \frac{1}{2}\|\boldsymbol{w}\|^2 + C \sum_{n=1}^N \max\{0, 1 - y_n f(\boldsymbol{x}_n)\}\\)

---

### **4. SVM Dual e Vetores de Suporte (Seção 12.3)**

* **(a) Definições Formais e Notação Exata:**
  * **Função Lagrangiana Primal:** Incorpora os multiplicadores de Lagrange \\(\alpha_n \ge 0\\) e \\(\gamma_n \ge 0\\):
    \\[\mathcal{L}(\boldsymbol{w}, b, \boldsymbol{\xi}, \boldsymbol{\alpha}, \boldsymbol{\gamma}) = \frac{1}{2}\|\boldsymbol{w}\|^2 + C\sum_{n=1}^N \xi_n - \sum_{n=1}^N \alpha_n [y_n(\langle \boldsymbol{w}, \boldsymbol{x}_n \rangle + b) - 1 + \xi_n] - \sum_{n=1}^N \gamma_n \xi_n\\]
  * **Teorema do Representante (*Representer Theorem*):** Anulando as derivadas parciais em relação às variáveis primais (\\(\frac{\partial \mathcal{L}}{\partial \boldsymbol{w}} = \mathbf{0}^\top\\)), obtém-se que o vetor normal ótimo é uma combinação linear dos dados:
    \\[\boldsymbol{w} = \sum_{n=1}^N \alpha_n y_n \boldsymbol{x}_n\\]
  * **Problema Dual da SVM:** Minimização quadrática em relação a \\(\boldsymbol{\alpha} \in \mathbb{R}^N\\):
    \\[\max_{\boldsymbol{\alpha}} \sum_{i=1}^N \alpha_i - \frac{1}{2} \sum_{i=1}^N \sum_{j=1}^N \alpha_i \alpha_j y_i y_j \langle \boldsymbol{x}_i, \boldsymbol{x}_j \rangle \quad \text{sujeito a} \quad \sum_{n=1}^N \alpha_n y_n = 0 \quad \text{e} \quad 0 \le \alpha_n \le C\\]
  * **Vetores de Suporte:** Exemplos de treinamento para os quais o multiplicador dual correspondente é estritamente positivo (\\(\alpha_n > 0\\)).
  * **Cálculo do Intercepto \\(b^*\\):** Para qualquer vetor de suporte localizado exatamente sobre a margem (\\(0 < \alpha_n < C\\)):
    \\[b^* = y_n - \langle \boldsymbol{w}^*, \boldsymbol{x}_n \rangle\\]

* **(b) Intuição Geométrica:**
  O vetor normal do hiperplano depende exclusivamente das posições dos **vetores de suporte** (os pontos mais difíceis situados nas bordas da margem ou violando-a). Pontos classificados corretamente e fora da margem possuem \\(\alpha_n = 0\\) e podem ser removidos do conjunto de dados sem alterar a fronteira de decisão final.

* **(c) Exemplo Numérico em 2D:**
  Sejam dois vetores de suporte \\(\boldsymbol{x}_1 =^\top\\) (\\(y_1 = +1\\)) e \\(\boldsymbol{x}_2 = [-1, -1]^\top\\) (\\(y_2 = -1\\)).
  * A condição \\(\sum \alpha_n y_n = 0 \implies \alpha_1(1) + \alpha_2(-1) = 0 \implies \alpha_1 = \alpha_2 = 0,5\\).
  * O vetor normal rebatido é:
    \\[\boldsymbol{w} = \alpha_1 y_1 \boldsymbol{x}_1 + \alpha_2 y_2 \boldsymbol{x}_2 = 0,5(+1)\begin{bmatrix}1\\1\end{bmatrix} + 0,5(-1)\begin{bmatrix}-1\\-1\end{bmatrix} = \begin{bmatrix}1\\1\end{bmatrix}\\]

* **(d) Como Aparece em ML:**
  Diferente da formulação Primal (cujo número de parâmetros é a dimensão do espaço de características \\(D\\)), o problema Dual possui \\(N\\) variáveis (uma por exemplo de dados). Isso permite resolver problemas em espaços de características de dimensão imensa ou infinita, pois os dados aparecem **apenas na forma de produtos internos** \\(\langle \boldsymbol{x}_i, \boldsymbol{x}_j \rangle\\).

* **(e) Fórmulas Relevantes:**
  * Representação do vetor de pesos: \\(\boldsymbol{w} = \sum_{n=1}^N \alpha_n y_n \boldsymbol{x}_n\\)
  * Condição de igualdade dual: \\(\sum_{n=1}^N \alpha_n y_n = 0\\)
  * Função Objetivo Dual: \\(D(\boldsymbol{\alpha}) = \sum_{i=1}^N \alpha_i - \frac{1}{2}\sum_{i=1}^N \sum_{j=1}^N \alpha_i \alpha_j y_i y_j \langle \boldsymbol{x}_i, \boldsymbol{x}_j \rangle\\)
  * Restrições de caixa (*box constraints*): \\(0 \le \alpha_n \le C\\)

---

### **5. Visão do Envolvente Convexo (Convex Hull View - Seção 12.3.2)**

* **(a) Definições Formais e Notação Exata:**
  * **Envolvente Convexo (*Convex Hull*):** O menor conjunto convexo que contém todos os pontos de uma determinada classe:
    \\[\text{conv}(X^+) = \left\{ \sum_{n:y_n=+1} \alpha_n^+ \boldsymbol{x}_n : \sum_{n:y_n=+1} \alpha_n^+ = 1, \, \alpha_n^+ \ge 0 \right\}\\]
    \\[\text{conv}(X^-) = \left\{ \sum_{n:y_n=-1} \alpha_n^- \boldsymbol{x}_n : \sum_{n:y_n=-1} \alpha_n^- = 1, \, \alpha_n^- \ge 0 \right\}\\]
  * **Problema Geométrico de Separação:** Encontrar um ponto \\(\boldsymbol{c} \in \text{conv}(X^+)\\) e um ponto \\(\boldsymbol{d} \in \text{conv}(X^-)\\) que minimizem a distância Euclidiana \\(\|\boldsymbol{c} - \boldsymbol{d}\|\\) entre os dois polítopos:
    \\[\min_{\boldsymbol{\alpha}} \frac{1}{2} \left\| \sum_{n:y_n=+1} \alpha_n^+ \boldsymbol{x}_n - \sum_{n:y_n=-1} \alpha_n^- \boldsymbol{x}_n \right\|^2\\]
  * O vetor normal do hiperplano ótimo é a diferença entre esses dois pontos:
    \\[\boldsymbol{w} = \boldsymbol{c} - \boldsymbol{d}\\]

* **(b) Intuição Geométrica:**
  Constrói-se uma "casca convexas" (polígono em 2D ou polítopo em altas dimensões) ao redor de todos os pontos azuis (\\(+1\\)) e outra ao redor dos pontos laranjas (\\(-1\\)). Se as classes forem separáveis, os dois polítopos não se sobrepõem. A SVM Dual encontra os dois pontos mais próximos localizados nas fronteiras dessas duas cascas e traça o hiperplano separador de margem máxima **perpendicularmente ao segmento que une \\(\boldsymbol{c}\\) e \\(\boldsymbol{d}\\)**, cortando-o exatamente ao meio.

* **(c) Exemplo Numérico em 2D:**
  Se a casca da classe positiva tem seu ponto mais próximo em \\(\boldsymbol{c} = [0,5; 0,5]^\top\\) e a da classe negativa em \\(\boldsymbol{d} = [-0,5; -0,5]^\top\\):
  * O vetor de diferença é \\(\boldsymbol{w} = \boldsymbol{c} - \boldsymbol{d} =^\top\\).
  * O ponto médio do segmento é \\(\frac{\boldsymbol{c}+\boldsymbol{d}}{2} = ^\top\\), por onde o hiperplano de separação ortogonal passa.

* **(d) Como Aparece em ML:**
  Oferece uma terceira interpretação geométrica equivalente para a dualidade da SVM, demonstrando que a busca pelo hiperplano de margem máxima é matematicamente idêntica a encontrar a menor distância entre conjuntos convexos.

* **(e) Fórmulas Relevantes:**
  * Vetor normal via envolventes: \\(\boldsymbol{w} = \boldsymbol{c} - \boldsymbol{d}\\)
  * Minimização da distância entre polítopos: \\(\min \frac{1}{2}\|\boldsymbol{c} - \boldsymbol{d}\|^2\\) s.t. \\(\sum \alpha_n^+ = 1, \sum \alpha_n^- = 1, \alpha_n \ge 0\\)

---

### **6. Truque do Kernel e Matriz de Gram (Seção 12.4)**

* **(a) Definições Formais e Notação Exata:**
  * **Função Kernel:** Uma função \\(k: \mathcal{X} \times \mathcal{X} \to \mathbb{R}\\) para a qual existe um Espaço de Hilbert \\(\mathcal{H}\\) e um mapeamento de características não-linear \\(\phi: \mathcal{X} \to \mathcal{H}\\) tal que:
    \\[k(\boldsymbol{x}_i, \boldsymbol{x}_j) = \langle \phi(\boldsymbol{x}_i), \phi(\boldsymbol{x}_j) \rangle_{\mathcal{H}}\\]
  * **Truque do Kernel (*Kernel Trick*):** Consiste em substituir o produto interno padrão \\(\langle \boldsymbol{x}_i, \boldsymbol{x}_j \rangle\\) na formulação Dual da SVM pela função \\(k(\boldsymbol{x}_i, \boldsymbol{x}_j)\\), permitindo calcular produtos internos no espaço transformado de alta dimensão sem computar a transformação \\(\phi(\boldsymbol{x})\\) explicitamente.
  * **Matriz Kernel / Matriz de Gram:** A matriz simétrica e definida positiva \\(\boldsymbol{K} \in \mathbb{R}^{N \times N}\\) com entradas \\(K_{ij} = k(\boldsymbol{x}_i, \boldsymbol{x}_j)\\) que satisfaz \\(\boldsymbol{z}^\top \boldsymbol{K} \boldsymbol{z} \ge 0, \forall \boldsymbol{z} \in \mathbb{R}^N\\).
  * **Exemplos Populares de Kernels:**
    * *Radial Basis Function (RBF) Gaussiano:* \\(k(\boldsymbol{x}_i, \boldsymbol{x}_j) = \exp\left(-\gamma \|\boldsymbol{x}_i - \boldsymbol{x}_j\|^2\right)\\)
    * *Polinomial:* \\(k(\boldsymbol{x}_i, \boldsymbol{x}_j) = (\langle \boldsymbol{x}_i, \boldsymbol{x}_j \rangle + c)^d\\)
  * **Classificador Kernelizado Final:**
    \\[f(\boldsymbol{x}_{\text{test}}) = \sum_{n=1}^N \alpha_n y_n k(\boldsymbol{x}_n, \boldsymbol{x}_{\text{test}}) + b\\]

* **(b) Intuição Geométrica:**
  Quando os dados de entrada não são separáveis por uma reta ou plano em 2D, o mapeamento não-linear \\(\phi(\boldsymbol{x})\\) projeta os pontos para um espaço de dimensão superior (ex: 3D ou dimensão infinita), onde as duas classes tornam-se separáveis por um hiperplano plano simples. Ao projetar a fronteira de volta para o espaço original 2D, o resultado é uma curva de decisão não-linear complexa.

* **(c) Exemplo Numérico em 2D:**
  Considere o mapeamento quadrático 1D para 2D: \\(\phi(x) = [x, x^2]^\top\\).
  * O produto interno transformado é \\(k(x_i, x_j) = \langle \phi(x_i), \phi(x_j) \rangle = x_i x_j + x_i^2 x_j^2\\).
  * Para \\(x_1 = 1\\) e \\(x_2 = 2\\):
    * \\(K_{11} = k(1, 1) = 1(1) + 1^2(1^2) = 2\\)
    * \\(K_{12} = k(1, 2) = 1(2) + 1^2(2^2) = 6\\)
    * \\(K_{22} = k(2, 2) = 2(2) + 2^2(2^2) = 20\\)
  A matriz de Gram é \\(\boldsymbol{K} = \begin{bmatrix} 2 & 6 \\ 6 & 20 \end{bmatrix}\\).

* **(d) Como Aparece em ML:**
  O truque do kernel é a base para a "não-linearização" de diversos algoritmos lineares de machine learning, incluindo o **Kernel PCA** (Capítulo 10) para redução de dimensionalidade não-linear e **Processos Gaussianos** (Capítulo 6 e 9) para regressão probabilística.

* **(e) Fórmulas Relevantes:**
  * Definição de Kernel: \\(k(\boldsymbol{x}_i, \boldsymbol{x}_j) = \langle \phi(\boldsymbol{x}_i), \phi(\boldsymbol{x}_j) \rangle_{\mathcal{H}}\\)
  * Condição de Positiva Definição da Matriz de Gram: \\(\boldsymbol{z}^\top \boldsymbol{K} \boldsymbol{z} \ge 0\\)
  * Dual da Kernel SVM: \\(\max_{\boldsymbol{\alpha}} \sum_{i=1}^N \alpha_i - \frac{1}{2} \sum_{i=1}^N \sum_{j=1}^N \alpha_i \alpha_j y_i y_j k(\boldsymbol{x}_i, \boldsymbol{x}_j)\\)
  * Predição com Kernel: \\(f(\boldsymbol{x}_{\text{test}}) = \sum_{n=1}^N \alpha_n y_n k(\boldsymbol{x}_n, \boldsymbol{x}_{\text{test}}) + b\\)

---

## Conexões entre capítulos

A integração entre os **Capítulos 4 (Decomposições Matriciais)**, **7 (Otimização Contínua)** e **9 (Regressão Linear)** demonstra como a teoria matemática abstrata se traduz diretamente em algoritmos práticos de aprendizado de máquina.

Enquanto o **Capítulo 9** formula o problema estatístico e define a função de perda, o **Capítulo 7** fornece a mecânica de atualização iterativa (Gradiente Descendente) e o **Capítulo 4** garante a viabilidade, eficiência e estabilidade numérica tanto da solução analítica quanto do algoritmo iterativo.

---