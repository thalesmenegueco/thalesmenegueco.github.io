/**
 * Unit specs for the engine itself — hand-computed values, no manifest involved.
 *
 * These are the numbers the Curso 1 lessons ask the student to check on paper, so
 * they are asserted here as arithmetic rather than as prose. Where an example uses
 * small integers, the expected value is written out fully instead of quoted to a
 * tolerance, so a regression cannot hide behind rounding.
 */
import {
  dot,
  norm,
  projection,
  cosineAngle,
  linearCombination,
  matVec,
  eigenvalues2x2,
  normalEquation,
  meanSquaredError,
  mseGradient,
  gradientDescentStep,
  gradientDescentLinear,
  descend1d,
  designMatrix,
  evaluateGradient,
  getFunction,
  normalCdf,
  gaussianProbabilityWithin,
} from '@ml/engine';

describe('vetores (MML §2.4, §2.5, §3.2, §3.4, §3.8)', () => {
  it('combinação linear com a base canônica devolve os próprios coeficientes', () => {
    expect(linearCombination([2, 3], [[1, 0], [0, 1]])).toEqual([2, 3]);
  });

  it('produto escalar de (3,4) com (1,1) é 7', () => {
    expect(dot([3, 4], [1, 1])).toBe(7);
  });

  it('projeta (3,4) em (1,1) no ponto médio da direção', () => {
    // b^T x / ||b||^2 = 7/2, então projeção = 3.5 * (1,1)
    expect(projection([3, 4], [1, 1])).toEqual([3.5, 3.5]);
  });

  it('cos do ângulo entre (3,4) e (1,1) é 7/(5*sqrt(2))', () => {
    expect(cosineAngle([3, 4], [1, 1])).toBeCloseTo(0.98995, 5);
  });

  it('norma de (3,4) é 5', () => {
    expect(norm([3, 4])).toBe(5);
  });

  it('projeção sobre vetor nulo é erro, não NaN', () => {
    expect(() => projection([1, 1], [0, 0])).toThrowError(/vetor nulo/);
  });
});

describe('matrizes (MML §2.1, §4.2, §9.2)', () => {
  it('rotação de 90° leva e1 em e2 e e2 em -e1', () => {
    const rotation = [
      [0, -1],
      [1, 0],
    ];
    expect(matVec(rotation, [1, 0])).toEqual([0, 1]);
    expect(matVec(rotation, [0, 1])).toEqual([-1, 0]);
  });

  it('autovalores de [[4,1],[2,3]] são 5 e 2', () => {
    // tr = 7, det = 10, lambda = (7 +- sqrt(49 - 40))/2
    expect(
      eigenvalues2x2([
        [4, 1],
        [2, 3],
      ]),
    ).toEqual([5, 2]);
  });

  it('os autovetores declarados na lição são de fato autovetores', () => {
    const matrix = [
      [4, 1],
      [2, 3],
    ];
    expect(matVec(matrix, [1, 1])).toEqual([5, 5]);
    expect(matVec(matrix, [1, -2])).toEqual([2, -4]);
  });

  it('matriz singular é erro explícito', () => {
    expect(() =>
      normalEquation(
        [
          [1, 1],
          [2, 2],
        ],
        [1, 2],
      ),
    ).toThrowError(/singular/);
  });
});

describe('regressão linear (MML §5.3, §9.2)', () => {
  it('MSE de y={100,200,300} contra yhat={110,190,290} é 100', () => {
    expect(meanSquaredError([100, 200, 300], [110, 190, 290])).toBe(100);
  });

  it('gradiente do MSE em X={1,2}, y={1,3}, theta=0 é [-4, -7]', () => {
    // (2/n) X^T (X theta - y) com n=2 e X = [[1,1],[1,2]]
    expect(mseGradient(designMatrix([1, 2]), [1, 3], [0, 0])).toEqual([-4, -7]);
  });

  it('um passo com lr=0.1 sai de [0,0] para [0.4, 0.7]', () => {
    const step = gradientDescentStep(designMatrix([1, 2]), [1, 3], [0, 0], 0.1);
    expect(step[0]).toBeCloseTo(0.4, 10);
    expect(step[1]).toBeCloseTo(0.7, 10);
  });

  it('a equação normal resolve X=[[1,1],[1,2]], y=[1,3] em theta=[-1,2]', () => {
    expect(
      normalEquation(
        [
          [1, 1],
          [1, 2],
        ],
        [1, 3],
      ),
    ).toEqual([-1, 2]);
  });

  it('o gradiente descendente converge para a mesma solução fechada', () => {
    const X = designMatrix([1, 2, 3, 4]);
    const y = [2, 4, 6, 8];
    const closed = normalEquation(X, y);
    // lr=0.01 num X'X de autovalores 16.7 e 0.3: o modo lento decai a 0.997 por
    // passo, então 20k iterações é o que a escala dos dados exige — exatamente o
    // motivo de a lição de learning rate existir.
    const descended = gradientDescentLinear(X, y, {
      learningRate: 0.01,
      iterations: 20000,
    }).theta;

    descended.forEach((value, i) => expect(value).toBeCloseTo(closed[i], 3));
  });

  it('a perda cai a cada passo e o histórico começa no ponto inicial', () => {
    const trace = gradientDescentLinear(designMatrix([1, 2]), [1, 3], {
      learningRate: 0.1,
      iterations: 3,
    });
    expect(trace.history.length).toBe(4);
    expect(trace.history[0]).toEqual([0, 0]);
    expect(trace.lossHistory[3]).toBeLessThan(trace.lossHistory[0]);
  });
});

describe('gradiente descendente em 1D (MML §7.1)', () => {
  it('x^2 a partir de x=2 com lr=0.3 dá [2, 0.8, 0.32, 0.128]', () => {
    const history = descend1d('x^2', 2, 0.3, 3);
    const expected = [2, 0.8, 0.32, 0.128];
    expect(history.length).toBe(expected.length);
    // Ponto flutuante: 0.8 - 0.3*1.6 dá 0.32000000000000006, então a comparação é
    // por proximidade — igualdade exata aqui testaria o IEEE 754, não a lição.
    history.forEach((value, i) => expect(value).toBeCloseTo(expected[i], 12));
  });

  it('lr grande demais diverge — o regime que a lição pede para reconhecer', () => {
    const divergent = descend1d('x^2', 2, 1.5, 3);
    expect(Math.abs(divergent[3])).toBeGreaterThan(Math.abs(divergent[0]));
  });
});

describe('funções registradas e gradiente (MML §5.2)', () => {
  it('gradiente de x^2 + y^2 em (0,3) é (0,6)', () => {
    expect(evaluateGradient('x^2 + y^2', [0, 3])).toEqual([0, 6]);
  });

  it('id desconhecido falha listando os ids válidos', () => {
    expect(() => getFunction('x^3')).toThrowError(/x\^2 \+ y\^2/);
  });
});

describe('probabilidade (MML §6.5)', () => {
  it('a CDF padrão em 0 é 0.5', () => {
    expect(normalCdf(0)).toBeCloseTo(0.5, 7);
  });

  it('N(2,1) entre 0 e 4 é a regra dos dois sigma: 0.9545', () => {
    expect(gaussianProbabilityWithin(2, 1, [0, 4])).toBeCloseTo(0.9545, 4);
  });
});
