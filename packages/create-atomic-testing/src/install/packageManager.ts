import type { DependencySpec, PackageManagerId } from '../types';

const ADD_PREFIX: Record<PackageManagerId, { prod: string; dev: string }> = {
  npm: { prod: 'npm install --save', dev: 'npm install --save-dev' },
  pnpm: { prod: 'pnpm add', dev: 'pnpm add -D' },
  yarn: { prod: 'yarn add', dev: 'yarn add -D' },
  bun: { prod: 'bun add', dev: 'bun add -d' },
};

/** Canonical package-manager id list — the single source used for validation. */
export const PACKAGE_MANAGER_IDS = Object.keys(ADD_PREFIX) as PackageManagerId[];

const EXEC_PREFIX: Record<PackageManagerId, string> = {
  npm: 'npx',
  pnpm: 'pnpm exec',
  yarn: 'yarn',
  bun: 'bunx',
};

function spec(dep: DependencySpec): string {
  return `${dep.name}@${dep.range}`;
}

/**
 * Split deps into prod/dev buckets and return the exact install command(s) for
 * a package manager. Optional peers are appended to whichever bucket they belong
 * to (they still need explicit install on npm/yarn, which — unlike pnpm — do not
 * auto-install peers).
 */
export function addCommands(pm: PackageManagerId, deps: readonly DependencySpec[]): string[] {
  const prod = deps.filter(d => !d.dev).map(spec);
  const dev = deps.filter(d => d.dev).map(spec);
  const commands: string[] = [];
  if (prod.length > 0) commands.push(`${ADD_PREFIX[pm].prod} ${prod.join(' ')}`);
  if (dev.length > 0) commands.push(`${ADD_PREFIX[pm].dev} ${dev.join(' ')}`);
  return commands;
}

/** Format a `<pm> exec`-style command, e.g. `pnpm exec jest` / `npx jest`. */
export function execCommand(pm: PackageManagerId, bin: string, args = ''): string {
  return `${EXEC_PREFIX[pm]} ${bin}${args ? ` ${args}` : ''}`.trim();
}
