/**
 * Programmatic API for the Atomic Testing scaffolder.
 *
 * The CLI (`bin`) is a thin driver over these pieces; they are exported so the
 * detection, recipe resolution and generation can be reused or tested directly.
 */

export * from './types';
export { ATOMIC_RANGE, ATOMIC_VERSION, atomicDep, THIRD_PARTY } from './constants';

// Detection (pure)
export {
  detect,
  detectDesignSystem,
  detectFramework,
  detectMonorepo,
  detectPackageManager,
  detectRunner,
  detectTypeScript,
  resolveMajor,
} from './detect';
export type { FrameworkDetection, MajorResolution, PackageManagerDetection } from './detect';

// Registry + composition (pure)
export {
  COMPATIBILITY,
  DESIGN_SYSTEMS,
  designSystemsForFramework,
  EXAMPLE_COMPONENT_NAME,
  FRAMEWORKS,
  getDesignSystem,
  getFramework,
  getRunner,
  offeredRunners,
  resolveCompatibility,
  resolveRecipe,
  RUNNERS,
} from './registry';
export type {
  CompatResult,
  CompatRule,
  DesignSystemPlugin,
  FrameworkPlugin,
  GenerationContext,
  RunnerPlugin,
} from './registry';

// Generation (pure)
export { EXAMPLE_DIR, generateFiles } from './generate/generateFiles';

// Selection planning (pure)
export { buildDraft, FLAG_FOR, missingFields, toSelection } from './plan/resolveSelection';
export type { MissingField, SelectionDraft, SelectionFlags } from './plan/resolveSelection';

// Package-manager command formatting (pure)
export { addCommands, execCommand } from './install/packageManager';

// I/O boundary + apply seam (side-effecting)
export { readProject } from './io/readProject';
export { applyPlan } from './apply/applyPlan';
export type { ApplyFileResult, ApplyOptions, ApplyResult, FileOutcome } from './apply/applyPlan';
