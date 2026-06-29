import {
  byCssSelector,
  ComponentDriver,
  ComponentDriverCtor,
  Interactor,
  locatorUtil,
  PartLocator,
} from '@atomic-testing/core';

/** Locator for the container's `position`-th element child (1-based), any element. */
function anyChildAt(container: PartLocator, position: number): PartLocator {
  return locatorUtil.append(container, byCssSelector(`> *:nth-child(${position})`));
}

/** Locator for the container's `position`-th child, only if it matches `childSelector`. */
function matchingChildAt(container: PartLocator, childSelector: string, position: number): PartLocator {
  return locatorUtil.append(container, byCssSelector(`> ${childSelector}:nth-child(${position})`));
}

/**
 * Yield a driver for each direct child of `container` that matches
 * `childSelector`, addressed positionally by `:nth-child`.
 *
 * `:nth-child` is the only element-position pseudo that both jsdom and Playwright
 * resolve identically, and — unlike the `:nth-of-type` used by the core
 * `listHelper` — it counts across element types. This matters for the Astryx
 * menu/tab families, whose items either mix tags (NavMenu renders items as `<a>`
 * or `<div>`) or are interspersed with non-items (a `role="separator"`, or a tab
 * overflow trigger) sharing a tag with the items: each position is filtered
 * through `childSelector`, so non-matching siblings are skipped without throwing
 * off the index.
 *
 * Iteration walks positions until no child exists there, using only
 * {@link Interactor.exists} — portable across interactors (notably,
 * `getAttribute(..., true)` is NOT a reliable element count: Playwright drops
 * null entries, jsdom keeps them). `container` must resolve to a single element so
 * `:nth-child` is unambiguous; the menu/tab drivers ensure this via a
 * `data-testid` or an `id`-resolved panel.
 */
export async function* iterateMatchingChildren<ItemT extends ComponentDriver>(
  host: ComponentDriver,
  container: PartLocator,
  childSelector: string,
  driverClass: ComponentDriverCtor<ItemT>
): AsyncGenerator<ItemT> {
  for (let position = 1; await host.interactor.exists(anyChildAt(container, position)); position++) {
    const itemLocator = matchingChildAt(container, childSelector, position);
    if (await host.interactor.exists(itemLocator)) {
      yield new driverClass(itemLocator, host.interactor, host.commutableOption);
    }
  }
}

/**
 * Count a container's direct children matching `childSelector`, walking positions
 * via {@link Interactor.exists} (see {@link iterateMatchingChildren} for why a
 * `getAttribute`-based count is not portable).
 */
export async function countMatchingChildren(
  interactor: Interactor,
  container: PartLocator,
  childSelector: string
): Promise<number> {
  let count = 0;
  for (let position = 1; await interactor.exists(anyChildAt(container, position)); position++) {
    if (await interactor.exists(matchingChildAt(container, childSelector, position))) {
      count++;
    }
  }
  return count;
}

/**
 * Collect a driver for every direct child of `container` matching `childSelector`.
 */
export async function getMatchingChildren<ItemT extends ComponentDriver>(
  host: ComponentDriver,
  container: PartLocator,
  childSelector: string,
  driverClass: ComponentDriverCtor<ItemT>
): Promise<ItemT[]> {
  const items: ItemT[] = [];
  for await (const item of iterateMatchingChildren(host, container, childSelector, driverClass)) {
    items.push(item);
  }
  return items;
}
