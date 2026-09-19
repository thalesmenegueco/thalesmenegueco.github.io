/**
 * Where the VisuaLab platform lives, and the deep links into it.
 *
 * The domain was the last open question in the migration, and it is now settled:
 * `visualab.dev`, bought through Vercel Registrar, with `www` as the canonical
 * host because the apex 308-redirects to it.
 *
 * Every outbound URL to the platform lives here on purpose. Phase 4 step 3 asked
 * for exactly this — the redirect stubs it describes target absolute URLs, so
 * pinning the hostname in one place turns "the platform moved" from a hunt
 * through templates into a one-line edit.
 *
 * `ml-platform`'s own `src/index.html` carries the same hostname literally for
 * its `og:url` and `canonical` tags. That one **cannot** import this constant: it
 * is static HTML with no build step injecting values into it, so it is the single
 * place a domain change has to be mirrored by hand. `grep -r visualab.dev`.
 */
export const PLATFORM_BASE_URL = 'https://www.visualab.dev';

/**
 * Deep links into the platform.
 *
 * The three Cálculo paths are the platform's canonical, memorable routes — the
 * same ones the old portfolio URLs served, which is what makes the stubs below
 * a redirect rather than a translation. The platform also answers on a
 * generalised `/curso/:subjectId/:moduleKind/:moduleId` form, but nothing needs
 * to link there by hand.
 */
export const PLATFORM_LINKS = {
  hub: `${PLATFORM_BASE_URL}/`,
  calculoTeoria: `${PLATFORM_BASE_URL}/calculo/teoria`,
  calculoAplicada: `${PLATFORM_BASE_URL}/calculo/aplicada`,
  calculoProcesso: `${PLATFORM_BASE_URL}/calculo/processo`,
} as const;
