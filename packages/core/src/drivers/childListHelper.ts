import { Interactor } from '../interactor';
import { byCssSelector, type PartLocator } from '../locators';
import { ComponentDriverCtor } from '../partTypes';
import { append } from '../utils/locatorUtil';
import { ComponentDriver } from './ComponentDriver';

/** Locator for the container's `position`-th element child (1-based), any element. */
function anyChildAt(container: PartLocator, position: number): PartLocator {
  return append(container, byCssSelector(`> *:nth-child(${position})`));
}

/** Locator for the container's `position`-th child, only if it matches `childSelector`. */
function matchingChildAt(container: PartLocator, childSelector: string, position: number): PartLocator {
  return append(container, byCssSelector(`> ${childSelector}:nth-child(${position})`));
}

/**
 * Yield a driver for each descendant of `container` that matches `childSelector`,
 * addressed positionally by `:nth-child`.
 *
 * `:nth-child` is the only element-position pseudo that both jsdom and Playwright
 * resolve identically, and — unlike the `:nth-of-type` used by {@link getListItemByIndex}
 * and friends — it counts across element types. This matters for lists whose items
 * either mix tags (e.g. `<a>`/`<div>` menu items) or are interspersed with
 * non-items (a `role="separator"`, an overflow trigger) sharing a tag with the
 * items: each position is filtered through `childSelector`, so non-matching
 * siblings are skipped without throwing off the index.
 *
 * When `groupSelector` is supplied, a child that is not itself an item but matches
 * `groupSelector` is treated as a wrapper and recursed into — so items nested one
 * (or more) levels deep are still found. Pass a specific selector (e.g. a
 * `role="group"` section) to descend only through those wrappers, or `'*'` to
 * descend through any layout container. Omit it for a flat (direct-children-only)
 * walk.
 *
 * Iteration walks positions until no child exists there, using only
 * {@link Interactor.exists} — portable across interactors (notably,
 * `getAttribute(..., true)` is NOT a reliable element count: Playwright drops
 * null entries, jsdom keeps them). `container` must resolve to a single element so
 * `:nth-child` is unambiguous.
 */
export async function* iterateMatchingChildren<ItemT extends ComponentDriver>(
  host: ComponentDriver,
  container: PartLocator,
  childSelector: string,
  driverClass: ComponentDriverCtor<ItemT>,
  groupSelector?: string
): AsyncGenerator<ItemT> {
  for (let position = 1; await host.interactor.exists(anyChildAt(container, position)); position++) {
    const itemLocator = matchingChildAt(container, childSelector, position);
    if (await host.interactor.exists(itemLocator)) {
      yield new driverClass(itemLocator, host.interactor, host.commutableOption);
    } else if (groupSelector != null) {
      const groupLocator = matchingChildAt(container, groupSelector, position);
      if (await host.interactor.exists(groupLocator)) {
        yield* iterateMatchingChildren(host, groupLocator, childSelector, driverClass, groupSelector);
      }
    }
  }
}

/**
 * Count a container's descendants matching `childSelector`, walking positions via
 * {@link Interactor.exists} (see {@link iterateMatchingChildren} for why a
 * `getAttribute`-based count is not portable, and for the `groupSelector`
 * recursion that reaches items nested inside wrappers).
 */
export async function countMatchingChildren(
  interactor: Interactor,
  container: PartLocator,
  childSelector: string,
  groupSelector?: string
): Promise<number> {
  let count = 0;
  for (let position = 1; await interactor.exists(anyChildAt(container, position)); position++) {
    if (await interactor.exists(matchingChildAt(container, childSelector, position))) {
      count++;
    } else if (groupSelector != null) {
      const groupLocator = matchingChildAt(container, groupSelector, position);
      if (await interactor.exists(groupLocator)) {
        count += await countMatchingChildren(interactor, groupLocator, childSelector, groupSelector);
      }
    }
  }
  return count;
}

/**
 * Collect a driver for every descendant of `container` matching `childSelector`
 * (see {@link iterateMatchingChildren} for the `groupSelector` recursion).
 */
export async function getMatchingChildren<ItemT extends ComponentDriver>(
  host: ComponentDriver,
  container: PartLocator,
  childSelector: string,
  driverClass: ComponentDriverCtor<ItemT>,
  groupSelector?: string
): Promise<ItemT[]> {
  const items: ItemT[] = [];
  for await (const item of iterateMatchingChildren(host, container, childSelector, driverClass, groupSelector)) {
    items.push(item);
  }
  return items;
}
