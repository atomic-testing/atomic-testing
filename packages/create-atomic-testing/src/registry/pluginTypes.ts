import type { DependencySpec, DesignSystemId, FileOp, FrameworkId, RecipeSelection, RunnerId } from '../types';

/**
 * Generation context handed to every plugin method — the resolved selection
 * plus the three chosen plugins and the file extensions to emit. Plugins read
 * from it; they never touch the filesystem (generation stays pure).
 */
export interface GenerationContext {
  readonly selection: RecipeSelection;
  readonly framework: FrameworkPlugin;
  readonly runner: RunnerPlugin;
  readonly designSystem: DesignSystemPlugin;
  /** Extensions chosen from TypeScript + framework, e.g. `{ component: 'tsx' }`. */
  readonly ext: { readonly component: string; readonly test: string; readonly config: string };
}

/**
 * A UI framework contributor. Knows how to detect its own major, which engine
 * package backs each major, the runtime + testing-library deps a consumer needs,
 * and how to render + drive the example. Adding a framework is adding one of
 * these to `frameworks.ts`.
 */
export interface FrameworkPlugin {
  readonly id: FrameworkId;
  readonly displayName: string;
  readonly supportedMajors: readonly number[];
  /** The runner used when the user expresses no preference. */
  readonly defaultRunner: RunnerId;
  /** Short `@atomic-testing/*` engine name for a major, e.g. 19 → 'react-19'. */
  enginePackage(major: number): string | null;
  /** Framework runtime + testing-library binding deps for a major. */
  runtimeDeps(major: number): readonly DependencySpec[];
  /**
   * The example component that the generated test drives. Returns null for
   * frameworks with no engine yet (e.g. vanilla), which the compatibility matrix
   * keeps disabled.
   */
  exampleComponent(ctx: GenerationContext): { readonly fileName: string; readonly source: string } | null;
  /**
   * How the unit-test file builds and (a)waits a TestEngine for this framework.
   * `imports` are prepended; `engineExpr` constructs the engine from
   * `ExampleComponent` + `scenePart`.
   */
  exampleEngine(
    ctx: GenerationContext
  ): { readonly imports: readonly string[]; readonly engineExpr: string; readonly isAsync: boolean } | null;
}

/**
 * A test-runner contributor. Owns the standalone runner config, its deps, the
 * package.json scripts, and whether the example is a unit test (jest/vitest) or
 * a Playwright e2e test.
 */
export interface RunnerPlugin {
  readonly id: RunnerId;
  readonly displayName: string;
  readonly harness: 'unit' | 'playwright';
  deps(ctx: GenerationContext): readonly DependencySpec[];
  configFile(ctx: GenerationContext): FileOp;
  scripts(ctx: GenerationContext): Readonly<Record<string, string>>;
  nextSteps(ctx: GenerationContext): readonly string[];
  /** Example test file basename (without directory), e.g. `Example.test.tsx`. */
  testFileName(ctx: GenerationContext): string;
}

/**
 * A design-system contributor. Declares which frameworks it binds to (the hard
 * gate that makes MUI+Vue impossible), the driver package to install, and any
 * runtime deps. In v1 the example uses the HTML driver universally; DS plugins
 * contribute packages + a usage note pointing at their own drivers.
 */
export interface DesignSystemPlugin {
  readonly id: DesignSystemId;
  readonly displayName: string;
  readonly compatibleFrameworks: readonly FrameworkId[];
  /** Short `@atomic-testing/*` driver name, or null when the HTML driver suffices. */
  driverPackage(major: number | null): string | null;
  deps(ctx: GenerationContext): readonly DependencySpec[];
  /** Shown in the generated example, pointing users at the DS-specific drivers. */
  readonly usageNote?: string;
}

export type { RecipeSelection };
