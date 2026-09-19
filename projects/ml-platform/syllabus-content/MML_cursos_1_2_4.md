## Centro de gravidade do curso

Abaixo está a trilha conceitual completa baseada nos **Capítulos 2, 3, 4, 5, 6, 7, 9, 10 e 12** do livro *Mathematics for Machine Learning*. Para estruturar o aprendizado de forma lógica, os conceitos foram organizados estritamente em **ordem de dependência matemática**: partindo das bases fundamentais de álgebra linear e geometria, passando por cálculo e probabilidade, até chegar aos algoritmos finais necessários para a construção dos quatro projetos (Regressor Linear, Classificador SVM, Perceptron Multicamada/Redes Neurais e Clusterizador/GMM).

---

### **Fase 1: Fundamentos de Álgebra Linear (Capítulo 2)**

#### **1. Sistemas de Equações Lineares e Representação Matricial**
* **Aplicação nos Projetos:** Base para a representação de conjuntos de dados como matrizes de design no **Regressor Linear**, mapeamento de dados no **Classificador SVM**, transformações de pesos no **Perceptron Multicamada** e cálculo de autovetores no **Clusterizador / PCA**.
* **Seção Exata:** Seção 2.1 e Seção 2.2.
* **Notação Matemática Usada:** 
  \\[\boldsymbol{A}\boldsymbol{x} = \boldsymbol{b}, \quad \text{onde } \boldsymbol{A} \in \mathbb{R}^{m \times n}, \, \boldsymbol{x} \in \mathbb{R}^n, \, \boldsymbol{b} \in \mathbb{R}^m \quad\\]
  Soma e multiplicação matricial: \\(c_{ij} = \sum_{l=1}^n a_{il}b_{lj}\\).
* **Visualização Interativa:** **Intersecting Lines & Hyperplanes Widget**. Um ambiente 2D e 3D onde o usuário ajusta coeficientes numéricos e vê duas retas (em 2D) ou planos (em 3D) se cruzando. O app destaca visualmente se há uma solução única (interseção), infinitas soluções (planos coincidentes) ou nenhuma solução (planos paralelos).

---

#### **2. Operações Elementares e Eliminação Gaussiana**
* **Aplicação nos Projetos:** Utilizado para resolver sistemas de equações normais no **Regressor Linear** e encontrar inversas de matrizes necessárias nos algoritmos de treino.
* **Seção Exata:** Seção 2.3.
* **Notação Matemática Usada:** Matriz aumentada \\([\boldsymbol{A} \,|\, \boldsymbol{b}]\\) e transformação para a Forma Escalonada por Linhas (REF / RREF).
* **Visualização Interativa:** **Gaussian Elimination Step-by-Step Solver**. Um painel onde o usuário realiza operações de linha (pivoteamento, troca de linhas, multiplicação por escalar), vendo a matriz mudar e o gráfico das equações geométricas se simplificar progressivamente.

---

#### **3. Espaços Vetoriais, Independência Linear, Base e Posto (Rank)**
* **Aplicação nos Projetos:** Define a dimensão dos dados de entrada \\(\mathbb{R}^D\\) para todos os quatro projetos. Garante a invertibilidade de matrizes de características (\\(\boldsymbol{\Phi}^\top\boldsymbol{\Phi}\\)) no **Regressor Linear** e fundamenta os subespaços de projeção do **PCA / Clusterizador**.
* **Seção Exata:** Seção 2.4, Seção 2.5 e Seção 2.6.
* **Notação Matemática Usada:** 
  Combinação linear: \\(\sum_{i=1}^k \lambda_i \boldsymbol{x}_i = \mathbf{0} \implies \lambda_i = 0\\) para independência linear. Base \\(B = (\boldsymbol{b}_1, \dots, \boldsymbol{b}_n)\\) e posto \\(\text{rk}(\boldsymbol{A})\\).
* **Visualização Interativa:** **3D Vector Span & Basis Canvas**. Um espaço 3D interativo onde o usuário move vetores com o mouse. Quando dois vetores são linearmente independentes, o plano gerado (*span*) é destacado; se um terceiro vetor for adicionado no mesmo plano, o sistema avisa a dependência linear mudando a cor do vetor.

---

#### **4. Mapeamentos Lineares e Espaços Afins**
* **Aplicação nos Projetos:** Define o modelo preditivo afim \\(f(\boldsymbol{x}) = \boldsymbol{\theta}^\top \boldsymbol{x} + \theta_0\\) do **Regressor Linear**, a equação do hiperplano separador \\(\langle \boldsymbol{w}, \boldsymbol{x} \rangle + b = 0\\) no **Classificador SVM** e as transformações lineares de cada camada no **Perceptron Multicamada**.
* **Seção Exata:** Seção 2.7 e Seção 2.8.
* **Notação Matemática Usada:**
  Transformação linear \\(\Phi(\boldsymbol{x}) = \boldsymbol{A}\boldsymbol{x}\\); Mapeamento afim \\(\phi(\boldsymbol{x}) = \boldsymbol{A}\boldsymbol{x} + \boldsymbol{a}\\); Hiperplano \\(y = \boldsymbol{x}_0 + \sum_{i=1}^{n-1} \lambda_i \boldsymbol{b}_i\\).
* **Visualização Interativa:** **Linear & Affine Grid Transformer**. Uma grade cartesiana 2D preenchida com um padrão de pontos ou uma imagem. O usuário manipula os valores da matriz \\(\boldsymbol{A}\\) e do vetor de translação \\(\boldsymbol{a}\\), observando como a grade sofre rotação, escala, cisalhamento e deslocamento do centro de origem.

---

### **Fase 2: Geometria Analítica e Decomposições Matriciais (Capítulos 3 e 4)**

#### **5. Normas, Comprimentos e Distâncias**
* **Aplicação nos Projetos:** Usado para calcular o erro quadrático no **Regressor Linear**, medir a distância de pontos ao hiperplano e aplicar regularização \\(\ell_2\\) no **Classificador SVM**, calcular o erro de reconstrução no **PCA** e medir distâncias entre pontos e centroides no **Clusterizador**.
* **Seção Exata:** Seção 3.1 e Seção 3.3.
* **Notação Matemática Usada:**
  Norma Euclidiana (\\(\ell_2\\)): \\(\|\boldsymbol{x}\|_2 := \sqrt{\sum_{i=1}^n x_i^2} = \sqrt{\boldsymbol{x}^\top \boldsymbol{x}}\\). Distância: \\(d(\boldsymbol{x}, \boldsymbol{y}) = \|\boldsymbol{x} - \boldsymbol{y}\|_2\\).
* **Visualização Interativa:** **Norm Unit Ball Explorer**. Um gráfico 2D que permite alternar entre normas (\\(\ell_1, \ell_2, \ell_\infty\\)). O usuário arrasta um ponto e vê os contornos da "círculo unitário" mudar de forma (quadrado, círculo, losango) e como a distância até a origem é recalculada em tempo real.

---

#### **6. Produtos Internos, Ângulos e Ortogonalidade**
* **Aplicação nos Projetos:** Base matemática para a semelhança entre vetores, usada no cálculo da solução de Mínimos Quadrados, nos **Kernels do Classificador SVM** e na ortogonalidade dos componentes do **PCA**.
* **Seção Exata:** Seção 3.2 e Seção 3.4.
* **Notação Matemática Usada:**
  Produto interno: \\(\langle \boldsymbol{x}, \boldsymbol{y} \rangle = \boldsymbol{x}^\top \boldsymbol{y}\\). Ângulo: \\(\cos \omega = \frac{\langle \boldsymbol{x}, \boldsymbol{y} \rangle}{\|\boldsymbol{x}\| \|\boldsymbol{y}\|}\\). Ortogonalidade: \\(\boldsymbol{x} \perp \boldsymbol{y} \iff \langle \boldsymbol{x}, \boldsymbol{y} \rangle = 0\\).
* **Visualização Interativa:** **Interactive Dot Product & Angle Gauge**. Dois vetores manipuláveis por *drag-and-drop*. Um medidor em tempo real exibe o valor do produto interno e o ângulo \\(\omega\\). Quando o ângulo atinge \\(90^\circ\\), o sistema destaca a ortogonalidade.

---

#### **7. Matrizes Simétricas Definidas Positivas e Fatoração de Cholesky**
* **Aplicação nos Projetos:** Garante a existência de solução única e estabilidade numérica na inversão matricial do **Regressor Linear**, na matriz de Kernel da **SVM** e na definição de matrizes de covariância válidas (\\(\boldsymbol{\Sigma}_k\\)) no **Clusterizador / GMM**.
* **Seção Exata:** Seção 3.2.3 e Seção 4.3.
* **Notação Matemática Usada:**
  \\(\boldsymbol{x}^\top \boldsymbol{A} \boldsymbol{x} > 0 \quad \forall \boldsymbol{x} \in V \setminus \{\mathbf{0}\}\\). Decomposição de Cholesky: \\(\boldsymbol{A} = \boldsymbol{L}\boldsymbol{L}^\top\\), onde \\(\boldsymbol{L}\\) é triangular inferior.
* **Visualização Interativa:** **Quadratic Form Surface Viewer**. Uma superfície 3D representando a função \\(f(\boldsymbol{x}) = \boldsymbol{x}^\top \boldsymbol{A} \boldsymbol{x}\\). Sliders alteram os elementos de \\(\boldsymbol{A}\\). Se \\(\boldsymbol{A}\\) for definida positiva, a curva forma uma "tigela" com mínimo global na origem; se for indefinida, transforma-se em um monte em formato de sela.

---

#### **8. Projeções Ortogonais**
* **Aplicação nos Projetos:** Proporciona a interpretação geométrica do **Regressor Linear** (projeção do vetor de alvos no subespaço das características) e constitui a base do **PCA / Clusterizador** para projeção de dados em subespaços de menor dimensão.
* **Seção Exata:** Seção 3.8.
* **Notação Matemática Usada:**
  Matriz de projeção: \\(\boldsymbol{P}_\pi = \boldsymbol{B}(\boldsymbol{B}^\top \boldsymbol{B})^{-1}\boldsymbol{B}^\top\\). Projeção em subespaço: \\(\pi_U(\boldsymbol{x}) = \boldsymbol{P}_\pi \boldsymbol{x}\\).
* **Visualização Interativa:** **3D Orthogonal Projection Dropper**. Um vetor 3D sendo projetado sobre um plano 2D inclinado. O usuário pode girar a cena em 3D para verificar que o vetor de erro de projeção \\((\boldsymbol{x} - \pi_U(\boldsymbol{x}))\\) forma sempre um ângulo exato de \\(90^\circ\\) com qualquer vetor no plano de projeção.

---

#### **9. Autovalores, Autovetores e Autodecomposição (Diagonalização)**
* **Aplicação nos Projetos:** Chave para encontrar as direções de variância máxima no **PCA / Clusterizador** e para analisar a forma e orientação das componentes elípticas das Gaussianas no **Clusterizador / GMM**.
* **Seção Exata:** Seção 4.2 e Seção 4.4.
* **Notação Matemática Usada:**
  Equação de autovalor: \\(\boldsymbol{A}\boldsymbol{x} = \lambda \boldsymbol{x}\\). Polinômio característico: \\(p_{\boldsymbol{A}}(\lambda) := \det(\boldsymbol{A} - \lambda \boldsymbol{I}) = 0\\). Diagonalização: \\(\boldsymbol{A} = \boldsymbol{P}\boldsymbol{D}\boldsymbol{P}^{-1}\\).
* **Visualização Interativa:** **Eigenvector Deformation Circle**. Um círculo unitário contendo múltiplos vetores sendo transformado por uma matriz \\(\boldsymbol{A}\\) em uma elipse. Os autovetores são destacados como as únicas linhas que mantêm sua direção original, sendo apenas esticadas ou encolhidas pelo autovalor \\(\lambda\\).

---

#### **10. Decomposição em Valores Singulares (SVD)**
* **Aplicação nos Projetos:** Base computacional para implementar o **PCA** em dados de alta dimensão sem calcular explicitamente a matriz de covariância, além de servir como fundamentação para **Auto-encoders lineares**.
* **Seção Exata:** Seção 4.5 e Seção 4.6.
* **Notação Matemática Usada:**
  \\[\boldsymbol{A} = \boldsymbol{U}\boldsymbol{\Sigma}\boldsymbol{V}^\top \quad\\]
  Aproximação de baixo posto (Truncated SVD): \\(\hat{\boldsymbol{A}}_{(k)} = \sum_{i=1}^k \sigma_i \boldsymbol{u}_i \boldsymbol{v}_i^\top\\).
* **Visualização Interativa:** **SVD Image Compressor & Vector Transformer**.
  1. *Visão Vetorial:* Animação em 3 etapas mostrando a sequência de transformações: Rotação (\\(\boldsymbol{V}^\top\\)), Escala/Mudança de dimensão (\\(\boldsymbol{\Sigma}\\)) e Rotação final (\\(\boldsymbol{U}\\)).
  2. *Visão Imagem:* Um slider \\(k\\) permite ao usuário reconstruir uma imagem ruidosa usando apenas os \\(k\\) primeiros valores singulares.

---

### **Fase 3: Cálculo Vetorial e Diferenciação Automática (Capítulo 5)**

#### **11. Derivadas Parciais e Gradientes**
* **Aplicação nos Projetos:** Usado para derivar a função de perda em relação aos parâmetros no **Regressor Linear**, encontrar a direção de otimização do **Perceptron Multicamada** e atualizar hiperparâmetros no **Classificador** e no **Clusterizador**.
* **Seção Exata:** Seção 5.2.
* **Notação Matemática Usada:**
  Gradiente (layout numerador): \\(\nabla f(\boldsymbol{x}) = \frac{\partial f(\boldsymbol{x})}{\partial \boldsymbol{x}} = \left[ \frac{\partial f(\boldsymbol{x})}{\partial x_1}, \, \dots, \, \frac{\partial f(\boldsymbol{x})}{\partial x_D} \right] \in \mathbb{R}^{1 \times D}\\).
* **Visualização Interativa:** **Loss Surface Gradient Arrow**. Um mapa de contorno 3D/2D de uma função de perda de 2 parâmetros. O usuário posiciona um ponto na superfície e o vetor gradiente negativo é desenhado instantaneamente, demonstrando que ele é sempre perpendicular às linhas de nível e aponta para a descida mais íngreme.

---

#### **12. Matriz Jacobiana e Gradientes de Funções Vetoriais/Matriciais**
* **Aplicação nos Projetos:** Essencial para calcular derivativas de sistemas multivariados, permitindo a otimização vetorial do **Regressor Linear**, o cálculo de derivadas em camadas do **Perceptron Multicamada** e transformações de variáveis no **Clusterizador**.
* **Seção Exata:** Seção 5.3 e Seção 5.4.
* **Notação Matemática Usada:**
  Matriz Jacobiana: \\(\boldsymbol{J}_{\boldsymbol{f}} = \frac{d\boldsymbol{f}}{d\boldsymbol{x}} \in \mathbb{R}^{M \times N}\\), onde \\(J_{ij} = \frac{\partial f_i}{\partial x_j}\\). Gradiente de Perda Quadrática: \\(\frac{\partial L}{\partial \boldsymbol{\theta}} = -2(\boldsymbol{y} - \boldsymbol{\Phi}\boldsymbol{\theta})^\top \boldsymbol{\Phi}\\).
* **Visualização Interativa:** **Jacobian Local Linearizer**. Mostra dois espaços 2D lado a lado (Domínio e Contradomínio). Ao mover uma pequena figura circular no domínio, a Jacobiana calcula a transformação linear local instantânea, mostrando a figura se deformando como uma elipse no contradomínio.

---

#### **13. Regra da Cadeia e Backpropagation (Diferenciação Automática)**
* **Aplicação nos Projetos:** O pilar fundamental do **Perceptron Multicamada (MLP)** para calcular o gradiente da função de erro em relação a todos os pesos e vieses através de múltiplas camadas.
* **Seção Exata:** Seção 5.6.
* **Notação Matemática Usada:**
  Regra da Cadeia: \\(\frac{d y}{d x} = \frac{d y}{d b} \frac{d b}{d a} \frac{d a}{d x}\\).
  Forward pass: \\(f_i = \sigma_i(\boldsymbol{A}_{i-1}f_{i-1} + \boldsymbol{b}_{i-1})\\).
  Backward pass (cálculo de gradientes dos parâmetros): \\(\frac{\partial L}{\partial \boldsymbol{A}_i} = \frac{\partial L}{\partial f_K} \frac{\partial f_K}{\partial f_{K-1}} \dots \frac{\partial f_{i+1}}{\partial \boldsymbol{A}_i}\\).
* **Visualização Interativa:** **Backpropagation Computation Graph**. Uma rede neural simples interativa (ex: 2 entradas, 1 camada oculta, 1 saída). No *forward pass*, os valores das ativações fluem para a direita; no *backward pass*, as derivadas parciais (destacadas em cores diferentes) fluem da direita para a esquerda pelas arestas, atualizando os pesos em tempo real.

---

### **Fase 4: Probabilidade, Estatística e Otimização Contínua (Capítulos 6 e 7)**

#### **14. Espaços de Probabilidade, Variáveis Aleatórias, Regras da Soma/Produto e Teorema de Bayes**
* **Aplicação nos Projetos:** Base para a formulação probabilística da **Regressão Linear Bayesiana**, modelagem da incerteza do **Classificador** e cálculo da probabilidade a posteriori de pertencimento a um grupo (*responsabilidades*) no **Clusterizador / GMM**.
* **Seção Exata:** Seção 6.1, Seção 6.2 e Seção 6.3.
* **Notação Matemática Usada:**
  Regra da Soma (Marginalização): \\(p(x) = \sum_y p(x, y)\\) ou \\(\int p(x, y) dy\\).
  Regra do Produto: \\(p(x, y) = p(y|x)p(x)\\).
  Teorema de Bayes: \\(p(\theta | x) = \frac{p(x|\theta)p(\theta)}{p(x)}\\).
* **Visualização Interativa:** **Interactive Bayes' Table & Tree**. Uma tabela 2D de contagem de frequências cruzadas. O usuário clica em uma linha ou coluna para ver o corte condicional \\(p(Y|X)\\) se ajustando dinamicamente e a regra de Bayes recalculando a probabilidade invertida em tempo real.

---

#### **15. Estatísticas de Resumo: Média, Covariância e Matriz de Covariância**
* **Aplicação nos Projetos:** Usado para centralizar e padronizar dados em todos os projetos, construir a matriz de covariância dos dados \\(\boldsymbol{S}\\) no **PCA** e calcular os parâmetros de espalhamento dos componentes no **Clusterizador / GMM**.
* **Seção Exata:** Seção 6.4.
* **Notação Matemática Usada:**
  Média: \\(\boldsymbol{\mu} = \mathbb{E}[\boldsymbol{x}]\\). Covariância: \\(\text{Cov}[x_i, x_j] = \mathbb{E}[(x_i - \mu_i)(x_j - \mu_j)]\\). Matriz de Covariância Empírica: \\(\boldsymbol{S} = \frac{1}{N}\sum_{n=1}^N \boldsymbol{x}_n \boldsymbol{x}_n^\top\\).
* **Visualização Interativa:** **2D Data Covariance Sculptor**. Uma tela 2D onde o usuário adiciona ou move pontos com o mouse. Ao lado, a matriz de covariância \\(2 \times 2\\) e a elipse de dispersão correspondente se reajustam instantaneamente conforme a correlação entre \\(x_1\\) e \\(x_2\\) muda.

---

#### **16. Distribuição Gaussiana Multivariada**
* **Aplicação nos Projetos:** Define o modelo de ruído de observação no **Regressor Linear** (\\(y = \boldsymbol{\theta}^\top\boldsymbol{x} + \epsilon, \epsilon \sim \mathcal{N}(0, \sigma^2)\\)) e representa a função de densidade de cada componente cluster no **Clusterizador / GMM**.
* **Seção Exata:** Seção 6.5.
* **Notação Matemática Usada:**
  \\[\mathcal{N}(\boldsymbol{x} \,|\, \boldsymbol{\mu}, \boldsymbol{\Sigma}) = \frac{1}{(2\pi)^{D/2}|\boldsymbol{\Sigma}|^{1/2}} \exp\left(-\frac{1}{2}(\boldsymbol{x}-\boldsymbol{\mu})^\top \boldsymbol{\Sigma}^{-1}(\boldsymbol{x}-\boldsymbol{\mu})\right) \quad\\]
* **Visualização Interativa:** **Multivariate Gaussian 3D Contour Bell**. Gráfico 3D da superfície "sino" de uma Gaussiana bivariada. Sliders alteram o vetor de médias \\(\boldsymbol{\mu}\\) e a matriz de covariância \\(\boldsymbol{\Sigma}\\), permitindo rotacionar, achatar e transladar a distribuição no espaço.

---

#### **17. Otimização por Gradient Descent e Stochastic Gradient Descent (SGD)**
* **Aplicação nos Projetos:** Método iterativo de otimização numérico para encontrar os parâmetros ideais no **Regressor Linear**, treinar os pesos do **Perceptron Multicamada** e otimizar classificadores.
* **Seção Exata:** Seção 7.1.
* **Notação Matemática Usada:**
  Regra de atualização Gradient Descent: \\(\boldsymbol{\theta}^{(k+1)} = \boldsymbol{\theta}^{(k)} - \gamma_k \nabla L(\boldsymbol{\theta}^{(k)})\\).
  SGD (mini-batch): \\(\boldsymbol{\theta}^{(k+1)} = \boldsymbol{\theta}^{(k)} - \gamma_k \nabla L_i(\boldsymbol{\theta}^{(k)})\\).
* **Visualização Interativa:** **SGD vs Batch Gradient Descent Runner**. O usuário escolhe a superfície de perda (convexa ou não-convexa com múltiplos mínimos locais), a taxa de aprendizado (\\(\gamma\\)) e o tamanho do batch. O app mostra a "bolinha" do otimizador descendo o vale, permitindo comparar a suavidade do Batch GD com as oscilações estocásticas do SGD.

---

#### **18. Otimização com Restrições e Multiplicadores de Lagrange**
* **Aplicação nos Projetos:** Base matemática indispensável para encontrar o hiperplano de margem máxima do **Classificador SVM** e para a maximização da variância sujeita a vetores unitários (\\(\|\boldsymbol{b}_1\|^2 = 1\\)) no **PCA**.
* **Seção Exata:** Seção 7.2.
* **Notação Matemática Usada:**
  Formulação Primal: \\(\min_{\boldsymbol{x}} f(\boldsymbol{x})\\) sujeito a \\(g_i(\boldsymbol{x}) \le 0\\).
  Função Lagrangiana: \\(\mathcal{L}(\boldsymbol{x}, \boldsymbol{\lambda}) = f(\boldsymbol{x}) + \sum_{i=1}^m \lambda_i g_i(\boldsymbol{x})\\), com \\(\lambda_i \ge 0\\).
* **Visualização Interativa:** **Lagrange Multipliers Contour Tangent**. As linhas de nível da função objetivo \\(f(x_1, x_2)\\) são sobrepostas pela curva da restrição \\(g(x_1, x_2) = 0\\). O ponto de otimicidade é destacado onde o gradiente \\(\nabla f\\) e o gradiente da restrição \\(\nabla g\\) tornam-se perfeitamente colineares (\\(\nabla f = -\lambda \nabla g\\)).

---

#### **19. Otimização Convexa, Programação Quadrática (QP) e Dualidade**
* **Aplicação nos Projetos:** Garante que soluções locais sejam globais e fornece a formulação matemática exata da **Dual SVM** via Programação Quadrática.
* **Seção Exata:** Seção 7.3.
* **Notação Matemática Usada:**
  Programação Quadrática (QP): \\(\min_{\boldsymbol{x}} \frac{1}{2}\boldsymbol{x}^\top \boldsymbol{Q}\boldsymbol{x} + \boldsymbol{c}^\top \boldsymbol{x}\\) sujeito a \\(\boldsymbol{A}\boldsymbol{x} \le \boldsymbol{b}\\).
  Problema Dual de Lagrange: \\(\max_{\boldsymbol{\lambda} \ge \mathbf{0}} D(\boldsymbol{\lambda})\\).
  Transformada de Legendre-Fenchel / Conjugado Convexo: \\(f^*(\boldsymbol{s}) = \sup_{\boldsymbol{x}} (\boldsymbol{s}^\top \boldsymbol{x} - f(\boldsymbol{x}))\\).
* **Visualização Interativa:** **Primal-Dual Gap Interactive Bound**. Gráfico comparativo entre as superfícies da função Primal (minimização) e da função Dual (maximização). O usuário ajusta os parâmetros até ver o *duality gap* fechar em zero no ponto de cela de Saddle Point.

---

### **Fase 5: Conexão e Implementação dos Quatro Projetos Práticos**

```
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │                      TRILHA DE DEPENDÊNCIA DOS PROJETOS                     │
 └─────────────────────────────────────────────────────────────────────────────┘
   [Fases 1 e 2: Álgebra & Geometria] ──► [Fase 3: Cálculo] ──► [Fase 4: Prob. & Otim.]
                                                                      │
         ┌──────────────────────┬──────────────────────┬──────────────┴───────┐
         ▼                      ▼                      ▼                     ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│    PROJETO 1     │  │    PROJETO 2     │  │    PROJETO 3     │  │    PROJETO 4     │
│ Regressor Linear │  │ Classificador SVM│  │  MLP (Redes Neur.)│  │ Clusterizador/GMM│
└──────────────────┘  └──────────────────┘  └──────────────────┘  └──────────────────┘
```

---

#### **20. Projeto 1: Regressor Linear (Linear Regression)**
* **Conceitos do Livro Necessários:**
  * Formulation & Gaussian Likelihood
  * Múltipla Verossimilhança (MLE) via Equações Normais e Projeção Ortogonal
  * Regularização Ridge e Estimativa MAP
  * Regressão Linear Bayesiana
* **Seção Exata:** Capítulo 9 (Seções 9.1, 9.2, 9.3 e 9.4).
* **Notação Matemática Usada:**
  Modelo probabilístico: \\(p(y|\boldsymbol{x}) = \mathcal{N}(y \,|\, \boldsymbol{\phi}^\top(\boldsymbol{x})\boldsymbol{\theta}, \sigma^2)\\).
  Solução MLE: \\(\boldsymbol{\theta}_{\text{ML}} = (\boldsymbol{\Phi}^\top \boldsymbol{\Phi})^{-1}\boldsymbol{\Phi}^\top \boldsymbol{y}\\).
  Solução MAP (Ridge): \\(\boldsymbol{\theta}_{\text{MAP}} = (\boldsymbol{\Phi}^\top \boldsymbol{\Phi} + \sigma^2 b^{-2}\boldsymbol{I})^{-1}\boldsymbol{\Phi}^\top \boldsymbol{y}\\).
  Distribuição Preditiva Bayesiana: \\(p(y_* \,|\, \boldsymbol{x}_*) = \mathcal{N}(y_* \,|\, \boldsymbol{\phi}^\top(\boldsymbol{x}_*)\boldsymbol{m}_N, \, \boldsymbol{\phi}^\top(\boldsymbol{x}_*)\boldsymbol{S}_N\boldsymbol{\phi}(\boldsymbol{x}_*) + \sigma^2)\\).
* **Visualização Interativa Sugerida:** **Polynomial Regression & Bayesian Band Playground**.
  1. O usuário clica em uma tela para inserir pontos de dados 2D com ruído.
  2. Ajusta sliders para o Grau do Polinômio \\(M\\) e para a Regularização \\(\lambda\\).
  3. O app exibe a curva ajustada da MLE vs MAP e desenha uma "faixa sombreada de incerteza" representando a variância da Regressão Bayesiana. Um painel secundário mostra em tempo real a curva de Erro de Treino vs. Erro de Teste, ilustrando perfeitamente o *Overfitting*.

---

#### **21. Projeto 2: Classificador (Support Vector Machines - SVM)**
* **Conceitos do Livro Necessários:**
  * Hiperplanos Separadores e Conceito de Margem
  * Formulação Primal e Função de Perda Hinge Loss
  * Formulação Dual da SVM e Vetores de Suporte
  * O Truque do Kernel (Kernel Trick)
* **Seção Exata:** Capítulo 12 (Seções 12.1, 12.2, 12.3, 12.4 e 12.5).
* **Notação Matemática Usada:**
  Hiperplano: \\(\langle \boldsymbol{w}, \boldsymbol{x} \rangle + b = 0\\). Margem: \\(r = \frac{1}{\|\boldsymbol{w}\|}\\).
  Hinge Loss: \\(\ell(t) = \max\{0, 1 - y(\langle \boldsymbol{w}, \boldsymbol{x} \rangle + b)\}\\).
  Formulação Dual: \\(\max_{\boldsymbol{\alpha}} \sum_{i=1}^N \alpha_i - \frac{1}{2}\sum_{i=1}^N \sum_{j=1}^N \alpha_i \alpha_j y_i y_j k(\boldsymbol{x}_i, \boldsymbol{x}_j)\\) sujeito a \\(\sum \alpha_i y_i = 0\\) e \\(0 \le \alpha_i \le C\\).
  Função Kernel RBF: \\(k(\boldsymbol{x}_i, \boldsymbol{x}_j) = \exp\left(-\gamma \|\boldsymbol{x}_i - \boldsymbol{x}_j\|^2\right)\\).
* **Visualização Interativa Sugerida:** **SVM Kernel Boundary & Margin Explorer**.
  1. O usuário plota pontos de duas classes (+1 e -1) não-separáveis linearmente em um plano 2D.
  2. Seleciona o tipo de Kernel (Linear, Polinomial, RBF) e ajusta os sliders de custo \\(C\\) e do parâmetro do Kernel \\(\gamma\\).
  3. A aplicação desenha a fronteira de decisão não-linear colorindo o plano, desenha as linhas de margem paralelas e destaca com círculos duplos os pontos exatos que funcionam como Vetores de Suporte (\\(\alpha_i > 0\\)).

---

#### **22. Projeto 3: Perceptron Multicamada (Introdução a Redes Neurais - MLP)**
* **Conceitos do Livro Necessários:**
  * Modelagem de Funções Não-lineares em Camadas
  * Funções de Ativação (Sigmoide, Tanh, ReLU)
  * Cálculo de Gradients por Backpropagation (Grafo de Computação)
  * Otimização do Erro Quadrático / Cross-Entropy via SGD
* **Seção Exata:** Seção 5.6 (Capítulo 5), Seção 8.1.4 (Capítulo 8) e Seção 10.8 (Capítulo 10).
* **Notação Matemática Usada:**
  Equação da camada \\(i\\): \\(\boldsymbol{f}_i = \sigma_i(\boldsymbol{A}_{i-1}\boldsymbol{f}_{i-1} + \boldsymbol{b}_{i-1})\\).
  Função de Ativação Sigmoide: \\(\sigma(t) = \frac{1}{1 + e^{-t}}\\).
  Função de Perda de Mínimos Quadrados em Camadas: \\(L = \|\boldsymbol{y} - \boldsymbol{f}_K\|^2\\).
  Propagação de Erro para Trás: \\(\frac{\partial L}{\partial \boldsymbol{A}_i} = \frac{\partial L}{\partial \boldsymbol{f}_K} \frac{\partial \boldsymbol{f}_K}{\partial \boldsymbol{f}_{K-1}} \dots \frac{\partial \boldsymbol{f}_{i+1}}{\partial \boldsymbol{f}_i} \frac{\partial \boldsymbol{f}_i}{\partial \boldsymbol{A}_i}\\).
* **Visualização Interativa Sugerida:** **MLP Neural Network Decision Playground**.
  1. Uma interface interativa onde o estudante monta a arquitetura da rede (número de camadas oculta e quantidade de neurônios por camada).
  2. Escolhe a função de ativação (\\(\text{ReLU}, \text{Sigmoide}, \text{Tanh}\\)) e clica em "Treinar".
  3. O painel mostra os dados de entrada 2D sendo classificados enquanto as fronteiras de decisão curvas e complexas se dobram e se adaptam aos dados em tempo real a cada época. Um botão de *pause* permite inspecionar as matrizes de pesos \\(\boldsymbol{A}_i\\) e os valores dos gradientes de *backprop* em cada nó.

---

#### **23. Projeto 4: Clusterizador (Gaussian Mixture Models & PCA)**
* **Conceitos do Livro Necessários:**
  * Modelagem de Variáveis Latentes Categorias
  * Misturas de Gaussianas (GMM)
  * Responsabilidades e Algoritmo Expectation-Maximization (EM)
  * Redução de Dimensionalidade (PCA) para pré-processamento/visualização
* **Seção Exata:** Capítulo 11 (Seções 11.1, 11.2, 11.3 e 11.4) e Capítulo 10 (Seções 10.1, 10.2, 10.3 e 10.6).
* **Notação Matemática Usada:**
  Densidade do GMM: \\(p(\boldsymbol{x} \,|\, \boldsymbol{\theta}) = \sum_{k=1}^K \pi_k \mathcal{N}(\boldsymbol{x} \,|\, \boldsymbol{\mu}_k, \boldsymbol{\Sigma}_k)\\).
  Responsabilidade (E-step): \\(r_{nk} = \frac{\pi_k \mathcal{N}(\boldsymbol{x}_n \,|\, \boldsymbol{\mu}_k, \boldsymbol{\Sigma}_k)}{\sum_{j=1}^K \pi_j \mathcal{N}(\boldsymbol{x}_n \,|\, \boldsymbol{\mu}_j, \boldsymbol{\Sigma}_j)}\\).
  Atualização de Média (M-step): \\(\boldsymbol{\mu}_k^{\text{new}} = \frac{1}{N_k} \sum_{n=1}^N r_{nk} \boldsymbol{x}_n\\), onde \\(N_k = \sum_{n=1}^N r_{nk}\\).
  Projeção PCA: \\(\boldsymbol{z}_n = \boldsymbol{B}^\top \boldsymbol{x}_n \in \mathbb{R}^M\\), onde as colunas de \\(\boldsymbol{B}\\) são autovetores da matriz de covariância dos dados \\(\boldsymbol{S}\\).
* **Visualização Interativa Sugerida:** **EM Algorithm GMM Cluster Animator & PCA Projection**.
  1. *Aba EM Clusterer:* O usuário gera agrupamentos complexos de pontos no plano. Escolhe o número de componentes \\(K\\) e clica em "Passo do EM". A cada clique, o app alterna entre o **E-step** (colorindo suavemente os pontos de acordo com as responsabilidades \\(r_{nk}\\)) e o **M-step** (movendo o centro \\(\boldsymbol{\mu}_k\\) e reorientando as elipses de covariância \\(\boldsymbol{\Sigma}_k\\)), enquanto o gráfico de Log-Likelihood sobe até estabilizar.
  2. *Aba PCA:* Mostra os eixos dos componentes principais girando no espaço até se alinharem perfeitamente com as direções de maior variância dos dados agrupados.

---

## Conhecimento por capítulo
O **Capítulo 1** (*Introduction and Motivation*) do livro *Mathematics for Machine Learning* possui um caráter conceitual e motivacional. Por ser uma introdução panorâmica, **ele não apresenta definições matemáticas formais (com caixas formais de teoremas ou definições), fórmulas deduzidas ou exemplos numéricos calculados em 2D**. A formalização matemática rigorosa, a notação detalhada e os exemplos numéricos começam a partir do Capítulo 2 (Álgebra Linear).

Abaixo estão extraídos os conceitos fundamentais, a intuição geométrica e as conexões com os modelos de machine learning conforme apresentados no Capítulo 1.

---

### **1. Dados como Vetores (Data as Vectors)**

* **(a) Definição / Notação:** Os dados numéricos são representados formalmente como vetores de características \\(x \in \mathbb{R}^D\\), em que \\(D\\) denota o número de dimensões (atributos ou *features*).
* **(b) Intuição Geométrica:** Cada ponto de dado é visto como um vetor ou ponto posicionado em um espaço vetorial \\(D\\)-dimensional. A proximidade ou orientação entre dois vetores indica a sua **similaridade geométrica** no espaço.
* **(c) Exemplo Numérico 2D:** O capítulo não traz dados numéricos específicos em 2D, mas conceitua que duas medições de um objeto formam um vetor no plano \\(\mathbb{R}^2\\).
* **(d) Aplicação nos Modelos:**
  * **Regressão Linear:** Os vetores de dados \\(x \in \mathbb{R}^D\\) servem como entrada para prever um valor contínuo observado \\(y \in \mathbb{R}\\).
  * **Classificação:** Os vetores \\(x\\) são associados a rótulos discretos ou inteiros \\(y\\).
  * **Misturas de Gaussianas (GMM / Estimativa de Densidade):** Permite quantificar o "sinal" subjacente e o "ruído" da distribuição dos vetores de dados.
* **(e) Fórmulas Relevantes:** Domínio do vetor de dados: \\(x \in \mathbb{R}^D\\).

---

### **2. Modelo / Preditor (Model / Predictor)**

* **(a) Definição / Notação:** Um preditor é um sistema ou função \\(f: \mathbb{R}^D \to \mathbb{R}\\) (ou para um espaço de rótulos discretos) projetado para fazer previsões com base nos vetores de entrada. O modelo pode ser formulado sob a visão de **otimização** ou **probabilística**.
* **(b) Intuição Geométrica:** Mapear a posição dos vetores de características no espaço para valores de saída ou superfícies de probabilidade, onde vetores geométricamente próximos devem produzir previsões semelhantes.
* **(c) Exemplo Numérico 2D:** Ilustra-se conceitualmente que o modelo aprende uma relação entre as coordenadas de um ponto em 2D e o valor esperado da previsão.
* **(d) Aplicação nos Modelos:**
  * **Regressão Linear:** O preditor busca uma função que mapeia entradas \\(x \in \mathbb{R}^D\\) para alvos contínuos \\(y \in \mathbb{R}\\).
  * **Classificação:** O preditor atribui cada vetor \\(x\\) a uma classe ou rótulo inteiro \\(y\\).
  * **Estimativa de Densidade (GMM):** O modelo descreve a distribuição de probabilidade dos dados e expressa a incerteza do sistema.
* **(e) Fórmulas Relevantes:** Mapeamento de regressão: \\(x \in \mathbb{R}^D \to y \in \mathbb{R}\\).

---

### **3. Aprendizado e Otimização (Learning)**

* **(a) Definição / Notação:** O aprendizado é o processo de ajustar os parâmetros de um modelo para maximizar uma medida de desempenho (ou minimizar o erro) sobre os dados disponíveis, visando uma boa generalização para dados não vistos.
* **(b) Intuição Geométrica:** O cálculo vetorial fornece o **gradiente**, um vetor que aponta geometricamente para a direção de maior crescimento da função de desempenho, guiando os algoritmos de otimização na busca pelos melhores parâmetros.
* **(c) Exemplo Numérico 2D:** O texto explica conceitualmente que o gradiente atua como uma bússola direcional no espaço de parâmetros.
* **(d) Aplicação nos Modelos:**
  * **Regressão Linear e Classificação:** Otimização numérica dos parâmetros para minimizar o erro entre a previsão do modelo e os rótulos reais.
  * **GMM:** Otimização dos parâmetros de localização e formato para ajustar a distribuição aos dados observados.
* **(e) Fórmulas Relevantes:** Não há equações numéricas ou explícitas introduzidas no Capítulo 1.

---

### **Resumo dos Fundamentos Matemáticos Apresentados no Capítulo 1**

O capítulo conecta a teoria matemática aos pilares do aprendizado de máquina da seguinte forma:
1. **Álgebra Linear:** Representação compacta de dados como vetores e matrizes.
2. **Geometria Analítica:** Construção de conceitos de distância, ângulos e similaridade entre vetores.
3. **Decomposições Matriciais:** Interpretação intuitiva da estrutura dos dados e eficiência computacional no aprendizado.
4. **Teoria da Probabilidade:** Quantificação de ruído e incertezas nas previsões do modelo.
5. **Cálculo Vetorial & Otimização Contínua:** Cálculo de gradientes para otimizar os parâmetros do modelo.

Abaixo está a extração detalhada dos conceitos do **Capítulo 2 (*Linear Algebra*)** do livro *Mathematics for Machine Learning*, organizada pelos seus tópicos centrais e cobrindo os itens **(a)** a **(e)** solicitados.

---

### **1. Sistemas de Equações Lineares e Representação Matricial**

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

### **2. Inversa, Transposta e Eliminação Gaussiana**

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

### **3. Espaços Vetoriais e Subespaços**

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

### **4. Combinação Linear e Independência Linear**

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

### **5. Base e Posto (Rank)**

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

### **6. Mapeamentos Lineares e Mudança de Base**

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

### **7. Imagem (Range) e Núcleo (Kernel / Null Space)**

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

### **8. Espaços e Mapeamentos Afins**

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

---

Abaixo está a extração detalhada do **Capítulo 3 (*Analytic Geometry*)** do livro *Mathematics for Machine Learning*, estruturada estritamente em torno dos tópicos centrais do capítulo e cobrindo os itens **(a)** a **(e)** solicitados.

---

### **1. Normas (Norms)**

* **(a) Definição Formal e Notação Exata:**
  Uma norma em um espaço vetorial \\(V\\) é uma função \\(\|\cdot\| : V \to \mathbb{R}\\), \\(\boldsymbol{x} \mapsto \|\boldsymbol{x}\|\\), que atribui a cada vetor um número real representando seu comprimento. Para todo \\(\lambda \in \mathbb{R}\\) e \\(\boldsymbol{x}, \boldsymbol{y} \in V\\), satisfaz:
  1. **Homogeneidade Absoluta:** \\(\|\lambda \boldsymbol{x}\| = |\lambda| \|\boldsymbol{x}\|\\).
  2. **Desigualdade Triangular:** \\(\|\boldsymbol{x} + \boldsymbol{y}\| \le \|\boldsymbol{x}\| + \|\boldsymbol{y}\|\\).
  3. **Positiva Definida:** \\(\|\boldsymbol{x}\| \ge 0\\) e \\(\|\boldsymbol{x}\| = 0 \iff \boldsymbol{x} = \boldsymbol{0}\\).
  
  *Exemplos de normas em \\(\mathbb{R}^n\\):*
  * **Norma Manhattan (\\(\ell_1\\)):** \\(\|\boldsymbol{x}\|_1 := \sum_{i=1}^n |x_i|\\).
  * **Norma Euclidiana (\\(\ell_2\\)):** \\(\|\boldsymbol{x}\|_2 := \sqrt{\sum_{i=1}^n x_i^2} = \sqrt{\boldsymbol{x}^\top \boldsymbol{x}}\\).

* **(b) Intuição Geométrica:**
  A norma mede a distância da ponta do vetor orientado até a origem. A forma geométrica do conjunto de vetores de comprimento unitário (\\(\|\boldsymbol{x}\| = 1\\)) varia segundo a norma: na norma \\(\ell_1\\), forma um losango/diamante em 2D; na norma \\(\ell_2\\), forma um círculo perfeito.

* **(c) Exemplo Numérico em 2D:**
  Para o vetor \\(\boldsymbol{x} = \begin{bmatrix} 1 \\ 1 \end{bmatrix} \in \mathbb{R}^2\\):
  * Norma \\(\ell_1\\): \\(\|\boldsymbol{x}\|_1 = |1| + |1| = 2\\).
  * Norma \\(\ell_2\\): \\(\|\boldsymbol{x}\|_2 = \sqrt{1^2 + 1^2} = \sqrt{2} \approx 1,414\\).

* **(d) Aplicação nos Modelos (ML):**
  * **Regressão Linear:** A norma \\(\ell_2\\) ao quadrado mede o erro de ajuste nos mínimos quadrados \\(\|\boldsymbol{y} - \boldsymbol{X}\boldsymbol{\theta}\|_2^2\\). A norma \\(\ell_2\\) e a norma \\(\ell_1\\) atuam como termos de regularização (Ridge e LASSO, respectivamente) para evitar *overfitting*.
  * **Support Vector Machines (SVM):** A margem de separação entre classes é maximizada através da minimização da norma do vetor de pesos \\(\frac{1}{2}\|\boldsymbol{w}\|^2\\).

* **(e) Fórmulas Relevantes:**
  * \\(\|\lambda \boldsymbol{x}\| = |\lambda| \|\boldsymbol{x}\|\\)
  * \\(\|\boldsymbol{x} + \boldsymbol{y}\| \le \|\boldsymbol{x}\| + \|\boldsymbol{y}\|\\)
  * \\(\|\boldsymbol{x}\|_1 = \sum_{i=1}^n |x_i|\\)
  * \\(\|\boldsymbol{x}\|_2 = \sqrt{\boldsymbol{x}^\top \boldsymbol{x}}\\)

---

### **2. Produtos Internos e Matrizes Definidas Positivas (Inner Products & SPD Matrices)**

* **(a) Definição Formal e Notação Exata:**
  Um produto interno em um espaço vetorial \\(V\\) é uma mapeamento bilinear simétrico e positivo definido \\(\Omega: V \times V \to \mathbb{R}\\), denotado por \\(\langle \boldsymbol{x}, \boldsymbol{y} \rangle\\):
  1. **Simetria:** \\(\langle \boldsymbol{x}, \boldsymbol{y} \rangle = \langle \boldsymbol{y}, \boldsymbol{x} \rangle, \, \forall \boldsymbol{x}, \boldsymbol{y} \in V\\).
  2. **Positiva Definida:** \\(\forall \boldsymbol{x} \in V \setminus \{\boldsymbol{0}\}: \langle \boldsymbol{x}, \boldsymbol{x} \rangle > 0\\) e \\(\langle \boldsymbol{0}, \boldsymbol{0} \rangle = 0\\).
  
  O **produto escalar (dot product)** em \\(\mathbb{R}^n\\) é o caso particular \\(\boldsymbol{x}^\top \boldsymbol{y} = \sum_{i=1}^n x_i y_i\\).
  
  *Relação com Matrizes SPD:* Se \\(\boldsymbol{A} \in \mathbb{R}^{n \times n}\\) for uma matriz simétrica definida positiva (isto é, \\(\boldsymbol{x}^\top \boldsymbol{A} \boldsymbol{x} > 0, \forall \boldsymbol{x} \neq \boldsymbol{0}\\)), então \\(\langle \boldsymbol{x}, \boldsymbol{y} \rangle = \hat{\boldsymbol{x}}^\top \boldsymbol{A} \hat{\boldsymbol{y}}\\) define um produto interno válido em relação a uma base ordenada \\(B\\).

* **(b) Intuição Geométrica:**
  O produto interno estende e generaliza o produto escalar, servindo como a ferramenta fundamental para capturar a noção intuitiva de **similaridade geométrica** entre vetores no espaço. Vetores muito semelhantes produzem valores altos no produto interno, enquanto vetores muito distantes ou ortogonais produzem valores próximos de zero ou negativos.

* **(c) Exemplo Numérico em 2D:**
  Para \\(\boldsymbol{x} = \begin{bmatrix} 1 \\ 1 \end{bmatrix}\\) e \\(\boldsymbol{y} = \begin{bmatrix} 1 \\ 2 \end{bmatrix}\\):
  * Dot product padrão: \\(\langle \boldsymbol{x}, \boldsymbol{y} \rangle = 1(1) + 1(2) = 3\\).
  * Produto interno ponderado com \\(\boldsymbol{A} = \begin{bmatrix} 1 & -1/2 \\ -1/2 & 1 \end{bmatrix}\\):
    \\(\langle \boldsymbol{x}, \boldsymbol{y} \rangle = x_1 y_1 - \frac{1}{2}(x_1 y_2 + x_2 y_1) + x_2 y_2 = 1(1) - \frac{1}{2}(2 + 1) + 1(2) = 1,5\\).

* **(d) Aplicação nos Modelos (ML):**
  * **Support Vector Machines (Kernel Trick):** O *Kernel Trick* substitui o produto interno no espaço original por um produto interno em um espaço de características de alta dimensão \\(k(\boldsymbol{x}_i, \boldsymbol{x}_j) = \langle \phi(\boldsymbol{x}_i), \phi(\boldsymbol{x}_j) \rangle\\), sem necessidade de computar a transformação \\(\phi\\) explicitamente.
  * **GMM e Regressão:** Matrizes de covariância em distribuições Gaussianas são matrizes SPD que atuam na construção de produtos internos e distâncias de Mahalanobis.

* **(e) Fórmulas Relevantes:**
  * \\(\boldsymbol{x}^\top \boldsymbol{y} = \sum_{i=1}^n x_i y_i\\)
  * \\(\langle \boldsymbol{x}, \boldsymbol{y} \rangle = \hat{\boldsymbol{x}}^\top \boldsymbol{A} \hat{\boldsymbol{y}}\\)
  * **Desigualdade de Cauchy-Schwarz:** \\(|\langle \boldsymbol{x}, \boldsymbol{y} \rangle| \le \|\boldsymbol{x}\| \|\boldsymbol{y}\|\\)

---

### **3. Comprimentos, Distâncias e Métricas (Lengths, Distances & Metrics)**

* **(a) Definição Formal e Notação Exata:**
  Todo produto interno induz uma norma natural \\(\|\boldsymbol{x}\| := \sqrt{\langle \boldsymbol{x}, \boldsymbol{x} \rangle}\\).
  A **distância** entre dois vetores \\(\boldsymbol{x}, \boldsymbol{y} \in V\\) é definida como \\(d(\boldsymbol{x}, \boldsymbol{y}) := \|\boldsymbol{x} - \boldsymbol{y}\| = \sqrt{\langle \boldsymbol{x}-\boldsymbol{y}, \boldsymbol{x}-\boldsymbol{y} \rangle}\\).
  Uma função \\(d: V \times V \to \mathbb{R}\\) é uma **métrica** se cumprir:
  1. **Positiva Definida:** \\(d(\boldsymbol{x}, \boldsymbol{y}) \ge 0\\) e \\(d(\boldsymbol{x}, \boldsymbol{y}) = 0 \iff \boldsymbol{x} = \boldsymbol{y}\\).
  2. **Simetria:** \\(d(\boldsymbol{x}, \boldsymbol{y}) = d(\boldsymbol{y}, \boldsymbol{x})\\).
  3. **Desigualdade Triangular:** \\(d(\boldsymbol{x}, \boldsymbol{z}) \le d(\boldsymbol{x}, \boldsymbol{y}) + d(\boldsymbol{y}, \boldsymbol{z})\\).
  Se o produto interno for o *dot product*, a distância é denominada **Distância Euclidiana**.

* **(b) Intuição Geométrica:**
  Mede a separação física em linha reta entre dois pontos no espaço vetorial. Diferente do produto interno (que cresce quanto mais similares forem os vetores), a distância/métrica se comporta no sentido oposto: vetores muito similares possuem distância pequena.

* **(c) Exemplo Numérico em 2D:**
  Para \\(\boldsymbol{x} = \begin{bmatrix} 1 \\ 1 \end{bmatrix}\\) e \\(\boldsymbol{y} = \begin{bmatrix} 1 \\ 2 \end{bmatrix}\\):
  \\(d(\boldsymbol{x}, \boldsymbol{y}) = \|\boldsymbol{x} - \boldsymbol{y}\|_2 = \left\| \begin{bmatrix} 0 \\ -1 \end{bmatrix} \right\|_2 = \sqrt{0^2 + (-1)^2} = 1\\).

* **(d) Aplicação nos Modelos (ML):**
  * **PCA e Regressão Linear:** O erro de reconstrução no PCA e a perda de mínimos quadrados na regressão medem a menor distância Euclidiana entre os dados originais e suas projeções.
  * **GMM:** Mede a proximidade de pontos aos centros de componentes gaussianos.

* **(e) Fórmulas Relevantes:**
  * \\(d(\boldsymbol{x}, \boldsymbol{y}) = \|\boldsymbol{x} - \boldsymbol{y}\| = \sqrt{\langle \boldsymbol{x}-\boldsymbol{y}, \boldsymbol{x}-\boldsymbol{y} \rangle}\\)
  * \\(d(\boldsymbol{x}, \boldsymbol{z}) \le d(\boldsymbol{x}, \boldsymbol{y}) + d(\boldsymbol{y}, \boldsymbol{z})\\)

---

### **4. Ângulos e Ortogonalidade (Angles & Orthogonality)**

* **(a) Definição Formal e Notação Exata:**
  O **ângulo** \\(\omega \in [0, \pi]\\) entre dois vetores não-nulos \\(\boldsymbol{x}, \boldsymbol{y} \in V\\) é definido usando a desigualdade de Cauchy-Schwarz por:
  \\[\cos \omega = \frac{\langle \boldsymbol{x}, \boldsymbol{y} \rangle}{\|\boldsymbol{x}\| \|\boldsymbol{y}\|}\\].
  Dois vetores \\(\boldsymbol{x}, \boldsymbol{y}\\) são **ortogonais** (\\(\boldsymbol{x} \perp \boldsymbol{y}\\)) se e somente se \\(\langle \boldsymbol{x}, \boldsymbol{y} \rangle = 0\\).
  Uma matriz quadrada \\(\boldsymbol{A} \in \mathbb{R}^{n \times n}\\) é uma **matriz ortogonal** se suas colunas forem ortonormais, ou seja, \\(\boldsymbol{A}\boldsymbol{A}^\top = \boldsymbol{I} = \boldsymbol{A}^\top \boldsymbol{A}\\), implicando que \\(\boldsymbol{A}^{-1} = \boldsymbol{A}^\top\\).

* **(b) Intuição Geométrica:**
  O ângulo indica o grau de alinhamento das direções dos vetores. Quando \\(\omega = 0\\), os vetores possuem exatamente a mesma orientação (\\(\cos \omega = 1\\)). Quando \\(\omega = 90^\circ\\) (\\(\pi/2\\)), os vetores são perpendiculares/ortogonais (\\(\cos \omega = 0\\)). Matrizes ortogonais preservam comprimentos e ângulos, atuando como rotações ou reflexões do espaço.

* **(c) Exemplo Numérico em 2D:**
  Para \\(\boldsymbol{x} = \begin{bmatrix} 1 \\ 1 \end{bmatrix}\\) e \\(\boldsymbol{y} = \begin{bmatrix} 1 \\ 2 \end{bmatrix}\\) sob o *dot product*:
  \\[\cos \omega = \frac{1(1) + 1(2)}{\sqrt{2}\sqrt{5}} = \frac{3}{\sqrt{10}} \approx 0,9487 \implies \omega = \arccos\left(\frac{3}{\sqrt{10}}\right) \approx 0,32 \text{ rad} \approx 18^\circ\\].
  Para \\(\boldsymbol{x} = \begin{bmatrix} 1 \\ 1 \end{bmatrix}\\) e \\(\boldsymbol{y} = \begin{bmatrix} -1 \\ 1 \end{bmatrix}\\): \\(\langle \boldsymbol{x}, \boldsymbol{y} \rangle = 1(-1) + 1(1) = 0 \implies \omega = 90^\circ\\) (\\(\boldsymbol{x} \perp \boldsymbol{y}\\)).

* **(d) Aplicação nos Modelos (ML):**
  * **Regressão Linear:** A estimativa de Mínimos Quadrados garante que o vetor de resíduos/erros de previsão \\((\boldsymbol{y} - \boldsymbol{X}\boldsymbol{\theta})\\) seja estritamente ortogonal ao subespaço gerado pelos dados de entrada.
  * **PCA:** As direções dos componentes principais escolhidos são mutuamente ortogonais.

* **(e) Fórmulas Relevantes:**
  * \\(\cos \omega = \frac{\langle \boldsymbol{x}, \boldsymbol{y} \rangle}{\|\boldsymbol{x}\| \|\boldsymbol{y}\|}\\)
  * \\(\boldsymbol{x} \perp \boldsymbol{y} \iff \langle \boldsymbol{x}, \boldsymbol{y} \rangle = 0\\)
  * \\(\boldsymbol{A}\boldsymbol{A}^\top = \boldsymbol{I} \iff \boldsymbol{A}^{-1} = \boldsymbol{A}^\top\\)

---

### **5. Base Ortonormal (Orthonormal Basis - ONB)**

* **(a) Definição Formal e Notação Exata:**
  Uma base \\(\{\boldsymbol{b}_1, \dots, \boldsymbol{b}_n\}\\) de um espaço com produto interno \\(V\\) é uma **base ortonormal (ONB)** se satisfizer:
  1. \\(\langle \boldsymbol{b}_i, \boldsymbol{b}_j \rangle = 0\\) para \\(i \neq j\\) (vetores ortogonais entre si).
  2. \\(\langle \boldsymbol{b}_i, \boldsymbol{b}_i \rangle = 1\\) para todo \\(i\\) (comprimento de cada vetor é 1).

* **(b) Intuição Geométrica:**
  Representa um sistema de eixos de coordenadas perfeitamente perpendiculares entre si, em que cada eixo possui escala unitária estandardizada, simplificando imensamente projeções e cálculos geométricos.

* **(c) Exemplo Numérico em 2D:**
  A base canônica \\(\{\boldsymbol{e}_1, \boldsymbol{e}_2\}\\) de \\(\mathbb{R}^2\\) é uma ONB. Outro exemplo em \\(\mathbb{R}^2\\) é:
  \\[\boldsymbol{b}_1 = \frac{1}{\sqrt{2}}\begin{bmatrix} 1 \\ 1 \end{bmatrix}, \quad \boldsymbol{b}_2 = \frac{1}{\sqrt{2}}\begin{bmatrix} 1 \\ -1 \end{bmatrix}\\]
  pois \\(\boldsymbol{b}_1^\top \boldsymbol{b}_2 = 0\\) e \\(\|\boldsymbol{b}_1\| = 1 = \|\boldsymbol{b}_2\|\\).

* **(d) Aplicação nos Modelos (ML):**
  Utilizada no **PCA** para formar a matriz de projeção \\(\boldsymbol{B} = [\boldsymbol{b}_1, \dots, \boldsymbol{b}_M]\\) com colunas ortonormais, o que simplifica a inversão matricial já que \\(\boldsymbol{B}^\top \boldsymbol{B} = \boldsymbol{I}\\).

* **(e) Fórmulas Relevantes:**
  * \\(\langle \boldsymbol{b}_i, \boldsymbol{b}_j \rangle = \delta_{ij}\\) (onde \\(\delta_{ij} = 1\\) se \\(i=j\\), e \\(0\\) se \\(i \neq j\\))

---

### **6. Complemento Ortogonal e Vetor Normal (Orthogonal Complement & Normal Vector)**

* **(a) Definição Formal e Notação Exata:**
  Dado um subespaço \\(U \subseteq V\\) de dimensão \\(M\\) em um espaço \\(V\\) de dimensão \\(D\\), seu **complemento ortogonal** \\(U^\perp\\) é um subespaço de dimensão \\(D-M\\) contendo todos os vetores de \\(V\\) ortogonais a qualquer vetor de \\(U\\):
  \\[U^\perp := \{\boldsymbol{x} \in V : \langle \boldsymbol{x}, \boldsymbol{u} \rangle = 0, \, \forall \boldsymbol{u} \in U\}\\].
  Todo vetor \\(\boldsymbol{x} \in V\\) pode ser decomposto unicamente como \\(\boldsymbol{x} = \sum_{m=1}^M \lambda_m \boldsymbol{b}_m + \sum_{j=1}^{D-M} \psi_j \boldsymbol{b}_j^\perp\\).
  O vetor unitário \\(\boldsymbol{w}\\) (\\(\|\boldsymbol{w}\|=1\\)) ortogonal a um plano/hiperplano \\(U\\) é o **vetor normal** de \\(U\\).

* **(b) Intuição Geométrica:**
  Decompõe o espaço total em duas partes perpendiculares. Para um plano 2D em um espaço 3D, seu complemento ortogonal é uma reta 1D gerada pelo vetor normal \\(\boldsymbol{w}\\) apontando para fora do plano.

* **(c) Exemplo Numérico em 2D:**
  Se \\(U = \text{span}\left(\begin{bmatrix} 1 \\ 2 \end{bmatrix}\right) \subset \mathbb{R}^2\\), seu complemento ortogonal é \\(U^\perp = \text{span}\left(\begin{bmatrix} -2 \\ 1 \end{bmatrix}\right)\\), pois \\(\begin{bmatrix} 1 \\ 2 \end{bmatrix}^\top \begin{bmatrix} -2 \\ 1 \end{bmatrix} = 0\\).

* **(d) Aplicação nos Modelos (ML):**
  O vetor normal \\(\boldsymbol{w}\\) define a orientação e a inclinação de hiperplanos separadores em algoritmos de **Classificação (SVM)** (\\(\langle \boldsymbol{w}, \boldsymbol{x} \rangle + b = 0\\)). O erro de aproximação do PCA reside inteiramente no complemento ortogonal.

* **(e) Fórmulas Relevantes:**
  * \\(U \cap U^\perp = \{\boldsymbol{0}\}\\) e \\(\dim(U) + \dim(U^\perp) = D\\)
  * Decomposição única: \\(\boldsymbol{x} = \boldsymbol{x}_U + \boldsymbol{x}_{U^\perp}\\) com \\(\boldsymbol{x}_U \in U, \boldsymbol{x}_{U^\perp} \in U^\perp\\)

---

### **7. Produto Interno de Funções (Inner Product of Functions)**

* **(a) Definição Formal e Notação Exata:**
  Para duas funções contínuas \\(u, v : \mathbb{R} \to \mathbb{R}\\), o produto interno em um intervalo \\([a, b]\\) é definido pela integral definida:
  \\[\langle u, v \rangle := \int_a^b u(x)v(x) \, dx\\].
  Se a integral for igual a 0, as funções \\(u\\) e \\(v\\) são **ortogonais**.

* **(b) Intuição Geométrica:**
  Generaliza a soma de produtos elemento a elemento do produto escalar de vetores discretos (\\(\sum x_i y_i\\)) para vetores contínuos com infinitos componentes, substituindo o somatório por uma integral.

* **(c) Exemplo Numérico / Conceitual:**
  Para \\(u(x) = \sin(x)\\) e \\(v(x) = \cos(x)\\) no intervalo \\([-\pi, \pi]\\):
  \\[\langle u, v \rangle = \int_{-\pi}^\pi \sin(x)\cos(x) \, dx = 0\\]
  Como o integrando \\(f(x) = \sin(x)\cos(x)\\) é uma função ímpar, o resultado avalia para \\(0\\), demonstrando que as funções seno e cosseno são ortogonais.

* **(d) Aplicação nos Modelos (ML):**
  Pilar teórico de séries de Fourier, Processos Gaussianos e métodos Kernel em aprendizado não-linear.

* **(e) Fórmulas Relevantes:**
  * \\(\langle u, v \rangle = \int_a^b u(x)v(x) \, dx\\)

---

### **8. Projeções Ortogonais (Orthogonal Projections)**

* **(a) Definição Formal e Notação Exata:**
  1. **Projeção em Subespaço 1D (Reta):** Projetar \\(\boldsymbol{x} \in \mathbb{R}^n\\) em \\(U = \text{span}[\boldsymbol{b}]\\) busca \\(\pi_U(\boldsymbol{x}) = \lambda \boldsymbol{b}\\) com coordenada \\(\lambda = \frac{\boldsymbol{b}^\top \boldsymbol{x}}{\|\boldsymbol{b}\|^2}\\). A matriz de projeção é \\(\boldsymbol{P}_\pi = \frac{\boldsymbol{b}\boldsymbol{b}^\top}{\|\boldsymbol{b}\|^2}\\).
  2. **Projeção em Subespaço de Dimensão \\(M\\):** Para \\(U = \text{span}[\boldsymbol{b}_1, \dots, \boldsymbol{b}_M]\\) dado por colunas de \\(\boldsymbol{B} \in \mathbb{R}^{n \times M}\\), a projeção é \\(\pi_U(\boldsymbol{x}) = \boldsymbol{B}\boldsymbol{\lambda}\\). As coordenadas \\(\boldsymbol{\lambda}\\) satisfazem as **Equações Normais**:
     \\[\boldsymbol{B}^\top \boldsymbol{B} \boldsymbol{\lambda} = \boldsymbol{B}^\top \boldsymbol{x} \implies \boldsymbol{\lambda} = (\boldsymbol{B}^\top \boldsymbol{B})^{-1}\boldsymbol{B}^\top \boldsymbol{x}\\].
     A matriz de projeção é \\(\boldsymbol{P}_\pi = \boldsymbol{B}(\boldsymbol{B}^\top \boldsymbol{B})^{-1}\boldsymbol{B}^\top\\).
  3. **Projeção em Subespaço Afim \\(L = \boldsymbol{x}_0 + U\\):**
     \\[\pi_L(\boldsymbol{x}) = \boldsymbol{x}_0 + \pi_U(\boldsymbol{x} - \boldsymbol{x}_0)\\].
  4. **Ortogonalização de Gram-Schmidt:** Processo iterativo para transformar uma base \\((\boldsymbol{b}_1, \dots, \boldsymbol{b}_n)\\) em uma base ortogonal \\((\boldsymbol{u}_1, \dots, \boldsymbol{u}_n)\\), onde \\(\boldsymbol{u}_1 := \boldsymbol{b}_1\\) e \\(\boldsymbol{u}_k := \boldsymbol{b}_k - \pi_{\text{span}[\boldsymbol{u}_1, \dots, \boldsymbol{u}_{k-1}]}(\boldsymbol{b}_k)\\).

* **(b) Intuição Geométrica:**
  Encontra o ponto \\(\pi_U(\boldsymbol{x})\\) contido no subespaço \\(U\\) que está mais próximo de \\(\boldsymbol{x}\\), minimizando a distância \\(\|\boldsymbol{x} - \pi_U(\boldsymbol{x})\|\\). O vetor erro de projeção \\((\boldsymbol{x} - \pi_U(\boldsymbol{x}))\\) forma um ângulo reto (\\(90^\circ\\)) com qualquer vetor contido no subespaço \\(U\\).

* **(c) Exemplo Numérico em 2D:**
  Dada a reta gerada por \\(\boldsymbol{b} = \begin{bmatrix} 2 \\ 0 \end{bmatrix}\\) e o ponto \\(\boldsymbol{x} = \begin{bmatrix} 1 \\ 1 \end{bmatrix}\\):
  \\(\lambda = \frac{\boldsymbol{b}^\top \boldsymbol{x}}{\boldsymbol{b}^\top \boldsymbol{b}} = \frac{2(1)+0(1)}{2^2+0^2} = \frac{2}{4} = 0,5\\).
  Ponto projetado: \\(\pi_U(\boldsymbol{x}) = 0,5 \begin{bmatrix} 2 \\ 0 \end{bmatrix} = \begin{bmatrix} 1 \\ 0 \end{bmatrix}\\).
  Matriz de projeção: \\(\boldsymbol{P}_\pi = \frac{1}{4}\begin{bmatrix} 2 \\ 0 \end{bmatrix}\begin{bmatrix} 2 & 0 \end{bmatrix} = \begin{bmatrix} 1 & 0 \\ 0 & 0 \end{bmatrix}\\).

* **(d) Aplicação nos Modelos (ML):**
  * **Regressão Linear (MLE):** A solução clássica de Mínimos Quadrados \\(\boldsymbol{\theta}_{\text{ML}} = (\boldsymbol{\Phi}^\top \boldsymbol{\Phi})^{-1}\boldsymbol{\Phi}^\top \boldsymbol{y}\\) realiza exatamente uma projeção ortogonal do vetor de observações \\(\boldsymbol{y}\\) sobre o subespaço gerado pelas colunas da matriz de características \\(\boldsymbol{\Phi}\\).
  * **PCA:** Projeta dados de alta dimensão sobre o subespaço principal minimizando a perda de compressão quadrática.

* **(e) Fórmulas Relevantes:**
  * Projeção 1D: \\(\pi_U(\boldsymbol{x}) = \frac{\boldsymbol{b}^\top \boldsymbol{x}}{\|\boldsymbol{b}\|^2}\boldsymbol{b}\\)
  * Equações Normais: \\(\boldsymbol{B}^\top \boldsymbol{B} \boldsymbol{\lambda} = \boldsymbol{B}^\top \boldsymbol{x}\\)
  * Pseudo-inversa: \\((\boldsymbol{B}^\top \boldsymbol{B})^{-1}\boldsymbol{B}^\top\\)
  * Matriz de Projeção \\(M\\)-dimensional: \\(\boldsymbol{P}_\pi = \boldsymbol{B}(\boldsymbol{B}^\top \boldsymbol{B})^{-1}\boldsymbol{B}^\top\\)
  * Projeção Afim: \\(\pi_L(\boldsymbol{x}) = \boldsymbol{x}_0 + \pi_U(\boldsymbol{x} - \boldsymbol{x}_0)\\)

---

### **9. Rotações (Rotations)**

* **(a) Definição Formal e Notação Exata:**
  Uma **rotação em \\(\mathbb{R}^2\\)** por um ângulo \\(\theta\\) (no sentido anti-horário) é representada pela matriz de transformação:
  \\[\boldsymbol{R}(\theta) = \begin{bmatrix} \cos \theta & -\sin \theta \\ \sin \theta & \cos \theta \end{bmatrix} \in \mathbb{R}^{2 \times 2}\\].
  Em \\(\mathbb{R}^n\\), a **Rotação de Givens** \\(\boldsymbol{R}_{ij}(\theta)\\) rotaciona um plano bidimensional \\(ij\\) fixando as outras \\(n-2\\) dimensões.

* **(b) Intuição Geométrica:**
  Gira os vetores em torno da origem fixada sem alterar suas formas ou tamanhos. Preserva distâncias (\\(\|\boldsymbol{R}\boldsymbol{x} - \boldsymbol{R}\boldsymbol{y}\| = \|\boldsymbol{x} - \boldsymbol{y}\|\\)) e ângulos entre vetores.

* **(c) Exemplo Numérico em 2D:**
  Rotacionar \\(\boldsymbol{x} = \begin{bmatrix} 1 \\ 0 \end{bmatrix}\\) por \\(\theta = 90^\circ\\) (\\(\pi/2\\)):
  \\[\boldsymbol{R}(\pi/2) \boldsymbol{x} = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix} \begin{bmatrix} 1 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ 1 \end{bmatrix}\\].

* **(d) Aplicação nos Modelos (ML):**
  Forma o componente central das mudanças de base em algoritmos de decomposição matricial, como a Decomposição em Valores Singulares (**SVD**) e a Diagonalização por Autovetores, permitindo alinhar os eixos dos dados com as direções de maior variância.

* **(e) Fórmulas Relevantes:**
  * \\(\boldsymbol{R}(\theta) = \begin{bmatrix} \cos \theta & -\sin \theta \\ \sin \theta & \cos \theta \end{bmatrix}\\)
  * Preservação de distância: \\(\|\boldsymbol{R}\boldsymbol{x} - \boldsymbol{R}\boldsymbol{y}\| = \|\boldsymbol{x} - \boldsymbol{y}\|\\)

---

Abaixo está a extração completa e detalhada do **Capítulo 4 (*Matrix Decompositions*)** do livro *Mathematics for Machine Learning*, organizada pelos seis tópicos fundamentais do capítulo e cobrindo os itens **(a)** a **(e)** solicitados.

---

### **1. Determinante e Traço (Determinant and Trace)**

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

### **2. Autovalores e Autovetores (Eigenvalues and Eigenvectors)**

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

### **3. Decomposição de Cholesky (Cholesky Decomposition)**

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

### **4. Autodecomposição e Diagonalização (Eigendecomposition & Diagonalization)**

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

### **5. Decomposição em Valores Singulares (SVD)**

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

### **6. Aproximação Matricial e SVD Truncada (Matrix Approximation)**

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

---

Abaixo está a extração detalhada e formal do **Capítulo 5 (*Vector Calculus*)** do livro *Mathematics for Machine Learning*, organizada por seus conceitos fundamentais e estruturada nos itens **(a)** a **(e)**.

---

### **1. Derivadas Parciais e Gradiente de Funções Escalares**

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

### **2. Matriz Jacobiana (Gradiente de Funções Vetoriais)**

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

### **3. Gradientes de Matrizes e Tensores**

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

### **4. Backpropagation e Diferenciação Automática**

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

### **5. Matriz Hessiana e Derivadas de Ordem Superior**

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

### **6. Linearização e Séries de Taylor Multivariadas**

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

Abaixo está a extração detalhada e formal do **Capítulo 6 (*Probability and Distributions*)** do livro *Mathematics for Machine Learning*, organizada pelos seis tópicos centrais do capítulo e estruturada rigorosamente nos itens **(a)** a **(e)**.

---

### **1. Espaço de Probabilidade, Variáveis Aleatórias e Densidades (Seções 6.1 e 6.2)**

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

### **2. Regras da Probabilidade: Regra da Soma, do Produto e Teorema de Bayes (Seção 6.3)**

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

### **3. Estatísticas de Resumo: Média, Variância, Covariância e Correlação (Seções 6.4.1 a 6.4.3)**

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

### **4. Geometria de Variáveis Aleatórias e Mudança de Variáveis (Seções 6.4.6 e 6.7)**

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

### **5. Distribuição Gaussiana Multivariada (Seção 6.5)**

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

### **6. Conjugação, Estatísticas Suficientes e Família Exponencial (Seção 6.6)**

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

---

### **1. Otimização Não-Restrita e Descida do Gradiente (Gradient Descent & SGD)**

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

### **2. Otimização Restrita e Multiplicadores de Lagrange (Constrained Optimization & Lagrange Multipliers)**

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

### **3. Otimização Convexa, Conjuntos e Funções Convexas (Convex Optimization, Sets & Functions)**

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

### **4. Programação Linear (LP) e Programação Quadrática (QP)**

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

### **5. Transformada de Legendre-Fenchel e Conjugado Convexo (Convex Conjugate & Duality)**

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

---

Abaixo está a extração detalhada e formal do **Capítulo 8 (*When Models Meet Data*)** do livro *Mathematics for Machine Learning*, organizada pelos pilares conceituais do capítulo e estruturada nos itens **(a)** a **(e)**.

---

### **1. Representação de Dados, Modelos e Classes de Hipóteses (Seção 8.1 e 8.2.1)**

* **(a) Definições Formais e Notação Exata:**
  * **Vetor de Características (*Features*):** Cada ponto de dado é representado como um vetor \\(D\\)-dimensional \\(\boldsymbol{x}_n \in \mathbb{R}^D\\).
  * **Matriz de Dados e Vetor de Rótulos:** Para um conjunto de dados supervisionado com \\(N\\) exemplos, a coleção de entradas forma a matriz \\(\boldsymbol{X} := [\boldsymbol{x}_1, \dots, \boldsymbol{x}_N]^\top \in \mathbb{R}^{N \times D}\\) e os alvos formam o vetor \\(\boldsymbol{y} := [y_1, \dots, y_N]^\top \in \mathbb{R}^N\\).
  * **Preditor / Classe de Hipóteses:** Um preditor é parametrizado por \\(\boldsymbol{\theta}\\), denotado por \\(f(\cdot, \boldsymbol{\theta}): \mathbb{R}^D \to \mathbb{R}\\). O modelo afim compacto (incorporando o termo de intercepto \\(\theta_0\\) ao estender \\(\boldsymbol{x}_n\\) com \\(x^{(0)}=1\\)) é escrito como:
    \\[f(\boldsymbol{x}_n, \boldsymbol{\theta}) = \boldsymbol{\theta}^\top \boldsymbol{x}_n = \theta_0 + \sum_{d=1}^D \theta_d x_n^{(d)}\\]

* **(b) Intuição Geométrica:**
  Representar dados como vetores posiciona cada exemplo num espaço vetorial \\(D\\)-dimensional. Um modelo de função linear ou afim representa um **hiperplano de decisão ou ajuste** no espaço do gráfico entrada-saída, onde a orientação do plano é governada pelo vetor de pesos \\(\boldsymbol{\theta}\\) e o deslocamento da origem pelo intercepto \\(\theta_0\\).

* **(c) Exemplo Numérico Pequeno em 2D:**
  Considere prever o salário (\\(y\\), em milhares) a partir da idade (\\(x\\)) usando uma tabela simplificada com dados de \\(N=5\\) pessoas:
  \\[\text{Idades } \boldsymbol{x} =^\top, \quad \text{Salários } \boldsymbol{y} = [89.5, 123.5, 24.0, 138.8, 113.9]^\top\\]
  Ao interpolar no plano 2D \\((x, y)\\), busca-se uma reta \\(f(x) = \theta_1 x + \theta_0\\) que passe próxima aos pontos; por exemplo, para um indivíduo de 60 anos (\\(x=60\\)), a reta produz a previsão \\(\hat{y} = f(60)\\).

* **(d) Aplicação nos Modelos (ML):**
  * **Regressão Linear:** O vetor \\(\boldsymbol{x}_n\\) contém as variáveis explicativas contínuas e o rótulo \\(y_n \in \mathbb{R}\\) é contínuo.
  * **Classificação:** O vetor \\(\boldsymbol{x}_n\\) é mapeado para rótulos discretos ou inteiros \\(y_n \in \mathbb{Z}\\).

* **(e) Fórmulas Relevantes:**
  * Preditor Afim/Linear: \\(f(\boldsymbol{x}_n, \boldsymbol{\theta}) = \boldsymbol{\theta}^\top \boldsymbol{x}_n\\)
  * Matriz de Design / Dados: \\(\boldsymbol{X} \in \mathbb{R}^{N \times D}\\) e Vetor de Alvos: \\(\boldsymbol{y} \in \mathbb{R}^N\\)

---

### **2. Minimização do Risco Empírico e Regularização (Seção 8.2.2 e 8.2.3)**

* **(a) Definições Formais e Notação Exata:**
  * **Função de Perda (*Loss Function*):** \\(\ell(y_n, \hat{y}_n)\\) mede o custo de prever \\(\hat{y}_n = f(\boldsymbol{x}_n, \boldsymbol{\theta})\\) quando o valor real é \\(y_n\\).
  * **Risco Empírico:** Média das perdas sobre o conjunto de treinamento:
    \\[R_{\text{emp}}(f, \boldsymbol{X}, \boldsymbol{y}) = \frac{1}{N} \sum_{n=1}^N \ell(y_n, f(\boldsymbol{x}_n, \boldsymbol{\theta}))\\]
  * **Problema de Mínimos Quadrados:** Com perda quadrática \\(\ell(y_n, \hat{y}_n) = (y_n - \hat{y}_n)^2\\), o risco empírico na forma matricial é:
    \\[\min_{\boldsymbol{\theta} \in \mathbb{R}^D} \frac{1}{N} \|\boldsymbol{y} - \boldsymbol{X}\boldsymbol{\theta}\|^2\\]
  * **Risco Empírico Regularizado:** Adiciona um termo de penalidade sobre os parâmetros com hiperparâmetro \\(\lambda \ge 0\\):
    \\[\min_{\boldsymbol{\theta}} \frac{1}{N} \|\boldsymbol{y} - \boldsymbol{X}\boldsymbol{\theta}\|^2 + \lambda \|\boldsymbol{\theta}\|^2\\]

* **(b) Intuição Geométrica:**
  A minimização do risco empírico sem restrições ajusta a função estritamente aos pontos de treino. Se a classe de funções for excessivamente flexível (ex: polinômios de alto grau), ocorre **overfitting** (a curva oscila para passar por todos os pontos de treino, degradando no teste). A **regularização** \\(\lambda \|\boldsymbol{\theta}\|^2\\) restringe a norma do vetor de parâmetros, restringindo a "curvatura" do modelo e mantendo a função mais suave para garantir boa generalização.

* **(c) Exemplo Numérico em 2D:**
  Ao ajustar uma curva \\(f(x)\\) a 5 pontos observados no plano 2D, a minimização simples da perda quadrática \\(\frac{1}{5} \sum_{n=1}^5 (y_n - f(x_n))^2\\) sem regularização pode gerar um erro de treino zero, mas erro de teste alto. Adicionar o termo \\(\lambda \theta^2\\) encolhe os coeficientes para longe de valores extremos.

* **(d) Aplicação nos Modelos (ML):**
  * **Regressão Linear (Ridge Regression):** Corresponde exatamente à minimização da perda quadrática com regularização \\(L_2\\) (\\(\lambda \|\boldsymbol{\theta}\|_2^2\\)).
  * **Classificação (SVM):** O termo de penalidade e a perda Hinge minimizam o risco empírico regularizado focado na margem.

* **(e) Fórmulas Relevantes:**
  * Risco Empírico: \\(R_{\text{emp}}(f, \boldsymbol{X}, \boldsymbol{y}) = \frac{1}{N} \sum_{n=1}^N \ell(y_n, \hat{y}_n)\\)
  * Perda Quadrática Matricial: \\(R_{\text{emp}}(\boldsymbol{\theta}) = \frac{1}{N} \|\boldsymbol{y} - \boldsymbol{X}\boldsymbol{\theta}\|^2\\)
  * Formulação com Regularizador: \\(\min_{\boldsymbol{\theta}} \frac{1}{N} \|\boldsymbol{y} - \boldsymbol{X}\boldsymbol{\theta}\|^2 + \lambda \|\boldsymbol{\theta}\|^2\\)

---

### **3. Estimativa de Parâmetros: MLE e MAP (Seção 8.3)**

* **(a) Definições Formais e Notação Exata:**
  * **Verossimilhança (*Likelihood*) i.i.d.:** Assumindo observações independentes e identicamente distribuídas:
    \\[p(\boldsymbol{Y} \mid \boldsymbol{X}, \boldsymbol{\theta}) = \prod_{n=1}^N p(y_n \mid \boldsymbol{x}_n, \boldsymbol{\theta})\\]
  * **Estimador de Máxima Verossimilhança (MLE):** Minimiza a log-verossimilhança negativa (*Negative Log-Likelihood* - NLL):
    \\[\boldsymbol{\theta}_{\text{ML}} \in \arg\min_{\boldsymbol{\theta}} \mathcal{L}(\boldsymbol{\theta}), \quad \text{onde } \mathcal{L}(\boldsymbol{\theta}) = -\sum_{n=1}^N \log p(y_n \mid \boldsymbol{x}_n, \boldsymbol{\theta})\\]
  * **Verossimilhança Gaussiana:** Com ruído Gaussiano \\(y_n = \boldsymbol{x}_n^\top \boldsymbol{\theta} + \epsilon_n\\), em que \\(\epsilon_n \sim \mathcal{N}(0, \sigma^2)\\), a NLL torna-se:
    \\[\mathcal{L}(\boldsymbol{\theta}) = \frac{1}{2\sigma^2} \sum_{n=1}^N (y_n - \boldsymbol{x}_n^\top \boldsymbol{\theta})^2 + \frac{N}{2} \log(2\pi\sigma^2)\\]
  * **Estimador Máximo a Posteriori (MAP):** Incorpora uma distribuição a priori \\(p(\boldsymbol{\theta})\\) sobre os parâmetros:
    \\[\boldsymbol{\theta}_{\text{MAP}} \in \arg\max_{\boldsymbol{\theta}} p(\boldsymbol{\theta} \mid \boldsymbol{X}, \boldsymbol{Y}) = \arg\max_{\boldsymbol{\theta}} \{ \log p(\boldsymbol{Y} \mid \boldsymbol{X}, \boldsymbol{\theta}) + \log p(\boldsymbol{\theta}) \}\\]

* **(b) Intuição Geométrica:**
  A estimativa MLE busca os parâmetros \\(\boldsymbol{\theta}\\) que maximizam a altura da densidade de probabilidade conjuntamente sobre os dados observados. A estimativa MAP combina essa superfície de verossimilhança com a geometria da distribuição a priori \\(p(\boldsymbol{\theta})\\) (ex: uma Gaussiana centrada na origem atua como um poço de atração para que os parâmetros não fiquem excessivamente grandes).

* **(c) Exemplo Numérico em 2D:**
  Sob ruído Gaussiano com variância \\(\sigma^2\\) conhecida, a NLL dada por \\(\frac{1}{2\sigma^2}\sum_{n=1}^N (y_n - \boldsymbol{x}_n^\top\boldsymbol{\theta})^2\\) tem exatamente as mesmas curvas de nível elípticas no espaço de parâmetros que o problema de mínimos quadrados. Minimizar a NLL produz o mesmo ponto ótimo no plano de parâmetros \\(\boldsymbol{\theta}\\) que a minimização do risco empírico quadrático.

* **(d) Aplicação nos Modelos (ML):**
  * **Regressão Linear:** A solução MLE sob ruído Gaussiano equivale aos mínimos quadrados ordinários; a solução MAP com priori Gaussiana \\(\mathcal{N}(\mathbf{0}, b^2 \boldsymbol{I})\\) equivale à regressão Ridge.
  * **GMM:** O treinamento de modelos de mistura utiliza a maximização da verossimilhança (via algoritmo EM).

* **(e) Fórmulas Relevantes:**
  * Verossimilhança i.i.d.: \\(p(\boldsymbol{Y} \mid \boldsymbol{X}, \boldsymbol{\theta}) = \prod_{n=1}^N p(y_n \mid \boldsymbol{x}_n, \boldsymbol{\theta})\\)
  * Log-Verossimilhança Negativa (NLL): \\(\mathcal{L}(\boldsymbol{\theta}) = -\sum_{n=1}^N \log p(y_n \mid \boldsymbol{x}_n, \boldsymbol{\theta})\\)
  * NLL Gaussiana: \\(\mathcal{L}(\boldsymbol{\theta}) = \frac{1}{2\sigma^2}\sum_{n=1}^N (y_n - \boldsymbol{x}_n^\top \boldsymbol{\theta})^2 + \text{constante}\\)
  * Regra de Atualização MAP: \\(\boldsymbol{\theta}_{\text{MAP}} = \arg\max_{\boldsymbol{\theta}} [\sum_{n=1}^N \log p(y_n \mid \boldsymbol{x}_n, \boldsymbol{\theta}) + \log p(\boldsymbol{\theta})]\\)

---

### **4. Modelagem Probabilística, Variáveis Latentes e Modelos Gráficos (Seção 8.4 e 8.5)**

* **(a) Definições Formais e Notação Exata:**
  * **Modelo com Variáveis Latentes:** Quando existem variáveis não observadas \\(\boldsymbol{z}\\), a verossimilhança marginal dos dados observados \\(\boldsymbol{X}\\) é obtida integrando (ou somando) sobre as variáveis latentes:
    \\[p(\boldsymbol{X} \mid \boldsymbol{\theta}) = \int p(\boldsymbol{X}, \boldsymbol{z} \mid \boldsymbol{\theta}) d\boldsymbol{z} = \int p(\boldsymbol{X} \mid \boldsymbol{z}, \boldsymbol{\theta}) p(\boldsymbol{z}) d\boldsymbol{z}\\]
  * **Inferência a Posteriori das Latentes:** Computada pelo Teorema de Bayes:
    \\[p(\boldsymbol{z} \mid \boldsymbol{X}, \boldsymbol{\theta}) = \frac{p(\boldsymbol{X} \mid \boldsymbol{z}, \boldsymbol{\theta}) p(\boldsymbol{z})}{p(\boldsymbol{X} \mid \boldsymbol{\theta})}\\]
  * **Modelos Gráficos Direcionados (Redes Bayesianas):** Representam a fatoração da distribuição conjunta de variáveis aleatórias \\(\{x_1, \dots, x_K\}\\) em termos de dependências condicionais baseadas nos pais de cada nó no grafo \\(\text{pa}(x_k)\\):
    \\[p(x_1, \dots, x_K) = \prod_{k=1}^K p(x_k \mid \text{pa}(x_k))\\]
  * **Notação de Placa (*Plate Notation*):** Um retângulo contendo uma sub-rede indica que a variável ou processo é repetido \\(N\\) vezes de forma independente.

* **(b) Intuição Geométrica:**
  Os modelos gráficos direcionados oferecem uma representação visual e topológica das dependências condicionais entre variáveis. A propriedade de **d-separação** permite determinar a independência condicional entre conjuntos de variáveis inspecionando visualmente os caminhos no grafo.

* **(c) Exemplo Numérico / Estrutural em 2D:**
  Para um sistema de 3 variáveis com fatoração \\(p(a, b, c) = p(c \mid a, b) p(b \mid a) p(a)\\):
  * O nó \\(a\\) não possui pais.
  * O nó \\(b\\) possui \\(a\\) como pai (\\(a \to b\\)).
  * O nó \\(c\\) possui \\(a\\) e \\(b\\) como pais (\\(a \to c\\) e \\(b \to c\\)).

* **(d) Aplicação nos Modelos (ML):**
  * **PCA Probabilístico (PPCA):** Modela cada observação \\(\boldsymbol{x}_n\\) como gerada a partir de uma variável latente de menor dimensão \\(\boldsymbol{z}_n \sim \mathcal{N}(\mathbf{0}, \boldsymbol{I})\\).
  * **GMM:** A variável latente \\(\boldsymbol{z}_n\\) é um vetor indicador "1-de-\\(K\\)" que seleciona qual componente Gaussiana gerou o ponto \\(\boldsymbol{x}_n\\).

* **(e) Fórmulas Relevantes:**
  * Verossimilhança Marginal com Latentes: \\(p(\boldsymbol{X} \mid \boldsymbol{\theta}) = \int p(\boldsymbol{X} \mid \boldsymbol{z}, \boldsymbol{\theta}) p(\boldsymbol{z}) d\boldsymbol{z}\\)
  * Posterior da Latente: \\(p(\boldsymbol{z} \mid \boldsymbol{X}, \boldsymbol{\theta}) = \frac{p(\boldsymbol{X} \mid \boldsymbol{z}, \boldsymbol{\theta}) p(\boldsymbol{z})}{p(\boldsymbol{X} \mid \boldsymbol{\theta})}\\)
  * Fatoração em Grafos Direcionados: \\(p(x_1, \dots, x_K) = \prod_{k=1}^K p(x_k \mid \text{pa}(x_k))\\)

---

### **5. Seleção de Modelos e Critérios de Evidência (Seção 8.6)**

* **(a) Definições Formais e Notação Exata:**
  * **Razão de Posteriores (*Posterior Odds*) e Fator de Bayes:** Para comparar dois modelos \\(\mathcal{M}_1\\) e \\(\mathcal{M}_2\\) dado um dataset \\(\mathcal{D}\\):
    \\[\underbrace{\frac{p(\mathcal{M}_1 \mid \mathcal{D})}{p(\mathcal{M}_2 \mid \mathcal{D})}}_{\text{Posterior Odds}} = \underbrace{\frac{p(\mathcal{M}_1)}{p(\mathcal{M}_2)}}_{\text{Prior Odds}} \cdot \underbrace{\frac{p(\mathcal{D} \mid \mathcal{M}_1)}{p(\mathcal{D} \mid \mathcal{M}_2)}}_{\text{Fator de Bayes}}\\]
  * **Evidência do Modelo (*Marginal Likelihood*):** Integra sobre todo o espaço de parâmetros do modelo:
    \\[p(\mathcal{D} \mid \mathcal{M}_i) = \int p(\mathcal{D} \mid \boldsymbol{\theta}, \mathcal{M}_i) p(\boldsymbol{\theta} \mid \mathcal{M}_i) d\boldsymbol{\theta}\\]
  * **Critério de Informação Bayesiano (BIC):** Aproximação assintótica da evidência para a família exponencial, onde \\(N\\) é o número de dados e \\(M\\) o número de parâmetros livres:
    \\[\text{BIC} \approx \log p(\boldsymbol{x} \mid \boldsymbol{\theta}) - \frac{1}{2} M \log N\\]

* **(b) Intuição Geométrica:**
  A evidência do modelo \\(p(\mathcal{D} \mid \mathcal{M}_i)\\) incorpora a **Navalha de Ockham de forma automática**. Como a distribuição \\(p(\mathcal{D} \mid \mathcal{M}_i)\\) deve integrar \\(1\\) sobre todo o espaço de datasets possíveis, um modelo simples (poucos parâmetros) concentra sua massa em uma região pequena de datasets simples; já um modelo altamente complexo espalha sua massa sobre um volume enorme de datasets possíveis, recebendo um valor de evidência individual menor para datasets simples.

* **(c) Exemplo Numérico em 2D:**
  Ao comparar dois modelos em um problema de regressão 2D:
  * Modelo \\(\mathcal{M}_1\\): Reta (1 parâmetro de inclinação).
  * Modelo \\(\mathcal{M}_2\\): Polinômio de grau 10 (\\(11\\) parâmetros).
  O BIC penaliza o modelo \\(\mathcal{M}_2\\) subtraindo \\(\frac{11}{2} \log N\\) da log-verossimilhança, favorecendo a reta mais simples caso o ganho na verossimilhança não seja suficiente para compensar o número de parâmetros.

* **(d) Aplicação nos Modelos (ML):**
  * **Regressão Linear e GMM:** O BIC e a validação cruzada (*cross-validation*) são usados para escolher o grau do polinômio na regressão ou o número ideal de componentes \\(K\\) na mistura de Gaussianas.

* **(e) Fórmulas Relevantes:**
  * Razão de Posteriores / Fator de Bayes: \\(\frac{p(\mathcal{M}_1 \mid \mathcal{D})}{p(\mathcal{M}_2 \mid \mathcal{D})} = \frac{p(\mathcal{M}_1)}{p(\mathcal{M}_2)} \frac{p(\mathcal{D} \mid \mathcal{M}_1)}{p(\mathcal{D} \mid \mathcal{M}_2)}\\)
  * Integral da Evidência: \\(p(\mathcal{D} \mid \mathcal{M}_i) = \int p(\mathcal{D} \mid \boldsymbol{\theta}, \mathcal{M}_i) p(\boldsymbol{\theta} \mid \mathcal{M}_i) d\boldsymbol{\theta}\\)
  * Fórmula do BIC: \\(\text{BIC} \approx \log p(\boldsymbol{x} \mid \boldsymbol{\theta}) - \frac{1}{2} M \log N\\)

---

Abaixo está a extração detalhada e formal do **Capítulo 9 (*Linear Regression*)** do livro *Mathematics for Machine Learning*, organizada pelos seis blocos conceituais do capítulo e estruturada nos itens **(a)** a **(e)**.

---

### **1. Formulação Probabilística e Modelo de Verossimilhança**

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

### **2. Estimativa de Máxima Verossimilhança (MLE)**

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

### **3. Transformação não Linear de Características (Feature Mapping)**

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

### **4. Estimativa Máxima a Posteriori (MAP) e Regularização**

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

### **5. Regressão Linear Bayesiana (Bayesian Linear Regression)**

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

### **6. Máxima Verossimilhança como Projeção Ortogonal**

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

---

Abaixo está a extração detalhada e formal do **Capítulo 10 (*Dimensionality Reduction with Principal Component Analysis*)** do livro *Mathematics for Machine Learning*, organizada rigorosamente em torno dos tópicos centrais do capítulo e cobrindo os itens **(a)** a **(e)** solicitados.

---

### **(a) Definições Formais e Notação Exata**

1. **Configuração do Problema e Matrizes de Dados:**
   * **Dataset e Centralização:** Considera-se um conjunto de dados i.i.d. \\(\mathcal{X} = \{\boldsymbol{x}_1, \dots, \boldsymbol{x}_n, \dots, \boldsymbol{x}_N\}\\), em que cada ponto é um vetor de características \\(\boldsymbol{x}_n \in \mathbb{R}^D\\) centrado na origem (\\(E[\mathcal{X}] = \mathbf{0}\\)).
   * **Matriz de Dados (Convenção do Capítulo 10):** Ao contrário dos capítulos anteriores, os dados são organizados como **colunas** da matriz \\(\boldsymbol{X} = [\boldsymbol{x}_1, \dots, \boldsymbol{x}_N] \in \mathbb{R}^{D \times N}\\).
   * **Matriz de Covariância Empírica:** Matriz simétrica e definida positiva dada por:
     \\[\boldsymbol{S} = \frac{1}{N}\sum_{n=1}^N \boldsymbol{x}_n \boldsymbol{x}_n^\top = \frac{1}{N}\boldsymbol{X}\boldsymbol{X}^\top \in \mathbb{R}^{D \times D} \quad\\]

2. **Espaço de Projeção, Codificação e Reconstrução:**
   * **Base Ortogonal do Subespaço Principal:** Subespaço \\(U \subseteq \mathbb{R}^D\\) de dimensão \\(\dim(U) = M < D\\) com base dada pelas colunas da matriz de projeção \\(\boldsymbol{B} := [\boldsymbol{b}_1, \dots, \boldsymbol{b}_M] \in \mathbb{R}^{D \times M}\\). As colunas são ortonormais: \\(\boldsymbol{b}_i^\top \boldsymbol{b}_j = \delta_{ij}\\), o que implica \\(\boldsymbol{B}^\top \boldsymbol{B} = \boldsymbol{I}_M\\).
   * **Código / Representação de Baixa Dimensão:** O vetor de coordenadas compactado no subespaço de dimensão \\(M\\) é:
     \\[\boldsymbol{z}_n = \boldsymbol{B}^\top \boldsymbol{x}_n \in \mathbb{R}^M \quad\\]
   * **Codificador e Decodificador:** \\(\boldsymbol{B}^\top\\) opera como um **encoder** (que mapeia \\(\mathbb{R}^D \to \mathbb{R}^M\\)) e \\(\boldsymbol{B}\\) opera como um **decoder** (que reconstrói de \\(\mathbb{R}^M \to \mathbb{R}^D\\)).
   * **Vetor Reconstruído:** O dado projetado de volta no espaço original é:
     \\[\tilde{\boldsymbol{x}}_n = \boldsymbol{B}\boldsymbol{z}_n = \boldsymbol{B}\boldsymbol{B}^\top \boldsymbol{x}_n \in \mathbb{R}^D \quad\\]

3. **Componentes Principais (Visão da Variância Máxima):**
   * **O \\(1^\circ\\) Componente Principal:** O vetor unitário \\(\boldsymbol{b}_1 \in \mathbb{R}^D\\) que maximiza a variância projetada \\(V_1 = \boldsymbol{b}_1^\top \boldsymbol{S} \boldsymbol{b}_1\\) sob a restrição \\(\|\boldsymbol{b}_1\|^2 = 1\\) é a solução da equação de autovalores:
     \\[\boldsymbol{S}\boldsymbol{b}_1 = \lambda_1 \boldsymbol{b}_1 \quad\\]
   * **O \\(m\\)-ésimo Componente Principal:** Encontrado subtraindo o efeito dos primeiros \\(m-1\\) componentes da matriz de dados residual \\(\hat{\boldsymbol{X}} = \boldsymbol{X} - \boldsymbol{B}_{m-1}\boldsymbol{X}\\), onde \\(\boldsymbol{B}_{m-1} = \sum_{i=1}^{m-1} \boldsymbol{b}_i \boldsymbol{b}_i^\top\\).

4. **Erro de Reconstrução e Projeção Ortogonal:**
   * **Erro Médio de Reconstrução:** Média das distâncias Euclidianas ao quadrado:
     \\[J_M = \frac{1}{N} \sum_{n=1}^N \|\boldsymbol{x}_n - \tilde{\boldsymbol{x}}_n\|^2 \quad\\]
   * **Coordenadas Ótimas:** Obtidas anulando as derivadas parciais \\(\frac{\partial J_M}{\partial z_{in}} = 0 \implies z_{in} = \boldsymbol{b}_i^\top \boldsymbol{x}_n\\), provando que a projeção linear ótima é uma **projeção ortogonal**.
   * **Vetor Resíduo / Deslocamento:** O vetor diferença \\(\boldsymbol{x}_n - \tilde{\boldsymbol{x}}_n = \sum_{j=M+1}^D (\boldsymbol{b}_j^\top \boldsymbol{x}_n)\boldsymbol{b}_j\\) pertence estritamente ao complemento ortogonal \\(U^\perp\\).

5. **PCA Probabilístico (PPCA - Visão de Variável Latente):**
   * **Processo Gerativo:** Variável latente contínua \\(\boldsymbol{z} \sim \mathcal{N}(\mathbf{0}, \boldsymbol{I}_M)\\) e modelo de observação:
     \\[\boldsymbol{x} = \boldsymbol{B}\boldsymbol{z} + \boldsymbol{\mu} + \boldsymbol{\epsilon} \in \mathbb{R}^D, \quad \boldsymbol{\epsilon} \sim \mathcal{N}(\mathbf{0}, \sigma^2 \boldsymbol{I}_D) \quad\\]
   * **Verossimilhança Condicional:** \\(p(\boldsymbol{x} \mid \boldsymbol{z}) = \mathcal{N}(\boldsymbol{x} \mid \boldsymbol{B}\boldsymbol{z} + \boldsymbol{\mu}, \sigma^2 \boldsymbol{I}_D)\\).
   * **Distribuição Marginal Observada:** \\(p(\boldsymbol{x}) = \mathcal{N}(\boldsymbol{x} \mid \boldsymbol{\mu}, \boldsymbol{B}\boldsymbol{B}^\top + \sigma^2 \boldsymbol{I}_D)\\).

---

### **(b) Intuição Geométrica de Cada Conceito**

1. **Subespaço Principal e "Gargalo" de Informação:**
   * Em vez de trabalhar no espaço completo \\(D\\)-dimensional (ex: imagens do MNIST com \\(784\\) pixels), busca-se um hiperplano plano de dimensão \\(M \ll D\\). O código \\(\boldsymbol{z} \in \mathbb{R}^M\\) funciona geométricamente como um **gargalo de garrafa** (*bottleneck*) que limita a quantidade de informação transmitida entre o dado original e o reconstruído.

2. **Perspectiva da Variância Máxima:**
   * Imagina-se a nuvem de dados como um "sino" ou elipsoide flutuando no espaço \\(D\\)-dimensional. O PCA rotaciona o sistema de eixos para alinhar o primeiro eixo com a direção de maior comprimento/dispersão da nuvem de dados. Projetar sobre essa reta preserva o máximo de informação (variância) e minimiza o "achatamento" dos dados.

3. **Perspectiva da Projeção Ortogonal:**
   * A projeção ortogonal busca o ponto \\(\tilde{\boldsymbol{x}}\\) localizado dentro do subespaço \\(M\\)-dimensional que está física e geometricamente o mais próximo possível do ponto original \\(\boldsymbol{x}\\). O vetor de erro/deslocamento \\(\boldsymbol{x} - \tilde{\boldsymbol{x}}\\) forma um **ângulo reto exato (\\(90^\circ\\))** com a superfície do subespaço principal, situando-se inteiramente no complemento ortogonal \\(U^\perp\\).

4. **Conexão Geométrica com a SVD (Eckart-Young):**
   * A matriz de projeção \\(\boldsymbol{B}\boldsymbol{B}^\top\\) de posto \\(M\\) atua como a **melhor aproximação de baixo posto** para a matriz identidade \\(\boldsymbol{I}_D\\). Sob a ótica da SVD, o PCA rotaciona o espaço de entrada, ajusta as escalas de cada dimensão pelos valores singulares \\(\sigma_d = \sqrt{N\lambda_d}\\) e rotaciona o resultado no espaço final.

---

### **(c) Exemplo Numérico Pequeno em 2D**

Considere um conjunto de dados \\(2\text{D}\\) (\\(D=2\\)) já centrado na origem, composto por \\(N=3\\) pontos:
\\[\boldsymbol{x}_1 = \begin{bmatrix} -2 \\ -1 \end{bmatrix}, \quad \boldsymbol{x}_2 = \begin{bmatrix} 0 \\ 0 \end{bmatrix}, \quad \boldsymbol{x}_3 = \begin{bmatrix} 2 \\ 1 \end{bmatrix}\\]

1. **Matriz de Dados \\(\boldsymbol{X} \in \mathbb{R}^{2 \times 3}\\):**
   \\[\boldsymbol{X} = \begin{bmatrix} -2 & 0 & 2 \\ -1 & 0 & 1 \end{bmatrix} \quad\\]

2. **Matriz de Covariância Empírica \\(\boldsymbol{S} = \frac{1}{3}\boldsymbol{X}\boldsymbol{X}^\top\\):**
   \\[\boldsymbol{S} = \frac{1}{3} \begin{bmatrix} (-2)^2 + 0^2 + 2^2 & (-2)(-1) + 0 + 2(1) \\ (-1)(-2) + 0 + 1(1) & (-1)^2 + 0^2 + 1^2 \end{bmatrix} = \frac{1}{3} \begin{bmatrix} 8 & 4 \\ 4 & 2 \end{bmatrix} = \begin{bmatrix} 8/3 & 4/3 \\ 4/3 & 2/3 \end{bmatrix} \quad\\]

3. **Cálculo dos Autovalores de \\(\boldsymbol{S}\\):**
   \\[\det(\boldsymbol{S} - \lambda \boldsymbol{I}) = \left(\frac{8}{3} - \lambda\right)\left(\frac{2}{3} - \lambda\right) - \frac{16}{9} = \lambda^2 - \frac{10}{3}\lambda = 0 \implies \lambda_1 = \frac{10}{3} \approx 3,333, \quad \lambda_2 = 0 \quad\\]

4. **Cálculo do \\(1^\circ\\) Autovetor Unitário (\\(\boldsymbol{b}_1\\)):**
   \\[\left(\boldsymbol{S} - \frac{10}{3}\boldsymbol{I}\right)\boldsymbol{b}_1 = \begin{bmatrix} -2/3 & 4/3 \\ 4/3 & -8/3 \end{bmatrix} \begin{bmatrix} b_{11} \\ b_{12} \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix} \implies b_{11} = 2b_{12}\\]
   Normalizando para que \\(\|\boldsymbol{b}_1\| = 1\\):
   \\[\boldsymbol{b}_1 = \frac{1}{\sqrt{5}} \begin{bmatrix} 2 \\ 1 \end{bmatrix} \quad\\]

5. **Projeção para \\(M=1\\) Dimensão:**
   * **Coordenadas de Baixa Dimensão (\\(z_n = \boldsymbol{b}_1^\top \boldsymbol{x}_n\\)):**
     * \\(z_1 = \frac{1}{\sqrt{5}}[2(-2) + 1(-1)] = -\sqrt{5} \approx -2,236\\).
     * \\(z_2 = 0\\).
     * \\(z_3 = \frac{1}{\sqrt{5}}[2(2) + 1(1)] = \sqrt{5} \approx 2,236\\).
   * **Reconstrução (\\(\tilde{\boldsymbol{x}}_n = z_n \boldsymbol{b}_1\\)):**
     * \\(\tilde{\boldsymbol{x}}_1 = -\sqrt{5} \cdot \frac{1}{\sqrt{5}} \begin{bmatrix} 2 \\ 1 \end{bmatrix} = \begin{bmatrix} -2 \\ -1 \end{bmatrix} = \boldsymbol{x}_1\\).
     * \\(\tilde{\boldsymbol{x}}_2 = \begin{bmatrix} 0 \\ 0 \end{bmatrix} = \boldsymbol{x}_2\\), e \\(\tilde{\boldsymbol{x}}_3 = \begin{bmatrix} 2 \\ 1 \end{bmatrix} = \boldsymbol{x}_3\\).
   Como os pontos estavam originalmente sobre a reta \\(x_2 = 0,5 x_1\\), o segundo autovalor é \\(\lambda_2 = 0\\), significando erro de reconstrução nulo (\\(J_1 = \lambda_2 = 0\\)) e \\(100\%\\) da variância conservada.

---

### **(d) Como o Conceito Aparece nos Outros Modelos**

1. **Relação com Regressão Linear:**
   * **Geometria de Projeção Ortogonal:** Tanto a Regressão Linear por Mínimos Quadrados quanto o PCA fundamentam-se em **projeções ortogonais**. Na Regressão Linear, projeta-se o vetor de alvos \\(\boldsymbol{y} \in \mathbb{R}^N\\) ortogonalmente sobre o subespaço gerado pelas colunas de \\(\boldsymbol{\Phi}\\) (o erro minimizado é apenas a distância vertical em \\(y\\)). No PCA, projeta-se cada vetor de dados \\(\boldsymbol{x}_n \in \mathbb{R}^D\\) ortogonalmente sobre o subespaço principal \\(M\\)-dimensional (a distância minimizada é a distância perpendicular Euclidiana direta ao subespaço).
   * **Eliminação de Multicolinearidade:** O PCA é usado como passo de pré-processamento antes da regressão linear para extrair componentes descorrelacionados, resolvendo problemas em que a matriz de características possui colunas dependentes ou em instâncias onde \\(D > N\\).

2. **Relação com Classificação (SVM):**
   * **Redução de Dimensionalidade Pré-Classificação:** Para conjuntos de alta dimensão (como imagens), o PCA reduz a dimensão do espaço preservando a estrutura principal, permitindo que classificadores como SVMs operem com menor custo computacional e menor risco de *overfitting*.
   * **Visualização da Separação de Classes:** Permite projetar dados rotulados sobre \\(M=2\\) componentes principais para inspecionar a separabilidade geométrica entre classes (como exemplificado no livro para os dígitos "0" e "1" do MNIST).

3. **Relação com Gaussian Mixture Models (GMM):**
   * **Formulação de Variável Latente (PPCA vs. GMM):** O Probabilistic PCA (PPCA) e o GMM compartilham a mesma estrutura de modelos gráficos com variáveis latentes. No PPCA, a variável latente \\(\boldsymbol{z} \in \mathbb{R}^M\\) é **contínua e Gaussiana**. No GMM, a variável latente \\(\boldsymbol{z} \in \{0, 1\}^K\\) é **discreta** (um vetor indicador 1-de-\\(K\\)).
   * **Estabilização de Covariâncias:** O PCA é aplicado antes do ajuste de um GMM em dados de alta dimensão para evitar que as matrizes de covariância dos componentes \\(\boldsymbol{\Sigma}_k\\) se tornem singulares durante o algoritmo EM.

---

### **(e) Fórmulas Relevantes ao Longo do Capítulo**

1. **Matriz de Covariância dos Dados:**
   \\[\boldsymbol{S} = \frac{1}{N}\sum_{n=1}^N \boldsymbol{x}_n \boldsymbol{x}_n^\top = \frac{1}{N}\boldsymbol{X}\boldsymbol{X}^\top \in \mathbb{R}^{D \times D} \quad\\]

2. **Mapeamento de Codificação e Reconstrução:**
   \\[\boldsymbol{z}_n = \boldsymbol{B}^\top \boldsymbol{x}_n \in \mathbb{R}^M, \quad \tilde{\boldsymbol{x}}_n = \boldsymbol{B}\boldsymbol{z}_n = \boldsymbol{B}\boldsymbol{B}^\top \boldsymbol{x}_n \in \mathbb{R}^D \quad\\]

3. **Maximização da Variância (\\(1^\circ\\) Componente Principal):**
   \\[\max_{\boldsymbol{b}_1} \boldsymbol{b}_1^\top \boldsymbol{S} \boldsymbol{b}_1 \quad \text{s.t.} \quad \boldsymbol{b}_1^\top \boldsymbol{b}_1 = 1 \implies \boldsymbol{S}\boldsymbol{b}_1 = \lambda_1 \boldsymbol{b}_1, \quad V_1 = \lambda_1 \quad\\]

4. **Variância Total Retida e Variância Perdida:**
   \\[V_M = \sum_{m=1}^M \lambda_m, \quad J_M = \sum_{j=M+1}^D \lambda_j = V_D - V_M \quad\\]
   \\[\text{Proporção de Variância Explicada} = \frac{V_M}{V_D} = \frac{\sum_{m=1}^M \lambda_m}{\sum_{d=1}^D \lambda_d} \quad\\]

5. **Erro Médio de Reconstrução (Projeção Ortogonal):**
   \\[J_M = \frac{1}{N}\sum_{n=1}^N \|\boldsymbol{x}_n - \tilde{\boldsymbol{x}}_n\|^2 = \sum_{j=M+1}^D \boldsymbol{b}_j^\top \boldsymbol{S} \boldsymbol{b}_j = \sum_{j=M+1}^D \lambda_j \quad\\]

6. **Coordenadas Ótimas de Projeção:**
   \\[z_{in} = \boldsymbol{b}_i^\top \boldsymbol{x}_n \implies \tilde{\boldsymbol{x}}_n = \sum_{m=1}^M (\boldsymbol{b}_m^\top \boldsymbol{x}_n)\boldsymbol{b}_m = \boldsymbol{B}\boldsymbol{B}^\top \boldsymbol{x}_n \quad\\]

7. **Conexão SVD e Decomposição Espectral:**
   \\[\boldsymbol{X} = \boldsymbol{U}\boldsymbol{\Sigma}\boldsymbol{V}^\top \implies \boldsymbol{S} = \frac{1}{N}\boldsymbol{X}\boldsymbol{X}^\top = \frac{1}{N}\boldsymbol{U}\boldsymbol{\Sigma}\boldsymbol{\Sigma}^\top \boldsymbol{U}^\top, \quad \lambda_d = \frac{\sigma_d^2}{N} \quad\\]

8. **Aproximação de Baixo Posto (Teorema de Eckart-Young):**
   \\[\tilde{\boldsymbol{X}}_M = \arg\min_{\text{rk}(\boldsymbol{A}) \le M} \|\boldsymbol{X} - \boldsymbol{A}\|_2 = \boldsymbol{U}_M \boldsymbol{\Sigma}_M \boldsymbol{V}_M^\top \quad\\]

9. **PCA para Dados em Altas Dimensões (\\(D \gg N\\)):**
   \\[\frac{1}{N}\boldsymbol{X}^\top\boldsymbol{X} \boldsymbol{c}_m = \lambda_m \boldsymbol{c}_m \implies \boldsymbol{b}_m = \boldsymbol{X}\boldsymbol{c}_m \quad\\]

10. **Parâmetros MLE do Probabilistic PCA (PPCA):**
    \\[\boldsymbol{\mu}_{\text{ML}} = \frac{1}{N}\sum_{n=1}^N \boldsymbol{x}_n, \quad \boldsymbol{B}_{\text{ML}} = \boldsymbol{T}(\boldsymbol{\Lambda}_M - \sigma^2 \boldsymbol{I})^{1/2}\boldsymbol{R}, \quad \sigma^2_{\text{ML}} = \frac{1}{D-M}\sum_{j=M+1}^D \lambda_j \quad\\]

---

Abaixo está a extração detalhada do **Capítulo 11 (*Density Estimation with Gaussian Mixture Models*)** do livro *Mathematics for Machine Learning*, organizada pelos tópicos e estruturada nos itens **(a)** a **(e)** solicitados.

---

### **(a) Definições Formais com Notação Exata**

1. **Gaussian Mixture Model (GMM / Modelo de Mistura de Gaussianas):**
   * **Densidade de Probabilidade Conjunta:** Uma mistura de \\(K\\) distribuições Gaussianas multivariadas para um vetor de dados \\(\boldsymbol{x} \in \mathbb{R}^D\\) é definida por:
     \\[p(\boldsymbol{x} \mid \boldsymbol{\theta}) = \sum_{k=1}^K \pi_k \mathcal{N}(\boldsymbol{x} \mid \boldsymbol{\mu}_k, \boldsymbol{\Sigma}_k)\\]
   * **Restrições dos Pesos de Mistura (*Mixture Weights*):** Os coeficientes \\(\pi_k\\) formam uma combinação convexa e satisfazem:
     \\[0 \le \pi_k \le 1 \quad \text{e} \quad \sum_{k=1}^K \pi_k = 1\\]
   * **Conjunto de Parâmetros do Modelo:** Coleção de todas as variáveis livres do modelo:
     \\[\boldsymbol{\theta} := \{\boldsymbol{\mu}_k, \boldsymbol{\Sigma}_k, \pi_k : k = 1, \dots, K\}\\]

2. **Log-Verossimilhança do GMM:**
   * Para um conjunto de dados i.i.d. \\(\mathcal{X} = \{\boldsymbol{x}_1, \dots, \boldsymbol{x}_N\}\\) com \\(\boldsymbol{x}_n \in \mathbb{R}^D\\), a função de log-verossimilhança é dada por:
     \\[\log p(\mathcal{X} \mid \boldsymbol{\theta}) = \sum_{n=1}^N \log p(\boldsymbol{x}_n \mid \boldsymbol{\theta}) = \sum_{n=1}^N \log \left( \sum_{k=1}^K \pi_k \mathcal{N}(\boldsymbol{x}_n \mid \boldsymbol{\mu}_k, \boldsymbol{\Sigma}_k) \right)\\]

3. **Responsabilidades (*Responsibilities*):**
   * A responsabilidade \\(r_{nk}\\) é a probabilidade a posteriori de que o \\(n\\)-ésimo ponto de dado \\(\boldsymbol{x}_n\\) tenha sido gerado pela \\(k\\)-ésima componente Gaussiana:
     \\[r_{nk} := p(z_{nk} = 1 \mid \boldsymbol{x}_n) = \frac{\pi_k \mathcal{N}(\boldsymbol{x}_n \mid \boldsymbol{\mu}_k, \boldsymbol{\Sigma}_k)}{\sum_{j=1}^K \pi_j \mathcal{N}(\boldsymbol{x}_n \mid \boldsymbol{\mu}_j, \boldsymbol{\Sigma}_j)}\\]
   * **Propriedade de Distribuição Suave:** O vetor \\(\boldsymbol{r}_n = [r_{n1}, \dots, r_{nK}]^\top \in \mathbb{R}^K\\) satisfaz \\(r_{nk} \ge 0\\) e \\(\sum_{k=1}^K r_{nk} = 1\\).
   * **Responsabilidade Total do Cluster \\(k\\):**
     \\[N_k := \sum_{n=1}^N r_{nk}\\]

4. **Perspectiva de Variável Latente Discreta:**
   * **Vetor Indicador Latente (*1-de-K / Multinoulli*):** Para cada observação \\(\boldsymbol{x}_n\\), associa-se um vetor latente não observado \\(\boldsymbol{z}_n = [z_{n1}, \dots, z_{nK}]^\top \in \{0, 1\}^K\\) contendo exatamente um elemento igual a 1 e todos os outros iguais a 0.
   * **Distribuição a Priori sobre a Latente:** \\(p(z_{nk} = 1) = \pi_k\\).
   * **Verossimilhança Condicional dos Dados:** \\(p(\boldsymbol{x}_n \mid z_{nk} = 1) = \mathcal{N}(\boldsymbol{x}_n \mid \boldsymbol{\mu}_k, \boldsymbol{\Sigma}_k)\\).
   * **Distribuição Conjunta:** \\(p(\boldsymbol{x}_n, z_{nk} = 1) = \pi_k \mathcal{N}(\boldsymbol{x}_n \mid \boldsymbol{\mu}_k, \boldsymbol{\Sigma}_k)\\).

5. **Algoritmo Expectation-Maximization (EM):**
   * **E-step (Passo de Expectativa):** Calcula as responsabilidades \\(r_{nk}\\) para todos os \\(n=1,\dots,N\\) e \\(k=1,\dots,K\\) mantendo os parâmetros atuais \\(\boldsymbol{\theta}\\) fixos.
   * **M-step (Passo de Maximização):** Re-estima os parâmetros do modelo atualizando as médias, covariâncias e pesos de mistura:
     \\[\boldsymbol{\mu}_k^{\text{new}} = \frac{1}{N_k} \sum_{n=1}^N r_{nk} \boldsymbol{x}_n\\]
     \\[\boldsymbol{\Sigma}_k^{\text{new}} = \frac{1}{N_k} \sum_{n=1}^N r_{nk} (\boldsymbol{x}_n - \boldsymbol{\mu}_k^{\text{new}})(\boldsymbol{x}_n - \boldsymbol{\mu}_k^{\text{new}})^\top\\]
     \\[\pi_k^{\text{new}} = \frac{N_k}{N}\\]

---

### **(b) Intuição Geométrica de Cada Conceito**

1. **GMM como Superfície Elíptica Multimodal:**
   * Uma única Gaussiana gera contornos elípticos de nível em 2D centrados em uma única média. O GMM combina linearmente várias elipses no plano. Isso permite que o modelo molde contornos de probabilidade complexos e com múltiplos picos (multimodais) ao redor de grupos de dados espalhados no espaço.
2. **Responsabilidades (\\(r_{nk}\\)) como "Atribuição Suave" (*Soft Assignment*):**
   * Em vez de traçar uma fronteira rígida onde cada ponto pertence \\(100\%\\) a um único cluster, a responsabilidade mede a fração contínua de pertencimento de um ponto a cada uma das \\(K\\) componentes elípticas. Geometricamente, pontos localizados na interseção de duas elipses recebem probabilidades intermediárias (ex: \\(r_{n1} = 0,5, r_{n2} = 0,5\\)).
3. **Mapeamento de Atualização no Passo M:**
   * **Média (\\(\boldsymbol{\mu}_k\\)):** É o centro de massa ponderado dos pontos. Geometricamente, a nova média do cluster \\(k\\) é "puxada" em direção a cada ponto \\(\boldsymbol{x}_n\\) com uma força proporcional à responsabilidade \\(r_{nk}\\).
   * **Covariância (\\(\boldsymbol{\Sigma}_k\\)):** As elipses de nível se expandem, comprimem e giram para se alinharem com os eixos de maior dispersão dos pontos atribuídos a essa componente.
   * **Pesos (\\(\pi_k\\)):** Representam a proporção da massa total da densidade que cada elipse ocupa no espaço de dados.

---

### **(c) Exemplo Numérico Pequeno em 2D**

Considere um conjunto de dados simples em \\(\mathbb{R}^2\\) com \\(N=3\\) pontos:
\\[\boldsymbol{x}_1 = \begin{bmatrix} 0 \\ 0 \end{bmatrix}, \quad \boldsymbol{x}_2 = \begin{bmatrix} 1 \\ 1 \end{bmatrix}, \quad \boldsymbol{x}_3 = \begin{bmatrix} 5 \\ 5 \end{bmatrix}\\]

Ajustando um GMM com \\(K=2\\) componentes Gaussianas isotrópicas com variância fixa \\(\boldsymbol{\Sigma}_1 = \boldsymbol{\Sigma}_2 = \mathbf{I}_2\\) e pesos iniciais \\(\pi_1 = \pi_2 = 0,5\\):
* Médias iniciais: \\(\boldsymbol{\mu}_1 = \begin{bmatrix} 0 \\ 0 \end{bmatrix}\\) e \\(\boldsymbol{\mu}_2 = \begin{bmatrix} 4 \\ 4 \end{bmatrix}\\).

1. **Cálculo do Passo E (Responsabilidades \\(r_{nk}\\)):**
   * A densidade bivariada é \\(\mathcal{N}(\boldsymbol{x} \mid \boldsymbol{\mu}_k, \mathbf{I}_2) = \frac{1}{2\pi} \exp\left(-\frac{1}{2}\|\boldsymbol{x} - \boldsymbol{\mu}_k\|^2\right)\\).
   * Para \\(\boldsymbol{x}_1 = ^\top\\):
     * \\(\|\boldsymbol{x}_1 - \boldsymbol{\mu}_1\|^2 = 0 \implies \mathcal{N}_1 \approx 0,1592\\).
     * \\(\|\boldsymbol{x}_1 - \boldsymbol{\mu}_2\|^2 = 4^2 + 4^2 = 32 \implies \mathcal{N}_2 = \frac{1}{2\pi} e^{-16} \approx 0,0000\\).
     * Responsabilidades: \\(r_{11} \approx 1,0\\), \\(r_{12} \approx 0,0\\).
   * Para \\(\boldsymbol{x}_2 =^\top\\):
     * \\(\|\boldsymbol{x}_2 - \boldsymbol{\mu}_1\|^2 = 1^2 + 1^2 = 2 \implies \mathcal{N}_1 = \frac{1}{2\pi} e^{-1} \approx 0,0585\\).
     * \\(\|\boldsymbol{x}_2 - \boldsymbol{\mu}_2\|^2 = (-3)^2 + (-3)^2 = 18 \implies \mathcal{N}_2 = \frac{1}{2\pi} e^{-9} \approx 0,00002\\).
     * Responsabilidades: \\(r_{21} \approx 0,9996\\), \\(r_{22} \approx 0,0004\\).
   * Para \\(\boldsymbol{x}_3 =^\top\\):
     * \\(\|\boldsymbol{x}_3 - \boldsymbol{\mu}_1\|^2 = 50 \implies \mathcal{N}_1 \approx 0,0000\\).
     * \\(\|\boldsymbol{x}_3 - \boldsymbol{\mu}_2\|^2 = 1^2 + 1^2 = 2 \implies \mathcal{N}_2 \approx 0,0585\\).
     * Responsabilidades: \\(r_{31} \approx 0,0\\), \\(r_{32} \approx 1,0\\).

2. **Cálculo do Passo M (Atualização das Médias \\(\boldsymbol{\mu}_k^{\text{new}}\\)):**
   * Responsabilidades totais:
     \\[N_1 = r_{11} + r_{21} + r_{31} \approx 1,0 + 0,9996 + 0,0 = 1,9996\\]
     \\[N_2 = r_{12} + r_{22} + r_{32} \approx 0,0 + 0,0004 + 1,0 = 1,0004\\]
   * Novas Médias:
     \\[\boldsymbol{\mu}_1^{\text{new}} = \frac{1,0 \begin{bmatrix}0\\0\end{bmatrix} + 0,9996 \begin{bmatrix}1\\1\end{bmatrix} + 0,0 \begin{bmatrix}5\\5\end{bmatrix}}{1,9996} \approx \begin{bmatrix} 0,5 \\ 0,5 \end{bmatrix}\\]
     \\[\boldsymbol{\mu}_2^{\text{new}} = \frac{0,0 \begin{bmatrix}0\\0\end{bmatrix} + 0,0004 \begin{bmatrix}1\\1\end{bmatrix} + 1,0 \begin{bmatrix}5\\5\end{bmatrix}}{1,0004} \approx \begin{bmatrix} 5,0 \\ 5,0 \end{bmatrix}\\]

Geometricamente, a média \\(\boldsymbol{\mu}_1\\) moveu-se do ponto de origem \\(^\top\\) para o centro do primeiro cluster em \\([0.5, 0.5]^\top\\), enquanto \\(\boldsymbol{\mu}_2\\) moveu-se para \\(^\top\\).

---

### **(d) Como o Conceito Aparece nos Outros Modelos**

1. **Relação com Regressão Linear:**
   * A regressão linear simples assume ruído Gaussiano centrado sobre uma única função linear \\(y = \boldsymbol{x}^\top \boldsymbol{\theta} + \epsilon\\). Quando os dados contêm múltiplas subpopulações ou relações multi-avaliadas, o GMM permite modelar a densidade conjunta \\(p(\boldsymbol{x}, y)\\), estendendo a regressão para **Misturas de Regressores Lineares**.
2. **Relação com Classificação (Classificadores Gerativos):**
   * O GMM é o pilar dos **classificadores gerativos probabilísticos** (como LDA e QDA). Ao atribuir cada componente Gaussiana a uma classe \\(k\\), a probabilidade a posteriori de uma nova observação pertencer à classe \\(k\\) dada pelo Teorema de Bayes é algebricamente idêntica à fórmula de **responsabilidade** \\(r_{nk} = p(z_k = 1 \mid \boldsymbol{x}_n)\\).
3. **Relação com Clusterização (GMM vs. K-Means):**
   * O algoritmo K-Means é um limite estrito (*hard clustering*) do algoritmo EM para GMM. Quando se fixa as covariâncias como matrizes de identidade \\(\boldsymbol{\Sigma}_k = \sigma^2 \mathbf{I}\\) e faz-se a variância tender a zero (\\(\sigma^2 \to 0\\)), as atribuições suaves de responsabilidade \\(r_{nk} \in\\) colapsam em atribuições discretas de 0 ou 1, e o passo M de atualização das médias do GMM torna-se a média aritmética simples dos pontos atribuídos a cada cluster do K-Means.

---

### **(e) Fórmulas Relevantes ao Longo do Capítulo**

1. **Densidade do GMM:**
   \\[p(\boldsymbol{x} \mid \boldsymbol{\theta}) = \sum_{k=1}^K \pi_k \mathcal{N}(\boldsymbol{x} \mid \boldsymbol{\mu}_k, \boldsymbol{\Sigma}_k)\\]

2. **Restrições dos Pesos de Mistura:**
   \\[\sum_{k=1}^K \pi_k = 1, \quad 0 \le \pi_k \le 1\\]

3. **Log-Verossimilhança do Dataset:**
   \\[\log p(\mathcal{X} \mid \boldsymbol{\theta}) = \sum_{n=1}^N \log \left( \sum_{k=1}^K \pi_k \mathcal{N}(\boldsymbol{x}_n \mid \boldsymbol{\mu}_k, \boldsymbol{\Sigma}_k) \right)\\]

4. **Fórmula das Responsabilidades (Passo E):**
   \\[r_{nk} = \frac{\pi_k \mathcal{N}(\boldsymbol{x}_n \mid \boldsymbol{\mu}_k, \boldsymbol{\Sigma}_k)}{\sum_{j=1}^K \pi_j \mathcal{N}(\boldsymbol{x}_n \mid \boldsymbol{\mu}_j, \boldsymbol{\Sigma}_j)}\\]

5. **Responsabilidade Total do Cluster \\(k\\):**
   \\[N_k = \sum_{n=1}^N r_{nk}\\]

6. **Atualização das Médias (Passo M):**
   \\[\boldsymbol{\mu}_k^{\text{new}} = \frac{1}{N_k} \sum_{n=1}^N r_{nk} \boldsymbol{x}_n\\]

7. **Atualização das Matrizes de Covariância (Passo M):**
   \\[\boldsymbol{\Sigma}_k^{\text{new}} = \frac{1}{N_k} \sum_{n=1}^N r_{nk} (\boldsymbol{x}_n - \boldsymbol{\mu}_k)(\boldsymbol{x}_n - \boldsymbol{\mu}_k)^\top\\]

8. **Atualização dos Pesos de Mistura (Passo M):**
   \\[\pi_k^{\text{new}} = \frac{N_k}{N}\\]

9. **Distribuição Conjunta Dados-Latente:**
   \\[p(\boldsymbol{x}_n, z_{nk} = 1) = p(z_{nk} = 1) p(\boldsymbol{x}_n \mid z_{nk} = 1) = \pi_k \mathcal{N}(\boldsymbol{x}_n \mid \boldsymbol{\mu}_k, \boldsymbol{\Sigma}_k)\\]

10. **Densidade Gaussiana Multivariada da Componente \\(k\\):**
    \\[\mathcal{N}(\boldsymbol{x} \mid \boldsymbol{\mu}_k, \boldsymbol{\Sigma}_k) = (2\pi)^{-\frac{D}{2}} |\boldsymbol{\Sigma}_k|^{-\frac{1}{2}} \exp \left( -\frac{1}{2} (\boldsymbol{x} - \boldsymbol{\mu}_k)^\top \boldsymbol{\Sigma}_k^{-1} (\boldsymbol{x} - \boldsymbol{\mu}_k) \right)\\]

---

Abaixo está a extração detalhada do **Capítulo 12 (*Classification with Support Vector Machines*)** do livro *Mathematics for Machine Learning*, organizada pelos seis pilares conceituais do capítulo e estruturada nos itens **(a)** a **(e)**.

---

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

### **1. Fluxo de Dependência Conceitual**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      CAPÍTULO 9: REGRESSÃO LINEAR                       │
│  - Modelo Probabilístico: y = Φθ + ε,  ε ~ N(0, σ²I)                    │
│  - Função de Perda (Log-Verossimilhança Negativa / Mínimos Quadrados): │
│                 L(θ) = (1 / 2σ²) ||y - Φθ||²                            │
└────────────────────┬────────────────────────────┬───────────────────────┘
                     │                            │
                     ▼                            ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────────────┐
│     CAMINHO 1: SOLUÇÃO ANALÍTICA    │  │   CAMINHO 2: SOLUÇÃO ITERATIVA       │
│           (Closed-Form)              │  │        (Gradiente Descendente)       │
└──────────────────┬───────────────────┘  └──────────────────┬───────────────────┘
                   │                                         │
                   ▼                                         ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────────────┐
│      CAPÍTULO 4: DECOMPOSIÇÕES       │  │       CAPÍTULO 7: OTIMIZAÇÃO         │
│  - Análise de Posto e Invertibilidade│  │  - Vetor Gradiente da Perda:         │
│  - Fatoração de Cholesky (LLᵀ)       │  │    ∇L(θ) = -1/σ² · Φᵀ(y - Φθ)        │
│  - Pseudo-inversa via SVD (UΣVᵀ)     │  │  - Regra de Atualização:             │
│    para matrizes mal condicionadas   │  │    θ⁽ⁱ⁺¹⁾ = θ⁽ⁱ⁾ - γ ∇L(θ⁽ⁱ⁾)ᵀ       │
└──────────────────┬───────────────────┘  └──────────────────┬───────────────────┘
                   │                                         │
                   └──────────────────┬──────────────────────┘
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                   MODELO TREINADO E PRONTO PARA PREDIÇÃO                │
│                 θ* Analítico ou θ* Convergido via GD                    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### **2. Contribuição Específica de Cada Capítulo**

#### **Capítulo 9: O Ponto de Partida e Formulação do Problema**
* **Formulação da Perda:** O Capítulo 9 estabelece que a busca pelos parâmetros ideais \\(\boldsymbol{\theta}\\) sob um ruído Gaussiano \\(\epsilon \sim \mathcal{N}(0, \sigma^2)\\) equivale a minimizar a log-verossimilhança negativa:
  \\[\mathcal{L}(\boldsymbol{\theta}) = \frac{1}{2\sigma^2} \|\boldsymbol{y} - \boldsymbol{\Phi}\boldsymbol{\theta}\|^2 = \frac{1}{2\sigma^2} (\boldsymbol{y} - \boldsymbol{\Phi}\boldsymbol{\theta})^\top (\boldsymbol{y} - \boldsymbol{\Phi}\boldsymbol{\theta})\\]
* **Derivada da Perda (Gradiente):** Calculando o gradiente de \\(\mathcal{L}(\boldsymbol{\theta})\\) em relação a \\(\boldsymbol{\theta}\\):
  \\[\nabla_{\boldsymbol{\theta}} \mathcal{L}(\boldsymbol{\theta}) = -\frac{1}{\sigma^2} (\boldsymbol{y} - \boldsymbol{\Phi}\boldsymbol{\theta})^\top \boldsymbol{\Phi} \in \mathbb{R}^{1 \times D}\\]

---

#### **Caminho 1: Formação da Solução Analítica (Capítulo 9 + Capítulo 4)**

Para encontrar a solução exata em forma fechada (*closed-form*), iguala-se o gradiente a zero (\\(\nabla_{\boldsymbol{\theta}} \mathcal{L} = \mathbf{0}^\top\\)), obtendo as **Equações Normais**:
\\[\boldsymbol{\Phi}^\top \boldsymbol{\Phi} \boldsymbol{\theta} = \boldsymbol{\Phi}^\top \boldsymbol{y} \implies \boldsymbol{\theta}_{\text{ML}} = (\boldsymbol{\Phi}^\top \boldsymbol{\Phi})^{-1} \boldsymbol{\Phi}^\top \boldsymbol{y}\\]

O **Capítulo 4 (Decomposições Matriciais)** intervém decisivamente no cálculo numérico e na garantia dessa inversão:

1. **Invertibilidade e Autovalores (Seções 4.1 e 4.2):** A matriz \\(\boldsymbol{\Phi}^\top \boldsymbol{\Phi}\\) só possui inversa \\((\boldsymbol{\Phi}^\top \boldsymbol{\Phi})^{-1}\\) se tiver posto cheio (\\(\text{rk}(\boldsymbol{\Phi}) = K\\)), o que equivale a ter todos os seus autovalores estritamente positivos (\\(\lambda_i > 0\\)), sendo portanto uma matriz **Simétrica Definida Positiva (SPD)**.
2. **Resolução Eficiente via Cholesky (Seção 4.3):** Em vez de inverter \\((\boldsymbol{\Phi}^\top \boldsymbol{\Phi})\\) diretamente (o que é computacionalmente custoso e instável), decompõe-se a matriz SPD usando a **Fatoração de Cholesky**:
   \\[\boldsymbol{\Phi}^\top \boldsymbol{\Phi} = \boldsymbol{L}\boldsymbol{L}^\top\\]
   A equação normal torna-se \\(\boldsymbol{L}\boldsymbol{L}^\top \boldsymbol{\theta} = \boldsymbol{\Phi}^\top \boldsymbol{y}\\), sendo resolvida em duas etapas por substituição direta com custo muito menor.
3. **Estabilidade via SVD / Pseudo-Inversa (Seção 4.5):** Se a matriz de características \\(\boldsymbol{\Phi}\\) for colinear ou singular (não invertível), a decomposição em valores singulares (**SVD**) \\(\boldsymbol{\Phi} = \boldsymbol{U}\boldsymbol{\Sigma}\boldsymbol{V}^\top\\) permite obter a **Pseudo-inversa de Moore-Penrose** \\(\boldsymbol{\Phi}^+ = \boldsymbol{V}\boldsymbol{\Sigma}^+\boldsymbol{U}^\top\\), garantindo uma solução estável mesmo para matrizes mal condicionadas.

---

#### **Caminho 2: Formação da Solução Iterativa via Gradiente Descendente (Capítulo 9 + Capítulo 7 + Capítulo 4)**

Quando o número de dados \\(N\\) ou de características \\(D\\) é muito grande, a inversão analítica torna-se inviável. Recorre-se então à otimização iterativa.

1. **Algoritmo do Gradiente Descendente (Seção 7.1):** O Capítulo 7 define a regra de atualização dos parâmetros dando passos na direção oposta ao gradiente:
   \\[\boldsymbol{\theta}^{(i+1)} = \boldsymbol{\theta}^{(i)} - \gamma \left( \nabla_{\boldsymbol{\theta}} \mathcal{L}(\boldsymbol{\theta}^{(i)}) \right)^\top\\]
   Substituindo o gradiente calculado no Capítulo 9:
   \\[\boldsymbol{\theta}^{(i+1)} = \boldsymbol{\theta}^{(i)} + \frac{\gamma}{\sigma^2} \boldsymbol{\Phi}^\top \left( \boldsymbol{y} - \boldsymbol{\Phi}\boldsymbol{\theta}^{(i)} \right)\\]

2. **Garantia de Mínimo Global via Convexidade (Seção 7.3):** O Capítulo 7 prova que, para funções convexas (onde a matriz Hessiana \\(\boldsymbol{H} = \nabla^2 \mathcal{L} = \boldsymbol{\Phi}^\top \boldsymbol{\Phi} \succeq \mathbf{0}\\) é semi-definida positiva), qualquer mínimo local atingido pelo Gradiente Descendente é **garantidamente o mínimo global**.

3. **Taxa de Convergência e Condicionamento (Capítulos 4 e 7):** A velocidade de convergência do Gradiente Descendente depende do **número de condicionamento** (\\(\kappa\\)) do problema de otimização:
   \\[\kappa = \frac{\lambda_{\max}(\boldsymbol{\Phi}^\top \boldsymbol{\Phi})}{\lambda_{\min}(\boldsymbol{\Phi}^\top \boldsymbol{\Phi})}\\]
   Aqui, os **autovalores** (\\(\lambda_i\\)) extraídos da matriz no Capítulo 4 determinam a geometria da superfície de perda: se a razão entre o maior e o menor autovalor for muito alta, as curvas de nível formam elipses estreitas e o Gradiente Descendente oscila de um lado para o outro das "paredes do vale", desacelerando a convergência.

---

### **Resumo da Conexão**

| Capítulo MML | Papel na Solução Analítica (Closed-Form) | Papel na Solução por Gradiente Descendente |
| :--- | :--- | :--- |
| **Cap. 9 (Regressão Linear)** | Formula a perda \\(\mathcal{L}(\boldsymbol{\theta})\\) e deduz as Equações Normais (\\(\boldsymbol{\Phi}^\top \boldsymbol{\Phi} \boldsymbol{\theta} = \boldsymbol{\Phi}^\top \boldsymbol{y}\\)). | Fornece a expressão do gradiente \\(\nabla \mathcal{L}(\boldsymbol{\theta})\\) a cada passo. |
| **Cap. 7 (Otimização)** | Determina a condição necessária de 1ª ordem para o ponto crítico (\\(\nabla \mathcal{L} = \mathbf{0}\\)). | Fornece a regra de atualização iterativa e prova a convergência ao mínimo global via convexidade. |
| **Cap. 4 (Decomposições)** | Garante a invertibilidade via autovalores e permite resolver o sistema eficientemente via **Cholesky** ou **SVD**. | Os **autovalores** (\\(\lambda_{\max}/\lambda_{\min}\\)) ditam o condicionamento da superfície e a velocidade de convergência do otimizador. |

---

## Demonstração para o curso 3

> **Nota de Esclarecimento:** No livro *Mathematics for Machine Learning*, a modelagem de Misturas de Gaussianas e o algoritmo Expectation-Maximization (EM) são tratados no **Capítulo 11 (*Density Estimation with Gaussian Mixture Models*)**. O Capítulo 12 é dedicado à *Classificação com Support Vector Machines (SVM)*. A derivação completa abaixo segue estritamente a notação e o desenvolvimento matemático do **Capítulo 11**.

---

### **1. Notação Exata e Modelo de Variável Latente (Capítulos 11.1 e 11.4)**

Dado um conjunto de dados observados e independentes e identicamente distribuídos (i.i.d.) \\(\mathcal{X} = \{\boldsymbol{x}_1, \dots, \boldsymbol{x}_N\}\\), em que cada observação é um vetor \\(\boldsymbol{x}_n \in \mathbb{R}^D\\):

* **Modelo de Mistura de Gaussianas (GMM):** É uma combinação convexa de \\(K\\) densidades gaussianas multivariadas:
  \\[p(\boldsymbol{x}_n \mid \boldsymbol{\theta}) = \sum_{k=1}^K \pi_k \mathcal{N}(\boldsymbol{x}_n \mid \boldsymbol{\mu}_k, \boldsymbol{\Sigma}_k)\\]
  onde \\(0 \le \pi_k \le 1\\) e \\(\sum_{k=1}^K \pi_k = 1\\) são os pesos de mistura (*mixture weights*). O conjunto completo de parâmetros do modelo é denotado por \\(\boldsymbol{\theta} := \{\boldsymbol{\mu}_k, \boldsymbol{\Sigma}_k, \pi_k : k = 1, \dots, K\}\\).

* **Perspectiva de Variável Latente Discreta:** Para cada ponto de dado \\(\boldsymbol{x}_n\\), introduz-se um vetor indicador latente não observado \\(\boldsymbol{z}_n = [z_{n1}, \dots, z_{nK}]^\top \in \{0, 1\}^K\\) na representação *1-de-K* (contendo exatamente um elemento \\(1\\) e \\(K-1\\) zeros):
  * Priori sobre a variável latente: \\(p(z_{nk} = 1 \mid \boldsymbol{\theta}) = \pi_k\\).
  * Verossimilhança condicional dos dados: \\(p(\boldsymbol{x}_n \mid z_{nk} = 1, \boldsymbol{\theta}) = \mathcal{N}(\boldsymbol{x}_n \mid \boldsymbol{\mu}_k, \boldsymbol{\Sigma}_k)\\).
  * Distribuição conjunta: \\(p(\boldsymbol{x}_n, z_{nk} = 1 \mid \boldsymbol{\theta}) = \pi_k \mathcal{N}(\boldsymbol{x}_n \mid \boldsymbol{\mu}_k, \boldsymbol{\Sigma}_k)\\).

* **Log-Verossimilhança Marginal:** Ao somar (*marginalizar*) sobre todas as configurações possíveis da variável latente \\(\boldsymbol{z}_n\\), obtém-se a log-verossimilhança dos dados observados:
  \\[\mathcal{L}(\boldsymbol{\theta}) = \log p(\mathcal{X} \mid \boldsymbol{\theta}) = \sum_{n=1}^N \log p(\boldsymbol{x}_n \mid \boldsymbol{\theta}) = \sum_{n=1}^N \log \left( \sum_{k=1}^K \pi_k \mathcal{N}(\boldsymbol{x}_n \mid \boldsymbol{\mu}_k, \boldsymbol{\Sigma}_k) \right)\\]

---

### **2. Derivação do Algoritmo EM (Capítulos 11.2, 11.3 e 11.4)**

A presença do somatório dentro do logaritmo na log-verossimilhança impede a obtenção de uma solução analítica direta em forma fechada. O algoritmo **Expectation-Maximization (EM)** resolve esse problema por meio de um processo iterativo em duas etapas.

#### **Passo E (Expectativa): Cálculo das Responsabilidades**

No Passo E, utilizam-se os parâmetros atuais do modelo \\(\boldsymbol{\theta}^{(t)} = \{\boldsymbol{\mu}_k^{(t)}, \boldsymbol{\Sigma}_k^{(t)}, \pi_k^{(t)}\}\\) para calcular a probabilidade a posteriori da variável latente \\(z_{nk} = 1\\) dada a observação \\(\boldsymbol{x}_n\\) (via Teorema de Bayes). Essa probabilidade condicional é definida como a **responsabilidade** \\(r_{nk}\\) da componente \\(k\\) pelo ponto \\(n\\):

\\[r_{nk} := p(z_{nk} = 1 \mid \boldsymbol{x}_n, \boldsymbol{\theta}^{(t)}) = \frac{\pi_k^{(t)} \mathcal{N}(\boldsymbol{x}_n \mid \boldsymbol{\mu}_k^{(t)}, \boldsymbol{\Sigma}_k^{(t)})}{\sum_{j=1}^K \pi_j^{(t)} \mathcal{N}(\boldsymbol{x}_n \mid \boldsymbol{\mu}_j^{(t)}, \boldsymbol{\Sigma}_j^{(t)})}\\]

A responsabilidade total (massa de dados atribuída) à componente \\(k\\) é dada por:
\\[N_k := \sum_{n=1}^N r_{nk}\\]

Sob a perspectiva da variável latente, o Passo E constrói a função de esperança do log-verossimilhança completo (\\(\mathcal{Q}\\)-function) em relação à distribuição a posteriori de \\(\boldsymbol{z}\\):
\\[\mathcal{Q}(\boldsymbol{\theta} \mid \boldsymbol{\theta}^{(t)}) = \mathbb{E}_{\boldsymbol{z} \mid \mathcal{X}, \boldsymbol{\theta}^{(t)}} [\log p(\mathcal{X}, \boldsymbol{z} \mid \boldsymbol{\theta})] = \sum_{n=1}^N \sum_{k=1}^K r_{nk} \left( \log \pi_k + \log \mathcal{N}(\boldsymbol{x}_n \mid \boldsymbol{\mu}_k, \boldsymbol{\Sigma}_k) \right)\\]

---

#### **Passo M (Maximização): Derivação Matemática dos Parâmetros**

No Passo M, re-estimam-se os parâmetros \\(\boldsymbol{\theta}^{(t+1)}\\) que maximizam a esperança do log-verossimilhança \\(\mathcal{Q}(\boldsymbol{\theta} \mid \boldsymbol{\theta}^{(t)})\\) (ou a log-verossimilhança observada) mantendo as responsabilidades \\(r_{nk}\\) fixas.

##### **A. Atualização das Médias (\\(\boldsymbol{\mu}_k\\))**
Calcula-se a derivada parcial da log-verossimilhança em relação a \\(\boldsymbol{\mu}_k\\):
\\[\frac{\partial \mathcal{L}}{\partial \boldsymbol{\mu}_k} = \sum_{n=1}^N \frac{1}{p(\boldsymbol{x}_n \mid \boldsymbol{\theta})} \frac{\partial p(\boldsymbol{x}_n \mid \boldsymbol{\theta})}{\partial \boldsymbol{\mu}_k}\\]

Sabendo que \\(\frac{\partial \mathcal{N}(\boldsymbol{x}_n \mid \boldsymbol{\mu}_k, \boldsymbol{\Sigma}_k)}{\partial \boldsymbol{\mu}_k} = \pi_k \mathcal{N}(\boldsymbol{x}_n \mid \boldsymbol{\mu}_k, \boldsymbol{\Sigma}_k) (\boldsymbol{x}_n - \boldsymbol{\mu}_k)^\top \boldsymbol{\Sigma}_k^{-1}\\), substituindo na derivada obtém-se:
\\[\frac{\partial \mathcal{L}}{\partial \boldsymbol{\mu}_k} = \sum_{n=1}^N \underbrace{\frac{\pi_k \mathcal{N}(\boldsymbol{x}_n \mid \boldsymbol{\mu}_k, \boldsymbol{\Sigma}_k)}{\sum_{j=1}^K \pi_j \mathcal{N}(\boldsymbol{x}_n \mid \boldsymbol{\mu}_j, \boldsymbol{\Sigma}_j)}}_{= r_{nk}} (\boldsymbol{x}_n - \boldsymbol{\mu}_k)^\top \boldsymbol{\Sigma}_k^{-1} = \sum_{n=1}^N r_{nk} (\boldsymbol{x}_n - \boldsymbol{\mu}_k)^\top \boldsymbol{\Sigma}_k^{-1}\\]

Igualando o gradiente a zero (\\(\frac{\partial \mathcal{L}}{\partial \boldsymbol{\mu}_k} = \mathbf{0}^\top\\)) e multiplicando por \\(\boldsymbol{\Sigma}_k\\) à direita:
\\[\sum_{n=1}^N r_{nk} (\boldsymbol{x}_n - \boldsymbol{\mu}_k) = \mathbf{0} \implies \sum_{n=1}^N r_{nk} \boldsymbol{x}_n = \boldsymbol{\mu}_k \sum_{n=1}^N r_{nk}\\]
\\[\boldsymbol{\mu}_k^{\text{new}} = \frac{\sum_{n=1}^N r_{nk} \boldsymbol{x}_n}{\sum_{n=1}^N r_{nk}} = \frac{1}{N_k} \sum_{n=1}^N r_{nk} \boldsymbol{x}_n\\]

##### **B. Atualização das Matrizes de Covariância (\\(\boldsymbol{\Sigma}_k\\))**
Derivando em relação a \\(\boldsymbol{\Sigma}_k\\):
\\[\frac{\partial p(\boldsymbol{x}_n \mid \boldsymbol{\theta})}{\partial \boldsymbol{\Sigma}_k} = \pi_k \mathcal{N}(\boldsymbol{x}_n \mid \boldsymbol{\mu}_k, \boldsymbol{\Sigma}_k) \cdot \left[ -\frac{1}{2} \left( \boldsymbol{\Sigma}_k^{-1} - \boldsymbol{\Sigma}_k^{-1} (\boldsymbol{x}_n - \boldsymbol{\mu}_k)(\boldsymbol{x}_n - \boldsymbol{\mu}_k)^\top \boldsymbol{\Sigma}_k^{-1} \right) \right]\\]

Substituindo na derivada da log-verossimilhança:
\\[\frac{\partial \mathcal{L}}{\partial \boldsymbol{\Sigma}_k} = -\frac{1}{2} \boldsymbol{\Sigma}_k^{-1} \sum_{n=1}^N r_{nk} + \frac{1}{2} \boldsymbol{\Sigma}_k^{-1} \left( \sum_{n=1}^N r_{nk} (\boldsymbol{x}_n - \boldsymbol{\mu}_k)(\boldsymbol{x}_n - \boldsymbol{\mu}_k)^\top \right) \boldsymbol{\Sigma}_k^{-1}\\]

Igualando a zero (\\(\frac{\partial \mathcal{L}}{\partial \boldsymbol{\Sigma}_k} = \mathbf{0}\\)) e isolando \\(\boldsymbol{\Sigma}_k\\):
\\[\boldsymbol{\Sigma}_k^{\text{new}} = \frac{1}{N_k} \sum_{n=1}^N r_{nk} (\boldsymbol{x}_n - \boldsymbol{\mu}_k^{\text{new}})(\boldsymbol{x}_n - \boldsymbol{\mu}_k^{\text{new}})^\top\\]

##### **C. Atualização dos Pesos de Mistura (\\(\pi_k\\))**
A otimização dos pesos \\(\pi_k\\) exige a restrição de igualdade \\(\sum_{k=1}^K \pi_k = 1\\). Formula-se a função Lagrangiana com o multiplicador de Lagrange \\(\lambda\\):
\\[\bar{\mathcal{L}}(\boldsymbol{\pi}, \lambda) = \sum_{n=1}^N \log \left( \sum_{k=1}^K \pi_k \mathcal{N}(\boldsymbol{x}_n \mid \boldsymbol{\mu}_k, \boldsymbol{\Sigma}_k) \right) + \lambda \left( \sum_{k=1}^K \pi_k - 1 \right)\\]

Derivando em relação a \\(\pi_k\\) e igualando a zero:
\\[\frac{\partial \bar{\mathcal{L}}}{\partial \pi_k} = \frac{N_k}{\pi_k} + \lambda = 0 \implies \pi_k = -\frac{N_k}{\lambda}\\]

Somando essa relação sobre todos os \\(K\\) componentes:
\\[\sum_{k=1}^K \pi_k = 1 \implies -\frac{1}{\lambda} \sum_{k=1}^K N_k = 1 \implies -\frac{N}{\lambda} = 1 \implies \lambda = -N\\]

Substituindo \\(\lambda = -N\\) de volta na equação de \\(\pi_k\\):
\\[\pi_k^{\text{new}} = \frac{N_k}{N}\\]

---

### **3. Propriedades de Convergência (Capítulos 11.3 e 11.4.5)**

* **Monotonicidade:** A cada iteração completa do EM (Passo E seguido pelo Passo M), garante-se estritamente que a log-verossimilhança observada não decresce: \\(\mathcal{L}(\boldsymbol{\theta}^{(t+1)}) \ge \mathcal{L}(\boldsymbol{\theta}^{(t)})\\).
* **Pontos Críticos:** O algoritmo converge para um **mínimo/máximo local** ou ponto de sela da função de log-verossimilhança. Não há garantia de convergência para o máximo global, motivo pelo qual costuma-se executar o algoritmo a partir de múltiplas inicializações aleatórias.

---

### **4. K-Means como Caso Limite do GMM (Capítulo 11.5)**

O algoritmo **K-Means** emerge diretamente como o limite estrito (*hard assignment*) do algoritmo EM para GMMs sob duas suposições geométricas e estatísticas:

1. **Covariâncias Isotrópicas Iguais:** Assume-se que todas as \\(K\\) componentes Gaussianas possuem matrizes de covariância esféricas idênticas proporcionais à matriz identidade:
   \\[\boldsymbol{\Sigma}_k = \sigma^2 \mathbf{I}_D, \quad \forall k=1,\dots,K\\]
   e que os pesos de mistura são iguais (\\(\pi_k = 1/K\\)).

2. **Caso Limite de Variância Nula (\\(\sigma^2 \to 0\\)):**
   A densidade de uma Gaussiana isotrópica é dada por:
   \\[\mathcal{N}(\boldsymbol{x}_n \mid \boldsymbol{\mu}_k, \sigma^2 \mathbf{I}_D) = \frac{1}{(2\pi \sigma^2)^{D/2}} \exp \left( -\frac{\|\boldsymbol{x}_n - \boldsymbol{\mu}_k\|^2}{2\sigma^2} \right)\\]

   Substituindo na fórmula das responsabilidades \\(r_{nk}\\) do Passo E:
   \\[r_{nk} = \frac{\exp \left( -\frac{\|\boldsymbol{x}_n - \boldsymbol{\mu}_k\|^2}{2\sigma^2} \right)}{\sum_{j=1}^K \exp \left( -\frac{\|\boldsymbol{x}_n - \boldsymbol{\mu}_j\|^2}{2\sigma^2} \right)}\\]

   Quando se toma o limite \\(\sigma^2 \to 0\\), a componente \\(k\\) que minimiza a distância Euclidiana \\(\|\boldsymbol{x}_n - \boldsymbol{\mu}_k\|^2\\) domina exponencialmente o denominador. As responsabilidades contínuas ("suaves") colapsam em atribuições discretas e rígidas ("duras") de \\(0\\) ou \\(1\\):
   \\[r_{nk} \to \begin{cases} 1 & \text{se } k = \arg\min_j \|\boldsymbol{x}_n - \boldsymbol{\mu}_j\|^2 \\ 0 & \text{caso contrário} \end{cases}\\]

   No **Passo M**, a atualização da média com essas responsabilidades binárias reduz-se exatamente à média aritmética simples dos pontos pertencentes a esse grupo:
   \\[\boldsymbol{\mu}_k = \frac{\sum_{n: r_{nk}=1} \boldsymbol{x}_n}{\sum_{n: r_{nk}=1} 1}\\]
   que é a regra exata de atualização dos centroides no algoritmo **K-Means**.
