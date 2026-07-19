import { ComponentDriver } from '@atomic-testing/core';

import { NavItemNotFoundError } from '../errors/NavItemNotFoundError';
import * as navLocators from '../internal/navLocators';
import { NavCategoryItemDriver } from './NavCategoryItemDriver';
import { NavItemDriver } from './NavItemDriver';

/**
 * Shared item-query surface for the Fluent v9 `Nav` family — plain `Nav`
 * ({@link NavDriver}) and drawer-chromed `NavDrawer` ({@link NavDrawerDriver})
 * — which hold the identical `NavItem`/`NavCategory`/`NavCategoryItem`/
 * `NavSubItem` tree shape and differ only in WHERE their root mounts (see
 * `NavDrawerDriver`'s portal re-root doc). Mirrors this package's
 * `DrawerDriverBase` split: the portal re-root hooks are **static** class
 * metadata read before any instance exists, so which recipe applies must be
 * a compile-time class choice — hence two subclasses over one driver with a
 * runtime branch.
 */
export abstract class NavDriverBase extends ComponentDriver<{}> {
  /** The number of items anywhere in the tree (flattened — nested category sub-items included). */
  async getItemCount(): Promise<number> {
    return navLocators.getNavItemCount(this.interactor, this.locator);
  }

  /** The visible label of every item, in DOM order (flattened). */
  async getItemLabels(): Promise<string[]> {
    const labels: string[] = [];
    for await (const item of navLocators.iterateNavItems(this, this.locator)) {
      labels.push((await item.getLabel()) ?? '');
    }
    return labels;
  }

  /** The first item (leaf or category trigger) whose visible label matches `label`, or `null` when absent. */
  async getItemByLabel(label: string): Promise<NavItemDriver | null> {
    return navLocators.getNavItemByLabel(this, this.locator, label);
  }

  /**
   * The first `NavCategoryItem` whose visible label matches `label`, or
   * `null` when absent — use this (rather than {@link getItemByLabel}) to
   * reach the expand/collapse-capable driver. See {@link NavCategoryItemDriver}.
   */
  async getCategoryByLabel(label: string): Promise<NavCategoryItemDriver | null> {
    return navLocators.getNavCategoryByLabel(this, this.locator, label);
  }

  /** The label of the currently selected item, or `null` when none is selected. */
  async getSelectedLabel(): Promise<string | null> {
    return navLocators.getSelectedNavItemLabel(this, this.locator);
  }

  /**
   * Click the item whose visible label matches `label`.
   * @throws {NavItemNotFoundError} when no item matches.
   */
  async selectByLabel(label: string): Promise<void> {
    const item = await this.getItemByLabel(label);
    if (item == null) {
      throw new NavItemNotFoundError(label, this);
    }
    await item.click();
  }
}
