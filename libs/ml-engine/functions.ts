/**
 * The registry of scalar functions a manifest may name in
 * `numericExample.inputs.f`.
 *
 * Why a registry instead of evaluating the string: the manifest stores a
 * *reference* (`"x^2 + y^2"`), not code. Evaluating arbitrary strings would mean
 * shipping an expression parser and would make the tests depend on parser
 * behaviour rather than on the maths. Here each id carries an analytic gradient,
 * so the gradient the test checks is exact rather than a finite difference — and
 * an unknown id fails loudly, which is what stops a typo from silently testing
 * nothing.
 */

export interface RegisteredFunction {
  /** Id as written in the manifest. */
  id: string;
  /** Number of variables. */
  arity: number;
  value: (point: number[]) => number;
  /** Analytic gradient, in `\nabla f` order (MML §5.2, numerator layout). */
  gradient: (point: number[]) => number[];
}

function assertArity(fn: RegisteredFunction, point: number[]): void {
  if (point.length !== fn.arity) {
    throw new Error(
      `função "${fn.id}" espera ${fn.arity} variável(is), recebeu ${point.length}`,
    );
  }
}

const REGISTERED: RegisteredFunction[] = [
  {
    id: 'x^2',
    arity: 1,
    value: ([x]) => x * x,
    gradient: ([x]) => [2 * x],
  },
  {
    id: 'x^2 + y^2',
    arity: 2,
    value: ([x, y]) => x * x + y * y,
    gradient: ([x, y]) => [2 * x, 2 * y],
  },
];

export const FUNCTIONS: Record<string, RegisteredFunction> = Object.fromEntries(
  REGISTERED.map((fn) => [fn.id, fn]),
);

/** Ids a manifest may use — surfaced in errors so a typo is self-diagnosing. */
export const FUNCTION_IDS: string[] = REGISTERED.map((fn) => fn.id);

/** Looks up a registered function, or throws listing what does exist. */
export function getFunction(id: string): RegisteredFunction {
  const fn = FUNCTIONS[id];
  if (!fn) {
    throw new Error(
      `função "${id}" não está registrada em FUNCTIONS (disponíveis: ${FUNCTION_IDS.join(', ')})`,
    );
  }
  return fn;
}

/** `f(point)` with an arity check. */
export function evaluateFunction(id: string, point: number[]): number {
  const fn = getFunction(id);
  assertArity(fn, point);
  return fn.value(point);
}

/** `\nabla f(point)` with an arity check. */
export function evaluateGradient(id: string, point: number[]): number[] {
  const fn = getFunction(id);
  assertArity(fn, point);
  return fn.gradient(point);
}
