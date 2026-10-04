/* eslint-disable */
/**
 * GERADO por `tools/build-manifest-examples.mjs` — NÃO EDITE À MÃO.
 *
 * Cada entrada vem de um `numericExample` em `projects/ml-platform/manifests/`.
 * Depois de mexer em qualquer exemplo: `npm run examples:build`.
 *
 * manifestsHash: d051b31de734e9d0
 */
export interface ManifestNumericExample {
  lessonId: string;
  title: string;
  description: string;
  inputs: Record<string, unknown>;
  expected: string;
  /** Números que o teste compara, na ordem devolvida pelo motor. */
  expectedValues: number[] | null;
  sourceRef: string;
}

/** Hash dos exemplos que geraram este arquivo; conferido por `validate:manifests`. */
export const MANIFESTS_HASH = 'd051b31de734e9d0';

export const MANIFEST_EXAMPLES: ManifestNumericExample[] = [
  {
    "lessonId": "fundamentos-aplicada-01",
    "title": "O problema: prever preço de casas",
    "description": "3 casos com y={100,200,300}, ŷ={110,190,290}: MSE = (100+100+100)/3 ≈ 100",
    "inputs": {
      "y": [
        100,
        200,
        300
      ],
      "yhat": [
        110,
        190,
        290
      ]
    },
    "expected": "MSE ≈ 100",
    "expectedValues": [
      100
    ],
    "sourceRef": "mml-9.2"
  },
  {
    "lessonId": "fundamentos-aplicada-02",
    "title": "Treinando com gradiente descendente",
    "description": "Com X={1,2}, y={1,3}, lr=0.1, init θ₀=θ₁=0: os gradientes são -4.0 e -7.0 → θ = [0.4, 0.7] após 1 passo",
    "inputs": {
      "X": [
        1,
        2
      ],
      "y": [
        1,
        3
      ],
      "lr": 0.1,
      "init": [
        0,
        0
      ],
      "iterations": 1
    },
    "expected": "θ = [0.4, 0.7]",
    "expectedValues": [
      -4,
      -7,
      0.4,
      0.7
    ],
    "sourceRef": "mml-9.2"
  },
  {
    "lessonId": "fundamentos-aplicada-03",
    "title": "Learning rate: o parâmetro mais importante",
    "description": "Mesmo dataset de casas com lr=0.1 → loss explode; lr=0.001 → converge lento; lr=0.01 → ótimo",
    "inputs": {
      "lr": 0.01,
      "iterations": 50
    },
    "expected": "converge em ~50 épocas com MSE < 0.01",
    "expectedValues": null,
    "sourceRef": "mml-7.1"
  },
  {
    "lessonId": "fundamentos-aplicada-04",
    "title": "A equação normal: a solução sem iteração",
    "description": "X = [[1,1],[1,2]], y = [1,3]. X^TX = [[2,3],[3,5]], X^Ty = [4,7], invertendo: θ = [-1, 2]",
    "inputs": {
      "X": [
        [
          1,
          1
        ],
        [
          1,
          2
        ]
      ],
      "y": [
        1,
        3
      ]
    },
    "expected": "θ* = (-1, 2)",
    "expectedValues": [
      -1,
      2
    ],
    "sourceRef": "mml-9.2"
  },
  {
    "lessonId": "fundamentos-teoria-01",
    "title": "Vetores: a matéria-prima dos dados",
    "description": "Combinar linearmente: v = 2·(1,0) + 3·(0,1)",
    "inputs": {
      "c": [
        2,
        3
      ],
      "base": [
        [
          1,
          0
        ],
        [
          0,
          1
        ]
      ]
    },
    "expected": "v = (2, 3)",
    "expectedValues": [
      2,
      3
    ],
    "sourceRef": "mml-2.5"
  },
  {
    "lessonId": "fundamentos-teoria-02",
    "title": "Produto escalar, ângulos e projeções",
    "description": "Projeção de (3,4) em (1,1): dot=7, |b|²=2, então proj=(3.5, 3.5)",
    "inputs": {
      "x": [
        3,
        4
      ],
      "y": [
        1,
        1
      ]
    },
    "expected": "proj = (3.5, 3.5); cosθ ≈ 0.9899",
    "expectedValues": [
      3.5,
      3.5,
      0.9899
    ],
    "sourceRef": "mml-3.2"
  },
  {
    "lessonId": "fundamentos-teoria-03",
    "title": "Matrizes como transformações do plano",
    "description": "Rotação 90° de e₁=(1,0) e e₂=(0,1) pela matriz R = [[0,-1],[1,0]]",
    "inputs": {
      "matrix": [
        [
          0,
          -1
        ],
        [
          1,
          0
        ]
      ],
      "vectors": [
        [
          1,
          0
        ],
        [
          0,
          1
        ]
      ]
    },
    "expected": "R e₁ = (0,1); R e₂ = (-1,0)",
    "expectedValues": [
      0,
      1,
      -1,
      0
    ],
    "sourceRef": "mml-2.7"
  },
  {
    "lessonId": "fundamentos-teoria-04",
    "title": "Autovalores e autovetores: direções que não mudam",
    "description": "Para A = [[4,1],[2,3]], autovalores são λ=5 (v=(1,1)) e λ=2 (v=(1,-2))",
    "inputs": {
      "matrix": [
        [
          4,
          1
        ],
        [
          2,
          3
        ]
      ],
      "probes": [
        [
          1,
          1
        ],
        [
          1,
          -2
        ]
      ]
    },
    "expected": "λ = {5, 2}; A(1,1) = (5,5); A(1,-2) = (2,-4)",
    "expectedValues": [
      5,
      2,
      5,
      5,
      2,
      -4
    ],
    "sourceRef": "mml-4.2"
  },
  {
    "lessonId": "fundamentos-teoria-05",
    "title": "O gradiente: para onde a função cresce",
    "description": "Gradiente de f(x,y) = x² + y²: em (1,1) vale (2,2); em (0,3) vale (0,6)",
    "inputs": {
      "f": "x^2 + y^2",
      "points": [
        [
          1,
          1
        ],
        [
          0,
          3
        ]
      ]
    },
    "expected": "∇f(1,1) = (2,2); ∇f(0,3) = (0,6)",
    "expectedValues": [
      2,
      2,
      0,
      6
    ],
    "sourceRef": "mml-5.2"
  },
  {
    "lessonId": "fundamentos-teoria-06",
    "title": "Gradiente descendente: descendo a ladeira",
    "description": "Em f(x)=x², x₀=2, lr=0.3: x₁=2−0.3·4=0.8; x₂=0.8−0.3·1.6=0.32; x₃≈0.128",
    "inputs": {
      "f": "x^2",
      "x0": 2,
      "lr": 0.3,
      "iterations": 3
    },
    "expected": "[2, 0.8, 0.32, 0.128]",
    "expectedValues": [
      2,
      0.8,
      0.32,
      0.128
    ],
    "sourceRef": "mml-7.1"
  },
  {
    "lessonId": "fundamentos-teoria-07",
    "title": "Probabilidade: incerteza dos dados",
    "description": "Para N(2, 1): P(|x-2| ≤ 2) ≈ 95% (regra dos 2σ aplicada)",
    "inputs": {
      "mu": 2,
      "sigma": 1,
      "range": [
        0,
        4
      ]
    },
    "expected": "≈ 0.954",
    "expectedValues": [
      0.954
    ],
    "sourceRef": "mml-6.5"
  }
];
