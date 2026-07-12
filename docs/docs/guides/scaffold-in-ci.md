---
title: Scaffold in CI / non-interactive
sidebar_position: 4
---

# Scaffold in CI / non-interactive

The [`create-atomic-testing`](../quick-start.mdx) scaffolder is interactive by
default: on a TTY it detects what it can from your `package.json`, lockfile, and
config files, then prompts for anything left ambiguous. In CI — or any
non-interactive shell — there is nobody to answer those prompts, so you drive the
whole run with flags instead. This guide is the expert reference for that path.

## When the CLI goes non-interactive

The scaffolder skips prompting and runs straight through whenever **any** of these
holds:

- stdin or stdout is not a TTY (piped, redirected, or a CI runner), **or**
- the `CI` environment variable is set, or you pass `--ci`, **or**
- you pass `-y` / `--yes` to accept the detected values.

In non-interactive mode nothing is guessed on your behalf: if the CLI cannot
confidently determine a required field it stops with exit code `3` and tells you
which flag to set. So the rule of thumb for CI is **pass a flag for anything the
detector can't pin down** — at minimum the framework, runner, and design system.

## A complete non-interactive invocation

```bash
npm create atomic-testing@latest -- --framework react --runner jest --design-system html --yes
```

`npm create` needs the `--` separator before the flags; `pnpm create` and
`yarn create` do not:

```bash
pnpm create atomic-testing --framework react --runner jest --design-system html --yes
yarn create atomic-testing --framework react --runner jest --design-system html --yes
```

Fully specifying `--framework`, `--framework-major`, `--runner`,
`--design-system`, and `--package-manager` makes the run deterministic regardless
of what the target project happens to look like.

## Flag reference

| Flag                               | Values                                                                                            | Effect                                      |
| ---------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `--framework`                      | `react` \| `vue` \| `angular`                                                                     | Override framework detection                |
| `--framework-major`                | integer                                                                                           | Override the detected major version         |
| `--runner`                         | `jest` \| `vitest` \| `vitest-browser` \| `playwright`                                            | Choose the test runner                      |
| `--design-system`                  | `html` \| `mui` \| `mui-x` \| `angular-material` \| `primevue` \| `radix` \| `shadcn` \| `astryx` | Choose the driver package                   |
| `--package-manager`                | `npm` \| `pnpm` \| `yarn` \| `bun`                                                                | Override lockfile-based detection           |
| `--typescript` / `--no-typescript` | —                                                                                                 | Force TypeScript on/off (default: detect)   |
| `--dir <path>`                     | path                                                                                              | Target project directory (default: cwd)     |
| `-y`, `--yes`                      | —                                                                                                 | Accept detected values without prompting    |
| `--ci`                             | —                                                                                                 | Non-interactive (implied when not a TTY)    |
| `--dry-run`                        | —                                                                                                 | Print the plan; write nothing               |
| `--install` / `--no-install`       | —                                                                                                 | Force install / skip install (default: ask) |
| `-h`, `--help`                     | —                                                                                                 | Print usage                                 |
| `-v`, `--version`                  | —                                                                                                 | Print version                               |

Which framework × runner combinations are actually offered — and which are
`verified` versus `experimental` — is spelled out in
[Framework and Runner Support](../support-matrix.mdx). An impossible pairing (a
React-only design system on Angular, say) or a disabled one (Angular + Jest) is
refused with a message and exit code `4`, never scaffolded into a broken project.

## Exit codes

Every run ends on one of these codes — script your pipeline against them:

| Code | Meaning                                                             |
| ---- | ------------------------------------------------------------------- |
| `0`  | Success (including a completed `--dry-run`)                         |
| `1`  | Cancelled, or the install command failed                            |
| `2`  | Usage error (bad flag value, missing `package.json`)                |
| `3`  | Needs a flag — a required field was ambiguous while non-interactive |
| `4`  | Unsupported combination (impossible, unregistered, or disabled)     |
| `5`  | Write failed                                                        |

Code `3` is the one you will hit first in CI: it means detection came up short
and there is no TTY to ask. The message names the exact flags to add.

## Preview without writing: `--dry-run`

`--dry-run` resolves the recipe and prints the full plan — the packages it would
add, the runner config it would write at the project root plus the example files
under `atomic-testing-example/`, and the `package.json` scripts it would set —
then exits `0` having touched nothing. It
also prints the per-package-manager install commands so you can see the end state.
Use it as a pipeline pre-flight, or to review a recipe before committing to it:

```bash
npm create atomic-testing@latest -- --framework vue --runner jest --design-system primevue --dry-run
```

## Scaffold without installing: `--no-install`

By default the CLI asks whether to install. When it can't ask — i.e.
non-interactively — it **defaults to not installing** and instead prints the exact
add commands for your package manager. `--no-install` makes that explicit and is
the right choice when a later pipeline step owns dependency installation (or when
you want to commit the generated files and install separately):

```bash
npm create atomic-testing@latest -- --framework react --runner jest --design-system mui --yes --no-install
```

Pass `--install` to force the install step to run inside the CLI even in CI; if
that install command fails the run exits `1`.

## Extending the offered combinations

Adding a new framework × runner combination is a **one-row change**. The offered
matrix lives in the scaffolder's `registry/compatibility.ts`: each combination is
a single `CompatRule` in the `COMPATIBILITY` table pairing a framework and runner
(optionally a specific design system) with a support tier and an `enabled` flag.
A new combination is a new row — no resolution code changes. The
registered-but-disabled `angular` + `jest` row is the worked example: it exists so
the tooling knows the combo is a real, intended future path, but `enabled: false`
keeps it refused (exit `4`) until a green fixture proves it and someone flips the
flag.
