import type { GenerationContext } from '../registry/pluginTypes';
import type { FileOp } from '../types';
import { EMBEDDED_SKILLS } from './skillContent.generated';

/**
 * Emit the testing agent skills and the project-root agent guides (CLAUDE.md +
 * AGENTS.md) when the `agents` feature is on (default). Pure — like the rest of
 * `generate/`, it returns file operations and never touches disk.
 *
 * All four skills are emitted verbatim: they form a lifecycle
 * (scaffold → author → diagnose → sync) and cross-reference each other by name,
 * and none is design-system-specific, so a subset would break their internal
 * handoffs while saving nothing. The stack-specific adaptation lives in the
 * CLAUDE.md guide instead, which names exactly what was detected/installed —
 * keeping the carefully-worded skill prose the single source of truth.
 */
export function skillFileOps(ctx: GenerationContext): FileOp[] {
  if (ctx.selection.agents === false) {
    return [];
  }
  const skills: FileOp[] = EMBEDDED_SKILLS.map(skill => ({
    path: skill.targetPath,
    kind: 'skill-file',
    contents: skill.contents,
  }));
  return [...skills, ...agentGuideFiles(ctx)];
}

function enginePackage(ctx: GenerationContext): string {
  if (ctx.runner.harness === 'playwright') {
    return '@atomic-testing/playwright';
  }
  const engine = ctx.framework.enginePackage(ctx.selection.frameworkMajor);
  return engine ? `@atomic-testing/${engine}` : '@atomic-testing/core';
}

function driverPackage(ctx: GenerationContext): string {
  const driver = ctx.designSystem.driverPackage(ctx.selection.designSystemMajor);
  return `@atomic-testing/${driver ?? 'component-driver-html'}`;
}

function testCommand(ctx: GenerationContext): string {
  const script = Object.keys(ctx.runner.scripts(ctx))[0] ?? 'test';
  return `${ctx.selection.packageManager} run ${script}`;
}

/**
 * A minimal agent guide pointing an agent at the skills and stating this
 * project's detected stack, emitted at the project root as BOTH `CLAUDE.md`
 * (read natively by Claude Code and Grok Build) and `AGENTS.md` (the
 * cross-agent convention Codex CLI and the AGENTS.md-family tools read).
 * The two carry identical content apart from the heading so neither ecosystem
 * gets a second-class guide; the never-clobber contract in `apply/` leaves any
 * existing file untouched (writing a sibling instead).
 */
function agentGuideFiles(ctx: GenerationContext): FileOp[] {
  return ['CLAUDE.md', 'AGENTS.md'].map(fileName => ({
    path: fileName,
    kind: 'agent-config',
    contents: agentGuideContents(ctx, fileName),
  }));
}

function agentGuideContents(ctx: GenerationContext, fileName: string): string {
  const lines = [
    `# ${fileName} — Atomic Testing`,
    '',
    'This project tests its UI with [Atomic Testing](https://atomic-testing.dev)',
    'and the component-driver pattern. When you write or maintain tests here,',
    'follow the skills in `.claude/skills/` — they encode the house method:',
    '',
    '- `scaffold-test-driver` — create a driver tree for a component or page.',
    '- `author-component-tests` — write behavior tests against an existing tree.',
    '- `diagnose-test-failure` — classify a flaky / brittle / vacuous / contaminated test.',
    '- `sync-test-driver` — update a driver after its component changed.',
    '',
    'The skills are plain-Markdown `SKILL.md` files (open Agent Skills format).',
    "If your tool doesn't auto-discover `.claude/skills/`, read the relevant",
    'skill file directly before starting the corresponding task.',
    '',
    "## This project's stack",
    '',
    `- **Framework:** ${ctx.framework.displayName} ${ctx.selection.frameworkMajor}`,
    `- **Test engine:** \`${enginePackage(ctx)}\``,
    `- **Runner:** ${ctx.runner.displayName}`,
    `- **Design system:** ${ctx.designSystem.displayName}`,
    `- **Driver package:** \`${driverPackage(ctx)}\``,
    '',
    'Reuse the shipped drivers from the driver package before writing your own —',
    'the six-rule decomposition in `scaffold-test-driver` starts by inventorying',
    'what the design-system package already covers.',
    '',
    '## Commands',
    '',
    `- Run the tests: \`${testCommand(ctx)}\`.`,
    '- The generated sample lives in `atomic-testing-example/`.',
    '',
  ];
  return lines.join('\n');
}
