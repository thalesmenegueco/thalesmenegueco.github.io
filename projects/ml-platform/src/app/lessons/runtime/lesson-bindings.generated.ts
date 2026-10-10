/* eslint-disable */
/**
 * GERADO por `tools/build-manifest-bindings.mjs` — NÃO EDITE À MÃO.
 *
 * Cada entrada vem de `widget` + `widgetConfig` + `numericExample.inputs` de um
 * manifesto em `projects/ml-platform/manifests/`. Depois de mexer em qualquer um deles:
 * `npm run bindings:build`.
 *
 * bindingsHash: 6b32acb56e8dab06
 */
import type { RuntimeWidgetBinding } from './lesson-runtime.types';

/** Hash dos bindings que geraram este arquivo; conferido por `validate:manifests`. */
export const BINDINGS_HASH = '6b32acb56e8dab06';

export const LESSON_BINDINGS: Record<string, RuntimeWidgetBinding> = {
  "fundamentos-aplicada-01": {
    "widgetId": "DatasetExplorerWidget",
    "config": {
      "dataset": "houses-synthetic",
      "n": 50
    },
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
    }
  },
  "fundamentos-aplicada-02": {
    "widgetId": "LinearRegressionWidget",
    "config": {
      "lr": 0.001,
      "thetaInit": [
        0,
        0
      ],
      "showLossCurve": true
    },
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
    }
  },
  "fundamentos-aplicada-03": {
    "widgetId": "LinearRegressionWidget",
    "config": {
      "lr": 0.01,
      "thetaInit": [
        0,
        0
      ],
      "showLossCurve": true,
      "regimesTest": [
        0.0005,
        0.001,
        0.01,
        0.1
      ]
    },
    "inputs": {
      "lr": 0.01,
      "iterations": 50
    }
  },
  "fundamentos-aplicada-04": {
    "widgetId": "NormalEquationWidget",
    "config": {
      "showGDSideBySide": true
    },
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
    }
  },
  "fundamentos-aplicada-05": {
    "widgetId": "LinearRegressionWidget",
    "config": {
      "mode": "sandbox",
      "datasetSwitcher": true,
      "allowAddPoints": true
    },
    "inputs": null
  },
  "fundamentos-teoria-01": {
    "widgetId": "VectorSpaceWidget",
    "config": {
      "space": "2d",
      "bases": [
        [
          1,
          0
        ],
        [
          0,
          1
        ]
      ],
      "availableOps": [
        "sum",
        "scale",
        "linearCombination"
      ]
    },
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
    }
  },
  "fundamentos-teoria-02": {
    "widgetId": "ProjectionWidget",
    "config": {
      "vectorA": [
        3,
        4
      ],
      "vectorB": [
        1,
        1
      ],
      "allowDrag": true
    },
    "inputs": {
      "x": [
        3,
        4
      ],
      "y": [
        1,
        1
      ]
    }
  },
  "fundamentos-teoria-03": {
    "widgetId": "MatrixTransformWidget",
    "config": {
      "gradie": true,
      "showEigenvectors": false,
      "presets": [
        "identity",
        "rotation45",
        "scale2x",
        "shear"
      ]
    },
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
    }
  },
  "fundamentos-teoria-04": {
    "widgetId": "EigenWidget",
    "config": {
      "showEigenvectors": true,
      "colorEigenvectors": "d2a8ff"
    },
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
    }
  },
  "fundamentos-teoria-05": {
    "widgetId": "GradientWidget",
    "config": {
      "surface": "paraboloid",
      "showGradientArrow": true,
      "samplePoints": [
        -1.5,
        -0.5,
        0.5,
        1.5
      ]
    },
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
    }
  },
  "fundamentos-teoria-06": {
    "widgetId": "GradientDescentWidget",
    "config": {
      "surface": "banana",
      "lr": 0.1,
      "start": [
        -1.5,
        1.8
      ],
      "regimesTrainable": [
        "lento",
        "converge",
        "differe",
        "diverge"
      ]
    },
    "inputs": {
      "f": "x^2",
      "x0": 2,
      "lr": 0.3,
      "iterations": 3
    }
  },
  "fundamentos-teoria-07": {
    "widgetId": "DistributionWidget",
    "config": {
      "type": "gaussian",
      "draggableMuAndSigma": true,
      "showSamples": true
    },
    "inputs": {
      "mu": 2,
      "sigma": 1,
      "range": [
        0,
        4
      ]
    }
  }
};
