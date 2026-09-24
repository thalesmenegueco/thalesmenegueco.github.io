/**
 * Vector primitives used by the Curso 1 lessons, written to be re-derivable by
 * hand: every function here has a closed form, so a lesson's numeric example can
 * be checked on paper before it is checked by a test.
 *
 * Notation follows the source of truth (`content-source/mml/*`), where a vector
 * is a column and a transpose is written explicitly — `x^T y` is the dot
 * product, and `M = B (B^T B)^{-1} B^T` is a projection matrix.
 */

export type Vector = number[];

/** Dot product `x^T y` (MML §3.2). */
export function dot(x: Vector, y: Vector): number {
  assertSameLength(x, y, 'dot');
  return x.reduce((sum, xi, i) => sum + xi * y[i], 0);
}

/** Euclidean norm `||x||_2` (MML §3.1). */
export function norm(x: Vector): number {
  return Math.sqrt(dot(x, x));
}

/** Scalar multiplication `lambda x` (MML §2.4). */
export function scale(x: Vector, lambda: number): Vector {
  return x.map((xi) => lambda * xi);
}

/** Vector addition `x + y` (MML §2.4). */
export function add(x: Vector, y: Vector): Vector {
  assertSameLength(x, y, 'add');
  return x.map((xi, i) => xi + y[i]);
}

/** `x - y`, the direction the loss moves against during descent. */
export function subtract(x: Vector, y: Vector): Vector {
  assertSameLength(x, y, 'subtract');
  return x.map((xi, i) => xi - y[i]);
}

/**
 * Linear combination `v = sum_i c_i b_i` (MML §2.5). This is the operation the
 * VectorSpaceWidget makes visible: coefficients on basis vectors, result
 * reachable by dragging.
 */
export function linearCombination(coeffs: Vector, basis: Vector[]): Vector {
  if (coeffs.length !== basis.length) {
    throw new Error(
      `linearCombination: ${coeffs.length} coeficiente(s) para ${basis.length} vetor(es) de base`,
    );
  }
  return basis.reduce<Vector>(
    (acc, b, i) => add(acc, scale(b, coeffs[i])),
    new Array<number>(basis[0]?.length ?? 0).fill(0),
  );
}

/** `cos omega = <x,y> / (||x|| ||y||)` (MML §3.4). */
export function cosineAngle(x: Vector, y: Vector): number {
  const denominator = norm(x) * norm(y);
  if (denominator === 0) {
    throw new Error('cosineAngle: vetor nulo não tem ângulo definido');
  }
  return dot(x, y) / denominator;
}

/**
 * Orthogonal projection of `x` onto the line spanned by `b`:
 * `pi_U(x) = (b^T x / ||b||^2) b` (MML §3.8).
 */
export function projection(x: Vector, b: Vector): Vector {
  const bDotB = dot(b, b);
  if (bDotB === 0) {
    throw new Error('projection: não há projeção sobre o vetor nulo');
  }
  return scale(b, dot(b, x) / bDotB);
}

function assertSameLength(x: Vector, y: Vector, fn: string): void {
  if (x.length !== y.length) {
    throw new Error(`${fn}: dimensões diferentes (${x.length} e ${y.length})`);
  }
}
