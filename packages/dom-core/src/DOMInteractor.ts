import userEvent from '@testing-library/user-event';
import { IClickOption, IInteractor, LocatorChain, locatorUtil, Optional } from '@testzilla/core';

export class DOMInteractor implements IInteractor {
  exists(locator: LocatorChain): Promise<boolean> {
    return Promise.resolve(this.getElement(locator) != null);
  }

  getElement(locator: LocatorChain): Optional<Element> {
    const effectiveLocator = locatorUtil.getEffectiveLocator(locator);
    const cssLocator = locatorUtil.toCssLocator(effectiveLocator);
    return document.querySelector(cssLocator) ?? undefined;
  }

  async click(locator: LocatorChain, option?: IClickOption): Promise<void> {
    const el = this.getElement(locator);
    if (el != null) {
      await userEvent.click(el);
    }
  }

  async getAttribute(locator: LocatorChain): Promise<Optional<string>> {
    const el = this.getElement(locator);
    if (el != null) {
      return Promise.resolve(el.getAttribute('value') ?? undefined);
    }
  }

  async getText(locator: LocatorChain): Promise<Optional<string>> {
    const el = this.getElement(locator);
    if (el != null) {
      return Promise.resolve(el.textContent ?? undefined);
    }
  }

  clone(): IInteractor {
    return new DOMInteractor();
  }
}
