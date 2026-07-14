/**
 * Shared type contract for the scaffolder.
 *
 * The design is deliberately *orthogonal*: a framework, a runner and a design
 * system are three independent contributors, and a small compatibility matrix
 * (see `registry/compatibility.ts`) decides which combinations are offered and
 * at what support tier. Adding a new combination — e.g. Angular + Jest — is a
 * single data entry in that matrix, not a change to any resolution logic.
 */

export type FrameworkId = 'react' | 'vue' | 'angular' | 'none';

export type RunnerId = 'jest' | 'vitest' | 'vitest-browser' | 'playwright';

export type DesignSystemId =
  | 'html'
  | 'mui'
  | 'mui-x'
  | 'angular-material'
  | 'primevue'
  | 'radix'
  | 'shadcn'
  | 'astryx'
  | 'fluent';

export type PackageManagerId = 'npm' | 'pnpm' | 'yarn' | 'bun';

/**
 * A recipe is `verified` when a green fixture proves it works end-to-end, and
 * `experimental` when it is composed best-effort with no such proof (the CLI
 * warns before writing an experimental recipe).
 */
export type SupportTier = 'verified' | 'experimental';

/** A dependency the scaffolded project needs, `name` → semver `range`. */
export interface DependencySpec {
  readonly name: string;
  readonly range: string;
  /** `true` installs under devDependencies; omitted means a regular (prod) dependency. */
  readonly dev?: boolean;
  /** Optional peer — installed only when already present or explicitly asked. */
  readonly optional?: boolean;
}

/** A file the scaffolder wants to write, path relative to the target root (POSIX). */
export interface FileOp {
  readonly path: string;
  readonly contents: string;
  /**
   * Human label for the kind of file, used in summaries and to decide clobber
   * policy (e.g. a runner config is protected; the example is protected too).
   */
  readonly kind: FileKind;
}

export type FileKind =
  | 'runner-config'
  | 'scene-part'
  | 'example-test'
  | 'example-component'
  | 'setup'
  | 'skill-file'
  | 'agent-config';

/** An additive patch to the target `package.json`. Never a wholesale replacement. */
export interface PackageJsonPatch {
  readonly scripts?: Readonly<Record<string, string>>;
}

/** A minimal, structural view of a `package.json` — the only input `detect/` reads. */
export interface PackageJsonLike {
  name?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  packageManager?: string;
  workspaces?: string[] | { packages?: string[] };
  scripts?: Record<string, string>;
}

/**
 * A pure, side-effect-free snapshot of the target project. `detect/` consumes
 * only this — never the filesystem — which is what keeps detection unit-testable
 * and lets the purity guard forbid `node:fs` in `detect/`.
 */
export interface ProjectSnapshot {
  /** Absolute path of the target directory (for messages only; not read). */
  readonly root: string;
  /** Parsed `package.json`, or null when absent. */
  readonly packageJson: PackageJsonLike | null;
  /** True when `package.json` existed but did not parse. */
  readonly packageJsonMalformed: boolean;
  /** Lockfile basenames present, e.g. `['pnpm-lock.yaml']`. */
  readonly lockfiles: readonly string[];
  /** Test-runner config basenames present, e.g. `['jest.config.js']`. */
  readonly configFiles: readonly string[];
  readonly hasTsConfig: boolean;
  /** shadcn writes a `components.json` marker. */
  readonly hasComponentsJson: boolean;
  /** Workspace markers found, e.g. `['pnpm-workspace.yaml']`. */
  readonly workspaceMarkers: readonly string[];
  /** `npm_config_user_agent`, the last-resort package-manager signal. */
  readonly userAgent?: string;
}

export type AmbiguityKind = 'framework' | 'framework-major' | 'design-system-major' | 'package-manager';

export interface Diagnostic {
  readonly level: 'warn' | 'error';
  readonly code: string;
  readonly message: string;
}

export interface DetectedFramework {
  readonly id: FrameworkId;
  /** Resolved major, or null when unresolvable (non-semver range) or ambiguous. */
  readonly major: number | null;
}

export interface DetectedDesignSystem {
  readonly id: DesignSystemId;
  readonly major: number | null;
}

/** The result of inspecting a {@link ProjectSnapshot}. */
export interface DetectResult {
  readonly framework: DetectedFramework | null;
  readonly runner: RunnerId | null;
  readonly packageManager: PackageManagerId;
  readonly typescript: boolean;
  readonly monorepo: boolean;
  readonly designSystem: DetectedDesignSystem | null;
  /** Axes that could not be decided and must be prompted (or errored non-interactively). */
  readonly ambiguities: readonly AmbiguityKind[];
  readonly diagnostics: readonly Diagnostic[];
}

/**
 * The user-facing selection that drives generation. Produced by merging
 * detection, flags and prompts.
 */
export interface RecipeSelection {
  readonly framework: FrameworkId;
  readonly frameworkMajor: number;
  readonly runner: RunnerId;
  readonly designSystem: DesignSystemId;
  readonly designSystemMajor: number | null;
  readonly typescript: boolean;
  readonly packageManager: PackageManagerId;
  /**
   * Emit the Claude Code testing skills (`.claude/skills/*`) and a project-root
   * CLAUDE.md guide into the scaffolded project. Default-on; `--no-agents` opts
   * out. Kept on the selection because it is a user choice that shapes generation.
   */
  readonly agents: boolean;
}

/**
 * A fully-resolved, ready-to-apply plan. `resolveRecipe` composes the three
 * plugins for a {@link RecipeSelection} into this. Pure — no I/O.
 */
export interface RecipePlan {
  /** Stable id, e.g. `react-19+jest+html`. */
  readonly id: string;
  readonly selection: RecipeSelection;
  readonly tier: SupportTier;
  readonly dependencies: readonly DependencySpec[];
  readonly files: readonly FileOp[];
  readonly packageJsonPatch: PackageJsonPatch;
  /** Non-fatal notes shown to the user (e.g. the experimental-tier warning). */
  readonly warnings: readonly string[];
  /** Post-scaffold commands to print, e.g. `npx jest`. */
  readonly nextSteps: readonly string[];
}

/** Raised by `resolveRecipe` when a selection is not a valid combination. */
export class RecipeResolutionError extends Error {
  constructor(
    readonly code: string,
    message: string
  ) {
    super(message);
    this.name = 'RecipeResolutionError';
  }
}
