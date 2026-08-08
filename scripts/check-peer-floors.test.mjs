// Unit tests for the peer-range coherence gate. Run with `node --test`.
//
// The point of these is DETECTION, not coverage. A gate that only ever runs
// against a healthy tree proves it executed, never that it can still see the bug
// it was written for — and every rule here guards a defect this repo actually
// shipped. So each one gets a fixture that reintroduces the original manifest and
// asserts the gate rejects it; if a refactor blinds a rule, these go red instead
// of the gate quietly passing forever.
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { evaluate, parseRange } from './check-peer-floors.mjs';

/** Build the manifest map `evaluate` expects from a terse literal. */
function manifestsOf(entries) {
  return new Map(
    Object.entries(entries).map(([dirName, json]) => {
      const name = json.name ?? `@atomic-testing/${dirName}`;
      return [name, { path: `packages/${dirName}/package.json`, dirName, json: { ...json, name } }];
    })
  );
}

const codesOf = manifests => evaluate(manifests).errors.map(error => error.slice(0, 7));

test('parses the comparator forms the repo actually uses', () => {
  assert.deepEqual(parseRange('>=10.4.1'), { floor: [10, 4, 1], ceiling: null });
  assert.deepEqual(parseRange('>=18.0.0 <19.0.0'), { floor: [18, 0, 0], ceiling: [19, 0, 0] });
  // The space after the operator is real — jest is peered `">= 26.0.0"`.
  assert.deepEqual(parseRange('>= 26.0.0'), { floor: [26, 0, 0], ceiling: null });
  assert.deepEqual(parseRange('^10.0.0'), { floor: [10, 0, 0], ceiling: [11, 0, 0] });
  // Partial versions.
  assert.deepEqual(parseRange('>=11'), { floor: [11, 0, 0], ceiling: null });
});

test('holds the leftmost non-zero component stable for caret ranges', () => {
  // zone.js is peered `>=0.15.0`, so a 0.x caret must not widen to 1.0.0.
  assert.deepEqual(parseRange('^0.15.0'), { floor: [0, 15, 0], ceiling: [0, 16, 0] });
  assert.deepEqual(parseRange('^0.0.3'), { floor: [0, 0, 3], ceiling: [0, 0, 4] });
  assert.deepEqual(parseRange('^1.2.3'), { floor: [1, 2, 3], ceiling: [2, 0, 0] });
});

test('takes the hull of a union', () => {
  // react-legacy peers `^16 || ^17`.
  assert.deepEqual(parseRange('^16 || ^17'), { floor: [16, 0, 0], ceiling: [18, 0, 0] });
});

test('intersects comparators rather than letting the last one win', () => {
  // Encounter-order assignment would leave a floor of 18 here, which PEER-03
  // would then reject as "not in major 19" — a verdict that depends on the order
  // the comparators happen to be written in.
  assert.deepEqual(parseRange('>=19.0.0 <20.0.0 >=18.0.0'), { floor: [19, 0, 0], ceiling: [20, 0, 0] });
  // Same in the other direction: a wider ceiling written second must not widen
  // the range and hide a violation.
  assert.deepEqual(parseRange('<19.0.0 <25.0.0'), { floor: null, ceiling: [19, 0, 0] });
});

test('normalizes inclusive and exclusive bounds so the ceiling is always exclusive', () => {
  // `<=20.0.0` ADMITS 20.0.0. Storing it as an exclusive 20.0.0 would let
  // `>=19.0.0 <=20.0.0` pass PEER-03 while admitting React 20.
  assert.deepEqual(parseRange('>=19.0.0 <=20.0.0'), { floor: [19, 0, 0], ceiling: [20, 0, 1] });
  // `>1.0.0` excludes 1.0.0 itself.
  assert.deepEqual(parseRange('>1.0.0'), { floor: [1, 0, 1], ceiling: null });
  // An exact pin is the half-open interval containing only itself.
  assert.deepEqual(parseRange('1.2.3'), { floor: [1, 2, 3], ceiling: [1, 2, 4] });
});

test('refuses forms it cannot read instead of guessing an interval', () => {
  // Each of these contains digits a scanning parser would happily pick up while
  // ignoring the syntax that changes their meaning — the exact way an unverified
  // range gets mistaken for a verified one.
  for (const range of ['1.x', '1.2.3 - 2.0.0', '*', 'latest', '~>1.2', '1.0.0-beta.1', '']) {
    assert.equal(parseRange(range), null, `expected "${range}" to be rejected`);
  }
});

test('PEER-01 fires on a floor lower than a dependency advertises', () => {
  // react-19 peered `>=10.2.0` while the dom-core under it peered `>=10.4.1`, so
  // a consumer on 10.3.0 satisfied react-19 and violated dom-core.
  const manifests = manifestsOf({
    'react-19': {
      dependencies: { '@atomic-testing/dom-core': 'workspace:*' },
      peerDependencies: { '@testing-library/dom': '>=10.2.0', react: '>=19.0.0 <20.0.0' },
    },
    'dom-core': { peerDependencies: { '@testing-library/dom': '>=10.4.1' } },
  });

  const { errors } = evaluate(manifests);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /^PEER-01/);
  // The consumer version that slips through is named, not left to be derived.
  assert.match(errors[0], /consumer on 10\.2\.0/);
});

test('PEER-01 fires on a ceiling higher than a dependency advertises', () => {
  // internal-test-runner-playwright-adapter peered `>=1.50.0` (open) while
  // depending on playwright, which peers `>=1.50.0 <2.0.0`.
  const manifests = manifestsOf({
    'internal-test-runner-playwright-adapter': {
      dependencies: { '@atomic-testing/playwright': 'workspace:*' },
      peerDependencies: { '@playwright/test': '>=1.50.0' },
    },
    playwright: { peerDependencies: { '@playwright/test': '>=1.50.0 <2.0.0' } },
  });

  assert.deepEqual(codesOf(manifests), ['PEER-01']);
});

test('PEER-01 stays quiet when the dependent is strictly narrower', () => {
  const manifests = manifestsOf({
    'react-19': {
      dependencies: { '@atomic-testing/react-core': 'workspace:*' },
      peerDependencies: { react: '>=19.0.0 <20.0.0' },
    },
    // The shared base is deliberately open (`React >=18`, ADR-006 §3) — a
    // narrower dependent is the intended shape, not a violation.
    'react-core': { peerDependencies: { react: '>=18.0.0' } },
  });

  assert.deepEqual(codesOf(manifests), []);
});

test('PEER-01 ignores a peer the dependency never declares', () => {
  // storybook depends on dom-core without restating its `@testing-library/dom`
  // peer. Declining to make a claim is not a claim to contradict.
  const manifests = manifestsOf({
    storybook: {
      dependencies: { '@atomic-testing/dom-core': 'workspace:*' },
      peerDependencies: { storybook: '^10.0.0' },
    },
    'dom-core': { peerDependencies: { '@testing-library/dom': '>=10.4.1' } },
  });

  assert.deepEqual(codesOf(manifests), []);
});

test('PEER-02 fires on a library declared as both a dependency and a peer', () => {
  const manifests = manifestsOf({
    'react-18': {
      dependencies: { '@testing-library/react': '^16.3.2' },
      peerDependencies: { '@testing-library/react': '>=16.2.0', react: '>=18.0.0 <19.0.0' },
    },
  });

  assert.deepEqual(codesOf(manifests), ['PEER-02']);
});

test('PEER-02 does not count a workspace dependency as a duplicate', () => {
  const manifests = manifestsOf({
    'react-18': {
      dependencies: { '@atomic-testing/react-core': 'workspace:*' },
      peerDependencies: { react: '>=18.0.0 <19.0.0' },
    },
    'react-core': { peerDependencies: { react: '>=18.0.0' } },
  });

  assert.deepEqual(codesOf(manifests), []);
});

test('PEER-03 fires on a per-major engine that leaves its framework peer unbounded', () => {
  const unbounded = manifestsOf({
    'react-19': { peerDependencies: { react: '>=19.0.0', 'react-dom': '>=19.0.0' } },
  });
  assert.deepEqual(codesOf(unbounded), ['PEER-03', 'PEER-03']);

  const vue = manifestsOf({ 'vue-3': { peerDependencies: { vue: '>=3.0.0' } } });
  assert.deepEqual(codesOf(vue), ['PEER-03']);
});

test('PEER-03 fires on an inclusive ceiling that admits the next major', () => {
  // The bug an exclusive-only reading of `<=` would hide entirely.
  const manifests = manifestsOf({
    'react-19': { peerDependencies: { react: '>=19.0.0 <=20.0.0' } },
  });

  assert.deepEqual(codesOf(manifests), ['PEER-03']);
});

test('PEER-03 accepts a correctly bounded engine and ignores driver packages', () => {
  const bounded = manifestsOf({
    'react-19': { peerDependencies: { react: '>=19.0.0 <20.0.0', 'react-dom': '>=19.0.0 <20.0.0' } },
    'angular-20': { peerDependencies: { '@angular/core': '>=20.0.0 <21.0.0' } },
  });
  assert.deepEqual(codesOf(bounded), []);

  // A design system's major and a framework's major are independent axes, so a
  // driver's open framework floor is deliberate (ADR-003) — PEER-03 must not
  // reach it.
  const driver = manifestsOf({
    'component-driver-mui-v7': { peerDependencies: { react: '>=18.0.0', 'react-dom': '>=18.0.0' } },
  });
  assert.deepEqual(codesOf(driver), []);
});

test('PEER-04 reports an unreadable range rather than passing it', () => {
  const manifests = manifestsOf({ 'vue-3': { peerDependencies: { vue: 'latest' } } });

  const { errors } = evaluate(manifests);
  // PEER-03 also fires (an unreadable range certainly is not a bounded major),
  // but PEER-04 is the one that says the range went unverified.
  assert.ok(
    errors.some(error => error.startsWith('PEER-04')),
    `expected a PEER-04 among: ${errors.join(' | ')}`
  );
});
