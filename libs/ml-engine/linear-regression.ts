/**
 * Linear regression, from the two formulations the course actually uses:
 *
 * - **closed form** — the normal equation `theta = (X^T X)^{-1} X^T y`, which
 *   MML §9.2 presents as the maximum-likelihood solution;
 * - **iterative** — gradient descent on the quadratic loss, which the same data
 *   reaches from a cold start.
 *
 * Both live here so a lesson can *compare* them (the NormalEquationWidget does
 * exactly that) and so the numeric examples of `fundamentos-aplicada-02` and
 * `-04` are checked against the same code the student will read.
 */

import { type Matrix, matMul, matVec, transpose, solveLinearSystem } from './matrices';
import { type Vector, subtract } from './vectors';
import { type RegisteredFunction, getFunction } from './functions';

export interface GradientDescentOptions {
  learningRate: number;
  iterations: number;
  /** Starting point; defaults to the zero vector. */
  initial?: Vector;
}

export interface GradientDescentTrace {
  /** Parameters after the last iteration. */
  theta: Vector;
  /** `theta` at every step, starting with the initial point (length = iterations + 1). */
  history: Vector[];
  /** Squared-error loss at every step, same length as `history`. */
  lossHistory: number[];
}

/** `MSE = (1/n) sum_i (y_i - yhat_i)^2`. */
export function meanSquaredError(y: Vector, yhat: Vector): number {
  if (y.length !== yhat.length) {
    throw new Error('meanSquaredError: y e yhat precisam ter o mesmo tamanho');
  }
  if (y.length === 0) {
    throw new Error('meanSquaredError: conjunto vazio');
  }
  const total = y.reduce((sum, yi, i) => sum + (yi - yhat[i]) ** 2, 0);
  return total / y.length;
}

/**
 * Turns a plain feature column into a design matrix with the intercept column:
 * `[x_1, x_2] -> [[1, x_1], [1, x_2]]`. Manifests that write `X: [1, 2]` mean
 * features, not a matrix — the intercept is a parameter the lesson shows being
 * learned, so it must be in the model.
 */
export function designMatrix(features: Vector): Matrix {
  return features.map((x) => [1, x]);
}

/**
 * Gradient of the mean squared error with respect to `theta`:
 * `dMSE/dtheta = (2/n) X^T (X theta - y)`.
 *
 * Same quantity as MML §5.3's `d/dtheta ||y - X theta||^2 = -2 (y - X theta)^T X`,
 * which is where the lesson takes it from — the factor 2/n is the mean instead of
 * the sum. Kept as a documented convention so a lesson's stated gradient is
 * checkable.
 */
export function mseGradient(X: Matrix, y: Vector, theta: Vector): Vector {
  const residuals = subtract(matVec(X, theta), y);
  const n = X.length;
  const gradient = matVec(transpose(X), residuals);
  return gradient.map((g) => (2 / n) * g);
}

/** One gradient-descent step on the quadratic loss. */
export function gradientDescentStep(
  X: Matrix,
  y: Vector,
  theta: Vector,
  learningRate: number,
): Vector {
  const gradient = mseGradient(X, y, theta);
  return theta.map((t, j) => t - learningRate * gradient[j]);
}

/** Runs gradient descent on the quadratic loss, recording every step. */
export function gradientDescentLinear(
  X: Matrix,
  y: Vector,
  options: GradientDescentOptions,
): GradientDescentTrace {
  const { learningRate, iterations } = options;
  let theta: Vector = options.initial ?? new Array<number>(X[0]?.length ?? 0).fill(0);

  const history: Vector[] = [theta];
  const lossHistory: number[] = [meanSquaredError(y, matVec(X, theta))];

  for (let i = 0; i < iterations; i++) {
    theta = gradientDescentStep(X, y, theta, learningRate);
    history.push(theta);
    lossHistory.push(meanSquaredError(y, matVec(X, theta)));
  }

  return { theta, history, lossHistory };
}

/**
 * Closed-form least squares: `theta = (X^T X)^{-1} X^T y` (MML §9.2). The lesson's
 * point is that this minimum is unique, so it is computed directly rather than
 * iterated towards.
 */
export function normalEquation(X: Matrix, y: Vector): Vector {
  return solveLinearSystem(matMul(transpose(X), X), matVec(transpose(X), y));
}

/**
 * Gradient descent on a registered 1-D function: the `GradientDescentWidget`
 * lesson, where the learning rate is the variable under study.
 * Rule: `x_{i+1} = x_i - gamma_i (grad f)(x_i)` (MML §7.1).
 */
export function descend1d(
  fn: RegisteredFunction | string,
  x0: number,
  learningRate: number,
  iterations: number,
): number[] {
  const registered = typeof fn === 'string' ? getFunction(fn) : fn;
  const history = [x0];
  let x = x0;
  for (let i = 0; i < iterations; i++) {
    x = x - learningRate * registered.gradient([x])[0];
    history.push(x);
  }
  return history;
}
