import type { AmbiguityKind, DetectResult, Diagnostic, ProjectSnapshot } from '../types';
import { detectDesignSystem } from './detectDesignSystem';
import { detectTypeScript, detectMonorepo } from './detectEnvironment';
import { detectFramework } from './detectFramework';
import { detectPackageManager } from './detectPackageManager';
import { detectRunner } from './detectRunner';

/**
 * Inspect a {@link ProjectSnapshot} and produce a {@link DetectResult}. Pure:
 * every input is on the snapshot, so this whole subtree is unit-testable from
 * fixtures and the purity guard can forbid `node:fs` here.
 */
export function detect(snapshot: ProjectSnapshot): DetectResult {
  const diagnostics: Diagnostic[] = [];
  const ambiguities: AmbiguityKind[] = [];

  if (snapshot.packageJsonMalformed) {
    diagnostics.push({
      level: 'error',
      code: 'E_MALFORMED_PACKAGE_JSON',
      message: 'package.json is present but could not be parsed as JSON.',
    });
  } else if (snapshot.packageJson == null) {
    diagnostics.push({
      level: 'error',
      code: 'E_NO_PACKAGE_JSON',
      message: 'No package.json found in the target directory.',
    });
  }

  const fw = detectFramework(snapshot.packageJson);
  const pm = detectPackageManager(snapshot);
  const design = detectDesignSystem(snapshot);

  ambiguities.push(...fw.ambiguities, ...pm.ambiguities);
  diagnostics.push(...fw.diagnostics);

  return {
    framework: fw.framework,
    runner: detectRunner(snapshot),
    packageManager: pm.packageManager,
    typescript: detectTypeScript(snapshot),
    monorepo: detectMonorepo(snapshot),
    designSystem: design,
    ambiguities,
    diagnostics,
  };
}
