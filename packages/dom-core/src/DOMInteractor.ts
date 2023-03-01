import userEvent from '@testing-library/user-event';
import { IClickOption, IInteractor, LocatorChain, Optional } from '@testzilla/core';

import { CssLocator, LocatorRelativePosition } from '../../core/src/locators/PartLocatorType';

export class DOMInteractor implements IInteractor {
  exists(locator: LocatorChain): Promise<boolean> {
    return Promise.resolve(this.getElement(locator) != null);
  }
  getElement(locator: LocatorChain): Optional<Element> {
    const rootLocatorIndex = this.findRootLocatorIndex(locator);
    const effectiveLocator = rootLocatorIndex === -1 ? locator : locator.slice(rootLocatorIndex);

    const locatorStatements = effectiveLocator.map((loc) => {
      if (typeof loc === 'string') {
        return loc;
      }

      const l = loc as CssLocator;
      return l.selector;
    });
    return this.getElementByCssSelectors(locatorStatements);
  }

  getElementByCssSelectors(selectors: string[]): Optional<Element> {
    const selector = selectors.join(' ');
    return document.querySelector(selector) ?? undefined;
  }

  findRootLocatorIndex(locator: LocatorChain): number {
    const length = locator.length;
    for (let i = length - 1; i >= 0; i--) {
      const loc = locator[i];
      if (typeof loc === 'object') {
        const l = loc as CssLocator;
        if (l.relative === LocatorRelativePosition.documentRoot) {
          return i;
        }
      }
    }

    return -1;
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
