import userEvent from '@testing-library/user-event';
import { IClickOption, IInteractor, LocatorChain, locatorUtil, Optional } from '@testzilla/core';
import { IEnterTextOption } from '@testzilla/core/src/types';

export class DOMInteractor implements IInteractor {
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

  exists(locator: LocatorChain): Promise<boolean> {
    return Promise.resolve(this.getElement(locator) != null);
  }

  getElement(locator: LocatorChain): Optional<Element> {
    const cssLocator = locatorUtil.toCssSelector(locator);
    return document.querySelector(cssLocator) ?? undefined;
  }

  async getAttribute(locator: LocatorChain, name: string): Promise<Optional<string>> {
    const el = this.getElement(locator);
    if (el != null) {
      return Promise.resolve(el.getAttribute(name) ?? undefined);
    }
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

  async getText(locator: LocatorChain): Promise<Optional<string>> {
    const el = this.getElement(locator);
    if (el != null) {
      return Promise.resolve(el.textContent ?? undefined);
    }
  }

  async setAttribute(locator: LocatorChain, name: string, value: string): Promise<void> {
    const el = this.getElement(locator);
    if (el != null) {
      el.setAttribute(name, value);
    }
    return Promise.resolve();
  }

  clone(): IInteractor {
    return new DOMInteractor();
  }
}
