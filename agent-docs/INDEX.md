# Atomic Testing — Documentation Index

LLM-optimized docs for the `packages/` workspace of `atomic-testing` — a portable UI-testing library built on the component-driver pattern. Generated for future agents; source-cited throughout. (The repo-root `docs/` folder is the separate user-facing Docusaurus site.)

| Document                                               | Description                                                                                                                       |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| [AGENTS.md](AGENTS.md)                                 | Agent playbook — **read first**. Routing table, conventions, change workflows, build/test commands.                               |
| [DOMAIN.md](DOMAIN.md)                                 | Vocabulary, type system, invariants, error catalog.                                                                               |
| [ARCHITECTURE.md](ARCHITECTURE.md)                     | Entry points, layer stack, interactor inheritance, dependency graph, shared three-file test pattern.                              |
| [RELEASING.md](RELEASING.md)                           | Release & publish runbook — cut a release, rotate `CODEMOD_TOKEN`, add a new package (bootstrap); OIDC trusted publishing.        |
| [PLAN-EXECUTION-LESSONS.md](PLAN-EXECUTION-LESSONS.md) | Pitfalls when running multi-step `run-plan.sh` plans headlessly (ask-first stalls, weak verify gates, `state.json` resume traps). |

## Modules

| Module                                                        | Covers                                                                               | Description                                                                                      |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| [core](modules/core.md)                                       | `@atomic-testing/core`                                                               | Types, base drivers, `Interactor` interface, locators, errors, utils.                            |
| [dom-core](modules/dom-core.md)                               | `@atomic-testing/dom-core`                                                           | `DOMInteractor` base implementation + `createDomTestEngine`.                                     |
| [framework-adapters](modules/framework-adapters.md)           | `react-core`, `react-18`, `react-19`, `react-legacy`, `vue-3`                        | `ReactInteractor`/`VueInteractor` + per-environment `createTestEngine`.                          |
| [playwright](modules/playwright.md)                           | `@atomic-testing/playwright`                                                         | Browser driver: `PlaywrightInteractor` + `createTestEngine`.                                     |
| [test-runner](modules/test-runner.md)                         | `internal-test-runner` (+ jest/vitest/playwright adapters, `internal-react-example`) | `testRunner`, `useTestEngine`, `TestFrameworkMapper`.                                            |
| [component-driver-html](modules/component-driver-html.md)     | `@atomic-testing/component-driver-html`                                              | Native HTML element drivers; the canonical driver pattern.                                       |
| [component-driver-mui](modules/component-driver-mui.md)       | `component-driver-mui-v5/v6/v7`                                                      | MUI core drivers (v7 reference; version-diff notes).                                             |
| [component-driver-mui-x](modules/component-driver-mui-x.md)   | `component-driver-mui-x-v5..v8` (+ `internal-mui-x-test-fixture`)                    | DataGrid (all) + Date/Time pickers (v5 only).                                                    |
| [component-driver-astryx](modules/component-driver-astryx.md) | `@atomic-testing/component-driver-astryx`                                            | Astryx (`@astryxdesign/core`) drivers; role/name/testid-first locators; ESM jest-transform note. |

## ADRs

| ADR                                              | Decision                                                     |
| ------------------------------------------------ | ------------------------------------------------------------ |
| [001](adr/001-component-driver-pattern.md)       | Component-driver pattern with declarative scene parts.       |
| [002](adr/002-interactor-abstraction.md)         | `Interactor` abstraction for environment portability.        |
| [003](adr/003-version-specific-packages.md)      | Version-specific packages for React and MUI majors.          |
| [004](adr/004-shared-three-file-test-pattern.md) | Shared three-file test pattern via `TestFrameworkMapper`.    |
| [005](adr/005-drop-mui-5-support.md)             | End of support for MUI 5 and MUI-X 5.                        |
| [006](adr/006-1.0-api-freeze-and-evolution.md)   | 1.0 public-API freeze, SemVer & deprecation policy.          |
| [009](adr/009-split-core-driver-versioning.md)   | Split versioning: frozen core group vs. independent drivers. |

## Fresh repo tree

```bash
bash /Users/tangent.lin/.claude/skills/doc-gen/repo-tree.sh /Users/tangent.lin/Development/os/atomic-testing/packages
```

---

### BRIEF vs CODE differences

No `BRIEF.md` was provided for this run, so there is nothing to reconcile. All content is derived directly from source (cited as `../packages/...`).

### Open questions

Residual ambiguities documentation could not fully resolve from code alone:

1. **MUI-X version → MUI-core dependency mapping** — confirmed only for `mui-x-v8 → mui-v6` ([package.json](../packages/component-driver-mui-x-v8/package.json#L40-L45)); the pairing for v5/v6/v7 is [inferred]. Verify each `package.json` if it matters.
2. **Why datepicker drivers stop at MUI-X v5** — only v5 exports them; intent (deprecation? not-yet-ported?) is not stated in code.
3. ~~**`react-legacy` `act` import**~~ — resolved: `react-legacy` uses its own `LegacyReactInteractor` wrapping `act` from `react-dom/test-utils`, deliberately off the `@testing-library/react@16` (React 18/19) graph so the React 16/17 tree resolves. See [ADR-006](adr/006-1.0-api-freeze-and-evolution.md) §3 and issue #959.
4. **`DataGridProDriver` exact method set per MUI-X version** — characterized at a high level; confirm precise signatures in each version's `DataGridProDriver.ts` before relying on a specific method.
5. ~~**`internal-test-runner` stability**~~ — resolved: the `internal-*` test-runner packages are `private: true` (never published) and the stable public surface is now declared and frozen per [ADR-006](adr/006-1.0-api-freeze-and-evolution.md) (issues #957, #960).
