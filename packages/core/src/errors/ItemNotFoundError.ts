import { PartLocator } from '../locators';
import { getLocatorInfoForErrorLog } from '../utils/getLocatorInfoForErrorLog';
import { ErrorBase } from './ErrorBase';

export const ItemNotFoundErrorId = 'ItemNotFoundError';

/**
 * The canonical "an item searched for in a collection was not found" error.
 * Component-specific list-miss errors (e.g. a menu's `MenuItemNotFoundError`)
 * subclass this so callers can catch the family with one `instanceof` check.
 *
 * Per ADR-010 it retains only a serializable {@link locatorDescription} string —
 * never the live locator — keeping the frozen error contract decoupled from the
 * locator model.
 *
 * @param query What was searched for — a {@link PartLocator} or a human-readable
 *   description such as an item label.
 * @param driver Anything name-bearing (a driver satisfies `{ driverName }`); only
 *   its `driverName` is retained.
 * @param message Optional override for the generated message, used by subclasses
 *   that phrase the miss in their own terms.
 */
export class ItemNotFoundError extends ErrorBase {
  readonly locatorDescription: string;

  constructor(query: PartLocator | string, driver: { driverName: string }, message?: string) {
    const locatorDescription = typeof query === 'string' ? query : getLocatorInfoForErrorLog(query);
    super(message ?? `Item not found.  Locator: ${locatorDescription}`, driver);
    this.locatorDescription = locatorDescription;
    this.name = ItemNotFoundErrorId;
  }
}
