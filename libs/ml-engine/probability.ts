/**
 * The little bit of probability the Curso 1 theory module needs: reading a
 * Gaussian interval, which is what the DistributionWidget asks the student to
 * predict.
 *
 * `erf` uses the Abramowitz & Stegun 7.1.26 rational approximation (max absolute
 * error 1.5e-7), which is far below the precision any lesson quotes — and keeping
 * it here means the lesson's "≈ 0.954" is verified against code rather than
 * against the author's memory of the 2-sigma rule.
 */

/** Error function, A&S 7.1.26. */
export function erf(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const z = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * z);
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t +
      0.254829592) *
      t *
      Math.exp(-z * z);
  return sign * y;
}

/** Cumulative distribution of `N(mu, sigma^2)`: `P(X <= x)`. */
export function normalCdf(x: number, mu = 0, sigma = 1): number {
  if (sigma <= 0) {
    throw new Error('normalCdf: sigma precisa ser positivo');
  }
  return 0.5 * (1 + erf((x - mu) / (sigma * Math.SQRT2)));
}

/**
 * `P(lo <= X <= hi)` for `X ~ N(mu, sigma^2)`. With `mu = 2, sigma = 1` and the
 * interval `[0, 4]` this is the two-sigma claim: `0.9545`.
 */
export function gaussianProbabilityWithin(
  mu: number,
  sigma: number,
  [lo, hi]: [number, number],
): number {
  return normalCdf(hi, mu, sigma) - normalCdf(lo, mu, sigma);
}
