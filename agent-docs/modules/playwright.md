# Module: playwright (`@atomic-testing/playwright`)

## Purpose

Run the same component drivers in a real browser via Playwright. Provides a `PlaywrightInteractor` that implements `Interactor` directly over a Playwright `Page` and a `createTestEngine`. The test-runner glue that lets a shared `*.suite.ts` execute as an E2E test lives in a separate package, [`@atomic-testing/internal-test-runner-playwright-adapter`](test-runner.md#playwright-adapter-glue-internal-test-runner-playwright-adapter), so this published driver stays free of any internal/experimental dependency (see [ADR-006](../adr/006-1.0-api-freeze-and-evolution.md)).

## Public surface

Barrel: [playwright/src/index.ts](../../packages/playwright/src/index.ts).

| Export | Kind | File |
| --- | --- | --- |
| `PlaywrightInteractor` | class (`implements Interactor`) | [PlaywrightInteractor.ts](../../packages/playwright/src/PlaywrightInteractor.ts) |
| `createTestEngine(page, parts)` | function | [createTestEngine.ts](../../packages/playwright/src/createTestEngine.ts#L14) |

Depends on: `@atomic-testing/core`; `@playwright/test` is a peer ([package.json](../../packages/playwright/package.json)).

## Responsibilities

- Implement `Interactor` using Playwright's locator/mouse/keyboard APIs.
- Build a `TestEngine` bound to a Playwright `Page` via `createTestEngine`.

(Adapting Playwright's `test.*` lifecycle/`expect` to `TestFrameworkMapper` and navigating to the suite's `url` are the job of `internal-test-runner-playwright-adapter`, not this package.)

## Non-goals

- No component rendering — the app under test is served separately and reached via `goto(url)`. (See `CLAUDE.md` "Running E2E Tests": start the dev server first.)
- Does not reuse `DOMInteractor` — it is an independent implementation. See [ADR-002](../adr/002-interactor-abstraction.md).

## How it works

`PlaywrightInteractor(page)` resolves each `PartLocator` via `locatorUtil.toCssSelector(locator, this)` and calls `page.locator(css).<action>()` ([PlaywrightInteractor.ts](../../packages/playwright/src/PlaywrightInteractor.ts)). Notable points vs the DOM implementation:

- **No `act()`/`nextTick()`** — Playwright auto-waits for actionability.
- **Unified element-not-found contract** — every mutative method runs through the private `runMutation` wrapper, which translates Playwright's auto-wait `TimeoutError` into `ElementNotFoundError` when (and only when) the locator matches nothing, otherwise rethrowing. This makes a missing-element mutation throw the same error class as `DOMInteractor`, so a shared `*.suite.ts` can assert it without branching on the environment (ADR-006). The trade-off: a truly-missing element waits out the page's action timeout before failing — bound it with `page.setDefaultTimeout` when fast failure matters.
- **`mouseMove`** hovers then `page.mouse.move(0, 0)` to reset pointer ([PlaywrightInteractor.ts](../../packages/playwright/src/PlaywrightInteractor.ts)).
- **`mouseOut`/`mouseLeave`** hover then `dispatchEvent('mouseout')` for cross-browser reliability ([PlaywrightInteractor.ts](../../packages/playwright/src/PlaywrightInteractor.ts)).
- **`enterText`** clears (unless `append`) and validates date-typed input formats, mirroring `DOMInteractor` ([PlaywrightInteractor.ts](../../packages/playwright/src/PlaywrightInteractor.ts)).
- **`isVisible`** checks `opacity`/`visibility`/`display` but wraps reads in try/catch so an element detaching mid-animation resolves to `false` instead of throwing ([PlaywrightInteractor.ts](../../packages/playwright/src/PlaywrightInteractor.ts)).
- **`isReadonly`** is inferred from the `readonly` attribute; **`isDisabled`** uses Playwright's `isDisabled()` ([PlaywrightInteractor.ts](../../packages/playwright/src/PlaywrightInteractor.ts)).
- **Layout/geometry primitives are Playwright-native**: `getBoundingRect`/`drag` use `boundingBox()` (which returns `null` rather than auto-waiting, so they throw `ElementNotFoundError` synchronously instead of via the `runMutation` timeout path); `drag` builds the gesture from `getBoundingRect`'s center via `page.mouse` (no `(0,0)` reset, unlike `mouseMove`); `scrollIntoView` uses `scrollIntoViewIfNeeded`, `scrollBy` evaluates `el.scrollBy` (deterministic cross-engine, vs `mouse.wheel`); `dragTo` uses native `Locator.dragTo`; `setInputFiles` reads paths from disk; `contextMenu` is a right-button `click`; `pressKey` builds a `Modifier+Key` chord (Shift + a printable key case-folds `event.key`, differing from jsdom — #924).

`createTestEngine(page, parts)` builds `new TestEngine([], new PlaywrightInteractor(page), { parts })` with no cleanup hook (Playwright owns the page lifecycle) ([createTestEngine.ts#L14-L20](../../packages/playwright/src/createTestEngine.ts#L14-L20)).

### Test-runner glue

The Playwright `TestFrameworkMapper` and E2E interface (`playWrightTestFrameworkMapper`, `getTestRunnerInterface`, `goto`, `playwrightGetTestEngine`) live in [`@atomic-testing/internal-test-runner-playwright-adapter`](test-runner.md#playwright-adapter-glue-internal-test-runner-playwright-adapter). That package depends on this one (for `createTestEngine`) and on `@atomic-testing/internal-test-runner` — keeping the published driver here off the internal graph.

## Invariants & failure modes

- Cross-browser caveats (from `CLAUDE.md`): mouse events differ across engines; click coordinates can have sub-pixel offsets — use `assertApproxEqual` with tolerance.

## Extension points

- **Add an interactor capability** → implement the new `Interactor` method here too (Playwright is not a `DOMInteractor` subclass, so it won't inherit it).

## Related files

- [../ARCHITECTURE.md](../ARCHITECTURE.md#the-shared-three-file-test-pattern) — how E2E fits the shared pattern.
- [modules/test-runner.md](test-runner.md) — `TestFrameworkMapper`, `testRunner`, `useTestEngine`.
- [adr/002-interactor-abstraction.md](../adr/002-interactor-abstraction.md) — why Playwright reimplements rather than extends.
