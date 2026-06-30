import {
  BlurOption,
  BoundingRect,
  byCssSelector,
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
  WaitForOption,
  WaitUntilOption,
} from '@atomic-testing/core';
import { Page } from '@playwright/test';

/**
 * Implementation of the {@link Interactor} interface using Playwright.
 */
export class PlaywrightInteractor implements Interactor {
  /**
   * @param page - Playwright page instance used to drive the browser.
   */
  constructor(public readonly page: Page) {}

  /**
   * Select the given option values on a `<select>` element.
   *
   * @param locator - Locator to the `<select>` element.
   * @param values - Values to select.
   */
  async selectOptionValue(locator: PartLocator, values: string[]): Promise<void> {
    const cssLocator = await locatorUtil.toCssSelector(locator, this);
    await this.page.locator(cssLocator).selectOption(values);
  }

  /**
   * Set the selected files on a `<input type="file">` element.
   *
   * Playwright's native `setInputFiles` reads the given paths from disk and
   * populates the input's `FileList`, firing the change event — the only way to
   * fill a file input, whose value cannot be set programmatically. Following
   * this layer's convention, no `ElementNotFoundError` is fabricated: a missing
   * element surfaces through Playwright's own auto-wait timeout.
   *
   * @param locator - Locator of the `<input type="file">` element
   * @param files - One or more filesystem paths to upload
   */
  async setInputFiles(locator: PartLocator, files: string | string[]): Promise<void> {
    const cssLocator = await locatorUtil.toCssSelector(locator, this);
    await this.page.locator(cssLocator).setInputFiles(files);
  }

  /**
   * Scroll the located element into view, no-op if already visible.
   *
   * Delegates to Playwright's `scrollIntoViewIfNeeded`, which performs a real
   * layout-aware scroll in the browser. Per this layer's convention, no
   * `ElementNotFoundError` is fabricated: a missing element surfaces through
   * Playwright's own auto-wait timeout.
   *
   * @param locator - Locator of the element to scroll into view
   */
  async scrollIntoView(locator: PartLocator): Promise<void> {
    const css = await locatorUtil.toCssSelector(locator, this);
    await this.page.locator(css).scrollIntoViewIfNeeded();
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
   * permits ("or evaluate el.scrollBy") for cross-browser determinism. As with
   * {@link scrollIntoView}, no `ElementNotFoundError` is fabricated; a missing
   * element surfaces through Playwright's own auto-wait timeout.
   *
   * @param locator - Locator of the scrollable element
   * @param delta - Pixel offset to scroll by
   */
  async scrollBy(locator: PartLocator, delta: Point): Promise<void> {
    const css = await locatorUtil.toCssSelector(locator, this);
    await this.page.locator(css).evaluate((el, d) => el.scrollBy(d.x, d.y), { x: delta.x, y: delta.y });
  }

  /**
   * Drag the source element and drop it onto the target element.
   *
   * Delegates to Playwright's native `Locator.dragTo`, which performs a real,
   * layout-aware drag gesture in the browser. Per this layer's convention, no
   * `ElementNotFoundError` is fabricated: a missing element surfaces through
   * Playwright's own auto-wait timeout.
   *
   * @param source - Locator of the element to drag
   * @param target - Locator of the drop target
   */
  async dragTo(source: PartLocator, target: PartLocator): Promise<void> {
    const srcCss = await locatorUtil.toCssSelector(source, this);
    const tgtCss = await locatorUtil.toCssSelector(target, this);
    await this.page.locator(srcCss).dragTo(this.page.locator(tgtCss));
  }

  /**
   * Drag the located element by the given pixel delta from its center.
   *
   * The gesture is a single uninterrupted `move → down → move → up` sequence
   * computed from the element's center. It deliberately does NOT reuse
   * {@link mouseMove}/{@link mouseDown} — `mouseMove` resets the pointer with
   * `page.mouse.move(0, 0)` after hovering, which would corrupt the drag path
   * (see ADR 0001, option 5). The center comes from {@link getBoundingRect},
   * which throws `ElementNotFoundError` when the element has no box
   * (detached/invisible) rather than auto-waiting — so this shares that
   * "element not found" contract instead of re-deriving the box + guard here.
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
   * Get the value of an `<input>` element.
   *
   * @param locator - Locator pointing to the input element.
   * @returns The current value of the input or `undefined` if not present.
   */
  async getInputValue(locator: PartLocator): Promise<Optional<string>> {
    const cssLocator = await locatorUtil.toCssSelector(locator, this);
    return this.page.locator(cssLocator).inputValue();
  }

  /**
   * Retrieve the values of selected options within a `<select>` element.
   *
   * @param locator - Locator to the `<select>` element.
   * @returns Array of selected option values or `undefined` when no option is selected.
   */
  async getSelectValues(locator: PartLocator): Promise<Optional<readonly string[]>> {
    const optionLocator: PartLocator = byCssSelector('option:checked');
    const selectedOptionLocator = locatorUtil.append(locator, optionLocator);
    const cssLocator = await locatorUtil.toCssSelector(selectedOptionLocator, this);
    const allOptions = await this.page.locator(cssLocator).all();
    const values: string[] = [];
    for (const option of allOptions) {
      const value = await option.getAttribute('value');
      if (value != null) {
        values.push(value);
      }
    }
    return values;
  }

  async getSelectLabels(locator: PartLocator): Promise<Optional<readonly string[]>> {
    const optionLocator: PartLocator = byCssSelector('option:checked');
    const selectedOptionLocator = locatorUtil.append(locator, optionLocator);
    const cssLocator = await locatorUtil.toCssSelector(selectedOptionLocator, this);
    const allOptions = await this.page.locator(cssLocator).all();
    const labels: string[] = [];
    for (const option of allOptions) {
      const label = await option.textContent();
      if (label != null) {
        labels.push(label);
      }
    }
    return labels;
  }

  async getStyleValue(locator: PartLocator, propertyName: CssProperty): Promise<Optional<string>> {
    const cssLocator = await locatorUtil.toCssSelector(locator, this);
    const elLocator = this.page.locator(cssLocator);
    const value = await elLocator.evaluate((element, prop) => {
      return window.getComputedStyle(element).getPropertyValue(prop as string);
    }, propertyName);
    return value;
  }

  async enterText(locator: PartLocator, text: string, option?: Optional<Partial<EnterTextOption>>): Promise<void> {
    const cssLocator = await locatorUtil.toCssSelector(locator, this);
    if (!option?.append) {
      await this.page.locator(cssLocator).clear();
    }

    // If it is a date, time or datetime-local input, validate the date format
    const type = (await this.getAttribute(locator, 'type')) ?? '';
    if (dateUtil.isHtmlDateInputType(type)) {
      const result = dateUtil.validateHtmlDateInput(type, text);
      if (!result.valid) {
        throw new Error(
          `Invalid date format for type: ${type}, expected format: ${result.format}, example: ${result.example}`
        );
      }
    }
    await this.page.locator(cssLocator).fill(text);
  }

  async setRangeValue(locator: PartLocator, value: number): Promise<void> {
    const cssLocator = await locatorUtil.toCssSelector(locator, this);
    // Playwright's `fill` rejects `<input type="range">` (it is not a fillable
    // text control), so set the value in-page through the native value setter.
    // Calling the prototype setter both sanitizes the value to the input's step
    // (the browser snaps an off-step target to the nearest valid step) and lets
    // React's value tracker observe the change; the dispatched input/change
    // events then drive a controlled component (e.g. MUI Slider) to re-render.
    await this.page.locator(cssLocator).evaluate((el, nextValue) => {
      const input = el as HTMLInputElement;
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
      setter?.call(input, nextValue);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }, String(value));
  }

  async click(locator: PartLocator, option?: Partial<ClickOption>): Promise<void> {
    const cssLocator = await locatorUtil.toCssSelector(locator, this);
    await this.page.locator(cssLocator).click({ position: option?.position });
  }

  /**
   * Dispatch a right-click on the located element to open its context menu.
   *
   * Delegates to Playwright's native right-button click, which fires a real
   * `contextmenu` event in the browser. Per this layer's convention, no
   * `ElementNotFoundError` is fabricated: a missing element surfaces through
   * Playwright's own auto-wait timeout.
   *
   * @param locator - Locator of the element to right-click
   */
  async contextMenu(locator: PartLocator): Promise<void> {
    const css = await locatorUtil.toCssSelector(locator, this);
    await this.page.locator(css).click({ button: 'right' });
  }

  async hover(locator: PartLocator, option?: Partial<HoverOption>): Promise<void> {
    const cssLocator = await locatorUtil.toCssSelector(locator, this);
    await this.page.locator(cssLocator).hover({ position: option?.position });
  }

  async mouseMove(locator: PartLocator, option?: Partial<MouseMoveOption>): Promise<void> {
    await this.hover(locator, {
      position: option?.position,
    });
    await this.page.mouse.move(0, 0);
  }

  async mouseDown(locator: PartLocator, option?: Partial<MouseDownOption>): Promise<void> {
    await this.hover(locator, {
      position: option?.position,
    });
    await this.page.mouse.down();
  }

  async mouseUp(locator: PartLocator, option?: Partial<MouseUpOption>): Promise<void> {
    await this.hover(locator, {
      position: option?.position,
    });
    await this.page.mouse.up();
  }

  async mouseOver(locator: PartLocator, option?: Partial<HoverOption>): Promise<void> {
    return this.hover(locator, option);
  }

  async mouseOut(locator: PartLocator, _option?: Partial<MouseOutOption>): Promise<void> {
    const cssLocator = await locatorUtil.toCssSelector(locator, this);
    // First hover over the element to trigger mouseenter/mouseover
    await this.page.locator(cssLocator).hover();
    // Then dispatch mouseout event directly for cross-browser reliability
    await this.page.locator(cssLocator).dispatchEvent('mouseout');
  }

  async mouseEnter(locator: PartLocator, _option?: Partial<MouseEnterOption>): Promise<void> {
    return this.hover(locator);
  }

  async mouseLeave(locator: PartLocator, _option?: Partial<MouseLeaveOption>): Promise<void> {
    const cssLocator = await locatorUtil.toCssSelector(locator, this);
    // First hover over the element to trigger mouseenter/mouseover
    await this.page.locator(cssLocator).hover();
    // Dispatch mouseout which triggers both mouseout and mouseleave handlers in React
    await this.page.locator(cssLocator).dispatchEvent('mouseout');
  }

  async focus(locator: PartLocator, _option?: Partial<FocusOption>): Promise<void> {
    const cssLocator = await locatorUtil.toCssSelector(locator, this);
    return this.page.focus(cssLocator);
  }

  async blur(locator: PartLocator, _option?: Partial<BlurOption>): Promise<void> {
    const cssLocator = await locatorUtil.toCssSelector(locator, this);
    await this.page.locator(cssLocator).blur();
  }

  async pressKey(locator: PartLocator, key: string, option?: Partial<PressKeyOption>): Promise<void> {
    const cssLocator = await locatorUtil.toCssSelector(locator, this);
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
    // Caveat: for Shift + a printable key the browser case-folds `event.key`
    // (`Shift+a` → `'A'`) whereas the jsdom path keeps `'a'` — only the modifier
    // flags are delivered identically across engines (see #924).
    await this.page.locator(cssLocator).press(chord);
  }

  async activate(locator: PartLocator): Promise<void> {
    const cssLocator = await locatorUtil.toCssSelector(locator, this);
    // Geometry-free activation mirrors the mouseout dispatch precedent above: it
    // bypasses hit-testing to actuate a covered or zero-size input that
    // locator.click() (a real geometry hit-test) cannot reach.
    await this.page.locator(cssLocator).dispatchEvent('click');
  }

  //#region wait conditions
  wait(ms: number): Promise<void> {
    return timingUtil.wait(ms);
  }

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
    const cssLocator = await locatorUtil.toCssSelector(locator, this);
    const elLocator = this.page.locator(cssLocator);
    if (isMultiple) {
      const locators = await elLocator.all();
      const values: string[] = [];
      for (const locator of locators) {
        const value = await locator.getAttribute(name);
        if (value != null) {
          values.push(value);
        }
      }
      return values;
    }
    const value = await elLocator.getAttribute(name);
    return value ?? undefined;
  }

  async getText(locator: PartLocator): Promise<Optional<string>> {
    const cssLocator = await locatorUtil.toCssSelector(locator, this);
    const text = await this.page.locator(cssLocator).textContent();
    return text ?? undefined;
  }

  /**
   * Get the located element's bounding rectangle.
   *
   * `boundingBox()` returns `null` for a detached/invisible element rather than
   * auto-waiting, so this is one of the few Playwright methods that throws
   * `ElementNotFoundError` — matching the house "element not found" contract
   * (ADR 0001).
   *
   * @param locator - Locator of the element to measure
   * @returns The element's bounding rectangle in CSS pixels
   * @throws {ElementNotFoundError} If the element has no bounding box
   */
  async getBoundingRect(locator: PartLocator): Promise<BoundingRect> {
    const css = await locatorUtil.toCssSelector(locator, this);
    const box = await this.page.locator(css).boundingBox();
    if (box == null) {
      throw new ElementNotFoundError(locator, 'getBoundingRect');
    }
    return { x: box.x, y: box.y, width: box.width, height: box.height };
  }

  async exists(locator: PartLocator): Promise<boolean> {
    const cssLocator = await locatorUtil.toCssSelector(locator, this);
    const count = await this.page.locator(cssLocator).count();
    return count > 0;
  }

  async isChecked(locator: PartLocator): Promise<boolean> {
    const cssLocator = await locatorUtil.toCssSelector(locator, this);
    const checked = await this.page.locator(cssLocator).isChecked();
    return checked;
  }

  async isDisabled(locator: PartLocator): Promise<boolean> {
    const cssLocator = await locatorUtil.toCssSelector(locator, this);
    const isDisabled = await this.page.locator(cssLocator).isDisabled();
    return isDisabled;
  }

  async isReadonly(locator: PartLocator): Promise<boolean> {
    const readonly = await this.getAttribute(locator, 'readonly');
    return readonly != null;
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
    const exists = await this.exists(locator);
    if (!exists) {
      return false;
    }

    async function checkCssVisibility(
      prop: CssProperty,
      invisibleValue: string,
      interactor: PlaywrightInteractor
    ): Promise<boolean> {
      try {
        const value = await interactor.getStyleValue(locator, prop);
        return value !== invisibleValue;
      } catch (e) {
        // Element may disappear or detached while being checked because of animation
        // when it happens, an error is thrown.  In this case, if indeed the element
        // is not visible, we return false.  Otherwise, we re-throw the error.
        if ((await interactor.exists(locator)) === false) {
          return false;
        }
        throw e;
      }
    }

    if ((await checkCssVisibility('opacity', '0', this)) === false) {
      return false;
    }

    if ((await checkCssVisibility('visibility', 'hidden', this)) === false) {
      return false;
    }

    if ((await checkCssVisibility('display', 'none', this)) === false) {
      return false;
    }

    return true;
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
    const cssLocator = await locatorUtil.toCssSelector(locator, this);
    return this.page.locator(cssLocator).innerHTML();
  }
  //#endregion

  clone(): Interactor {
    return new PlaywrightInteractor(this.page);
  }
}
