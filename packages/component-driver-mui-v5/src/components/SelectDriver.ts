import {
  HTMLButtonDriver,
  HTMLElementDriver,
  HTMLSelectDriver,
  HTMLTextInputDriver,
} from '@atomic-testing/component-driver-html';
import {
  ComponentDriver,
  IComponentDriverOption,
  IInputDriver,
  Interactor,
  LocatorChain,
  LocatorRelativePosition,
  LocatorType,
  Nullable,
  PartLocatorType,
  ScenePart,
  ScenePartDriver,
  byCssClass,
  byRole,
  locatorUtil,
} from '@atomic-testing/core';

import { MenuItemNotFoundError } from '../errors/MenuItemNotFoundError';
import { MenuItemDriver } from './MenuItemDriver';

export const selectPart = {
  trigger: {
    locator: byRole('button'),
    driver: HTMLButtonDriver,
  },
  dropdown: {
    locator: {
      type: LocatorType.Css,
      selector: '[role=presentation].MuiPopover-root [role=listbox].MuiList-root',
      relative: LocatorRelativePosition.Root,
    },
    driver: HTMLElementDriver,
  },
  input: {
    locator: byCssClass('MuiSelect-nativeInput'),
    driver: HTMLTextInputDriver,
  },
  nativeSelect: {
    locator: byCssClass('MuiNativeSelect-select'),
    driver: HTMLSelectDriver,
  },
} satisfies ScenePart;

export type SelectScenePart = typeof selectPart;
export type SelectScenePartDriver = ScenePartDriver<SelectScenePart>;

export class SelectDriver extends ComponentDriver<SelectScenePart> implements IInputDriver<string | null> {
  constructor(locator: LocatorChain, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts: selectPart,
    });
  }
  async isNative(): Promise<boolean> {
    const nativeSelectExists = await this.interactor.exists(this.parts.nativeSelect.locator);
    return Promise.resolve(nativeSelectExists);
  }

  async getValue(): Promise<string | null> {
    const isNative = await this.isNative();
    if (isNative) {
      const val = (await this.parts.nativeSelect.getValue()) as Nullable<string>;
      return val;
    }

    await this.enforcePartExistence('input');
    const value = await this.parts.input.getValue();
    return value ?? null;
  }

  async setValue(value: string | null): Promise<boolean> {
    let success = false;
    const isNative = await this.isNative();
    if (isNative) {
      success = await this.parts.nativeSelect.setValue(value);
      return success;
    }

    await this.enforcePartExistence('trigger');
    await this.parts.trigger.click();

    await this.enforcePartExistence('dropdown');
    const optionSelector = `[data-value="${value}"]`;
    const optionLocator = this.parts.dropdown.locator.concat(optionSelector);
    const optionExists = await this.interactor.exists(optionLocator);

    if (optionExists) {
      await this.interactor.click(optionLocator);
      success = true;
    }

    return success;
  }

  async getMenuItemByLocator(itemLocator: PartLocatorType): Promise<MenuItemDriver | null> {
    const locator = locatorUtil.append(this.parts.dropdown.locator, itemLocator);
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
      selector: `[role=option]:nth-of-type(${index + 1})`,
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

  /**
   * Selects an option by its label
   * @param label
   * @returns
   */
  async selectByLabel(label: string): Promise<void> {
    const isNative = await this.isNative();
    if (isNative) {
      await this.parts.nativeSelect.selectByLabel(label);
      return;
    }

    await this.enforcePartExistence('trigger');
    await this.parts.trigger.click();

    await this.enforcePartExistence('dropdown');
    const item = await this.getMenuItemByLabel(label);

    if (item) {
      await item.click();
    } else {
      throw new MenuItemNotFoundError(label);
    }
  }

  async getSelectedLabel(): Promise<string | null> {
    const isNative = await this.isNative();
    if (isNative) {
      return await this.parts.nativeSelect.getSelectedLabel();
    }

    await this.enforcePartExistence('trigger');
    const label = await this.parts.trigger.getText();
    return label ?? null;
  }

  override async exists(): Promise<boolean> {
    const triggerExists = await this.interactor.exists(this.parts.trigger.locator);
    if (triggerExists) {
      return true;
    }

    const nativeExists = await this.interactor.exists(this.parts.nativeSelect.locator);
    return nativeExists;
  }

  async isDisabled(): Promise<boolean> {
    const isNative = await this.isNative();
    if (isNative) {
      return this.parts.nativeSelect.isDisabled();
    } else {
      await this.enforcePartExistence('trigger');
      const isDisabled = await this.interactor.hasCssClass(this.parts.trigger.locator, 'Mui-disabled');
      return isDisabled;
    }
  }

  async isReadonly(): Promise<boolean> {
    const isNative = await this.isNative();
    if (isNative) {
      return this.parts.nativeSelect.isReadonly();
    } else {
      // Cannot deterimine readonly state of a select input.
      return false;
    }
  }

  get driverName(): string {
    return 'MuiV5SelectDriver';
  }
}
