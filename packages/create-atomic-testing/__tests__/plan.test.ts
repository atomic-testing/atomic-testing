import { addCommands, execCommand } from '../src/install/packageManager';
import { buildDraft, missingFields, toSelection } from '../src/plan/resolveSelection';
import type { DependencySpec, DetectResult } from '../src/types';

const deps: DependencySpec[] = [
  { name: 'react', range: '^19.2.0' },
  { name: 'jest', range: '^29.7.0', dev: true },
];

describe('package-manager commands', () => {
  it('splits prod/dev and formats per manager', () => {
    expect(addCommands('pnpm', deps)).toEqual(['pnpm add react@^19.2.0', 'pnpm add -D jest@^29.7.0']);
    expect(addCommands('npm', deps)).toEqual([
      'npm install --save react@^19.2.0',
      'npm install --save-dev jest@^29.7.0',
    ]);
    expect(addCommands('yarn', deps)).toEqual(['yarn add react@^19.2.0', 'yarn add -D jest@^29.7.0']);
    expect(addCommands('bun', deps)).toEqual(['bun add react@^19.2.0', 'bun add -d jest@^29.7.0']);
  });

  it('formats exec commands', () => {
    expect(execCommand('pnpm', 'jest')).toBe('pnpm exec jest');
    expect(execCommand('npm', 'vitest', 'run')).toBe('npx vitest run');
    expect(execCommand('bun', 'playwright', 'test')).toBe('bunx playwright test');
  });
});

function detectResult(overrides: Partial<DetectResult> = {}): DetectResult {
  return {
    framework: { id: 'react', major: 19 },
    runner: null,
    packageManager: 'pnpm',
    typescript: true,
    monorepo: false,
    designSystem: null,
    ambiguities: [],
    diagnostics: [],
    ...overrides,
  };
}

describe('selection planning', () => {
  it('seeds a draft from detection with sensible defaults', () => {
    const draft = buildDraft(detectResult(), {});
    expect(draft.framework).toBe('react');
    expect(draft.frameworkMajor).toBe(19);
    expect(draft.runner).toBe('jest'); // React's default runner
    expect(draft.designSystem).toBe('html'); // default when none detected
    expect(missingFields(draft)).toHaveLength(0);
  });

  it('lets flags override detection', () => {
    const draft = buildDraft(detectResult(), {
      framework: 'vue',
      frameworkMajor: 3,
      runner: 'vitest',
      packageManager: 'npm',
    });
    expect(draft).toMatchObject({ framework: 'vue', frameworkMajor: 3, runner: 'vitest', packageManager: 'npm' });
  });

  it('flags a missing framework and an unresolved major', () => {
    expect(missingFields(buildDraft(detectResult({ framework: null }), {}))).toContain('framework');
    expect(missingFields(buildDraft(detectResult({ framework: { id: 'react', major: null } }), {}))).toContain(
      'framework-major'
    );
  });

  it('builds a selection from a complete draft', () => {
    expect(toSelection(buildDraft(detectResult(), {})).framework).toBe('react');
    expect(() => toSelection(buildDraft(detectResult({ framework: null }), {}))).toThrow();
  });
});
