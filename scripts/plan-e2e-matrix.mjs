#!/usr/bin/env node
// Decides which (package, browser) pairs the e2e workflow runs.
//
// Running all 17 e2e packages on all three browsers is 51 jobs; the repo
// already sits at 32 concurrent jobs, so an unconditional full matrix would
// push every PR into GitHub's per-plan job queue. Cross-browser divergence
// also isn't spread evenly — it concentrates in the interactor primitives
// (pointer coordinates, hover/enter/leave, scroll, key delivery), not in
// design-system drivers. So the default PR run is chromium everywhere plus
// all three browsers on the packages that exercise those primitives, and the
// full matrix is reached only on an explicit or risk-based signal.
//
// Emits `{"include": [{name, directory, project}, ...]}` for a job matrix.

import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const BROWSERS = ['chromium', 'firefox', 'webkit'];
const TEST_ROOT = 'package-tests';

// Packages whose suites ARE the interactor contract rather than a design
// system's DOM. These carry the cross-browser signal, so they run everywhere
// on every PR — the "sensitive subset".
const ALWAYS_CROSS_BROWSER = ['component-driver-html-test', 'internal-interactor-conformance-test'];

// A change under any of these reaches every driver in the repo (CLAUDE.md's
// "shared-primitive blast radius"), so it escalates to the full matrix.
const INTERACTOR_LAYER = [
  'packages/core/src/interactor/',
  'packages/core/src/locators/',
  'packages/dom-core/src/',
  'packages/playwright/src/',
  'packages/react-core/src/',
  'packages/vue-3/src/',
  'packages/angular-core/src/',
];

// Changing the workflow or this planner must exercise what it claims to gate.
const SELF = ['.github/workflows/e2e.yml', 'scripts/plan-e2e-matrix.mjs'];

const FULL_MATRIX_LABEL = 'e2e:full';

/** Every package-tests directory that has at least one runnable e2e suite. */
function discoverPackages() {
  return readdirSync(TEST_ROOT, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .filter(dir => existsSync(join(TEST_ROOT, dir, 'playwright.config.ts')))
    .filter(dir => hasE2eSuite(join(TEST_ROOT, dir, '__tests__')))
    .sort();
}

function hasE2eSuite(dir) {
  if (!existsSync(dir)) {
    return false;
  }
  return readdirSync(dir).some(file => file.endsWith('.e2e.test.ts'));
}

/**
 * Maps a changed driver package to its test directory. The suffix isn't
 * uniform — `component-driver-primevue-v4` is tested by
 * `component-driver-primevue-test` — so the major-version suffix is a fallback.
 */
function testDirFor(packageName, known) {
  const candidates = [`${packageName}-test`, `${packageName.replace(/-v\d+$/, '')}-test`];
  return candidates.find(candidate => known.includes(candidate));
}

function matrixFor(packages, browsers) {
  return packages.flatMap(directory =>
    browsers.map(project => ({ name: `${directory} · ${project}`, directory, project }))
  );
}

function plan({ scope, changedFiles, labels }) {
  const packages = discoverPackages();
  const fullMatrix = matrixFor(packages, BROWSERS);

  if (scope === 'full') {
    return { reason: 'full matrix requested', include: fullMatrix };
  }
  if (labels.includes(FULL_MATRIX_LABEL)) {
    return { reason: `\`${FULL_MATRIX_LABEL}\` label`, include: fullMatrix };
  }

  const touchedShared = changedFiles.filter(
    file => INTERACTOR_LAYER.some(prefix => file.startsWith(prefix)) || SELF.includes(file)
  );
  if (touchedShared.length > 0) {
    return { reason: `shared interactor surface changed (${touchedShared[0]})`, include: fullMatrix };
  }

  // Baseline: chromium everywhere, all browsers on the sensitive subset, and
  // all browsers on any driver package whose own source changed.
  const escalated = new Set(ALWAYS_CROSS_BROWSER.filter(dir => packages.includes(dir)));
  for (const file of changedFiles) {
    const match = /^packages\/([^/]+)\//.exec(file);
    if (!match) {
      continue;
    }
    const directory = testDirFor(match[1], packages);
    if (directory) {
      escalated.add(directory);
    }
  }

  const include = packages.flatMap(directory =>
    matrixFor([directory], escalated.has(directory) ? BROWSERS : ['chromium'])
  );
  return { reason: 'baseline: chromium everywhere, all browsers on changed and sensitive packages', include };
}

const scope = process.env.SCOPE ?? 'changed';
const changedFiles = (process.env.CHANGED_FILES ?? '').split('\n').filter(Boolean);
const labels = (process.env.LABELS ?? '')
  .split(',')
  .map(label => label.trim())
  .filter(Boolean);

const { reason, include } = plan({ scope, changedFiles, labels });

const browserCount = new Map();
for (const entry of include) {
  browserCount.set(entry.project, (browserCount.get(entry.project) ?? 0) + 1);
}
const breakdown = BROWSERS.filter(b => browserCount.has(b))
  .map(b => `${browserCount.get(b)}× ${b}`)
  .join(', ');

// Diagnostics go to stderr so stdout stays a clean matrix the workflow can
// read with `$(node scripts/plan-e2e-matrix.mjs)`.
console.error(`e2e plan: ${include.length} job(s) — ${breakdown}`);
console.error(`reason: ${reason}`);
process.stdout.write(`${JSON.stringify({ include })}\n`);
