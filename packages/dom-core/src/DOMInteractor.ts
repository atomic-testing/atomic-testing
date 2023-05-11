import {
  ClickOption,
  CssProperty,
  EnterTextOption,
  Interactor,
  locatorUtil,
  Optional,
  PartLocator,
  timingUtil,
} from '@atomic-testing/core';
import userEvent from '@testing-library/user-event';

export class DOMInteractor implements Interactor {
  constructor(protected readonly rootEl: HTMLElement = document.documentElement) {}

  async getAttribute(locator: PartLocator, name: string, isMultiple: true): Promise<readonly string[]>;
  async getAttribute(locator: PartLocator, name: string, isMultiple: false): Promise<Optional<string>>;
  async getAttribute(locator: PartLocator, name: string): Promise<Optional<string>>;
  async getAttribute(
    locator: PartLocator,
    name: string,
    isMultiple?: boolean,
  ): Promise<Optional<string> | readonly string[]> {
    if (isMultiple) {
      const elements = await this.getElement(locator, true);
      return Promise.resolve(elements.map((el) => el.getAttribute(name)!));
    } else {
      const el = await this.getElement(locator);
      if (el != null) {
        return Promise.resolve(el.getAttribute(name) ?? undefined);
      }
    }
  }

  async getStyleValue(locator: PartLocator, propertyName: CssProperty): Promise<Optional<string>> {
    const el = await this.getElement(locator);
    if (el != null) {
      const val = (el as HTMLElement).style?.[propertyName] as string;
      return Promise.resolve(val ?? undefined);
    }
  }

  async click(locator: PartLocator, option?: ClickOption): Promise<void> {
    const el = await this.getElement(locator);
    if (el != null) {
      await userEvent.click(el, option);
    }
  }

  async hover(locator: PartLocator): Promise<void> {
    const el = await this.getElement(locator);
    if (el != null) {
      await userEvent.hover(el);
    }
  }

  async enterText(locator: PartLocator, text: string, option?: Partial<EnterTextOption> | undefined): Promise<void> {
    const el = await this.getElement(locator);
    if (el != null) {
      if (!option?.append) {
        await userEvent.clear(el);
      }
      await userEvent.type(el, text);
    }
  }

  async selectOptionValue(locator: PartLocator, values: string[]): Promise<void> {
    const el = await this.getElement(locator);
    if (el != null) {
      await userEvent.selectOptions(el, values);
    }
  }

  wait(ms: number): Promise<void> {
    return timingUtil.wait(ms);
  }

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
      elList.forEach((el) => result.push(el));
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
  }

  async getSelectValues(locator: PartLocator): Promise<Optional<readonly string[]>> {
    const el = await this.getElement(locator);
    if (el != null && el.nodeName === 'SELECT') {
      const options = el.querySelectorAll<HTMLOptionElement>('option:checked');
      const values = Array.from(options).map((o) => o.value);
      return Promise.resolve(values);
    }
    return Promise.resolve(undefined);
  }

  async getSelectLabels(locator: PartLocator): Promise<Optional<readonly string[]>> {
    const el = await this.getElement(locator);
    if (el != null && el.nodeName === 'SELECT') {
      const options = el.querySelectorAll<HTMLOptionElement>('option:checked');
      const values = Array.from(options).map((o) => o.text);
      return Promise.resolve(values);
    }
    return Promise.resolve(undefined);
  }

  async getText(locator: PartLocator): Promise<Optional<string>> {
    const el = await this.getElement(locator);
    if (el != null) {
      return Promise.resolve(el.textContent ?? undefined);
    }
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
      // @ts-ignore
      const isDisabled = Boolean(el.disabled);
      return Promise.resolve(isDisabled);
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

  clone(): Interactor {
    return new DOMInteractor();
  }
}
