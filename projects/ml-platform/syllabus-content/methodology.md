# Metodologia

Ótimo — esses dois livros cobrem na verdade uma boa parte do plano. O único gap real de conteúdo externo fica em clustering/datasets práticos, e dá para resolver sem livros adicionais (com exemplos próprios e dados embutidos). Abaixo está o plano de conteúdo revisado, mapeado capítulo a capítulo para o que existe nos dois livros.

## Mapeamento dos Livros

**Mathematics for Machine Learning (MML)** — Deisenroth, Faisal, Ong:

Parte I (caps. 2–7): fundamentos matemáticos — álgebra linear, geometria analítica, decomposições matriciais, derivadas/gradientes, gradiente descendente, probabilidade, distribuições, otimização contínua
Parte II (caps. 8–12): modelos de ML — quando modelos encontram dados, regressão linear, regressão logística para classificação, dimensões reduzidas (PCA) e Gaussian Mixture Models

**Neural Networks and Deep Learning (NNDL)** — Nielsen:

Cap. 1: forward pass, perceptron → sigmoid, treino por gradiente descendente, MNIST
Cap. 2: backpropagation (derivação completa)
Cap. 3: hiperparâmetros, overfitting/regularização, funções de custo alternativas
Cap. 4: "proof" visual de que redes profundas computam qualquer função (intuição de profundidade)
Cap. 5: por que deep learning é difícil (dificuldade de treinar redes profundas)
Cap. 6: variants modernas (CNN, RNN, dropout,initialization proper)

O que se encaixa bem: MML cobre cursos 1, 2 e 4 inteiros; NNDL cobre o curso 3 inteiro. Vamos usar isso.


### Curso 1: Fundamentos → Constrói o Regressor Linear

Módulo teoria (baseado exclusivamente em MML Parte I)

| Passo | Conteúdo | Capítulos MML | Widget Interativo
| :--- | :--- | :--- | :--- |
| 1 | Vetores: o que são, espaços vetoriais, subespaços, combinação linear | Cap. 2 (§2.4–2.5) | VectorSpaceWidget — arrasta vetores 2D, vê combinações |
| 2 | Produto escalar, ângulos, projeções, distância | Cap. 3 (§3.2) | ProjectionWidget — slider de ângulo, vê projeção de a em b |
| 3 | Matrizes como transformações lineares | Cap. 2 (§2.7) + Cap. 4 (§4.1) | MatrixTransformWidget — slider de rotação/escala, vê a malha se distorcendo |
| 4 | Dhampion decomposição matrix (autovalores, autovetores) | Cap. 4 (§4.2) EigenWidget — aplica transformação em pontos, vê direções invariantes |
| 5 | Derivada e gradiente | Cap. 5 (§5.1–5.3) | GradientWidget — ponto numa superfície, vê seta do gradiente |
| 6 | Gradiente descendente | Cap. 7 (§7.1) | GradientDescentWidget — slider de learning rate, bola descendo ladeira |
| 7 | Probabilidade (distribuição, média, variância) | Cap. 6 (§6.1–6.5) | DistributionWidget — histograma interativo |

### Módulo aplicada (baseado em MML Cap. 9 + dados próprios)

| Passo | Conteúdo | Cap. MML | Widget |
| :--- | :--- | :--- | :--- |
| 1 | Formulação: modelo de dados, MSE | Cap. 9 (§9.1–9.2) | LossSurfaceWidget — superfície de erro em 2D |
| 2 | Gradiente descendente no MSE | Cap. 9 (§9.2) LinearRegressionWidget — dados, reta se ajustando, loss em tempo real |
| 3 | Solução analítica (equação normal) | Cap. 9 (§9.2) | NormalEquationWidget — compara GD vs. solução fechada |
| 4 | Interpretação Bayesiana | Cap. 9 (§9.3) — (exposição com KaTeX) | ? |
| 5 | Sandbox — Sandbox livre com hiperparâmetros | - | - |

Fonte dos dados: gera sinteticamente (ruído gaussiano sobre relações lineares) — sem dataset externo.


### Curso 2: Aprendizado Supervisionado → Constrói o Classificador

Módulo teoria (MML Cap. 8 + Cap. 10)

| Passo | Conteúdo | Cap. MML | Widget |
| :--- | :--- | :--- | :--- |
| 1 | Dados, modelos, tomada de decisão (estilo mas não livro) | Cap. 8 (§8.1–8.2) — (conceitual + KaTeX)| ? |
| 2 | Probabilidade posterior, Bayes aplicado | Cap. 6 (§6.4) + Cap. 8 (§8.4) | BayesWidget — sliders de prior, likelihood, prob posterior |
| 3 | Regressão logística: sigmoid, cross-entropy | Cap. 10 (§10.1–10.3) | SigmoidWidget — slider de pesos, vê sigmoid se moldar |
| 4 | Fronteira de decisão | Cap. 10 (§10.4) | DecisionBoundaryWidget — plot 2D, arrastra coeficientes |
| 5 | Regularização / overfitting | Cap. 9 (§9.4) BiasVarianceWidget — slider de grau do polinômio |

Módulo aplicada (MML Cap. 10 + dados próprios)

|Passo | Conteúdo | Cap. MML | Widget |
| :--- | :--- | :--- | :--- |
| 1 | Treinar classificador binário em dados sintéticos (2 features) | Cap. 10 (§10.4) | BinaryClassifierWidget — treino visível, fronteira muda |
| 2 | Treinar multiclasse (3 classes) | Cap. 10 (§10.4) | MulticlassWidget — 3 fronteiras |
| 3 | Matriz de confusão, precisão, recall | (exposição própria, não está em MML em detalhe) | ConfusionMatrixWidget |
| 4 | Sandbox — Sandbox livre com dataset switcher | - | - |

Gap pequeno: precisão/recall/F1 não estão em detalhe em nenhum dos dois livros — você pode cobrir isso rapidamente com exploração própria no NotebookLM (pedir "explique precisão, recall e F1 com exemplos de matriz de confusão").


### Curso 3: Redes Neurais do Zero → Constrói a Rede

Esse curso é inteiro do NNDL. Cada capítulo do livro vira um ou dois passos.

Módulo teoria (baseado em NNDL caps. 1–5)

| Passo | Conteúdo | Cap. NNDL | Widget |
| :--- | :--- | :--- | :--- |
| 1 | Perceptron → sigmoid → rede neural simples | Cap. 1 (§1.1–1.3) | NeuronWidget — ajusta pesos, vê ativação |
| 2 | Arquitetura: camadas, notação | Cap. 1 (§1.4) | NetworkTopologyWidget — mostra camadas e conexões |
| 3 | Forward pass: composição de funções | Cap. 1 (§1.5–1.7) | ForwardPassWidget — valores fluindo pela rede, animação |
| 4 | Gradiente descendente aplicado à rede | Cap. 1 (§1.5 revisita §1.4) | TrainingStepWidget — passo único de treino, vê pesos mudarem |
| 5 | Backpropagation: a regra da cadeia Cap. 2 (§2.1–2.7) BackpropFlowWidget — derivadas parcialmente fluindo para trás, destacadas |
| 6 | Funções de custo alternativas | Cap. 3 (§3.1) — (exposição KaTeX)| ? |
| 7 | Inicialização, learning rate, epochs | Cap. 3 (§3.3, §3.7) | HyperparamWidget — sliders, vê curva de loss mudar |
| 8 | Overfitting e regularização | Cap. 3 (§3.4, §3.6) | OverfittingWidget — train vs validation loss com slider de epochs |
| 9 | Intuição: por que camadas profundas? | Cap. 4 | DepthWidget — compara rede 1 camada vs 2 camadas resolvendo XOR |

Módulo aplicada (baseado em NNDL Caps. 1 + 3 + 6)

| Passo | Conteúdo | Cap. NNDL | Widget |
| :--- | :--- | :--- | :--- |
| 1 | Problema: reconstruir o reconhecedor de dígitos do livro | Cap. 1 (§1.6, executa o mesmo experimento) | MNISTTrainerWidget — subset, rede 30-neurônios, treina no browser |
| 2 | Tuning: epochs, learning rate, batch size | Cap. 3 (§3.3) | MNISTHyperparamWidget — mesma rede, hiperparâmetros variáveis |
| 3 | Melhorar com regularização e inicialização | Cap. 3 (§3.6) + Cap. 6 (§6.1) | MNISTRegularizedWidget — compara loss antes/depois |
| 4 | Sandbox — Sandbox livre com arquitetura configurável | - | - |

Ferramenta aqui: TensorFlow.js (dynamic import apenas neste módulo). Antes desse curso, os algoritmos são TS puro (regressão logística, GD, tudo trivial de implementar).


### Curso 4: Não-Supervisionado → Constrói o Clusterizador

Aqui está o maior gap de conteúdo: K-means e autoencoders não estão detalhados em nenhum dos dois livros. O MML Cap. 12 cobre Gaussian Mixture Models (que são conceitualmente próximos do K-means — na verdade K-means é um caso limite do GMM com covariância isotrópica). Estratégia: usar o MML Cap. 12 como base teórica e apresentar K-means como caso limite do GMM — o que é matematicamente correto e mais elegante.

Módulo teoria (MML Caps. 10 e 12)

| Passo | Conteúdo | Cap. MML | Widget |
| :--- | :--- | :--- | :--- |
| 1 | Dimensionalidade: por que reduzir? | Cap. 10 (revisão) — (conceitual) | ? |
| 2 | Autovalores como direções de variância | Cap. 4 (§4.2, reutilizado) | EigenWidget (reutilizado do Curso 1) |
| 3 | PCA: a matemática | Cap. 10 (§10.1–10.3, seções que introduzem PCA via matriz de covariância) | PCAWidget — pontos 3D projetados em 2D, rotaciona e vê variância |
| 4 | Gaussian Mixture Model: mistura de distribuições | Cap. 12 (§12.1) | MixtureWidget — sliders de pesos/covariâncias, vê a densidade resultante |
| 5 | EM algorithm (expectation-maximization) | Cap. 12 (§12.3) | EMWidget — passos alternando E e M, vê os clusters se formando |

Módulo aplicada

| Passo | Conteúdo | Base | Widget |
| :--- | :--- | :--- | :--- |
| 1 | K-means como caso limite do GMM (covariância isotrópica ∧ σ→0) | Cap. 12 | KMeansWidget — algoritmo passo a passo com animação |
| 2 | Aplicar K-means em dados de clientes (dataset sintético) | — | CustomerSegmentationWidget |
| 3 | PCA para visualizar clusters Cap. 10 ClusterPCAWidget | — | clusters projetados em 2D |
| 4 | Sandbox — Sandbox livre | - | - |


Resumo do Mapeamento Livro → Curso

| Curso | Livro Principal | Capítulos |
| :--- | :--- | :--- |
| 1. Fundamentos | MML | 2, 3, 4, 5, 6, 7 (teoria) + 9 (aplicada) |
| 2. Supervisionado | MML | 6, 8, 10 (teoria e aplicada) |
| 3. Redes Neurais | NNDL | 1, 2, 3, 4 (5 e 6 são leitura adicional) |
| 4. Não-Supervisionado | MML | 4 (revisão), 10, 12 |

Cobertura por livro:

- MML: ~90% dos caps. 2–12 usados (o que fica de fora: §8.5, §11 Gaussian mixture details aprofundados)
- NNDL: caps. 1–4 usados; caps. 5–6 ficam como leitura de aprofundamento — cap. 5 (dificuldade de treinar redes profundas) é conceitual e pode aparecer como nota no curso 3; cap. 6 (CNNs, dropout) é extensão natural se você quiser um "Curso 5: Deep Learning" no futuro


## Quando adicionar mais livros depois

Aqui está a lista de prioridade para expansão futura, quando você sentir que o conteúdo está faltando:

- **Grokking Deep Learning** (Trask) — para o Curso 3, o tratamento de backprop do Nielsen é rigoroso mas denso. O Grokking constrói de forma mais incremental. Complemento natural.
- **Hands-On Machine Learning** (Géron) — para expandir os módulos aplicada (mais datasets, mais técnicas de avaliação)
- **Deep Learning** (Goodfellow) — para CNNs/RNNs e um eventual "Curso 5: Deep Learning"
- **Gaussian Processes for Machine Learning** (Rasmussen & Williams) — se um dia quiser expandir regressão Bayesiana (PDF gratuito, disponível em gaussianprocess.org)

Cada livro novo, você cria um novo notebook no NotebookLM e mantém o padrão de prompts por capítulo-alvo. Dessa forma, o conteúdo cresce por incrementos sem desorganizar o que já está estável.


Este plano mapeia cerca de 85% de MML e os caps. 1–4 de NNDL — ou seja, os dois livros que você tem cobrem o plano quase inteiro por si só. O único ponto frágil é K-means (construído como caso limite do GMM) e as métricas de avaliação (precisão/recall/F1), que cobrimos com notas autônomas e widgets. Como os quatro módulos aplicada de cada curso agora estão mapeados a capítulos específicos, dá para começar a escrever lições sem esperar mais livros.

Se quiser, posso começar a produzir o conteúdo da primeira lição (Curso 1, Step 1 — Vetores e MML §2.4) para você validar o formato antes de escalar os outros passos.

## Sugestão de Mudança Metodológica

Uma recomendação que difere da arquitetura atual: considere adicionar um modo "sandbox" no final de cada módulo aplicada. Depois de seguir os passos guiados, o aluno teria um canvas livre onde pode ajustar hiperparâmetros, trocar datasets, e experimentar — sem instruções, só com os controles. Isso reforça o "taking part in the CREATION of something" e dá um espaço para exploração que os cursos guiados não permitem.

Isso seria um terceiro tipo de rota opcional: /machine-learning/fundamentos/sandbox — sem steps, sem progresso, só o widget + controles + dataset selector. Poderia ser um toggle dentro do próprio módulo aplicada em vez de uma rota separada para manter a simplicidade.