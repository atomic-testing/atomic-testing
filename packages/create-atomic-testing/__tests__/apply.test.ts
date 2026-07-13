import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { applyPlan } from '../src/apply/applyPlan';
import { resolveRecipe } from '../src/registry/resolveRecipe';
import type { RecipePlan, RecipeSelection } from '../src/types';

const selection: RecipeSelection = {
  framework: 'react',
  frameworkMajor: 19,
  runner: 'jest',
  designSystem: 'html',
  designSystemMajor: null,
  typescript: true,
  packageManager: 'pnpm',
  agents: true,
};

let root: string;
beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'cat-apply-'));
  writeFileSync(join(root, 'package.json'), JSON.stringify({ name: 'demo', scripts: { build: 'tsc' } }, null, 2));
});
afterEach(() => rmSync(root, { recursive: true, force: true }));

describe('applyPlan', () => {
  it('dry-run writes nothing', () => {
    const plan = resolveRecipe(selection);
    const result = applyPlan(plan, root, { dryRun: true });
    expect(result.dryRun).toBe(true);
    expect(existsSync(join(root, 'jest.config.cjs'))).toBe(false);
    expect(existsSync(join(root, 'atomic-testing-example'))).toBe(false);
    // package.json untouched
    expect(JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).scripts.test).toBeUndefined();
  });

  it('writes the files and adds the script additively', () => {
    const plan = resolveRecipe(selection);
    const result = applyPlan(plan, root);
    expect(existsSync(join(root, 'jest.config.cjs'))).toBe(true);
    expect(existsSync(join(root, 'atomic-testing-example/ExampleComponent.test.tsx'))).toBe(true);
    expect(result.scriptsAdded).toContain('test');
    const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
    expect(pkg.scripts).toEqual({ build: 'tsc', test: 'jest' });
  });

  it('is idempotent on re-run', () => {
    const plan = resolveRecipe(selection);
    applyPlan(plan, root);
    const second = applyPlan(plan, root);
    expect(second.files.every(f => f.outcome === 'skipped-identical')).toBe(true);
    expect(second.scriptsAdded).toHaveLength(0);
  });

  it('never clobbers a differing file — writes a .atomic-example sibling', () => {
    const plan = resolveRecipe(selection);
    writeFileSync(join(root, 'jest.config.cjs'), '// my hand-written config\n');
    const result = applyPlan(plan, root);
    expect(readFileSync(join(root, 'jest.config.cjs'), 'utf8')).toBe('// my hand-written config\n');
    expect(existsSync(join(root, 'jest.config.cjs.atomic-example'))).toBe(true);
    expect(result.files.some(f => f.outcome === 'wrote-example')).toBe(true);
  });

  it('reports (never overwrites) a conflicting existing script', () => {
    writeFileSync(join(root, 'package.json'), JSON.stringify({ name: 'demo', scripts: { test: 'mocha' } }, null, 2));
    const result = applyPlan(resolveRecipe(selection), root);
    expect(result.scriptsConflicted).toContain('test');
    expect(JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).scripts.test).toBe('mocha');
  });

  it('preserves the existing package.json indentation when adding a script', () => {
    writeFileSync(
      join(root, 'package.json'),
      '{\n    "name": "demo",\n    "scripts": {\n        "build": "tsc"\n    }\n}\n'
    );
    applyPlan(resolveRecipe(selection), root);
    const raw = readFileSync(join(root, 'package.json'), 'utf8');
    expect(raw).toContain('\n        "test": "jest"'); // 4-space base indent kept (8 inside scripts), not reformatted to 2
  });

  it('writes the skill files and a CLAUDE.md guide into the project', () => {
    applyPlan(resolveRecipe(selection), root);
    expect(existsSync(join(root, '.claude/skills/scaffold-test-driver/SKILL.md'))).toBe(true);
    expect(existsSync(join(root, '.claude/skills/sync-test-driver/SKILL.md'))).toBe(true);
    expect(existsSync(join(root, 'CLAUDE.md'))).toBe(true);
  });

  it('never clobbers an existing CLAUDE.md — writes a .atomic-example sibling', () => {
    writeFileSync(join(root, 'CLAUDE.md'), '# my project notes\n');
    const result = applyPlan(resolveRecipe(selection), root);
    expect(readFileSync(join(root, 'CLAUDE.md'), 'utf8')).toBe('# my project notes\n');
    expect(existsSync(join(root, 'CLAUDE.md.atomic-example'))).toBe(true);
    expect(result.files.some(f => f.path === 'CLAUDE.md.atomic-example' && f.outcome === 'wrote-example')).toBe(true);
  });

  it('omits skills and CLAUDE.md when agents are disabled', () => {
    applyPlan(resolveRecipe({ ...selection, agents: false }), root);
    expect(existsSync(join(root, '.claude'))).toBe(false);
    expect(existsSync(join(root, 'CLAUDE.md'))).toBe(false);
  });

  it('refuses to write outside the target root', () => {
    const evil: RecipePlan = {
      ...resolveRecipe(selection),
      files: [{ path: '../escape.txt', kind: 'setup', contents: 'x' }],
    };
    expect(() => applyPlan(evil, root)).toThrow(/outside the target/);
    expect(existsSync(join(root, '..', 'escape.txt'))).toBe(false);
  });
});
