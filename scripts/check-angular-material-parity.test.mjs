// Unit tests for the Angular Material per-major parity gate. Run with
// `node --test`.
//
// The point of these is DETECTION: a gate that only ever runs against an
// already-reconciled tree proves it executes, not that it can still see the
// defect it exists to catch. So this reproduces the shape of the real bug —
// a fix landed on one major and not the others — as a synthetic fixture,
// alongside the false-positive traps (a legitimate per-major divergence
// mentioning another major by number, and a denylisted file) that made the
// real denylist non-obvious while writing this gate.
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

import { evaluate, gatherGroupFacts, normalize, normalizeAcrossMajors } from './check-angular-material-parity.mjs';

/** Build one group's `files` map from `{relPath: {major: content|null}}`. */
function filesMap(entries) {
  const files = new Map();
  for (const [relPath, byMajor] of Object.entries(entries)) {
    files.set(relPath, new Map(Object.entries(byMajor)));
  }
  return files;
}

function group(overrides = {}) {
  return {
    label: 'test-group',
    majors: ['20', '21', '22'],
    files: filesMap({}),
    ...overrides,
  };
}

const codesOf = errors => errors.map(error => error.match(/^PARITY-\d\d/)?.[0]);

test('three identical files across three majors produce no findings', () => {
  const g = group({
    files: filesMap({
      'src/components/FooDriver.ts': {
        20: 'export class Foo {}',
        21: 'export class Foo {}',
        22: 'export class Foo {}',
      },
    }),
  });

  assert.deepEqual(evaluate([g]), []);
});

test('PARITY-02: a fix landed on one major and not the others', () => {
  // The real shape of the bug this gate exists for: v21 gets the fix,
  // v20/v22 keep the old body. v20 and v22 still agree with each other, so
  // only the odd one out — v21 — is named; comparison is against the first
  // listed major, not every pair, which is enough to point at the drift.
  const g = group({
    files: filesMap({
      'src/components/CheckboxDriver.ts': {
        20: 'return getAttribute(...) === "mixed";',
        21: 'return exists(indeterminateLocator);',
        22: 'return getAttribute(...) === "mixed";',
      },
    }),
  });

  const errors = evaluate([g]);
  assert.deepEqual(codesOf(errors), ['PARITY-02']);
  assert.ok(errors[0].includes('v20 and v21'));
});

test('PARITY-01: a file exists for some majors and not others', () => {
  const g = group({
    files: filesMap({
      'src/components/NewDriver.ts': { 20: null, 21: 'export class New {}', 22: null },
    }),
  });

  const errors = evaluate([g]);
  assert.deepEqual(codesOf(errors), ['PARITY-01']);
  assert.match(errors[0], /exists for v21 but is missing for v20, v22/);
});

test('a file already reconciled produces nothing, alongside one that still differs', () => {
  const g = group({
    files: filesMap({
      'src/components/AlreadyFixed.ts': { 20: 'ok', 21: 'ok', 22: 'ok' },
      'src/components/StillBroken.ts': { 20: 'old', 21: 'new', 22: 'old' },
    }),
  });

  const errors = evaluate([g]);
  assert.equal(errors.length, 1);
  assert.ok(errors[0].includes('StillBroken.ts'));
});

test('normalize collapses a file-local version token to a shared placeholder', () => {
  const text =
    'export class AngularMaterialV20CheckboxDriver {} // v20-only\nimport x from "@atomic-testing/angular-20"';
  assert.equal(
    normalize(text, '20'),
    'export class AngularMaterialVXXCheckboxDriver {} // vXX-only\nimport x from "@atomic-testing/angular-XX"'
  );
});

test('false-positive trap: prose naming ANOTHER major is not collapsed by normalize', () => {
  // This is the real failure mode `crossMajorNormalize` exists to name: a
  // comment on the v20 copy saying "... vs v21/v22" mentions v21 and v22
  // literally, so normalizing only the v20 file's OWN token ('20') leaves
  // "v21/v22" untouched — a genuine, expected difference from the v21 copy's
  // "v20/vXX", not drift. evaluate() has no way to know this on its own; see
  // the `gatherGroupFacts` tests below for the mechanism that resolves it
  // while still comparing everything else in the same file.
  const prose = 'overlay strategy differs: container on v20, native popover on v21/v22';

  // Two majors are enough to show the trap: each file states the SAME fact,
  // but normalize() only ever touches its own major's token, so "v20" stays
  // literal in the v21 copy and "v21" stays literal in the v20 copy.
  const g = group({
    majors: ['20', '21'],
    files: filesMap({
      'src/components/SelectDriver.ts': { 20: normalize(prose, '20'), 21: normalize(prose, '21') },
    }),
  });

  const errors = evaluate([g]);
  // Confirms the trap fires when normalized only by own major -- evaluate()
  // has no way to know the two copies are actually saying the same thing.
  assert.deepEqual(codesOf(errors), ['PARITY-02']);
});

test('normalizeAcrossMajors collapses the same false-positive trap', () => {
  const prose = 'overlay strategy differs: container on v20, native popover on v21/v22';
  assert.equal(normalizeAcrossMajors(prose, ['20', '21', '22']), normalizeAcrossMajors(prose, ['20', '21', '22']));

  const g = group({
    majors: ['20', '21'],
    files: filesMap({
      'src/components/SelectDriver.ts': {
        20: normalizeAcrossMajors(prose, ['20', '21']),
        21: normalizeAcrossMajors(prose, ['20', '21']),
      },
    }),
  });

  // Both copies collapse to the same text once every major's token is
  // replaced, not just the file's own -- the trap above no longer fires.
  assert.deepEqual(evaluate([g]), []);
});

test('normalizeAcrossMajors still lets a real difference through', () => {
  // Broadening the token replacement must not blind the gate to actual code
  // divergence in the same file -- only the major-number prose collapses.
  const a = normalizeAcrossMajors('return getAttribute(...) === "mixed"; // v20 vs v21/v22', ['20', '21']);
  const b = normalizeAcrossMajors('return exists(indeterminateLocator); // v20 vs v21/v22', ['20', '21']);
  assert.notEqual(a, b);
});

test('multiple groups are evaluated independently', () => {
  const clean = group({ label: 'clean-group', files: filesMap({ 'a.ts': { 20: 'x', 21: 'x', 22: 'x' } }) });
  const broken = group({ label: 'broken-group', files: filesMap({ 'b.ts': { 20: 'x', 21: 'y', 22: 'x' } }) });

  const errors = evaluate([clean, broken]);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /\[broken-group\]/);
});

// --- gatherGroupFacts: the filesystem half, against real (throwaway) fixture
// directories rather than facts assembled by hand. This is what proves the
// denylist / crossMajorNormalize filtering itself works -- the tests above
// only prove evaluate() can react correctly to facts however they were
// gathered.

/** A fixture root with one directory per major, cleaned up by the caller. */
function withFixtureDirs(majors, writeFn) {
  const root = mkdtempSync(join(tmpdir(), 'angular-material-parity-'));
  try {
    const variants = majors.map(major => {
      const dir = join(root, `pkg-v${major}`);
      mkdirSync(dir, { recursive: true });
      return { major, dir };
    });
    writeFn(variants);
    return { root, variants };
  } catch (error) {
    rmSync(root, { recursive: true, force: true });
    throw error;
  }
}

test('gatherGroupFacts skips a denylisted path but still compares its neighbor', () => {
  const { root, variants } = withFixtureDirs(['20', '21'], vs => {
    for (const { major, dir } of vs) {
      // Denylisted: allowed to diverge freely, e.g. per-major dependency pins.
      writeFileSync(join(dir, 'package.json'), `{"name": "pkg-v${major}", "dependencies": {"angular-${major}": "*"}}`);
      // Neighboring, non-denylisted file: a fix landed on v21 only.
      writeFileSync(join(dir, 'Driver.ts'), major === '21' ? 'return exists(loc);' : 'return getAttribute(loc);');
    }
  });

  try {
    const facts = gatherGroupFacts({ label: 'fixture-group', variants, denylist: new Set(['package.json']) });
    const errors = evaluate([facts]);

    assert.deepEqual(codesOf(errors), ['PARITY-02']);
    assert.ok(errors[0].includes('Driver.ts'));
    assert.ok(!errors.some(e => e.includes('package.json')));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('gatherGroupFacts still catches a PARITY-01 missing file alongside a denylisted one', () => {
  const { root, variants } = withFixtureDirs(['20', '21'], vs => {
    for (const { major, dir } of vs) {
      writeFileSync(join(dir, 'package.json'), `{"name": "pkg-v${major}"}`);
    }
    // Only the v21 fixture gets the new file.
    writeFileSync(join(vs[1].dir, 'NewDriver.ts'), 'export class New {}');
  });

  try {
    const facts = gatherGroupFacts({ label: 'fixture-group', variants, denylist: new Set(['package.json']) });
    const errors = evaluate([facts]);

    assert.deepEqual(codesOf(errors), ['PARITY-01']);
    assert.match(errors[0], /NewDriver\.ts.*exists for v21 but is missing for v20/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('gatherGroupFacts applies crossMajorNormalize only to the listed path', () => {
  const prose = '// overlay strategy differs: container on v20, native popover on v21';
  const { root, variants } = withFixtureDirs(['20', '21'], vs => {
    for (const { dir } of vs) {
      // Listed: the sibling-major prose collapses, so this stays clean.
      writeFileSync(join(dir, 'SelectDriver.ts'), `${prose}\nexport class Select {}`);
      // NOT listed: the same kind of prose here is real, unexplained drift.
      writeFileSync(join(dir, 'Unrelated.ts'), prose);
    }
  });

  try {
    const facts = gatherGroupFacts({
      label: 'fixture-group',
      variants,
      denylist: new Set(),
      crossMajorNormalize: new Set(['SelectDriver.ts']),
    });
    const errors = evaluate([facts]);

    assert.deepEqual(codesOf(errors), ['PARITY-02']);
    assert.ok(errors[0].includes('Unrelated.ts'));
    assert.ok(!errors.some(e => e.includes('SelectDriver.ts')));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('gatherGroupFacts with crossMajorNormalize still catches real divergence in that file', () => {
  const { root, variants } = withFixtureDirs(['20', '21'], vs => {
    for (const { major, dir } of vs) {
      const body = major === '21' ? 'return exists(indeterminateLocator);' : 'return getAttribute(...) === "mixed";';
      writeFileSync(join(dir, 'SelectDriver.ts'), `// v20 vs v21 overlay note\n${body}`);
    }
  });

  try {
    const facts = gatherGroupFacts({
      label: 'fixture-group',
      variants,
      denylist: new Set(),
      crossMajorNormalize: new Set(['SelectDriver.ts']),
    });
    const errors = evaluate([facts]);

    // The prose collapses; the real code difference underneath does not.
    assert.deepEqual(codesOf(errors), ['PARITY-02']);
    assert.ok(errors[0].includes('SelectDriver.ts'));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
