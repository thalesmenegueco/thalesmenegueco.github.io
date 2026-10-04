# mml-1 — Introdução e Motivação (Introduction and Motivation)

**(a) Definição / Conceito Central / Intuição Inicial:**
- **Motivação do Livro:** O livro é projetado para atuar como um guia (*guidebook*) para a literatura matemática por trás do aprendizado de máquina (*machine learning*), conectando a matemática do ensino médio/física a textos técnicos avançados. O conteúdo possui estrutura modular, permitindo a leitura tanto pela abordagem *bottom-up* (construindo conceitos desde as bases matemáticas até as aplicações) quanto *top-down* (partindo das necessidades práticas até os pré-requisitos matemáticos).
- **Três Conceitos Centrais:** O aprendizado de máquina trata do projeto de algoritmos para extrair automaticamente informações e padrões valiosos a partir de dados. A disciplina fundamenta-se em três conceitos essenciais: **dados** (*data*), **modelo** (*model*) e **aprendizado** (*learning*).
- **§1.1 Finding Words for Intuitions — Ambiguidade de Termos:** Destaca-se que vários termos em aprendizado de máquina possuem ambiguidades conceituais. Em particular, a expressão "algoritmo de aprendizado de máquina" é utilizada em dois sentidos principais:
  1. **Preditor** (*predictor*): O sistema que realiza predições com base em dados de entrada.
  2. **Treinamento** (*training*): O sistema que adapta os parâmetros internos do preditor para que ele desempenhe bem em dados futuros não vistos.
- **Dados como Vetores (*Data as Vectors*):** Assume-se que os dados numéricos foram previamente convertidos para uma representação adequada para programas de computador, sendo pensados como vetores. O texto apresenta três perspectivas para vetores: uma sequência/arranjo de números (*array of numbers*, visão da ciência da computação), uma seta com direção e magnitude (visão da física), ou um objeto que obedece a regras de adição e escalonamento (visão matemática).
- **Modelo (*Model*):** Descreve uma simplificação do processo (real e desconhecido) gerador dos dados, capturando aspectos relevantes para extrair padrões ocultos e prever acontecimentos no mundo real sem a necessidade de realizar experimentos físicos.
- **Aprendizado como Otimização (*Learning as Optimization*):** O aprendizado consiste em encontrar automaticamente estruturas e padrões nos dados ajustando/otimizando os parâmetros do modelo em relação a uma função de utilidade. O treinamento é comparado analogamente a escalar uma montanha (*climbing a hill*) até alcançar o seu topo (máximo de uma medida de desempenho). O objetivo final do aprendizado é a capacidade de generalização para dados futuros não vistos (*unseen data*).

**(b) Problema Primal / Formulação Matemática:**
Não há. Conforme explicitado no próprio texto, este capítulo inicial dedica-se apenas a estabelecer intuições e conceitos em linguagem geral, não apresentando definições formais, equações deduzidas ou sistemas matemáticos formais.

**(c) Derivação do Lagrangiano / Relação Dual:**
Não há.

**(d) Problema Dual / Resultado Dual:**
Não há.

**(e) Propriedades, Exemplos e Aplicações em Machine Learning:**
- **Exemplos Oferecidos no Capítulo 1:** O capítulo exemplifica a extração automática de padrões citando a identificação de tópicos compartilhados em um acervo de documentos (livros em bibliotecas) e a regressão (*regression setting*) como um mapeamento de entradas para saídas numéricas reais.
- **Quatro Pilares de Machine Learning:** O livro organiza a aplicação prática dos conceitos matemáticos em quatro pilares desenvolvidos na Parte II:
  1. Regressão (*Regression*)
  2. Redução de Dimensionalidade (*Dimensionality Reduction*)
  3. Estimação de Densidade (*Density Estimation*)
  4. Classificação (*Classification*)
- **Outras Propriedades ou Formalismos Deduzidos:** Não há neste capítulo (o desenvolvimento formal e matemático inicia-se a partir do Capítulo 2).
