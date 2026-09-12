# Roadmap de Lições: Currículo EDA Progressivo

## 📚 Visão Geral

Três níveis de dificuldade, estruturados em **temas coerentes**:
- **Nível Iniciante** (5 lições): Fundações — variável única, duas variáveis, conceitos essenciais
- **Nível Intermediário** (4 lições): Conexões — relações complexas, causação, limpeza
- **Nível Avançado** (3 lições): Técnicas — séries temporais, agrupamentos, multivariadas

---

## 🟢 NÍVEL INICIANTE

### ✅ 1. Entendendo Correlação (você já tem)
**Descrição:** Aprenda quando e como usar scatter plots para encontrar relações entre variáveis.

**Concepts:** Scatter plot, correlação positiva/negativa, coeficiente r, correlação ≠ causação
**Dataset exemplo:** altura × peso (já implementado)
**Tempo:** ~5 min

---

### ✅ 2. Encontrando Outliers (você já tem)
**Descrição:** Aprenda a identificar valores atípicos usando um box plot e interpretar o que significam.

**Concepts:** Box plot, quartis, IQR, outliers, por quê importam
**Dataset exemplo:** Salários (com alguns CEOs bem pagos como outliers)
**Tempo:** ~5 min

---

### 🔵 3. Conhecendo Distribuições ⭐ PRÓXIMA (recomendado)
**Descrição:** Entenda como os dados se distribuem. Aprenda sobre distribuição normal e dados "enviesados".

**Concepts:** Histograma, distribuição normal, skewness (enviesamento), moda, picos
**Dataset exemplo:** Alturas de 1000 pessoas (distribuição aproximadamente normal) + salários (skewed right)
**Insights educacionais:**
- Por quê um histograma é diferente de um scatter plot?
- Como identificar se dados são "normais" ou enviesados
- O que significa um gráfico com múltiplos picos

**Steps do tutor:**
1. Upload dataset (alturas + salários)
2. Crie um histograma para "altura" → deve parecer simétrico, em forma de sino
3. Crie um histograma para "salário" → deve estar enviesado para a direita
4. O tutor explica: "Salários são frequentemente enviesados. Por quê? Existem muitas pessoas ganhando pouco e poucas ganhando muito."
5. Pergunta: "Qual transformação poderia ajudar?" → resposta esperada menciona "log"
6. Resumo: Distribuições determinam qual análise você faz depois

**Dataset de exemplo:** `/assets/lessons/distributions-basics/salaries-heights.csv`

---

### 🔵 4. Comparando Grupos (iniciante)
**Descrição:** Use box plots para comparar uma variável numérica entre diferentes categorias.

**Concepts:** Box plot para comparação, agregação, médias por grupo, dispersão
**Dataset exemplo:** Vendas por região (Norte, Nordeste, Sudeste, Sul) ou notas de alunos por turma
**Insights educacionais:**
- Por quê comparar grupos visualmente é importante
- Como interpretar múltiplos box plots lado-a-lado
- Quando diferenças são "significativas" visualmente

**Steps do tutor:**
1. Upload dataset (vendas × região, ou notas × turma)
2. Selecione a variável numérica (vendas/notas) e a categórica (região/turma)
3. Tutor sugere: "Box plots lado-a-lado são perfeitos para isto!"
4. Gere o gráfico
5. Pergunta: "Qual região teve as vendas mais altas, em média?" → Múltipla escolha
6. Pergunta: "Qual região tem mais variabilidade nas vendas?" → Observar tamanho dos boxes
7. Resumo: "Agora você sabe comparar grupos. Próximo: por quê as diferenças existem?"

**Conexão:** Leva para "Correlação ≠ Causação" (intermediário)

---

### 🔵 5. Dados Faltantes (iniciante)
**Descrição:** Identifique, entenda e decida o que fazer com dados faltantes (NAs, valores em branco).

**Concepts:** Missing data, impacto dos NAs, estratégias (remover vs preencher)
**Dataset exemplo:** Pesquisa de satisfação com ~15% de respostas faltantes
**Insights educacionais:**
- Dados faltantes não são erros, são informação
- Diferentes estratégias têm impactos diferentes
- Visualizar dados faltantes é importante

**Steps do tutor:**
1. Upload dataset com NAs óbvios
2. Tutor: "Veja que algumas linhas têm '—' ou vazias. Isto é dado faltante."
3. Pergunta: "Quantas respostas estão faltantes?" → Contar valores nulos
4. Tutor oferece opções: remover linhas com NA vs preencher com média vs deixar
5. Mostra lado-a-lado: estatísticas com/sem NAs
6. Resumo: "Dados faltantes afetam análise. Documentar o quê fazer é essencial."

---

## 🟡 NÍVEL INTERMEDIÁRIO

### 🟡 6. Correlação ≠ Causação (intermediário) ⭐ SEGUNDA (após 5)
**Descrição:** Entenda por quê correlação forte NÃO significa que uma variável causa a outra.

**Concepts:** Confunding variables, Simpson's paradox, A/B vs observacional
**Dataset exemplo:** Número de bombeiros × dano em incêndios (correlação forte, mas não é causal)
              OU: Anos de escolaridade × renda (controlado por "geração")
**Insights educacionais:**
- Um exemplo clássico de correlação falsa
- O papel de variáveis confundidoras
- Como pensar criticamente sobre dados

**Steps do tutor:**
1. Upload dataset de incêndios (bombeiros × dano)
2. Crie scatter plot → veja correlação positiva forte
3. Pergunta: "Mais bombeiros causam mais dano?" 
4. Opções: Sim / Não, porque... (text answer)
5. Tutor: "Na verdade: incêndios piores precisam de mais bombeiros E causam mais dano. Os bombeiros não causam o dano!"
6. Pergunta: "Qual é a variável confundidora aqui?" → "Tamanho do incêndio"
7. Resumo: "Sempre pense: quais outras variáveis poderiam estar relacionadas?"

**Conexão:** "Comparando Grupos" mostrou diferenças; agora você aprende por quê não são causais

---

### 🟡 7. Transformando Dados (intermediário)
**Descrição:** Aprenda por quê e como aplicar transformações (log, raiz quadrada) para "normalizar" dados skewed.

**Concepts:** Transformação log, raiz quadrada, quando aplicar, antes/depois visual
**Dataset exemplo:** Renda (altamente skewed) → aplicar log → distribuição mais normal
**Insights educacionais:**
- Por quê dados skewed são problemáticos para algumas análises
- Como uma transformação muda a forma da distribuição
- Quando cada transformação faz sentido

**Steps do tutor:**
1. Upload dataset de renda
2. Histograma de renda bruta → muito skewed
3. Tutor: "Distribuições skewed violam suposições de muitos testes. Transformar ajuda."
4. Tutor sugere: "Tente aplicar LOG"
5. Gere novo histograma com dados transformados → muito mais simétrico
6. Pergunta: "Por quê a transformação log funciona bem com salários?" → Múltipla escolha (conceito de "proporções")
7. Resumo: "Transformações são ferramentas poderosas. Use quando dados não são normais."

**Próximas recomendações:** "Agora seus dados estão prontos para análises mais sofisticadas"

---

### 🟡 8. Padrões Categóricos (intermediário)
**Descrição:** Explore relações entre duas variáveis categóricas usando heatmaps e tabelas cruzadas.

**Concepts:** Tabela cruzada (cross-tabulation), heatmap de frequências, chi-square visual
**Dataset exemplo:** Gênero × Esporte Preferido (tabela de frequências)
                 OU: Escolaridade × Satisfação no Trabalho
**Insights educacionais:**
- Nem toda análise é numérica; categóricas também revelam padrões
- Heatmaps mostram visualmente onde as "concentrações" estão
- Proporcionalidade vs frequência absoluta

**Steps do tutor:**
1. Upload dataset (gênero × esporte)
2. Selecione duas variáveis categóricas
3. Tutor sugere: "Heatmap! Mostra se há padrões em grupos."
4. Gere heatmap com cores → áreas "quentes" mostram combinações comuns
5. Pergunta: "Qual combinação é mais frequente?" → Interpretação visual
6. Resumo: "Categóricas × categóricas = heatmap ou stacked bar. Útil para survey data."

---

### 🟡 9. Agregações e Resumos (intermediário) ⭐ TERCEIRA
**Descrição:** Resuma grandes datasets com agrupamento, contagem e médias por categoria.

**Concepts:** GROUP BY, agregações (count, mean, sum), visualizar resumos
**Dataset exemplo:** Vendas diárias → agregue por mês, veja total e média
                 OU: Clientes × compras → contar transações por cliente
**Insights educacionais:**
- Dados brutos são muitas vezes demais; resumir é uma habilidade essencial
- Diferentes níveis de agregação revelam padrões diferentes
- Transição de "dados detalhados" para "insights de negócio"

**Steps do tutor:**
1. Upload dataset de vendas diárias (100+ linhas)
2. Tutor: "Isto é muita informação. Vamos resumir."
3. "Agrupe por mês e calcule a soma de vendas"
4. Gere gráfico de barras mostrando vendas por mês
5. Pergunta: "Qual mês teve mais vendas?" → Simples, mas reforça agregação
6. Tutor oferece: "Tente média também" → mostra diferença entre sum e mean
7. Resumo: "Agregação reduz ruído e revela tendências. Use quando tem muitos dados."

---

## 🔴 NÍVEL AVANÇADO

### 🔴 10. Série Temporal e Tendências (avançado)
**Descrição:** Identifique e visualize tendências, sazonalidade e anomalias em dados ao longo do tempo.

**Concepts:** Série temporal, trend, seasonality, decomposição visual
**Dataset exemplo:** Temperatura mensal (2020-2024) com padrão sazonal claro
                 OU: Tráfego de website (com picos no fim de semana)
**Insights educacionais:**
- Padrões mudam ao longo do tempo
- Sazonalidade vs trend: ambos importam
- Anomalias em séries temporais têm significado

**Steps do tutor:**
1. Upload dataset temporal (datas + valor numérico)
2. Tutor: "Isto é série temporal. Ordem e tempo importam!"
3. Gere linha conectando pontos em ordem temporal
4. Pergunta: "Qual padrão você vê? Subindo? Descendo? Cíclico?" → Múltipla escolha
5. Tutor: "Esta é a tendência (trend)"
6. Pergunta: "Há repetição de padrões (peaks/valleys regulares)?" → Sazonalidade
7. Resumo: "Séries temporais precisam de respeito à ordem. Decomposição é a próxima skill."

---

### 🔴 11. Clustering Visual (avançado)
**Descrição:** Identifique grupos naturais nos dados usando scatter plots e cores.

**Concepts:** Clustering conceitual, segmentação, padrões de agrupamento
**Dataset exemplo:** Clientes (gasto anual × frequência de compra) → clusters naturais emergem
**Insights educacionais:**
- Nem toda análise é sobre relação linear
- Dados podem se agrupar naturalmente
- Segmentação é útil para strategy

**Steps do tutor:**
1. Upload dataset (2 variáveis numéricas contínuas)
2. Gere scatter plot
3. Tutor: "Vê grupos naturais aí? Vamos colorir e explorar."
4. Pergunta: "Quantos grupos você identifica?" → 2? 3? 4?
5. Tutor: "Isto é clustering. Máquinas podem fazer isso (k-means), mas você já vê!"
6. Resumo: "Segmentação em clusters leva a estratégias diferentes."

---

### 🔴 12. Análise Multivariada (avançado)
**Descrição:** Explore relações entre MUITAS variáveis simultaneamente com correlação matrix.

**Concepts:** Correlação matrix, heatmaps, padrões de co-movimento
**Dataset exemplo:** Dados econômicos (PIB, desemprego, inflação, taxa de juros, etc.) com múltiplas correlações
**Insights educacionais:**
- Nem toda variável releva com todas as outras
- Matriz de correlação identifica pares interessantes
- Estruturar exploração em dados "gordos"

**Steps do tutor:**
1. Upload dataset com 5+ variáveis numéricas
2. Tutor: "Muitas variáveis! Vamos ver quem correlaciona com quem."
3. Gere correlation matrix heatmap
4. Pergunta: "Qual par tem a correlação mais forte (mais vermelha)?" → Achar no mapa
5. Tutor: "Agora você sabe por onde começar. Próximo: scatter plots dos pares interessantes."
6. Resumo: "Correlation matrix é seu 'mapa do tesouro' em dados multivariados."

---

## 🎯 Recomendações de Sequência

### **Caminho Rápido (5 lições — ~25 min)**
Iniciante só:
1. ✅ Entendendo Correlação
2. ✅ Encontrando Outliers
3. 🔵 Conhecendo Distribuições
4. 🔵 Comparando Grupos
5. 🔵 Dados Faltantes

→ Após isto: Usuário consegue explorar datasets simples de forma competente.

---

### **Caminho Completo Iniciante (5 lições)**
1-5 como acima
→ **Checkpoint**: Quiz conceitual (não no app, mas mentalmente — "Quais são as 5 ideias chave?")

---

### **Continuação Intermediária (4 lições — ~20 min)**
Após completar iniciante:
6. 🟡 Correlação ≠ Causação (mindset crítico)
7. 🟡 Transformando Dados (técnica prática)
8. 🟡 Padrões Categóricos (novo tipo de variável)
9. 🟡 Agregações e Resumos (skill essencial)

→ **Checkpoint**: "Agora você faz análise real" (não apenas exploração)

---

### **Avançado (3 lições — ~15 min)**
10. 🔴 Série Temporal
11. 🔴 Clustering Visual
12. 🔴 Análise Multivariada

→ Fim: Usuário entende quase todo tipo de padrão em dados

---

## 📊 Estrutura de Datasets

Para cada lição, forneça **3 versões**:

1. **Exemplo guiado** (carregado automaticamente na lição)
   - Pequeno (50-500 linhas)
   - Padrões claros e visíveis
   - Sem ruído que distraia

2. **Dataset para praticar** (usuário carrega depois da lição)
   - Mesmo conceito, dados diferentes
   - Um pouco mais complexo
   - Reforça a skill

3. **Dataset "desafio"** (opcional, para quem quer mais)
   - Dados reais messier
   - Padrões menos óbvios
   - Requer pensamento crítico

---

## 🗂️ Armazenamento

```
/assets/lessons/
  correlation-basics/
    height-weight.csv
    lesson.json
  outliers-intro/
    salaries.csv
    lesson.json
  distributions-basics/
    salaries-heights.csv
    lesson.json
  comparing-groups/
    sales-regions.csv
    lesson.json
  missing-data/
    survey-satisfaction.csv
    lesson.json
  correlation-vs-causation/
    firefighters-fire-damage.csv
    lesson.json
  transforming-data/
    income-data.csv
    lesson.json
  categorical-patterns/
    gender-sport-preference.csv
    lesson.json
  aggregations-summary/
    daily-sales.csv
    lesson.json
  time-series-trends/
    temperature-monthly.csv
    lesson.json
  clustering-visual/
    customer-segmentation.csv
    lesson.json
  multivariate-analysis/
    economic-indicators.csv
    lesson.json
```

---

## 📝 Próximos Passos

**Imediato (próxima semana):**
- [ ] Implementar Lição #3: Conhecendo Distribuições (vai reforçar histogramas + skewness)
- [ ] Criar CSVs para lições 3-5

**Curto prazo (2-3 semanas):**
- [ ] Lições 4-5 (iniciante completo)
- [ ] i18n structure (Portuguese/English)

**Médio prazo:**
- [ ] Lições 6-9 (intermediário)
- [ ] Adicionar "dependências" entre lições (sugerir próxima ao terminar)
- [ ] Rastrear progresso em localStorage

**Longo prazo:**
- [ ] Lições 10-12 (avançado)
- [ ] Quiz/assessment entre níveis
- [ ] Certificado de "Analyst iniciante" após completar 5 lições

---

## 💡 Dicas de Design por Lição

| Lição | Tipo Dataset | Gráfico Principal | Validação-chave | Aha Moment |
|-------|-------------|-------------------|------------------|-----------|
| Correlação | Contínuo × Contínuo | Scatter | Coeficiente r | "Correlação ≠ causação" |
| Outliers | Contínuo com extremos | Box Plot | Contar outliers | "Outliers não são erros" |
| Distribuições | Contínuo único | Histograma | Reconhecer skewness | "Dados não são sempre 'normais'" |
| Comparar Grupos | Contínuo × Categórico | Box Plot comparativo | Média/mediana por grupo | "Grupos são bem diferentes" |
| Dados Faltantes | Qualquer com NAs | Visualizar ausências | % de NAs | "NAs têm impacto real" |
| Corr ≠ Causação | Exemplo clássico | Scatter + confundidor | Identificar variável confundidora | "Causação é difícil!" |
| Transformando | Skewed contínuo | Histograma antes/depois | Aplicar transformação | "Log muda tudo" |
| Categóricas | Categ × Categ | Heatmap/Stacked Bar | Padrão de frequências | "Categorias também têm padrões" |
| Agregações | Muitas linhas | Gráfico resumido | GROUP BY correto | "Dados brutos = ruído" |
| Série Temporal | Datas × Valor | Linha conectada | Trend vs Seasonality | "Tempo muda tudo" |
| Clustering | Contínuo × Contínuo | Scatter colorido | Identificar grupos | "Dados se agrupam naturalmente" |
| Multivariada | 5+ variáveis | Correlation Matrix | Pares correlacionados | "Mapa do tesouro!" |

