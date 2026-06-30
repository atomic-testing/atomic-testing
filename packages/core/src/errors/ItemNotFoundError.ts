import { PartLocator } from '../locators';
import { getLocatorInfoForErrorLog } from '../utils/locatorUtil';
import { ErrorBase } from './ErrorBase';

export const ItemNotFoundErrorId = 'ItemNotFoundError';

export class ItemNotFoundError extends ErrorBase {
  readonly locatorDescription: string;

  constructor(locator: PartLocator, driver: { driverName: string }) {
    const locatorDescription = getLocatorInfoForErrorLog(locator);
    super(`Item not found.  Locator: ${locatorDescription}`, driver);
    this.locatorDescription = locatorDescription;
    this.name = ItemNotFoundErrorId;
  }
}
