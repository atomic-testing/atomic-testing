# Module: dom-core (`@atomic-testing/dom-core`)

## Purpose

The base DOM implementation of `Interactor`. Turns a `PartLocator` into real DOM operations using `@testing-library/dom` + `@testing-library/user-event`. The React and Vue interactors subclass `DOMInteractor`; the Playwright one does not.

## Public surface

Barrel: [dom-core/src/index.ts](../../packages/dom-core/src/index.ts).

| Export                                          | Kind                              | File                                                                                        |
| ----------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------- |
| `DOMInteractor`                                 | class (`implements Interactor`)   | [DOMInteractor.ts](../../packages/dom-core/src/DOMInteractor.ts#L32)                        |
| `createDomTestEngine(element, parts, _option?)` | function                          | [createDomTestEngine.ts](../../packages/dom-core/src/createDomTestEngine.ts#L13)            |
| `FakeMouseEvent`                                | class                             | [fakeEvents/FakeMouseEvent.ts](../../packages/dom-core/src/fakeEvents/FakeMouseEvent.ts#L5) |
| `IDomTestEngineOption`                          | type (`= IComponentDriverOption`) | [types.ts](../../packages/dom-core/src/types.ts#L3)                                         |
| `DOMInteractorOption`, `UserEventDispatcher`    | types (constructor DI seam)       | [types.ts](../../packages/dom-core/src/types.ts)                                            |

Depends on: `@atomic-testing/core`, `@testing-library/dom`, `@testing-library/user-event`.

## Responsibilities

- Resolve locators to elements (`getElement` via `rootEl.querySelector(All)`).
- Implement every `Interactor` method against the DOM.
- Provide a no-render `createDomTestEngine` for already-present DOM.

## Non-goals

- No framework reactivity flushing — that's `ReactInteractor`/`VueInteractor`'s job.
- No rendering/mounting of components — pass it an existing element.

## How it works

`DOMInteractor` is constructed with a `rootEl` (default `document.documentElement`) and an optional `DOMInteractorOption` whose `userEvent` (a structural `UserEventDispatcher`) defaults to the `@testing-library/user-event` singleton — the injection seam `StorybookInteractor` uses to supply Storybook's instrumented `userEvent` ([DOMInteractor.ts#L35-L43](../../packages/dom-core/src/DOMInteractor.ts#L35-L43)). The private workhorse is `getElement(locator, isMultiple?)`: it calls `locatorUtil.toCssSelector(locator, this)` then `rootEl.querySelector`/`querySelectorAll` ([DOMInteractor.ts#L379-L391](../../packages/dom-core/src/DOMInteractor.ts#L379-L391)).

Interaction details worth knowing:

- **`click`** uses `userEvent.click(el)` for a simple click, but switches to `FakeMouseEvent('click', {clientX, clientY})` + `fireEvent` when a `position` is given — comment notes some MUI components ignore `fireEvent('click')` ([DOMInteractor.ts#L81-L101](../../packages/dom-core/src/DOMInteractor.ts#L81-L101)).
- **`enterText`** clears first (unless `option.append`), validates date/time formats for date-typed inputs, then `userEvent.type` ([DOMInteractor.ts#L315-L339](../../packages/dom-core/src/DOMInteractor.ts#L315-L339)).
- **Mouse position** is computed relative to the element's bounding box (`calculateMousePosition`), centering when no preferred point is given ([DOMInteractor.ts#L64-L71](../../packages/dom-core/src/DOMInteractor.ts#L64-L71)).
- **`isVisible`** returns false on `opacity: 0`, `visibility: hidden`, or `display: none` (does not check viewport) ([DOMInteractor.ts#L456-L478](../../packages/dom-core/src/DOMInteractor.ts#L456-L478)).
- **`mouseEnter`/`mouseLeave`** are emulated with `fireEvent.mouseOver`/`mouseOut` (testing-library nuance) ([DOMInteractor.ts#L240-L266](../../packages/dom-core/src/DOMInteractor.ts#L240-L266)).
- **Layout-dependent primitives** — `scrollIntoView`/`scrollBy`/`getBoundingRect` are jsdom no-ops / zero-rects (no layout engine); `drag`/`dragTo` share a private `dispatchMouse` helper firing raw mouse events only, never HTML5 DnD (#922); `setInputFiles` uploads via `userEvent.upload`; `contextMenu` fires a focused `contextmenu` event; `pressKey` folds `ctrl/shift/alt/meta` into the event init (a Shift + printable key reports a different `event.key` than Playwright — #924). Real geometry/scroll/drag outcomes are E2E-only.

`createDomTestEngine(element, parts)` simply wraps `new DOMInteractor(element)` in a `TestEngine` with an empty root locator and a no-op cleanup ([createDomTestEngine.ts#L13-L27](../../packages/dom-core/src/createDomTestEngine.ts#L13-L27)).

### FakeMouseEvent

`@testing-library` events drop `pageX/pageY`; `FakeMouseEvent extends MouseEvent` and `Object.assign`s them back so position-based interactions work ([FakeMouseEvent.ts](../../packages/dom-core/src/fakeEvents/FakeMouseEvent.ts#L5-L13)).

## Invariants & failure modes

- Every mutative method throws `ElementNotFoundError(locator, action)` when `getElement` returns `null` (e.g. [DOMInteractor.ts#L82-L85](../../packages/dom-core/src/DOMInteractor.ts#L82-L85)).
- `getInputValue` only reads `INPUT`/`TEXTAREA`; `getSelectValues`/`getSelectLabels` only read `SELECT` `option:checked` ([DOMInteractor.ts#L393-L423](../../packages/dom-core/src/DOMInteractor.ts#L393-L423)).
- `waitUntilComponentState` delegates to `interactorUtil.interactorWaitUtil` (throws on timeout); `waitUntil` delegates to `timingUtil.waitUntil` (returns last value) ([DOMInteractor.ts#L362-L371](../../packages/dom-core/src/DOMInteractor.ts#L362-L371)).

## Extension points

- **A new environment that is DOM-based** → subclass `DOMInteractor`, `override` interactive methods to add flushing, and `override clone()` to return your subclass. See `ReactInteractor`/`VueInteractor` in [modules/framework-adapters.md](framework-adapters.md).

## Related files

- [DOMInteractor.ts](../../packages/dom-core/src/DOMInteractor.ts) — the implementation.
- [../DOMAIN.md](../DOMAIN.md) — interactor contract & invariants.
- [../ARCHITECTURE.md](../ARCHITECTURE.md#interactor-inheritance) — where DOMInteractor sits in the inheritance tree.
