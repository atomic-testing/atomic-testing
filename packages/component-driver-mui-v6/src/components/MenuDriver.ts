import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import {
  byRole,
  ComponentDriver,
  IComponentDriverOption,
  Interactor,
  listHelper,
  type LocatorRelativePosition,
  Optional,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

import { MenuItemNotFoundError } from '../errors/MenuItemNotFoundError';
import { MenuItemDriver } from './MenuItemDriver';

export const parts = {
  menu: {
    locator: byRole('menu'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

const menuRootLocator: PartLocator = byRole('presentation', 'Root');
const menuItemLocator = byRole('menuitem');

export class MenuDriver extends ComponentDriver<typeof parts> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts,
    });
  }

  static override overriddenParentLocator(): Optional<PartLocator> {
    return menuRootLocator;
  }

  static override overrideLocatorRelativePosition(): Optional<LocatorRelativePosition> {
    return 'Same';
  }

  /**
   * Interiors resolve against the menu list, not this driver's own locator.
   * That locator is the portal-rendered Modal root (Menu builds on Popover,
   * which builds on Modal), whose direct children are the invisible backdrop
   * and MUI's focus-trap sentinels — so an un-narrowed interior reaches MUI
   * chrome the scene never wrote. Every child passed to `<Menu>` renders inside
   * the `role="menu"` list, which is therefore the tightest element still
   * holding all of it.
   */
  protected override get interiorLocator(): PartLocator {
    return this.parts.menu.locator;
  }

  async getMenuItemByLabel(label: string): Promise<MenuItemDriver | null> {
    for await (const item of listHelper.getListItemIterator(this, menuItemLocator, MenuItemDriver)) {
      const itemLabel = await item.label();
      if (itemLabel === label) {
        return item;
      }
    }
    return null;
  }

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
    return listHelper.getListItemCount(this, menuItemLocator);
  }

  /**
   * Get the menu item at the given zero-based index, or `null` if out of range.
   * Complements the existing label-based {@link getMenuItemByLabel}.
   */
  async getMenuItemByIndex(index: number): Promise<MenuItemDriver | null> {
    return listHelper.getListItemByIndex(this, menuItemLocator, index, MenuItemDriver);
  }

  get driverName(): string {
    return 'MuiV6MenuDriver';
  }
}
