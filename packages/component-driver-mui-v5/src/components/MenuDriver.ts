import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import {
  byRole,
  ComponentDriver,
  IComponentDriverOption,
  Interactor,
  LocatorChain,
  LocatorRelativePosition,
  LocatorType,
  locatorUtil,
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

  async getMenuItemByLocator(itemLocator: PartLocatorType): Promise<MenuItemDriver | null> {
    const locator = locatorUtil.append(this.parts.menu.locator, itemLocator);
    const exists = await this.interactor.exists(locator);
    if (exists) {
      return new MenuItemDriver(locator, this.interactor);
    } else {
      return null;
    }
  }

  async getMenuItemByIndex(index: number): Promise<MenuItemDriver | null> {
    const itemLocator: PartLocatorType = {
      type: LocatorType.Css,
      selector: `[role=menuitem]:nth-of-type(${index + 1})`,
    };
    return this.getMenuItemByLocator(itemLocator);
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
