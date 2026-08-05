#!/usr/bin/env node
// Published-package manifest gate (LICENSE-*, EXPORTS-*). Fails CI when a package
// that npm actually ships carries metadata a consumer would trip over — the two
// classes found by the 1.0 readiness audit (#1297, items B6 and B7).
//
// LICENSE-01  a published package declares no `license` (or one other than MIT).
//             The MIT text itself is NOT the problem: `pnpm publish` walks up to
//             the workspace root and puts /LICENSE into every tarball, verified
//             against the real 0.100.0 tarballs. What was missing is the manifest
//             FIELD, which is what npmjs.com and every license scanner read — so
//             eight packages shipped the MIT text while displaying as
//             license-unknown.
//
// EXPORTS-01  the `exports` map does not resolve types per module mode. The
//             pre-1.0 shape was one unconditional `types` pointing at the ESM
//             declaration:
//               { ".": { types: d.mts, import: .mjs, require: .cjs } }
//             so a CommonJS consumer resolved `.d.mts` for a `.cjs` file and got
//             TS1479 ("referenced file is an ECMAScript module and cannot be
//             imported with 'require'") — the whole package untyped from CJS,
//             while `dist/index.d.cts` sat there emitted and unreachable. The
//             required shape nests one branch per mode, `types` FIRST (condition
//             matching is first-match-wins, so a `default` ahead of `types` wins
//             and the declaration is never consulted):
//               { ".": { import: { types: d.mts, default: .mjs },
//                        require: { types: d.cts, default: .cjs } } }
//             Nothing may sit beside those two branches either: first-match-wins
//             applies across siblings, so a top-level `types` is matched by both
//             modes ahead of either branch and restores the single-declaration
//             shape the nesting exists to undo.
//
// EXPORTS-02  a manifest points at a dist file that does not exist. This is the
//             defect that hid inside create-atomic-testing: tsdown's `dts.entry`
//             is a GLOB, and its leading `./` matched nothing, so the package
//             emitted no declarations at all — silently, without failing the
//             build — while `types` and both `exports` branches claimed
//             otherwise. A shape check alone cannot see this; only resolving the
//             paths against a real build can.
//
// Dependency-free Node ESM, modelled on scripts/check-dependency-pinning.mjs.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const packagesDir = resolve(repoRoot, 'packages');

// `private === true` is exactly the predicate publish.sh:66,100 uses to decide
// what reaches npm. Any other definition (the pnpm workspace list, the
// etc/*.api.md set) would gate a different set of packages than the one the
// release actually ships.
const isPublished = manifest => manifest.private !== true;

// EXPORTS-02 needs a build to resolve against. Without `--require-dist` an
// unbuilt package is reported as skipped rather than silently passing — a
// vacuously green packaging gate is the failure mode this file exists to
// prevent. CI passes the flag because its job downloads the build artifacts.
const requireDist = process.argv.includes('--require-dist');

const EXPECTED_EXPORTS = {
  '.': {
    import: { types: './dist/index.d.mts', default: './dist/index.mjs' },
    require: { types: './dist/index.d.cts', default: './dist/index.cjs' },
  },
};

function readManifest(dir) {
  const path = join(dir, 'package.json');
  if (!existsSync(path)) return undefined;
  return { path, json: JSON.parse(readFileSync(path, 'utf8')) };
}

function checkLicense(relPath, json, errors) {
  if (json.license === 'MIT') return;
  const found = json.license === undefined ? 'no `license` field' : `\`license\`: ${JSON.stringify(json.license)}`;
  errors.push(
    `LICENSE-01: ${relPath} has ${found} — every published package must declare ` +
      `"license": "MIT", matching the repo-root LICENSE that pnpm puts in its tarball. ` +
      `Without the field npm displays the package as license-unknown regardless of the ` +
      `text it ships.`
  );
}

function checkExportsShape(relPath, json, errors) {
  // Compared structurally, not by deep-equal on a parsed object, so the error can
  // name the specific branch that drifted rather than dumping both maps.
  const actual = json.exports;
  if (actual === undefined) {
    errors.push(`EXPORTS-01: ${relPath} declares no \`exports\` map.`);
    return;
  }
  const keys = Object.keys(actual);
  if (keys.length !== 1 || keys[0] !== '.') {
    errors.push(
      `EXPORTS-01: ${relPath} exports ${JSON.stringify(keys)} — ADR-006 §1 freezes the ` +
        `\`.\` barrel and nothing else, so a subpath key is a surface decision, not a packaging one.`
    );
    return;
  }
  const dot = actual['.'];
  if (dot === null || typeof dot !== 'object') {
    errors.push(
      `EXPORTS-01: ${relPath} exports["."] is ${JSON.stringify(dot)} — it must be a conditional map ` +
        `carrying an \`import\` and a \`require\` branch.`
    );
    return;
  }
  // First-match-wins applies across SIBLINGS too, not just within a branch. An
  // unconditional `types` here is matched by both module modes before either
  // nested branch is reached, which resolves one declaration for CJS and ESM
  // alike — the precise TS1479 shape the nested branches replace. Checking the
  // branches without checking what sits beside them would let the gate pass the
  // very manifest it exists to reject.
  const unexpected = Object.keys(dot).filter(condition => !(condition in EXPECTED_EXPORTS['.']));
  if (unexpected.length > 0) {
    errors.push(
      `EXPORTS-01: ${relPath} exports["."] carries ${JSON.stringify(unexpected)} alongside the ` +
        `per-mode branches. Condition matching is first-match-wins across siblings, so a top-level ` +
        `\`types\` resolves one declaration for BOTH module modes and reintroduces TS1479.`
    );
  }
  for (const [mode, expected] of Object.entries(EXPECTED_EXPORTS['.'])) {
    const branch = dot[mode];
    if (branch === undefined || typeof branch !== 'object') {
      errors.push(
        `EXPORTS-01: ${relPath} exports["."].${mode} is ${JSON.stringify(branch)} — it must be a ` +
          `nested branch { "types": ${JSON.stringify(expected.types)}, "default": ${JSON.stringify(expected.default)} }. ` +
          `A flat map resolves one declaration for both module modes, which leaves the other mode untyped.`
      );
      continue;
    }
    const order = Object.keys(branch);
    if (order[0] !== 'types') {
      errors.push(
        `EXPORTS-01: ${relPath} exports["."].${mode} lists ${JSON.stringify(order[0])} before "types" — ` +
          `condition matching is first-match-wins, so the declaration is never consulted.`
      );
    }
    for (const condition of ['types', 'default']) {
      if (branch[condition] !== expected[condition]) {
        errors.push(
          `EXPORTS-01: ${relPath} exports["."].${mode}.${condition} is ${JSON.stringify(branch[condition])}, ` +
            `expected ${JSON.stringify(expected[condition])}.`
        );
      }
    }
  }
}

function checkTargetsExist(dir, relPath, json, errors, skipped) {
  if (!existsSync(join(dir, 'dist'))) {
    skipped.push(relPath);
    return;
  }
  const targets = new Set([json.main, json.module, json.types]);
  for (const branch of Object.values(json.exports?.['.'] ?? {})) {
    if (branch && typeof branch === 'object') for (const target of Object.values(branch)) targets.add(target);
  }
  for (const target of targets) {
    if (typeof target !== 'string') continue;
    if (existsSync(resolve(dir, target))) continue;
    errors.push(
      `EXPORTS-02: ${relPath} points at ${target}, which the build does not emit. ` +
        `A dangling declaration pointer leaves consumers untyped without failing the build.`
    );
  }
}

const errors = [];
const skipped = [];
let checked = 0;

for (const dirName of readdirSync(packagesDir).sort()) {
  const dir = join(packagesDir, dirName);
  const manifest = readManifest(dir);
  if (!manifest || !isPublished(manifest.json)) continue;
  const relPath = manifest.path.slice(repoRoot.length + 1);
  checked += 1;
  checkLicense(relPath, manifest.json, errors);
  checkExportsShape(relPath, manifest.json, errors);
  checkTargetsExist(dir, relPath, manifest.json, errors, skipped);
}

if (requireDist && skipped.length > 0) {
  errors.push(
    `EXPORTS-02: --require-dist was passed but ${skipped.length} package(s) have no dist/ to resolve ` +
      `against: ${skipped.join(', ')}. Run \`pnpm run build:packages\` from the repo root first.`
  );
}

if (errors.length > 0) {
  console.error(`[package-manifests] ${errors.length} problem(s):`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

const skipNote =
  skipped.length > 0 ? ` (EXPORTS-02 skipped for ${skipped.length} unbuilt package(s): ${skipped.join(', ')})` : '';
process.stdout.write(
  `[package-manifests] OK — ${checked} published package(s) declare MIT and resolve types per module mode.${skipNote}\n`
);
