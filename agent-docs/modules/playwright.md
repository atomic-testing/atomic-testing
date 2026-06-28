# Module: playwright (`@atomic-testing/playwright`)

## Purpose

Run the same component drivers in a real browser via Playwright. Provides a `PlaywrightInteractor` that implements `Interactor` directly over a Playwright `Page`, a `createTestEngine`, and the glue (`testRunnerAdapter`) that lets a shared `*.suite.ts` execute as an E2E test.

## Public surface

Barrel: [playwright/src/index.ts](../../packages/playwright/src/index.ts).

| Export                                        | Kind                             | File                                                                                 |
| --------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------ |
| `PlaywrightInteractor`                        | class (`implements Interactor`)  | [PlaywrightInteractor.ts](../../packages/playwright/src/PlaywrightInteractor.ts#L31) |
| `createTestEngine(page, parts)`               | function                         | [createTestEngine.ts](../../packages/playwright/src/createTestEngine.ts#L14)         |
| `goto(url, fixture?)`                         | function                         | [testRunnerAdapter.ts](../../packages/playwright/src/testRunnerAdapter.ts#L17)       |
| `playwrightGetTestEngine(scenePart, fixture)` | function                         | [testRunnerAdapter.ts#L30](../../packages/playwright/src/testRunnerAdapter.ts#L30)   |
| `playWrightTestFrameworkMapper`               | `TestFrameworkMapper`            | [testRunnerAdapter.ts#L41](../../packages/playwright/src/testRunnerAdapter.ts#L41)   |
| `getTestRunnerInterface<T>()`                 | function → `E2eTestInterface<T>` | [testRunnerAdapter.ts#L74](../../packages/playwright/src/testRunnerAdapter.ts#L74)   |

Depends on: `@atomic-testing/core`, `@atomic-testing/internal-test-runner`; `@playwright/test` is a peer ([package.json#L31-L37](../../packages/playwright/package.json#L31-L37)).

## Responsibilities

- Implement `Interactor` using Playwright's locator/mouse/keyboard APIs.
- Adapt Playwright's `test.*` lifecycle + `expect` to the shared `TestFrameworkMapper`.
- Navigate to the suite's `url` before each E2E test.

## Non-goals

- No component rendering — the app under test is served separately and reached via `goto(url)`. (See `CLAUDE.md` "Running E2E Tests": start the dev server first.)
- Does not reuse `DOMInteractor` — it is an independent implementation. See [ADR-002](../adr/002-interactor-abstraction.md).

## How it works

`PlaywrightInteractor(page)` resolves each `PartLocator` via `locatorUtil.toCssSelector(locator, this)` and calls `page.locator(css).<action>()` ([PlaywrightInteractor.ts#L31-L324](../../packages/playwright/src/PlaywrightInteractor.ts#L31-L324)). Notable points vs the DOM implementation:

- **No `act()`/`nextTick()`** — Playwright auto-waits for actionability.
- **`mouseMove`** hovers then `page.mouse.move(0, 0)` to reset pointer ([L133-L138](../../packages/playwright/src/PlaywrightInteractor.ts#L133-L138)).
- **`mouseOut`/`mouseLeave`** hover then `dispatchEvent('mouseout')` for cross-browser reliability ([L158-L176](../../packages/playwright/src/PlaywrightInteractor.ts#L158-L176)).
- **`enterText`** clears (unless `append`) and validates date-typed input formats, mirroring `DOMInteractor` ([L104-L121](../../packages/playwright/src/PlaywrightInteractor.ts#L104-L121)).
- **`isVisible`** checks `opacity`/`visibility`/`display` but wraps reads in try/catch so an element detaching mid-animation resolves to `false` instead of throwing ([L259-L297](../../packages/playwright/src/PlaywrightInteractor.ts#L259-L297)).
- **`isReadonly`** is inferred from the `readonly` attribute; **`isDisabled`** uses Playwright's `isDisabled()` ([L248-L257](../../packages/playwright/src/PlaywrightInteractor.ts#L248-L257)).

`createTestEngine(page, parts)` builds `new TestEngine([], new PlaywrightInteractor(page), { parts })` with no cleanup hook (Playwright owns the page lifecycle) ([createTestEngine.ts#L14-L20](../../packages/playwright/src/createTestEngine.ts#L14-L20)).

### Test-runner glue

- `playWrightTestFrameworkMapper` maps `expect`/`test.*` to `TestFrameworkMapper`. It carries intentional `@ts-expect-error`s because Playwright's fixture-destructuring callback signatures differ from the normalized interface (compatible at runtime) ([testRunnerAdapter.ts#L41-L69](../../packages/playwright/src/testRunnerAdapter.ts#L41-L69)).
- `getTestRunnerInterface()` returns `{ getTestEngine: playwrightGetTestEngine, goto }` — passed as the third arg to `testRunner` ([testRunnerAdapter.ts#L74-L79](../../packages/playwright/src/testRunnerAdapter.ts#L74-L79)).

E2E adapter file (from `CLAUDE.md`):

```ts
testRunner(testSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
```

## Invariants & failure modes

- `goto` requires the fixture's `page`; it is called in `beforeEach` by `testRunner` for E2E interfaces ([testRunner.ts#L34-L43](../../packages/internal-test-runner/src/testRunner.ts#L34-L43)).
- Cross-browser caveats (from `CLAUDE.md`): mouse events differ across engines; click coordinates can have sub-pixel offsets — use `assertApproxEqual` with tolerance.

## Extension points

- **Add an interactor capability** → implement the new `Interactor` method here too (Playwright is not a `DOMInteractor` subclass, so it won't inherit it).

## Related files

- [../ARCHITECTURE.md](../ARCHITECTURE.md#the-shared-three-file-test-pattern) — how E2E fits the shared pattern.
- [modules/test-runner.md](test-runner.md) — `TestFrameworkMapper`, `testRunner`, `useTestEngine`.
- [adr/002-interactor-abstraction.md](../adr/002-interactor-abstraction.md) — why Playwright reimplements rather than extends.
