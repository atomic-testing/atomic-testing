// Unit tests for the release-version guard. Run with `node --test`.
//
// This guard is the only thing between a dispatch-box typo and 38 rewritten
// manifests plus a published tag, so every rule gets a fixture that makes it
// FIRE — and, where a rule can be deleted without any existing fixture noticing,
// a fixture that DISCRIMINATES. Several assertions below exist because the
// obvious test for them passes against a mutant:
//
//   - the SemVer §11 canonical chain stays correctly ordered with rule 3
//     (numeric ranks below non-numeric) deleted, because ASCII digits happen to
//     sort below letters. Only `2` vs `1a` separates them.
//   - a padded-input fixture asserting acceptance does not pin the trim, because
//     parseSemver trims again independently. Only RELVER-02's tag lookup — the
//     one consumer of the un-reparsed string — can see it.
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { compareSemver, normalizeVersion, parseSemver, validateReleaseVersion } from './assert-release-version.mjs';

const TAGS = ['v0.100.0', 'v0.101.0', 'v0.102.0'];

/** A releasable request, with `overrides` applied on top. */
const request = (overrides = {}) => ({
  requested: '0.103.0',
  current: '0.102.0',
  existingTags: TAGS,
  ...overrides,
});

const codesOf = ({ errors }) => errors.map(error => error.slice(0, 9));

test('a well-formed next version is accepted, and comes back normalised', () => {
  for (const requested of ['0.103.0', 'v0.103.0', '  0.103.0  ', '  v0.103.0 ']) {
    const result = validateReleaseVersion(request({ requested }));
    assert.deepEqual(result.errors, [], `expected ${JSON.stringify(requested)} to be accepted`);
    // The normalised value is what release.yml carries forward into bumpVersion
    // and the tag name, so it is asserted rather than assumed.
    assert.equal(result.version, '0.103.0');
    assert.equal(result.mode, 'fresh');
  }
});

test('RELVER-01 rejects anything that is not a valid semver version', () => {
  const invalid = [
    '0.103',
    'latest',
    '',
    '0.103.0; rm -rf /',
    'v',
    '1.2.3.4',
    '1.2.3+build.5',
    null,
    // Leading zeros — SemVer §2 and §9. These are the dangerous ones: they look
    // like ordinary typos, and every gate downstream is string equality, so npm
    // would be the first thing to reject them, with main already rewritten.
    '0.0103.0',
    '0.103.00',
    '01.103.0',
    '1.0.0-rc.01',
    // Empty prerelease identifiers — SemVer §9.
    '1.0.0-',
    '1.0.0-.',
    '1.0.0-rc..1',
  ];
  for (const bad of invalid) {
    assert.deepEqual(
      codesOf(validateReleaseVersion(request({ requested: bad }))),
      ['RELVER-01'],
      `expected ${JSON.stringify(bad)} to be rejected`
    );
  }
});

test('RELVER-01 quotes what the operator actually typed', () => {
  // Reporting the post-`v`-strip form would answer `version1.2.3` with
  // `"ersion1.2.3"`, a string that appears nowhere in the operator's input.
  const { errors } = validateReleaseVersion(request({ requested: 'version1.2.3' }));
  assert.match(errors[0], /"version1\.2\.3"/);
});

test('RELVER-01 short-circuits so an unreadable version invents no further findings', () => {
  assert.deepEqual(codesOf(validateReleaseVersion(request({ requested: 'nonsense' }))), ['RELVER-01']);
});

test('RELVER-02 fires when the tag already exists', () => {
  const result = validateReleaseVersion(request({ requested: '0.101.0' }));

  assert.ok(result.errors.some(error => error.startsWith('RELVER-02')));
  assert.match(result.errors[0], /v0\.101\.0 already exists/);
});

test('RELVER-02 still fires on a padded input — the case the trim actually guards', () => {
  // If normalisation were dropped from validateReleaseVersion, RELVER-01 and
  // RELVER-03 would still pass (both re-parse, and parseSemver trims), while the
  // tag lookup would build the key `v  0.101.0  ` and match nothing — silently
  // approving the re-release of an already-published version. GitHub's dispatch
  // box does not trim, so this input is reachable.
  const result = validateReleaseVersion(request({ requested: '  0.101.0  ' }));

  assert.ok(
    result.errors.some(error => error.startsWith('RELVER-02')),
    'padded input must still reach the tag lookup'
  );
});

test('RELVER-03 fires on going backwards', () => {
  const backwards = validateReleaseVersion(request({ requested: '0.9.0', existingTags: [] }));

  assert.deepEqual(codesOf(backwards), ['RELVER-03']);
  assert.match(backwards.errors[0], /lower precedence/);
});

test('an already-bumped tree with no tag is a resume, not an error', () => {
  // The leftover of a run that pushed the release commit and died before
  // tagging. Treating it as fatal would leave that state finishable only by
  // hand — reintroducing the manual tagging step this change set removes.
  const result = validateReleaseVersion(request({ requested: '0.102.0', current: '0.102.0', existingTags: [] }));

  assert.deepEqual(result.errors, []);
  assert.equal(result.mode, 'resume');
});

test('an already-bumped tree WITH its tag is a re-release, and stays refused', () => {
  const result = validateReleaseVersion(request({ requested: '0.102.0', current: '0.102.0', existingTags: TAGS }));

  assert.deepEqual(codesOf(result), ['RELVER-02']);
  assert.equal(result.mode, 'fresh');
});

test('a prerelease may be promoted to its release — the case sort -V gets backwards', () => {
  // GNU `sort -V` ranks 1.0.0-rc.1 ABOVE 1.0.0, so the previous implementation
  // would have refused this exact promotion. SemVer §11 says a prerelease has
  // lower precedence than its release.
  assert.deepEqual(validateReleaseVersion(request({ requested: '1.0.0', current: '1.0.0-rc.1' })).errors, []);

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

test('§11 rule 3: a numeric identifier ranks below a non-numeric one that sorts lexically lower', () => {
  // The chain above cannot catch a deletion of rule 3 — its only mixed pair is
  // `1` vs `beta`, and digits already sort below letters, so the lexical
  // fallback agrees by accident. Rule 3 only shows itself when the non-numeric
  // identifier begins with a digit or a hyphen.
  assert.equal(Math.sign(compareSemver('1.0.0-2', '1.0.0-1a')), -1);
  assert.equal(Math.sign(compareSemver('1.0.0-rc.2', '1.0.0-rc.1a')), -1);
  assert.equal(Math.sign(compareSemver('1.0.0--a', '1.0.0-2')), 1);
});

test('§11 rule 4: a longer identifier list wins when it is a prefix match', () => {
  assert.equal(Math.sign(compareSemver('1.0.0-alpha', '1.0.0-alpha.1')), -1);
  assert.equal(Math.sign(compareSemver('1.0.0-alpha.1.2', '1.0.0-alpha.1')), 1);
});

test('compareSemver throws rather than inventing an order for junk', () => {
  assert.throws(() => compareSemver('1.0', '1.0.0'), /Cannot compare/);
});

test('parseSemver splits release and prerelease, and rejects what SemVer forbids', () => {
  assert.deepEqual(parseSemver('1.2.3'), { release: ['1', '2', '3'], prerelease: null });
  assert.deepEqual(parseSemver('1.2.3-alpha-1.2'), { release: ['1', '2', '3'], prerelease: ['alpha-1', '2'] });
  assert.deepEqual(parseSemver('0.0.0'), { release: ['0', '0', '0'], prerelease: null });
  assert.equal(parseSemver('1.2.3+build.5'), null);
  assert.equal(parseSemver('01.2.3'), null);
  assert.equal(parseSemver('1.2.3-01'), null);
  assert.equal(parseSemver('v1.2.3'), null); // the leading v is normalizeVersion's job, not this one
});

test('numeric components compare exactly, with no precision ceiling', () => {
  // `Number` collapses anything past 2^53, so a Number-based comparator reports
  // these as equal — which would let RELVER-03 mistake a lower request for a
  // resume and skip regenerating the changelog.
  const big = '9007199254740992';
  const bigger = '9007199254740993';
  assert.equal(Number(big) === Number(bigger), true, 'precondition: Number really does collapse these');
  assert.equal(Math.sign(compareSemver(`${big}.0.0`, `${bigger}.0.0`)), -1);
  assert.equal(Math.sign(compareSemver(`1.0.0-${bigger}`, `1.0.0-${big}`)), 1);

  // And the ordinary cases still hold: no leading zeros means longer == larger.
  assert.equal(Math.sign(compareSemver('0.9.0', '0.10.0')), -1);
  assert.equal(Math.sign(compareSemver('2.0.0', '10.0.0')), -1);
});

test('the release triple is kept as digit strings, not numbers', () => {
  // The representation is load-bearing for the test above; pin it so a
  // "tidy-up" back to Number has to break something visible.
  assert.deepEqual(parseSemver('1.2.3').release, ['1', '2', '3']);
});

test('normalizeVersion is the single normalisation, and is idempotent', () => {
  assert.equal(normalizeVersion('  v1.2.3 '), '1.2.3');
  assert.equal(normalizeVersion(normalizeVersion('  v1.2.3 ')), '1.2.3');
  assert.equal(normalizeVersion(null), '');
  // Only ONE leading `v` is removed, so a genuinely malformed input still fails
  // RELVER-01 rather than being silently repaired into something valid.
  assert.equal(normalizeVersion('vv1.2.3'), 'v1.2.3');
});
