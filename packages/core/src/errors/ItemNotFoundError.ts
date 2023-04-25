import { ComponentDriver } from '../drivers/ComponentDriver';
import { PartLocator } from '../locators';
import { toCssSelector } from '../utils/locatorUtil';
import { ErrorBase } from './ErrorBase';

export const ItemNotFoundErrorId = 'ItemNotFoundError';

function getErrorMessage(locator: PartLocator): string {
  const cssLocator = toCssSelector(locator);
  return `Item not found.  Locator: ${cssLocator}`;
}

export class ItemNotFoundError extends ErrorBase {
  constructor(public readonly locator: PartLocator, public readonly driver: ComponentDriver<any>) {
    super(getErrorMessage(locator), driver);
    this.name = ItemNotFoundErrorId;
  }
}
