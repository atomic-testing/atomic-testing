import { Optional } from '../dataTypes';
import { ListEnumerationMismatchError } from '../errors/ListEnumerationMismatchError';
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
 * @returns The item's driver, or `undefined` when the index is out of range.
 */
export async function getListItemByIndex<HostPartT extends ScenePart, ItemT extends ComponentDriver>(
  host: ComponentDriver<HostPartT>,
  itemLocatorBase: PartLocator,
  index: number,
  driverClass: ComponentDriverCtor<ItemT>
): Promise<Optional<ItemT>> {
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
  return undefined;
}

/**
 * Get an iterator of list item driver.
 * List item is an indefinite number of items under the same host
 *
 * Iteration stops at the first index that does not resolve. For the homogeneous
 * sibling set this addressing requires (see {@link getListItemCount}) that is the
 * end of the list — but when a non-item sibling shares the items' tag, the
 * `:nth-of-type` reckoning shifts and the first shifted index misses, halting
 * enumeration mid-list. So on running to completion this cross-checks the number
 * of items it reached against the number the locator actually matches, and throws
 * {@link ListEnumerationMismatchError} when they disagree.
 *
 * Truncation used to be silent, which made it strictly worse than a failure: a
 * header `<li>` ahead of the items yielded an EMPTY list while `getListItemCount`
 * reported 3, and `getItemByLabel` reported "no such item" for an item plainly
 * present. Callers cannot detect this themselves — a short list and a genuinely
 * short list are identical at the call site — so the check belongs here, in the
 * primitive whose addressing creates the hazard, rather than in each of its
 * consumers.
 *
 * Costs one extra {@link Interactor.getElementCount} per completed enumeration,
 * against the n + 1 `exists()` round-trips the walk already spends. A consumer that
 * breaks out early (a label search that finds its match) never reaches the check
 * and never pays for it — and is not making a completeness claim to check.
 *
 * A walk with a non-zero `startIndex` is **not** checked; see the comment at the
 * check for why the two reckonings cannot be reconciled across a tag-position offset.
 *
 * @param host The component the list item is under
 * @param itemLocatorBase The locator of the list item without the index, the locator should already compound the host locator if needed
 * @param driverClass The driver class of the list item
 * @param startIndex The starting index of the list item iterator, default is 0
 * @throws {@link ListEnumerationMismatchError} when enumeration completes having
 * reached fewer items than `itemLocatorBase` matches.
 */
export async function* getListItemIterator<HostPartT extends ScenePart, ItemT extends ComponentDriver>(
  host: ComponentDriver<HostPartT>,
  itemLocatorBase: PartLocator,
  driverClass: ComponentDriverCtor<ItemT>,
  startIndex: number = 0
): AsyncGenerator<ItemT, void, unknown> {
  let index = startIndex;
  let item: Optional<ItemT> = await getListItemByIndex(host, itemLocatorBase, index, driverClass);
  while (item != null) {
    yield item;
    index++;
    item = await getListItemByIndex(host, itemLocatorBase, index, driverClass);
  }

  // Only a walk from 0 can be checked. `startIndex` is an offset into TAG positions,
  // not into matched elements, and the two are not convertible: MUI X's
  // DataGridRowDriverBase passes startIndex 1 to skip a filler <div> that precedes the
  // real cells, and that filler holds tag position 1 while matching none of the five
  // `[role=columnheader]` elements the locator counts. Subtracting startIndex from the
  // match count would therefore expect 4 where 5 is right — which is exactly the false
  // positive this guard produced against the DataGrid suites before being scoped here.
  // Establishing how many matched elements sit below startIndex would take extra
  // queries to answer a question the caller has already opted out of by asking for an
  // offset walk, so a partial walk stays unchecked.
  if (startIndex !== 0) {
    return;
  }
  const matchedCount = await getListItemCount(host, itemLocatorBase);
  if (index !== matchedCount) {
    throw new ListEnumerationMismatchError(itemLocatorBase, host, matchedCount, index);
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
