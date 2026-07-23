# Module: dom-core (`@atomic-testing/dom-core`)

## Purpose

The base DOM implementation of `Interactor`. Turns a `PartLocator` into real DOM operations using `@testing-library/dom` + `@testing-library/user-event`. The React and Vue interactors subclass `DOMInteractor`; the Playwright one does not.

## Public surface

Barrel: [dom-core/src/index.ts](../../packages/dom-core/src/index.ts).

| Export                                          | Kind                              | File                                                                                         |
| ----------------------------------------------- | --------------------------------- | -------------------------------------------------------------------------------------------- |
| `DOMInteractor`                                 | class (`implements Interactor`)   | [DOMInteractor.ts](../../packages/dom-core/src/DOMInteractor.ts)                             |
| `createDomTestEngine(element, parts, _option?)` | function                          | [createDomTestEngine.ts](../../packages/dom-core/src/createDomTestEngine.ts#L13)             |
| `FakeMouseEvent`                                | class                             | [fakeEvents/FakeMouseEvent.ts](../../packages/dom-core/src/fakeEvents/FakeMouseEvent.ts#L5)  |
| `FakeDataTransfer`                              | class                             | [fakeEvents/FakeDataTransfer.ts](../../packages/dom-core/src/fakeEvents/FakeDataTransfer.ts) |
| `IDomTestEngineOption`                          | type (`= IComponentDriverOption`) | [types.ts](../../packages/dom-core/src/types.ts#L3)                                          |
| `DOMInteractorOption`, `UserEventDispatcher`    | types (constructor DI seam)       | [types.ts](../../packages/dom-core/src/types.ts)                                             |

Depends on: `@atomic-testing/core`, `@testing-library/dom`, `@testing-library/user-event`.

## Responsibilities

- Resolve locators to elements (`getElement` via `rootEl.querySelector(All)`).
- Implement every `Interactor` method against the DOM.
- Provide a no-render `createDomTestEngine` for already-present DOM.

## Non-goals

- No framework reactivity flushing — that's `ReactInteractor`/`VueInteractor`'s job.
- No rendering/mounting of components — pass it an existing element.

## How it works

`DOMInteractor` is constructed with a `rootEl` (default `document.documentElement`) and an optional `DOMInteractorOption` whose `userEvent` (a structural `UserEventDispatcher`) defaults to the `@testing-library/user-event` singleton — the injection seam `StorybookInteractor` uses to supply Storybook's instrumented `userEvent`. The private workhorse is `getElement(locator, isMultiple?)`: it first checks `locatorUtil.splitAtAccessibleRoleLocator(locator)` for a `findByRole` segment (#923) — if present, it resolves the preceding scope (recursing into itself) and runs `@testing-library/dom`'s `queryAllByRole` instead of CSS; otherwise it calls `locatorUtil.toCssSelector(locator, this)` then `rootEl.querySelector`/`querySelectorAll` as before. Every other primitive resolves through this one method, so `findByRole` locators work everywhere for free.

Interaction details worth knowing:

- **`click`** uses `userEvent.click(el)` for a simple click, but switches to `FakeMouseEvent('click', {clientX, clientY})` + `fireEvent` when a `position` is given — comment notes some MUI components ignore `fireEvent('click')`.
- **`enterText`** clears first (unless `option.append`), validates date/time formats for date-typed inputs, then `userEvent.type`.
- **Mouse position** is computed relative to the element's bounding box (`calculateMousePosition`), centering when no preferred point is given.
- **`isVisible`** returns false on `opacity: 0`, `visibility: hidden`, or `display: none` (does not check viewport).
- **`mouseEnter`/`mouseLeave`** are emulated with `fireEvent.mouseOver`/`mouseOut` (testing-library nuance).
- **Layout-dependent primitives** — `scrollIntoView`/`scrollBy`/`getBoundingRect` are jsdom no-ops / zero-rects (no layout engine); `setInputFiles` uploads via `userEvent.upload`; `contextMenu` fires a focused `contextmenu` event. Real geometry/scroll outcomes are E2E-only.
- **`drag`/`dragTo`** share a private `dispatchMouse` helper firing raw mouse events, AND (#922) a private `dispatchHtml5DragSequence` helper that fires the native HTML5 DnD sequence (`dragstart`→`dragenter`→`dragover`→`drop`→`dragend`) sharing one `FakeDataTransfer` — jsdom has no native `DragEvent`/`DataTransfer`, so `@testing-library/dom`'s `fireEvent.drag*` attach the fake `dataTransfer` as a plain property, its own documented recipe for jsdom HTML5 DnD. Real positional drag outcomes remain E2E-only.
- **`pressKey`** folds `ctrl/shift/alt/meta` into the event init. A Shift + printable key does NOT case-fold `event.key` here (`{key: 'a', shiftKey: true}` stays `'a'`) — verified (#924) that this matches Playwright's current behavior too (playwright-core 1.61.1 also does not case-fold), so the two engines agree; a caller needing an actual shifted character (`'A'`, `'!'`) passes it as `key` directly.
- **`pressKey` carries the legacy numeric code** — synthetic `KeyboardEvent`s default to `keyCode: 0`, and some libraries (Angular Material/CDK) dispatch on `event.keyCode` rather than `event.key`, silently ignoring the press; the event init mirrors the key into `keyCode`/`which` via `DOMInteractor.legacyKeyCodes` so DOM-mode key presses match real browser input (#1027).

`createDomTestEngine(element, parts)` simply wraps `new DOMInteractor(element)` in a `TestEngine` with an empty root locator and a no-op cleanup ([createDomTestEngine.ts#L13-L27](../../packages/dom-core/src/createDomTestEngine.ts#L13-L27)).

### FakeMouseEvent

`@testing-library` events drop `pageX/pageY`; `FakeMouseEvent extends MouseEvent` shadows them with own properties (`Object.defineProperty`, not assignment — real Chromium exposes them as getter-only prototype accessors, and the Angular fixtures run DOM tests in a real browser per ADR-013) so position-based interactions work ([FakeMouseEvent.ts](../../packages/dom-core/src/fakeEvents/FakeMouseEvent.ts)).

### FakeDataTransfer

jsdom implements neither `DragEvent` nor `DataTransfer` (#922). `FakeDataTransfer` is a minimal `DataTransfer` implementation (`setData`/`getData`/`clearData`/`types`) shared across one `drag`/`dragTo` gesture's whole HTML5 event sequence, so a `dragstart` handler's `setData` is readable from `drop`'s `getData` ([FakeDataTransfer.ts](../../packages/dom-core/src/fakeEvents/FakeDataTransfer.ts)).

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
