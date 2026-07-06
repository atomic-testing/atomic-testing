# Module: storybook (`@atomic-testing/storybook`)

## Purpose

Framework-agnostic Storybook integration: drive existing component drivers inside
a real-browser Storybook — `play` functions in the Storybook UI and stories run
under `@storybook/addon-vitest` — with no React `act()` / Vue `nextTick()`
plumbing. One package serves every renderer that commits to real DOM. Umbrella:
[#944](https://github.com/atomic-testing/atomic-testing/issues/944).

## Public surface

Barrel: [storybook/src/index.ts](../../packages/storybook/src/index.ts).

| Export                                             | Kind                            | File                                                                          |
| -------------------------------------------------- | ------------------------------- | ----------------------------------------------------------------------------- |
| `StorybookInteractor`                              | class (`extends DOMInteractor`) | [StorybookInteractor.ts](../../packages/storybook/src/StorybookInteractor.ts) |
| `createTestEngine(canvasElement, parts, _option?)` | function                        | [createTestEngine.ts](../../packages/storybook/src/createTestEngine.ts)       |
| `withTestEngine(parts, fn)`                        | `play`-wrapping helper          | [withTestEngine.ts](../../packages/storybook/src/withTestEngine.ts)           |
| `withDriver(DriverClass, fn, option?)`             | `play`-wrapping helper          | [withDriver.ts](../../packages/storybook/src/withDriver.ts)                   |
| `StorybookPlayContext`, `WithDriverOption`         | types                           | [types.ts](../../packages/storybook/src/types.ts)                             |

Depends on: `@atomic-testing/core`, `@atomic-testing/dom-core` (`workspace:*`); peer `storybook@^10` (imports `storybook/test`).

## How it works

`StorybookInteractor` subclasses `DOMInteractor`, scoped to the story's
`canvasElement`, and injects Storybook's **instrumented `userEvent`** (from
`storybook/test`) through the `DOMInteractorOption` seam so driver interactions
are recorded in the Interactions panel. There is **no `act()`/`nextTick()`**: in
a real browser those wrappers are unnecessary (and `act()` emits warnings — see
the #945 spike findings). Settling instead uses two mechanisms:

- every mutating interaction awaits a `settle()` (macrotask + double
  `requestAnimationFrame`) so the renderer commits before the caller reads;
- `waitUntil` defaults to the escalating `probeIntervals` cadence from
  `timingUtil` for anything genuinely asynchronous.

`createTestEngine(canvasElement, parts)` mirrors dom-core's engine factory with
a `StorybookInteractor` and an empty root locator.

## Non-goals

- No rendering — Storybook renders the story; the engine only attaches.
- No jsdom `composeStories()` unit-test leg (see #953: that environment sets
  `IS_REACT_ACT_ENVIRONMENT`, so it is a different design).

## Related files

- [modules/dom-core.md](dom-core.md) — the base interactor and the `userEvent` DI seam.
- [modules/framework-adapters.md](framework-adapters.md) — the `act()`/`nextTick()` interactors this package deliberately avoids.
