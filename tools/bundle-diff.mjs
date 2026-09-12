#!/usr/bin/env node
/**
 * Compares two built Angular bundles for *real* code drift.
 *
 * Angular's `outputHashing: "all"` makes several chunks depend on the emitted
 * names of the chunks they import, so a single real change renames a cascade of
 * chunks and every content hash moves — including `main`, whose bytes change
 * even though its own code did not. An exact hash comparison is therefore a
 * noisy gate.
 *
 * This tool normalises every `chunk-XXXXXXXX.js` / `worker-XXXXXXXX.js`
 * reference to a placeholder before comparing, which collapses the cascade and
 * leaves only genuine differences.
 *
 * Usage:
 *   node tools/bundle-diff.mjs <beforeDir> <afterDir>
 */
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const [beforeDir, afterDir] = process.argv.slice(2);

if (!beforeDir || !afterDir) {
  console.error('usage: node tools/bundle-diff.mjs <beforeDir> <afterDir>');
  process.exit(2);
}

const HASHED_REF = /(?:chunk|worker)-[A-Z0-9]{8}\.js/g;

/** @returns {Map<string, {file: string, size: number, raw: string}>} */
function load(dir) {
  const files = readdirSync(dir)
    .filter((f) => f.endsWith('.js') || f.endsWith('.css'))
    .filter((f) => statSync(join(dir, f)).isFile());

  const byNormalised = new Map();
  const hashes = new Map();

  for (const file of files) {
    const text = readFileSync(join(dir, file), 'utf8');
    const normalised = text.replace(HASHED_REF, 'CHUNK.js');
    const key = createHash('sha256').update(normalised).digest('hex');
    hashes.set(file, key);
    if (!byNormalised.has(key)) {
      byNormalised.set(key, { file, size: text.length, raw: text });
    }
  }

  return { byNormalised, hashes, count: files.length };
}

const before = load(beforeDir);
const after = load(afterDir);

const removed = [...before.byNormalised.keys()].filter(
  (k) => !after.byNormalised.has(k),
);
const added = [...after.byNormalised.keys()].filter(
  (k) => !before.byNormalised.has(k),
);

console.log(`before: ${before.count} files (${before.byNormalised.size} distinct normalised)`);
console.log(`after:  ${after.count} files (${after.byNormalised.size} distinct normalised)`);
console.log('');

if (added.length === 0 && removed.length === 0) {
  console.log('✅ NO CODE DRIFT — every emitted asset is identical once');
  console.log('   chunk-name references are normalised away.');
  process.exit(0);
}

console.log(`❌ CODE DRIFT: ${removed.length} asset(s) removed, ${added.length} added.`);
console.log('');

const show = (label, keys, side) => {
  if (keys.length === 0) return;
  console.log(`${label}:`);
  for (const key of keys) {
    const entry = side.byNormalised.get(key);
    console.log(`  ${entry.file}  (${entry.size} B)`);
  }
  console.log('');
};

show('REMOVED (only in before)', removed, before);
show('ADDED (only in after)', added, after);
process.exit(1);
