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

  override overriddenParentLocator(): Optional<PartLocator> {
    return menuRootLocator;
  }

  override overrideLocatorRelativePosition(): Optional<LocatorRelativePosition> {
    return 'Same';
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

  get driverName(): string {
    return 'MuiV6MenuDriver';
  }
}
