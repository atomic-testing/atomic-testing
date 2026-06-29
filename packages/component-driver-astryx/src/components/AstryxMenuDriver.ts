import { ComponentDriver, Optional, PartLocator } from '@atomic-testing/core';

import { countMatchingChildren, getMatchingChildren } from '../internal/childListHelper';
import { MenuItemDriver } from './MenuItemDriver';

/** CSS for an Astryx menu item — the ARIA role, never a StyleX-hashed class. */
export const MENU_ITEM_SELECTOR = '[role="menuitem"]';

/**
 * Shared base for the Astryx menu family (NavMenu, DropdownMenu, MoreMenu).
 *
 * Every menu renders its items as `role="menuitem"` children of a
 * `role="menu"` element; the only difference is where that element lives, so
 * subclasses supply it via {@link resolveMenuLocator} (NavMenu *is* the menu;
 * DropdownMenu/MoreMenu reach it through the trigger's `aria-controls`). Items are
 * iterated positionally over the menu's children (see `childListHelper`) so that
 * NavMenu's mixed `<a>`/`<div>` items — and any interspersed `role="separator"` —
 * are handled correctly; matching is by visible text, mirroring the existing
 * `ButtonGroupDriver`.
 */
export abstract class AstryxMenuDriver extends ComponentDriver {
  /**
   * The `role="menu"` element whose `role="menuitem"` children are this menu's
   * items, or `null` when it cannot be resolved (e.g. a closed menu with no
   * `aria-controls`).
   */
  protected abstract resolveMenuLocator(): Promise<PartLocator | null>;

  /** Every item driver, in DOM order. */
  async getItems(): Promise<MenuItemDriver[]> {
    const menu = await this.resolveMenuLocator();
    if (menu == null) {
      return [];
    }
    return getMatchingChildren(this, menu, MENU_ITEM_SELECTOR, MenuItemDriver);
  }

  /** Number of items in the menu. */
  async getItemCount(): Promise<number> {
    const menu = await this.resolveMenuLocator();
    if (menu == null) {
      return 0;
    }
    return countMatchingChildren(this.interactor, menu, MENU_ITEM_SELECTOR);
  }

  /** Every item's visible label, in DOM order. */
  async getItemLabels(): Promise<readonly string[]> {
    const items = await this.getItems();
    const labels = await Promise.all(items.map(item => item.getLabel()));
    return labels.filter((label): label is string => label != null);
  }

  /** The item driver whose visible text matches `label`, or `null` when absent. */
  async getItemByLabel(label: string): Promise<MenuItemDriver | null> {
    for (const item of await this.getItems()) {
      if ((await item.getLabel())?.trim() === label) {
        return item;
      }
    }
    return null;
  }

  /**
   * Click the item whose visible text matches `label`.
   * @returns `false` when no such item exists.
   */
  async selectByLabel(label: string): Promise<boolean> {
    const item = await this.getItemByLabel(label);
    if (item == null) {
      return false;
    }
    await item.click();
    return true;
  }

  /** Whether the item with the given label is disabled. `false` when absent. */
  async isItemDisabled(label: string): Promise<boolean> {
    const item = await this.getItemByLabel(label);
    return item != null && (await item.isDisabled());
  }

  /** The `href` of the item with the given label, or `undefined` when absent/not a link. */
  async getItemHref(label: string): Promise<Optional<string>> {
    const item = await this.getItemByLabel(label);
    return item == null ? undefined : item.getHref();
  }
}
