import semver from 'semver';

export interface MajorResolution {
  /** The resolved major, or null when ambiguous or unresolvable. */
  readonly major: number | null;
  /** True when the range spans more than one major (e.g. `18 || 19`). */
  readonly ambiguous: boolean;
  /** True when the range is not a resolvable semver (e.g. `workspace:*`, `latest`). */
  readonly unresolvable: boolean;
}

const NON_SEMVER = /^(workspace:|link:|file:|npm:|catalog:|git|https?:|github:|[a-z]+\/)/i;
const DIST_TAGS = new Set(['*', '', 'latest', 'next', 'canary', 'beta', 'alpha', 'nightly', 'x']);

/**
 * Extract the major version a dependency range points at, distinguishing a
 * genuinely multi-major range (`18 || 19` → ambiguous) from a single open lower
 * bound (`>=19.0.0-rc.0` → 19). Pure; no filesystem or registry access.
 */
export function resolveMajor(rawRange: string | undefined | null): MajorResolution {
  if (rawRange == null) return { major: null, ambiguous: false, unresolvable: true };
  const range = rawRange.trim();
  if (DIST_TAGS.has(range) || NON_SEMVER.test(range)) {
    return { major: null, ambiguous: false, unresolvable: true };
  }

  let parsed: InstanceType<typeof semver.Range>;
  try {
    parsed = new semver.Range(range, { includePrerelease: true });
  } catch {
    return { major: null, ambiguous: false, unresolvable: true };
  }

  // Each entry in `set` is one OR-branch; its own minimum version tells us the
  // major that branch targets. Distinct majors across branches ⇒ ambiguous.
  const majors = new Set<number>();
  for (const branch of parsed.set) {
    const branchStr = branch
      .map(comparator => comparator.value)
      .filter(Boolean)
      .join(' ');
    let min: semver.SemVer | null = null;
    try {
      min = semver.minVersion(branchStr === '' ? '*' : branchStr);
    } catch {
      min = null;
    }
    if (min) majors.add(min.major);
  }

  if (majors.size === 0) return { major: null, ambiguous: false, unresolvable: true };
  if (majors.size > 1) return { major: null, ambiguous: true, unresolvable: false };
  return { major: [...majors][0], ambiguous: false, unresolvable: false };
}
