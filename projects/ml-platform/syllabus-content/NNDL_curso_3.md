## Estrutura do curso 3

**Sequência de Conceitos por Capítulos (1 a 6)**

1. **Capítulo 1: Using neural nets to recognize handwritten digits**
   - **Modelos neuronais básicos**: O modelo fundamental do **perceptron** e a evolução para o **neurônio sigmoide**, que permite que pequenas variações nos pesos produzam mudanças suaves na saída.
   - **Arquitetura de rede**: Organização em camadas de entrada, camadas ocultas e camada de saída em redes alimentadas em fluxo direto (*feedforward*).
   - **Otimização**: Função de custo quadrática e o algoritmo de **Gradiente Descendente / Gradiente Descendente Estocástico (SGD)** para ajustar pesos e biases.

2. **Capítulo 2: How the backpropagation algorithm works**
   - **Passagem Direta Matricial**: Formalização algébrica e matricial do cálculo das ativações ao longo das camadas (*forward pass*).
   - **Algoritmo de Backpropagation**: Derivação das **quatro equações fundamentais** (BP1 a BP4) que calculam as derivadas parciais da função de custo em relação a qualquer peso ou bias.
   - **Propagação do Erro**: Cálculo e propagação retroativa dos vetores de erro a partir da camada de saída.

3. **Capítulo 3: Improving the way neural networks learn**
   - **Funções de Custo e Ativação**: A função de custo **cross-entropy** e a camada **softmax**, que evitam a desaceleração do aprendizado causada pela saturação dos neurônios sigmoides.
   - **Regularização e Overfitting**: Diagnóstico do **overfitting** e técnicas para atenuá-lo: **Regularização L2 (weight decay)**, **Regularização L1**, **Dropout** e **Aumento Artificial de Dados**.
   - **Inicialização e Hiperparâmetros**: Inicialização aprimorada de pesos e heurísticas práticas para ajuste de hiperparâmetros (taxa de aprendizado, tamanho de mini-batch, etc.).

4. **Capítulo 4: A visual proof that neural nets can compute any function**
   - **Teorema da Universalidade**: Demonstração de que redes neurais *feedforward* com uma única camada oculta conseguem aproximar qualquer função contínua com a precisão desejada.
   - **Construção Visual**: Uso de funções de degrau e funções em formato de bloco/torre (*bump/tower functions*) para construir tabelas de busca visuais.

5. **Capítulo 5: Why are deep neural networks hard to train?**
   - **Instabilidade dos Gradientes**: Análise de por que redes profundas enfrentam o **Vanishing Gradient Problem** (gradiente evanescente), fazendo com que as camadas iniciais aprendam muito devagar, e o **Exploding Gradient Problem**.

6. **Capítulo 6: Deep learning**
   - **Redes Neurais Convolucionais (CNNs)**: Introdução aos **campos receptivos locais**, **pesos compartilhados** e camadas de **pooling (max-pooling)**.
   - **Aplicações e Visão Geral**: Implementação prática e arquiteturas profundas (LeNet-5, KSH/AlexNet no ImageNet), além de uma introdução a **Recurrent Neural Networks (RNNs)** e **Deep Belief Nets (DBNs)**.

---

**Mapeamento dos 4 Módulos do Curso nos Capítulos/Seções do Livro**

- **Módulo 1: Perceptron**
  - **Sustentado por**: **Capítulo 1**, na seção **"Perceptrons"** (complementado pela seção **"Sigmoid neurons"** para apresentar a transição para neurônios com ativação contínua e derivável).

- **Módulo 2: Forward Pass**
  - **Sustentado por**: **Capítulo 1**, nas seções **"The architecture of neural networks"** e **"A simple network to classify handwritten digits"** (junto com o método `feedforward`). A formalização matricial é aprofundada no **Capítulo 2**, na seção **"Warm up: a fast matrix-based approach to computing the output from a neural network"**.

- **Módulo 3: Backpropagation**
  - **Sustentado por**: **Capítulo 2**, focado integralmente no algoritmo (**"How the backpropagation algorithm works"**). O módulo fundamenta-se também na introdução ao **Gradient Descent / SGD** do **Capítulo 1** (**"Learning with gradient descent"**) e cobre a derivação matemática e a implementação em código (**"The code for backpropagation"**).

- **Módulo 4: Treino com regularização**
  - **Sustentado por**: **Capítulo 3**, nas seções **"Overfitting and regularization"**, **"Regularization"** (Regularização L2 / weight decay) e **"Other techniques for regularization"** (Regularização L1, dropout e expansão do conjunto de dados). O treino é fortalecido pelas seções de **cross-entropy** e **inicialização de pesos**.

## Seções críticas

### (a) Derivação do Algoritmo de Backpropagation em uma Rede Feedforward (2 Entradas, 1 Camada Oculta com \\(n=2\\) Neurônios, 1 Saída)

#### 1. Notação Exata do Livro (Capítulo 2)
* **Camadas (\\(l\\))**: \\(l=1\\) (camada de entrada), \\(l=2\\) (camada oculta), \\(l=3\\) (camada de saída).
* **Pesos (\\(w_{jk}^l\\))**: Peso da conexão do \\(k\\)-ésimo neurônio na camada \\((l-1)\\) para o \\(j\\)-ésimo neurônio na camada \\(l\\).
* **Biases (\\(b_j^l\\))**: Bias do \\(j\\)-ésimo neurônio na camada \\(l\\).
* **Entrada Ponderada (\\(z_j^l\\))**: \\(z_j^l = \sum_k w_{jk}^l a_k^{l-1} + b_j^l\\).
* **Ativação (\\(a_j^l\\))**: \\(a_j^l = \sigma(z_j^l) = \frac{1}{1 + e^{-z_j^l}}\\).
* **Erro do Neurônio (\\(\delta_j^l\\))**: \\(\delta_j^l = \frac{\partial C_x}{\partial z_j^l}\\).
* **Função de Custo Quadrático (por exemplo \\(x\\))**: \\(C_x = \frac{1}{2} (a_1^3 - y)^2\\).

---

#### 2. Equações Fundamentais de Backpropagation
* **(BP1) Erro na Camada de Saída**: \\(\delta_1^3 = \frac{\partial C_x}{\partial a_1^3} \sigma'(z_1^3) = (a_1^3 - y) \sigma'(z_1^3)\\)
* **(BP2) Erro na Camada Oculta**: \\(\delta_j^2 = w_{1j}^3 \delta_1^3 \sigma'(z_j^2)\\)
* **(BP3) Derivada em Relação ao Bias**: \\(\frac{\partial C_x}{\partial b_j^l} = \delta_j^l\\)
* **(BP4) Derivada em Relação ao Peso**: \\(\frac{\partial C_x}{\partial w_{jk}^l} = a_k^{l-1} \delta_j^l\\)

---

#### 3. Exemplo Numérico Completo (Passo a Passo)

**Valores Inventados de Entrada e Parâmetros Parciais**:
* **Entradas (\\(a^1\\))**: \\(a_1^1 = x_1 = 0.5\\), \\(a_2^1 = x_2 = 0.8\\); **Alvo**: \\(y = 1.0\\); **Taxa de aprendizado**: \\(\eta = 0.5\\).
* **Pesos da Camada 2 (\\(w^2\\))**: \\(w_{11}^2 = 0.1\\), \\(w_{12}^2 = 0.2\\), \\(w_{21}^2 = 0.3\\), \\(w_{22}^2 = 0.4\\).
* **Biases da Camada 2 (\\(b^2\\))**: \\(b_1^2 = 0.1\\), \\(b_2^2 = 0.1\\).
* **Pesos da Camada 3 (\\(w^3\\))**: \\(w_{11}^3 = 0.5\\), \\(w_{12}^3 = 0.6\\).
* **Bias da Camada 3 (\\(b^3\\))**: \\(b_1^3 = 0.2\\).

---

<h5>Passo 1: Feedforward (Passagem Direta)</h5>

1. **Neurônio oculto 1 (\\(j=1, l=2\\))**:
   * \\(z_1^2 = w_{11}^2 a_1^1 + w_{12}^2 a_2^1 + b_1^2 = (0.1 \times 0.5) + (0.2 \times 0.8) + 0.1 = 0.05 + 0.16 + 0.1 = 0.31\\)
   * \\(a_1^2 = \sigma(0.31) = \frac{1}{1 + e^{-0.31}} \approx 0.576885\\)

2. **Neurônio oculto 2 (\\(j=2, l=2\\))**:
   * \\(z_2^2 = w_{21}^2 a_1^1 + w_{22}^2 a_2^1 + b_2^2 = (0.3 \times 0.5) + (0.4 \times 0.8) + 0.1 = 0.15 + 0.32 + 0.1 = 0.57\\)
   * \\(a_2^2 = \sigma(0.57) = \frac{1}{1 + e^{-0.57}} \approx 0.638763\\)

3. **Neurônio de saída (\\(j=1, l=3\\))**:
   * \\(z_1^3 = w_{11}^3 a_1^2 + w_{12}^3 a_2^2 + b_1^3 = (0.5 \times 0.576885) + (0.6 \times 0.638763) + 0.2 = 0.288443 + 0.383258 + 0.2 = 0.871701\\)
   * \\(a_1^3 = \sigma(0.871701) \approx 0.705099\\)
   * **Custo Atual**: \\(C_x = \frac{1}{2}(0.705099 - 1.0)^2 \approx 0.043483\\)

---

<h5>Passo 2: Retropropagação do Erro e Derivadas Parciais</h5>

*Nota*: Para a função sigmoide, a derivada é dada por \\(\sigma'(z) = \sigma(z)(1 - \sigma(z))\\).

1. **Camada de Saída (\\(l=3\\))**:
   * \\(\frac{\partial C_x}{\partial a_1^3} = a_1^3 - y = 0.705099 - 1.0 = -0.294901\\)
   * \\(\sigma'(z_1^3) = 0.705099 \times (1 - 0.705099) \approx 0.207934\\)
   * **Erro \\(\delta_1^3\\) (BP1)**: \\(\delta_1^3 = -0.294901 \times 0.207934 \approx -0.061320\\)
   * **Derivadas dos Pesos e Bias da Saída**:
     * \\(\frac{\partial C_x}{\partial w_{11}^3} = a_1^2 \delta_1^3 = 0.576885 \times (-0.061320) \approx \mathbf{-0.035375}\\)
     * \\(\frac{\partial C_x}{\partial w_{12}^3} = a_2^2 \delta_1^3 = 0.638763 \times (-0.061320) \approx \mathbf{-0.039169}\\)
     * \\(\frac{\partial C_x}{\partial b_1^3} = \delta_1^3 \approx \mathbf{-0.061320}\\)

2. **Camada Oculta (\\(l=2\\))**:
   * Derivadas das ativações ocultas:
     * \\(\sigma'(z_1^2) = 0.576885 \times (1 - 0.576885) \approx 0.244089\\)
     * \\(\sigma'(z_2^2) = 0.638763 \times (1 - 0.638763) \approx 0.230745\\)
   * **Erros Ocultos (BP2)**:
     * \\(\delta_1^2 = w_{11}^3 \delta_1^3 \sigma'(z_1^2) = 0.5 \times (-0.061320) \times 0.244089 \approx -0.007484\\)
     * \\(\delta_2^2 = w_{12}^3 \delta_1^3 \sigma'(z_2^2) = 0.6 \times (-0.061320) \times 0.230745 \approx -0.008490\\)
   * **Derivadas dos Pesos e Biases da Camada Oculta**:
     * \\(\frac{\partial C_x}{\partial w_{11}^2} = a_1^1 \delta_1^2 = 0.5 \times (-0.007484) \approx \mathbf{-0.003742}\\)
     * \\(\frac{\partial C_x}{\partial w_{12}^2} = a_2^1 \delta_1^2 = 0.8 \times (-0.007484) \approx \mathbf{-0.005987}\\)
     * \\(\frac{\partial C_x}{\partial w_{21}^2} = a_1^1 \delta_2^2 = 0.5 \times (-0.008490) \approx \mathbf{-0.004245}\\)
     * \\(\frac{\partial C_x}{\partial w_{22}^2} = a_2^1 \delta_2^2 = 0.8 \times (-0.008490) \approx \mathbf{-0.006792}\\)
     * \\(\frac{\partial C_x}{\partial b_1^2} = \delta_1^2 \approx \mathbf{-0.007484}\\)
     * \\(\frac{\partial C_x}{\partial b_2^2} = \delta_2^2 \approx \mathbf{-0.008490}\\)

---

<h5>Passo 3: Atualização dos Parâmetros via Gradiente Descendente</h5>

\\[w_{jk}^l \leftarrow w_{jk}^l - \eta \frac{\partial C_x}{\partial w_{jk}^l}, \quad b_j^l \leftarrow b_j^l - \eta \frac{\partial C_x}{\partial b_j^l}\\]

* **Camada 3**:
  * \\(w_{11}^3 \leftarrow 0.5 - 0.5(-0.035375) = \mathbf{0.517687}\\)
  * \\(w_{12}^3 \leftarrow 0.6 - 0.5(-0.039169) = \mathbf{0.619584}\\)
  * \\(b_1^3 \leftarrow 0.2 - 0.5(-0.061320) = \mathbf{0.230660}\\)
* **Camada 2**:
  * \\(w_{11}^2 \leftarrow 0.1 - 0.5(-0.003742) = \mathbf{0.101871}\\)
  * \\(w_{12}^2 \leftarrow 0.2 - 0.5(-0.005987) = \mathbf{0.202994}\\)
  * \\(w_{21}^2 \leftarrow 0.3 - 0.5(-0.004245) = \mathbf{0.302122}\\)
  * \\(w_{22}^2 \leftarrow 0.4 - 0.5(-0.006792) = \mathbf{0.403396}\\)
  * \\(b_1^2 \leftarrow 0.1 - 0.5(-0.007484) = \mathbf{0.103742}\\)
  * \\(b_2^2 \leftarrow 0.1 - 0.5(-0.008490) = \mathbf{0.104245}\\)

---

### (b) Cross-Entropy Cost vs. Quadratic Cost: Aceleração do Aprendizado

#### 1. O Problema da Desaceleração com o Custo Quadrático
Para o custo quadrático de um único neurônio sigmoide, \\(C = \frac{(a - y)^2}{2}\\) com \\(a = \sigma(z)\\):
\\[\frac{\partial C}{\partial w} = (a - y) \sigma'(z) x \quad \text{e} \quad \frac{\partial C}{\partial b} = (a - y) \sigma'(z) \quad\\]

Como a derivada da função sigmoide é \\(\sigma'(z) = \sigma(z)(1 - \sigma(z)) = a(1 - a)\\), quando a saída do neurônio \\(a\\) se aproxima de \\(0\\) ou de \\(1\\) (saturação), \\(\sigma'(z)\\) fica extremamente próximo de zero (\\(\sigma'(z) \to 0\\)). Se o neurônio estiver **completamente errado** (por exemplo, a saída desejada é \\(y=1\\), mas a saída atual é \\(a \approx 0\\)), o erro \\((a - y)\\) é grande, mas a taxa de aprendizado fica paralisada porque o fator \\(\sigma'(z)\\) zera a derivada.

---

#### 2. Definição da Função Cross-Entropy
Para uma rede multicamadas com saídas \\(a_j^L\\) e alvos \\(y_j\\):
\\[C = -\frac{1}{n} \sum_x \sum_j \left[ y_j \ln a_j^L + (1 - y_j) \ln(1 - a_j^L) \right] \quad\\]

---

#### 3. Por que a Cross-Entropy Acelera o Aprendizado?
Ao calcular a derivada parcial do custo cross-entropy em relação aos pesos da camada de saída \\(w_{jk}^L\\), aplica-se a regra da cadeia:
\\[\frac{\partial C}{\partial w_{jk}^L} = \frac{\partial C}{\partial a_j^L} \frac{\partial a_j^L}{\partial z_j^L} \frac{\partial z_j^L}{\partial w_{jk}^L}\\]

Como \\(\frac{\partial C}{\partial a_j^L} = \frac{a_j^L - y_j}{a_j^L (1 - a_j^L)}\\) e \\(\frac{\partial a_j^L}{\partial z_j^L} = \sigma'(z_j^L) = a_j^L (1 - a_j^L)\\), os termos do denominador **cancelam-se exatamente**:
\\[\frac{\partial C}{\partial w_{jk}^L} = \frac{1}{n} \sum_x a_k^{L-1} (a_j^L - y_j) \quad\\]
\\[\frac{\partial C}{\partial b_j^L} = \frac{1}{n} \sum_x (a_j^L - y_j) \quad\\]

**Conclusão do Autor**: A taxa de variação do custo em relação aos pesos depende diretamente do termo de erro \\((a_j^L - y_j)\\). Quanto maior for o erro do neurônio, mais rápido ele aprende. A saturação da função sigmoide deixa de atuar como gargalo na camada de saída.

---

### (c) Inicialização e Regularização (L2, Dropout): Fórmulas Exatas e Guia de Uso

#### 1. Weight Initialization (Inicialização de Pesos)

##### Fórmulas Exatas:
* **Inicialização Tradicional (Capítulo 1)**: Pesos e biases gerados por uma gaussiana padrão \\(w, b \sim \mathcal{N}(0, 1)\\).
* **Inicialização Aprimorada (Capítulo 3)**: Para um neurônio com \\(n_{\text{in}}\\) conexões de entrada, inicializam-se os pesos como variáveis gaussianas com **média \\(0\\) e desvio padrão \\(\frac{1}{\sqrt{n_{\text{in}}}}\\)**:
  \\[w \sim \mathcal{N}\left(0, \frac{1}{n_{\text{in}}}\right) \quad\\]
  Os biases continuam sendo inicializados como \\(b \sim \mathcal{N}(0, 1)\\) (ou \\(0\\)).

##### Quando Usar:
Deve ser usada **sempre como escolha padrão** ao criar redes neurais alimentadas por unidades sigmoides ou \\(tanh\\). Ao dividir o desvio padrão por \\(\sqrt{n_{\text{in}}}\\), a variância da entrada ponderada \\(z = \sum w_j x_j + b\\) permanece pequena e focada em torno de \\(0\\) (\\(\operatorname{Var}(z) \approx 1\\)), o que impede que os neurônios ocultos saturem logo no início do treinamento.

---

#### 2. Regularização L2 (Weight Decay)

##### Fórmula Exata do Custo:
\\[C = C_0 + \frac{\lambda}{2n} \sum_w w^2 \quad\\]
Onde \\(C_0\\) é a função de custo não regularizada, \\(\lambda > 0\\) é o parâmetro de regularização, \\(n\\) é o tamanho total do conjunto de treinamento e a soma abrange todos os pesos da rede (os biases não são incluídos).

##### Regra de Atualização em SGD:
\\[w \to \left(1 - \frac{\eta \lambda}{n}\right) w - \frac{\eta}{m} \sum_x \frac{\partial C_0,x}{\partial w} \quad\\]
\\[b \to b - \frac{\eta}{m} \sum_x \frac{\partial C_0,x}{\partial b} \quad\\]
Onde \\(m\\) é o tamanho do mini-batch.

##### Quando Usar:
Deve ser usada para **reduzir o overfitting (sobreajuste)** quando a rede possui muitos parâmetros e os dados de treino são limitados. O fator \\(\left(1 - \frac{\eta \lambda}{n}\right)\\) comprime os pesos (*weight decay*), forçando a rede a construir modelos baseados em padrões robustos vistos com frequência nos dados, em vez de memorizar ruídos locais. Além disso, a regularização L2 estabiliza o treinamento, reduzindo a sensibilidade do modelo às inicializações aleatórias dos pesos.

---

#### 3. Regularização Dropout

##### Procedimento e Fórmulas:
* **Treinamento**: Para cada mini-batch, desativa-se aleatoriamente metade (fração de \\(0.5\\)) dos neurônios ocultos. O passo de *forward* e *backpropagation* é calculado na rede reduzida.
* **Teste / Inferência**: A rede completa é utilizada, mas **os pesos de saída dos neurônios ocultos são multiplicados por \\(0.5\\)** (ou por \\(1-p\\)) para compensar a presença do dobro de neurônios ativos:
  \\[w_{\text{teste}} = 0.5 \times w_{\text{treino}} \quad\\]

##### Quando Usar:
Especialmente útil no treinamento de **redes neurais grandes e profundas**, onde o sobreajuste é um desafio crítico. O dropout funciona como se combinássemos e tirássemos a média das previsões de um grande número de sub-redes distintas, destruindo co-adaptações complexas de neurônios e forçando a rede a aprender representações internas muito mais genéricas e robustas.

---

## MNIST experimento replicável

### Experimento Base do Capítulo 1 (Para Replicação em TensorFlow.js)

Para replicar exatamente o experimento baseline do livro no navegador usando TensorFlow.js, utilize os seguintes parâmetros e valores exatos extraídos do Capítulo 1:

* **Arquitetura da Rede**:
  * **Camada de Entrada**: **784 neurônios** (correspondendo aos pixels de imagens \\(28 \times 28\\) em escala de cinza).
  * **Camada Oculta**: **30 neurônios** com função de ativação **sigmoide**.
  * **Camada de Saída**: **10 neurônios** com função de ativação **sigmoide** (correspondendo aos dígitos de 0 a 9).
* **Função de Custo**: **Custo Quadrático (MSE / Mean Squared Error)**.
* **Inicialização de Pesos e Biases**: Variáveis aleatórias gaussianas padrão com média \\(0\\) e desvio padrão \\(1\\) (isto é, \\(\mathcal{N}(0, 1)\\)).
* **Algoritmo de Otimização**: Gradiente Descendente Estocástico (**SGD**).
* **Tamanho do Conjunto de Dados**:
  * **Treinamento**: **50.000 imagens** (o MNIST possui 60.000 imagens de treino, mas o autor reserva 10.000 como conjunto de validação no carregador).
  * **Teste**: **10.000 imagens**.
* **Hiperparâmetros de Treino**:
  * **Épocas (*Epochs*)**: **30**.
  * **Tamanho de Mini-batch (*Batch Size*)**: **10**.
  * **Taxa de Aprendizado (\\(\eta\\) / *Learning Rate*)**: **3.0**.
* **Precisão Obtida**:
  * **Pico máximo**: **95,42%** de acerto na época 28 (9.542 de 10.000 imagens corretas).
  * **Época final (30)**: **95,34%**.

*(Nota do autor no Cap. 1)*: Ao aumentar o número de neurônios ocultos de **30 para 100** (mantendo 30 épocas, batch size 10 e \\(\eta = 3.0\\)), a precisão sobe para **96,59%**.

---

### Ajustes de Hiperparâmetros e Resultados no Capítulo 3

No Capítulo 3, o autor introduz diversas melhorias técnicas e mostra como cada alteração afeta a precisão no conjunto de teste do MNIST (usando como base 50.000 imagens de treino e 10.000 de teste, salvo indicação em contrário):

1. **Substituição da Função de Custo (Cross-Entropy)**:
   * **Ajuste**: Troca do custo quadrático pela **Cross-Entropy**.
   * **Parâmetros**: Arquitetura ``, inicialização antiga (\\(\mathcal{N}(0, 1)\\)), 30 épocas, mini-batch size 10, **\\(\eta = 0.5\\)**.
   * **Precisão Resultante**: **95,49%**.

2. **Inclusão de Regularização L2 (*Weight Decay*)**:
   * **Ajuste**: Adição do termo de regularização L2 ao custo cross-entropy.
   * **Parâmetros**: Arquitetura ``, 30 épocas, mini-batch size 10, \\(\eta = 0.5\\), **parâmetro de regularização \\(\lambda = 5.0\\)**.
   * **Precisão Resultante**: **96,49%** (redução expressiva do *overfitting*).

3. **Aumento de Neurônios Ocultos + Regularização L2**:
   * **Ajuste**: Expansão para 100 neurônios na camada oculta combinada com L2.
   * **Parâmetros**: Arquitetura ``, cross-entropy, 30 épocas, mini-batch size 10, \\(\eta = 0.5\\), **\\(\lambda = 5.0\\)**.
   * **Precisão Resultante**: **96,80%**.

4. **Nova Inicialização de Pesos Aprimorada**:
   * **Ajuste**: Troca da inicialização \\(\mathcal{N}(0, 1)\\) para uma gaussiana com **desvio padrão \\(1/\sqrt{n_{\text{in}}}\\)** (onde \\(n_{\text{in}}\\) é o número de conexões de entrada) para evitar saturação precoce.
   * **Parâmetros**: Arquitetura ``, cross-entropy, L2 (\\(\lambda = 5.0\\)), 30 épocas, mini-batch size 10, **\\(\eta = 0.1\\)**.
   * **Precisão Resultante**: **96,61%** (com convergência e aprendizado inicial significativamente mais rápidos).

5. **Experimento de Controle com Conjunto de Treino Reduzido (1.000 imagens)**:
   * **Sem regularização**: 400 épocas, \\(\eta = 0.5\\), batch size 10 \\(\rightarrow\\) Atinge pico de **~82%** na época 280 e sofre forte *overfitting*.
   * **Com Regularização L2 (\\(\lambda = 0.1\\))**: 400 épocas, \\(\eta = 0.5\\), batch size 10 \\(\rightarrow\\) A precisão sobe para **85,7%**.