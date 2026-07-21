import { byCssSelector, type PartLocator } from '../locators';
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
  // Address the i-th item by tag position among siblings. `:nth-of-type` is the
  // pseudo both jsdom and Playwright resolve identically here, but it counts by
  // tag — so this addressing (and thus its agreement with getListItemCount)
  // assumes the homogeneous-siblings requirement documented on getListItemCount:
  // no same-tag non-item sibling shifting the reckoning. childListHelper's
  // `:nth-child` + selector filter is the mixed-sibling alternative.
  const nthLocator: PartLocator = byCssSelector(`:nth-of-type(${index + 1})`, 'Same');
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
 * Count the items in a list in a single interactor round-trip, without
 * instantiating any item driver.
 *
 * Counts by locator match: {@link Interactor.getElementCount} asks the interactor
 * how many elements `itemLocatorBase` matches. This replaces the former
 * index-by-index `exists()` probing — O(n) round-trips, costly under Playwright
 * where `locator.count()` is one call — and simultaneously fixes the count-side
 * `:nth-of-type` miscount: counting by match (not by tag position) no longer
 * mis-sizes a list interleaved with a same-tag non-item (a header/divider `<li>`).
 *
 * **Homogeneous-siblings requirement.** {@link getListItemByIndex} still ADDRESSES
 * the i-th item by appending `:nth-of-type(i + 1)` to `itemLocatorBase`, so this
 * count and that index access agree only when the items are the homogeneous set
 * the base matches — i.e. no non-item sibling of the same tag shifts the
 * `:nth-of-type` reckoning. For lists that mix item tags or interleave same-tag
 * non-items, use childListHelper's {@link countMatchingChildren} /
 * {@link iterateMatchingChildren} instead, whose `:nth-child` + `childSelector`
 * filter tolerates mixed siblings.
 *
 * @param host The component the list items are under
 * @param itemLocatorBase The locator of the list items without the index; it must
 * match the homogeneous item set only (see the requirement above)
 * @returns The number of items in the list
 */
export async function getListItemCount<HostPartT extends ScenePart>(
  host: ComponentDriver<HostPartT>,
  itemLocatorBase: PartLocator
): Promise<number> {
  return host.interactor.getElementCount(itemLocatorBase);
}

/**
 * Collect the non-null visible labels of labelled list items, in DOM order.
 *
 * Shared by the list-family drivers whose item drivers expose `getLabel()`
 * (`ListComponentDriver` subclasses and `PositionalListDriver`), so the
 * "map → filter the absent ones" idiom lives in one place.
 */
export async function collectItemLabels(
  items: ReadonlyArray<{ getLabel(): Promise<string | null | undefined> }>
): Promise<string[]> {
  const labels = await Promise.all(items.map(item => item.getLabel()));
  return labels.filter((label): label is string => label != null);
}
