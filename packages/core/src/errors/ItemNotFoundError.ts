import { ComponentDriver } from '../drivers/ComponentDriver';
import { PartLocator } from '../locators';
import { getLocatorInfoForErrorLog } from '../utils/locatorUtil';
import { ErrorBase } from './ErrorBase';

export const ItemNotFoundErrorId = 'ItemNotFoundError';

function getErrorMessage(query: PartLocator | string): string {
  const description = typeof query === 'string' ? query : getLocatorInfoForErrorLog(query);
  return `Item not found.  Locator: ${description}`;
}

/**
 * The canonical "an item searched for in a collection was not found" error.
 * Component-specific list-miss errors (e.g. a menu's `MenuItemNotFoundError`)
 * subclass this so callers can catch the family with one `instanceof` check.
 *
 * @param query What was searched for — a {@link PartLocator} or a human-readable
 *   description such as an item label.
 * @param message Optional override for the generated message, used by subclasses
 *   that phrase the miss in their own terms.
 */
export class ItemNotFoundError extends ErrorBase {
  constructor(
    public readonly query: PartLocator | string,
    driver: ComponentDriver<any>,
    message: string = getErrorMessage(query)
  ) {
    super(message, driver);
    this.name = ItemNotFoundErrorId;
  }
}
