import { childListHelper, ComponentDriver, PartLocator } from '@atomic-testing/core';

import { MenuItemNotFoundError } from '../errors/MenuItemNotFoundError';
import { MenuItemDriver } from './MenuItemDriver';

/** CSS for a PrimeVue menu item — the ARIA role, never a theme class. */
const menuItemSelector = '[role="menuitem"]';

/**
 * Shared item operations for this package's menu-family drivers: `Menu`
 * (`role="menu"` list) and `ContextMenu` (`role="menubar"` top-level list, per
 * its DOM audit) both render `role="menuitem"` leaves interspersed with
 * same-tag `role="separator"` `<li>`s, and both activate an item via its inner
 * `data-pc-section="itemlink"` anchor ({@link MenuItemDriver}). This base owns
 * ONLY item iteration/label matching (the methods below) — open/close
 * semantics are NOT here, each concrete driver owns its own entirely
 * (`MenuDriver`'s `isOpen`/`waitForOpen`/`waitForClose`, `ContextMenuDriver`'s
 * `open`/`isOpen`/`closeByEscape`/`waitForOpen`/`waitForClose`), since how a
 * popup opens and how a right-click-anchored menu opens share no logic.
 * Subclasses supply only a concrete {@link itemListLocator}. Extracted per
 * #1036 when `ContextMenu` landed as the second menu surface (mirrors
 * `component-driver-radix-v1`'s `MenuContentDriverBase` split: base owns item
 * iteration + label matching; concrete drivers own trigger/open semantics and
 * their portalled-surface locator).
 *
 * **Item iteration uses `childListHelper`, not a plain `:nth-of-type` walk**:
 * see {@link MenuDriver}'s class doc for the truncated-enumeration failure
 * mode this guards against (same separator-shares-the-item-tag shape in both
 * `Menu` and `ContextMenu`).
 *
 * @internal
 */
export abstract class MenuContentDriverBase extends ComponentDriver<{}> {
  /** The element whose direct children are the `role="menuitem"`/`role="separator"` items. */
  protected abstract get itemListLocator(): PartLocator;

  /** The item whose visible label matches `label`, or `null` when absent. */
  async getMenuItemByLabel(label: string): Promise<MenuItemDriver | null> {
    for await (const item of childListHelper.iterateMatchingChildren(
      this,
      this.itemListLocator,
      menuItemSelector,
      MenuItemDriver
    )) {
      if ((await item.getLabel()) === label) {
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

  /** The number of items (`role="menuitem"`) in the open surface, separators excluded. */
  async getMenuItemCount(): Promise<number> {
    return childListHelper.countMatchingChildren(this.interactor, this.itemListLocator, menuItemSelector);
  }

  /** The item at the given zero-based index (separators excluded), or `null` if out of range. */
  async getMenuItemByIndex(index: number): Promise<MenuItemDriver | null> {
    let position = 0;
    for await (const item of childListHelper.iterateMatchingChildren(
      this,
      this.itemListLocator,
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
