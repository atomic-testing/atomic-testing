import { type PartLocator } from '../locators';
import { ComponentDriverCtor, ScenePart } from '../partTypes';
import { ComponentDriver } from './ComponentDriver';

/**
 * Get list item driver within host by index.  List item is an indefinite number of items under the same host
 * with similar characteristics defined by the itemLocatorBase.
 *
 * The i-th item is the i-th LOCATOR MATCH, resolved through
 * {@link Interactor.getMatchLocator} — the same reckoning
 * {@link getListItemCount} counts by, so the two cannot disagree for any list
 * shape. Addressing used to append `:nth-of-type(i + 1)`, which counts by TAG
 * position among siblings: interleave one same-tag non-item (a header/divider
 * `<li>`) ahead of the items and every index missed, so `getItems()` answered
 * `[]` while `getItemCount()` answered N — a false green, since "no items"
 * satisfies an emptiness assertion (#1054). The caller could not detect the
 * violation, which made the old "homogeneous siblings" note a trap rather than a
 * contract.
 *
 * @param host The component the list item is under
 * @param itemLocatorBase The locator of the list item without the index, the locator should already compound the host locator if needed
 * @param index The index of the list item
 * @param driverClass The driver class of the list item
 * @returns The item's driver, or `null` when the list has no item at that index
 */
export async function getListItemByIndex<HostPartT extends ScenePart, ItemT extends ComponentDriver>(
  host: ComponentDriver<HostPartT>,
  itemLocatorBase: PartLocator,
  index: number,
  driverClass: ComponentDriverCtor<ItemT>
): Promise<ItemT | null> {
  const itemLocator = await host.interactor.getMatchLocator(itemLocatorBase, index);
  if (itemLocator == null) {
    return null;
  }
  return new driverClass(itemLocator, host.interactor, host.commutableOption);
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
 * where `locator.count()` is one call.
 *
 * {@link getListItemByIndex} addresses items by the SAME reckoning (match order,
 * via {@link Interactor.getMatchLocator}), so this count and that index access
 * agree by construction for any list shape — including one whose items are
 * interleaved with same-tag non-items, which the previous `:nth-of-type`
 * addressing silently mis-indexed (#1054).
 *
 * Items nested inside wrapper elements are a different problem, and still belong
 * to childListHelper's {@link countMatchingChildren} /
 * {@link iterateMatchingChildren}, whose `groupSelector` recursion descends into
 * those wrappers — something no single locator match set expresses.
 *
 * @param host The component the list items are under
 * @param itemLocatorBase The locator matching the list's items
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
