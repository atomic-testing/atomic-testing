import {
  BlurOption,
  BoundingRect,
  ClickOption,
  CssProperty,
  dateUtil,
  defaultWaitForOption,
  ElementNotFoundError,
  EnterTextOption,
  FocusOption,
  HoverOption,
  Interactor,
  interactorUtil,
  locatorUtil,
  MouseDownOption,
  MouseEnterOption,
  MouseLeaveOption,
  MouseMoveOption,
  MouseOutOption,
  MouseUpOption,
  Optional,
  PartLocator,
  Point,
  PressKeyOption,
  timingUtil,
  WaitForOption,
  WaitUntilOption,
} from '@atomic-testing/core';
import { fireEvent } from '@testing-library/dom';
import defaultUserEvent from '@testing-library/user-event';

import { FakeMouseEvent } from './fakeEvents';
import { DOMInteractorOption, UserEventDispatcher } from './types';

/**
 * Derive a `KeyboardEvent.code` from a `KeyboardEvent.key`, approximating what
 * a real browser reports for a standard US layout: letters map to `KeyX`,
 * digits to `DigitX`, space to `Space`, and named keys (`ArrowRight`, `Enter`,
 * `Home`, …) carry their own name as the code. jsdom leaves `code` empty
 * unless supplied, but real keyboard events always populate it — and component
 * libraries legitimately switch on `code` (PrimeVue's Slider does), so the
 * jsdom leg must match. Left/right-variant modifiers (`Shift` → `ShiftLeft`)
 * are not disambiguated; a bare modifier press is not a supported gesture here.
 */
function deriveKeyCode(key: string): string {
  if (key === ' ') {
    return 'Space';
  }
  if (/^[a-zA-Z]$/.test(key)) {
    return `Key${key.toUpperCase()}`;
  }
  if (/^[0-9]$/.test(key)) {
    return `Digit${key}`;
  }
  return key;
}

export class DOMInteractor implements Interactor {
  protected readonly userEvent: UserEventDispatcher;

  constructor(
    protected readonly rootEl: HTMLElement = document.documentElement,
    option?: DOMInteractorOption
  ) {
    this.userEvent = option?.userEvent ?? defaultUserEvent;
  }
  async getAttribute(locator: PartLocator, name: string, isMultiple: true): Promise<readonly string[]>;
  async getAttribute(locator: PartLocator, name: string, isMultiple: false): Promise<Optional<string>>;
  async getAttribute(locator: PartLocator, name: string): Promise<Optional<string>>;
  async getAttribute(
    locator: PartLocator,
    name: string,
    isMultiple?: boolean
  ): Promise<Optional<string> | readonly string[]> {
    if (isMultiple) {
      const elements = await this.getElement(locator, true);
      return Promise.resolve(elements.map(el => el.getAttribute(name)!));
    } else {
      const el = await this.getElement(locator);
      if (el != null) {
        return Promise.resolve(el.getAttribute(name) ?? undefined);
      }
      return undefined;
    }
  }

  async getStyleValue(locator: PartLocator, propertyName: CssProperty): Promise<Optional<string>> {
    const el = await this.getElement(locator);
    if (el != null) {
      const computedStyle = window.getComputedStyle(el as HTMLElement);
      const val = computedStyle[propertyName] as string;
      return Promise.resolve(val ?? undefined);
    }
    return undefined;
  }

  protected calculateMousePosition(el: Element, preferredPoint?: Point) {
    const rect = el.getBoundingClientRect();
    const mouseLocation: Point = {
      x: preferredPoint?.x != null ? rect.left + preferredPoint?.x : rect.left + rect.width / 2,
      y: preferredPoint?.y != null ? rect.top + preferredPoint?.y : rect.top + rect.height / 2,
    };
    return mouseLocation;
  }

  /**
   * Dispatch a click event on the element that matches the locator.
   *
   * @param locator - Locator used to find the target element
   * @param option - Optional click configuration such as the click position
   * @returns A promise that resolves after the event is triggered
   * @throws {ElementNotFoundError} If the element is not found
   */
  async click(locator: PartLocator, option?: ClickOption): Promise<void> {
    const el = await this.getElement(locator);
    if (el == null) {
      throw new ElementNotFoundError(locator, 'click');
    }

    const isSimpleEvent = option?.position == null;
    if (isSimpleEvent) {
      // Some MUI component does not work with fireEvent('click', ...)
      await this.userEvent.click(el);
    } else {
      const clickLocation = this.calculateMousePosition(el, option?.position);
      const evt = new FakeMouseEvent('click', {
        bubbles: true,
        clientX: clickLocation.x,
        clientY: clickLocation.y,
      });

      fireEvent(el, evt);
    }
  }

  /**
   * Move the mouse over the element.
   *
   * @param locator - Locator used to find the target element
   * @param _option - Reserved for future use
   * @returns A promise that resolves after the hover event
   * @throws {ElementNotFoundError} If the element is not found
   */
  async hover(locator: PartLocator, _option?: HoverOption): Promise<void> {
    const el = await this.getElement(locator);
    if (el == null) {
      throw new ElementNotFoundError(locator, 'hover');
    }
    await this.userEvent.hover(el);
  }

  /**
   * Dispatch a `mousemove` event on the target element.
   *
   * @param locator - Locator used to find the target element
   * @param option - Allows specifying the mouse position relative to the element
   * @returns A promise that resolves once the event has been dispatched
   * @throws {ElementNotFoundError} If the element is not found
   */
  async mouseMove(locator: PartLocator, option?: Partial<MouseMoveOption>): Promise<void> {
    const el = await this.getElement(locator);
    if (el == null) {
      throw new ElementNotFoundError(locator, 'mouseMove');
    }

    const moveLocation = this.calculateMousePosition(el, option?.position);
    const evt = new FakeMouseEvent('mousemove', {
      bubbles: true,
      clientX: moveLocation.x,
      clientY: moveLocation.y,
    });

    fireEvent(el, evt);
  }

  /**
   * Dispatch a `mousedown` event on the target element.
   *
   * @param locator - Locator used to find the target element
   * @param option - Allows specifying the mouse position relative to the element
   * @returns Promise resolved when the event is dispatched
   * @throws {ElementNotFoundError} If the element is not found
   */
  async mouseDown(locator: PartLocator, option?: Partial<MouseDownOption>): Promise<void> {
    const el = await this.getElement(locator);
    if (el == null) {
      throw new ElementNotFoundError(locator, 'mouseDown');
    }

    const mouseLocation = this.calculateMousePosition(el, option?.position);
    const evt = new FakeMouseEvent('mousedown', {
      bubbles: true,
      clientX: mouseLocation.x,
      clientY: mouseLocation.y,
    });

    fireEvent(el, evt);
  }

  /**
   * Dispatch a `mouseup` event on the target element.
   *
   * @param locator - Locator used to find the target element
   * @param option - Allows specifying the mouse position relative to the element
   * @returns Promise resolved when the event is dispatched
   * @throws {ElementNotFoundError} If the element is not found
   */
  async mouseUp(locator: PartLocator, option?: Partial<MouseUpOption>): Promise<void> {
    const el = await this.getElement(locator);
    if (el == null) {
      throw new ElementNotFoundError(locator, 'mouseUp');
    }

    const mouseLocation = this.calculateMousePosition(el, option?.position);
    const evt = new FakeMouseEvent('mouseup', {
      bubbles: true,
      clientX: mouseLocation.x,
      clientY: mouseLocation.y,
    });

    fireEvent(el, evt);
  }

  /**
   * Dispatch a `mouseover` event on the target element.
   *
   * @param locator - Locator used to find the target element
   * @param option - Optional mouse position relative to the element
   * @returns Promise resolved once the event is dispatched
   * @throws {ElementNotFoundError} If the element is not found
   */
  async mouseOver(locator: PartLocator, option?: Partial<HoverOption>): Promise<void> {
    const el = await this.getElement(locator);
    if (el == null) {
      throw new ElementNotFoundError(locator, 'mouseOver');
    }

    const moveLocation = this.calculateMousePosition(el, option?.position);
    const evt = new FakeMouseEvent('mouseover', {
      bubbles: true,
      clientX: moveLocation.x,
      clientY: moveLocation.y,
    });

    fireEvent(el, evt);
  }

  /**
   * Dispatch a `mouseout` event on the target element.
   *
   * @param locator - Locator used to find the target element
   * @param _option - Reserved for future use
   * @returns Promise resolved once the event is dispatched
   * @throws {ElementNotFoundError} If the element is not found
   */
  async mouseOut(locator: PartLocator, _option?: Partial<MouseOutOption>): Promise<void> {
    const el = await this.getElement(locator);
    if (el == null) {
      throw new ElementNotFoundError(locator, 'mouseOut');
    }

    fireEvent.mouseOut(el);
  }

  /**
   * Dispatch a `mouseenter` event on the target element.
   *
   * @param locator - Locator used to find the target element
   * @param _option - Reserved for future use
   * @returns Promise resolved after the event dispatches
   * @throws {ElementNotFoundError} If the element is not found
   */
  async mouseEnter(locator: PartLocator, _option?: Partial<MouseEnterOption>): Promise<void> {
    const el = await this.getElement(locator);
    if (el == null) {
      throw new ElementNotFoundError(locator, 'mouseEnter');
    }

    // mouseOver would trigger mouseEnter event
    // hover fireEvent.mouseEnter does not
    fireEvent.mouseOver(el);
  }

  /**
   * Dispatch a `mouseleave` event on the target element.
   *
   * @param locator - Locator used to find the target element
   * @param _option - Reserved for future use
   * @returns Promise resolved once the event is dispatched
   * @throws {ElementNotFoundError} If the element is not found
   */
  async mouseLeave(locator: PartLocator, _option?: Partial<MouseLeaveOption>): Promise<void> {
    const el = await this.getElement(locator);
    if (el == null) {
      throw new ElementNotFoundError(locator, 'mouseLeave');
    }

    fireEvent.mouseOut(el);
  }

  /**
   * Move focus to the element found by the locator.
   *
   * @param locator - Locator used to find the target element
   * @param _option - Reserved for future use
   * @returns Promise resolved when focus has been applied
   * @throws {ElementNotFoundError} If the element is not found
   */
  async focus(locator: PartLocator, _option?: Partial<FocusOption>): Promise<void> {
    const el = await this.getElement(locator);
    if (el == null) {
      throw new ElementNotFoundError(locator, 'focus');
    }
    if ('focus' in el === false) {
      return;
    }
    (el as HTMLInputElement).focus();
  }

  /**
   * Remove focus from the element found by the locator.
   *
   * @param locator - Locator used to find the target element
   * @param _option - Reserved for future use
   * @returns Promise resolved when blur has been applied
   * @throws {ElementNotFoundError} If the element is not found
   */
  async blur(locator: PartLocator, _option?: Partial<BlurOption>): Promise<void> {
    const el = await this.getElement(locator);
    if (el == null) {
      throw new ElementNotFoundError(locator, 'blur');
    }
    if ('blur' in el === false) {
      return;
    }
    (el as HTMLInputElement).blur();
  }

  /**
   * Legacy numeric key codes for the named keys drivers press. Synthetic
   * `KeyboardEvent`s carry `keyCode: 0` unless told otherwise, and several
   * component libraries (Angular Material/CDK among them) still dispatch on
   * `event.keyCode` rather than `event.key` — without this a synthetic
   * `Escape`/`Enter` is silently ignored. Real browser input (Playwright)
   * carries the code natively; this map restores parity for the DOM path.
   */
  private static readonly legacyKeyCodes: Readonly<Record<string, number>> = {
    Backspace: 8,
    Tab: 9,
    Enter: 13,
    Escape: 27,
    ' ': 32,
    PageUp: 33,
    PageDown: 34,
    End: 35,
    Home: 36,
    ArrowLeft: 37,
    ArrowUp: 38,
    ArrowRight: 39,
    ArrowDown: 40,
    Delete: 46,
  };

  private static legacyKeyCodeOf(key: string): number | undefined {
    const named = DOMInteractor.legacyKeyCodes[key];
    if (named != null) {
      return named;
    }
    // Letters and digits: the legacy code is the uppercase character code.
    return /^[a-zA-Z0-9]$/.test(key) ? key.toUpperCase().charCodeAt(0) : undefined;
  }

  /**
   * Dispatch a key press (`keydown` + `keyup`) on the element matched by the locator.
   *
   * The element is focused first so the key originates from the active element,
   * matching a real key press. `fireEvent` is used over `userEvent.keyboard` for
   * determinism and because MUI handlers read `event.key` directly. The physical
   * `code` is derived from `key` (see {@link deriveKeyCode}) so handlers that
   * switch on `event.code` — e.g. PrimeVue's Slider — behave as they do under a
   * real browser event, where `code` is always populated.
   *
   * @param locator - Locator used to find the target element
   * @param key - A `KeyboardEvent.key` value, e.g. `'Escape'`, `'Backspace'`
   * @param option - Modifier flags folded into the event init as
   * `ctrlKey`/`shiftKey`/`altKey`/`metaKey`, so a handler reading
   * `event.ctrlKey` (etc.) sees the chord — see {@link PressKeyOption}
   * @returns Promise resolved once the events have been dispatched
   * @throws {ElementNotFoundError} If the element is not found
   */
  async pressKey(locator: PartLocator, key: string, option?: Partial<PressKeyOption>): Promise<void> {
    const el = await this.getElement(locator);
    if (el == null) {
      throw new ElementNotFoundError(locator, 'pressKey');
    }
    if ('focus' in el) {
      (el as HTMLElement).focus();
    }
    // `keyCode`/`which` mirror `key` for handlers that still read the legacy
    // numeric code (see legacyKeyCodes above).
    const keyCode = DOMInteractor.legacyKeyCodeOf(key);
    const eventInit = {
      key,
      code: deriveKeyCode(key),
      ...(keyCode != null ? { keyCode, which: keyCode } : {}),
      ctrlKey: !!option?.ctrl,
      shiftKey: !!option?.shift,
      altKey: !!option?.alt,
      metaKey: !!option?.meta,
    };
    fireEvent.keyDown(el, eventInit);
    fireEvent.keyUp(el, eventInit);
  }

  /**
   * Dispatch a `contextmenu` (right-click) event on the element matched by the locator.
   *
   * The element is focused first if focusable, mirroring {@link pressKey}, so the
   * event originates from the active element as a real right-click would. A
   * context menu has no `aria-expanded`/controlled-open path, so this dispatched
   * event is the only way to exercise the menu-opening behavior.
   *
   * @param locator - Locator used to find the target element
   * @returns Promise resolved once the event has been dispatched
   * @throws {ElementNotFoundError} If the element is not found
   */
  async contextMenu(locator: PartLocator): Promise<void> {
    const el = await this.getElement(locator);
    if (el == null) {
      throw new ElementNotFoundError(locator, 'contextMenu');
    }
    if ('focus' in el) {
      (el as HTMLElement).focus();
    }
    fireEvent.contextMenu(el);
  }

  /**
   * Activate the element matched by the locator without pointer geometry.
   *
   * Uses `userEvent.click`, which ignores layout and coordinates, so it reaches a
   * visually-hidden or covered input that a positional click would miss (e.g. MUI
   * Rating's hidden `<input type="radio">`).
   *
   * @param locator - Locator used to find the target element
   * @returns Promise resolved once the element has been activated
   * @throws {ElementNotFoundError} If the element is not found
   */
  async activate(locator: PartLocator): Promise<void> {
    const el = await this.getElement(locator);
    if (el == null) {
      throw new ElementNotFoundError(locator, 'activate');
    }
    await this.userEvent.click(el);
  }

  /**
   * Type text into the element matched by the locator.
   *
   * @param locator - Locator used to find the target element
   * @param text - The string to type
   * @param option - Options such as appending or replacing existing value
   * @returns Promise resolved when typing has completed
   * @throws {ElementNotFoundError} If the element is not found
   */
  async enterText(locator: PartLocator, text: string, option?: Partial<EnterTextOption> | undefined): Promise<void> {
    const el = await this.getElement(locator);
    if (el == null) {
      throw new ElementNotFoundError(locator, 'enterText');
    }

    if (!option?.append) {
      await this.userEvent.clear(el);
    }

    // An empty value is a pure clear: `userEvent.clear()` above already emptied
    // the field, there is no text to type or date format to validate, and
    // `userEvent.type` rejects `''` ("Expected key descriptor"). Return early —
    // this also keeps clearing a date/time input from tripping the date-format
    // validation below, and matches PlaywrightInteractor's `clear()` + `fill('')`.
    if (text === '') {
      return;
    }

    // If it is a date, time or datetime-local input, validate the date format
    if (el.tagName === 'INPUT') {
      const type = el.getAttribute('type') ?? '';
      if (dateUtil.isHtmlDateInputType(type)) {
        const result = dateUtil.validateHtmlDateInput(type, text);
        if (!result.valid) {
          throw new Error(
            `Invalid date format for type: ${type}, expected format: ${result.format}, example: ${result.example}`
          );
        }
      }
    }

    await this.userEvent.type(el, text);
  }

  /**
   * Set the value of a range input and fire its change event.
   *
   * `fireEvent.change` assigns the value through the element's native value
   * setter (which both sanitizes it to the input's step and lets React's value
   * tracker observe the change) and dispatches the event so a controlled
   * component re-renders. Typing (`enterText`) does not apply to a range input.
   *
   * @param locator - Locator used to find the range input element
   * @param value - The numeric value to set
   * @returns Promise resolved once the change event has fired
   * @throws {ElementNotFoundError} If the element is not found
   */
  async setRangeValue(locator: PartLocator, value: number): Promise<void> {
    const el = await this.getElement(locator);
    if (el == null) {
      throw new ElementNotFoundError(locator, 'setRangeValue');
    }
    fireEvent.change(el, { target: { value: String(value) } });
  }

  /**
   * Select one or more option values in a `<select>` element.
   *
   * @param locator - Locator used to find the select element
   * @param values - Values of the options to select
   * @returns Promise resolved when the options have been selected
   * @throws {ElementNotFoundError} If the element is not found
   */
  async selectOptionValue(locator: PartLocator, values: string[]): Promise<void> {
    const el = await this.getElement(locator);
    if (el == null) {
      throw new ElementNotFoundError(locator, 'selectOptionValue');
    }
    await this.userEvent.selectOptions(el, values);
  }

  /**
   * Set the selected files on an `<input type="file">` element.
   *
   * The interactor contract passes filesystem paths, but a file input's value
   * cannot be assigned programmatically — the browser blocks it — so the
   * `FileList` must be populated through `userEvent.upload`, which also fires the
   * `change` event. jsdom has no filesystem and never reads file bytes; only
   * `File.name` is observable, so each path is wrapped in an empty `File` named
   * by its basename. The real bytes matter only to the Playwright layer, which
   * reads the paths natively — keeping `dom-core` free of any `node` dependency.
   *
   * @param locator - Locator used to find the file input element
   * @param files - One or more filesystem paths to upload
   * @returns Promise resolved once the upload change event has fired
   * @throws {ElementNotFoundError} If the element is not found
   */
  async setInputFiles(locator: PartLocator, files: string | string[]): Promise<void> {
    const el = await this.getElement(locator);
    if (el == null) {
      throw new ElementNotFoundError(locator, 'setInputFiles');
    }
    const paths = Array.isArray(files) ? files : [files];
    const fileObjects = paths.map(filePath => {
      // `||` (not `??`): split().pop() yields '' (not undefined) for a
      // trailing-separator path, and an empty File name is useless — fall back
      // to the full path in that case.
      const name = filePath.split(/[\\/]/).pop() || filePath;
      return new File([], name);
    });
    await this.userEvent.upload(el as HTMLElement, fileObjects);
  }

  /**
   * Scroll the located element into view.
   *
   * jsdom has no layout engine, so this never produces an observable scroll —
   * geometry stays zeroed and nothing becomes "visible". Worse, jsdom does not
   * implement `Element.prototype.scrollIntoView` as a function in every version,
   * so calling it unguarded would throw a `TypeError`. The `typeof` guard keeps
   * this a safe no-op that resolves; real scrolling behavior is E2E-only.
   *
   * @param locator - Locator used to find the element
   * @throws {ElementNotFoundError} If the element is not found
   */
  async scrollIntoView(locator: PartLocator): Promise<void> {
    const el = await this.getElement(locator);
    if (el == null) {
      throw new ElementNotFoundError(locator, 'scrollIntoView');
    }
    if (typeof (el as HTMLElement).scrollIntoView === 'function') {
      (el as HTMLElement).scrollIntoView();
    }
  }

  /**
   * Scroll the located element by the given pixel delta.
   *
   * jsdom has no layout engine, so the scroll offset never changes — this is a
   * no-op behaviorally. As with {@link scrollIntoView}, jsdom may not implement
   * `Element.prototype.scrollBy` as a function, so the `typeof` guard prevents a
   * `TypeError` and keeps the call a safe no-op that resolves; real scroll
   * behavior is E2E-only.
   *
   * @param locator - Locator used to find the scrollable element
   * @param delta - Pixel offset to scroll by
   * @throws {ElementNotFoundError} If the element is not found
   */
  async scrollBy(locator: PartLocator, delta: Point): Promise<void> {
    const el = await this.getElement(locator);
    if (el == null) {
      throw new ElementNotFoundError(locator, 'scrollBy');
    }
    if (typeof (el as HTMLElement).scrollBy === 'function') {
      (el as HTMLElement).scrollBy(delta.x, delta.y);
    }
  }

  /**
   * Dispatch a single bubbling mouse event at `point` using the shared
   * {@link FakeMouseEvent}. Centralizes the drag gesture's event shape so
   * {@link drag} and {@link dragTo} cannot drift apart.
   */
  private dispatchMouse(el: Element, type: string, point: Point): void {
    fireEvent(el, new FakeMouseEvent(type, { bubbles: true, clientX: point.x, clientY: point.y }));
  }

  /**
   * Drag the source element and drop it onto the target element.
   *
   * The pointer sequence (`mousedown` on source → `mousemove` on target →
   * `mouseup` on target) is synthesized with the shared {@link dispatchMouse} +
   * {@link calculateMousePosition} pattern. jsdom has no layout, so those
   * coordinates are all zeros — the event wiring (and any drop handler the
   * sequence triggers) is exercised, but the positional outcome is E2E-only.
   *
   * Only raw mouse events are fired; native HTML5 drag-and-drop
   * (`dragstart`/`dragover`/`drop` + `dataTransfer`) is NOT synthesized, so
   * components built on the HTML5 DnD API are not driven by this — see #922.
   *
   * @param source - Locator used to find the element to drag
   * @param target - Locator used to find the drop target
   * @throws {ElementNotFoundError} If either element is not found
   */
  async dragTo(source: PartLocator, target: PartLocator): Promise<void> {
    const sourceEl = await this.getElement(source);
    if (sourceEl == null) {
      throw new ElementNotFoundError(source, 'dragTo');
    }
    const targetEl = await this.getElement(target);
    if (targetEl == null) {
      throw new ElementNotFoundError(target, 'dragTo');
    }

    const sourcePoint = this.calculateMousePosition(sourceEl);
    const targetPoint = this.calculateMousePosition(targetEl);

    this.dispatchMouse(sourceEl, 'mousedown', sourcePoint);
    this.dispatchMouse(targetEl, 'mousemove', targetPoint);
    this.dispatchMouse(targetEl, 'mouseup', targetPoint);
  }

  /**
   * Drag the located element by the given pixel delta from its center.
   *
   * The sequence (`mousedown` at center → `mousemove` at center + delta →
   * `mouseup` at center + delta) is synthesized with the shared
   * {@link dispatchMouse} + {@link calculateMousePosition} pattern, using the
   * caller-supplied delta for the move/up coordinates. jsdom has no layout, so the
   * center resolves to zeros and only the event wiring is exercised — the
   * behavioral outcome of the drag is E2E-only.
   *
   * Only raw mouse events are fired; native HTML5 drag-and-drop is NOT
   * synthesized — see #922.
   *
   * @param locator - Locator used to find the element to drag
   * @param delta - Pixel offset to drag by
   * @throws {ElementNotFoundError} If the element is not found
   */
  async drag(locator: PartLocator, delta: Point): Promise<void> {
    const el = await this.getElement(locator);
    if (el == null) {
      throw new ElementNotFoundError(locator, 'drag');
    }

    const start = this.calculateMousePosition(el);
    const end: Point = { x: start.x + delta.x, y: start.y + delta.y };

    this.dispatchMouse(el, 'mousedown', start);
    this.dispatchMouse(el, 'mousemove', end);
    this.dispatchMouse(el, 'mouseup', end);
  }

  //#region wait conditions
  async waitUntilComponentState(
    locator: PartLocator,
    option: Partial<Readonly<WaitForOption>> = defaultWaitForOption
  ): Promise<void> {
    return interactorUtil.interactorWaitUtil(locator, this, option);
  }

  waitUntil<T>(option: WaitUntilOption<T>): Promise<T> {
    return timingUtil.waitUntil(option);
  }
  //#endregion

  async exists(locator: PartLocator): Promise<boolean> {
    const el = await this.getElement(locator);
    return Promise.resolve(el != null);
  }

  async getElement<T extends Element = Element>(locator: PartLocator, isMultiple: true): Promise<readonly T[]>;
  async getElement<T extends Element = Element>(locator: PartLocator, isMultiple: false): Promise<Optional<T>>;
  async getElement<T extends Element = Element>(locator: PartLocator): Promise<Optional<T>>;
  async getElement<T extends Element = Element>(locator: PartLocator, isMultiple = false) {
    const cssLocator = await locatorUtil.toCssSelector(locator, this);
    const queryRoot = this.escapesToDocumentRoot(locator) ? this.rootEl.ownerDocument : this.rootEl;
    if (isMultiple) {
      const elList = queryRoot.querySelectorAll<T>(cssLocator);
      const result: T[] = [];
      elList.forEach(el => result.push(el));
      return result;
    }
    return queryRoot.querySelector<T>(cssLocator) ?? undefined;
  }

  /**
   * A `'Root'`-relative locator (the portal escape — see the portals guide) is
   * documented to search from the document, not from this interactor's root, so
   * portalled content (dialogs, dropdowns rendered at `<body>`) stays reachable
   * even when the interactor is scoped to a sub-tree such as a Storybook canvas.
   * Mirrors `locatorUtil.getEffectiveLocator`'s slicing rule: the last `'Root'`
   * locator wins unless it is `'linked'`, whose CSS still needs the scoped
   * context.
   */
  private escapesToDocumentRoot(locator: PartLocator): boolean {
    const list = locatorUtil.toChain(locator);
    for (let i = list.length - 1; i >= 0; i--) {
      if (list[i].relative === 'Root') {
        return list[i].complexity !== 'linked';
      }
    }
    return false;
  }

  async getInputValue(locator: PartLocator): Promise<Optional<string>> {
    const el = await this.getElement(locator);
    if (el != null) {
      if (el.nodeName === 'INPUT') {
        return Promise.resolve((el as HTMLInputElement).value ?? undefined);
      } else if (el.nodeName === 'TEXTAREA') {
        return Promise.resolve((el as HTMLTextAreaElement).value ?? undefined);
      }
    }
    return undefined;
  }

  async getSelectValues(locator: PartLocator): Promise<Optional<readonly string[]>> {
    const el = await this.getElement(locator);
    if (el != null && el.nodeName === 'SELECT') {
      const options = el.querySelectorAll<HTMLOptionElement>('option:checked');
      const values = Array.from(options).map(o => o.value);
      return Promise.resolve(values);
    }
    return Promise.resolve(undefined);
  }

  async getSelectLabels(locator: PartLocator): Promise<Optional<readonly string[]>> {
    const el = await this.getElement(locator);
    if (el != null && el.nodeName === 'SELECT') {
      const options = el.querySelectorAll<HTMLOptionElement>('option:checked');
      const values = Array.from(options).map(o => o.text);
      return Promise.resolve(values);
    }
    return Promise.resolve(undefined);
  }

  async getText(locator: PartLocator): Promise<Optional<string>> {
    const el = await this.getElement(locator);
    if (el != null) {
      return Promise.resolve(el.textContent ?? undefined);
    }
    return undefined;
  }

  /**
   * Get the located element's bounding rectangle.
   *
   * jsdom has no layout engine, so `getBoundingClientRect` returns all zeros: the
   * rect is structurally valid but behaviorally meaningless. Real geometry is
   * E2E-only.
   *
   * @param locator - Locator used to find the element to measure
   * @returns The element's bounding rectangle (a zero-rect under jsdom)
   * @throws {ElementNotFoundError} If the element is not found
   */
  async getBoundingRect(locator: PartLocator): Promise<BoundingRect> {
    const el = await this.getElement(locator);
    if (el == null) {
      throw new ElementNotFoundError(locator, 'getBoundingRect');
    }
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  }

  async isChecked(locator: PartLocator): Promise<boolean> {
    const el = await this.getElement<HTMLInputElement>(locator);
    if (el != null && el.nodeName === 'INPUT') {
      return Promise.resolve(el.checked);
    }
    return Promise.resolve(false);
  }

  async isDisabled(locator: PartLocator): Promise<boolean> {
    const el = await this.getElement(locator);
    if (el != null) {
      if ('disabled' in el) {
        const isDisabled = Boolean(el.disabled);
        return Promise.resolve(isDisabled);
      }
    }
    return Promise.resolve(false);
  }

  async isReadonly(locator: PartLocator): Promise<boolean> {
    return this.hasAttribute(locator, 'readonly');
  }

  async isRequired(locator: PartLocator): Promise<boolean> {
    const el = await this.getElement(locator);
    if (el != null) {
      if ('required' in el && Boolean((el as { required?: boolean }).required)) {
        return true;
      }
      return el.getAttribute('aria-required') === 'true';
    }
    return false;
  }

  async isError(locator: PartLocator): Promise<boolean> {
    const el = await this.getElement(locator);
    return el != null && el.getAttribute('aria-invalid') === 'true';
  }

  async isVisible(locator: PartLocator): Promise<boolean> {
    const exists = await this.exists(locator);
    if (!exists) {
      return false;
    }

    const opacity = await this.getStyleValue(locator, 'opacity');
    if (opacity === '0') {
      return false;
    }

    const visibility = await this.getStyleValue(locator, 'visibility');
    if (visibility === 'hidden') {
      return false;
    }

    const display = await this.getStyleValue(locator, 'display');
    if (display === 'none') {
      return false;
    }

    return true;
  }

  async hasCssClass(locator: PartLocator, className: string): Promise<boolean> {
    const el = await this.getElement(locator);
    if (el != null) {
      return Promise.resolve(el.classList.contains(className));
    }
    return Promise.resolve(false);
  }

  async hasAttribute(locator: PartLocator, name: string): Promise<boolean> {
    const el = await this.getElement(locator);
    if (el != null) {
      return Promise.resolve(el.hasAttribute(name));
    }
    return Promise.resolve(false);
  }

  //#region
  async innerHTML(locator: PartLocator): Promise<string> {
    const el = await this.getElement(locator);
    return el?.innerHTML ?? '';
  }
  //#endregion
}
