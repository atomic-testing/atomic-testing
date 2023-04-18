import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import {
  byRole,
  ComponentDriver,
  driverHelper,
  IComponentDriverOption,
  Interactor,
  LocatorChain,
  LocatorRelativePosition,
  Optional,
  PartLocatorType,
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

const menuRootLocator: PartLocatorType = byRole('presentation', LocatorRelativePosition.Root);
const menuItemLocator = byRole('menuitem');

export class MenuDriver extends ComponentDriver<typeof parts> {
  constructor(locator: LocatorChain, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts,
    });
  }

  override overriddenParentLocator(): Optional<LocatorChain> {
    return [menuRootLocator];
  }

  override overrideLocatorRelativePosition(): Optional<LocatorRelativePosition> {
    return LocatorRelativePosition.Same;
  }

  async getMenuItemByIndex(index: number): Promise<MenuItemDriver | null> {
    return driverHelper.getListItemByIndex(this, menuItemLocator, index, MenuItemDriver);
  }

  async getMenuItemByLabel(label: string): Promise<MenuItemDriver | null> {
    let index = 0;
    let item: MenuItemDriver | null = await this.getMenuItemByIndex(index);
    while (item != null) {
      const itemLabel = await item.label();
      if (itemLabel === label) {
        return item;
      }
      index++;
      item = await this.getMenuItemByIndex(index);
    }
    return null;
  }

  async selectByLabel(label: string): Promise<void> {
    const item = await this.getMenuItemByLabel(label);
    if (item) {
      await item.click();
    } else {
      throw new MenuItemNotFoundError(label);
    }
  }

  get driverName(): string {
    return 'MuiV5MenuDriver';
  }
}
