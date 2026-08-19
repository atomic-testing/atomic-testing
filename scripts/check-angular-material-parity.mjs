#!/usr/bin/env node
// Angular Material per-major parity gate (PARITY-*). Fails CI when the
// component-driver-angular-material-v20/v21/v22 packages — or their
// package-tests/*-test siblings — stop being the same code with a version
// token swapped.
//
// These three packages exist because Angular Material majors are peer-locked
// (component-driver-angular-material-vN hard-depends on angular-N — see
// check-dependency-pinning.mjs's DEP-PIN-02), not because their drivers
// genuinely differ. A fix belongs in all three unless the code comments say
// otherwise. Nothing enforced that until now: the Checkbox/Radio flakiness
// investigation (#1472) fixed CheckboxDriver.ts and confirmed parity by hand
// with a one-off shell diff before every push — exactly the kind of manual
// step that is reliable until, on some future change, it is skipped, and a
// fix silently lands on one major while the other two keep failing.
//
// Comparison is byte equality after replacing each file's own version
// token (`angular-20`, `V20`, `v20`, ...) with a common placeholder — the
// same normalization already used by hand throughout #1472/#1474's manual
// verification. A short, explicit denylist below excludes the handful of
// files that are supposed to diverge beyond that: per-major dependency
// versions and dev-server ports. A separate, narrower list —
// `crossMajorNormalize` — covers files that stay fully gated but need every
// major's token collapsed, not just their own: SelectDriver/
// AutocompleteDriver/overlayLocators document the CDK overlay-strategy split
// in prose that names sibling majors by number ("container on v20,
// native-popover on v21/v22"), so own-major-only normalization leaves that
// prose diverging between copies even though it says the same thing
// everywhere and the underlying code is identical (verified: with every
// major's token collapsed, these files ARE byte-identical across v20/v21/v22
// today). Cross-major normalization is strictly weaker than own-major
// normalization — it would hide a copy-paste that leaves the wrong version
// number behind — so it is opt-in per file, not the default. Adding a file to
// either list should come with a comment explaining WHY, matching what the
// files themselves already carry — a bare path with no rationale is a future
// maintainer's guess.
//
// A brand new file (a new driver, a new example) is covered automatically:
// it must appear under all three majors with matching content, or the gate
// reports which majors have it and which don't. Nothing to update here for
// that case — only for a file that is expected to diverge.
//
// Dependency-free Node ESM, modelled on check-dependency-pinning.mjs.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const EXCLUDED_DIRS = new Set([
  'node_modules',
  'dist',
  'build',
  '.vite',
  'test-results',
  'playwright-report',
  'coverage',
]);
// Extensions that can't be meaningfully byte-compared as normalized text.
// Everything else under a variant directory is traversed and compared —
// deliberately a denylist, not an allowlist: an allowlist silently drops any
// file whose extension nobody thought to add, which defeats the "a new file
// is covered automatically" guarantee above.
const EXCLUDED_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.avif',
  '.ico',
  '.svg',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
  '.otf',
]);

// Each group is a set of directories that are expected to be the same
// package with a version token swapped. `denylist` names paths (relative to
// each variant's own directory) that are allowed to diverge beyond the
// version-token normalization below.
const GROUPS = [
  {
    label: 'component-driver-angular-material-v{N}',
    variants: [
      { major: '20', dir: 'packages/component-driver-angular-material-v20' },
      { major: '21', dir: 'packages/component-driver-angular-material-v21' },
      { major: '22', dir: 'packages/component-driver-angular-material-v22' },
    ],
    denylist: new Set([
      // Dependency majors are supposed to differ; DEP-PIN-01/02 already gate them.
      'package.json',
    ]),
    // Angular Material's CDK moved from an overlay-container strategy (v20) to
    // a native-popover Top Layer host (v21/v22); these three files document
    // exactly that split in prose and in which DOM node each locator walks to
    // — the prose names sibling majors by number, own-major normalization
    // alone can't collapse that. The locator/wait code itself does not branch
    // on the major at all (each driver resolves the panel through Material's
    // own aria-controls link, "insulated from that drift" per SelectDriver's
    // own doc comment) — verified byte-identical across all three once every
    // major's token is collapsed, so cross-major normalization loses no real
    // coverage here, only the ability to catch a wrong major number in prose.
    crossMajorNormalize: new Set([
      'src/components/SelectDriver.ts',
      'src/components/AutocompleteDriver.ts',
      'src/internal/overlayLocators.ts',
    ]),
  },
  {
    label: 'component-driver-angular-material-v{N}-test',
    variants: [
      { major: '20', dir: 'package-tests/component-driver-angular-material-v20-test' },
      { major: '21', dir: 'package-tests/component-driver-angular-material-v21-test' },
      { major: '22', dir: 'package-tests/component-driver-angular-material-v22-test' },
    ],
    // Each test package's dev server binds a fixed port (52<major>) so the
    // three can run concurrently without colliding — normalize() collapses
    // that port token, so vite.config.ts/playwright.config.ts (whose only
    // divergence was that port, verified) need no denylist entry either.
    denylist: new Set([
      'package.json', // dependency majors are supposed to differ; DEP-PIN-01/02 gate them.
    ]),
    // Same rationale and same verification as the driver group above — both
    // files carry a comment naming v20 vs v21/v22 by number, from the example
    // app's side of the same overlay-strategy split.
    crossMajorNormalize: new Set(['src/examples/select/Select.examples.ts', 'src/examples/select/Select.suite.ts']),
  },
];

/** Replace `dir`'s own version token wherever it appears, so e.g.
 * `AngularMaterialV20CheckboxDriver`, `v20`-scoped comments and
 * `@atomic-testing/angular-20` imports all collapse to the same text across
 * majors. Order doesn't matter: the three patterns don't overlap. */
export function normalize(text, major) {
  return text
    .split(`angular-${major}`)
    .join('angular-XX')
    .split(`V${major}`)
    .join('VXX')
    .split(`v${major}`)
    .join('vXX')
    .split(`52${major}`) // each test package's dev-server port, e.g. 5220/5221/5222 —
    .join('52XX'); // bare digits, so the `v${major}` split above never touches it.
}

/**
 * Like {@link normalize}, but collapses every major's own-token pattern, not
 * just one — for the small set of files whose prose legitimately names
 * sibling majors alongside their own. Not the default: replacing every major
 * indiscriminately would also hide a real per-major typo (the wrong version
 * number left behind after a copy-paste) that plain `normalize` still catches
 * everywhere else it's used.
 */
export function normalizeAcrossMajors(text, majors) {
  return majors.reduce((acc, major) => normalize(acc, major), text);
}

function collectRelativeFiles(root) {
  const results = [];
  const walk = dir => {
    for (const entry of readdirSync(dir)) {
      if (EXCLUDED_DIRS.has(entry)) continue;
      const abs = join(dir, entry);
      const stat = statSync(abs);
      if (stat.isDirectory()) {
        walk(abs);
      } else if (![...EXCLUDED_EXTENSIONS].some(ext => entry.endsWith(ext))) {
        results.push(relative(root, abs).split('\\').join('/'));
      }
    }
  };
  if (existsSync(root)) walk(root);
  return results;
}

/**
 * Pure comparison: given gathered facts (one entry per group, each file's
 * normalized content per major, or `null` where absent), return a list of
 * human-readable PARITY-* findings. No filesystem access — see gatherFacts
 * for that half, and check-angular-material-parity.test.mjs for how this is
 * exercised against synthetic fixtures.
 *
 * @param {Array<{label: string, majors: string[], files: Map<string, Map<string, string|null>>}>} groups
 * @returns {string[]}
 */
export function evaluate(groups) {
  const errors = [];
  for (const group of groups) {
    const relPaths = [...group.files.keys()].sort();
    for (const relPath of relPaths) {
      const byMajor = group.files.get(relPath);
      const present = group.majors.filter(major => byMajor.get(major) != null);
      const missing = group.majors.filter(major => byMajor.get(major) == null);

      if (missing.length > 0) {
        errors.push(
          `PARITY-01 [${group.label}] ${relPath} exists for ${present.map(m => `v${m}`).join(', ')} but is ` +
            `missing for ${missing.map(m => `v${m}`).join(', ')}`
        );
        continue;
      }

      const [baseMajor, ...restMajors] = group.majors;
      const baseContent = byMajor.get(baseMajor);
      for (const major of restMajors) {
        if (byMajor.get(major) !== baseContent) {
          errors.push(
            `PARITY-02 [${group.label}] ${relPath} differs between v${baseMajor} and v${major} beyond the ` +
              `version token — port the change to both, or add it to this gate's denylist with a comment ` +
              `saying why they're allowed to diverge there`
          );
        }
      }
    }
  }
  return errors;
}

/**
 * Gather one group's facts from disk. Exported (rather than inlined in
 * {@link gatherFacts}) so tests can point `variants[].dir` at throwaway
 * fixture directories instead of the real packages — the only way to prove
 * the denylist / `crossMajorNormalize` filtering itself works, not just that
 * {@link evaluate} can react to facts assembled by hand.
 *
 * @param {{label: string, variants: Array<{major: string, dir: string}>, denylist: Set<string>, crossMajorNormalize?: Set<string>}} group
 */
export function gatherGroupFacts(group) {
  const majors = group.variants.map(v => v.major);
  const files = new Map();
  for (const { major, dir } of group.variants) {
    const abs = resolve(repoRoot, dir);
    for (const relPath of collectRelativeFiles(abs)) {
      if (group.denylist.has(relPath)) continue;
      if (!files.has(relPath)) files.set(relPath, new Map());
      const raw = readFileSync(join(abs, relPath), 'utf8');
      const content = group.crossMajorNormalize?.has(relPath)
        ? normalizeAcrossMajors(raw, majors)
        : normalize(raw, major);
      files.get(relPath).set(major, content);
    }
  }
  return { label: group.label, majors, files };
}

function gatherFacts() {
  return GROUPS.map(gatherGroupFacts);
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const facts = gatherFacts();
  const errors = evaluate(facts);

  if (errors.length > 0) {
    console.error(`[angular-material-parity] ${errors.length} problem(s):`);
    for (const error of errors) console.error(`  - ${error}`);
    process.exit(1);
  }

  const fileCount = facts.reduce((sum, group) => sum + group.files.size, 0);
  process.stdout.write(
    `[angular-material-parity] OK — ${fileCount} file(s) across v20/v21/v22 and their test packages agree, ` +
      `modulo their own version token.\n`
  );
}
