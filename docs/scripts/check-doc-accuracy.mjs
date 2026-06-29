#!/usr/bin/env node
// Objective doc-accuracy gate for the Atomic Testing docs site.
//
// WHY: the 2026-06-29 docs audit found that hand-authored inline examples imported
// symbols that do not exist (e.g. `HTMLComponentDriver` — the real export is
// `HTMLElementDriver`), because the inline snippets were never compiled. This gate
// makes that class of drift fail CI instead of shipping to readers.
//
// WHAT it checks, with ZERO external dependencies, against the live package source:
//   1. Every `import { … } from '@atomic-testing/<pkg>'` in the docs (including code
//      embedded as template strings in src/*.tsx) names a symbol that the package's
//      src/index.ts actually exports.
//   2. A denylist of known-fabricated names never appears anywhere in the docs
//      (catches non-import uses too — chip labels, `.fillAndSubmit(` calls, etc.).
//
// Run from anywhere: `node docs/scripts/check-doc-accuracy.mjs`
// Exit code 0 = clean, 1 = drift found (prints a report).
//
// Not a full type-check: it validates symbol existence, not call signatures. A
// snippet-level `tsc` doctest is a worthwhile future addition (see
// docs/maintainers/docs-launch-readiness.md).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..');
const docsRoot = path.join(repoRoot, 'docs');
const packagesRoot = path.join(repoRoot, 'packages');

// Symbols that must never appear in the docs (fabricated names found by the audit).
const DENYLIST = ['HTMLComponentDriver', 'MUIButtonDriver', 'createTestEngineForComponent', 'fillAndSubmit'];

// ---------- package export extraction (recursive, handles barrel files) ----------
const exportCache = new Map();

function resolveModule(fromFile, spec) {
  const base = path.resolve(path.dirname(fromFile), spec);
  for (const candidate of [base, `${base}.ts`, `${base}.tsx`, path.join(base, 'index.ts'), path.join(base, 'index.tsx')]) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }
  return null;
}

function parseBraceList(raw) {
  // "A, type B, C as D" -> ["A", "B", "C"] (source-side name for `as`, drop `type`)
  return raw
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => s.replace(/^type\s+/, '').split(/\s+as\s+/)[0].trim())
    .filter(Boolean);
}

function collectExports(file, seen = new Set()) {
  if (exportCache.has(file)) return exportCache.get(file);
  if (seen.has(file)) return new Set();
  seen.add(file);
  const names = new Set();
  const src = fs.readFileSync(file, 'utf8');

  // export * as NS from './x'
  for (const m of src.matchAll(/export\s+\*\s+as\s+([A-Za-z0-9_$]+)\s+from\s+['"]([^'"]+)['"]/g)) {
    names.add(m[1]);
  }
  // export * from './x'  -> recurse
  for (const m of src.matchAll(/export\s+\*\s+from\s+['"]([^'"]+)['"]/g)) {
    const target = resolveModule(file, m[1]);
    if (target) for (const n of collectExports(target, seen)) names.add(n);
  }
  // export { A, type B, C as D } [from '...']
  for (const m of src.matchAll(/export\s+(?:type\s+)?\{([\s\S]*?)\}/g)) {
    for (const n of parseBraceList(m[1])) names.add(n);
  }
  // export (declare)? (abstract)? class|const|let|var|function|function*|interface|type|enum|namespace NAME
  for (const m of src.matchAll(
    /export\s+(?:declare\s+)?(?:abstract\s+)?(?:class|const|let|var|function\*?|interface|type|enum|namespace)\s+([A-Za-z0-9_$]+)/g,
  )) {
    names.add(m[1]);
  }
  exportCache.set(file, names);
  return names;
}

function packageExports(pkg) {
  const idx = path.join(packagesRoot, pkg, 'src', 'index.ts');
  if (!fs.existsSync(idx)) return null; // unknown/unbuilt package -> skip (warn)
  return collectExports(idx);
}

// ---------- doc source scanning ----------
function walk(dir, exts, skip, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!skip.some(s => full.includes(s))) walk(full, exts, skip, out);
    } else if (exts.some(e => entry.name.endsWith(e))) {
      out.push(full);
    }
  }
  return out;
}

function lineOf(text, index) {
  return text.slice(0, index).split('\n').length;
}

const docFiles = [
  ...walk(path.join(docsRoot, 'docs'), ['.md', '.mdx'], [path.join('docs', 'api')]),
  ...walk(path.join(docsRoot, 'src'), ['.ts', '.tsx'], []),
];

const errors = [];
const warnings = new Set();
// `[^{}]` (not `[\s\S]`) keeps the capture inside one import's brace list so it
// can't swallow neighbouring statements / template literals in .mdx code blocks.
const IMPORT_RE = /import\s+(?:type\s+)?\{([^{}]*?)\}\s+from\s+['"]@atomic-testing\/([a-z0-9-]+)['"]/g;

for (const file of docFiles) {
  const rel = path.relative(repoRoot, file);
  const text = fs.readFileSync(file, 'utf8');

  for (const m of text.matchAll(IMPORT_RE)) {
    const symbols = parseBraceList(m[1]);
    const pkg = m[2];
    const exp = packageExports(pkg);
    const line = lineOf(text, m.index);
    if (exp === null) {
      warnings.add(`@atomic-testing/${pkg} (not found under packages/; skipped) — referenced in ${rel}`);
      continue;
    }
    for (const sym of symbols) {
      if (!exp.has(sym)) {
        errors.push(`${rel}:${line}  imports { ${sym} } from '@atomic-testing/${pkg}' — NOT an export of that package`);
      }
    }
  }

  for (const banned of DENYLIST) {
    for (const m of text.matchAll(new RegExp(`\\b${banned}\\b`, 'g'))) {
      errors.push(`${rel}:${lineOf(text, m.index)}  uses fabricated symbol '${banned}' (denylisted)`);
    }
  }
}

// ---------- report ----------
if (warnings.size) {
  console.log('doc-accuracy: warnings (non-blocking):');
  for (const w of [...warnings].sort()) console.log(`  - ${w}`);
  console.log('');
}

if (errors.length) {
  console.error(`doc-accuracy: FAILED — ${errors.length} issue(s) found:\n`);
  for (const e of errors.sort()) console.error(`  ✗ ${e}`);
  console.error('\nThese symbols/imports do not match the published package exports.');
  console.error('See docs/maintainers/docs-launch-readiness.md (criterion: Technical accuracy).');
  process.exit(1);
}

console.log(`doc-accuracy: OK — scanned ${docFiles.length} doc files, all @atomic-testing imports resolve.`);
