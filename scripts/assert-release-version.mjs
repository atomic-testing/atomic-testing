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
// RELVER-01  the requested version is not a bare semver version. Fail closed:
//            bumpVersion.js writes this string verbatim into 38 manifests.
// RELVER-02  a tag for it already exists. Re-releasing a version would point an
//            existing tag at a different commit, or publish a version npm has.
// RELVER-03  it does not have higher precedence than the version in the tree.
//            Catches both a typo'd older version and a re-run of the current one.
//
// Dependency-free Node ESM, modelled on scripts/check-peer-floors.mjs.
import { execFileSync } from 'node:child_process';
import { appendFileSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const SEMVER = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/;

/**
 * `{ release: [major, minor, patch], prerelease: string[] | null }`, or null when
 * the input is not a bare semver version. Build metadata (`+…`) is deliberately
 * unsupported: nothing here publishes it, and accepting a shape the rest of the
 * release path has never seen is how a bad string reaches 38 manifests.
 */
export function parseSemver(version) {
  const match = SEMVER.exec(String(version ?? '').trim());
  if (!match) return null;
  return {
    release: [Number(match[1]), Number(match[2]), Number(match[3])],
    prerelease: match[4] == null ? null : match[4].split('.'),
  };
}

const isNumeric = identifier => /^\d+$/.test(identifier);

/**
 * SemVer §11 precedence for prerelease identifier lists. Numeric identifiers
 * compare numerically and always rank below alphanumeric ones; when one list is
 * a prefix of the other, the longer list wins.
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
    if (leftNumeric && rightNumeric) return Number(left) < Number(right) ? -1 : 1;
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
    if (left.release[index] !== right.release[index]) {
      return left.release[index] < right.release[index] ? -1 : 1;
    }
  }
  // A prerelease has LOWER precedence than its release — the case `sort -V`
  // gets backwards, and the one that matters for `1.0.0-rc.1` -> `1.0.0`.
  if (left.prerelease && !right.prerelease) return -1;
  if (!left.prerelease && right.prerelease) return 1;
  if (!left.prerelease && !right.prerelease) return 0;
  return comparePrerelease(left.prerelease, right.prerelease);
}

/**
 * Every reason the requested version may not be released, in rule order.
 * An empty array means it may.
 *
 * @param requested     the version asked for, with or without a leading `v`
 * @param current       the version the working tree currently carries
 * @param existingTags  every tag name in the repository (`v*` and otherwise)
 */
export function validateReleaseVersion({ requested, current, existingTags }) {
  const errors = [];
  const version = String(requested ?? '')
    .trim()
    .replace(/^v/, '');

  if (!parseSemver(version)) {
    errors.push(
      `RELVER-01: "${version}" is not a bare semver version. Expected e.g. 0.103.0 or 1.0.0-rc.1 ` +
        `(build metadata is not supported on this release path).`
    );
    // Every rule below needs a parseable version; reporting them against a
    // string we could not read would invent findings.
    return errors;
  }

  if (new Set(existingTags).has(`v${version}`)) {
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
    return errors;
  }

  const order = compareSemver(version, current);
  if (order === 0) {
    errors.push(`RELVER-03: the tree is already at ${current} — there is nothing to bump.`);
  } else if (order < 0) {
    errors.push(
      `RELVER-03: ${version} has lower precedence than the current ${current}. Releasing it would ` +
        `move the "latest" dist-tag backwards.`
    );
  }

  return errors;
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const requested = process.argv[2];
  const current = JSON.parse(readFileSync(resolve(repoRoot, 'packages/core/package.json'), 'utf8')).version;
  const existingTags = execFileSync('git', ['tag', '--list'], { cwd: repoRoot, encoding: 'utf8' })
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  const errors = validateReleaseVersion({ requested, current, existingTags });
  if (errors.length > 0) {
    console.error(`[release-version] refusing to release "${requested}":`);
    for (const error of errors) console.error(`  - ${error}`);
    process.exit(1);
  }

  const version = String(requested).trim().replace(/^v/, '');
  process.stdout.write(`[release-version] OK — ${current} -> ${version}\n`);
  // Consumed by release.yml; keeping the normalisation here means the leading
  // `v` is stripped in exactly one place.
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `version=${version}\n`);
  }
}
