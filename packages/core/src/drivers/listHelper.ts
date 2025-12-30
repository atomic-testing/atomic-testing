import { byCssSelector, type CssLocator, type PartLocator } from '../locators';
import { ComponentDriverCtor, ScenePart } from '../partTypes';
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
export async function getListItemByIndex<HostPartT extends ScenePart, ItemT extends ComponentDriver>(
  host: ComponentDriver<HostPartT>,
  itemLocatorBase: PartLocator,
  index: number,
  driverClass: ComponentDriverCtor<ItemT>
): Promise<ItemT | null> {
  const nthLocator: CssLocator = byCssSelector(`:nth-of-type(${index + 1})`, 'Same');
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
export async function* getListItemIterator<HostPartT extends ScenePart, ItemT extends ComponentDriver>(
  host: ComponentDriver<HostPartT>,
  itemLocatorBase: PartLocator,
  driverClass: ComponentDriverCtor<ItemT>,
  startIndex: number = 0
): AsyncGenerator<ItemT, void, unknown> {
  let index = startIndex;
  let item: ItemT | null = await getListItemByIndex(host, itemLocatorBase, index, driverClass);
  while (item != null) {
    yield item;
    index++;
    item = await getListItemByIndex(host, itemLocatorBase, index, driverClass);
  }
}

/**
 * Get the count of items in a list without instantiating driver instances.
 * This is more efficient than calling getItems().length when you only need the count.
 * @param host The component the list items are under
 * @param itemLocatorBase The locator of the list items without the index
 * @returns The number of items in the list
 */
export async function getListItemCount<HostPartT extends ScenePart>(
  host: ComponentDriver<HostPartT>,
  itemLocatorBase: PartLocator
): Promise<number> {
  let count = 0;
  let index = 0;
  const nthLocator: CssLocator = byCssSelector(`:nth-of-type(${index + 1})`, 'Same');
  let itemLocator = append(itemLocatorBase, nthLocator);
  let exists = await host.interactor.exists(itemLocator);

  while (exists) {
    count++;
    index++;
    const nextNthLocator: CssLocator = byCssSelector(`:nth-of-type(${index + 1})`, 'Same');
    itemLocator = append(itemLocatorBase, nextNthLocator);
    exists = await host.interactor.exists(itemLocator);
  }

  return count;
}
