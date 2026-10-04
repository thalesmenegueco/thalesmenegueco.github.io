#!/usr/bin/env node
/**
 * Turns every manifest's `numericExample` into the TypeScript fixture that
 * `libs/ml-engine/manifest-examples.spec.ts` runs.
 *
 * **Why generate instead of reading the JSON in the spec:** the specs run in
 * Karma — a browser — which cannot read repository files. Generating keeps one
 * source of truth (the manifests) and still lets the numeric examples be verified
 * by the same `ng test` the rest of the project already uses.
 *
 * **Why a hash:** `npm run validate:manifests` recomputes it from the manifests
 * and refuses a fixture that no longer matches, so a changed example can never sit
 * behind a green test that checks the old numbers. Stale tests are worse than
 * missing ones.
 *
 * Usage:
 *   node tools/build-manifest-examples.mjs     (or: npm run examples:build)
 */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const MANIFESTS_DIR = join(ROOT, 'projects/ml-platform/manifests');
const OUTPUT = join(
  ROOT,
  'projects/ml-platform/src/app/ml-engine/manifest-examples.generated.ts',
);
const NOT_MANIFESTS = new Set(['manifest.schema.json', 'registries.json']);

/** Every `numericExample` in the manifests, ordered by lessonId. */
export function collectExamples(dir = MANIFESTS_DIR) {
  return readdirSync(dir)
    .filter((f) => f.endsWith('.json') && !NOT_MANIFESTS.has(f))
    .sort()
    .map((f) => JSON.parse(readFileSync(join(dir, f), 'utf8')))
    .flatMap((manifest) => {
      const example = manifest.numericExample;
      if (!example) return [];
      return [
        {
          lessonId: manifest.lessonId,
          title: manifest.title,
          description: example.description,
          inputs: example.inputs,
          expected: example.expected,
          expectedValues: example.expectedValues ?? null,
          sourceRef: example.sourceRef,
        },
      ];
    });
}

/**
 * Hash of the **asserted** part of the payload: the fields
 * `manifest-examples.spec.ts` actually reads — the dispatch key, the engine inputs,
 * the numbers it compares, and the prose it cross-checks them against.
 *
 * `title` and `sourceRef` ride along in the fixture but no assertion touches them:
 * the spec reads `sourceRef` zero times, and `title` only to build the test's name.
 * They used to be hashed anyway, so correcting a `sourceRef` — a provenance fix that
 * moves no number the spec verifies — invalidated a fixture whose numbers were still
 * current. That fails closed, so it was never a hole; it was noise, and noise on a
 * gate is what teaches people to distrust it.
 *
 * `lessonId` stays in even though it is never compared: the spec asserts the
 * examples are non-empty and unique by lesson, so adding or removing one must move
 * the hash.
 *
 * Reformatting a manifest still does not invalidate anything — `JSON.parse`
 * normalises whitespace before this ever sees it.
 */
export function hashExamples(examples) {
  const asserted = examples.map(
    ({ lessonId, inputs, expected, expectedValues, description }) => ({
      lessonId,
      inputs,
      expected,
      expectedValues,
      description,
    }),
  );
  return createHash('sha256').update(JSON.stringify(asserted)).digest('hex').slice(0, 16);
}

function render(examples) {
  return `/* eslint-disable */
/**
 * GERADO por \`tools/build-manifest-examples.mjs\` — NÃO EDITE À MÃO.
 *
 * Cada entrada vem de um \`numericExample\` em \`projects/ml-platform/manifests/\`.
 * Depois de mexer em qualquer exemplo: \`npm run examples:build\`.
 *
 * manifestsHash: ${hashExamples(examples)}
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

/** Hash dos exemplos que geraram este arquivo; conferido por \`validate:manifests\`. */
export const MANIFESTS_HASH = '${hashExamples(examples)}';

export const MANIFEST_EXAMPLES: ManifestNumericExample[] = ${JSON.stringify(examples, null, 2)};
`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const examples = collectExamples();
  writeFileSync(OUTPUT, render(examples));

  const withValues = examples.filter((e) => e.expectedValues).length;
  console.log(`✓ ${OUTPUT}`);
  console.log(
    `  ${examples.length} exemplo(s): ${withValues} verificável(is) automaticamente, ` +
      `${examples.length - withValues} qualitativo(s)`,
  );
  console.log(`  manifestsHash: ${hashExamples(examples)}`);
}
