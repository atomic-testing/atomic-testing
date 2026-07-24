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
// Confirmed live again in the PRs opened after #1150 merged: #1195
// (@angular/core 20/21/22 -> 22.0.8, same mechanism as #1132), #1187
// (@mui/x-date-pickers 6/7/8 -> 9.10.0 in mui-x-v6/v7/v8-test, same mechanism
// as #1134 but a different @mui/x-* member), #1238/#1237/#1235/#1233
// (vue-3-test's OWN independent Storybook-v8 toolchain bumped 8 -> 10), and
// #1221/#1218 (a same-shape but opposite-direction case: @mui/icons-material
// and @mui/material proposed DOWN from major 9 to major 5 in mui-x-v9-test).
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
  {
    pattern: /^component-driver-mui-x-v(\d+)$/,
    depPrefix: '@mui/x-',
    // MUI-X's own major does not track @mui/material's major 1:1 (MUI
    // unified numbering at v9) — this is the pairing the real mui-x-vN-test
    // fixtures actually use. Confirmed live by PR #1221/#1218, which proposed
    // DOWNGRADING @mui/material/@mui/icons-material from major 9 to major 5
    // in mui-x-v9-test; that pin is untracked without this table (mui-x-v6's
    // own pairing uses a compound `>=5.0.0 <6.0.0` range that majorOf() can't
    // parse anyway, so it's intentionally absent here — nothing to check).
    pairedMaterialMajor: { 7: 6, 8: 7, 9: 9 },
  },
  // primevue itself tracks the vNN suffix; @primeuix/themes is a separate
  // theming package that does NOT share primevue's major (primevue v4 pairs
  // with @primeuix/themes v2 today) — that pairing is asserted via EXTRA_RULES
  // below, not here, since it can't be derived from this pattern's capture.
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
// to capture — the expected major(s) are asserted directly, REPLACING any
// FAMILIES match for that exact directory name. Keep this list short: it's
// for genuinely name-less singletons, not a substitute for FAMILIES.
const EXPLICIT = {
  // Legacy React support spans two majors by design (peerDep `^16 || ^17`), so
  // either pinned major is acceptable — only a jump to 18+ is a real mistake.
  'react-legacy': [
    {
      deps: ['react', 'react-dom', '@types/react', '@types/react-dom'],
      allowedMajors: [16, 17],
    },
  ],
  // The shared AngularInteractor's dev/test harness is deliberately pinned to
  // the OLDEST Angular major this repo still supports (today: 20), so shared
  // code is proven against the floor, not just the newest major. Update this
  // if the oldest supported Angular major changes.
  'angular-core': [
    {
      deps: ['@angular/core', '@angular/common', '@angular/compiler', '@angular/platform-browser'],
      allowedMajors: [20],
    },
  ],
  // CLAUDE.md: "packages/storybook ... (Storybook 10)". Scoped to exactly
  // these two directories — vue-3-test also depends on `storybook`, but at a
  // deliberately different, unrelated major (see EXTRA_RULES), so it is
  // intentionally NOT covered by this rule.
  storybook: [{ deps: ['storybook'], allowedMajors: [10] }],
  'storybook-test': [{ deps: ['storybook'], allowedMajors: [10] }],
};

// Extra rules layered ON TOP of whatever FAMILIES already matches for a
// directory — for a package that is independently pinned to a SECOND major
// beyond the one FAMILIES derives from its own name. Found via PR #1227
// (@primeuix/themes bumped 2->3 in the primevue-v4 test fixture — a companion
// theming package that does not share primevue's own major) and PR
// #1238/#1237/#1235/#1233 (vue-3-test's OWN Storybook toolchain, independent
// of and pinned two majors behind packages/storybook's target).
const EXTRA_RULES = {
  'component-driver-primevue-v4': [{ deps: ['@primeuix/themes'], allowedMajors: [2] }],
  'component-driver-primevue-test': [{ deps: ['@primeuix/themes'], allowedMajors: [2] }],
  'vue-3-test': [
    {
      deps: [
        'storybook',
        '@storybook/vue3',
        '@storybook/vue3-vite',
        '@storybook/addon-themes',
        '@storybook/addon-essentials',
        '@storybook/test',
      ],
      allowedMajors: [8],
    },
  ],
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

// Concrete pins only. Most peerDependencies are intentionally open floors
// (e.g. `react: >=18.0.0`) that majorOf() already skips, but some packages
// (e.g. component-driver-fluent-v9's `@fluentui/react-components`,
// component-driver-radix-v1's `radix-ui`/`cmdk`) pin their scoped third-party
// dependency with a concrete caret range in peerDependencies alone — so those
// need checking too, not just dependencies/devDependencies.
function concreteDeps(json) {
  return { ...(json.dependencies ?? {}), ...(json.devDependencies ?? {}), ...(json.peerDependencies ?? {}) };
}

// Extract the major from a simple concrete range like `^20.3.0`, `~9.0.0`,
// `9.0.0`. Returns null for anything else (compound ranges never appear as
// concrete dependency/devDependency pins in this repo; if that ever changes,
// this fails safe by skipping the entry rather than crashing).
function majorOf(range) {
  const match = /^[\^~]?(\d+)\./.exec(range.trim());
  return match ? Number(match[1]) : null;
}

function rulesFor(dirName) {
  if (EXPLICIT[dirName]) return [...EXPLICIT[dirName], ...(EXTRA_RULES[dirName] ?? [])];
  const base = TEST_DIR_ALIASES[dirName] ?? dirName.replace(/-test$/, '');
  const rules = [];
  for (const family of FAMILIES) {
    const match = family.pattern.exec(base);
    if (!match) continue;
    const major = Number(match[1]);
    rules.push({ deps: family.deps, depPrefix: family.depPrefix, allowedMajors: [major] });
    if (family.pairedMaterialMajor?.[major] != null) {
      rules.push({
        deps: ['@mui/material', '@mui/icons-material'],
        allowedMajors: [family.pairedMaterialMajor[major]],
      });
    }
  }
  rules.push(...(EXTRA_RULES[dirName] ?? []));
  return rules;
}

function checkDir(dir, dirName, errors) {
  const rules = rulesFor(dirName);
  if (rules.length === 0) return;
  const manifest = readManifest(dir);
  if (!manifest) return;
  const deps = concreteDeps(manifest.json);
  for (const rule of rules) {
    const names = rule.depPrefix
      ? Object.keys(deps).filter(n => n.startsWith(rule.depPrefix))
      : rule.deps.filter(n => n in deps);
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
