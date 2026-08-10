// Unit tests for the release-version guard. Run with `node --test`.
//
// This guard is the only thing between a dispatch-box typo and 38 rewritten
// manifests plus a published tag, so every rule gets a fixture that makes it
// FIRE — and the precedence cases get the ones a naive comparator gets wrong.
// The implementation it replaced used `sort -V`, which passes casual inspection
// and ranks `1.0.0-alpha.1` above `1.0.0`.
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { compareSemver, parseSemver, validateReleaseVersion } from './assert-release-version.mjs';

const TAGS = ['v0.100.0', 'v0.101.0', 'v0.102.0'];

/** A releasable request, with `overrides` applied on top. */
const request = (overrides = {}) => ({
  requested: '0.103.0',
  current: '0.102.0',
  existingTags: TAGS,
  ...overrides,
});

const codesOf = errors => errors.map(error => error.slice(0, 9));

test('a well-formed next version is accepted', () => {
  assert.deepEqual(validateReleaseVersion(request()), []);
  assert.deepEqual(validateReleaseVersion(request({ requested: 'v0.103.0' })), []);
  assert.deepEqual(validateReleaseVersion(request({ requested: '  0.103.0  ' })), []);
});

test('RELVER-01 rejects anything that is not a bare semver version', () => {
  for (const bad of ['0.103', 'latest', '', '0.103.0; rm -rf /', 'v', '1.2.3.4', '1.2.3+build.5', null]) {
    const errors = validateReleaseVersion(request({ requested: bad }));
    assert.deepEqual(codesOf(errors), ['RELVER-01'], `expected ${JSON.stringify(bad)} to be rejected`);
  }
});

test('RELVER-01 short-circuits so an unreadable version invents no further findings', () => {
  // Reporting a precedence failure against a string we could not parse would be
  // a fabricated second reason for the same defect.
  assert.deepEqual(codesOf(validateReleaseVersion(request({ requested: 'nonsense' }))), ['RELVER-01']);
});

test('RELVER-02 fires when the tag already exists', () => {
  const errors = validateReleaseVersion(request({ requested: '0.101.0' }));

  assert.ok(errors.some(error => error.startsWith('RELVER-02')));
  assert.match(errors[0], /v0\.101\.0 already exists/);
});

test('RELVER-03 fires on the current version and on going backwards', () => {
  assert.deepEqual(codesOf(validateReleaseVersion(request({ requested: '0.102.0', existingTags: [] }))), ['RELVER-03']);
  assert.match(validateReleaseVersion(request({ requested: '0.102.0', existingTags: [] }))[0], /nothing to bump/);

  const backwards = validateReleaseVersion(request({ requested: '0.9.0', existingTags: [] }));
  assert.deepEqual(codesOf(backwards), ['RELVER-03']);
  assert.match(backwards[0], /lower precedence/);
});

test('a prerelease may be promoted to its release — the case sort -V gets backwards', () => {
  // GNU `sort -V` ranks 1.0.0-rc.1 ABOVE 1.0.0, so the previous implementation
  // would have refused this exact promotion. SemVer §11 says a prerelease has
  // lower precedence than its release.
  assert.deepEqual(validateReleaseVersion(request({ requested: '1.0.0', current: '1.0.0-rc.1' })), []);

  // And the reverse must still be refused.
  assert.deepEqual(codesOf(validateReleaseVersion(request({ requested: '1.0.0-rc.1', current: '1.0.0' }))), [
    'RELVER-03',
  ]);
});

test('compareSemver implements SemVer §11 precedence', () => {
  const ordered = [
    '1.0.0-alpha',
    '1.0.0-alpha.1',
    '1.0.0-alpha.beta',
    '1.0.0-beta',
    '1.0.0-beta.2',
    '1.0.0-beta.11',
    '1.0.0-rc.1',
    '1.0.0',
  ];
  for (let index = 0; index < ordered.length - 1; index++) {
    assert.equal(
      Math.sign(compareSemver(ordered[index], ordered[index + 1])),
      -1,
      `${ordered[index]} should precede ${ordered[index + 1]}`
    );
  }

  // Numeric identifiers compare numerically, not lexically — `beta.11` after
  // `beta.2` is the canonical case a string sort gets wrong.
  assert.equal(Math.sign(compareSemver('1.0.0-beta.11', '1.0.0-beta.2')), 1);
  // Release components dominate.
  assert.equal(Math.sign(compareSemver('0.102.0', '0.9.0')), 1);
  assert.equal(compareSemver('0.102.0', '0.102.0'), 0);
});

test('compareSemver throws rather than inventing an order for junk', () => {
  assert.throws(() => compareSemver('1.0', '1.0.0'), /Cannot compare/);
});

test('parseSemver splits release and prerelease, and rejects build metadata', () => {
  assert.deepEqual(parseSemver('1.2.3'), { release: [1, 2, 3], prerelease: null });
  assert.deepEqual(parseSemver('1.2.3-alpha-1.2'), { release: [1, 2, 3], prerelease: ['alpha-1', '2'] });
  assert.equal(parseSemver('1.2.3+build.5'), null);
  assert.equal(parseSemver('v1.2.3'), null); // the leading v is stripped by the caller, not here
});
