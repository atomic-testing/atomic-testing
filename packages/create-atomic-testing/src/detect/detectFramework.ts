import type { AmbiguityKind, DetectedFramework, Diagnostic, FrameworkId, PackageJsonLike } from '../types';
import { mergedDeps } from './deps';
import { resolveMajor } from './semverMajor';

export interface FrameworkDetection {
  readonly framework: DetectedFramework | null;
  readonly ambiguities: readonly AmbiguityKind[];
  readonly diagnostics: readonly Diagnostic[];
}

/** Canonical presence markers. `@angular/core` (not platform-browser) anchors Angular. */
const MARKERS: Record<Exclude<FrameworkId, 'none'>, string> = {
  react: 'react',
  vue: 'vue',
  angular: '@angular/core',
};

/**
 * Decide the UI framework and its major from a package.json. Never silently
 * picks one framework when two are present — it flags `framework` ambiguous and
 * leaves the choice to a prompt (or a hard error in non-interactive mode).
 */
export function detectFramework(pkg: PackageJsonLike | null): FrameworkDetection {
  const deps = mergedDeps(pkg);
  const present = (Object.keys(MARKERS) as Array<Exclude<FrameworkId, 'none'>>).filter(id => deps[MARKERS[id]] != null);

  if (present.length === 0) {
    return { framework: { id: 'none', major: null }, ambiguities: [], diagnostics: [] };
  }

  if (present.length > 1) {
    return {
      framework: null,
      ambiguities: ['framework'],
      diagnostics: [
        {
          level: 'warn',
          code: 'E_AMBIGUOUS_FRAMEWORK',
          message: `Multiple UI frameworks detected (${present.join(', ')}). Choose one with --framework.`,
        },
      ],
    };
  }

  const id = present[0];
  const { major, ambiguous, unresolvable } = resolveMajor(deps[MARKERS[id]]);
  const ambiguities: AmbiguityKind[] = [];
  const diagnostics: Diagnostic[] = [];

  if (ambiguous || unresolvable) {
    ambiguities.push('framework-major');
    diagnostics.push({
      level: 'warn',
      code: unresolvable ? 'E_UNRESOLVABLE_MAJOR' : 'E_AMBIGUOUS_MAJOR',
      message: `Could not resolve a single ${id} major from "${deps[MARKERS[id]]}". Set --framework-major.`,
    });
  }

  // React/react-dom major skew is a real breakage; surface it.
  if (id === 'react' && deps['react-dom'] != null) {
    const domMajor = resolveMajor(deps['react-dom']).major;
    if (major != null && domMajor != null && domMajor !== major) {
      diagnostics.push({
        level: 'error',
        code: 'E_REACT_DOM_MISMATCH',
        message: `react (${major}.x) and react-dom (${domMajor}.x) majors disagree; align them before scaffolding.`,
      });
    }
  }

  return { framework: { id, major: ambiguous || unresolvable ? null : major }, ambiguities, diagnostics };
}
