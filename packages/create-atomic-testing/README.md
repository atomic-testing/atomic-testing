# create-atomic-testing

Scaffold [Atomic Testing](https://github.com/atomic-testing/atomic-testing) into an **existing** project. It detects your framework, test runner, package manager and design system, installs the right `@atomic-testing/*` packages, writes a standalone runner config, and drops in a self-contained example test that is **green on the first run**.

```bash
npm create atomic-testing@latest
pnpm create atomic-testing
yarn create atomic-testing
```

It does not create your app — it adds testing to a project you already have (one with a `package.json`).

## What it does

1. **Detects** your environment from `package.json` + lockfiles + config files: framework & major (React 16/17/18/19, Vue 3, Angular 20/21/22), runner (Jest / Vitest / Vitest browser mode / Playwright), package manager (npm / pnpm / yarn / bun), TypeScript, and design system (HTML, MUI, MUI X, Angular Material, PrimeVue, Radix, shadcn, Astryx, Fluent UI v9).
2. **Prompts** for anything it could not confidently detect (interactive on a TTY; non-interactive in CI).
3. **Resolves a recipe** — the exact package set + config + example for your `(framework × runner × design system)` — and refuses combinations that are impossible or not yet supported, with a clear message.
4. **Writes** a standalone runner config, an example component, a `ScenePart`, and a passing test under `atomic-testing-example/`, and adds a `test` script.
5. **Installs** the dependencies (it asks first) — or prints the exact per-package-manager commands with `--no-install`.

## Options

| Flag                                                                                    | Purpose                                   |
| --------------------------------------------------------------------------------------- | ----------------------------------------- |
| `--framework <react\|vue\|angular>`                                                     | Override framework detection              |
| `--framework-major <number>`                                                            | Override the framework major              |
| `--runner <jest\|vitest\|vitest-browser\|playwright>`                                   | Pick the runner                           |
| `--design-system <html\|mui\|mui-x\|angular-material\|primevue\|radix\|shadcn\|astryx\|fluent>` | Pick the design system                    |
| `--package-manager <npm\|pnpm\|yarn\|bun>`                                              | Force a package manager                   |
| `--typescript` / `--no-typescript`                                                      | Force TypeScript on/off (default: detect) |
| `--dir <path>`                                                                          | Target directory (default: cwd)           |
| `-y, --yes`                                                                             | Accept detected values without prompting  |
| `--ci`                                                                                  | Non-interactive (implied when not a TTY)  |
| `--dry-run`                                                                             | Show what would happen; write nothing     |
| `--install` / `--no-install`                                                            | Force / skip install (default: ask)       |

Exit codes: `0` ok · `1` cancelled / install failed · `2` usage · `3` needs a flag (ambiguous, non-interactive) · `4` unsupported combination · `5` write failed.

## Support tiers

Every recipe carries a tier:

- **verified** — backed by a green fixture in the monorepo (React + Jest, Vue 3 + Jest, and their design systems).
- **experimental** — composed best-effort with no proving fixture yet (e.g. anything on Vitest, Angular, or Playwright). The CLI prints a warning before writing an experimental recipe.

The generated example always drives a real state change with the framework-agnostic HTML driver, so it is green regardless of tier; the design-system packages are installed so you can swap in their drivers.

## Adding a new combination (extensibility)

Recipes are **composed**, not hard-coded: a framework, a runner and a design system are three independent plugins, and a compatibility matrix decides which combinations are offered and at what tier. Adding a combination — say **Angular + Jest**, which has no fixture today — is a data change, not a rewrite:

1. Flip (or add) the row in [`src/registry/compatibility.ts`](src/registry/compatibility.ts). Angular + Jest already ships there as `enabled: false` — it is refused with an explanatory message specifically to demonstrate this seam. Set `enabled: true` once a fixture proves it.
2. If the new combination needs bespoke config, extend the relevant runner or framework plugin (`src/registry/runners.ts`, `frameworks.ts`, `designSystems.ts`).

No resolution logic changes. `scripts/check-recipe-sync.mjs` then validates that every package your recipe references exists and that its version and peer ranges are in sync with the real workspace.

## Architecture

```
src/
  detect/    pure detection from a project snapshot (no fs)
  registry/  framework · runner · designSystem plugins + compatibility matrix + resolveRecipe
  generate/  pure file builders (config, scene part, example)
  install/   package-manager command formatting + spawn
  io/        the single fs read boundary
  apply/     the single fs write boundary (dry-run, never-clobber, idempotent)
  prompt/    Clack interactive layer (TTY-gated)
  cli.ts     bin entry / orchestration
```
