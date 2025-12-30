import {
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
  timingUtil,
  WaitForOption,
  WaitUntilOption,
} from '@atomic-testing/core';
import { fireEvent } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import { FakeMouseEvent } from './fakeEvents';

export class DOMInteractor implements Interactor {
  constructor(protected readonly rootEl: HTMLElement = document.documentElement) {}
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
      await userEvent.click(el);
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
    await userEvent.hover(el);
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
      await userEvent.clear(el);
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

    await userEvent.type(el, text);
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
    await userEvent.selectOptions(el, values);
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

  async exists(locator: PartLocator): Promise<boolean> {
    const el = await this.getElement(locator);
    return Promise.resolve(el != null);
  }

  async getElement<T extends Element = Element>(locator: PartLocator, isMultiple: true): Promise<readonly T[]>;
  async getElement<T extends Element = Element>(locator: PartLocator, isMultiple: false): Promise<Optional<T>>;
  async getElement<T extends Element = Element>(locator: PartLocator): Promise<Optional<T>>;
  async getElement<T extends Element = Element>(locator: PartLocator, isMultiple = false) {
    const cssLocator = await locatorUtil.toCssSelector(locator, this);
    if (isMultiple) {
      const elList = this.rootEl.querySelectorAll<T>(cssLocator);
      const result: T[] = [];
      elList.forEach(el => result.push(el));
      return result;
    }
    return this.rootEl.querySelector<T>(cssLocator) ?? undefined;
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

  clone(): Interactor {
    return new DOMInteractor(this.rootEl);
  }
}
