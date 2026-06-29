import { Optional, PartLocator } from '@atomic-testing/core';

import { PositionalListDriver } from '../internal/PositionalListDriver';
import { MenuItemDriver } from './MenuItemDriver';

/** CSS for an Astryx menu item — the ARIA role, never a StyleX-hashed class. */
export const MENU_ITEM_SELECTOR = '[role="menuitem"]';

/**
 * CSS for an Astryx menu section wrapper. A data-driven `section` renders its
 * items inside a `<div role="group">`, so the child walk recurses into it to reach
 * the nested `role="menuitem"`s (see `childListHelper`'s `groupSelector`).
 */
const MENU_GROUP_SELECTOR = '[role="group"]';

/**
 * Shared base for the Astryx menu family (NavMenu, DropdownMenu, MoreMenu).
 *
 * Every menu renders its items as `role="menuitem"` children of a
 * `role="menu"` element; the only difference is where that element lives, so
 * subclasses supply it via {@link resolveMenuLocator} (NavMenu *is* the menu;
 * DropdownMenu/MoreMenu reach it through the trigger's `aria-controls`). The
 * count/labels/lookup/select surface and the `role="group"` section recursion come
 * from {@link PositionalListDriver}; this class adds the menu-item reads
 * (`isItemDisabled`, `getItemHref`).
 */
export abstract class AstryxMenuDriver extends PositionalListDriver<MenuItemDriver> {
  protected readonly itemSelector = MENU_ITEM_SELECTOR;
  protected readonly itemDriverClass = MenuItemDriver;
  protected override readonly groupSelector = MENU_GROUP_SELECTOR;

  /**
   * The `role="menu"` element whose `role="menuitem"` children are this menu's
   * items, or `null` when it cannot be resolved (e.g. a closed menu with no
   * `aria-controls`).
   */
  protected abstract resolveMenuLocator(): Promise<PartLocator | null>;

  protected override resolveListContainer(): Promise<PartLocator | null> {
    return this.resolveMenuLocator();
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
