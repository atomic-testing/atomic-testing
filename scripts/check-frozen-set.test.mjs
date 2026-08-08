// Unit tests for the frozen-set agreement gate. Run with `node --test`.
//
// The point of these is DETECTION. B13 existed because three definitions of the
// frozen set drifted apart while every one of them looked authoritative and
// nothing compared them; a gate that only ever runs against a reconciled tree
// repeats that mistake one level up. So each rule gets a fixture reintroducing
// the drift it was written for, including B13 exactly as filed.
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { evaluate, promisesStability, readMarkedSet } from './check-frozen-set.mjs';

const ALL = ['core', 'dom-core', 'angular-core', 'storybook', 'component-driver-radix-v1'];
const FROZEN = ['core', 'dom-core', 'angular-core', 'storybook'];

/** Facts for a fully reconciled tree, with `overrides` applied on top. */
function facts(overrides = {}) {
  return {
    declared: FROZEN,
    readmeDeclared: FROZEN,
    packageDirs: new Set(ALL),
    hasApiScript: new Set(FROZEN),
    hasApiReport: new Set(FROZEN),
    hasStabilitySection: new Set(FROZEN),
    ...overrides,
  };
}

const codesOf = errors => errors.map(error => error.slice(0, 9));

test('a reconciled tree produces no findings', () => {
  assert.deepEqual(evaluate(facts()), []);
});

test('B13 as filed: the ADR names fewer packages than the gate defends', () => {
  // The real shape — check:api gated angular-core and storybook while ADR-006 §1
  // and the README named neither.
  const errors = evaluate(facts({ declared: ['core', 'dom-core'], readmeDeclared: ['core', 'dom-core'] }));

  // Every derived fact disagrees, and each says so in its own terms.
  assert.ok(errors.some(error => error.startsWith('FROZEN-01') && error.includes('angular-core')));
  assert.ok(errors.some(error => error.startsWith('FROZEN-02') && error.includes('storybook')));
  assert.ok(errors.some(error => error.startsWith('FROZEN-03') && error.includes('storybook')));
});

test('FROZEN-01 fires in both directions', () => {
  // A package quietly acquires a gate without being declared.
  const undeclared = evaluate(facts({ hasApiScript: new Set([...FROZEN, 'component-driver-radix-v1']) }));
  assert.equal(undeclared.length, 1);
  assert.match(undeclared[0], /^FROZEN-01/);
  assert.match(undeclared[0], /component-driver-radix-v1/);

  // A declared package has no gate at all — an unenforced promise.
  const ungated = evaluate(facts({ hasApiScript: new Set(['core', 'dom-core', 'angular-core']) }));
  assert.deepEqual(codesOf(ungated), ['FROZEN-01']);
  assert.match(ungated[0], /storybook is declared frozen .* no "check:api" script/);
});

test('FROZEN-02 fires on a declared package with no committed report', () => {
  const errors = evaluate(facts({ hasApiReport: new Set(['core', 'dom-core', 'storybook']) }));

  assert.deepEqual(codesOf(errors), ['FROZEN-02']);
  assert.match(errors[0], /angular-core/);
});

test('FROZEN-03 fires when a declared package README drops its stability section', () => {
  const errors = evaluate(facts({ hasStabilitySection: new Set(['core', 'dom-core', 'storybook']) }));

  assert.deepEqual(codesOf(errors), ['FROZEN-03']);
  assert.match(errors[0], /angular-core is declared frozen but its README/);
});

test('FROZEN-03 fires when an undeclared package README promises stability', () => {
  // The more dangerous direction: that README is what ships to npm.
  const errors = evaluate(facts({ hasStabilitySection: new Set([...FROZEN, 'component-driver-radix-v1']) }));

  assert.deepEqual(codesOf(errors), ['FROZEN-03']);
  assert.match(errors[0], /ships to npm/);
});

test('FROZEN-04 fires when the root README list falls behind the ADR', () => {
  const errors = evaluate(facts({ readmeDeclared: ['core', 'dom-core', 'angular-core'] }));

  assert.deepEqual(codesOf(errors), ['FROZEN-04']);
  assert.match(errors[0], /missing storybook/);
});

test('FROZEN-05 fires on an unreadable marker block rather than passing', () => {
  // A null declaration must not be read as "nothing is frozen, so everything
  // agrees" — that is the silent success the whole gate exists to reject.
  assert.deepEqual(codesOf(evaluate(facts({ declared: null }))), ['FROZEN-05']);
  assert.deepEqual(codesOf(evaluate(facts({ readmeDeclared: null }))), ['FROZEN-05']);
});

test('FROZEN-05 fires when a declared package does not exist', () => {
  const errors = evaluate(facts({ declared: [...FROZEN, 'react-99'] }));

  assert.ok(errors.some(error => error.startsWith('FROZEN-05') && error.includes('react-99')));
});

test('readMarkedSet reads the block and rejects a missing or empty one', () => {
  const document = [
    'intro',
    '<!-- frozen-set:start -->',
    '',
    '`core`, `dom-core`.',
    '',
    '<!-- frozen-set:end -->',
  ].join('\n');
  assert.deepEqual(readMarkedSet(document), ['core', 'dom-core']);

  assert.equal(readMarkedSet('`core`, `dom-core` with no markers at all'), null);
  assert.equal(readMarkedSet('<!-- frozen-set:start -->\n\n<!-- frozen-set:end -->'), null);
});

test('the stability promise is a heading, not any mention of the phrase', () => {
  assert.equal(promisesStability('## Public API & stability\n\nFrozen under SemVer.'), true);
  assert.equal(promisesStability('### Public API & stability'), true);

  // The bug this replaced a substring check to fix: renaming the heading while
  // leaving the phrase in prose, a link, or a code block used to keep the gate
  // green even though the section a consumer reads had gone.
  assert.equal(promisesStability('## API notes\n\nSee the Public API & stability policy in ADR-006.'), false);
  assert.equal(promisesStability('```\nPublic API & stability\n```'), false);
  assert.equal(promisesStability('A [Public API & stability](../adr/006.md) link.'), false);
});
