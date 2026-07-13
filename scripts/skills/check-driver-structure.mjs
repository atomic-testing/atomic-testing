#!/usr/bin/env node
// CLI over the structural analyzer (driverStructure.mjs). Point it at one or
// more driver / scene files — hand-written or agent-generated — and it prints
// per-file findings and exits non-zero if any HARD error is present. Warnings
// (parts ceiling, missing lock) are surfaced but never fail the run.
//
//   node scripts/skills/check-driver-structure.mjs path/to/FooDriver.ts [...]
//   node scripts/skills/check-driver-structure.mjs --page path/to/fooParts.ts
//
// With no file arguments it scans the golden example drivers, so a bare
// `check:driver-structure` is a meaningful CI signal on the repo's own fixtures.
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { analyzeDriverSource, hasErrors } from './driverStructure.mjs';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, '../..');

/** Stdout line writer — the house scripts avoid `console.log` (oxlint no-console). */
const write = line => process.stdout.write(`${line}\n`);

/** The example-app driver + scene files that serve as the golden fixtures. */
const GOLDEN_FIXTURE_GLOBS = [
  'examples/example-astryx-workspace/src/testing',
  'examples/example-mui-ticket-console/src/testing',
  'examples/example-shadcn-workspace/src/testing',
];

function parseArgs(argv) {
  let page = false;
  const files = [];
  for (const arg of argv) {
    if (arg === '--page') page = true;
    else files.push(arg);
  }
  return { page, files };
}

async function goldenFixtureFiles() {
  const { readdirSync } = await import('node:fs');
  const { join } = await import('node:path');
  const files = [];
  for (const rel of GOLDEN_FIXTURE_GLOBS) {
    const dir = resolve(repoRoot, rel);
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir)) {
      if (name.endsWith('.ts')) files.push(join(dir, name));
    }
  }
  return files;
}

async function main(argv) {
  const { page, files } = parseArgs(argv);
  const targets = files.length > 0 ? files.map(f => resolve(process.cwd(), f)) : await goldenFixtureFiles();

  if (targets.length === 0) {
    console.error('[driver-structure] No files to check.');
    return 2;
  }

  let errorCount = 0;
  let warnCount = 0;
  for (const file of targets) {
    if (!existsSync(file)) {
      console.error(`[driver-structure] Not found: ${file}`);
      errorCount++;
      continue;
    }
    const source = readFileSync(file, 'utf8');
    const { kind, findings } = analyzeDriverSource(source, { fileName: file, page });
    const rel = file.startsWith(repoRoot) ? file.slice(repoRoot.length + 1) : file;
    const shown = findings.filter(f => f.severity !== 'info');
    if (shown.length === 0) {
      write(`  ok    ${rel}  (${kind})`);
    } else {
      write(`  ${hasErrors(findings) ? 'FAIL' : 'warn'}  ${rel}  (${kind})`);
      for (const f of shown) {
        write(`        ${f.severity === 'error' ? '✖' : '!'} [${f.code}] ${f.message}`);
        if (f.severity === 'error') errorCount++;
        else warnCount++;
      }
    }
  }

  write(`\n[driver-structure] ${targets.length} file(s) checked — ${errorCount} error(s), ${warnCount} warning(s).`);
  return errorCount > 0 ? 1 : 0;
}

main(process.argv.slice(2)).then(code => {
  process.exitCode = code;
});
