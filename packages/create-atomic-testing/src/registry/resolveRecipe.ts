import { atomicDep } from '../constants';
import { generateFiles } from '../generate/generateFiles';
import type { DependencySpec, RecipePlan, RecipeSelection } from '../types';
import { RecipeResolutionError } from '../types';
import { resolveCompatibility } from './compatibility';
import { getDesignSystem } from './designSystems';
import { getFramework } from './frameworks';
import type { GenerationContext } from './pluginTypes';
import { getRunner } from './runners';

/** Merge dependency specs by name; a prod requirement wins over a dev one. */
function dedupe(deps: readonly DependencySpec[]): DependencySpec[] {
  const byName = new Map<string, DependencySpec>();
  for (const dep of deps) {
    const existing = byName.get(dep.name);
    if (!existing) {
      byName.set(dep.name, dep);
      continue;
    }
    // If either occurrence is a prod dep, the merged one is prod.
    byName.set(dep.name, { ...existing, dev: existing.dev !== false && dep.dev !== false });
  }
  return [...byName.values()];
}

function buildContext(selection: RecipeSelection): GenerationContext {
  return {
    selection,
    framework: getFramework(selection.framework),
    runner: getRunner(selection.runner),
    designSystem: getDesignSystem(selection.designSystem),
    ext: { test: selection.framework === 'react' ? 'tsx' : 'ts' },
  };
}

/**
 * Compose the three plugins for a selection into a ready-to-apply plan. Pure —
 * no filesystem access. Throws {@link RecipeResolutionError} for combinations
 * that are impossible, unregistered or disabled.
 */
export function resolveRecipe(selection: RecipeSelection): RecipePlan {
  const compat = resolveCompatibility(selection.framework, selection.runner, selection.designSystem);
  if (!compat.allowed) {
    throw new RecipeResolutionError(compat.code ?? 'E_COMBO', compat.message ?? 'Unsupported combination.');
  }

  const framework = getFramework(selection.framework);
  const designSystem = getDesignSystem(selection.designSystem);
  const engine = framework.enginePackage(selection.frameworkMajor);
  if (selection.runner !== 'playwright' && !engine) {
    throw new RecipeResolutionError(
      'E_UNSUPPORTED_MAJOR',
      `${framework.displayName} ${selection.frameworkMajor}.x has no atomic-testing engine package.`
    );
  }

  // One effective design-system major, used for BOTH the driver package and its
  // deps, so an unresolved major can never make the two disagree (e.g. an
  // Angular-21 project emitting the v22 Material driver). Each design system
  // owns its own fallback via defaultMajor (Angular Material tracks the Angular
  // major; React design systems return their own latest).
  const effectiveSelection: RecipeSelection = {
    ...selection,
    designSystemMajor: selection.designSystemMajor ?? designSystem.defaultMajor(selection.frameworkMajor),
    // Normalize the default-on agents flag to a concrete boolean, so generation
    // (and any untyped programmatic caller that omitted it) sees one source.
    agents: selection.agents ?? true,
  };
  const ctx = buildContext(effectiveSelection);
  const driver = designSystem.driverPackage(effectiveSelection.designSystemMajor);

  const common: DependencySpec[] = [atomicDep('core'), atomicDep('component-driver-html')];
  if (driver) common.push(atomicDep(driver));

  // Playwright drives a real browser, so it needs the playwright package instead
  // of an in-process framework engine + testing-library runtime.
  const engineDeps =
    ctx.runner.harness === 'playwright'
      ? [atomicDep('playwright')]
      : [atomicDep(engine as string), ...framework.runtimeDeps(selection.frameworkMajor)];
  const deps = [...common, ...engineDeps, ...designSystem.deps(ctx), ...ctx.runner.deps(ctx)];

  const warnings: string[] = [];
  if (compat.tier === 'experimental') {
    warnings.push(
      `This is an EXPERIMENTAL recipe: it is composed best-effort and is not proven by a green fixture. ${compat.note ?? ''}`.trim()
    );
  }
  if (!selection.typescript) {
    warnings.push(
      'Your project does not look like TypeScript, but the generated files are TypeScript. Add TypeScript, or convert the sample files to JS.'
    );
  }
  if (designSystem.usageNote) warnings.push(designSystem.usageNote);

  const nextSteps = [
    ...ctx.runner.nextSteps(ctx),
    'Replace the sample component in atomic-testing-example/ with your own.',
  ];
  // Point agents-on users at the skills the CLI just wrote — --no-agents users get no
  // mention of a feature they explicitly opted out of.
  if (effectiveSelection.agents) {
    nextSteps.push(
      'Using Claude Code? `.claude/skills/` and `CLAUDE.md` are ready to help write and maintain tests — see https://atomic-testing.dev/docs/guides/decomposing-driver-trees to learn how.'
    );
  }

  return {
    id: `${selection.framework}-${selection.frameworkMajor}+${selection.runner}+${selection.designSystem}`,
    // Report the effective selection (with the resolved design-system major) so
    // plan.selection matches the files/deps actually generated from it.
    selection: effectiveSelection,
    tier: compat.tier,
    dependencies: dedupe(deps),
    files: generateFiles(ctx),
    packageJsonPatch: { scripts: ctx.runner.scripts(ctx) },
    warnings,
    nextSteps,
  };
}
