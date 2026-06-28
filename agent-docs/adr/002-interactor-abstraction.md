# ADR-002: `Interactor` abstraction for environment portability

## Status

Accepted (describes the existing design).

## Context

The same component drivers should run in multiple environments — jsdom (Jest), React/Vue rendering, and a real browser (Playwright) — without rewriting test logic. Each environment performs low-level actions (click, type, query) differently and has different async/reactivity semantics.

## Decision

Define a single `Interactor` interface ([Interactor.ts](../../packages/core/src/interactor/Interactor.ts#L26)) covering all low-level operations (mutative, read-only, debug). Drivers depend only on this interface and pass a `PartLocator`; they never touch the environment. Each environment provides an implementation:

- `DOMInteractor implements Interactor` — testing-library/user-event over jsdom ([DOMInteractor.ts](../../packages/dom-core/src/DOMInteractor.ts#L32)).
- `ReactInteractor extends DOMInteractor` — wraps each action in `act()` ([ReactInteractor.ts](../../packages/react-core/src/ReactInteractor.ts#L22)).
- `VueInteractor extends DOMInteractor` — awaits `nextTick()` after each action ([VueInteractor.ts](../../packages/vue-3/src/VueInteractor.ts#L22)).
- `PlaywrightInteractor implements Interactor` **directly** (not a `DOMInteractor` subclass) — uses Playwright's auto-waiting locator API ([PlaywrightInteractor.ts](../../packages/playwright/src/PlaywrightInteractor.ts#L31)).

The right implementation is injected by the environment's `createTestEngine`.

## Consequences

- ✅ One driver codebase runs across DOM/React/Vue/Playwright; a shared `*.suite.ts` runs as both DOM and E2E ([ADR-004](004-shared-three-file-test-pattern.md)).
- ✅ Reactivity handling is centralized in the interactor, keeping tests identical.
- ⚠️ The interface is the contract: a **new `Interactor` method must be implemented in every standalone implementation** — `DOMInteractor` subclasses inherit it, but `PlaywrightInteractor` does not and must add it explicitly.
- ⚠️ Behavioral parity isn't free: e.g. `isVisible` has extra detach-handling in Playwright but not DOM ([PlaywrightInteractor.ts#L259-L297](../../packages/playwright/src/PlaywrightInteractor.ts#L259-L297) vs [DOMInteractor.ts#L456-L478](../../packages/dom-core/src/DOMInteractor.ts#L456-L478)); some events are emulated differently per environment.

## Alternatives considered

| Alternative                                                 | Why not chosen                                                                                                           |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| One implementation per environment with no shared interface | No driver reuse; logic duplicated per environment                                                                        |
| Make Playwright extend `DOMInteractor`                      | Playwright's model (browser-side, auto-wait) doesn't match jsdom's synchronous DOM; forcing inheritance would fight both |
| Compile-time environment switch                             | Loses runtime flexibility (same suite, two runners) and complicates packaging                                            |

## Related

- [ARCHITECTURE.md → Interactor inheritance](../ARCHITECTURE.md#interactor-inheritance), [modules/dom-core.md](../modules/dom-core.md), [modules/playwright.md](../modules/playwright.md).
