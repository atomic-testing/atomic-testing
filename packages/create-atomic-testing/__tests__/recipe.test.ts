import { offeredRunners, resolveCompatibility } from '../src/registry/compatibility';
import { resolveRecipe } from '../src/registry/resolveRecipe';
import { RecipeResolutionError } from '../src/types';
import type { RecipeSelection } from '../src/types';

function sel(overrides: Partial<RecipeSelection> = {}): RecipeSelection {
  return {
    framework: 'react',
    frameworkMajor: 19,
    runner: 'jest',
    designSystem: 'html',
    designSystemMajor: null,
    typescript: true,
    packageManager: 'pnpm',
    agents: true,
    ...overrides,
  };
}

const names = (plan: ReturnType<typeof resolveRecipe>): string[] => plan.dependencies.map(d => d.name);
const paths = (plan: ReturnType<typeof resolveRecipe>): string[] => plan.files.map(f => f.path);

describe('compatibility matrix', () => {
  it('offers Jest (verified) for React but not for Angular', () => {
    const react = offeredRunners('react', 'html');
    expect(react.find(r => r.runner === 'jest')).toEqual({ runner: 'jest', tier: 'verified' });
    expect(offeredRunners('angular', 'html').some(r => r.runner === 'jest')).toBe(false);
  });

  it('refuses impossible and disabled combinations with codes', () => {
    expect(resolveCompatibility('vue', 'jest', 'mui').code).toBe('E_IMPOSSIBLE_COMBO');
    const disabled = resolveCompatibility('angular', 'jest', 'html');
    expect(disabled.allowed).toBe(false);
    expect(disabled.registered).toBe(true);
    expect(disabled.code).toBe('E_COMBO_DISABLED');
  });
});

describe('resolveRecipe', () => {
  it('composes React 19 + Jest + HTML (verified) with the right packages and files', () => {
    const plan = resolveRecipe(sel());
    expect(plan.tier).toBe('verified');
    expect(names(plan)).toEqual(
      expect.arrayContaining([
        '@atomic-testing/core',
        '@atomic-testing/component-driver-html',
        '@atomic-testing/react-19',
        'react',
        'jest',
        '@testing-library/react',
      ])
    );
    expect(paths(plan)).toEqual(
      expect.arrayContaining([
        'jest.config.cjs',
        'atomic-testing-example/ExampleComponent.tsx',
        'atomic-testing-example/scenePart.ts',
        'atomic-testing-example/ExampleComponent.test.tsx',
      ])
    );
    expect(plan.packageJsonPatch.scripts).toEqual({ test: 'jest' });
  });

  it('adds the MUI driver + runtime for React + MUI', () => {
    const plan = resolveRecipe(sel({ frameworkMajor: 18, designSystem: 'mui', designSystemMajor: 9 }));
    expect(names(plan)).toEqual(
      expect.arrayContaining(['@atomic-testing/component-driver-mui-v9', '@mui/material', '@emotion/react'])
    );
  });

  it('adds the Fluent v9 driver + runtime for React + Fluent', () => {
    const plan = resolveRecipe(sel({ designSystem: 'fluent' }));
    expect(names(plan)).toEqual(
      expect.arrayContaining(['@atomic-testing/component-driver-fluent-v9', '@fluentui/react-components'])
    );
  });

  it('uses the Vue engine + PrimeVue driver for Vue + PrimeVue', () => {
    const plan = resolveRecipe(sel({ framework: 'vue', frameworkMajor: 3, designSystem: 'primevue' }));
    expect(plan.tier).toBe('verified');
    expect(names(plan)).toEqual(
      expect.arrayContaining(['@atomic-testing/vue-3', '@atomic-testing/component-driver-primevue-v4', 'primevue'])
    );
  });

  it('produces a Playwright recipe with the e2e harness (config + e2e, no scene part)', () => {
    const plan = resolveRecipe(sel({ runner: 'playwright' }));
    expect(names(plan)).toContain('@atomic-testing/playwright');
    expect(names(plan)).toContain('@playwright/test');
    expect(paths(plan)).toContain('playwright.config.ts');
    expect(paths(plan).some(p => p.endsWith('.e2e.tsx'))).toBe(true);
    expect(paths(plan).some(p => p.includes('scenePart'))).toBe(false);
  });

  it('warns on experimental recipes', () => {
    const plan = resolveRecipe(sel({ runner: 'vitest' }));
    expect(plan.tier).toBe('experimental');
    expect(plan.warnings.some(w => w.includes('EXPERIMENTAL'))).toBe(true);
  });

  it('throws typed errors for impossible and disabled combinations', () => {
    expect(() => resolveRecipe(sel({ framework: 'vue', frameworkMajor: 3, designSystem: 'mui' }))).toThrow(
      RecipeResolutionError
    );
    try {
      resolveRecipe(sel({ framework: 'angular', frameworkMajor: 22, runner: 'jest' }));
      throw new Error('expected resolveRecipe to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(RecipeResolutionError);
      expect((error as RecipeResolutionError).code).toBe('E_COMBO_DISABLED');
    }
  });
});

describe('generated file contents', () => {
  it('emits IS_REACT_ACT_ENVIRONMENT for React Jest but not for Vue', () => {
    const react = resolveRecipe(sel()).files.find(f => f.path === 'jest.config.cjs')!;
    expect(react.contents).toContain('IS_REACT_ACT_ENVIRONMENT');
    const vue = resolveRecipe(sel({ framework: 'vue', frameworkMajor: 3 })).files.find(
      f => f.path === 'jest.config.cjs'
    )!;
    expect(vue.contents).not.toContain('IS_REACT_ACT_ENVIRONMENT');
  });

  it('never emits monorepo-only constructs into generated config', () => {
    for (const runner of ['jest', 'vitest'] as const) {
      const config = resolveRecipe(sel({ runner })).files.find(f => f.kind === 'runner-config')!;
      expect(config.contents).not.toMatch(/moduleNameMapper|workspace:|\.\.\/\.\.\/packages/);
    }
  });

  it('emits an async engine for Angular examples', () => {
    const test = resolveRecipe(sel({ framework: 'angular', frameworkMajor: 22, runner: 'vitest-browser' })).files.find(
      f => f.kind === 'example-test'
    )!;
    expect(test.contents).toContain('await createTestEngine');
  });

  it('adds customExportConditions to the Vue Jest config', () => {
    const cfg = resolveRecipe(sel({ framework: 'vue', frameworkMajor: 3 })).files.find(
      f => f.path === 'jest.config.cjs'
    )!;
    expect(cfg.contents).toContain('customExportConditions');
  });

  it('uses playwright() (not the string) for vitest-browser and emits an Angular setup file', () => {
    const plan = resolveRecipe(sel({ framework: 'angular', frameworkMajor: 22, runner: 'vitest-browser' }));
    const cfg = plan.files.find(f => f.kind === 'runner-config')!;
    expect(cfg.contents).toContain('provider: playwright()');
    expect(cfg.contents).not.toContain("provider: 'playwright'");
    expect(plan.files.find(f => f.path.endsWith('vitest.setup.ts'))?.contents).toContain("import '@angular/compiler'");
  });
});

describe('recipe dependency-major consistency (review regressions)', () => {
  it('keeps the angular-material driver and its deps on the same major when the DS major is unresolved', () => {
    const plan = resolveRecipe(
      sel({
        framework: 'angular',
        frameworkMajor: 21,
        runner: 'vitest-browser',
        designSystem: 'angular-material',
        designSystemMajor: null,
      })
    );
    const names = plan.dependencies.map(d => d.name);
    expect(names).toContain('@atomic-testing/component-driver-angular-material-v21');
    expect(names).not.toContain('@atomic-testing/component-driver-angular-material-v22');
    expect(plan.dependencies.find(d => d.name === '@angular/material')?.range).toBe('^21.0.0');
  });

  it('emits a mui-x data-grid major that matches the driver, with no conflicting @mui/material pin', () => {
    const plan = resolveRecipe(sel({ frameworkMajor: 19, designSystem: 'mui-x', designSystemMajor: null }));
    const names = plan.dependencies.map(d => d.name);
    expect(names).toContain('@atomic-testing/component-driver-mui-x-v9');
    expect(plan.dependencies.find(d => d.name === '@mui/x-data-grid')?.range).toBe('^9.0.0');
    expect(names).not.toContain('@mui/material'); // supplied transitively by the driver at the right major
  });

  it('marks radix cmdk as an optional dependency', () => {
    const plan = resolveRecipe(sel({ designSystem: 'radix' }));
    expect(plan.dependencies.find(d => d.name === 'cmdk')?.optional).toBe(true);
  });
});

describe('agent skills wiring', () => {
  const skillPaths = (plan: ReturnType<typeof resolveRecipe>): string[] =>
    plan.files.filter(f => f.kind === 'skill-file').map(f => f.path);

  it('emits all four skills and a CLAUDE.md guide by default', () => {
    const plan = resolveRecipe(sel());
    expect(skillPaths(plan)).toEqual([
      '.claude/skills/scaffold-test-driver/SKILL.md',
      '.claude/skills/author-component-tests/SKILL.md',
      '.claude/skills/diagnose-test-failure/SKILL.md',
      '.claude/skills/sync-test-driver/SKILL.md',
    ]);
    expect(plan.files.some(f => f.kind === 'agent-config' && f.path === 'CLAUDE.md')).toBe(true);
  });

  it('omits every skill + agent-config file with --no-agents', () => {
    const plan = resolveRecipe(sel({ agents: false }));
    expect(plan.files.some(f => f.kind === 'skill-file' || f.kind === 'agent-config')).toBe(false);
  });

  it('embeds the real skill body verbatim (the six-rule algorithm)', () => {
    const scaffold = resolveRecipe(sel()).files.find(f => f.path.endsWith('scaffold-test-driver/SKILL.md'))!;
    expect(scaffold.contents).toContain('six-rule algorithm');
    expect(scaffold.contents).toContain('AssertScenePlaceableDriver');
  });

  it('adapts the CLAUDE.md to the detected engine, runner and driver package', () => {
    const claude = resolveRecipe(sel({ frameworkMajor: 19, designSystem: 'mui', designSystemMajor: 9 })).files.find(
      f => f.kind === 'agent-config'
    )!;
    expect(claude.contents).toContain('@atomic-testing/react-19');
    expect(claude.contents).toContain('@atomic-testing/component-driver-mui-v9');
  });

  it('emits the skills for the Playwright harness too, pointing at the playwright engine', () => {
    const plan = resolveRecipe(sel({ runner: 'playwright' }));
    expect(plan.files.filter(f => f.kind === 'skill-file')).toHaveLength(4);
    expect(plan.files.find(f => f.kind === 'agent-config')!.contents).toContain('@atomic-testing/playwright');
  });
});

describe('nextSteps skills pointer', () => {
  it('points agents-on users at the skills docs', () => {
    const plan = resolveRecipe(sel({ agents: true }));
    expect(plan.nextSteps.some(step => step.includes('.claude/skills/') && step.includes('atomic-testing.dev'))).toBe(
      true
    );
  });

  it('omits the skills pointer entirely with --no-agents', () => {
    const plan = resolveRecipe(sel({ agents: false }));
    expect(plan.nextSteps.some(step => step.includes('.claude/skills/'))).toBe(false);
  });
});
