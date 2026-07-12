import { existsSync, lstatSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

import type { PackageJsonLike, RecipePlan } from '../types';

export type FileOutcome = 'written' | 'skipped-identical' | 'wrote-example';

export interface ApplyFileResult {
  readonly path: string;
  readonly outcome: FileOutcome;
}

export interface ApplyResult {
  readonly files: readonly ApplyFileResult[];
  readonly scriptsAdded: readonly string[];
  readonly scriptsConflicted: readonly string[];
  readonly dryRun: boolean;
}

export interface ApplyOptions {
  readonly dryRun?: boolean;
}

class PathEscapeError extends Error {
  constructor(rel: string) {
    super(`Refusing to write outside the target directory: ${rel}`);
    this.name = 'PathEscapeError';
  }
}

/** Resolve `rel` under `root` (with `realRoot` = `realpathSync(root)`), refusing escapes. */
function resolveInside(root: string, realRoot: string, rel: string): string {
  const abs = resolve(root, rel);
  const rl = relative(root, abs);
  if (rl === '' || rl.startsWith('..') || resolve(root, rl) !== abs) {
    throw new PathEscapeError(rel);
  }
  // Refuse to write through an existing symlink at the destination, and
  // re-assert containment against the realpath of the deepest existing
  // ancestor — so a symlinked parent directory can't redirect the write out.
  if (existsSync(abs) && lstatSync(abs).isSymbolicLink()) {
    throw new PathEscapeError(rel);
  }
  let ancestor = dirname(abs);
  while (!existsSync(ancestor) && dirname(ancestor) !== ancestor) ancestor = dirname(ancestor);
  const realAncestor = realpathSync(ancestor);
  const rr = relative(realRoot, realAncestor);
  if (rr !== '' && (rr.startsWith('..') || resolve(realRoot, rr) !== realAncestor)) {
    throw new PathEscapeError(rel);
  }
  return abs;
}

function write(dest: string, contents: string, dryRun: boolean): void {
  if (dryRun) return;
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, contents, 'utf8');
}

/**
 * Apply a plan to disk. The only side-effecting module besides `io/`.
 *
 * Guarantees: never overwrites a differing file (writes `<path>.atomic-example`
 * instead and reports it); re-running is idempotent (identical files are
 * skipped); package.json scripts merge additively (an existing, differing script
 * is reported, never clobbered); every path is contained within the target root;
 * and `dryRun` performs zero writes while reporting exactly what would happen.
 */
export function applyPlan(plan: RecipePlan, root: string, options: ApplyOptions = {}): ApplyResult {
  const dryRun = options.dryRun === true;
  const files: ApplyFileResult[] = [];
  const realRoot = realpathSync(root); // constant for the run; resolved once

  for (const op of plan.files) {
    const dest = resolveInside(root, realRoot, op.path);

    if (!existsSync(dest)) {
      write(dest, op.contents, dryRun);
      files.push({ path: op.path, outcome: 'written' });
      continue;
    }

    if (readFileSync(dest, 'utf8') === op.contents) {
      files.push({ path: op.path, outcome: 'skipped-identical' });
      continue;
    }

    // File exists and differs — never clobber. Write a sibling example instead.
    const examplePath = `${op.path}.atomic-example`;
    const exDest = resolveInside(root, realRoot, examplePath);
    if (existsSync(exDest) && readFileSync(exDest, 'utf8') === op.contents) {
      files.push({ path: examplePath, outcome: 'skipped-identical' });
      continue;
    }
    write(exDest, op.contents, dryRun);
    files.push({ path: examplePath, outcome: 'wrote-example' });
  }

  const { scriptsAdded, scriptsConflicted } = mergeScripts(plan, root, dryRun);
  return { files, scriptsAdded, scriptsConflicted, dryRun };
}

function mergeScripts(
  plan: RecipePlan,
  root: string,
  dryRun: boolean
): { scriptsAdded: string[]; scriptsConflicted: string[] } {
  const scripts = plan.packageJsonPatch.scripts ?? {};
  const scriptsAdded: string[] = [];
  const scriptsConflicted: string[] = [];
  if (Object.keys(scripts).length === 0) return { scriptsAdded, scriptsConflicted };

  const pkgPath = join(root, 'package.json');
  const raw = existsSync(pkgPath) ? readFileSync(pkgPath, 'utf8') : '';
  const pkg: PackageJsonLike = raw ? (JSON.parse(raw) as PackageJsonLike) : {};
  const existing = { ...(pkg.scripts ?? {}) };
  let changed = false;

  for (const [key, value] of Object.entries(scripts)) {
    if (existing[key] == null) {
      existing[key] = value;
      scriptsAdded.push(key);
      changed = true;
    } else if (existing[key] !== value) {
      scriptsConflicted.push(key);
    }
  }

  if (changed && !dryRun) {
    pkg.scripts = existing;
    // Preserve the file's own indentation and trailing-newline convention so we
    // don't reformat the whole manifest just to add a script.
    const indentMatch = raw.match(/\n([ \t]+)"/);
    const indent: string | number = indentMatch ? indentMatch[1] : 2;
    const trailingNewline = raw === '' || raw.endsWith('\n');
    writeFileSync(pkgPath, `${JSON.stringify(pkg, null, indent)}${trailingNewline ? '\n' : ''}`, 'utf8');
  }
  return { scriptsAdded, scriptsConflicted };
}
