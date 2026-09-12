# JSON Lesson Templates — Primeiras 3 Lições a Implementar

Copie essas estruturas e adapte conforme necessário.

---

## 1. Conhecendo Distribuições (INICIANTE)

```json
{
  "id": "distributions-basics",
  "title": "Conhecendo Distribuições",
  "description": "Entenda como os dados se distribuem. Aprenda sobre distribuição normal e dados 'enviesados'.",
  "difficulty": "beginner",
  "estimatedTime": "6 min",
  "objectives": [
    "Entender por quê histogramas são importantes",
    "Reconhecer distribuição normal (simétrica, em forma de sino)",
    "Identificar dados enviesados (skewed) e entender o quê significa",
    "Saber quando transformações ajudam"
  ],
  "exampleDatasetUrl": "/assets/lessons/distributions-basics/salaries-heights.csv",
  "exampleFieldDescriptions": [
    {
      "name": "height_cm",
      "type": "numerical",
      "description": "Altura em centímetros"
    },
    {
      "name": "salary",
      "type": "numerical",
      "description": "Salário anual em reais"
    },
    {
      "name": "age",
      "type": "numerical",
      "description": "Idade em anos"
    }
  ],
  "steps": [
    {
      "id": "step-1",
      "title": "Carregar o Dataset",
      "instruction": "Carregue o dataset de exemplo (ou clique em 'Usar Exemplo'). Confirme que as três colunas estão como numéricas.",
      "action": "upload",
      "validation": {
        "type": "fieldTypes",
        "expectedFields": [
          { "name": "height_cm", "type": "numerical" },
          { "name": "salary", "type": "numerical" },
          { "name": "age", "type": "numerical" }
        ],
        "errorMessage": "Certifique-se de que todas as colunas (height_cm, salary, age) estão como numéricas."
      },
      "hint": "Você já trabalhou com isto na lição anterior. Confirme os tipos e avance.",
      "explanation": "Distribuições são sobre variáveis numéricas. A forma como os dados se distribuem diz muito sobre a natureza deles."
    },
    {
      "id": "step-2",
      "title": "Visualizar Distribuição Normal",
      "instruction": "Selecione apenas 'height_cm' e crie um histograma. Olhe a forma.",
      "action": "chartSelection",
      "validation": {
        "type": "chartType",
        "expectedChartType": "histogram",
        "expectedFields": ["height_cm"],
        "errorMessage": "Tente de novo — você precisa de um histograma para uma variável numérica única."
      },
      "hint": "Selecione height_cm, então o tutor deve sugerir 'Histograma' automaticamente.",
      "explanation": "Histogramas dividem os dados em 'bins' (faixas) e contam quantos pontos caem em cada uma. A forma revela muito.\n\n**Distribuição Normal (Gaussiana):** Simétrica, em forma de sino. Maioria dos valores perto da média, cauda em ambos os lados igualmente. Alturas de pessoas costumam ser assim."
    },
    {
      "id": "step-3",
      "title": "Reconheça a Simetria",
      "instruction": "Vendo o histograma de alturas, qual é a melhor descrição?",
      "action": "multipleChoice",
      "validation": {
        "type": "interpretation",
        "correctAnswer": "a",
        "options": [
          {
            "id": "a",
            "text": "Simétrica em forma de sino. A maioria das pessoas está perto de uma altura média.",
            "feedback": "Perfeito! Isto é uma **distribuição normal**. Muito comum na natureza."
          },
          {
            "id": "b",
            "text": "Muito mais pessoas altas do que baixas.",
            "feedback": "Não, olhe novamente. O gráfico é equilibrado nos dois lados?"
          },
          {
            "id": "c",
            "text": "Padrão aleatório, sem forma clara.",
            "feedback": "Na verdade, há uma forma bem clara! Repare no 'pico' no meio."
          }
        ]
      },
      "explanation": "**Distribuição Normal** aparece em muitos contextos: alturas, pesos, notas de testes, erros de medição. Porque? Muitos pequenos fatores aleatórios se somam (altura = genética + nutrição + ...), e isto naturalmente cria uma curva em sino.\n\nEsta forma é importante porque muitos testes estatísticos *assumem* dados normais."
    },
    {
      "id": "step-4",
      "title": "Comparar com Dados Enviesados",
      "instruction": "Agora selecione 'salary' e crie um histograma. Compare com altura. O que é diferente?",
      "action": "chartSelection",
      "validation": {
        "type": "chartType",
        "expectedChartType": "histogram",
        "expectedFields": ["salary"],
        "errorMessage": "Você precisa de um histograma de 'salary' para continuar."
      },
      "hint": "Clique em 'salary' (desselecione height_cm) e peça por histograma.",
      "explanation": "**Distribuição Enviesada (Skewed):** Não é simétrica. A maioria dos dados está de um lado, com uma 'cauda longa' do outro.\n\n**Skewed Right (positivamente):** Pico à esquerda, cauda longa à direita. Ex: Salários (muita gente ganha pouco, poucos ganha muito).\n\n**Skewed Left (negativamente):** Pico à direita, cauda longa à esquerda. Ex: Notas de testes fáceis (muita gente tira nota alta, poucos tiram baixa)."
    },
    {
      "id": "step-5",
      "title": "Identifique o Enviesamento",
      "instruction": "Vendo o histograma de salários, qual descrição é correta?",
      "action": "multipleChoice",
      "validation": {
        "type": "interpretation",
        "correctAnswer": "b",
        "options": [
          {
            "id": "a",
            "text": "Normal, como as alturas.",
            "feedback": "Não, compare os dois histogramas. O de salário parece diferente?"
          },
          {
            "id": "b",
            "text": "Enviesado à direita. Maioria ganha pouco, minoria ganha muito.",
            "feedback": "Exatamente! Isto é **skewed right** ou **positivamente enviesado**. Muito comum em dados econômicos."
          },
          {
            "id": "c",
            "text": "Enviesado à esquerda, com CEOs no fim.",
            "feedback": "A cauda está à direita (valores altos), não à esquerda. Tente novamente."
          }
        ]
      },
      "explanation": "Salários são frequentemente enviesados porque temos:\n- Muitos trabalhadores ganhando salário base (~3-5k)\n- Alguns gerentes ganhando mais (~8-15k)\n- Raros CEOs/executivos ganhando muito (~50k+)\n\nEsta distribuição tem **skewness > 0** (direita).\n\n**Por quê isto importa?** Muitos testes estatísticos esperam dados normais. Dados enviesados podem violar essas suposições, levando a resultados errados."
    },
    {
      "id": "step-6",
      "title": "Entender Por Quê Transformar",
      "instruction": "Para 'normalizar' dados enviesados, podemos aplicar uma transformação (como LOG). Isto muda a forma. Você já aprendeu sobre isto?",
      "action": "multipleChoice",
      "validation": {
        "type": "knowledge",
        "correctAnswer": "a",
        "options": [
          {
            "id": "a",
            "text": "Não, mas agora entendo por quê transformações são úteis.",
            "feedback": "Ótimo! Você aprenderá a aplicar transformações na próxima lição dedicada a isto."
          },
          {
            "id": "b",
            "text": "Já sabia, e agora entendo quando usar.",
            "feedback": "Perfeito! Você já está um passo à frente."
          },
          {
            "id": "c",
            "text": "Não entendo por quê transformações ajudam.",
            "feedback": "Ideia: imagine comprimir a cauda longa. Log faz isto! LOG(1M) = 6, LOG(10k) = 4, LOG(3k) = 3.5. A escala fica mais equilibrada."
          }
        ]
      },
      "explanation": "**Transformação Log:** Se você toma LOG de cada salário, a distribuição fica muito mais simétrica. Por quê? Porque log comprime grandes números (a cauda longa).\n\nExemplo:\n- Salário 3,000 → log(3000) ≈ 3.48\n- Salário 30,000 → log(30000) ≈ 4.48\n- Salário 300,000 → log(300000) ≈ 5.48\n\nDiferenças menores = distribuição mais equilibrada.\n\nVocê aprenderá a *aplicar* isto na próxima lição!"
    }
  ],
  "summary": {
    "title": "O Que Você Aprendeu",
    "content": "Distribuições descrevem como dados estão espalhados:\n\n✅ **Distribuição Normal (Gaussiana):** Simétrica, em forma de sino. Muito comum. Muitos testes assumem isto.\n\n✅ **Distribuição Enviesada:** Não simétrica. Skewed Right = cauda longa à direita (comum em salários, receita). Skewed Left = cauda longa à esquerda (comum em notas altas).\n\n✅ **Por quê importa?** Formas diferentes podem quebrar suposições de testes. Você pode precisar transformar dados.\n\n✅ **Próximo passo?** Aprenda a APLICAR transformações (Log, raiz quadrada) para 'normalizar' dados enviesados.",
    "keyTakeaway": "Histogramas revelam padrões que números sozinhos não mostram. Sempre olhe a distribuição antes de análises mais complexas."
  }
}
```

---

## 2. Comparando Grupos (INICIANTE)

```json
{
  "id": "comparing-groups",
  "title": "Comparando Grupos",
  "description": "Use box plots para comparar uma variável numérica entre diferentes categorias.",
  "difficulty": "beginner",
  "estimatedTime": "6 min",
  "objectives": [
    "Entender quando comparar grupos é importante",
    "Ler e interpretar box plots lado-a-lado",
    "Identificar qual grupo tem média/mediana mais alta",
    "Reconhecer qual grupo tem mais variabilidade"
  ],
  "exampleDatasetUrl": "/assets/lessons/comparing-groups/sales-by-region.csv",
  "exampleFieldDescriptions": [
    {
      "name": "region",
      "type": "categorical",
      "description": "Região de vendas (Norte, Nordeste, Sudeste, Sul)"
    },
    {
      "name": "sales",
      "type": "numerical",
      "description": "Vendas mensais em mil reais"
    },
    {
      "name": "salesperson",
      "type": "categorical",
      "description": "Nome do vendedor"
    }
  ],
  "steps": [
    {
      "id": "step-1",
      "title": "Entender a Questão",
      "instruction": "Vamos explorar: as vendas são iguais em todas as regiões? Carregue o dataset.",
      "action": "upload",
      "validation": {
        "type": "fieldTypes",
        "expectedFields": [
          { "name": "region", "type": "categorical" },
          { "name": "sales", "type": "numerical" }
        ],
        "errorMessage": "Certifique-se de que 'region' é categórica e 'sales' é numérica."
      },
      "hint": "Use o arquivo de exemplo fornecido.",
      "explanation": "Quando você tem:\n- Uma variável **numérica** (vendas)\n- Uma variável **categórica** (região)\n\nVocê quer comparar a numérica entre os grupos da categórica. Box plots lado-a-lado são perfeitos."
    },
    {
      "id": "step-2",
      "title": "Criar Box Plots Comparativos",
      "instruction": "Selecione 'region' e 'sales'. O tutor deve sugerir 'Grouped Box Plot' ou 'Box Plot por Grupo'. Gere o gráfico.",
      "action": "chartSelection",
      "validation": {
        "type": "chartType",
        "expectedChartType": "boxplotGrouped",
        "expectedFields": ["region", "sales"],
        "errorMessage": "Você precisa de um box plot com a região no eixo X e vendas no eixo Y."
      },
      "hint": "Após selecionar ambas as variáveis, o tutor deve sugerir este gráfico automaticamente.",
      "explanation": "**Box Plot Comparativo:** Um box plot para cada grupo, lado-a-lado.\n\nCada box mostra:\n- **Linha dentro do box** = Mediana\n- **Fundo do box** = Q1 (25º percentil)\n- **Topo do box** = Q3 (75º percentil)\n- **Linhas fora** = Min/Max (ou bigodes)\n- **Pontos isolados** = Outliers\n\nComparando visualmente, você vê logo qual grupo é maior/menor."
    },
    {
      "id": "step-3",
      "title": "Leia as Diferenças",
      "instruction": "Olhe os 4 box plots. Qual região tem a mediana (linha no meio do box) mais alta?",
      "action": "multipleChoice",
      "validation": {
        "type": "interpretation",
        "correctAnswer": "c",
        "options": [
          {
            "id": "a",
            "text": "Norte",
            "feedback": "Olhe de novo. Qual box tem a linha do meio mais acima no gráfico?"
          },
          {
            "id": "b",
            "text": "Nordeste",
            "feedback": "Proche, mas não. Compare as linhas vermelhas/pretas no meio de cada box."
          },
          {
            "id": "c",
            "text": "Sudeste",
            "feedback": "Correto! Sudeste tem a mediana mais alta, e também o box maior (mais variabilidade)."
          },
          {
            "id": "d",
            "text": "Sul",
            "feedback": "Sul está no lado esquerdo/baixo. Não é o mais alto."
          }
        ]
      },
      "explanation": "A **linha dentro de cada box é a mediana**, não a média.\n\nMediana = valor do meio. Se 50% das vendas em Sudeste são ≥ R$50k, então a mediana é R$50k.\n\nIsso mostra que, em típico, Sudeste vende mais que outras regiões."
    },
    {
      "id": "step-4",
      "title": "Identifique a Variabilidade",
      "instruction": "Qual região tem a maior **variabilidade** nas vendas? (Box maior = mais espalhado)",
      "action": "multipleChoice",
      "validation": {
        "type": "interpretation",
        "correctAnswer": "c",
        "options": [
          {
            "id": "a",
            "text": "Norte tem a variabilidade maior.",
            "feedback": "Compre o tamanho dos boxes, não a posição. Qual é mais 'alto'?"
          },
          {
            "id": "b",
            "text": "Nordeste tem a variabilidade maior.",
            "feedback": "Não, Nordeste é bem compacto (box pequeno)."
          },
          {
            "id": "c",
            "text": "Sudeste tem a variabilidade maior.",
            "feedback": "Sim! Sudeste tem o box maior, significando dados mais espalhados (IQR maior). Vendas variam bastante de mês para mês."
          },
          {
            "id": "d",
            "text": "Não há diferença de variabilidade.",
            "feedback": "Olhe novamente. Os boxes têm tamanhos diferentes?"
          }
        ]
      },
      "explanation": "**Tamanho do box = Variabilidade (IQR = Q3 - Q1).**\n\nBox grande = dados espalhados = vendas variam muito.\nBox pequeno = dados concentrados = vendas consistentes.\n\nSudeste: Box grande = vendas variam mês-a-mês. Pode ser risco (meses ruins) ou oportunidade (potencial alto).\n\nNordeste: Box pequeno = vendas consistentes. Previsível."
    },
    {
      "id": "step-5",
      "title": "Identifique Outliers",
      "instruction": "Você vê pontos isolados fora dos boxes/bigodes? Estas são observações muito altas ou muito baixas. Qual região tem outliers?",
      "action": "multipleChoice",
      "validation": {
        "type": "interpretation",
        "correctAnswer": "a",
        "options": [
          {
            "id": "a",
            "text": "Sudeste tem um ponto isolado bem acima. É um outlier (mês excepcional).",
            "feedback": "Correto! Esse ponto isolado é uma venda muito mais alta que o normal para Sudeste."
          },
          {
            "id": "b",
            "text": "Nenhuma região tem outliers.",
            "feedback": "Olhe bem para cima. Há pontos desconectados dos bigodes?"
          },
          {
            "id": "c",
            "text": "Norte tem um outlier baixo.",
            "feedback": "Repare bem. Qual região tem pontos isolados?"
          }
        ]
      },
      "explanation": "Outliers em box plots são pontos fora do padrão.\n\nEm Sudeste, esse ponto alto pode ser:\n✅ Um cliente grande fechou pedido (bom sinal)\n✅ Uma promoção especial\n⚠️ Um erro de dados? (sempre verifique)\n\nNão automaticamente ruim — mas merecem investigação."
    },
    {
      "id": "step-6",
      "title": "Conclusão: O Que Isto Significa",
      "instruction": "Com base no gráfico, qual afirmação resume melhor?",
      "action": "multipleChoice",
      "validation": {
        "type": "knowledge",
        "correctAnswer": "a",
        "options": [
          {
            "id": "a",
            "text": "Sudeste é a região mais forte em vendas, mas com mais variabilidade. Nordeste é consistente, mas menor. Cada região tem dinâmica própria.",
            "feedback": "Excelente! Você entendeu a análise. Isto levaria a estratégias diferentes (Sudeste = maximize upside, Nordeste = estabilize)."
          },
          {
            "id": "b",
            "text": "Todas as regiões são iguais, o gráfico não mostra diferença.",
            "feedback": "Olhe novamente. Os boxes estão em posições diferentes? Têm tamanhos diferentes?"
          },
          {
            "id": "c",
            "text": "Norte é a melhor região.",
            "feedback": "Com base no gráfico, Sudeste tem mediana e volume maiores. Por quê você acha que Norte é melhor?"
          }
        ]
      },
      "explanation": "**Box plots comparativos permitem:** Ver rapidamente padrões entre grupos. Você não precisa de tabelas ou números.\n\nUso real:\n- Vendas por região (seu caso)\n- Salários por departamento\n- Satisfação por produto\n- Tempos de entrega por transportador\n\nPróximo passo? Você já aprendeu a comparar dois grupos (scatter plot de duas numéricas, box plot de uma numérica × categórica). Falta aprender o oposto: **duas categóricas** (heatmaps)."
    }
  ],
  "summary": {
    "title": "O Que Você Aprendeu",
    "content": "✅ **Box plots comparativos** mostram distribuições de uma variável numérica por grupos categóricos.\n\n✅ **Ler o gráfico:**\n- Linha no meio = Mediana (típico valor)\n- Box size = Variabilidade (IQR)\n- Pontos isolados = Outliers (valores atípicos)\n\n✅ **Insights rápidos:** Qual grupo é maior? Qual é mais consistente? Quais têm exceções?\n\n✅ **Próxima aplicação?** Use isto para comparar grupos em seus próprios dados (vendas por loja, notas por turma, etc).",
    "keyTakeaway": "Comparar grupos visualmente é mais rápido que tabelas. Box plots são a ferramenta perfeita para isto."
  }
}
```

---

## 3. Dados Faltantes (INICIANTE)

```json
{
  "id": "missing-data-basics",
  "title": "Dados Faltantes",
  "description": "Identifique, entenda e decida o que fazer com dados faltantes (NAs, valores em branco).",
  "difficulty": "beginner",
  "estimatedTime": "7 min",
  "objectives": [
    "Reconhecer dados faltantes em datasets",
    "Entender por quê dados faltam (not-random vs random)",
    "Saber estratégias básicas (remover vs preencher vs manter)",
    "Entender impacto em análise"
  ],
  "exampleDatasetUrl": "/assets/lessons/missing-data/survey-satisfaction.csv",
  "exampleFieldDescriptions": [
    {
      "name": "respondent_id",
      "type": "numerical",
      "description": "ID do respondente"
    },
    {
      "name": "age",
      "type": "numerical",
      "description": "Idade (alguns faltam)"
    },
    {
      "name": "satisfaction",
      "type": "numerical",
      "description": "Nota de satisfação 1-10 (muitos faltam)"
    },
    {
      "name": "product_category",
      "type": "categorical",
      "description": "Categoria do produto"
    }
  ],
  "steps": [
    {
      "id": "step-1",
      "title": "Reconhecer Dados Faltantes",
      "instruction": "Carregue o dataset de pesquisa. Note que algumas células têm '—', vazias, ou 'NA'. Estas são dados faltantes.",
      "action": "upload",
      "validation": {
        "type": "fieldTypes",
        "expectedFields": [
          { "name": "respondent_id", "type": "numerical" },
          { "name": "age", "type": "numerical" },
          { "name": "satisfaction", "type": "numerical" },
          { "name": "product_category", "type": "categorical" }
        ],
        "errorMessage": "Certifique-se de carregar o arquivo correto com dados faltantes."
      },
      "hint": "O arquivo tem propositalmente algumas células vazias para você explorar.",
      "explanation": "**Dados Faltantes (Missing Data):** Quando um valor esperado não está presente.\n\nSímbolos comuns:\n- Célula vazia\n- 'NA', 'N/A'\n- '-', '—'\n- '?'\n- Branco\n\nNão é automaticamente um *erro*. Pode ser:\n✅ Respondente não quis responder\n✅ Pergunta não se aplica (p.ex. 'Quantos filhos tem?' se pessoa é solteira)\n✅ Erro no sistema/digitação\n✅ Dado não foi coletado\n\nCada cenário exige estratégia diferente."
    },
    {
      "id": "step-2",
      "title": "Quantifique a Ausência",
      "instruction": "Olhe as colunas 'age' e 'satisfaction'. Qual parece ter mais dados faltantes? Tente estimar percentualmente.",
      "action": "multipleChoice",
      "validation": {
        "type": "interpretation",
        "correctAnswer": "a",
        "options": [
          {
            "id": "a",
            "text": "'Satisfaction' tem muito mais faltando (~30-40% dos dados) do que 'age' (~5%).",
            "feedback": "Correto! 'Satisfaction' é a coluna problemática. Muitos respondentes não responderam a essa pergunta."
          },
          {
            "id": "b",
            "text": "'Age' tem mais dados faltantes.",
            "feedback": "Olhe novamente. 'Age' tem bem poucos vazios comparado com 'satisfaction'."
          },
          {
            "id": "c",
            "text": "Nenhuma coluna tem dados faltantes significativos.",
            "feedback": "Procure mais atentamente. Há claramente espaços vazios, especialmente em 'satisfaction'."
          }
        ]
      },
      "explanation": "**Documentar dados faltantes é o PRIMEIRO passo.**\n\nVocê precisaria contar:\n- Total de linhas: 100\n- Linhas com 'age' faltante: 5 → 5%\n- Linhas com 'satisfaction' faltante: 35 → 35%\n\nEsta informação muda seu próximo passo!"
    },
    {
      "id": "step-3",
      "title": "Estratégia 1: Remover (Listwise Deletion)",
      "instruction": "Uma estratégia é remover todas as linhas com qualquer valor faltante. Por quê isto pode ser ruim?",
      "action": "multipleChoice",
      "validation": {
        "type": "knowledge",
        "correctAnswer": "b",
        "options": [
          {
            "id": "a",
            "text": "É sempre a melhor estratégia. Simples e direto.",
            "feedback": "Às vezes é OK, mas tem riscos. Continue lendo."
          },
          {
            "id": "b",
            "text": "Se 35% de dados faltam, você perde 35% das linhas (dados valiosos). E podem ser diferente dos que ficam (viés).",
            "feedback": "Exatamente! Se pessoas insatisfeitas tendem a não responder (satisfaction), removê-las cria viés: seus dados ficam artificialmente positivos."
          },
          {
            "id": "c",
            "text": "Remover nunca funciona.",
            "feedback": "Funciona em alguns casos, mas tem trade-offs."
          }
        ]
      },
      "explanation": "**Remover (Listwise/Pairwise Deletion):**\n\n✅ Vantagens:\n- Simples\n- Mantém dados \"limpos\"\n- Análises clássicas funcionam\n\n❌ Riscos:\n- Perder muitos dados (35% → 0 dados em análise de satisfaction)\n- **Viés (Missing Not At Random):** Se dados faltam porque as pessoas estão insatisfeitas, remover as torna sua amostra enviesada. Resultado: seus dados parecem melhores que a realidade.\n\nQuando usar: Quando < 5% de dados faltam, e parecem aleatórios."
    },
    {
      "id": "step-4",
      "title": "Estratégia 2: Preencher (Imputation)",
      "instruction": "Outra estratégia: preencher valores faltantes com a média, mediana, ou moda. Qual é o risco?",
      "action": "multipleChoice",
      "validation": {
        "type": "knowledge",
        "correctAnswer": "c",
        "options": [
          {
            "id": "a",
            "text": "Imputation nunca funciona. Seus dados ficarão errados.",
            "feedback": "Isto é um extremo. Imputation é usada em muitas análises reais, mas tem trade-offs."
          },
          {
            "id": "b",
            "text": "Imputation é sempre perfeita. Trata o problema completamente.",
            "feedback": "Não, há riscos. Se você preenche 'satisfaction' com a média (6.0), você está inventando dados que não existem."
          },
          {
            "id": "c",
            "text": "Risco: você está 'inventando' dados. Isto reduz variância artificial e pode criar padrões falsos.",
            "feedback": "Correto. Se preenche muitos 6.0s (média), a distribuição fica mais pico (menos spread), e relações podem se distorcer."
          }
        ]
      },
      "explanation": "**Preencher (Imputation):**\n\nMétodos:\n- **Mean/Median:** Use a média/mediana da coluna\n- **Forward Fill:** Use o valor anterior (série temporal)\n- **Regressão:** Prediz baseado em outras variáveis\n- **KNN:** Usa vizinhos mais próximos\n\n✅ Vantagens:\n- Mantém n de linhas\n- Análises podem funcionar\n\n❌ Riscos:\n- Dados *inventados* não são reais\n- Reduz variância artificial → testes ficam muito \"significativos\"\n- Viés se método escolhido é inadequado\n\nQuando usar: Quando < 10-15% faltam, aleatoriamente, e você documenta que imputou."
    },
    {
      "id": "step-5",
      "title": "Estratégia 3: Manter e Investigar",
      "instruction": "Às vezes, a resposta é: NÃO fazer nada. Apenas documentar e investigar por quê. Quando isto faz sentido?",
      "action": "textAnswer",
      "validation": {
        "type": "textMatch",
        "keywords": ["investigar", "porque", "padrão", "significado", "estudo", "documentar"],
        "partialCredit": true,
        "feedback": "Boa resposta! A ideia é: dados faltantes *podem* ser informativos. Se 35% não respondeu satisfaction, **por quê?** Talvez insatisfeitos silenciaram, talvez a pergunta foi mal feita, talvez faltou contexto. Investigar pode ser mais importante que 'consertar'."
      },
      "hint": "Pense em casos onde o fato de alguém NÃO responder é tão importante quanto uma resposta explícita."
    },
    {
      "id": "step-6",
      "title": "Aplicar ao Seu Dataset",
      "instruction": "Para o dataset de pesquisa, qual estratégia você escolheria para 'satisfaction' com 35% faltando?",
      "action": "multipleChoice",
      "validation": {
        "type": "knowledge",
        "correctAnswer": "a",
        "options": [
          {
            "id": "a",
            "text": "Investigar por quê faltam, e depois ou remover OU impute, dependendo do padrão. Nunca blindamente.",
            "feedback": "Perfeito! Dados faltantes > 30% pedem investigação. Você precisa entender o problema para escolher a solução."
          },
          {
            "id": "b",
            "text": "Remover todas as linhas com satisfaction faltante (perde 35% de dados).",
            "feedback": "Possível, mas você perde muito. Investigação primeiro."
          },
          {
            "id": "c",
            "text": "Preencher com a média automaticamente.",
            "feedback": "Arriscado sem investigação. Qual é a média? Qual é o padrão do NA? Sem isto, você está adivinhando."
          }
        ]
      },
      "explanation": "**Fluxo recomendado:**\n\n1️⃣ **Quantificar:** % de NAs por coluna\n2️⃣ **Investigar:** Por quê faltam? (Aleatório? Padrão?)\n3️⃣ **Decidir:** Remover, impute, manter, ou análise sensibilidade\n4️⃣ **Documentar:** O que você fez e por quê\n5️⃣ **Analisar:** Com dados \"limpos\" (conforme decidido)\n\nSem estes passos, suas conclusões podem ser enganosas!"
    }
  ],
  "summary": {
    "title": "O Que Você Aprendeu",
    "content": "✅ **Dados faltantes são comuns e precisam de atenção.**\n\n✅ **Reconhecimento:** Células vazias, 'NA', '—', '?'\n\n✅ **Três estratégias principais:**\n1. **Remover** → Simples, mas pode perder dados e criar viés\n2. **Preencher** → Mantém n, mas \"inventa\" dados\n3. **Investigar & Documentar** → Entender por quê faltam\n\n✅ **Boas práticas:**\n- Sempre quantifique % de NAs\n- Investigue padrões (aleatório vs not-at-random)\n- Documente sua decisão\n- Teste sensibilidade (resultados mudam se você escolher diferente?)\n\n✅ **Nunca ignore dados faltantes.** A forma como você lida com eles pode completamente mudar suas conclusões.",
    "keyTakeaway": "Dados faltantes não são um problema a 'consertar' cegamente. São uma oportunidade para entender melhor seus dados."
  }
}
```

---

## 📋 Como Usar Estes JSONs

1. **Copie cada JSON** para `src/assets/lessons/<lesson-id>/lesson.json`
2. **Crie os CSVs de exemplo:**
   - `salaries-heights.csv` (height_cm, salary, age)
   - `sales-by-region.csv` (region, sales, salesperson)
   - `survey-satisfaction.csv` (respondent_id, age, satisfaction, product_category)
   - Com ~50 linhas cada, padrões claros, alguns NAs propositais
3. **Teste cada lição** no app manualmente
4. **Itere** baseado em feedback

---

## 💡 Variações Futuras

Quando esses três estiverem sólidos, considere:
- Adicionar um 4º passo tipo "Hands-on Challenge" onde usuário tenta sozinho com dados levemente diferentes
- Adicionar vídeo 1-2min se achar necessário (opcional)
- Criar quiz no final de cada lição
- Rastrear tempo de conclusão (para engajamento)

Boa sorte! 🎓
