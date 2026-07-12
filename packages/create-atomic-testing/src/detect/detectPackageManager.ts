import type { AmbiguityKind, PackageManagerId, ProjectSnapshot } from '../types';

export interface PackageManagerDetection {
  readonly packageManager: PackageManagerId;
  readonly ambiguities: readonly AmbiguityKind[];
}

const LOCKFILE_TO_PM: ReadonlyArray<readonly [string, PackageManagerId]> = [
  ['pnpm-lock.yaml', 'pnpm'],
  ['yarn.lock', 'yarn'],
  ['bun.lock', 'bun'],
  ['bun.lockb', 'bun'],
  ['package-lock.json', 'npm'],
  ['npm-shrinkwrap.json', 'npm'],
];

/** Deterministic precedence used to break ties when several signals disagree. */
const PRECEDENCE: readonly PackageManagerId[] = ['pnpm', 'yarn', 'bun', 'npm'];

function fromUserAgent(userAgent: string | undefined): PackageManagerId | null {
  if (!userAgent) return null;
  const name = userAgent.split('/')[0]?.toLowerCase();
  if (name === 'pnpm' || name === 'yarn' || name === 'bun' || name === 'npm') return name;
  return null;
}

function fromPackageManagerField(field: string | undefined): PackageManagerId | null {
  if (!field) return null;
  const name = field.split('@')[0]?.toLowerCase();
  if (name === 'pnpm' || name === 'yarn' || name === 'bun' || name === 'npm') return name;
  return null;
}

/**
 * Resolve the package manager. Precedence: lockfile → `packageManager` field →
 * `npm_config_user_agent` → npm default. Multiple lockfiles resolve by
 * {@link PRECEDENCE} and flag `package-manager` ambiguous so the choice can be
 * confirmed.
 */
export function detectPackageManager(snapshot: ProjectSnapshot): PackageManagerDetection {
  const lockPms = LOCKFILE_TO_PM.filter(([lock]) => snapshot.lockfiles.includes(lock)).map(([, pm]) => pm);
  const uniqueLockPms = [...new Set(lockPms)];

  if (uniqueLockPms.length === 1) {
    return { packageManager: uniqueLockPms[0], ambiguities: [] };
  }
  if (uniqueLockPms.length > 1) {
    const winner = PRECEDENCE.find(pm => uniqueLockPms.includes(pm)) ?? 'npm';
    return { packageManager: winner, ambiguities: ['package-manager'] };
  }

  const field = fromPackageManagerField(snapshot.packageJson?.packageManager);
  if (field) return { packageManager: field, ambiguities: [] };

  const ua = fromUserAgent(snapshot.userAgent);
  if (ua) return { packageManager: ua, ambiguities: [] };

  return { packageManager: 'npm', ambiguities: [] };
}
