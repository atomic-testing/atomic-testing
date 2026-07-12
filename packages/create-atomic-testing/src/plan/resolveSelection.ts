import { getFramework } from '../registry/frameworks';
import type { DesignSystemId, DetectResult, FrameworkId, PackageManagerId, RecipeSelection, RunnerId } from '../types';

/** Values a user can pin from the command line, overriding detection. */
export interface SelectionFlags {
  framework?: FrameworkId;
  frameworkMajor?: number;
  runner?: RunnerId;
  designSystem?: DesignSystemId;
  typescript?: boolean;
  packageManager?: PackageManagerId;
}

/** A selection in progress — required axes may be undefined until resolved. */
export interface SelectionDraft {
  framework?: FrameworkId;
  frameworkMajor?: number;
  runner?: RunnerId;
  designSystem: DesignSystemId;
  designSystemMajor: number | null;
  typescript: boolean;
  packageManager: PackageManagerId;
}

export type MissingField = 'framework' | 'framework-major' | 'runner' | 'design-system';

/** Seed a draft from detection, with flags taking precedence over detected values. */
export function buildDraft(detect: DetectResult, flags: SelectionFlags): SelectionDraft {
  const framework = flags.framework ?? detect.framework?.id;
  const runner =
    flags.runner ??
    detect.runner ??
    (framework && framework !== 'none' ? getFramework(framework).defaultRunner : undefined);
  return {
    framework,
    frameworkMajor: flags.frameworkMajor ?? detect.framework?.major ?? undefined,
    runner,
    designSystem: flags.designSystem ?? detect.designSystem?.id ?? 'html',
    designSystemMajor: detect.designSystem?.major ?? null,
    typescript: flags.typescript ?? detect.typescript,
    packageManager: flags.packageManager ?? detect.packageManager,
  };
}

/** Axes that still need a decision (a prompt, or a flag in non-interactive mode). */
export function missingFields(draft: SelectionDraft): MissingField[] {
  const missing: MissingField[] = [];
  if (!draft.framework || draft.framework === 'none') {
    missing.push('framework');
    return missing;
  }
  if (draft.frameworkMajor == null) missing.push('framework-major');
  if (!draft.runner) missing.push('runner');
  return missing;
}

/** The CLI flag that resolves each missing field, for actionable error messages. */
export const FLAG_FOR: Record<MissingField, string> = {
  framework: '--framework <react|vue|angular>',
  'framework-major': '--framework-major <number>',
  runner: '--runner <jest|vitest|vitest-browser|playwright>',
  'design-system': '--design-system <html|mui|...>',
};

/** Convert a complete draft into a {@link RecipeSelection}. Throws if incomplete. */
export function toSelection(draft: SelectionDraft): RecipeSelection {
  if (!draft.framework || draft.framework === 'none' || draft.frameworkMajor == null || !draft.runner) {
    throw new Error('Cannot build a selection from an incomplete draft.');
  }
  return {
    framework: draft.framework,
    frameworkMajor: draft.frameworkMajor,
    runner: draft.runner,
    designSystem: draft.designSystem,
    designSystemMajor: draft.designSystemMajor,
    typescript: draft.typescript,
    packageManager: draft.packageManager,
  };
}
