# Atomic Testing — Agent Playbook

> Read this file first. It tells you what to read next for any task, and the conventions to follow. These docs describe `packages/` (the library). The repo-root `docs/` folder is the separate user-facing Docusaurus site — don't confuse them.

## Quick start

1. [INDEX.md](INDEX.md) — full doc map.
2. [DOMAIN.md](DOMAIN.md) — vocabulary & type system (driver, interactor, locator, scene part).
3. [ARCHITECTURE.md](ARCHITECTURE.md) — layer stack, interactor inheritance, dependency graph, shared-test pattern.
4. The relevant `modules/*.md` for your task (see routing below).

## Quick lookup

| If you need to… | Start here |
|------------------|-----------|
| Understand the vocabulary / types | [DOMAIN.md](DOMAIN.md) |
| See how data/control flows end-to-end | [ARCHITECTURE.md](ARCHITECTURE.md) |
| Understand the core types/classes/locators/errors | [modules/core.md](modules/core.md) |
| Work on the base DOM interactor / `getElement` / events | [modules/dom-core.md](modules/dom-core.md) |
| Work on React/Vue rendering or reactivity flushing | [modules/framework-adapters.md](modules/framework-adapters.md) |
| Work on browser/E2E behavior | [modules/playwright.md](modules/playwright.md) |
| Understand how one suite runs in Jest/Vitest/Playwright | [modules/test-runner.md](modules/test-runner.md) |
| Add/fix an HTML element driver | [modules/component-driver-html.md](modules/component-driver-html.md) |
| Add/fix a MUI core driver (v5/v6/v7) | [modules/component-driver-mui.md](modules/component-driver-mui.md) |
| Add/fix a MUI-X grid/picker driver | [modules/component-driver-mui-x.md](modules/component-driver-mui-x.md) |
| Know *why* something is shaped this way | [adr/](adr/) (001 drivers · 002 interactor · 003 version packages · 004 shared tests) |
| Add a new locator | [modules/core.md → Locators](modules/core.md#locators) |
| Handle a portal/overlay component (dialog/menu) | [ARCHITECTURE.md → Cross-cutting](ARCHITECTURE.md#cross-cutting-concerns); `MenuDriver`/`DialogDriver` |

## Fresh repo tree

Do **not** rely on a static file listing. Generate the current tree on demand:

```bash
bash /Users/tangent.lin/.claude/skills/doc-gen/repo-tree.sh /Users/tangent.lin/Development/os/atomic-testing/packages
```

## Build / test / run

From `CLAUDE.md` (toolchain: pnpm ≥10, Node ≥22.12; type-check via `tsgo`, lint via oxlint, format via oxfmt):

| Action | Command |
|--------|---------|
| Install | `pnpm install` |
| Type-check all | `pnpm run check:type` |
| Lint (autofix) | `pnpm run check:lint` |
| Format | `pnpm run check:style` |
| Unit (DOM/Jest) | `pnpm test:dom` (in a package dir) |
| E2E (Playwright) | `pnpm test:e2e` (needs dev server running) |
| Build a package | `pnpm run build` (tsdown) |
| Build docs site | `cd docs && pnpm build` |

E2E setup (from `CLAUDE.md`): in `package-tests/component-driver-html-test`, run `pnpm start &` (Vite dev server) then `pnpm test:e2e` (or `pnpm test:e2e:chrome` for fast iteration). Test all browsers before merging.

## Conventions

### Directory structure

| Directory | Purpose | Conventions |
|-----------|---------|-------------|
| `packages/core/src` | types, base drivers, interactor interface, locators, errors, utils | utils exported as namespaces; locators are `byX.ts` files |
| `packages/dom-core/src` | `DOMInteractor` base impl | one class per environment behavior |
| `packages/{react-*,vue-3}/src` | adapter `createTestEngine` + interactor subclass | `createTestEngine.ts`, `types.ts`, `index.ts` |
| `packages/playwright/src` | `PlaywrightInteractor` + runner glue | not a `DOMInteractor` subclass |
| `packages/internal-test-runner*/src` | suite orchestration + adapters | `internal-` = workspace-private |
| `packages/component-driver-*/src/components` | one driver per file | `XDriver.ts`, plus `errors/` where needed |
| `package-tests/*` | suites validating drivers | three-file pattern (`*.suite.ts` / `*.dom.test.ts` / `*.e2e.test.ts`) |

### Naming & patterns

- Driver classes end in `Driver`; `driverName` getter returns a stable id (`HTMLTextInput`, `MuiV7SelectDriver`, …).
- Scene parts use `satisfies ScenePart` to preserve literal key types.
- Each package's public API is its `src/index.ts` barrel — discover exports there, don't enumerate them in docs.
- Version-mirrored packages (`mui-v5/6/7`, `react-18/19/legacy`) keep matching file/export names; differences are selectors/roles/`driverName` only ([ADR-003](adr/003-version-specific-packages.md)).
- Locator-override hooks (`overriddenParentLocator`, `overrideLocatorRelativePosition`) must be pure (run before construction).

## Change workflows

### Add a component driver
1. Pick the package (`component-driver-html` for native, `component-driver-mui-v*` for MUI). 2. Create `src/components/XDriver.ts` extending `ComponentDriver`/`ContainerDriver`/`ListComponentDriver`. 3. Declare `parts` (`satisfies ScenePart`), composing existing leaf drivers. 4. Implement semantic methods + `driverName`. 5. For portals, override the locator hooks. 6. Export from `index.ts`. 7. Mirror across version packages if MUI. 8. Add a `*.suite.ts` + `.dom`/`.e2e` adapters under `package-tests/`. → [modules/component-driver-html.md](modules/component-driver-html.md), [modules/component-driver-mui.md](modules/component-driver-mui.md).

### Add a locator
Add `packages/core/src/locators/byX.ts` returning a `CssLocator` (use `byCssSelector` internally), export from `locators/index.ts`. → [modules/core.md](modules/core.md#locators).

### Add a framework adapter / new React major
Copy `react-18`; adjust render/unmount API, `act` source, `data-*` attribute, and peer ranges; reuse or subclass `DOMInteractor`. → [modules/framework-adapters.md](modules/framework-adapters.md).

### Add an interactor method
Add it to the `Interactor` interface ([core/src/interactor/Interactor.ts](../packages/core/src/interactor/Interactor.ts)), implement in `DOMInteractor` (React/Vue inherit), and **also implement in `PlaywrightInteractor`** (it doesn't inherit). → [ADR-002](adr/002-interactor-abstraction.md).

### Add a test runner
Implement a `TestFrameworkMapper` for it (copy `vitestAdapter`). → [modules/test-runner.md](modules/test-runner.md).

### Fix a MUI-version bug
Reproduce against the specific `component-driver-mui-v*`; fix there; replicate to the other versions only if the same DOM/role applies. → [ADR-003](adr/003-version-specific-packages.md).

## Documentation update rules

| When you change… | Update… |
|------------------|---------|
| A domain type, driver option, or `Interactor` method | [DOMAIN.md](DOMAIN.md) glossary/types + relevant `modules/*.md` |
| A package's public surface (`index.ts`) | that package's `modules/*.md` Public Surface table |
| User-visible driver behavior | the relevant `modules/component-driver-*.md` |
| File/folder structure | this file's Conventions table (and re-run `repo-tree.sh`) |
| A consequential design decision | the relevant `adr/*.md` (or add a new one) |

## Context-minimizing guidance

- Most driver tasks: [DOMAIN.md](DOMAIN.md) + the one relevant `modules/component-driver-*.md` is enough.
- Interactor/environment tasks: [ARCHITECTURE.md → Interactor inheritance](ARCHITECTURE.md#interactor-inheritance) + [modules/dom-core.md](modules/dom-core.md) (+ [modules/playwright.md](modules/playwright.md) if browser).
- Test-infra tasks: [modules/test-runner.md](modules/test-runner.md) + [ADR-004](adr/004-shared-three-file-test-pattern.md).
- Always verify a cited symbol still exists before acting — code is the source of truth.
