#!/usr/bin/env node
// Release-version guard (RELVER-*). Decides whether a requested release version
// is one this repository may cut, and refuses with a reason otherwise.
//
// This is the first thing `.github/workflows/release.yml` runs, before anything
// writes to a manifest, and it is the only thing standing between a typo in a
// dispatch box and 38 rewritten manifests plus a published tag. So it is a
// tested script rather than inline shell.
//
// It replaced a `sort -V` comparison, which is not a SemVer comparator: GNU sort
// ranks `1.0.0-alpha.1` ABOVE `1.0.0`, so the guard would have rejected the
// perfectly ordinary `1.0.0-rc.1` -> `1.0.0` promotion this project is heading
// toward. SemVer §11 says the opposite — a prerelease has LOWER precedence than
// its release — so precedence is implemented here rather than borrowed.
//
// RELVER-01  the requested version is not a valid SemVer version. Fail closed:
//            bumpVersion.js writes this string verbatim into 38 manifests, and
//            every gate downstream compares it by STRING equality — so an
//            invalid-but-consistent version sails through the bump, the commit,
//            the tag and the full e2e matrix, and is first rejected by npm at
//            the very end, with main already carrying the damage.
// RELVER-02  a tag for it already exists. Re-releasing a version would point an
//            existing tag at a different commit, or publish a version npm has.
// RELVER-03  it has LOWER precedence than the version in the tree. Equal
//            precedence is not an error by itself — see `mode` below.
//
// RESUMING. release.yml mutates three things in sequence after its checks pass:
// it pushes the release commit, pushes the tag, then dispatches the publish. A
// run that dies between the first and second leaves main correctly bumped with
// no tag, and a guard that treated "the tree is already at X" as fatal would
// make that state unfinishable by the automated path — forcing exactly the
// manual tagging step this whole change set exists to remove. So an
// already-bumped tree with no tag reports `mode: 'resume'` rather than an error,
// and release.yml skips straight to tagging. The tag-exists case stays a hard
// refusal, because past that point the release is no longer resumable here.
//
// Dependency-free Node ESM, modelled on scripts/check-peer-floors.mjs.
import { execFileSync } from 'node:child_process';
import { appendFileSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// The official SemVer grammar, minus build metadata. Deliberately NOT `(\d+)`
// per component: SemVer §2 forbids leading zeros in the release triple and §9
// forbids them in numeric prerelease identifiers and forbids empty identifiers.
// A looser regex accepts `0.103.00`, `1.0.0-rc.01` and `1.0.0-.`, all of which
// `semver.valid()` — the library npm itself publishes through — rejects. Since
// every check between here and the registry is string equality against this same
// value, npm is otherwise the FIRST thing in the pipeline to notice, long after
// main has been rewritten and tagged.
const SEMVER =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*))?$/;

/**
 * The canonical form of a requested version: trimmed, with one optional leading
 * `v` removed. Every rule and every caller goes through this, so no code path
 * can be reached with a half-normalised value — the bug shape where RELVER-01
 * and RELVER-03 re-parse (and so re-trim) while RELVER-02's tag lookup uses the
 * raw string and silently matches nothing.
 */
export const normalizeVersion = requested =>
  String(requested ?? '')
    .trim()
    .replace(/^v/, '');

/**
 * `{ release: [major, minor, patch], prerelease: string[] | null }`, or null when
 * the input is not a valid SemVer version. Build metadata (`+…`) is deliberately
 * unsupported: nothing here publishes it, and accepting a shape the rest of the
 * release path has never seen is how a bad string reaches 38 manifests.
 *
 * The release triple stays as the matched DIGIT STRINGS rather than numbers.
 * SemVer puts no ceiling on a component, and `Number` silently collapses
 * anything past 2^53 — `9007199254740992.0.0` and `…93.0.0` would compare equal,
 * which would let RELVER-03 mistake a lower request for a resume and skip the
 * changelog. {@link compareNumericIdentifier} compares them exactly instead.
 */
export function parseSemver(version) {
  const match = SEMVER.exec(String(version ?? '').trim());
  if (!match) return null;
  return {
    release: [match[1], match[2], match[3]],
    prerelease: match[4] == null ? null : match[4].split('.'),
  };
}

const isNumeric = identifier => /^\d+$/.test(identifier);

/**
 * Exact ordering of two non-negative integers held as digit strings, with no
 * conversion and so no precision ceiling. The grammar above forbids leading
 * zeros, so a longer string is always the larger number and equal lengths order
 * lexically — which for equal-length digit strings is numeric order.
 */
function compareNumericIdentifier(a, b) {
  if (a.length !== b.length) return a.length < b.length ? -1 : 1;
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

/**
 * SemVer §11 precedence for prerelease identifier lists:
 *   rule 1  identifiers are compared left to right
 *   rule 2  numeric identifiers compare numerically
 *   rule 3  numeric identifiers ALWAYS rank below non-numeric ones
 *   rule 4  when one list is a prefix of the other, the longer list wins
 *
 * Rule 3 is not redundant with the lexical fallback below it, even though the
 * spec's own canonical example never separates them: ASCII digits sort below
 * letters, so `1` vs `beta` gets the same answer either way. It only bites when
 * the non-numeric identifier sorts lexically BELOW the numeric one — i.e. when
 * it starts with a digit or a hyphen, as in `2` vs `1a`. The test file pins that
 * case specifically, because deleting rule 3 leaves the canonical chain green.
 */
function comparePrerelease(a, b) {
  for (let index = 0; index < Math.max(a.length, b.length); index++) {
    const left = a[index];
    const right = b[index];
    if (left === undefined) return -1;
    if (right === undefined) return 1;
    if (left === right) continue;

    const leftNumeric = isNumeric(left);
    const rightNumeric = isNumeric(right);
    if (leftNumeric && rightNumeric) return compareNumericIdentifier(left, right);
    if (leftNumeric !== rightNumeric) return leftNumeric ? -1 : 1;
    return left < right ? -1 : 1;
  }
  return 0;
}

/**
 * Negative when `a` precedes `b`, positive when it follows, 0 when equal.
 * Throws on an unparseable input rather than guessing an order for it.
 */
export function compareSemver(a, b) {
  const left = parseSemver(a);
  const right = parseSemver(b);
  if (!left || !right) throw new Error(`Cannot compare unparseable version(s): ${a}, ${b}`);

  for (let index = 0; index < 3; index++) {
    const order = compareNumericIdentifier(left.release[index], right.release[index]);
    if (order !== 0) return order;
  }
  // A prerelease has LOWER precedence than its release — the case `sort -V`
  // gets backwards, and the one that matters for `1.0.0-rc.1` -> `1.0.0`.
  if (left.prerelease && !right.prerelease) return -1;
  if (!left.prerelease && right.prerelease) return 1;
  if (!left.prerelease && !right.prerelease) return 0;
  return comparePrerelease(left.prerelease, right.prerelease);
}

/**
 * Whether the requested version may be released, and in which mode.
 *
 * Returns `{ version, errors, mode }` — `version` is the normalised form every
 * caller should use from then on (returning it is what keeps normalisation from
 * being re-derived at a second site and drifting), `errors` is empty when the
 * release may proceed, and `mode` is `'fresh'` or `'resume'` (see the header).
 *
 * @param requested     the version asked for, with or without a leading `v`
 * @param current       the version the working tree currently carries
 * @param existingTags  every tag name in the repository (`v*` and otherwise)
 */
export function validateReleaseVersion({ requested, current, existingTags }) {
  const version = normalizeVersion(requested);
  const errors = [];
  const refuse = (mode = 'fresh') => ({ version, errors, mode });

  if (!parseSemver(version)) {
    errors.push(
      // The RAW input, not the normalised one: reporting the post-strip form
      // hands the operator a string they never typed (`version1.2.3` would come
      // back as `ersion1.2.3`).
      `RELVER-01: "${requested}" is not a valid semver version. Expected e.g. 0.103.0 or 1.0.0-rc.1 — ` +
        `no leading zeros, no empty prerelease identifiers, and no build metadata on this release path.`
    );
    // Every rule below needs a parseable version; reporting them against a
    // string we could not read would invent findings.
    return refuse();
  }

  const tagExists = new Set(existingTags).has(`v${version}`);
  if (tagExists) {
    errors.push(
      `RELVER-02: tag v${version} already exists. Releasing a version twice would point an existing ` +
        `tag at a new commit, and npm rejects a republished version outright. Pick the next version, ` +
        `or delete the tag and its GitHub Release first.`
    );
  }

  if (!parseSemver(current)) {
    errors.push(
      `RELVER-03: the tree's current version "${current}" is not parseable, so precedence cannot be checked.`
    );
    return refuse();
  }

  const order = compareSemver(version, current);
  if (order < 0) {
    errors.push(
      `RELVER-03: ${version} has lower precedence than the current ${current}. Releasing it would ` +
        `move the "latest" dist-tag backwards.`
    );
    return refuse();
  }

  if (order === 0) {
    // The tree already carries this version. With a tag, that is a re-release
    // and RELVER-02 has already refused it. Without one, it is the leftover of a
    // run that pushed the release commit and then died — finishable, not broken.
    if (tagExists) return refuse();
    return { version, errors, mode: 'resume' };
  }

  return refuse();
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const requested = process.argv[2];
  const current = JSON.parse(readFileSync(resolve(repoRoot, 'packages/core/package.json'), 'utf8')).version;
  const existingTags = execFileSync('git', ['tag', '--list'], { cwd: repoRoot, encoding: 'utf8' })
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  const { version, errors, mode } = validateReleaseVersion({ requested, current, existingTags });
  if (errors.length > 0) {
    console.error(`[release-version] refusing to release "${requested}":`);
    for (const error of errors) console.error(`  - ${error}`);
    process.exit(1);
  }

  if (mode === 'resume') {
    process.stdout.write(
      `[release-version] RESUMING ${version} — the tree is already bumped and no tag exists, so a ` +
        `previous run pushed the release commit and stopped before tagging.\n`
    );
  } else {
    process.stdout.write(`[release-version] OK — ${current} -> ${version}\n`);
  }

  // Both consumed by release.yml. The values written here are the ones the rules
  // above actually validated, never a re-derivation of the raw input.
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `version=${version}\nmode=${mode}\n`);
  }
}
