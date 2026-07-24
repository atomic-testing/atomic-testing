import { childListHelper, ContainerDriver, ScenePart } from '@atomic-testing/core';

import { MenuItemNotFoundError } from '../errors/MenuItemNotFoundError';
import { MenuItemDriver } from './MenuItemDriver';

/** CSS for a Reka menu item — the ARIA role, never a Tailwind/shadcn class. */
const menuItemSelector = '[role="menuitem"]';

/**
 * Shared item operations for the Reka menu-content family (currently just
 * `DropdownMenu`; ported for reuse should `ContextMenu`/`Menubar` land later).
 * Verified against rendered `reka-ui@2.10.1` `DropdownMenuContent` DOM: children
 * are `role="menuitem"` leaves interspersed with same-tag (`<div>`) `role="separator"`
 * elements — byte-for-byte the same shape `component-driver-radix-v1`'s base
 * documents.
 *
 * **Item iteration uses `childListHelper`, not `listHelper`**: a plain
 * `:nth-of-type` walk counts positions among same-tag siblings, but Reka's
 * separator is the SAME tag (`<div>`) as the items, interspersed between them
 * — `childListHelper`'s `:nth-child` walk checks each child position against
 * `menuItemSelector` instead, correctly skipping non-matching siblings without
 * losing count (see the CLAUDE.md stale-`childListHelper` trap this exact
 * failure mode describes).
 *
 * @internal
 */
export abstract class MenuContentDriverBase<ContentT extends ScenePart = {}> extends ContainerDriver<ContentT, {}> {
  /** The item whose visible label matches `label`, or `null` when absent. */
  async getMenuItemByLabel(label: string): Promise<MenuItemDriver | null> {
    for await (const item of childListHelper.iterateMatchingChildren(
      this,
      this.locator,
      menuItemSelector,
      MenuItemDriver
    )) {
      const itemLabel = await item.getLabel();
      if (itemLabel === label) {
        return item;
      }
    }
    return null;
  }

  /** Click the item whose visible label matches `label`. @throws {MenuItemNotFoundError} when absent. */
  async selectByLabel(label: string): Promise<void> {
    const item = await this.getMenuItemByLabel(label);
    if (item) {
      await item.click();
    } else {
      throw new MenuItemNotFoundError(label, this);
    }
  }

  /** The number of items (`role="menuitem"`) in the open menu. */
  async getMenuItemCount(): Promise<number> {
    return childListHelper.countMatchingChildren(this.interactor, this.locator, menuItemSelector);
  }

  /** The item at the given zero-based index, or `null` if out of range. */
  async getMenuItemByIndex(index: number): Promise<MenuItemDriver | null> {
    let position = 0;
    for await (const item of childListHelper.iterateMatchingChildren(
      this,
      this.locator,
      menuItemSelector,
      MenuItemDriver
    )) {
      if (position === index) {
        return item;
      }
      position++;
    }
    return null;
  }
}
