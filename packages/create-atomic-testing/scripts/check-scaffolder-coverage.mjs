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
import { existsSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const distEntry = resolve(scriptDir, '../dist/index.mjs');
const packagesDir = resolve(scriptDir, '../..');

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

if (errors.length > 0) {
  console.error(`[coverage] ${errors.length} problem(s):`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

process.stdout.write(
  `[coverage] OK — ${shippedDrivers.length} driver package(s) all offered; ` +
    `${emittedEngines.size} engine + ${emittedDrivers.size} driver package(s) all exist.\n`
);
