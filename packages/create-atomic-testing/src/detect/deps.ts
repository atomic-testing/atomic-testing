import type { PackageJsonLike } from '../types';

/**
 * Merge dependencies / devDependencies / peerDependencies into one lookup.
 * A framework or design system counts as "present" whichever bucket it lives in
 * (an app may list `react` in `dependencies` but `@testing-library/react` in
 * `devDependencies`), so detection reads the union.
 */
export function mergedDeps(pkg: PackageJsonLike | null): Record<string, string> {
  if (!pkg) return {};
  return {
    ...(pkg.dependencies ?? {}),
    ...(pkg.peerDependencies ?? {}),
    ...(pkg.devDependencies ?? {}),
  };
}
