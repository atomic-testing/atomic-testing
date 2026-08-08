#!/usr/bin/env node
// Scaffolder-coverage check (COV-*). Fails CI when a shipped consumer package is
// not reachable through the scaffolder registry — so adding a new
// `component-driver-*` package (or renaming/removing an engine) without wiring it
// into registry/* is caught HERE rather than silently omitted from
// `create atomic-testing` and, by extension, the generated support matrix.
//
// The support matrix is derived from the same registry (docs/scripts/
// genSupportMatrix.mjs), so this one check keeps both the scaffolder and the
// published matrix honest about a new driver.
//
// Dependency-free Node ESM, modelled on check-recipe-sync.mjs. Reads the built
// dist entry, so build this package first:
//   pnpm --filter create-atomic-testing build
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const distEntry = resolve(scriptDir, '../dist/index.mjs');
const packagesDir = resolve(scriptDir, '../..');
const repoRoot = resolve(packagesDir, '..');

if (!existsSync(distEntry)) {
  console.error(`[coverage] Missing build output at ${distEntry}.`);
  console.error('[coverage] Run: pnpm --filter create-atomic-testing build');
  process.exit(2);
}

const { DESIGN_SYSTEMS, FRAMEWORKS } = await import(pathToFileURL(distEntry).href);

// Every workspace package directory (one that carries a package.json).
const packageDirs = new Set(readdirSync(packagesDir).filter(dir => existsSync(join(packagesDir, dir, 'package.json'))));

// `component-driver-html` is always installed by the resolver directly (its
// plugin's driverPackage() returns null), so it needs no plugin of its own.
const ALWAYS_INSTALLED = new Set(['component-driver-html']);
// Drivers intentionally not offered by the scaffolder yet (EOL, or a driver that
// exists before its recipe does). Add a name here WITH A REASON to acknowledge a
// known gap on purpose instead of failing the build.
const DRIVER_ALLOWLIST = new Set([]);

// COV-04 exemption for a package that is a pure star re-export of another driver
// package: its source's suite IS its suite, because both names resolve to the same
// class identities. Keyed by the alias, valued by the package it re-exports — the
// value is verified, not trusted (COV-05 below), so the alias cannot quietly grow a
// driver of its own and keep the exemption.
const REEXPORT_ALIASES = new Map([['component-driver-shadcn-v1', 'component-driver-radix-v1']]);

// The driver packages the registry can emit. Probe a generous major range;
// each plugin's driverPackage() clamps to the majors it actually supports.
const emittedDrivers = new Set();
for (const ds of Object.values(DESIGN_SYSTEMS)) {
  for (let major = 1; major <= 40; major++) {
    const pkg = ds.driverPackage(major);
    if (pkg) emittedDrivers.add(pkg);
  }
}

// The engine packages the registry can emit, across each framework's majors.
const emittedEngines = new Set();
for (const fw of Object.values(FRAMEWORKS)) {
  for (const major of fw.supportedMajors) {
    const engine = fw.enginePackage(major);
    if (engine) emittedEngines.add(engine);
  }
}

const errors = [];

// 1. Reverse coverage: every shipped component-driver-* is reachable.
const shippedDrivers = [...packageDirs].filter(dir => dir.startsWith('component-driver-')).sort();
for (const dir of shippedDrivers) {
  if (ALWAYS_INSTALLED.has(dir) || DRIVER_ALLOWLIST.has(dir) || emittedDrivers.has(dir)) continue;
  errors.push(
    `COV-01: ${dir} ships but no design-system plugin emits it. Register it in ` +
      `src/registry/designSystems.ts (add or extend a DesignSystemPlugin) and give it a ` +
      `compatibility row, or add it to DRIVER_ALLOWLIST here with a reason.`
  );
}

// 2. Forward existence: everything the registry emits must be a real package.
for (const pkg of [...emittedDrivers].sort()) {
  if (!packageDirs.has(pkg)) {
    errors.push(`COV-02: src/registry/designSystems.ts emits ${pkg}, which is not a package under packages/.`);
  }
}
for (const engine of [...emittedEngines].sort()) {
  if (!packageDirs.has(engine)) {
    errors.push(`COV-03: src/registry/frameworks.ts emits engine ${engine}, which is not a package under packages/.`);
  }
}

// 4. Execution coverage: every shipped driver's tests actually RUN in CI.
//
// COV-01 proves a driver is reachable from the scaffolder. That is a different
// question from whether anything ever executes it, and the gap between the two is
// where component-driver-reka-ui-v2 sat: registered, offered by the CLI, listed in
// the support matrix, and 100% red — 13 suites / 78 tests failing at mount — because
// its jsdom tier was in no CI job at all. Registration without execution is a
// support claim nothing backs.
//
// Scoped deliberately to buildui.yml, the PR-blocking tier. reka-ui's e2e leg WAS
// green and wired up the whole time, which is precisely why the dom hole went
// unnoticed for so long: "it runs in CI somewhere" was true and useless.
//
// The driver-to-test-package relation is read from the test packages' manifests
// rather than inferred from their names, because the naming is not a convention that
// holds: component-driver-radix-v1 is tested by component-driver-radix-test (version
// suffix dropped) while component-driver-fluent-v9 is tested by
// component-driver-fluent-v9-test (suffix kept). A dependency edge is a fact.
const workflowPath = resolve(repoRoot, '.github/workflows/buildui.yml');
const packageTestsDir = resolve(repoRoot, 'package-tests');
const ciTestDirs = [...readFileSync(workflowPath, 'utf8').matchAll(/^\s*directory:\s*'([^']+)'/gm)].map(
  match => match[1]
);

const ciCoveredDrivers = new Set();
for (const testDir of ciTestDirs) {
  const manifestPath = join(packageTestsDir, testDir, 'package.json');
  if (!existsSync(manifestPath)) {
    errors.push(
      `COV-04: .github/workflows/buildui.yml runs tests in package-tests/${testDir}, which does not exist. ` +
        `Fix the matrix entry or restore the package.`
    );
    continue;
  }
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  for (const dep of Object.keys({ ...manifest.dependencies, ...manifest.devDependencies })) {
    const name = dep.replace('@atomic-testing/', '');
    if (dep.startsWith('@atomic-testing/component-driver-') && packageDirs.has(name)) ciCoveredDrivers.add(name);
  }
}

for (const dir of shippedDrivers) {
  if (ciCoveredDrivers.has(dir) || REEXPORT_ALIASES.has(dir)) continue;
  errors.push(
    `COV-04: ${dir} ships but no CI job executes its tests. Add a package-tests/* package that ` +
      `depends on it and a matrix entry in .github/workflows/buildui.yml, or — only if it is a pure ` +
      `star re-export of another driver package — declare it in REEXPORT_ALIASES here.`
  );
}

// 5. The re-export claim that buys a COV-04 exemption must be true.
//
// A star re-export inherits its source's coverage only while it adds nothing of its
// own; the moment it declares a driver, that driver is untested and the exemption is
// a hole. Asserted on source rather than the built barrel because this job builds
// only the scaffolder (no `needs: build`), and a one-line `export *` barrel is
// exactly as legible in source as in dist.
for (const [alias, source] of REEXPORT_ALIASES) {
  const barrelPath = join(packagesDir, alias, 'src/index.ts');
  if (!existsSync(barrelPath)) {
    errors.push(`COV-05: ${alias} is declared a re-export alias but has no src/index.ts.`);
    continue;
  }
  if (!ciCoveredDrivers.has(source)) {
    errors.push(
      `COV-05: ${alias} inherits its coverage from ${source}, whose own tests no CI job runs — ` +
        `so neither package is covered. Wire up ${source} first.`
    );
  }
  const exportLines = readFileSync(barrelPath, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('export') || line.startsWith('import'));
  const expected = `export * from '@atomic-testing/${source}';`;
  if (exportLines.length !== 1 || exportLines[0] !== expected) {
    errors.push(
      `COV-05: ${alias}'s barrel is not a pure re-export of ${source} — expected exactly ` +
        `\`${expected}\`, found ${JSON.stringify(exportLines)}. Its COV-04 exemption assumes ` +
        `${source}'s suite exercises every class this package exports, which is only true while ` +
        `it exports nothing else. Give it a real test package, or drop the addition.`
    );
  }
}

if (errors.length > 0) {
  console.error(`[coverage] ${errors.length} problem(s):`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

process.stdout.write(
  `[coverage] OK — ${shippedDrivers.length} driver package(s) all offered; ` +
    `${emittedEngines.size} engine + ${emittedDrivers.size} driver package(s) all exist; ` +
    `${ciCoveredDrivers.size} run in CI across ${ciTestDirs.length} job(s), ` +
    `${REEXPORT_ALIASES.size} verified re-export alias(es).\n`
);
