#!/usr/bin/env node
// Dependency-major-pinning gate (DEP-PIN-*). Fails CI when a package that is
// intentionally scoped to one major version of a third-party dependency — its
// own directory name says so, e.g. `angular-20`, `component-driver-mui-x-v6` —
// has that dependency pinned to a different major in its package.json.
//
// This is the backstop for the bug class behind PR #1132 (`@angular/core`
// bumped 20→22 in the angular-20/angular-21 packages) and PR #1134
// (`@mui/x-data-grid-generator` bumped 6/7/8→9 in the mui-x-v6/v7/v8 test
// packages). `.github/dependabot.yml` `ignore` rules are necessary but proved
// NOT sufficient: mui-x-v6/v7/v8-test already had ignore rules capping
// `@mui/x-*` below the next major, and PR #1134 bumped past them anyway —
// consistent with a known pnpm/npm-workspace limitation where an update
// originating from an unguarded sibling directory (here, `mui-x-v9-test`,
// which had no dependabot.yml entry at all) rewrites other manifests to keep
// the one shared lockfile consistent, without re-checking their ignore lists.
// So this check verifies the committed manifest directly — it doesn't trust
// Dependabot config to have worked.
//
// DEP-PIN-01  a package's own major-version suffix (or documented exception)
//             doesn't match one of its pinned dependencies' majors
//
// Dependency-free Node ESM, modelled on scripts/skills/check-skill-sync.mjs.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const packagesDir = resolve(repoRoot, 'packages');
const packageTestsDir = resolve(repoRoot, 'package-tests');

// A directory whose (test-suffix-stripped) name matches `pattern` is expected
// to pin every name in `deps` (or every dependency whose name starts with
// `depPrefix`) to the major captured by the pattern's group. A future package
// within an EXISTING family (e.g. a `component-driver-mui-x-v10`) is covered
// automatically — nothing to update here. A genuinely NEW family needs one
// line added, same as registering a new DesignSystemPlugin in
// create-atomic-testing/src/registry/designSystems.ts.
const FAMILIES = [
  {
    pattern: /^angular-(\d+)$/,
    deps: ['@angular/core', '@angular/common', '@angular/compiler', '@angular/platform-browser'],
  },
  {
    pattern: /^component-driver-angular-material-v(\d+)$/,
    deps: [
      '@angular/core',
      '@angular/cdk',
      '@angular/material',
      '@angular/common',
      '@angular/compiler',
      '@angular/forms',
      '@angular/platform-browser',
    ],
  },
  { pattern: /^component-driver-mui-v(\d+)$/, deps: ['@mui/material', '@mui/icons-material'] },
  { pattern: /^component-driver-mui-x-v(\d+)$/, depPrefix: '@mui/x-' },
  { pattern: /^component-driver-primevue-v(\d+)$/, deps: ['primevue'] },
  { pattern: /^component-driver-radix-v(\d+)$/, deps: ['radix-ui', 'cmdk'] },
  { pattern: /^component-driver-reka-ui-v(\d+)$/, deps: ['reka-ui'] },
  { pattern: /^component-driver-fluent-v(\d+)$/, deps: ['@fluentui/react-components'] },
  { pattern: /^react-(\d+)$/, deps: ['react', 'react-dom', '@types/react', '@types/react-dom'] },
  { pattern: /^vue-(\d+)$/, deps: ['vue', '@vue/compiler-sfc', '@vue/compiler-dom', '@vue/server-renderer'] },
];

// `package-tests/*-test` directories that dropped their driver's version
// suffix in their own name — resolved to the packages/ name FAMILIES expects.
const TEST_DIR_ALIASES = {
  'component-driver-primevue-test': 'component-driver-primevue-v4',
  'component-driver-radix-test': 'component-driver-radix-v1',
  'component-driver-reka-ui-test': 'component-driver-reka-ui-v2',
};

// Directories with no numeric suffix at all, so there's nothing for a pattern
// to capture — the expected major(s) are asserted directly. Keep this list
// short: it's for genuinely name-less singletons, not a substitute for FAMILIES.
const EXPLICIT = {
  // Legacy React support spans two majors by design (peerDep `^16 || ^17`), so
  // either pinned major is acceptable — only a jump to 18+ is a real mistake.
  'react-legacy': {
    deps: ['react', 'react-dom', '@types/react', '@types/react-dom'],
    allowedMajors: [16, 17],
  },
  // The shared AngularInteractor's dev/test harness is deliberately pinned to
  // the OLDEST Angular major this repo still supports (today: 20), so shared
  // code is proven against the floor, not just the newest major. Update this
  // if the oldest supported Angular major changes.
  'angular-core': {
    deps: ['@angular/core', '@angular/common', '@angular/compiler', '@angular/platform-browser'],
    allowedMajors: [20],
  },
  // CLAUDE.md: "packages/storybook ... (Storybook 10)". Scoped to exactly
  // these two directories — vue-3-test also depends on `storybook`, but at a
  // deliberately different, unrelated major for its own Storybook stories, so
  // it is intentionally NOT covered by this rule.
  storybook: { deps: ['storybook'], allowedMajors: [10] },
  'storybook-test': { deps: ['storybook'], allowedMajors: [10] },
};

function readManifest(dir) {
  const path = join(dir, 'package.json');
  if (!existsSync(path)) return null;
  try {
    return { path, json: JSON.parse(readFileSync(path, 'utf8')) };
  } catch {
    return null;
  }
}

// Concrete `dependencies`/`devDependencies` pins only — peerDependencies are
// intentionally open floors (e.g. `>=18.0.0`) and Dependabot doesn't bump them.
function concreteDeps(json) {
  return { ...(json.dependencies ?? {}), ...(json.devDependencies ?? {}) };
}

// Extract the major from a simple concrete range like `^20.3.0`, `~9.0.0`,
// `9.0.0`. Returns null for anything else (compound ranges never appear as
// concrete dependency/devDependency pins in this repo; if that ever changes,
// this fails safe by skipping the entry rather than crashing).
function majorOf(range) {
  const match = /^[\^~]?(\d+)\./.exec(range.trim());
  return match ? Number(match[1]) : null;
}

function ruleFor(dirName) {
  if (EXPLICIT[dirName]) return EXPLICIT[dirName];
  const base = TEST_DIR_ALIASES[dirName] ?? dirName.replace(/-test$/, '');
  for (const family of FAMILIES) {
    const match = family.pattern.exec(base);
    if (match) return { ...family, allowedMajors: [Number(match[1])] };
  }
  return null;
}

function checkDir(dir, dirName, errors) {
  const rule = ruleFor(dirName);
  if (!rule) return;
  const manifest = readManifest(dir);
  if (!manifest) return;
  const deps = concreteDeps(manifest.json);
  const names = rule.depPrefix ? Object.keys(deps).filter(n => n.startsWith(rule.depPrefix)) : rule.deps.filter(n => n in deps);
  for (const name of names) {
    const major = majorOf(deps[name]);
    if (major == null) continue;
    if (!rule.allowedMajors.includes(major)) {
      const relPath = manifest.path.slice(repoRoot.length + 1);
      errors.push(
        `DEP-PIN-01: ${relPath} pins ${name} at ${deps[name]} (major ${major}), but ` +
          `this package is scoped to major ${rule.allowedMajors.join(' or ')} — did a ` +
          `dependency-update PR bump it past an intentional major-version boundary?`
      );
    }
  }
}

const errors = [];
for (const root of [packagesDir, packageTestsDir]) {
  for (const dirName of readdirSync(root)) {
    checkDir(join(root, dirName), dirName, errors);
  }
}

if (errors.length > 0) {
  console.error(`[deps-pinning] ${errors.length} problem(s):`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

process.stdout.write('[deps-pinning] OK — every major-version-scoped package matches its own pin.\n');
