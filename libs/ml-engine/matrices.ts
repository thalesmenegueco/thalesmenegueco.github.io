/**
 * Matrix primitives for the Curso 1 lessons. Small and explicit on purpose: the
 * lessons build the linear regressor from scratch in TypeScript before any
 * library touches the problem (`methodology.md`: "Antes desse curso, os
 * algoritmos são TS puro").
 */

import { type Vector, dot } from './vectors';

export type Matrix = number[][];

/** `C = A B` with `c_ij = sum_l a_il b_lj` (MML §2.1). */
export function matMul(a: Matrix, b: Matrix): Matrix {
  const inner = a[0]?.length ?? 0;
  if (inner !== (b.length ?? 0)) {
    throw new Error(
      `matMul: ${a.length}x${inner} não multiplica por ${b.length}x${b[0]?.length ?? 0}`,
    );
  }
  return a.map((row) =>
    (b[0] ?? []).map((_, j) => row.reduce((sum, aij, l) => sum + aij * b[l][j], 0)),
  );
}

/** `y = A x` — a matrix as the transformation that moves vectors. */
export function matVec(a: Matrix, x: Vector): Vector {
  if ((a[0]?.length ?? 0) !== x.length) {
    throw new Error(
      `matVec: matriz ${a.length}x${a[0]?.length ?? 0} não aplica em vetor de dimensão ${x.length}`,
    );
  }
  return a.map((row) => dot(row, x));
}

export function transpose(a: Matrix): Matrix {
  return (a[0] ?? []).map((_, j) => a.map((row) => row[j]));
}

/**
 * Solves `A x = b` by Gauss-Jordan elimination with partial pivoting.
 *
 * Used for the normal equation `(X^T X) theta = X^T y` (MML §9.2), where the
 * lesson's whole point is that this has a closed-form solution — so the engine
 * must not reach for an iterative solver here.
 */
export function solveLinearSystem(a: Matrix, b: Vector): Vector {
  const n = a.length;
  if (b.length !== n || a.some((row) => row.length !== n)) {
    throw new Error('solveLinearSystem: sistema precisa ser quadrado e casar com b');
  }

  const augmented = a.map((row, i) => [...row, b[i]]);

  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(augmented[row][col]) > Math.abs(augmented[pivot][col])) {
        pivot = row;
      }
    }
    if (augmented[pivot][col] === 0) {
      throw new Error('solveLinearSystem: matriz singular (sem solução única)');
    }
    [augmented[col], augmented[pivot]] = [augmented[pivot], augmented[col]];

    const pivotValue = augmented[col][col];
    for (let j = col; j <= n; j++) {
      augmented[col][j] /= pivotValue;
    }
    for (let row = 0; row < n; row++) {
      if (row === col) continue;
      const factor = augmented[row][col];
      if (factor === 0) continue;
      for (let j = col; j <= n; j++) {
        augmented[row][j] -= factor * augmented[col][j];
      }
    }
  }

  return augmented.map((row) => row[n]);
}

/**
 * Eigenvalues of a 2x2 matrix from its invariants: `lambda = (tr +- sqrt(tr^2 - 4 det)) / 2`
 * (MML §4.2, where `tr(A) = sum lambda_i` and `det(A) = prod lambda_i`). Returned
 * in descending order, which is how the EigenWidget labels the two directions.
 */
export function eigenvalues2x2(a: Matrix): [number, number] {
  if (a.length !== 2 || a[0].length !== 2) {
    throw new Error('eigenvalues2x2: apenas matrizes 2x2');
  }
  const trace = a[0][0] + a[1][1];
  const determinant = a[0][0] * a[1][1] - a[0][1] * a[1][0];
  const discriminant = trace * trace - 4 * determinant;
  if (discriminant < 0) {
    throw new Error('eigenvalues2x2: autovalores complexos');
  }
  const root = Math.sqrt(discriminant);
  return [(trace + root) / 2, (trace - root) / 2];
}
