// Unit tests for the lockfile-overrides consistency gate. Run with `node --test`.
//
// The regression case below reintroduces the exact shape PR #1382 shipped:
// package.json keeps its full pnpm.overrides, but pnpm-lock.yaml's overrides
// snapshot has been reset to the two entries pnpm-workspace.yaml's
// (documented-inert) overrides block carries — proving this gate would have
// caught it, with a diagnosis pnpm's own ERR_PNPM_LOCKFILE_CONFIG_MISMATCH
// never gives.
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { evaluate, parseLockfileOverrides, resolvePackageJsonOverrides } from './check-lockfile-overrides.mjs';

const LOCKFILE_PREAMBLE = "lockfileVersion: '9.0'\n\nsettings:\n  autoInstallPeers: true\n\n";
const LOCKFILE_TRAILER = '\npnpmfileChecksum: sha256-abc\n\nimporters:\n\n  .:\n    devDependencies: {}\n';

function lockfileWithOverrides(lines) {
  return `${LOCKFILE_PREAMBLE}overrides:\n${lines.map(line => `  ${line}`).join('\n')}\n${LOCKFILE_TRAILER}`;
}

test('parses quoted and unquoted keys/values out of the overrides block', () => {
  const lockfile = lockfileWithOverrides([
    "js-yaml@3: '>=3.15.0'",
    "'@playwright/test': ^1.62.0",
    "picomatch: '>=2.3.2'",
  ]);
  assert.deepEqual(
    parseLockfileOverrides(lockfile),
    new Map([
      ['js-yaml@3', '>=3.15.0'],
      ['@playwright/test', '^1.62.0'],
      ['picomatch', '>=2.3.2'],
    ])
  );
});

test('returns null when the lockfile has no overrides block at all', () => {
  assert.equal(parseLockfileOverrides(`${LOCKFILE_PREAMBLE.replace('\n\n', '\n')}${LOCKFILE_TRAILER}`), null);
});

test("resolves $name self-references against the manifest's own dependency fields", () => {
  const packageJson = {
    devDependencies: { '@playwright/test': '^1.62.0' },
    pnpm: { overrides: { '@playwright/test': '$@playwright/test', picomatch: '>=2.3.2' } },
  };
  const { resolved, unresolved } = resolvePackageJsonOverrides(packageJson);
  assert.deepEqual(
    resolved,
    new Map([
      ['@playwright/test', '^1.62.0'],
      ['picomatch', '>=2.3.2'],
    ])
  );
  assert.deepEqual(unresolved, []);
});

test('flags a $name reference that resolves to nothing in the manifest', () => {
  const packageJson = { pnpm: { overrides: { foo: '$bar' } } };
  const { unresolved } = resolvePackageJsonOverrides(packageJson);
  assert.equal(unresolved.length, 1);
  assert.match(unresolved[0], /references "bar"/);
});

test('passes when package.json and the lockfile snapshot agree', () => {
  const packageJson = { pnpm: { overrides: { picomatch: '>=2.3.2', 'js-yaml@3': '>=3.15.0' } } };
  const lockfile = lockfileWithOverrides(["picomatch: '>=2.3.2'", "js-yaml@3: '>=3.15.0'"]);
  assert.deepEqual(evaluate(packageJson, lockfile).errors, []);
});

test("PR #1382 regression: lockfile reset to pnpm-workspace.yaml's inert overrides drops every real one", () => {
  const packageJson = {
    pnpm: {
      overrides: {
        picomatch: '>=2.3.2',
        'js-yaml@3': '>=3.15.0',
        'brace-expansion@1': '>=1.1.13',
      },
    },
  };
  // What Dependabot actually committed: only the pnpm-workspace.yaml entries survive.
  const lockfile = lockfileWithOverrides([
    "'@atomic-testing/internal-react-example>react': ^19.2.3",
    "'@atomic-testing/internal-react-example>react-dom': ^19.2.3",
  ]);
  const { errors } = evaluate(packageJson, lockfile);
  assert.equal(errors.length, 5); // 3 missing real overrides + 2 unexpected lockfile-only ones
  assert.ok(errors.some(e => e.includes('picomatch') && e.includes('missing')));
  assert.ok(errors.some(e => e.includes('js-yaml@3') && e.includes('missing')));
  assert.ok(errors.some(e => e.includes('brace-expansion@1') && e.includes('missing')));
  assert.ok(errors.some(e => e.includes('internal-react-example>react')));
});

test('flags a value mismatch even when both sides declare the same key', () => {
  const packageJson = { pnpm: { overrides: { tmp: '>=0.2.6' } } };
  const lockfile = lockfileWithOverrides(["tmp: '>=0.2.5'"]);
  const { errors } = evaluate(packageJson, lockfile);
  assert.equal(errors.length, 1);
  assert.match(errors[0], />=0\.2\.6.*>=0\.2\.5/s);
});
