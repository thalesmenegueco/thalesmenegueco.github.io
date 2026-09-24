#!/usr/bin/env node
/**
 * Validates every lesson manifest against `manifest.schema.json` **and** against
 * the content it claims to cite.
 *
 * A manifest is a contract (Camada 2 of PIPELINE.md), and a contract that lives
 * only in prose drifts. So this gate checks two layers:
 *
 *  1. **Estrutura** — JSON Schema draft 2020-12, via ajv.
 *  2. **Verdade entre arquivos** — o que o JSON Schema não consegue expressar:
 *     - `lessonId` precisa ser exatamente `<moduleId>-<order com 2 dígitos>`;
 *     - todo `sourceRef` precisa existir como heading `## <ref> — Título` no
 *       arquivo de content-source/ que ele endereça, então um manifesto não
 *       consegue citar seção renomeada, renumerada ou nunca extraída;
 *     - o capítulo de todo `sourceRef` precisa estar coberto por `sourceFiles`,
 *       senão a promessa de "contexto mínimo" da Camada 3 não se sustenta: o
 *       gerador não pode honrar um trecho que não recebeu;
 *     - `numericExample.sourceRef` precisa estar entre os `sourceRefs`;
 *     - `widget` precisa existir em `registries.json` (um typo como
 *       `GradientDescendantWidget` vira falha, não widget fantasma);
 *     - `prerequisites` são a espinha dorsal do encadeamento discovery, então
 *       cada prereq precisa existir como manifesto e o grafo não pode ter ciclo.
 *
 * **Avisos** (não falham o gate): `estimatedMinutes` acima de 15 (o checklist
 * pede ~15, o teto do schema é 25) e ID de dataset em `widgetConfig` que não
 * está em `registries.json`. Ambos são sinal de revisão, não de erro.
 *
 * Usage:
 *   node tools/validate-manifests.mjs [manifestsDir]
 *
 * Exit codes:
 *   0 = todos os manifestos válidos
 *   1 = pelo menos um erro
 *   2 = uso/ambiente (ex. ajv ausente)
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DEFAULT_DIR = join(ROOT, 'projects/ml-platform/manifests');
const CONTENT_ROOT = join(ROOT, 'projects/ml-platform/content-source');
const SCHEMA_FILE = 'manifest.schema.json';
const REGISTRIES_FILE = 'registries.json';

const manifestsDir = process.argv[2] ? process.argv[2] : DEFAULT_DIR;

if (!existsSync(manifestsDir)) {
  console.error(`✗ diretório de manifestos não encontrado: ${manifestsDir}`);
  process.exit(2);
}

let Ajv2020;
try {
  ({ default: Ajv2020 } = await import('ajv/dist/2020.js'));
} catch {
  console.error(
    '✗ ajv não está instalado. Ele hoje entra como dependência transitiva do Angular CLI;\n' +
      '  para o gate não depender disso: npm i -D ajv',
  );
  process.exit(2);
}

// Schema e registries vêm do diretório canônico: o argumento opcional serve para
// validar um conjunto alternativo de manifestos, não outra definição de contrato.
const schema = JSON.parse(readFileSync(join(DEFAULT_DIR, SCHEMA_FILE), 'utf8'));
const registries = JSON.parse(readFileSync(join(DEFAULT_DIR, REGISTRIES_FILE), 'utf8'));
const KNOWN_WIDGETS = new Set(registries.widgets ?? []);
const KNOWN_DATASETS = new Set(registries.datasets ?? []);

const ajv = new Ajv2020({ allErrors: true, strict: false });
const validate = ajv.compile(schema);

/** IDs de seção (`## mml-5.2 — …`, `# mml-7 — …`) presentes num arquivo. */
function sectionIds(relPath) {
  const text = readFileSync(join(CONTENT_ROOT, relPath), 'utf8');
  const re = /^#{1,2} ([a-z]+-[0-9]+(?:\.[0-9]+)*(?:-[a-z0-9-]+)*) — /gm;
  return [...text.matchAll(re)].map((m) => m[1]);
}

/** Arquivo de capítulo que um ref endereça, ex. `mml-5.2` -> `mml/05-*.md`. */
function chapterFile(ref) {
  const [book, section] = ref.split('-');
  const chapter = Number(section.split('.')[0]);
  const dir = join(CONTENT_ROOT, book);
  if (!existsSync(dir)) return null;
  const prefix = String(chapter).padStart(2, '0');
  const match = readdirSync(dir).find(
    (f) => f.startsWith(`${prefix}-`) && f.endsWith('.md'),
  );
  return match ? `${book}/${match}` : null;
}

/** Valores de string sob chaves tipo "dataset" dentro de widgetConfig. */
function datasetRefs(widgetConfig) {
  if (!widgetConfig || typeof widgetConfig !== 'object') return [];
  return Object.entries(widgetConfig)
    .filter(([key, value]) => /dataset/i.test(key) && typeof value === 'string')
    .map(([, value]) => value);
}

/**
 * Texto dos arquivos de origem com todo espaço removido.
 *
 * Normalizar espaço é o que permite exigir que uma `keyFormula` seja *literal*:
 * a notação tem de ser a do livro, mas a quebra de linha da extração não deve
 * contar como diferença. LaTeX não depende de espaço, então a comparação continua
 * significando igualdade de fórmula.
 */
function normalizedSourceText(sourceFiles) {
  return sourceFiles
    .map((file) => {
      const full = join(CONTENT_ROOT, file);
      return existsSync(full) ? readFileSync(full, 'utf8') : '';
    })
    .join('\n')
    .replace(/\s+/g, '');
}

const files = readdirSync(manifestsDir)
  .filter((f) => f.endsWith('.json') && f !== SCHEMA_FILE && f !== REGISTRIES_FILE)
  .sort();

if (files.length === 0) {
  console.error(`✗ nenhum manifesto em ${manifestsDir}`);
  process.exit(2);
}

// Passo 1: carregar tudo, para que prerequisites possam ser conferidos entre arquivos.
const loaded = new Map();
let parseFailures = 0;

for (const file of files) {
  let manifest;
  try {
    manifest = JSON.parse(readFileSync(join(manifestsDir, file), 'utf8'));
  } catch (e) {
    console.error(`✗ ${file}: JSON inválido — ${e.message}`);
    parseFailures++;
    continue;
  }
  if (typeof manifest?.lessonId !== 'string') {
    console.error(`✗ ${file}: sem lessonId utilizável`);
    parseFailures++;
    continue;
  }
  if (loaded.has(manifest.lessonId)) {
    console.error(
      `✗ ${file}: lessonId "${manifest.lessonId}" duplicado (já em ${loaded.get(manifest.lessonId).file})`,
    );
    parseFailures++;
    continue;
  }
  loaded.set(manifest.lessonId, { file, manifest });
}

/** Ciclos no grafo de prerequisites (DFS com três cores). */
function findCycle() {
  const state = new Map();
  const stack = [];
  function visit(id) {
    if (state.get(id) === 'done') return null;
    if (state.get(id) === 'open') return [...stack.slice(stack.indexOf(id)), id];
    state.set(id, 'open');
    stack.push(id);
    for (const dep of loaded.get(id)?.manifest.prerequisites ?? []) {
      if (!loaded.has(dep)) continue;
      const cycle = visit(dep);
      if (cycle) return cycle;
    }
    stack.pop();
    state.set(id, 'done');
    return null;
  }
  for (const id of loaded.keys()) {
    const cycle = visit(id);
    if (cycle) return cycle;
  }
  return null;
}

let errors = parseFailures;
let warnings = 0;
let notices = 0;

for (const [lessonId, { file, manifest }] of loaded) {
  const problems = [];
  const notes = [];

  // 1. Estrutura
  if (!validate(manifest)) {
    for (const err of validate.errors ?? []) {
      problems.push(`schema ${err.instancePath || '(raiz)'}: ${err.message}`);
    }
  }

  const { moduleId, order, sourceRefs, sourceFiles, widget, widgetConfig, keyFormulas, numericExample, prerequisites } =
    manifest;

  // 2. lessonId derivado
  if (typeof moduleId === 'string' && Number.isInteger(order)) {
    const expected = `${moduleId}-${String(order).padStart(2, '0')}`;
    if (lessonId !== expected) {
      problems.push(`lessonId "${lessonId}" não deriva de moduleId+order (esperado "${expected}")`);
    }
  }

  // 3. sourceFiles existem
  if (Array.isArray(sourceFiles)) {
    for (const f of sourceFiles) {
      if (typeof f === 'string' && !existsSync(join(CONTENT_ROOT, f))) {
        problems.push(`sourceFiles: "${f}" não existe em content-source/`);
      }
    }
  }

  // 4/5. sourceRefs resolvem e são cobertos pelos sourceFiles
  if (Array.isArray(sourceRefs)) {
    for (const ref of sourceRefs) {
      if (typeof ref !== 'string') continue;
      const owner = chapterFile(ref);
      if (!owner) {
        problems.push(`sourceRef "${ref}": capítulo correspondente não está extraído em content-source/`);
        continue;
      }
      const available = sectionIds(owner);
      if (!available.includes(ref)) {
        problems.push(
          `sourceRef "${ref}" não existe como heading em ${owner}` +
            (available.length ? ` (disponíveis: ${available.join(', ')})` : ' (arquivo sem IDs de seção)'),
        );
      }
      if (Array.isArray(sourceFiles) && !sourceFiles.includes(owner)) {
        problems.push(
          `sourceRef "${ref}" vive em ${owner}, que não está em sourceFiles — o gerador não receberia esse trecho`,
        );
      }
    }
    // Lição sem fonte (sandbox) é legítima, mas o par tem de ser coerente.
    if (sourceRefs.length === 0 && Array.isArray(sourceFiles) && sourceFiles.length === 0) {
      notes.push('sem fonte: lição sandbox? sourceRefs e sourceFiles vazios');
      notices++;
    }
    if (sourceRefs.length === 0 && Array.isArray(sourceFiles) && sourceFiles.length > 0) {
      problems.push('sourceFiles preenchido mas sourceRefs vazio — a fonte não é citada em lugar nenhum');
    }
  }

  // 6. numericExample aponta para um ref declarado
  if (numericExample && typeof numericExample === 'object' && Array.isArray(sourceRefs)) {
    if (!sourceRefs.includes(numericExample.sourceRef)) {
      problems.push(`numericExample.sourceRef "${numericExample.sourceRef}" não está em sourceRefs`);
    }
    if (!Array.isArray(numericExample.expectedValues)) {
      notes.push(
        'numericExample sem expectedValues: o nível 2 de verificação não tem número para comparar',
      );
    }
  }

  // 6b. keyFormulas são fatias literais da fonte (decisão de notação de 2026-09-22)
  if (Array.isArray(keyFormulas) && keyFormulas.length > 0) {
    if (!Array.isArray(sourceFiles) || sourceFiles.length === 0) {
      problems.push('keyFormulas preenchido sem sourceFiles: não há fonte para conferir a notação');
    } else {
      const source = normalizedSourceText(sourceFiles);
      for (const formula of keyFormulas) {
        if (typeof formula !== 'string') continue;
        if (!source.includes(formula.replace(/\s+/g, ''))) {
          const shown = formula.length > 60 ? `${formula.slice(0, 60)}…` : formula;
          problems.push(
            `keyFormulas: "${shown}" não aparece literalmente em ${sourceFiles.join(', ')} — ` +
              'copie a fórmula da fonte (a notação é a do livro) em vez de reescrevê-la',
          );
        }
      }
    }
  }

  // 7. widget existe no registro
  if (typeof widget === 'string' && !KNOWN_WIDGETS.has(widget)) {
    problems.push(
      `widget "${widget}" não está em ${REGISTRIES_FILE} — se for widget novo, registre-o lá`,
    );
  }

  // 8. datasets citados na config
  for (const ds of datasetRefs(widgetConfig)) {
    if (!KNOWN_DATASETS.has(ds)) {
      notes.push(`dataset "${ds}" em widgetConfig não está em ${REGISTRIES_FILE}`);
    }
  }

  // 9. prerequisites existem
  if (Array.isArray(prerequisites)) {
    for (const dep of prerequisites) {
      if (typeof dep === 'string' && !loaded.has(dep)) {
        problems.push(`prerequisite "${dep}" não existe como manifesto nesta pasta`);
      }
    }
  }

  // 10. tempo alvo
  if (Number.isInteger(manifest.estimatedMinutes) && manifest.estimatedMinutes > 15) {
    notes.push(`${manifest.estimatedMinutes} min acima do alvo de 15 do checklist`);
  }

  const status = manifest.status ?? 'draft';
  if (problems.length === 0) {
    const refs = Array.isArray(sourceRefs) ? `${sourceRefs.length} refs` : 'refs?';
    console.log(`✓ ${file}  [${status}]  ${refs}, ${prerequisites?.length ?? 0} prereq(s)`);
    for (const n of notes) console.log(`  ! ${n}`);
  } else {
    console.error(`✗ ${file}  [${status}]`);
    for (const p of problems) console.error(`  - ${p}`);
    for (const n of notes) console.error(`  ! ${n}`);
    errors += problems.length;
  }
  warnings += notes.length;
}

const cycle = findCycle();
if (cycle) {
  console.error(`✗ ciclo em prerequisites: ${cycle.join(' → ')}`);
  errors++;
}

// A fixture dos exemplos numéricos é gerada a partir dos manifestos; se ficou
// para trás, o `ng test` estaria verde provando os números antigos — pior do que
// não ter teste. Por isso a defasagem é erro, não aviso.
const FIXTURE = join(
  ROOT,
  'projects/ml-platform/src/app/ml-engine/manifest-examples.generated.ts',
);
if (existsSync(FIXTURE)) {
  const { collectExamples, hashExamples } = await import('./build-manifest-examples.mjs');
  const current = hashExamples(collectExamples());
  const recorded = readFileSync(FIXTURE, 'utf8').match(/MANIFESTS_HASH = '([0-9a-f]+)'/)?.[1];
  if (recorded === current) {
    console.log(`✓ fixture de exemplos em dia (manifestsHash ${current})`);
  } else {
    console.error(
      `✗ fixture de exemplos desatualizada (${recorded ?? 'sem hash'} ≠ ${current}) — ` +
        'rode npm run examples:build',
    );
    errors++;
  }
} else {
  console.log('! fixture de exemplos ainda não gerada — rode npm run examples:build');
  warnings++;
}

console.log(
  `\n${loaded.size} manifesto(s): ${errors} erro(s), ${warnings} aviso(s), ${notices} nota(s)`,
);

if (errors > 0) {
  process.exit(1);
}
