/**
 * **Verification level 2** of `PIPELINE.md`: every manifest's numeric example,
 * executed against the engine.
 *
 * The manifests are the source of truth, so they are not retyped here — the
 * fixture is generated from them (`npm run examples:build`) and this spec only
 * supplies the *dispatch*: which engine function answers each lesson's inputs.
 * Adding a manifest with `expectedValues` and no evaluator fails on purpose: an
 * unverified example should be loud, not silently green.
 *
 * Each example is checked twice:
 *
 * 1. the engine's numbers match `expectedValues`, within a tolerance that suits a
 *    lesson which quotes ≤ 4 decimals;
 * 2. each of those numbers appears, formatted, in the example's own prose — so the
 *    text a student reads cannot drift away from the number the test proves.
 */
import {
  MANIFEST_EXAMPLES,
  MANIFESTS_HASH,
  type ManifestNumericExample,
} from './manifest-examples.generated';
import {
  cosineAngle,
  projection,
  linearCombination,
  matVec,
  eigenvalues2x2,
  evaluateGradient,
  descend1d,
  gaussianProbabilityWithin,
  meanSquaredError,
  designMatrix,
  mseGradient,
  gradientDescentStep,
  normalEquation,
} from '@ml/engine';

/** Lessons quote at most four decimals, so 1e-3 is generous and still strict. */
const TOLERANCE = 1e-3;

function numberOf(value: unknown, label: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`inputs.${label} deveria ser número, veio ${JSON.stringify(value)}`);
  }
  return value;
}

function vectorOf(value: unknown, label: string): number[] {
  if (!Array.isArray(value) || value.some((v) => typeof v !== 'number')) {
    throw new Error(`inputs.${label} deveria ser vetor de números`);
  }
  return value as number[];
}

function matrixOf(value: unknown, label: string): number[][] {
  if (!Array.isArray(value) || value.some((row) => !Array.isArray(row))) {
    throw new Error(`inputs.${label} deveria ser matriz`);
  }
  return value.map((row, i) => vectorOf(row, `${label}[${i}]`));
}

/** `[lo, hi]` from a manifest, e.g. the interval of the Gauss lesson. */
function rangeOf(value: unknown, label: string): [number, number] {
  const range = vectorOf(value, label);
  if (range.length !== 2) throw new Error(`inputs.${label} deveria ter 2 números`);
  return [range[0], range[1]];
}

function textOf(value: unknown, label: string): string {
  if (typeof value !== 'string') {
    throw new Error(`inputs.${label} deveria ser string, veio ${JSON.stringify(value)}`);
  }
  return value;
}

/**
 * Turns a manifest's `inputs` into the numbers the lesson claims. One entry per
 * lesson that has `expectedValues`; the order must match the manifest.
 */
type Evaluator = (inputs: Record<string, unknown>) => number[];

const EVALUATORS: Record<string, Evaluator> = {
  'fundamentos-teoria-01': (i) =>
    linearCombination(vectorOf(i['c'], 'c'), matrixOf(i['base'], 'base')),

  'fundamentos-teoria-02': (i) => {
    const x = vectorOf(i['x'], 'x');
    const y = vectorOf(i['y'], 'y');
    return [...projection(x, y), cosineAngle(x, y)];
  },

  'fundamentos-teoria-03': (i) => {
    const matrix = matrixOf(i['matrix'], 'matrix');
    return matrixOf(i['vectors'], 'vectors').flatMap((v) => matVec(matrix, v));
  },

  'fundamentos-teoria-04': (i) => {
    const matrix = matrixOf(i['matrix'], 'matrix');
    const [first, second] = eigenvalues2x2(matrix);
    const probes = matrixOf(i['probes'], 'probes').flatMap((v) => matVec(matrix, v));
    return [first, second, ...probes];
  },

  'fundamentos-teoria-05': (i) => {
    const fn = textOf(i['f'], 'f');
    return matrixOf(i['points'], 'points').flatMap((point) => evaluateGradient(fn, point));
  },

  'fundamentos-teoria-06': (i) =>
    descend1d(
      textOf(i['f'], 'f'),
      numberOf(i['x0'], 'x0'),
      numberOf(i['lr'], 'lr'),
      numberOf(i['iterations'], 'iterations'),
    ),

  'fundamentos-teoria-07': (i) => [
    gaussianProbabilityWithin(
      numberOf(i['mu'], 'mu'),
      numberOf(i['sigma'], 'sigma'),
      rangeOf(i['range'], 'range'),
    ),
  ],

  'fundamentos-aplicada-01': (i) =>
    [meanSquaredError(vectorOf(i['y'], 'y'), vectorOf(i['yhat'], 'yhat'))],

  // `X` here is the feature column, so the intercept is part of what is learned.
  'fundamentos-aplicada-02': (i) => {
    const design = designMatrix(vectorOf(i['X'], 'X'));
    const y = vectorOf(i['y'], 'y');
    const initial = vectorOf(i['init'], 'init');
    return [
      ...mseGradient(design, y, initial),
      ...gradientDescentStep(design, y, initial, numberOf(i['lr'], 'lr')),
    ];
  },

  // `X` here is already a design matrix — the lesson is about the closed form.
  'fundamentos-aplicada-04': (i) =>
    normalEquation(matrixOf(i['X'], 'X'), vectorOf(i['y'], 'y')),
};

/** Formatting used by the prose cross-check: trim float noise, keep ≤ 4 decimals. */
function formatNumber(value: number): string {
  return String(Number(value.toFixed(4)));
}

describe('exemplos numéricos dos manifestos', () => {
  it('a fixture foi gerada a partir dos manifestos', () => {
    expect(MANIFESTS_HASH).toMatch(/^[0-9a-f]{16}$/);
    expect(MANIFEST_EXAMPLES.length).toBeGreaterThan(0);
  });

  it('cada lição aparece uma vez', () => {
    const ids = MANIFEST_EXAMPLES.map((example) => example.lessonId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('todo avaliador registrado corresponde a um exemplo existente', () => {
    const ids = new Set(MANIFEST_EXAMPLES.map((example) => example.lessonId));
    const orphans = Object.keys(EVALUATORS).filter((id) => !ids.has(id));
    expect(orphans).toEqual([]);
  });

  for (const example of MANIFEST_EXAMPLES) {
    registerExampleTest(example);
  }
});

function registerExampleTest(example: ManifestNumericExample): void {
  const label = `${example.lessonId} — ${example.title}`;

  if (!example.expectedValues) {
    // A qualitative example (or a sandbox) has nothing for the engine to reproduce.
    xit(`${label} (exemplo qualitativo, sem expectedValues)`, () => undefined);
    return;
  }

  it(`${label} reproduz o exemplo numérico`, () => {
    const evaluator = EVALUATORS[example.lessonId];
    expect(evaluator)
      .withContext(
        `sem avaliador para ${example.lessonId}: registre-o em EVALUATORS para o exemplo ser verificado`,
      )
      .toBeDefined();

    const actual = evaluator(example.inputs);
    const expected = example.expectedValues as number[];

    expect(actual.length)
      .withContext(`esperava ${expected.length} número(s), veio ${actual.length}`)
      .toBe(expected.length);

    actual.forEach((value, i) => {
      expect(Math.abs(value - expected[i]))
        .withContext(`posição ${i}: motor deu ${value}, manifesto afirma ${expected[i]}`)
        .toBeLessThan(TOLERANCE);
    });

    // The prose must agree with the numbers, or the test would be proving
    // something the student never reads.
    const prose = `${example.description} ${example.expected}`;
    for (const value of expected) {
      expect(prose)
        .withContext(
          `o número ${formatNumber(value)} não aparece no texto do exemplo — ` +
            `descrição e expected divergiram dos expectedValues`,
        )
        .toContain(formatNumber(value));
    }
  });
}
