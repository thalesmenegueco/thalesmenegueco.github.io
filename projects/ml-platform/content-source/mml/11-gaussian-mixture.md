## Capítulo 11

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