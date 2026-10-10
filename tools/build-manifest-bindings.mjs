#!/usr/bin/env node
/**
 * Turns every manifest's `widget`, `widgetConfig` and `numericExample.inputs` into the
 * TypeScript fixture the lesson runtime binds its widget with.
 *
 * **What this replaces.** The player used to carry `widgetTarget: Vec2 = [2, 3]` — a hand copy
 * of `fundamentos-teoria-01`'s `numericExample.inputs.c`. That is one duplicated number for one
 * lesson, and the second lesson would have needed a second constant and a second copy. The
 * manifest already declares the widget's initial state, so the runtime reads it instead of
 * restating it, and the two cannot drift.
 *
 * **Same mechanism as `build-manifest-examples.mjs`, for the same reason:** specs run in Karma
 * (a browser) and cannot read repository files, so one source of truth — the manifests — is
 * baked into a fixture that `npm run validate:manifests` refuses when stale. A fixture that has
 * fallen behind would have the widget initialised with numbers the engine test no longer
 * proves, which is worse than no binding at all.
 *
 * Usage:
 *   node tools/build-manifest-bindings.mjs     (or: npm run bindings:build)
 */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const MANIFESTS_DIR = join(ROOT, 'projects/ml-platform/manifests');
const OUTPUT = join(
  ROOT,
  'projects/ml-platform/src/app/lessons/runtime/lesson-bindings.generated.ts',
);
const NOT_MANIFESTS = new Set(['manifest.schema.json', 'registries.json', 'book-sections.json']);

/** Every lesson's widget binding, ordered by lessonId. */
export function collectBindings(dir = MANIFESTS_DIR) {
  return readdirSync(dir)
    .filter((f) => f.endsWith('.json') && !NOT_MANIFESTS.has(f))
    .sort()
    .map((f) => JSON.parse(readFileSync(join(dir, f), 'utf8')))
    // A manifest is identified by being a lesson contract, not by living in this directory:
    // `book-sections.json` is a ruler and would otherwise arrive with an `undefined` lessonId.
    .filter((manifest) => typeof manifest.lessonId === 'string')
    .map((manifest) => ({
      lessonId: manifest.lessonId,
      widgetId: manifest.widget,
      config: manifest.widgetConfig ?? {},
      inputs: manifest.numericExample?.inputs ?? null,
    }));
}

/**
 * Hash of exactly what the runtime reads: the lesson key, the widget name and the numbers the
 * widget starts from.
 *
 * Not hashed on purpose: `title`, `objective`, `sourceRefs`, `keyFormulas`, `expectedValues`.
 * None of them reaches a widget, and hashing them would make a provenance correction — which
 * moves no number any widget shows — invalidate a fixture that is still current. The examples
 * fixture learned the same lesson (see `hashExamples`); noise on a gate is what teaches people
 * to distrust it.
 */
export function hashBindings(bindings) {
  const asserted = bindings.map(({ lessonId, widgetId, config, inputs }) => ({
    lessonId,
    widgetId,
    config,
    inputs,
  }));
  return createHash('sha256').update(JSON.stringify(asserted)).digest('hex').slice(0, 16);
}

function render(bindings) {
  return `/* eslint-disable */
/**
 * GERADO por \`tools/build-manifest-bindings.mjs\` — NÃO EDITE À MÃO.
 *
 * Cada entrada vem de \`widget\` + \`widgetConfig\` + \`numericExample.inputs\` de um
 * manifesto em \`projects/ml-platform/manifests/\`. Depois de mexer em qualquer um deles:
 * \`npm run bindings:build\`.
 *
 * bindingsHash: ${hashBindings(bindings)}
 */
import type { RuntimeWidgetBinding } from './lesson-runtime.types';

/** Hash dos bindings que geraram este arquivo; conferido por \`validate:manifests\`. */
export const BINDINGS_HASH = '${hashBindings(bindings)}';

export const LESSON_BINDINGS: Record<string, RuntimeWidgetBinding> = ${JSON.stringify(
    Object.fromEntries(
      // The `lessonId` is the key, so it is not repeated inside the value: one home per fact,
      // the same reason the manifest carries no `subjectId`. It stays in the hash, though —
      // adding or removing a lesson must move the hash.
      bindings.map((b) => [b.lessonId, { widgetId: b.widgetId, config: b.config, inputs: b.inputs }]),
    ),
    null,
    2,
  )};
`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const bindings = collectBindings();
  writeFileSync(OUTPUT, render(bindings));

  console.log(`✓ ${OUTPUT}`);
  console.log(
    `  ${bindings.length} binding(s): ` +
      `${bindings.filter((b) => b.inputs).length} com exemplo numérico, ` +
      `${bindings.filter((b) => !b.inputs).length} sem`,
  );
  console.log(`  bindingsHash: ${hashBindings(bindings)}`);
}
