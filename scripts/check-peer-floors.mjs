#!/usr/bin/env node
// Peer-range coherence gate (PEER-*). Fails CI when the peer ranges a package
// advertises cannot all be satisfied at once by the tree that installing it
// actually produces.
//
// ADR-006 §3 states that "the advertised peer ranges are part of the 1.0
// contract", which makes a wrong range expensive in a way a wrong pin is not:
// narrowing one after the tag REMOVES support the contract promised, so it can
// only be fixed in a major. That is the whole reason this runs before the tag
// rather than after the first bug report.
//
// Nothing else checks this. `.npmrc` sets `auto-install-peers=true` and both CI
// composite actions end in `pnpm install --no-frozen-lockfile`, so CI always
// resolves the NEWEST satisfying version of every peer — the declared floors are
// never exercised by any install this repo performs. They are prose until
// something compares them to each other.
//
// PEER-01  a package advertises a peer range wider than a package it hard-depends
//          on advertises for that same peer. Installing the first installs the
//          second, so the consumer must satisfy BOTH; any version in the gap
//          satisfies the advertised contract and breaks the resulting tree.
//          Live example this gate is built from (1.0 readiness audit, A4):
//          react-19 peered `@testing-library/dom: >=10.2.0` while the dom-core it
//          depends on peered `>=10.4.1`, so a consumer on 10.3.0 satisfied
//          react-19 and violated dom-core. Checked in both directions — a floor
//          that is too low and a ceiling that is too high (or absent) are the same
//          bug, and the second is easier to introduce because "no upper bound"
//          does not look like a claim.
//
// PEER-02  a package declares the same third-party name in BOTH `dependencies`
//          and `peerDependencies`. The hard dependency always wins, which makes
//          the peer declaration inert: it neither warns nor constrains, and a
//          consumer already on a lower satisfying version silently gets a nested
//          duplicate copy instead of the deduped single instance the peer was
//          written to request. Two copies of a testing library in one tree is not
//          a hypothetical failure — a dual-instance `vue` is exactly what took
//          the reka-ui suites to 100% red (#1379).
//
// PEER-03  a per-major engine package (`react-19`, `vue-3`, `angular-22`) leaves
//          its own framework peer unbounded, or bounds it at the wrong major.
//          ADR-003:26-31 rejects "a peer-dep range spanning majors" — a react-19
//          that advertises React 20 defeats the reason the package exists — and
//          ADR-006 §3 now ratifies that every per-major adapter bounds its major.
//          Both said so in prose while `react-19: >=19.0.0` and `vue-3: >=3.0.0`
//          shipped unbounded, so this is the sentence made executable.
//
//          Scoped to the engine packages ONLY. A `component-driver-*` package's
//          `react`/`vue` peer is an intentionally open floor: a design system's
//          major and a framework's major are independent axes, so pinning one to
//          the other is the DEP-PIN-02 bug, not this one.
//
// Only peers BOTH packages declare are compared. A package that declines to
// re-advertise a dependency's peer at all (storybook depends on dom-core without
// repeating its `@testing-library/dom` peer) is making no claim to contradict,
// and is deliberately not this check's business.
//
// Dependency-free Node ESM, modelled on scripts/check-dependency-pinning.mjs.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const packagesDir = resolve(repoRoot, 'packages');

// PEER-02 exemptions: a hard dependency that is ALSO advertised as a peer on
// purpose. Keyed `<package>:<dependency>`, valued with the reason, which must
// name what makes the duplicate correct rather than merely tolerated.
//
// Currently empty, and that is the point — every case the 1.0 audit found has
// been resolved by dropping one of the two declarations. The map exists so the
// next genuine exception is recorded with a reason instead of silently widening
// the rule, matching DRIVER_ALLOWLIST (check-scaffolder-coverage.mjs) and EXEMPT
// (check-absence-convention.mjs).
const DUPLICATE_EXEMPT = new Map();

// PEER-03: the framework peers each per-major engine family must bound to its own
// major. Deliberately a separate table from check-dependency-pinning.mjs's
// FAMILIES: that one governs CONCRETE pins (a devDependency bumped past a major
// boundary), this one governs ADVERTISED ranges. They answer different questions
// about different manifest fields and are free to diverge — sharing one table
// would couple two gates that have no reason to move together.
const ENGINE_FAMILIES = [
  { pattern: /^react-(\d+)$/, peers: ['react', 'react-dom'] },
  { pattern: /^vue-(\d+)$/, peers: ['vue', '@vue/compiler-sfc'] },
  {
    pattern: /^angular-(\d+)$/,
    peers: ['@angular/core', '@angular/common', '@angular/compiler', '@angular/platform-browser'],
  },
];

/** Parse `1.2.3`, `1.2`, `1` into a comparable [major, minor, patch]. */
function parseVersion(text) {
  const match = /^(\d+)(?:\.(\d+))?(?:\.(\d+))?/.exec(text.trim());
  if (!match) return null;
  return [Number(match[1]), Number(match[2] ?? 0), Number(match[3] ?? 0)];
}

function compare(a, b) {
  for (let i = 0; i < 3; i++) {
    if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
  }
  return 0;
}

const format = version => version.join('.');

/**
 * The next version a caret range excludes, following npm's rule that the
 * leftmost NON-ZERO component is the one held stable: `^1.2.3` → `2.0.0`, but
 * `^0.15.0` → `0.16.0` and `^0.0.3` → `0.0.4`. Getting this wrong would matter
 * here — `zone.js: >=0.15.0` is a real peer in the angular packages.
 */
function caretCeiling([major, minor, patch]) {
  if (major !== 0) return [major + 1, 0, 0];
  if (minor !== 0) return [0, minor + 1, 0];
  return [0, 0, patch + 1];
}

/** The version immediately after `v`, used to turn an inclusive bound exclusive. */
const nextPatch = ([major, minor, patch]) => [major, minor, patch + 1];

/**
 * One comparator: an optional operator, optional space, then a partial or full
 * version. The space is real here — jest is peered as `">= 26.0.0"`. Sticky, so
 * the caller can require that the WHOLE alternative is consumed.
 */
const COMPARATOR = /\s*(\^|~|>=|<=|>|<|=)?\s*(\d+(?:\.\d+)?(?:\.\d+)?)\s*/y;

/**
 * Reduce a range to the interval it spans: `{ floor, ceiling }`, where a null
 * bound means unbounded in that direction and **`ceiling` is always exclusive**
 * (`<=20.0.0` normalizes to `< 20.0.1`, `>19.0.0` to `>= 19.0.1`), so every
 * comparison downstream is a single half-open-interval test.
 *
 * Comparators within one alternative are INTERSECTED — floors by `max`, ceilings
 * by `min` — because `>=18 >=19` means both, not whichever was written last.
 * Assigning in encounter order instead would let comparator order change the
 * verdict: `>=19 <20 >=18` would keep a floor of 18 and be rejected by PEER-03,
 * while a reversed caret would widen a ceiling and hide a real violation.
 *
 * Alternatives across `||` are UNIONED as their hull (`^16 || ^17` → `[16, 18)`),
 * which is an over-approximation: a hull is never narrower than the real range,
 * so it can only fail to report a genuine violation, never invent one. No peer
 * range in this repo is a disjoint union a hull would misjudge.
 *
 * Returns null for anything outside that grammar — hyphen ranges (`1.2.3 - 2.0.0`),
 * `x`/`*` wildcards, prerelease tags. The caller reports those as PEER-04 rather
 * than skipping them: a form this cannot read must not be mistaken for one it
 * read and approved, which is the exact failure the whole gate exists to prevent.
 */
export function parseRange(range) {
  const parseAlternative = text => {
    let floor = null;
    let ceiling = null;
    let matched = false;

    const lower = candidate => (floor == null || compare(candidate, floor) > 0 ? candidate : floor);
    const upper = candidate => (ceiling == null || compare(candidate, ceiling) < 0 ? candidate : ceiling);

    COMPARATOR.lastIndex = 0;
    let position = 0;
    while (position < text.length) {
      COMPARATOR.lastIndex = position;
      const match = COMPARATOR.exec(text);
      // Sticky: a null match, or one that did not start exactly here, means
      // unsupported syntax is present. Bail rather than skip past it.
      if (!match || match.index !== position) return null;
      position = COMPARATOR.lastIndex;

      const parsed = parseVersion(match[2]);
      if (!parsed) return null;
      matched = true;

      switch (match[1]) {
        case '^':
          floor = lower(parsed);
          ceiling = upper(caretCeiling(parsed));
          break;
        case '~':
          floor = lower(parsed);
          ceiling = upper([parsed[0], parsed[1] + 1, 0]);
          break;
        case '>=':
          floor = lower(parsed);
          break;
        case '>':
          floor = lower(nextPatch(parsed));
          break;
        case '<':
          ceiling = upper(parsed);
          break;
        case '<=':
          ceiling = upper(nextPatch(parsed));
          break;
        default:
          // A bare or `=`-prefixed `1.2.3` pins exactly: [1.2.3, 1.2.4).
          floor = lower(parsed);
          ceiling = upper(nextPatch(parsed));
      }
    }
    return matched ? { floor, ceiling } : null;
  };

  const alternatives = range.split('||').map(part => parseAlternative(part.trim()));
  if (alternatives.length === 0 || alternatives.some(alternative => alternative == null)) return null;

  // The hull. A single unbounded alternative leaves the union unbounded in that
  // direction, which is why these are `some` checks rather than reductions.
  return {
    floor: alternatives.some(a => a.floor == null)
      ? null
      : alternatives.reduce((low, a) => (compare(a.floor, low) < 0 ? a.floor : low), alternatives[0].floor),
    ceiling: alternatives.some(a => a.ceiling == null)
      ? null
      : alternatives.reduce((high, a) => (compare(a.ceiling, high) > 0 ? a.ceiling : high), alternatives[0].ceiling),
  };
}

function readManifest(dir, dirName) {
  const path = join(dir, 'package.json');
  if (!existsSync(path)) return null;
  try {
    return { path, dirName, json: JSON.parse(readFileSync(path, 'utf8')) };
  } catch {
    return null;
  }
}

/**
 * Decide the verdict for an already-read set of manifests, keyed by package name
 * and each carrying `{ path, dirName, json }`.
 *
 * Separated from reading the tree so the rules can be exercised against
 * hand-built manifests — see check-peer-floors.test.mjs, which reintroduces each
 * historical defect and asserts the matching rule fires. A gate nothing ever
 * proves can DETECT is only evidence that it ran.
 */
export function evaluate(manifests) {
  /**
   * Every workspace package reachable through `dependencies` — the set a consumer
   * installs along with `name`. peerDependencies are deliberately not traversed:
   * they are the consumer's own tree, not something this package drags in.
   */
  const workspaceDependencyClosure = name => {
    const seen = new Set();
    const queue = [name];
    while (queue.length > 0) {
      const current = queue.shift();
      for (const dependency of Object.keys(manifests.get(current)?.json.dependencies ?? {})) {
        if (!manifests.has(dependency) || seen.has(dependency)) continue;
        seen.add(dependency);
        queue.push(dependency);
      }
    }
    return seen;
  };

  const errors = [];
  const unparseable = [];
  let comparisons = 0;

  for (const [name, manifest] of manifests) {
    const peers = manifest.json.peerDependencies ?? {};
    const relPath = manifest.path;

    for (const [peer, range] of Object.entries(peers)) {
      if (parseRange(range) == null) unparseable.push(`${relPath} → ${peer}: "${range}"`);
    }

    // PEER-02 — an inert peer declaration.
    for (const dependency of Object.keys(manifest.json.dependencies ?? {})) {
      if (!(dependency in peers) || manifests.has(dependency)) continue;
      if (DUPLICATE_EXEMPT.has(`${name.replace('@atomic-testing/', '')}:${dependency}`)) continue;
      errors.push(
        `PEER-02: ${relPath} declares ${dependency} in BOTH dependencies ` +
          `("${manifest.json.dependencies[dependency]}") and peerDependencies ("${peers[dependency]}"). ` +
          `The hard dependency wins, so the peer neither warns nor constrains — and a consumer already ` +
          `on a lower satisfying version gets a second nested copy instead of the single deduped ` +
          `instance the peer asks for. Drop one: the peer if the dependency is genuinely required, ` +
          `the dependency if the consumer is meant to supply it.`
      );
    }

    // PEER-03 — a per-major engine that does not bound its own major.
    for (const family of ENGINE_FAMILIES) {
      const match = family.pattern.exec(manifest.dirName);
      if (!match) continue;
      const major = Number(match[1]);
      for (const peer of family.peers) {
        const range = peers[peer];
        if (range == null) continue;
        const parsed = parseRange(range);
        if (parsed == null) continue;
        if (parsed.ceiling == null || compare(parsed.ceiling, [major + 1, 0, 0]) > 0) {
          errors.push(
            `PEER-03: ${relPath} peers ${peer} "${range}", which admits majors above ${major}. ` +
              `This package exists only to pin one framework major (ADR-003), so a range reaching ` +
              `into ${major + 1} promises support that belongs to the sibling package for that ` +
              `major — and defeats this package's own reason to exist. Bound it at <${major + 1}.0.0.`
          );
        }
        if (parsed.floor == null || parsed.floor[0] !== major) {
          errors.push(
            `PEER-03: ${relPath} peers ${peer} "${range}", whose floor is not in major ${major}. ` +
              `A per-major adapter's floor is its own major — anything else silently supports a ` +
              `version this package was not built against.`
          );
        }
      }
    }

    // PEER-01 — a claim wider than the tree it produces can honour.
    for (const dependencyName of workspaceDependencyClosure(name)) {
      const dependencyPeers = manifests.get(dependencyName).json.peerDependencies ?? {};
      for (const [peer, range] of Object.entries(peers)) {
        const theirRange = dependencyPeers[peer];
        if (theirRange == null) continue;
        const ours = parseRange(range);
        const theirs = parseRange(theirRange);
        if (ours == null || theirs == null) continue;
        comparisons++;

        const shortName = dependencyName.replace('@atomic-testing/', '');
        if (theirs.floor != null && (ours.floor == null || compare(ours.floor, theirs.floor) < 0)) {
          const witness = ours.floor == null ? `below ${format(theirs.floor)}` : format(ours.floor);
          errors.push(
            `PEER-01: ${relPath} peers ${peer} "${range}", but it depends on ${shortName}, which peers ` +
              `"${theirRange}" — a lower floor. A consumer on ${witness} satisfies ${name} and violates ` +
              `${dependencyName}, so the advertised range promises a tree that cannot install. Raise this ` +
              `floor to at least ${format(theirs.floor)}, or lower ${shortName}'s.`
          );
        }
        if (theirs.ceiling != null && (ours.ceiling == null || compare(ours.ceiling, theirs.ceiling) > 0)) {
          const witness = ours.ceiling == null ? `above ${format(theirs.ceiling)}` : `up to ${format(ours.ceiling)}`;
          errors.push(
            `PEER-01: ${relPath} peers ${peer} "${range}", but it depends on ${shortName}, which peers ` +
              `"${theirRange}" — a lower ceiling. This package advertises support ${witness} that ` +
              `${dependencyName} refuses, so the two cannot both be satisfied. Bound this range at ` +
              `${format(theirs.ceiling)}, or raise ${shortName}'s ceiling.`
          );
        }
      }
    }
  }

  // An unreadable range is a hole in the check, not a pass. Reported rather than
  // skipped so "the gate was green" can never mean "the gate never looked".
  for (const entry of unparseable) {
    errors.push(
      `PEER-04: ${entry} is not a range this check can read, so its coherence went unverified. ` +
        `Rewrite it in the comparator/caret/tilde/union forms the rest of the repo uses, or teach ` +
        `parseRange() the new form.`
    );
  }

  return { errors, comparisons };
}

/** Read every `packages/*` manifest, keyed by package name. */
export function readManifests(root = packagesDir) {
  const manifests = new Map();
  for (const dirName of readdirSync(root)) {
    const manifest = readManifest(join(root, dirName), dirName);
    if (manifest?.json.name) manifests.set(manifest.json.name, manifest);
  }
  return manifests;
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const manifests = readManifests();
  for (const manifest of manifests.values()) {
    manifest.path = manifest.path.slice(repoRoot.length + 1);
  }
  const { errors, comparisons } = evaluate(manifests);

  if (errors.length > 0) {
    console.error(`[peer-floors] ${errors.length} problem(s):`);
    for (const error of errors) console.error(`  - ${error}`);
    process.exit(1);
  }

  process.stdout.write(
    `[peer-floors] OK — ${manifests.size} package(s), ${comparisons} shared peer range(s) checked ` +
      `against the packages that install them.\n`
  );
}
