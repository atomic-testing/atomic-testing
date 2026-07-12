import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { LOCKFILE_TO_PM } from '../detect/detectPackageManager';
import type { PackageJsonLike, ProjectSnapshot } from '../types';

// Derived from the one lockfile→manager table so the two can't drift.
const LOCKFILES = LOCKFILE_TO_PM.map(([file]) => file);
const CONFIG_FILES = [
  'jest.config.js',
  'jest.config.cjs',
  'jest.config.mjs',
  'jest.config.ts',
  'vitest.config.ts',
  'vitest.config.js',
  'vitest.config.mts',
  'playwright.config.ts',
  'playwright.config.js',
];
const WORKSPACE_MARKERS = ['pnpm-workspace.yaml', 'lerna.json', 'nx.json'];

/**
 * The single impure boundary of detection: read the target directory into a
 * pure {@link ProjectSnapshot}. Everything downstream (`detect/`) is pure and
 * consumes only this. Kept out of `detect/` so the purity guard can forbid
 * `node:fs` there.
 */
export function readProject(root: string, userAgent = process.env.npm_config_user_agent): ProjectSnapshot {
  const pkgPath = join(root, 'package.json');
  let packageJson: PackageJsonLike | null = null;
  let packageJsonMalformed = false;
  if (existsSync(pkgPath)) {
    try {
      packageJson = JSON.parse(readFileSync(pkgPath, 'utf8')) as PackageJsonLike;
    } catch {
      packageJsonMalformed = true;
    }
  }

  const present = (names: readonly string[]): string[] => names.filter(name => existsSync(join(root, name)));

  return {
    root,
    packageJson,
    packageJsonMalformed,
    lockfiles: present(LOCKFILES),
    configFiles: present(CONFIG_FILES),
    hasTsConfig: existsSync(join(root, 'tsconfig.json')),
    hasComponentsJson: existsSync(join(root, 'components.json')),
    workspaceMarkers: present(WORKSPACE_MARKERS),
    userAgent,
  };
}
