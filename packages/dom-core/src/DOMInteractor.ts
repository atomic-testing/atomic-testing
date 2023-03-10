import { IClickOption, IInteractor, LocatorChain, locatorUtil, Optional } from '@atomic-testing/core';
import { IEnterTextOption } from '@atomic-testing/core/src/types';
import userEvent from '@testing-library/user-event';

export class DOMInteractor implements IInteractor {
  async getAttribute(locator: LocatorChain, name: string, isMultiple: true): Promise<readonly string[]>;
  async getAttribute(locator: LocatorChain, name: string, isMultiple: false): Promise<Optional<string>>;
  async getAttribute(locator: LocatorChain, name: string): Promise<Optional<string>>;
  async getAttribute(
    locator: LocatorChain,
    name: string,
    isMultiple?: boolean,
  ): Promise<Optional<string> | readonly string[]> {
    if (isMultiple) {
      const elements = this.getElement(locator, true);
      return Promise.resolve(elements.map((el) => el.getAttribute(name)!));
    } else {
      const el = this.getElement(locator);
      if (el != null) {
        return Promise.resolve(el.getAttribute(name) ?? undefined);
      }
    }
  }

  async click(locator: LocatorChain, option?: IClickOption): Promise<void> {
    const el = this.getElement(locator);
    if (el != null) {
      await userEvent.click(el);
    }
  }

  async enterText(locator: LocatorChain, text: string, option?: Partial<IEnterTextOption> | undefined): Promise<void> {
    const el = this.getElement(locator);
    if (el != null) {
      await userEvent.type(el, text);
    }
  }

  async selectOptionValue(locator: LocatorChain, values: string[]): Promise<void> {
    const el = this.getElement(locator);
    if (el != null) {
      await userEvent.selectOptions(el, values);
    }
  }

  exists(locator: LocatorChain): Promise<boolean> {
    return Promise.resolve(this.getElement(locator) != null);
  }

  getElement<T extends Element = Element>(locator: LocatorChain, isMultiple: true): readonly T[];
  getElement<T extends Element = Element>(locator: LocatorChain, isMultiple: false): Optional<T>;
  getElement<T extends Element = Element>(locator: LocatorChain): Optional<T>;
  getElement<T extends Element = Element>(locator: LocatorChain, isMultiple = false) {
    const cssLocator = locatorUtil.toCssSelector(locator);
    if (isMultiple) {
      const elList = document.querySelectorAll<T>(cssLocator);
      const result: T[] = [];
      elList.forEach((el) => result.push(el));
      return result;
    }
    return document.querySelector<T>(cssLocator) ?? undefined;
  }

  async getInputValue(locator: LocatorChain): Promise<Optional<string>> {
    const el = this.getElement(locator);
    if (el != null) {
      if (el.nodeName === 'INPUT') {
        return Promise.resolve((el as HTMLInputElement).value ?? undefined);
      } else if (el.nodeName === 'TEXTAREA') {
        return Promise.resolve((el as HTMLTextAreaElement).value ?? undefined);
      }
    }
  }

  async getSelectValues(locator: LocatorChain): Promise<Optional<readonly string[]>> {
    const el = this.getElement(locator);
    if (el != null) {
      if (el.nodeName === 'SELECT') {
        const options = el.querySelectorAll<HTMLOptionElement>('option:checked');
        const values = Array.from(options).map((o) => o.value);
        return Promise.resolve(values);
      }
    }
    return Promise.resolve(undefined);
  }

  async getText(locator: LocatorChain): Promise<Optional<string>> {
    const el = this.getElement(locator);
    if (el != null) {
      return Promise.resolve(el.textContent ?? undefined);
    }
  }

  async isChecked(locator: LocatorChain): Promise<boolean> {
    const el = this.getElement<HTMLInputElement>(locator);
    if (el != null && el.nodeName === 'INPUT') {
      return Promise.resolve(el.checked);
    }
    return Promise.resolve(false);
  }

  clone(): IInteractor {
    return new DOMInteractor();
  }
}
