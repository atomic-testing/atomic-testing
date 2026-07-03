import { childListHelper, ContainerDriver, ScenePart } from '@atomic-testing/core';

import { MenuItemNotFoundError } from '../errors/MenuItemNotFoundError';
import { MenuItemDriver } from './MenuItemDriver';

/** CSS for a Radix menu item — the ARIA role, never a Tailwind/shadcn class. */
const menuItemSelector = '[role="menuitem"]';

/**
 * Shared item operations for the Radix menu-content family: `DropdownMenu`,
 * `ContextMenu` and `Menubar` all portal the same `role="menu"` surface whose
 * children are `role="menuitem"` leaves interspersed with same-tag
 * `role="separator"` `<div>`s (verified against rendered `radix-ui@1.6.1` DOM
 * for all three). Subclasses differ only in how the menu surface is located
 * (static portal re-root, trigger `aria-controls` link, or the document-rooted
 * role) and how it opens (click, right-click, trigger click) — the item reads
 * on `this.locator` are identical, so they live here once.
 *
 * **Item iteration uses `childListHelper`, not `listHelper`**: a plain
 * `:nth-of-type` walk (what `component-driver-mui-v7`'s `MenuDriver` uses) counts
 * positions among same-tag siblings, but Radix renders its menu separators
 * as a plain `<div>` — the same tag as the items — interspersed
 * between items. `:nth-of-type(3)` would then require the 3rd `<div>` to BOTH be
 * at that tag-position AND carry `role="menuitem"`, which fails the moment a
 * separator occupies an earlier position, silently truncating the item list
 * (see the CLAUDE.md stale-`childListHelper` trap this exact failure mode
 * describes). `childListHelper`'s `:nth-child` walk instead checks each child
 * position against `menuItemSelector`, correctly skipping non-matching
 * siblings without losing count.
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
