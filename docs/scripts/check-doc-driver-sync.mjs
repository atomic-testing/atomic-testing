#!/usr/bin/env node
// Doc/driver-package sync gate for the Atomic Testing docs site.
//
// WHY: docusaurus.config.ts excludes frozen/EOL packages (MUI 5 / MUI-X 5, see
// ADR-005) from the generated API reference, because they're no longer built and
// TypeDoc can't resolve their cross-package types. The hand-authored narrative
// docs (api-overview.mdx, framework-guide.mdx) are not generated, so nothing
// stops them from silently presenting an excluded package as an ordinary,
// first-class option — which is exactly what happened before #943. This script
// makes that drift fail CI instead of shipping to readers.
//
// WHAT it checks:
//   For every package excluded from the generated API reference (read the same
//   way docusaurus.config.ts's getPackageNames()/EXCLUDED_FROM_DOCS do), every
//   markdown section of api-overview.mdx / framework-guide.mdx that mentions the
//   package must also carry an EOL marker ("EOL" or "ADR-005") in that same
//   section. A mention with no nearby EOL marker means the package reads as a
//   normal, supported option, which is the bug this gate exists to catch.
//
// Run from anywhere: `node docs/scripts/check-doc-driver-sync.mjs`
// Exit code 0 = clean, 1 = an excluded package is presented without an EOL marker.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..');
const docsRoot = path.join(repoRoot, 'docs');
const packagesRoot = path.join(repoRoot, 'packages');
const configFile = path.join(docsRoot, 'docusaurus.config.ts');

// ---------- read the excluded-package set straight from docusaurus.config.ts ----------
// Parsing the live config (instead of re-declaring the set here) keeps this script
// and the API-reference build from drifting out of sync with each other.
function readExcludedPackageNames() {
  const configSrc = fs.readFileSync(configFile, 'utf8');
  const match = configSrc.match(/EXCLUDED_FROM_DOCS\s*=\s*new Set\(\s*\[([\s\S]*?)]\s*\)/);
  if (!match) {
    throw new Error(
      `Could not find EXCLUDED_FROM_DOCS in ${path.relative(repoRoot, configFile)} — has it been renamed?`
    );
  }
  return [...match[1].matchAll(/['"]([^'"]+)['"]/g)].map(m => m[1]);
}

// Mirrors docusaurus.config.ts's getPackageNames(): every directory under
// packages/ except internal-* helpers and the excluded (EOL) set.
function readRealPackageNames() {
  const excluded = new Set(readExcludedPackageNames());
  return fs
    .readdirSync(packagesRoot, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && !entry.name.startsWith('internal-'))
    .map(entry => entry.name)
    .filter(name => !excluded.has(name));
}

// ---------- section-scoped scan of the narrative docs ----------
// A "section" is the text between one `###` heading and the next (or EOF) — the
// same granularity the docs use to give each package/driver family its own
// subsection, so an EOL marker anywhere in a section covers every mention in it.
function splitIntoSections(text) {
  const headingRe = /^###\s.*$/gm;
  const starts = [...text.matchAll(headingRe)].map(m => m.index);
  if (starts.length === 0) return [{ heading: '(no ### heading)', body: text }];
  return starts.map((start, i) => {
    const end = i + 1 < starts.length ? starts[i + 1] : text.length;
    const body = text.slice(start, end);
    return { heading: body.split('\n', 1)[0].trim(), body };
  });
}

const EOL_MARKER_RE = /\bEOL\b|ADR-005/;

const CHECKED_DOCS = ['api-overview.mdx', 'framework-guide.mdx'];

function findUnflaggedMentions(excludedPackages) {
  const problems = [];

  for (const docName of CHECKED_DOCS) {
    const docPath = path.join(docsRoot, 'docs', docName);
    const text = fs.readFileSync(docPath, 'utf8');
    const sections = splitIntoSections(text);

    for (const pkg of excludedPackages) {
      const scopedName = `@atomic-testing/${pkg}`;
      for (const section of sections) {
        if (!section.body.includes(pkg)) continue;
        if (EOL_MARKER_RE.test(section.body)) continue;
        problems.push(
          `${docName} — section "${section.heading}" mentions ${scopedName} (excluded/EOL package) ` +
            `without an "EOL" or "ADR-005" marker in that section`
        );
      }
    }
  }

  return problems;
}

// ---------- main ----------
const excludedPackages = readExcludedPackageNames();
const realPackageNames = readRealPackageNames();

if (excludedPackages.length === 0) {
  console.log('doc-driver-sync: no excluded packages configured — nothing to check.');
  process.exit(0);
}

const problems = findUnflaggedMentions(excludedPackages);

if (problems.length) {
  console.error(`doc-driver-sync: FAILED — ${problems.length} issue(s) found:\n`);
  for (const p of problems) console.error(`  ✗ ${p}`);
  console.error(
    '\nExcluded/EOL packages must be presented behind a clear EOL admonition (see ADR-005), not as a normal option.'
  );
  process.exit(1);
}

console.log(
  `doc-driver-sync: OK — ${excludedPackages.length} excluded package(s) [${excludedPackages.join(', ')}] are ` +
    `either absent or clearly EOL-flagged in ${CHECKED_DOCS.join(', ')}; ${realPackageNames.length} supported package(s) unaffected.`
);
