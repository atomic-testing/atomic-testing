#!/usr/bin/env node
// Lockfile-overrides consistency gate. Fails fast, with a specific diff, when
// package.json's `pnpm.overrides` and pnpm-lock.yaml's own `overrides:`
// snapshot disagree — the exact drift that silently broke PR #1382.
//
// Real pnpm treats `pnpm.overrides` in package.json as authoritative and bakes
// a resolved copy into the lockfile's top-level `overrides:` block. CI's
// install step runs with frozen-lockfile behavior on (CI=true; see the comment
// in .github/actions/deps-setup/action.yaml referencing #1297 B9 — that
// strictness is deliberate and this check does not relax it) and pnpm refuses
// to proceed the moment those two disagree:
//
//   ERR_PNPM_LOCKFILE_CONFIG_MISMATCH  Cannot proceed with the frozen
//   installation. The current "overrides" configuration doesn't match the
//   value found in the lockfile
//
// That message names neither which override nor why. PR #1382 hit it because
// Dependabot's own updater regenerated pnpm-lock.yaml's `overrides:` block
// from pnpm-workspace.yaml's (documented-inert — see its own comment) two
// entries instead of carrying forward package.json's real 22, silently
// dropping every security-pin override the lockfile depended on. Every job
// that runs `pnpm install` then fails at the install step, before any of the
// PR's actual dependency bumps are even reached — and a bot re-triaging
// dependabot PRs on "any failing check closes it" (scripts/triage-dependabot-prs.ts)
// closes the PR without ever surfacing why.
//
// This check reads only committed files — no install required — so it can run
// as its own fast CI job in parallel with `build`, rather than waiting on (and
// being skipped by) the job pnpm's own opaque error takes down.
//
// Dependency-free Node ESM, modelled on scripts/check-peer-floors.mjs.
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/** Strip a single layer of matching quotes pnpm/YAML add around special keys/values. */
function unquote(text) {
  const trimmed = text.trim();
  if (trimmed.length >= 2) {
    const first = trimmed[0];
    const last = trimmed[trimmed.length - 1];
    if ((first === "'" && last === "'") || (first === '"' && last === '"')) {
      return trimmed.slice(1, -1);
    }
  }
  return trimmed;
}

/**
 * Parse the flat `overrides:` mapping pnpm writes at the top of pnpm-lock.yaml
 * (before `pnpmfileChecksum:`/`importers:`) — a two-space-indented `key:
 * value` list, keys/values optionally single-quoted, values sometimes
 * single-quoted specifically to keep a leading `>`/`>=` from reading as a YAML
 * block-scalar indicator. Deliberately a line-based parser rather than a full
 * YAML parser: this block never nests, so the extra dependency buys nothing.
 * Returns null if the lockfile has no `overrides:` block at all, distinct from
 * an empty one — the caller treats that as "nothing to compare", not a defect.
 */
export function parseLockfileOverrides(lockfileText) {
  const lines = lockfileText.split('\n');
  const startIndex = lines.findIndex(line => line === 'overrides:');
  if (startIndex === -1) return null;

  const overrides = new Map();
  for (let i = startIndex + 1; i < lines.length; i++) {
    const line = lines[i];
    if (line === '') continue;
    if (!line.startsWith('  ')) break; // back to column 0: block ended
    const colon = line.indexOf(':', 2);
    if (colon === -1) continue;
    const key = unquote(line.slice(2, colon));
    const value = unquote(line.slice(colon + 1));
    overrides.set(key, value);
  }
  return overrides;
}

/**
 * Resolve package.json's `pnpm.overrides` the way pnpm does when it writes the
 * lockfile: a value of `$name` means "whatever this package.json itself
 * specifies for `name`", read from dependencies/devDependencies/peerDependencies/
 * optionalDependencies in that order. Everything else passes through as-is.
 */
export function resolvePackageJsonOverrides(packageJson) {
  const raw = packageJson.pnpm?.overrides ?? {};
  const fields = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];

  const resolveSelfReference = name => {
    for (const field of fields) {
      const specifier = packageJson[field]?.[name];
      if (specifier != null) return specifier;
    }
    return null;
  };

  const resolved = new Map();
  const unresolved = [];
  for (const [key, value] of Object.entries(raw)) {
    if (!value.startsWith('$')) {
      resolved.set(key, value);
      continue;
    }
    const referenced = value.slice(1);
    const specifier = resolveSelfReference(referenced);
    if (specifier == null) {
      unresolved.push(
        `pnpm.overrides["${key}"] = "${value}" references "${referenced}", which is not a ` +
          `dependency/devDependency/peerDependency/optionalDependency of this package.json.`
      );
      continue;
    }
    resolved.set(key, specifier);
  }
  return { resolved, unresolved };
}

/**
 * Compare the two override maps and describe every disagreement: a key
 * package.json declares that the lockfile is missing or has a different value
 * for, and — the direction that actually broke #1382 — a key the lockfile
 * carries that package.json does not, which is exactly what a stale or
 * wrongly-sourced regeneration produces.
 */
export function evaluate(packageJson, lockfileText) {
  const lockfileOverrides = parseLockfileOverrides(lockfileText);
  if (lockfileOverrides === null) {
    return { errors: ['pnpm-lock.yaml has no top-level "overrides:" block to compare against.'] };
  }

  const { resolved: expected, unresolved } = resolvePackageJsonOverrides(packageJson);
  const errors = [...unresolved];

  for (const [key, expectedValue] of expected) {
    if (!lockfileOverrides.has(key)) {
      errors.push(
        `LOCKFILE-OVERRIDES: package.json's pnpm.overrides["${key}"] = "${expectedValue}" is missing from ` +
          `pnpm-lock.yaml's overrides snapshot entirely. This is the exact drift that broke PR #1382 — real ` +
          `pnpm's frozen-lockfile install (which CI always runs, see .github/actions/deps-setup) will refuse to ` +
          `proceed with a generic ERR_PNPM_LOCKFILE_CONFIG_MISMATCH. Run "pnpm install --no-frozen-lockfile" ` +
          `locally and commit the regenerated pnpm-lock.yaml.`
      );
      continue;
    }
    const actualValue = lockfileOverrides.get(key);
    if (actualValue !== expectedValue) {
      errors.push(
        `LOCKFILE-OVERRIDES: package.json's pnpm.overrides["${key}"] = "${expectedValue}" but pnpm-lock.yaml's ` +
          `overrides snapshot has "${actualValue}" for the same key. Run "pnpm install --no-frozen-lockfile" ` +
          `locally and commit the regenerated pnpm-lock.yaml.`
      );
    }
  }

  for (const key of lockfileOverrides.keys()) {
    if (!expected.has(key)) {
      errors.push(
        `LOCKFILE-OVERRIDES: pnpm-lock.yaml's overrides snapshot has "${key}" but package.json's pnpm.overrides ` +
          `does not declare it. A lockfile-only override that package.json disagrees with will trip the same ` +
          `frozen-install mismatch the other direction did in PR #1382 — either add it to package.json's ` +
          `pnpm.overrides or regenerate the lockfile so it drops out.`
      );
    }
  }

  return { errors };
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const packageJson = JSON.parse(readFileSync(resolve(repoRoot, 'package.json'), 'utf8'));
  const lockfileText = readFileSync(resolve(repoRoot, 'pnpm-lock.yaml'), 'utf8');
  const { errors } = evaluate(packageJson, lockfileText);

  if (errors.length > 0) {
    console.error(`[lockfile-overrides] ${errors.length} problem(s):`);
    for (const error of errors) console.error(`  - ${error}`);
    process.exit(1);
  }

  process.stdout.write("[lockfile-overrides] OK — pnpm-lock.yaml's overrides snapshot matches package.json.\n");
}
