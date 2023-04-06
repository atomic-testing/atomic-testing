import { LocatorChain } from '../locators';
import { toCssSelector } from '../utils/locatorUtil';

export const ItemNotFoundErrorId = 'ItemNotFoundError';

function getErrorMessage(locator: LocatorChain): string {
  const cssLocator = toCssSelector(locator);
  return `Item not found.  Locator: ${cssLocator}`;
}

export class ItemNotFoundError extends Error {
  constructor(public readonly locator: LocatorChain) {
    super(getErrorMessage(locator));
    this.name = ItemNotFoundErrorId;
  }
}
