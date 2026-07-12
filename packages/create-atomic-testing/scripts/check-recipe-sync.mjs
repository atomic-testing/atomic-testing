#!/usr/bin/env node
// Recipe-catalog ↔ workspace sync-check (REC-SYNC-*), modelled on
// docs/scripts/check-doc-driver-sync.mjs. Fails CI when the scaffolder would
// emit a package that does not exist, an out-of-line version, or a framework
// range that does not satisfy the real engine peer. Run after building this
// package: `pnpm --filter create-atomic-testing build`.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import semver from 'semver';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const distEntry = resolve(scriptDir, '../dist/index.mjs');
const packagesDir = resolve(scriptDir, '../..');

if (!existsSync(distEntry)) {
  console.error(`[recipe-sync] Missing build output at ${distEntry}.`);
  console.error('[recipe-sync] Run: pnpm --filter create-atomic-testing build');
  process.exit(2);
}

const {
  ATOMIC_VERSION,
  ATOMIC_RANGE,
  COMPATIBILITY,
  THIRD_PARTY,
  designSystemsForFramework,
  getFramework,
  resolveRecipe,
} = await import(pathToFileURL(distEntry).href);

// Read every workspace package.json into name → manifest.
const manifests = new Map();
for (const dir of readdirSync(packagesDir)) {
  const pkgPath = join(packagesDir, dir, 'package.json');
  if (!existsSync(pkgPath)) continue;
  try {
    const json = JSON.parse(readFileSync(pkgPath, 'utf8'));
    if (json.name) manifests.set(json.name, json);
  } catch {
    // not a package
  }
}

const errors = [];
const referenced = new Set();
const REP_MAJOR = { react: 19, vue: 3, angular: 22 };

// Walk every ENABLED recipe, resolve it, and collect the @atomic-testing/* deps.
for (const rule of COMPATIBILITY) {
  if (!rule.enabled) continue;
  const major = REP_MAJOR[rule.framework];
  if (major == null) continue;
  const designSystems =
    rule.designSystem === '*' || rule.designSystem == null
      ? designSystemsForFramework(rule.framework).map(d => d.id)
      : [rule.designSystem];

  for (const designSystem of designSystems) {
    let plan;
    try {
      plan = resolveRecipe({
        framework: rule.framework,
        frameworkMajor: major,
        runner: rule.runner,
        designSystem,
        designSystemMajor: null,
        typescript: true,
        packageManager: 'pnpm',
      });
    } catch (error) {
      errors.push(
        `Enabled recipe ${rule.framework}+${rule.runner}+${designSystem} failed to resolve: ${error.message}`
      );
      continue;
    }
    for (const dep of plan.dependencies) {
      if (dep.name.startsWith('@atomic-testing/')) referenced.add(dep.name);
    }
  }
}

// REC-SYNC-01 / 04: every referenced atomic package exists and is in-line version.
for (const name of [...referenced].sort()) {
  const manifest = manifests.get(name);
  if (!manifest) {
    errors.push(`REC-SYNC-01: recipe references ${name}, which is not a package under packages/*.`);
    continue;
  }
  if (manifest.version !== ATOMIC_VERSION) {
    errors.push(
      `REC-SYNC-04: ${name}@${manifest.version} is not the catalog version ${ATOMIC_VERSION} (${ATOMIC_RANGE}).`
    );
  }
}

// REC-SYNC-02: emitted framework ranges must be a subset of the engine peer.
const PEER_CHECKS = [
  { emitted: THIRD_PARTY.react18.range, pkg: '@atomic-testing/react-18', peer: 'react' },
  { emitted: THIRD_PARTY.react19.range, pkg: '@atomic-testing/react-19', peer: 'react' },
  { emitted: THIRD_PARTY.react17.range, pkg: '@atomic-testing/react-legacy', peer: 'react' },
  { emitted: THIRD_PARTY.vue.range, pkg: '@atomic-testing/vue-3', peer: 'vue' },
];
for (const major of getFramework('angular').supportedMajors) {
  PEER_CHECKS.push({ emitted: `^${major}.0.0`, pkg: `@atomic-testing/angular-${major}`, peer: '@angular/core' });
}
for (const { emitted, pkg, peer } of PEER_CHECKS) {
  const manifest = manifests.get(pkg);
  const peerRange = manifest?.peerDependencies?.[peer];
  if (!peerRange) {
    errors.push(`REC-SYNC-02: ${pkg} has no peer "${peer}" to check ${emitted} against.`);
    continue;
  }
  if (!semver.subset(emitted, peerRange)) {
    errors.push(`REC-SYNC-02: emitted ${peer} range "${emitted}" is not within ${pkg}'s peer "${peerRange}".`);
  }
}

if (errors.length > 0) {
  console.error(`[recipe-sync] ${errors.length} problem(s):`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

process.stdout.write(
  `[recipe-sync] OK — ${referenced.size} @atomic-testing packages referenced, all in sync at ${ATOMIC_VERSION}.\n`,
);
