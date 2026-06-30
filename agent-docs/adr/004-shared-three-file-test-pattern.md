# ADR-004: Shared three-file test pattern via `TestFrameworkMapper`

## Status

Accepted (describes the existing design).

## Context

The library must prove its drivers behave the same in unit (jsdom) and end-to-end (browser) environments. Writing two separate test suites for the same component would double maintenance and risk drift between what unit and E2E tests assert.

## Decision

Author each component's tests **once** as a framework-agnostic `TestSuiteInfo` in a `*.suite.ts`, then run it through thin adapters:

- `*.suite.ts` — `TestSuiteInfo<T>` with `{ title, url, tests(getTestEngine, mapper) }` ([types.ts#L114](../../packages/internal-test-runner/src/types.ts#L114)). Test bodies use the normalized `TestFrameworkMapper` assertions/hooks and a `getTestEngine` callback.
- `*.dom.test.ts` — `testRunner(suite, jestTestAdapter, { getTestEngine: react createTestEngine })`.
- `*.e2e.test.ts` — `testRunner(suite, playWrightTestFrameworkMapper, getTestRunnerInterface())`.

`TestFrameworkMapper` ([types.ts#L72](../../packages/internal-test-runner/src/types.ts#L72)) normalizes assertions (`assertEqual`, `assertApproxEqual`, …) and lifecycle (`describe`/`test`/hooks) across Jest, Vitest, and Playwright. `testRunner` ([testRunner.ts](../../packages/internal-test-runner/src/testRunner.ts#L7)) installs a `beforeEach` that distinguishes Jest's done-callback from Playwright's fixture at runtime (via `arguments[0]`) and navigates to `url` for E2E. `useTestEngine` ([useTestEngine.ts](../../packages/internal-test-runner/src/useTestEngine.ts#L21)) manages per-test engine creation + `cleanUp`.

## Consequences

- ✅ One suite verifies both unit and E2E behavior — no drift, half the maintenance.
- ✅ Adding a runner (Vitest was added) is one new adapter, no suite changes.
- ⚠️ Runner signatures genuinely differ, so adapters/`testRunner` carry intentional `@ts-ignore`/`@ts-expect-error` and `arguments`-based dispatch — these are load-bearing; preserve them ([jest-adapter](../../packages/internal-test-runner-jest-adapter/src/index.ts#L20-L29), [playwright-adapter](../../packages/internal-test-runner-playwright-adapter/src/index.ts#L41-L69)).
- ⚠️ Suite code is constrained to the mapper's surface (no runner-specific matchers).

## Alternatives considered

| Alternative                         | Why not chosen                                                |
| ----------------------------------- | ------------------------------------------------------------- |
| Separate Jest and Playwright suites | Duplication; unit/E2E assertions drift                        |
| Standardize on one runner           | Loses either fast jsdom unit runs or real-browser fidelity    |
| A heavier cross-runner framework    | Overkill; the mapper is a few dozen lines and dependency-free |

## Related

- [ARCHITECTURE.md → shared three-file test pattern](../ARCHITECTURE.md#the-shared-three-file-test-pattern), [modules/test-runner.md](../modules/test-runner.md), [modules/playwright.md](../modules/playwright.md). The project `CLAUDE.md` documents this pattern for contributors.
