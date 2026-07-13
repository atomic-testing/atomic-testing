import { cancel, confirm, isCancel, select } from '@clack/prompts';

import type { SelectionDraft } from '../plan/resolveSelection';
import { toSelection } from '../plan/resolveSelection';
import { offeredRunners } from '../registry/compatibility';
import { designSystemsForFramework } from '../registry/designSystems';
import { getFramework } from '../registry/frameworks';
import { getRunner } from '../registry/runners';
import type { DesignSystemId, FrameworkId, PackageManagerId, RecipeSelection, RunnerId } from '../types';

const CANCELLED = Symbol('cancelled');

function unwrap<T>(value: T | symbol): T | typeof CANCELLED {
  return isCancel(value) ? CANCELLED : (value as T);
}

/**
 * Confirm/override each detected axis with the user (Clack). Returns a complete
 * selection, or null if the user cancels. Only reached when attached to a TTY.
 */
type UIFramework = Exclude<FrameworkId, 'none'>;

export async function runInteractive(draft: SelectionDraft): Promise<RecipeSelection | null> {
  let framework: UIFramework | undefined = draft.framework && draft.framework !== 'none' ? draft.framework : undefined;
  if (!framework) {
    const chosen = unwrap(
      await select<UIFramework>({
        message: 'Which UI framework does this project use?',
        options: (['react', 'vue', 'angular'] as UIFramework[]).map(id => ({
          value: id,
          label: getFramework(id).displayName,
        })),
        initialValue: 'react',
      })
    );
    if (chosen === CANCELLED) return abort();
    framework = chosen;
  }

  // Only honor a carried-over major if it is valid for the chosen framework —
  // otherwise an out-of-range major would slip past the prompt into resolveRecipe.
  let frameworkMajor =
    draft.frameworkMajor != null && getFramework(framework).supportedMajors.includes(draft.frameworkMajor)
      ? draft.frameworkMajor
      : undefined;
  if (frameworkMajor == null) {
    const majors = getFramework(framework).supportedMajors;
    const chosen = unwrap(
      await select({
        message: `Which ${framework} major version?`,
        options: majors.map(m => ({ value: m, label: `${m}.x` })),
        initialValue: majors[majors.length - 1],
      })
    );
    if (chosen === CANCELLED) return abort();
    frameworkMajor = chosen;
  }

  const dsChoices = designSystemsForFramework(framework);
  const designSystem = unwrap(
    await select({
      message: 'Which design system are you testing?',
      options: dsChoices.map(ds => ({ value: ds.id, label: ds.displayName })),
      initialValue: (dsChoices.some(d => d.id === draft.designSystem) ? draft.designSystem : 'html') as DesignSystemId,
    })
  );
  if (designSystem === CANCELLED) return abort();

  const runnerChoices = offeredRunners(framework, designSystem);
  const runner = unwrap(
    await select({
      message: 'Which test runner?',
      options: runnerChoices.map(r => ({
        value: r.runner,
        label: `${getRunner(r.runner).displayName}${r.tier === 'experimental' ? '  (experimental)' : ''}`,
      })),
      initialValue: (runnerChoices.some(r => r.runner === draft.runner)
        ? draft.runner
        : runnerChoices[0]?.runner) as RunnerId,
    })
  );
  if (runner === CANCELLED) return abort();

  const packageManager = unwrap(
    await select({
      message: 'Which package manager?',
      options: (['pnpm', 'npm', 'yarn', 'bun'] as PackageManagerId[]).map(pm => ({ value: pm, label: pm })),
      initialValue: draft.packageManager,
    })
  );
  if (packageManager === CANCELLED) return abort();

  return toSelection({
    framework,
    frameworkMajor,
    runner,
    designSystem,
    // The detected major only applies if the user kept the detected design
    // system; if they switched, drop it (resolveRecipe derives a safe default).
    designSystemMajor: designSystem === draft.designSystem ? draft.designSystemMajor : null,
    typescript: draft.typescript,
    packageManager,
    // Agents default on and are only opted out via the `--no-agents` flag, so the
    // interactive flow carries the draft's value rather than adding a prompt.
    agents: draft.agents,
  });
}

/** Prompt whether to install dependencies now (the "ask at runtime" behavior). */
export async function promptInstall(): Promise<boolean | null> {
  const answer = unwrap(await confirm({ message: 'Install the dependencies now?', initialValue: true }));
  if (answer === CANCELLED) return null;
  return answer;
}

/** Final confirmation gate before touching disk. */
export async function promptProceed(): Promise<boolean> {
  const answer = unwrap(await confirm({ message: 'Write these files and update package.json?', initialValue: true }));
  return answer === CANCELLED ? false : answer;
}

function abort(): null {
  cancel('Cancelled — nothing was written.');
  return null;
}
