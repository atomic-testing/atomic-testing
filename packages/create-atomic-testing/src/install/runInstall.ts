import { spawnSync } from 'node:child_process';

import type { DependencySpec, PackageManagerId } from '../types';
import { addCommands } from './packageManager';

export interface InstallStep {
  readonly command: string;
  readonly code: number;
  readonly error?: string;
}

/**
 * Run the package manager's add command(s) in `root`. Stops on the first
 * failure. Kept isolated (spawns a process) so the rest of the pipeline stays
 * pure and testable; the CLI decides whether to call this or just print the
 * commands.
 */
export function runInstall(pm: PackageManagerId, deps: readonly DependencySpec[], root: string): InstallStep[] {
  const steps: InstallStep[] = [];
  for (const command of addCommands(pm, deps)) {
    const [bin, ...args] = command.split(' ');
    const result = spawnSync(bin, args, {
      cwd: root,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });
    const code = result.status ?? 1;
    steps.push({ command, code, error: result.error?.message });
    if (code !== 0 || result.error) break;
  }
  return steps;
}
