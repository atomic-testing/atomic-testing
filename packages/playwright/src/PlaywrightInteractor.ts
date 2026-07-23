import {
  assertValidClickCount,
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
  MouseEnterOption,
  MouseLeaveOption,
  MouseOutOption,
  MouseDownOption,
  MouseMoveOption,
  MouseUpOption,
  Optional,
  PartLocator,
  Point,
  PressKeyOption,
  timingUtil,
  visibilityUtil,
  WaitForOption,
  WaitUntilOption,
} from '@atomic-testing/core';
import { Locator, Page } from '@playwright/test';

/**
 * Implementation of the {@link Interactor} interface using Playwright.
 */
export class PlaywrightInteractor implements Interactor {
  /**
   * @param page - Playwright page instance used to drive the browser.
   */
  constructor(public readonly page: Page) {}

  /**
   * Run a Playwright mutation and normalize a "locator matched nothing" failure
   * into {@link ElementNotFoundError}, so a missing element throws the same error
   * class here as it does in `DOMInteractor`, regardless of environment (the
   * unified contract ratified in ADR-006).
   *
   * Playwright auto-waits for actionability and then throws its own
   * `TimeoutError`. We translate that to `ElementNotFoundError` ONLY when the
   * element genuinely does not exist (count 0) and otherwise rethrow the original
   * error — preserving Playwright's auto-wait for an element that exists but is
   * briefly not actionable (covered, disabled, animating). The trade-off is that
   * a truly-missing element waits out the page's action timeout before throwing;
   * bound it with `page.setDefaultTimeout` when fast failure matters.
   *
   * @param locator - Locator the mutation targets
   * @param action - Method name used in the error message (e.g. `'click'`)
   * @param run - The Playwright action to execute
   * @throws {ElementNotFoundError} If the action fails and the element is absent
   */
  private async runMutation<T>(locator: PartLocator, action: string, run: () => Promise<T>): Promise<T> {
    try {
      return await run();
    } catch (e) {
      if ((await this.exists(locator)) === false) {
        throw new ElementNotFoundError(locator, action);
      }
      throw e;
    }
  }

  /**
   * Resolve a {@link PartLocator} to the Playwright {@link Locator} every
   * primitive in this class targets — the one locator-resolution seam in
   * `PlaywrightInteractor`, mirroring `DOMInteractor.getElement`'s single seam.
   *
   * An {@link AccessibleRoleLocator} segment (`findByRole`, #923) has no CSS
   * representation — a computed accessible name is not CSS-expressible (see
   * [ADR-008](https://github.com/atomic-testing/atomic-testing/blob/main/agent-docs/adr/008-css-dom-only-locator-boundary.md))
   * — so `locatorUtil.splitAtAccessibleRoleLocator` detects it BEFORE this
   * reaches `toCssSelector`, and resolution routes to Playwright's own
   * accname-aware `getByRole` instead. Everything else takes the ordinary
   * `toCssSelector` → `page.locator(css)` path unchanged.
   *
   * `before` — the chain segments ahead of the accessible-role match — resolves
   * recursively (through this same method, so a `LinkedCssLocator` or another
   * `'Root'` escape ahead of it still works) to a scope `Locator`, `.first()`ed
   * so a multi-match `before` scopes the accname search to only its first
   * match — matching `DOMInteractor`'s `getElement`, which resolves `before`
   * through its own singular (first-match) overload. Without this, the two
   * engines could disagree on which subtree the search runs in.
   *
   * `name` matching is forced to `exact: true` (case-sensitive, whole-string)
   * whenever a name is given, to match `@testing-library/dom`'s `getByRole` —
   * which has no fuzzy-match mode for a string name — so both engines resolve
   * identically (see {@link AccessibleRoleLocator}). `includeHidden: true`
   * matches this codebase's other locators, which resolve structurally
   * regardless of visibility (`isVisible` is the dedicated visibility check,
   * not baked into resolution) — the same reasoning `DOMInteractor` documents
   * for its `hidden: true`.
   */
  private async resolveLocator(locator: PartLocator): Promise<Locator> {
    const split = locatorUtil.splitAtAccessibleRoleLocator(locator);
    if (split == null) {
      const cssLocator = await locatorUtil.toCssSelector(locator, this);
      return this.page.locator(cssLocator);
    }

    const scopeLocator = split.roleLocator.relative === 'Root' ? [] : split.before;
    const scope = scopeLocator.length === 0 ? this.page : (await this.resolveLocator(scopeLocator)).first();
    const options: { name?: string; exact?: boolean; includeHidden: boolean } = { includeHidden: true };
    if (split.roleLocator.name != null) {
      options.name = split.roleLocator.name;
      options.exact = true;
    }
    return scope.getByRole(split.roleLocator.role as Parameters<Page['getByRole']>[0], options);
  }

  /**
   * Resolve a locator for the READ path, returning the first matching element or
   * `undefined` when nothing matches.
   *
   * This is the read counterpart to {@link runMutation}, aligning reads with
   * `DOMInteractor` (jsdom is the contract — see ADR-006, #1047):
   *
   * - **Missing element:** a `count()` check answers instantly with `undefined`
   *   instead of Playwright auto-waiting out the action timeout and throwing
   *   `TimeoutError`. Callers translate `undefined` into the same
   *   `undefined`/`false` a `querySelector` miss yields in the DOM.
   * - **Multiple matches:** `.first()` mirrors `querySelector`'s first-match
   *   semantics, avoiding Playwright's strict-mode violation.
   *
   * @param locator - Locator to resolve
   * @returns The first matching {@link Locator}, or `undefined` if none match
   */
  private async firstMatch(locator: PartLocator): Promise<Optional<Locator>> {
    const elLocator = await this.resolveLocator(locator);
    if ((await elLocator.count()) === 0) {
      return undefined;
    }
    return elLocator.first();
  }

  /**
   * Select the given option values on a `<select>` element.
   *
   * @param locator - Locator to the `<select>` element.
   * @param values - Values to select.
   * @throws {ElementNotFoundError} If the element is not found
   */
  async selectOptionValue(locator: PartLocator, values: string[]): Promise<void> {
    const target = await this.resolveLocator(locator);
    await this.runMutation(locator, 'selectOptionValue', () => target.selectOption(values));
  }

  /**
   * Set the selected files on a `<input type="file">` element.
   *
   * Playwright's native `setInputFiles` reads the given paths from disk and
   * populates the input's `FileList`, firing the change event — the only way to
   * fill a file input, whose value cannot be set programmatically.
   *
   * @param locator - Locator of the `<input type="file">` element
   * @param files - One or more filesystem paths to upload
   * @throws {ElementNotFoundError} If the element is not found
   */
  async setInputFiles(locator: PartLocator, files: string | string[]): Promise<void> {
    const target = await this.resolveLocator(locator);
    await this.runMutation(locator, 'setInputFiles', () => target.setInputFiles(files));
  }

  /**
   * Scroll the located element into view, no-op if already visible.
   *
   * Delegates to Playwright's `scrollIntoViewIfNeeded`, which performs a real
   * layout-aware scroll in the browser.
   *
   * @param locator - Locator of the element to scroll into view
   * @throws {ElementNotFoundError} If the element is not found
   */
  async scrollIntoView(locator: PartLocator): Promise<void> {
    const target = await this.resolveLocator(locator);
    await this.runMutation(locator, 'scrollIntoView', () => target.scrollIntoViewIfNeeded());
  }

  /**
   * Scroll the located element by the given pixel delta.
   *
   * The scroll is performed by evaluating `el.scrollBy(dx, dy)` on the element
   * itself rather than `page.mouse.wheel`. A wheel event scrolls whatever sits
   * under the pointer and is non-deterministic across chromium/firefox/webkit,
   * whereas evaluating `scrollBy` on the resolved element scrolls exactly that
   * element. This is a deliberate deviation from ADR 0001's per-engine table
   * (which lists `page.mouse.wheel`), taking the alternative the step-5 prompt
   * permits ("or evaluate el.scrollBy") for cross-browser determinism.
   *
   * @param locator - Locator of the scrollable element
   * @param delta - Pixel offset to scroll by
   * @throws {ElementNotFoundError} If the element is not found
   */
  async scrollBy(locator: PartLocator, delta: Point): Promise<void> {
    const target = await this.resolveLocator(locator);
    await this.runMutation(locator, 'scrollBy', () =>
      target.evaluate((el, d) => el.scrollBy(d.x, d.y), { x: delta.x, y: delta.y })
    );
  }

  /**
   * Drag the source element and drop it onto the target element.
   *
   * Delegates to Playwright's native `Locator.dragTo`, which performs a real,
   * layout-aware drag gesture in the browser — genuine, low-level pointer
   * input the browser's own engine processes, unlike jsdom's synthesized
   * events (see {@link DOMInteractor.dragTo}). This drives pointer-based DnD
   * libraries (dnd-kit, react-beautiful-dnd) AND native HTML5 drag-and-drop
   * (`draggable` + `ondragstart`/`ondragover`/`ondrop`): verified empirically
   * (#922) that on a `draggable` source/target pair, `Locator.dragTo` alone
   * makes the browser recognize and run its own native DnD gesture —
   * `dragstart` → `dragenter`/`dragover` → `drop` → `dragend` fire with a
   * real, populated `DataTransfer`, no extra dispatch needed. (This
   * contradicts an earlier assumption that Playwright's pointer gesture does
   * NOT drive native HTML5 DnD — re-verify if this ever regresses, since nothing
   * pins it beyond the E2E suite below.)
   *
   * @param source - Locator of the element to drag
   * @param target - Locator of the drop target
   * @throws {ElementNotFoundError} If either the source or target is not found
   */
  async dragTo(source: PartLocator, target: PartLocator): Promise<void> {
    const sourceLocator = await this.resolveLocator(source);
    const targetLocator = await this.resolveLocator(target);
    try {
      await sourceLocator.dragTo(targetLocator);
    } catch (e) {
      if ((await this.exists(source)) === false) {
        throw new ElementNotFoundError(source, 'dragTo');
      }
      if ((await this.exists(target)) === false) {
        throw new ElementNotFoundError(target, 'dragTo');
      }
      throw e;
    }
  }

  /**
   * Drag the located element by the given pixel delta from its center.
   *
   * The gesture is a single uninterrupted `move → down → move → up` sequence
   * computed from the element's center. It deliberately does NOT reuse
   * {@link mouseMove}/{@link mouseDown} — those are discrete hover-then-act
   * helpers that cannot compose one continuous pointer path (see ADR 0001,
   * option 5). The center comes from {@link getBoundingRect},
   * which throws `ElementNotFoundError` when the element has no box, so this
   * shares that "element not found" contract instead of re-deriving the box +
   * guard here.
   *
   * As with {@link dragTo}, this real pointer gesture drives native HTML5
   * drag-and-drop too when the element is `draggable` — verified (#922) that
   * the browser's own gesture recognition fires the full `dragstart` →
   * `dragover` → `drop` (onto itself; there is no separate target for a
   * delta drag) → `dragend` sequence with a real `DataTransfer`, with no
   * additional dispatch required.
   *
   * @param locator - Locator of the element to drag
   * @param delta - Pixel offset to drag by
   * @throws {ElementNotFoundError} If the element has no bounding box
   */
  async drag(locator: PartLocator, delta: Point): Promise<void> {
    const rect = await this.getBoundingRect(locator);
    const cx = rect.x + rect.width / 2;
    const cy = rect.y + rect.height / 2;
    await this.page.mouse.move(cx, cy);
    await this.page.mouse.down();
    await this.page.mouse.move(cx + delta.x, cy + delta.y, { steps: 8 });
    await this.page.mouse.up();
  }

  /**
   * Get the value of an `<input>` or `<textarea>` element.
   *
   * Mirrors `DOMInteractor`: a missing element, or one that is neither `<input>`
   * nor `<textarea>`, yields `undefined` rather than Playwright's auto-wait
   * timeout or its `Node is not an <input>` throw (#1047).
   *
   * @param locator - Locator pointing to the input element.
   * @returns The current value of the input, or `undefined` if not applicable.
   */
  async getInputValue(locator: PartLocator): Promise<Optional<string>> {
    const el = await this.firstMatch(locator);
    if (el == null) {
      return undefined;
    }
    const nodeName = await el.evaluate(node => node.nodeName);
    if (nodeName !== 'INPUT' && nodeName !== 'TEXTAREA') {
      return undefined;
    }
    return el.inputValue();
  }

  /**
   * Retrieve the values of selected options within a `<select>` element.
   *
   * @param locator - Locator to the `<select>` element.
   * @returns Array of selected option values or `undefined` when no option is selected.
   */
  async getSelectValues(locator: PartLocator): Promise<Optional<readonly string[]>> {
    const el = await this.firstMatch(locator);
    if (el == null) {
      return undefined;
    }
    const nodeName = await el.evaluate(node => node.nodeName);
    if (nodeName !== 'SELECT') {
      // Mirror DOMInteractor: a missing or non-`<select>` element yields
      // `undefined`, not `[]` — otherwise callers read an absent select as
      // "present but with no selection" (#1047).
      return undefined;
    }
    // Read the `value` IDL property, not the `value` attribute: per the HTML
    // spec the property falls back to the option's text when no value attribute
    // is present, matching DOMInteractor's `option.value`. Reading the attribute
    // silently dropped value-less selected options (#1047).
    return el.evaluate(node =>
      Array.from(node.querySelectorAll<HTMLOptionElement>('option:checked')).map(option => option.value)
    );
  }

  async getSelectLabels(locator: PartLocator): Promise<Optional<readonly string[]>> {
    const el = await this.firstMatch(locator);
    if (el == null) {
      return undefined;
    }
    const nodeName = await el.evaluate(node => node.nodeName);
    if (nodeName !== 'SELECT') {
      return undefined;
    }
    // Read the `text` IDL property, matching DOMInteractor's `option.text`
    // (whitespace-collapsed, spec-defined) rather than raw `textContent` (#1047).
    return el.evaluate(node =>
      Array.from(node.querySelectorAll<HTMLOptionElement>('option:checked')).map(option => option.text)
    );
  }

  async getStyleValue(locator: PartLocator, propertyName: CssProperty): Promise<Optional<string>> {
    const elLocator = await this.firstMatch(locator);
    if (elLocator == null) {
      return undefined;
    }
    const value = await elLocator.evaluate((element, prop) => {
      // Indexed access, not getPropertyValue: CssProperty is the camelCase
      // keyof CSSStyleDeclaration (e.g. 'pointerEvents'), which
      // getPropertyValue — a kebab-case API — would answer with ''.
      return window.getComputedStyle(element)[prop as keyof CSSStyleDeclaration] as string;
    }, propertyName);
    return value;
  }

  async enterText(locator: PartLocator, text: string, option?: Optional<Partial<EnterTextOption>>): Promise<void> {
    const target = await this.resolveLocator(locator);
    await this.runMutation(locator, 'enterText', async () => {
      if (!option?.append) {
        await target.clear();
      }

      // Enforce the shared date/time/datetime-local format policy (#1053). The
      // helper treats an empty value as a valid clear, so — unlike the previous
      // inline block — clearing a date input via `fill('')` no longer throws,
      // matching DOMInteractor.
      const type = (await this.getAttribute(locator, 'type')) ?? '';
      dateUtil.assertValidHtmlDateInputValue(type, text);
      await target.fill(text);
    });
  }

  /**
   * Type text into the element as real per-character keystrokes.
   *
   * `pressSequentially` focuses the element and dispatches a trusted
   * keydown/keypress/input/keyup sequence per character — the keystroke path
   * that `enterText`'s `fill()` (a direct value replacement) never exercises,
   * and the only one keystroke-driven editors such as the MUI X picker section
   * field respond to. No pointer event and no clearing, mirroring the DOM
   * implementation's focus + keyboard dispatch. Playwright types the text
   * literally, so no escaping is needed here.
   *
   * @param locator - Locator used to find the target element
   * @param text - The literal text to type, one keystroke per character
   * @throws {ElementNotFoundError} If the element is not found
   */
  async typeText(locator: PartLocator, text: string): Promise<void> {
    const target = await this.resolveLocator(locator);
    await this.runMutation(locator, 'typeText', () => target.pressSequentially(text));
  }

  async setRangeValue(locator: PartLocator, value: number): Promise<void> {
    const target = await this.resolveLocator(locator);
    // Playwright's `fill` rejects `<input type="range">` (it is not a fillable
    // text control), so set the value in-page through the native value setter.
    // Calling the prototype setter both sanitizes the value to the input's step
    // (the browser snaps an off-step target to the nearest valid step) and lets
    // React's value tracker observe the change; the dispatched input/change
    // events then drive a controlled component (e.g. MUI Slider) to re-render.
    await this.runMutation(locator, 'setRangeValue', () =>
      target.evaluate((el, nextValue) => {
        const input = el as HTMLInputElement;
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
        setter?.call(input, nextValue);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }, String(value))
    );
  }

  async click(locator: PartLocator, option?: Partial<ClickOption>): Promise<void> {
    assertValidClickCount(option?.clickCount);
    const target = await this.resolveLocator(locator);
    await this.runMutation(locator, 'click', () =>
      target.click({ position: option?.position, clickCount: option?.clickCount })
    );
  }

  /**
   * Dispatch a right-click on the located element to open its context menu.
   *
   * Delegates to Playwright's native right-button click, which fires a real
   * `contextmenu` event in the browser.
   *
   * @param locator - Locator of the element to right-click
   * @throws {ElementNotFoundError} If the element is not found
   */
  async contextMenu(locator: PartLocator): Promise<void> {
    const target = await this.resolveLocator(locator);
    await this.runMutation(locator, 'contextMenu', () => target.click({ button: 'right' }));
  }

  async hover(locator: PartLocator, option?: Partial<HoverOption>): Promise<void> {
    const target = await this.resolveLocator(locator);
    await this.runMutation(locator, 'hover', () => target.hover({ position: option?.position }));
  }

  async mouseMove(locator: PartLocator, option?: Partial<MouseMoveOption>): Promise<void> {
    // Leave the pointer over the target (hovered) instead of relocating it to the
    // viewport origin, so hover-dependent state the caller just established survives.
    // Mirrors DOMInteractor.mouseMove, which dispatches a mousemove at the element
    // and never moves a persistent pointer (#1057).
    await this.runMutation(locator, 'mouseMove', () => this.hover(locator, { position: option?.position }));
  }

  async mouseDown(locator: PartLocator, option?: Partial<MouseDownOption>): Promise<void> {
    await this.runMutation(locator, 'mouseDown', async () => {
      await this.hover(locator, { position: option?.position });
      await this.page.mouse.down();
    });
  }

  async mouseUp(locator: PartLocator, option?: Partial<MouseUpOption>): Promise<void> {
    await this.runMutation(locator, 'mouseUp', async () => {
      await this.hover(locator, { position: option?.position });
      await this.page.mouse.up();
    });
  }

  async mouseOver(locator: PartLocator, option?: Partial<HoverOption>): Promise<void> {
    await this.runMutation(locator, 'mouseOver', () => this.hover(locator, option));
  }

  async mouseOut(locator: PartLocator, _option?: Partial<MouseOutOption>): Promise<void> {
    const target = await this.resolveLocator(locator);
    await this.runMutation(locator, 'mouseOut', async () => {
      // First hover over the element to trigger mouseenter/mouseover
      await target.hover();
      // Then dispatch mouseout event directly for cross-browser reliability
      await target.dispatchEvent('mouseout');
    });
  }

  async mouseEnter(locator: PartLocator, _option?: Partial<MouseEnterOption>): Promise<void> {
    await this.runMutation(locator, 'mouseEnter', () => this.hover(locator));
  }

  async mouseLeave(locator: PartLocator, _option?: Partial<MouseLeaveOption>): Promise<void> {
    const target = await this.resolveLocator(locator);
    await this.runMutation(locator, 'mouseLeave', async () => {
      // First hover over the element to trigger mouseenter/mouseover
      await target.hover();
      // Dispatch mouseout which triggers both mouseout and mouseleave handlers in React
      await target.dispatchEvent('mouseout');
    });
  }

  async focus(locator: PartLocator, _option?: Partial<FocusOption>): Promise<void> {
    const target = await this.resolveLocator(locator);
    await this.runMutation(locator, 'focus', () => target.focus());
  }

  async blur(locator: PartLocator, _option?: Partial<BlurOption>): Promise<void> {
    const target = await this.resolveLocator(locator);
    await this.runMutation(locator, 'blur', () => target.blur());
  }

  async pressKey(locator: PartLocator, key: string, option?: Partial<PressKeyOption>): Promise<void> {
    const target = await this.resolveLocator(locator);
    // Compose Playwright's chord syntax — modifiers joined to the key by `+`, in
    // Playwright's accepted Control+Alt+Shift+Meta order — so the browser holds
    // those modifiers across the keypress and the event carries ctrlKey/etc.
    const modifiers: string[] = [];
    if (option?.ctrl) {
      modifiers.push('Control');
    }
    if (option?.alt) {
      modifiers.push('Alt');
    }
    if (option?.shift) {
      modifiers.push('Shift');
    }
    if (option?.meta) {
      modifiers.push('Meta');
    }
    const chord = modifiers.length > 0 ? `${modifiers.join('+')}+${key}` : key;
    // locator.press auto-focuses the element, then dispatches a real, trusted
    // KeyboardEvent — the browser equivalent of the DOM focus-first keyDown/keyUp.
    // For Shift + a printable key, Playwright does NOT case-fold `event.key`
    // (`Shift+a` → `key: 'a'`, not `'A'`) — verified against this repo's pinned
    // playwright-core; it matches the jsdom path's `key: 'a', shiftKey: true`
    // exactly, so the two engines agree here (see #924).
    await this.runMutation(locator, 'pressKey', () => target.press(chord));
  }

  async activate(locator: PartLocator): Promise<void> {
    const target = await this.resolveLocator(locator);
    // Geometry-free activation mirrors the mouseout dispatch precedent above: it
    // bypasses hit-testing to actuate a covered or zero-size input that
    // locator.click() (a real geometry hit-test) cannot reach.
    await this.runMutation(locator, 'activate', () => target.dispatchEvent('click'));
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

  async getAttribute(locator: PartLocator, name: string, isMultiple: true): Promise<readonly string[]>;
  async getAttribute(locator: PartLocator, name: string, isMultiple: false): Promise<Optional<string>>;
  async getAttribute(locator: PartLocator, name: string): Promise<Optional<string>>;
  async getAttribute(
    locator: PartLocator,
    name: string,
    isMultiple?: boolean
  ): Promise<Optional<string> | readonly string[]> {
    if (isMultiple) {
      const target = await this.resolveLocator(locator);
      const locators = await target.all();
      const values: string[] = [];
      for (const matched of locators) {
        const value = await matched.getAttribute(name);
        if (value != null) {
          values.push(value);
        }
      }
      return values;
    }
    // Single-element read: mirror DOMInteractor — a missing element yields
    // `undefined` (no auto-wait) and multiple matches resolve to the first (#1047).
    const el = await this.firstMatch(locator);
    if (el == null) {
      return undefined;
    }
    const value = await el.getAttribute(name);
    return value ?? undefined;
  }

  async getText(locator: PartLocator): Promise<Optional<string>> {
    const el = await this.firstMatch(locator);
    if (el == null) {
      return undefined;
    }
    const text = await el.textContent();
    return text ?? undefined;
  }

  /**
   * Get the located element's bounding rectangle.
   *
   * `boundingBox()` returns `null` for a detached/invisible element rather than
   * auto-waiting, so this throws `ElementNotFoundError` directly (no auto-wait)
   * — matching the unified "element not found" contract (ADR-006).
   *
   * @param locator - Locator of the element to measure
   * @returns The element's bounding rectangle in CSS pixels
   * @throws {ElementNotFoundError} If the element has no bounding box
   */
  async getBoundingRect(locator: PartLocator): Promise<BoundingRect> {
    const target = await this.resolveLocator(locator);
    const box = await target.boundingBox();
    if (box == null) {
      throw new ElementNotFoundError(locator, 'getBoundingRect');
    }
    return { x: box.x, y: box.y, width: box.width, height: box.height };
  }

  async exists(locator: PartLocator): Promise<boolean> {
    const target = await this.resolveLocator(locator);
    const count = await target.count();
    return count > 0;
  }

  /**
   * Count every element matching the locator via Playwright's native
   * `Locator.count()` — one round-trip, in contrast to the index-by-index
   * `exists()` probing this primitive replaces in the list helpers.
   */
  async getElementCount(locator: PartLocator): Promise<number> {
    const target = await this.resolveLocator(locator);
    return target.count();
  }

  async isChecked(locator: PartLocator): Promise<boolean> {
    const el = await this.firstMatch(locator);
    if (el == null) {
      return false;
    }
    return el.isChecked();
  }

  async isDisabled(locator: PartLocator): Promise<boolean> {
    const el = await this.firstMatch(locator);
    if (el == null) {
      return false;
    }
    return el.isDisabled();
  }

  async isReadonly(locator: PartLocator): Promise<boolean> {
    // Honor `aria-readonly` for symmetry with `isRequired`'s `aria-required`
    // check (#1053): the native `readonly` attribute only exists on native form
    // controls, whereas composite/custom widgets expose read-only state through
    // ARIA. Mirrors DOMInteractor.isReadonly so both environments agree.
    const readonly = await this.getAttribute(locator, 'readonly');
    if (readonly != null) {
      return true;
    }
    return (await this.getAttribute(locator, 'aria-readonly')) === 'true';
  }

  async isRequired(locator: PartLocator): Promise<boolean> {
    const required = await this.getAttribute(locator, 'required');
    if (required != null) {
      return true;
    }
    return (await this.getAttribute(locator, 'aria-required')) === 'true';
  }

  async isError(locator: PartLocator): Promise<boolean> {
    return (await this.getAttribute(locator, 'aria-invalid')) === 'true';
  }

  async isVisible(locator: PartLocator): Promise<boolean> {
    const el = await this.firstMatch(locator);
    if (el == null) {
      return false;
    }
    try {
      // ONE in-browser evaluate that walks the ancestor chain (#1053): collapses
      // the former three `getStyleValue` round-trips into a single call and
      // closes the ancestor-visibility hole (a child of a `display: none` /
      // `opacity: 0` ancestor was wrongly reported visible). `isElementVisibleByStyle`
      // is a self-contained pure function referencing only DOM globals, so
      // Playwright can serialize it into the page; its default `getStyle`
      // resolves the browser's `getComputedStyle` there.
      //
      // The cast bridges a type-only gap: Playwright types a no-arg page function
      // as single-parameter, but the predicate declares a second `getStyle`
      // parameter (defaulted). At runtime Playwright invokes it with just the
      // element, so the default supplies the browser accessor — call-compatible.
      const isVisibleInPage = visibilityUtil.isElementVisibleByStyle as (el: SVGElement | HTMLElement) => boolean;
      return await el.evaluate(isVisibleInPage);
    } catch (e) {
      // The element may detach mid-check (e.g. an exit animation), which makes
      // `evaluate` throw. If it is genuinely gone it is not visible; otherwise the
      // failure is real — rethrow. Preserves the pre-#1053 detached/animation guard.
      if ((await this.exists(locator)) === false) {
        return false;
      }
      throw e;
    }
  }

  async hasCssClass(locator: PartLocator, className: string): Promise<boolean> {
    const classNames = await this.getAttribute(locator, 'class');
    if (classNames == null) {
      return false;
    }

    const names = classNames.split(/\s+/);
    return names.includes(className);
  }

  async hasAttribute(locator: PartLocator, name: string): Promise<boolean> {
    const attrValue = await this.getAttribute(locator, name);
    return attrValue != null;
  }

  //#region
  async innerHTML(locator: PartLocator): Promise<string> {
    const target = await this.resolveLocator(locator);
    return target.innerHTML();
  }
  //#endregion
}
