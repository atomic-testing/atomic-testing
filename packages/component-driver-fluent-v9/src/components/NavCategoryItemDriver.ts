import { byCssSelector, childListHelper, locatorUtil, PartLocator } from '@atomic-testing/core';

import { NavItemDriver } from './NavItemDriver';

const subItemGroupLocator = byCssSelector('~ .fui-NavSubItemGroup');
const subItemSelector = ':is(.fui-NavSubItem, .fui-NavCategoryItem)';
const defaultTransitionDuration = 1000;

/**
 * Driver for a single Fluent v9 `NavCategoryItem` — the expand/collapse
 * trigger of a `NavCategory` (a nested group inside `Nav`/`NavDrawer`).
 * Extends {@link NavItemDriver} (adds expand/collapse — a plain leaf
 * `NavItem` has no legitimate `isExpanded`, so this is a distinct subclass
 * rather than one driver branching at runtime).
 *
 * DOM audit (@fluentui/react-components@9.4.2): `NavCategoryItem` renders a
 * real `<button aria-expanded="true|false" class="fui-NavCategoryItem">` —
 * unlike `NavItem`, it is NEVER an `<a>`. `aria-current` is forced to
 * `"false"` while expanded even if the category itself is the selected one
 * (`selected && !open ? 'page' : 'false'`), so `isSelected()` (inherited)
 * only reports `true` for a selected-but-collapsed category — an accurate
 * read of the real DOM, not a driver bug.
 *
 * **No portal — `NavCategory`'s expand/collapse is a same-tree animated
 * accordion, NOT a reused `Menu`/`Popover` recipe.** Grepped the entire
 * compiled `@fluentui/react-nav` package for `Popover`/`useMenu`/
 * `MenuTrigger`/`role="menu"`: zero matches. The umbrella issue's
 * "Nav's flyouts are overlay-backed" hypothesis holds only for `NavDrawer`'s
 * OWN outer surface (see {@link NavDrawerDriver}), not for category
 * expansion — so this driver reaches `NavSubItemGroup` (the sibling `<div
 * class="fui-NavSubItemGroup">` holding the sub-items, wrapped in a
 * `Collapse` animation) via the general-sibling CSS combinator off this
 * item's own locator, the same escape hatch `SpinButtonDriver` uses for its
 * steppers — no `byLinkedElement` needed.
 */
export class NavCategoryItemDriver extends NavItemDriver {
  private get subItemGroupLocator(): PartLocator {
    return locatorUtil.append(this.locator, subItemGroupLocator);
  }

  /** Whether the category is expanded (`aria-expanded="true"` on this item). */
  async isExpanded(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-expanded')) === 'true';
  }

  /** Expand the category if collapsed (a no-op otherwise). */
  async expand(timeoutMs: number = defaultTransitionDuration): Promise<void> {
    await this.setExpanded(true, timeoutMs);
  }

  /** Collapse the category if expanded (a no-op otherwise). */
  async collapse(timeoutMs: number = defaultTransitionDuration): Promise<void> {
    await this.setExpanded(false, timeoutMs);
  }

  /**
   * The number of direct sub-items (`NavSubItem`/nested `NavCategoryItem`) in
   * this category's group, `0` when the group isn't currently mounted
   * (collapsed, mirroring `AccordionItemDriver.getPanelText`'s presence
   * caveat) — expands first so a collapsed category still reports its real
   * count rather than a false `0`.
   */
  async getSubItemCount(): Promise<number> {
    await this.expand();
    try {
      return await childListHelper.countMatchingChildren(this.interactor, this.subItemGroupLocator, subItemSelector);
    } catch {
      return 0;
    }
  }

  /**
   * The first sub-item (direct `NavSubItem` or nested `NavCategoryItem`)
   * whose visible label matches `label`, or `null` when absent. Expands
   * first, per {@link getSubItemCount}.
   */
  async getSubItemByLabel(label: string): Promise<NavItemDriver | null> {
    await this.expand();
    try {
      for await (const item of childListHelper.iterateMatchingChildren(
        this,
        this.subItemGroupLocator,
        subItemSelector,
        NavItemDriver
      )) {
        if ((await item.getLabel()) === label) {
          return item;
        }
      }
    } catch {
      // Not currently mounted even after a best-effort expand — no sub-items reachable.
    }
    return null;
  }

  private async setExpanded(expanded: boolean, timeoutMs: number): Promise<void> {
    if ((await this.isExpanded()) === expanded) {
      return;
    }
    await this.interactor.click(this.locator);
    await this.interactor.waitUntil({
      probeFn: () => this.isExpanded(),
      terminateCondition: expanded,
      timeoutMs,
    });
  }

  override get driverName(): string {
    return 'FluentV9NavCategoryItemDriver';
  }
}
