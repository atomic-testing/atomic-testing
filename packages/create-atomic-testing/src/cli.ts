#!/usr/bin/env node
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';

import pc from 'picocolors';

import { applyPlan } from './apply/applyPlan';
import { ATOMIC_VERSION } from './constants';
import { detect } from './detect';
import { addCommands } from './install/packageManager';
import { runInstall } from './install/runInstall';
import { readProject } from './io/readProject';
import { buildDraft, FLAG_FOR, missingFields, toSelection } from './plan/resolveSelection';
import type { SelectionFlags } from './plan/resolveSelection';
import { promptInstall, promptProceed, runInteractive } from './prompt/interactive';
import { resolveRecipe } from './registry/resolveRecipe';
import type { DependencySpec, DesignSystemId, FrameworkId, PackageManagerId, RecipePlan, RunnerId } from './types';
import { RecipeResolutionError } from './types';

/** Documented exit codes (the `E_*` → code contract). */
const EXIT = { ok: 0, cancelled: 1, usage: 2, ambiguous: 3, unsupported: 4, writeFailed: 5 } as const;

const FRAMEWORKS: readonly FrameworkId[] = ['react', 'vue', 'angular', 'none'];
const RUNNERS: readonly RunnerId[] = ['jest', 'vitest', 'vitest-browser', 'playwright'];
const DESIGN_SYSTEMS: readonly DesignSystemId[] = [
  'html',
  'mui',
  'mui-x',
  'angular-material',
  'primevue',
  'radix',
  'shadcn',
  'astryx',
];
const PACKAGE_MANAGERS: readonly PackageManagerId[] = ['npm', 'pnpm', 'yarn', 'bun'];

class UsageError extends Error {}

function oneOf<T extends string>(value: string | undefined, allowed: readonly T[], flag: string): T | undefined {
  if (value == null) return undefined;
  if (!(allowed as readonly string[]).includes(value)) {
    throw new UsageError(`Invalid value for ${flag}: "${value}". Allowed: ${allowed.join(', ')}.`);
  }
  return value as T;
}

const HELP = `${pc.bold('create-atomic-testing')} — scaffold Atomic Testing into an existing project.

${pc.bold('Usage')}
  npm create atomic-testing@latest [-- <options>]
  pnpm create atomic-testing [<options>]

${pc.bold('Options')}
  --framework <react|vue|angular>   Override framework detection
  --framework-major <number>        Override the framework major version
  --runner <jest|vitest|vitest-browser|playwright>
  --design-system <html|mui|mui-x|angular-material|primevue|radix|shadcn|astryx>
  --package-manager <npm|pnpm|yarn|bun>
  --typescript / --no-typescript    Force TypeScript on/off (default: detect)
  --dir <path>                      Target directory (default: cwd)
  -y, --yes                         Accept detected values, do not prompt
  --ci                              Non-interactive (implied when not a TTY)
  --dry-run                         Show what would happen; write nothing
  --install / --no-install          Force install / skip install (default: ask)
  -h, --help                        Show this help
  -v, --version                     Print version
`;

function parse(argv: string[]) {
  return parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      framework: { type: 'string' },
      'framework-major': { type: 'string' },
      runner: { type: 'string' },
      'design-system': { type: 'string' },
      'package-manager': { type: 'string' },
      typescript: { type: 'boolean' },
      'no-typescript': { type: 'boolean' },
      dir: { type: 'string' },
      yes: { type: 'boolean', short: 'y' },
      ci: { type: 'boolean' },
      'dry-run': { type: 'boolean' },
      install: { type: 'boolean' },
      'no-install': { type: 'boolean' },
      help: { type: 'boolean', short: 'h' },
      version: { type: 'boolean', short: 'v' },
    },
  });
}

function flagsFromArgs(values: Record<string, unknown>): SelectionFlags {
  const majorRaw = values['framework-major'] as string | undefined;
  const major = majorRaw != null ? Number(majorRaw) : undefined;
  if (major != null && !Number.isInteger(major)) {
    throw new UsageError(`--framework-major must be an integer, got "${majorRaw}".`);
  }
  return {
    framework: oneOf(values.framework as string | undefined, FRAMEWORKS, '--framework'),
    frameworkMajor: major,
    runner: oneOf(values.runner as string | undefined, RUNNERS, '--runner'),
    designSystem: oneOf(values['design-system'] as string | undefined, DESIGN_SYSTEMS, '--design-system'),
    packageManager: oneOf(values['package-manager'] as string | undefined, PACKAGE_MANAGERS, '--package-manager'),
    typescript: values.typescript === true ? true : values['no-typescript'] === true ? false : undefined,
  };
}

function printSummary(plan: RecipePlan): void {
  const tier = plan.tier === 'verified' ? pc.green('verified') : pc.yellow('experimental');
  console.log(`\n${pc.bold('Recipe:')} ${plan.id}  [${tier}]`);
  console.log(pc.bold('\nPackages to add:'));
  for (const dep of plan.dependencies) console.log(`  ${dep.name}@${dep.range}${dep.dev ? pc.dim(' (dev)') : ''}`);
  console.log(pc.bold('\nFiles to write:'));
  for (const file of plan.files) console.log(`  ${file.path}`);
  if (plan.packageJsonPatch.scripts) {
    console.log(pc.bold('\npackage.json scripts:'));
    for (const [k, v] of Object.entries(plan.packageJsonPatch.scripts)) console.log(`  "${k}": "${v}"`);
  }
  for (const warning of plan.warnings) console.warn(pc.yellow(`\n! ${warning}`));
}

function printInstallCommands(pm: PackageManagerId, deps: readonly DependencySpec[]): void {
  console.log(pc.bold('\nInstall the dependencies with:'));
  for (const command of addCommands(pm, deps)) console.log(`  ${command}`);
}

async function main(argv: string[]): Promise<number> {
  let parsed: ReturnType<typeof parse>;
  try {
    parsed = parse(argv);
  } catch (error) {
    console.error(pc.red((error as Error).message));
    console.error(HELP);
    return EXIT.usage;
  }
  const values = parsed.values as Record<string, unknown>;

  if (values.help) {
    console.log(HELP);
    return EXIT.ok;
  }
  if (values.version) {
    console.log(ATOMIC_VERSION);
    return EXIT.ok;
  }

  let flags: SelectionFlags;
  try {
    flags = flagsFromArgs(values);
  } catch (error) {
    console.error(pc.red((error as Error).message));
    return EXIT.usage;
  }

  const root = resolve((values.dir as string | undefined) ?? process.cwd());
  const snapshot = readProject(root);
  if (snapshot.packageJsonMalformed) {
    console.error(pc.red(`package.json in ${root} could not be parsed. Fix it and re-run.`));
    return EXIT.usage;
  }
  if (snapshot.packageJson == null) {
    console.error(pc.red(`No package.json found in ${root}. Run this inside your project (or pass --dir).`));
    return EXIT.usage;
  }

  const detection = detect(snapshot);
  for (const diag of detection.diagnostics) {
    if (diag.level === 'error') console.warn(pc.yellow(`! ${diag.message}`));
  }

  const ci = values.ci === true || process.env.CI != null;
  const interactive = Boolean(process.stdout.isTTY) && !ci && values.yes !== true;

  const draft = buildDraft(detection, flags);

  let selection;
  if (interactive) {
    selection = await runInteractive(draft);
    if (!selection) return EXIT.cancelled;
  } else {
    const missing = missingFields(draft);
    if (missing.length > 0) {
      console.error(pc.red('Could not determine: ' + missing.join(', ') + '.'));
      console.error('Set ' + missing.map(m => FLAG_FOR[m]).join(', ') + ' — or run in an interactive terminal.');
      return EXIT.ambiguous;
    }
    selection = toSelection(draft);
  }

  let plan: RecipePlan;
  try {
    plan = resolveRecipe(selection);
  } catch (error) {
    if (error instanceof RecipeResolutionError) {
      console.error(pc.red(`${error.code}: ${error.message}`));
      return EXIT.unsupported;
    }
    throw error;
  }

  printSummary(plan);

  const dryRun = values['dry-run'] === true;
  if (interactive && !dryRun && !(await promptProceed())) return EXIT.cancelled;

  let result;
  try {
    result = applyPlan(plan, root, { dryRun });
  } catch (error) {
    console.error(pc.red(`Failed to write files: ${(error as Error).message}`));
    return EXIT.writeFailed;
  }

  console.log('');
  for (const file of result.files) {
    const label =
      file.outcome === 'written'
        ? pc.green(dryRun ? 'would create' : 'created')
        : file.outcome === 'wrote-example'
          ? pc.yellow(dryRun ? 'exists → would write' : 'exists → wrote')
          : pc.dim('unchanged');
    console.log(`  ${label}  ${file.path}`);
  }
  for (const conflict of result.scriptsConflicted) {
    console.warn(pc.yellow(`  ! package.json already has a "${conflict}" script — left untouched.`));
  }

  if (dryRun) {
    console.log(pc.bold('\nDry run — nothing was written.'));
    printInstallCommands(selection.packageManager, plan.dependencies);
    return EXIT.ok;
  }

  const installMode = values['no-install'] === true ? 'print' : values.install === true ? 'run' : 'ask';
  let doInstall = installMode === 'run';
  if (installMode === 'ask') {
    if (interactive) {
      const answer = await promptInstall();
      if (answer == null) return EXIT.cancelled;
      doInstall = answer;
    } else {
      doInstall = false; // safest default when we cannot ask
    }
  }

  if (doInstall) {
    const steps = runInstall(selection.packageManager, plan.dependencies, root);
    const failed = steps.find(s => s.code !== 0 || s.error);
    if (failed) {
      console.error(pc.red(`\nInstall command failed: ${failed.command}`));
      printInstallCommands(selection.packageManager, plan.dependencies);
      return EXIT.cancelled;
    }
  } else {
    printInstallCommands(selection.packageManager, plan.dependencies);
  }

  console.log(pc.bold('\nNext steps:'));
  for (const step of plan.nextSteps) console.log(`  ${step}`);
  console.log(pc.green('\nDone. Happy testing!'));
  return EXIT.ok;
}

main(process.argv.slice(2))
  .then(code => {
    process.exitCode = code;
  })
  .catch(error => {
    console.error(pc.red(`Unexpected error: ${(error as Error)?.stack ?? error}`));
    process.exitCode = EXIT.cancelled;
  });
