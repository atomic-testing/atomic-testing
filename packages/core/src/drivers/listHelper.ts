import { byCssSelector, CssLocator, LocatorRelativePosition, PartLocator } from '../locators';
import { ComponentDriverClass } from '../partTypes';
import { append } from '../utils/locatorUtil';

import { ComponentDriver } from './ComponentDriver';

/**
 * Get list item driver within host by index.  List item is an indefinite number of items under the same host
 * with similar characteristics defined by the itemLocatorBase.
 * @param host The component the list item is under
 * @param itemLocatorBase The locator of the list item without the index, the locator should already compound the host locator if needed
 * @param index The index of the list item
 * @param driverClass The driver class of the list item
 * @returns
 */
export async function getListItemByIndex<T extends ComponentDriver>(
  host: ComponentDriver<any>,
  itemLocatorBase: PartLocator,
  index: number,
  driverClass: ComponentDriverClass<T>
): Promise<T | null> {
  const nthLocator: CssLocator = byCssSelector(`:nth-of-type(${index + 1})`, LocatorRelativePosition.Same);
  const itemLocator = append(itemLocatorBase, nthLocator);
  const exists = await host.interactor.exists(itemLocator);
  if (exists) {
    return new driverClass(itemLocator, host.interactor, host.commutableOption);
  }
  return null;
}

/**
 * Get an iterator of list item driver.
 * List item is an indefinite number of items under the same host
 * @param host The component the list item is under
 * @param itemLocatorBase The locator of the list item without the index, the locator should already compound the host locator if needed
 * @param driverClass The driver class of the list item
 * @param startIndex The starting index of the list item iterator, default is 0
 */
export async function* getListItemIterator<T extends ComponentDriver<any>>(
  host: ComponentDriver<any>,
  itemLocatorBase: PartLocator,
  driverClass: ComponentDriverClass<T>,
  startIndex: number = 0
): AsyncGenerator<T, void, unknown> {
  let index = startIndex;
  let item: T | null = await getListItemByIndex(host, itemLocatorBase, index, driverClass);
  while (item != null) {
    yield item;
    index++;
    item = await getListItemByIndex(host, itemLocatorBase, index, driverClass);
  }
}
