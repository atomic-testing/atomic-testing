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
import { fileURLToPath, pathToFileURL } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const packagesDir = resolve(repoRoot, 'packages');

const ADR_PATH = 'agent-docs/adr/006-1.0-api-freeze-and-evolution.md';
const README_PATH = 'README.md';
const STABILITY_HEADING = 'Public API & stability';
// Anchored to a real ATX heading line, not a substring. A bare `includes()` would
// be satisfied by the phrase appearing in prose, a link title, or a fenced code
// block — so renaming the heading while leaving any mention behind would keep the
// gate green while the promise a consumer actually reads had moved or vanished.
const STABILITY_HEADING_LINE = /^#{1,6}[ \t]+Public API & stability[ \t]*$/m;

/**
 * The package names inside a `frozen-set` marker block, in document order, or
 * null when the block is absent or names nothing. Null rather than an empty set
 * on purpose: an empty set agrees with everything and would pass every
 * comparison below, which is the silent-success shape this gate exists to reject.
 *
 * Exported so the marker contract can be tested directly.
 */
export function readMarkedSet(text) {
  const block = /<!--\s*frozen-set:start\s*-->([\s\S]*?)<!--\s*frozen-set:end\s*-->/.exec(text);
  if (!block) return null;
  const names = [...block[1].matchAll(/`([^`]+)`/g)].map(match => match[1]);
  return names.length === 0 ? null : names;
}

/** Does this README carry a real "Public API & stability" heading? */
export const promisesStability = readme => STABILITY_HEADING_LINE.test(readme);

/**
 * Decide the verdict from already-gathered facts, so the rules can be exercised
 * against hand-built inputs — see check-frozen-set.test.mjs, which reintroduces
 * each drift direction and asserts the matching rule fires. A gate nothing ever
 * proves can DETECT is only evidence that it ran.
 *
 * @param facts.declared        names in ADR-006 §1's marker block (null if unreadable)
 * @param facts.readmeDeclared  names in the root README's marker block (null if unreadable)
 * @param facts.packageDirs     every directory under packages/
 * @param facts.hasApiScript    dirs whose manifest declares a `check:api` script
 * @param facts.hasApiReport    dirs with a committed etc/<name>.api.md
 * @param facts.hasStabilitySection  dirs whose README promises a frozen surface
 */
export function evaluate(facts) {
  const { declared, readmeDeclared, packageDirs, hasApiScript, hasApiReport, hasStabilitySection } = facts;
  const errors = [];

  if (declared == null) {
    errors.push(
      `FROZEN-05: ${ADR_PATH} has no readable <!-- frozen-set:start --> … <!-- frozen-set:end --> block. ` +
        `The frozen package set is declared between those markers so this check can read it; ` +
        `restore them around a non-empty list rather than removing them.`
    );
    return errors;
  }
  if (readmeDeclared == null) {
    errors.push(
      `FROZEN-05: ${README_PATH} has no readable <!-- frozen-set:start --> … <!-- frozen-set:end --> block. ` +
        `The frozen package set is declared between those markers so this check can read it; ` +
        `restore them around a non-empty list rather than removing them.`
    );
  }

  const declaredSet = new Set(declared);

  for (const name of declared) {
    if (!packageDirs.has(name)) {
      errors.push(`FROZEN-05: ${ADR_PATH} declares "${name}" frozen, but packages/${name} does not exist.`);
    }
  }

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

  return errors;
}

/** Gather every fact `evaluate` needs by reading the working tree. */
function gatherFacts() {
  const read = relPath => readFileSync(resolve(repoRoot, relPath), 'utf8');
  const packageDirs = new Set(
    readdirSync(packagesDir).filter(dir => existsSync(join(packagesDir, dir, 'package.json')))
  );
  const observe = predicate => new Set([...packageDirs].filter(predicate));

  return {
    declared: readMarkedSet(read(ADR_PATH)),
    readmeDeclared: readMarkedSet(read(README_PATH)),
    packageDirs,
    hasApiScript: observe(dir => {
      try {
        return 'check:api' in (JSON.parse(readFileSync(join(packagesDir, dir, 'package.json'), 'utf8')).scripts ?? {});
      } catch {
        return false;
      }
    }),
    hasApiReport: observe(dir => existsSync(join(packagesDir, dir, 'etc', `${dir}.api.md`))),
    hasStabilitySection: observe(dir => {
      const readmePath = join(packagesDir, dir, 'README.md');
      return existsSync(readmePath) && promisesStability(readFileSync(readmePath, 'utf8'));
    }),
  };
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const facts = gatherFacts();
  const errors = evaluate(facts);

  if (errors.length > 0) {
    console.error(`[frozen-set] ${errors.length} problem(s):`);
    for (const error of errors) console.error(`  - ${error}`);
    process.exit(1);
  }

  process.stdout.write(
    `[frozen-set] OK — ${facts.declared.length} package(s) declared frozen in ADR-006 §1; the API gate, ` +
      `the committed reports, the package READMEs and the root README all name the same set.\n`
  );
}
