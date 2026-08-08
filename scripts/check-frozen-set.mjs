#!/usr/bin/env node
// Frozen-set agreement gate (FROZEN-*). Fails CI when the packages ADR-006 §1
// declares frozen, the packages CI actually gates, and the packages whose READMEs
// promise a frozen surface stop being the same set.
//
// The 1.0 readiness audit (#1297, B13) found "the frozen set" defined three
// different ways at once: ADR-006 §1 and the root README named 9 packages,
// `check:api` gated 14 (adding angular-20/21/22, angular-core and storybook, each
// with a committed etc/*.api.md enforced on every PR), and 10 package READMEs
// promised stability. Nothing was broken — a committed API report is a review
// artifact, so the asymmetry pointed the safe way — but a consumer could not tell
// whether `angular-core`'s async `createTestEngine` was covered by SemVer, and at
// a 1.0 tag an ambiguity resolves itself into a promise nobody decided to make.
//
// The failure mode is specifically SILENT drift: each of the three definitions
// lives somewhere different, all three look authoritative, and nothing ever
// compared them. ADR-006 §1's marked list is now the single source of truth and
// the other three are derived facts checked against it.
//
// FROZEN-01  the set with a `check:api` script differs from the declared set —
//            in EITHER direction. A declared package that is not gated is an
//            unenforced promise; a gated package that is not declared is the
//            original B13 bug, a surface the repo defends without admitting it
//            has.
// FROZEN-02  a declared package has no committed etc/<name>.api.md, so nothing
//            records what its surface currently is.
// FROZEN-03  the set whose READMEs carry a "Public API & stability" section
//            differs from the declared set. A consumer reads the README, not the
//            ADR — an undeclared package making the promise is the more dangerous
//            direction, because it is the copy that reaches npm.
// FROZEN-04  the root README's own list disagrees with the ADR's.
// FROZEN-05  a marker block is missing, empty, or names a package that does not
//            exist. Checked explicitly so a reworded document fails loudly rather
//            than quietly matching nothing and reporting success.
//
// Dependency-free Node ESM, modelled on scripts/check-dependency-pinning.mjs.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const packagesDir = resolve(repoRoot, 'packages');

const ADR_PATH = 'agent-docs/adr/006-1.0-api-freeze-and-evolution.md';
const README_PATH = 'README.md';
const STABILITY_HEADING = 'Public API & stability';

const errors = [];

/**
 * The package names inside the `frozen-set` marker block, in document order.
 * Returns null when the block is absent or names nothing — the caller turns that
 * into FROZEN-05 rather than an empty set, because an empty set would agree with
 * nothing and pass every comparison below.
 */
function readMarkedSet(relPath) {
  const text = readFileSync(resolve(repoRoot, relPath), 'utf8');
  const block = /<!--\s*frozen-set:start\s*-->([\s\S]*?)<!--\s*frozen-set:end\s*-->/.exec(text);
  if (!block) {
    errors.push(
      `FROZEN-05: ${relPath} has no <!-- frozen-set:start --> … <!-- frozen-set:end --> block. ` +
        `The frozen package set is declared between those markers so this check can read it; ` +
        `restore them around the list rather than removing them.`
    );
    return null;
  }
  const names = [...block[1].matchAll(/`([^`]+)`/g)].map(match => match[1]);
  if (names.length === 0) {
    errors.push(`FROZEN-05: ${relPath}'s frozen-set block is empty. An empty set silently agrees with everything.`);
    return null;
  }
  return names;
}

const declared = readMarkedSet(ADR_PATH);
const readmeDeclared = readMarkedSet(README_PATH);
if (declared == null) {
  console.error(`[frozen-set] ${errors.length} problem(s):`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

const declaredSet = new Set(declared);
const packageDirs = new Set(readdirSync(packagesDir).filter(dir => existsSync(join(packagesDir, dir, 'package.json'))));

for (const name of declared) {
  if (!packageDirs.has(name)) {
    errors.push(`FROZEN-05: ${ADR_PATH} declares "${name}" frozen, but packages/${name} does not exist.`);
  }
}

/** Observe a fact about the tree, as the set of package directories exhibiting it. */
function observe(predicate) {
  return new Set([...packageDirs].filter(predicate));
}

const hasApiScript = observe(dir => {
  const manifestPath = join(packagesDir, dir, 'package.json');
  try {
    return 'check:api' in (JSON.parse(readFileSync(manifestPath, 'utf8')).scripts ?? {});
  } catch {
    return false;
  }
});

const hasApiReport = observe(dir => existsSync(join(packagesDir, dir, 'etc', `${dir}.api.md`)));

const hasStabilitySection = observe(dir => {
  const readmePath = join(packagesDir, dir, 'README.md');
  return existsSync(readmePath) && readFileSync(readmePath, 'utf8').includes(STABILITY_HEADING);
});

/**
 * Compare an observed set against the declaration, reporting each direction with
 * its own consequence — "declared but not gated" and "gated but not declared" are
 * different bugs and the second is the one B13 actually found.
 */
function requireAgreement(rule, observed, { missing, extra }) {
  for (const name of declared) {
    if (!observed.has(name) && packageDirs.has(name)) errors.push(`${rule}: ${missing(name)}`);
  }
  for (const name of [...observed].sort()) {
    if (!declaredSet.has(name)) errors.push(`${rule}: ${extra(name)}`);
  }
}

requireAgreement('FROZEN-01', hasApiScript, {
  missing: name =>
    `${name} is declared frozen in ${ADR_PATH} but has no "check:api" script, so nothing enforces ` +
    `its surface — the freeze is a promise no gate keeps. Add the script and commit an API report.`,
  extra: name =>
    `packages/${name} runs "check:api" and commits an API report, but ${ADR_PATH} does not declare ` +
    `it frozen. Either add it to the marked list (and give its README the stability section), or ` +
    `remove the gate — a defended surface the contract never mentions is exactly the ambiguity ` +
    `B13 was filed about.`,
});

requireAgreement('FROZEN-02', hasApiReport, {
  missing: name =>
    `${name} is declared frozen but has no packages/${name}/etc/${name}.api.md, so there is no ` +
    `committed record of the surface being frozen. Generate it with \`api-extractor run --local\`.`,
  extra: name =>
    `packages/${name}/etc/${name}.api.md exists but ${name} is not declared frozen. Declare it or ` +
    `delete the stale report.`,
});

requireAgreement('FROZEN-03', hasStabilitySection, {
  missing: name =>
    `${name} is declared frozen but its README has no "${STABILITY_HEADING}" section. Consumers read ` +
    `the README that ships to npm, not this repo's ADRs.`,
  extra: name =>
    `packages/${name}/README.md promises a stable surface under "${STABILITY_HEADING}", but ${name} ` +
    `is not declared frozen in ${ADR_PATH}. That README ships to npm, so it is the copy a consumer ` +
    `will rely on — make it true or remove the claim.`,
});

// FROZEN-04 — the root README restates the list for readers who never open an
// ADR, which makes it a fourth place to drift.
if (readmeDeclared != null) {
  const onlyInAdr = declared.filter(name => !readmeDeclared.includes(name));
  const onlyInReadme = readmeDeclared.filter(name => !declaredSet.has(name));
  if (onlyInAdr.length > 0 || onlyInReadme.length > 0) {
    errors.push(
      `FROZEN-04: ${README_PATH}'s frozen-set list disagrees with ${ADR_PATH}'s` +
        (onlyInAdr.length > 0 ? ` — missing ${onlyInAdr.join(', ')}` : '') +
        (onlyInReadme.length > 0 ? ` — extra ${onlyInReadme.join(', ')}` : '') +
        `. The ADR is the source of truth; update the README to match.`
    );
  }
}

if (errors.length > 0) {
  console.error(`[frozen-set] ${errors.length} problem(s):`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

process.stdout.write(
  `[frozen-set] OK — ${declared.length} package(s) declared frozen in ADR-006 §1; the API gate, the ` +
    `committed reports, the package READMEs and the root README all name the same set.\n`
);
