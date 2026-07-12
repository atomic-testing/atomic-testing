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
});
