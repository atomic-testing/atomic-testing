import {
  byRole,
  ComponentDriver,
  IComponentDriverOption,
  Interactor,
  listHelper,
  locatorUtil,
  type LocatorRelativePosition,
  Optional,
  PartLocator,
} from '@atomic-testing/core';

import { MenuItemNotFoundError } from '../errors/MenuItemNotFoundError';
import { overlayContainerLocator } from '../internal/overlayLocators';
import { MenuItemDriver } from './MenuItemDriver';

const menuItemLocator = byRole('menuitem');

/**
 * Driver for the Angular Material menu (`MatMenu`).
 *
 * The menu panel (`role="menu"` with `role="menuitem"` children) is portaled
 * into the CDK overlay container on `document.body` — outside the test
 * engine's subtree — so this driver re-roots there
 * ({@link MenuDriver.overriddenParentLocator} + `'Same'`), the same portal
 * technique as the mui-v7 `MenuDriver`. The scene locator therefore refines
 * the panel element itself; Material forwards no `data-testid`, so give the
 * menu an accessible name (`<mat-menu aria-label="…">` lands on the panel)
 * and locate it with `byAriaLabel`.
 *
 * Opening is the test's own gesture — click the trigger element (the
 * `[matMenuTriggerFor]` button, an ordinary in-tree part) — after which the
 * item reads and `selectByLabel` here apply. Activating an item closes the
 * menu; Material removes the panel from the DOM, so `exists()` doubles as the
 * open probe.
 *
 * @see https://material.angular.dev/components/menu
 */
export class MenuDriver extends ComponentDriver<{}> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, option);
  }

  static override overriddenParentLocator(): Optional<PartLocator> {
    return locatorUtil.append(overlayContainerLocator, byRole('menu'));
  }

  static override overrideLocatorRelativePosition(): Optional<LocatorRelativePosition> {
    return 'Same';
  }

  private get menuItemsLocator(): PartLocator {
    return locatorUtil.append(this.locator, menuItemLocator);
  }

  /**
   * Get the driver of the item whose visible label equals `label`, or `null`
   * when no item matches. The menu must be open.
   */
  async getMenuItemByLabel(label: string): Promise<MenuItemDriver | null> {
    for await (const item of listHelper.getListItemIterator(this, this.menuItemsLocator, MenuItemDriver)) {
      const itemLabel = await item.label();
      if (itemLabel === label) {
        return item;
      }
    }
    return null;
  }

  /**
   * Activate the item with the given visible label. The menu must be open.
   * @throws {MenuItemNotFoundError} when no item matches
   */
  async selectByLabel(label: string): Promise<void> {
    const item = await this.getMenuItemByLabel(label);
    if (item) {
      await item.click();
    } else {
      throw new MenuItemNotFoundError(label, this);
    }
  }

  /**
   * The number of items (role `menuitem`) in the open menu.
   */
  async getMenuItemCount(): Promise<number> {
    return listHelper.getListItemCount(this, this.menuItemsLocator);
  }

  /**
   * Get the menu item at the given zero-based index, or `null` if out of
   * range. Complements the label-based {@link getMenuItemByLabel}.
   */
  async getMenuItemByIndex(index: number): Promise<MenuItemDriver | null> {
    return listHelper.getListItemByIndex(this, this.menuItemsLocator, index, MenuItemDriver);
  }

  override get driverName(): string {
    return 'AngularMaterialV21MenuDriver';
  }
}
