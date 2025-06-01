import {
  HTMLButtonDriver,
  HTMLElementDriver,
  HTMLSelectDriver,
  HTMLTextInputDriver,
} from '@atomic-testing/component-driver-html';
import {
  byAttribute,
  byCssSelector,
  byRole,
  byTagName,
  ComponentDriver,
  IComponentDriverOption,
  IInputDriver,
  Interactor,
  listHelper,
  LocatorRelativePosition,
  locatorUtil,
  Nullable,
  PartLocator,
  ScenePart,
  ScenePartDriver,
} from '@atomic-testing/core';

import { MenuItemNotFoundError } from '../errors/MenuItemNotFoundError';

import { MenuItemDriver } from './MenuItemDriver';

export const selectPart = {
  trigger: {
    locator: byRole('combobox'), // Starting in 5.12 and beyond, the role has changed from 'button' to 'combobox'
    driver: HTMLButtonDriver,
  },
  dropdown: {
    locator: byCssSelector('[role=presentation] [role=listbox]', LocatorRelativePosition.Root),
    driver: HTMLElementDriver,
  },
  input: {
    locator: byTagName('input'),
    driver: HTMLTextInputDriver,
  },
  nativeSelect: {
    locator: byTagName('select'),
    driver: HTMLSelectDriver,
  },
} satisfies ScenePart;

export type SelectScenePart = typeof selectPart;
export type SelectScenePartDriver = ScenePartDriver<SelectScenePart>;
export interface MenuItemGetOption {
  /**
   * When true, the driver will not check if the dropdown is open, which helps speed the process up.
   */
  skipDropdownCheck?: boolean;
}
const optionLocator = byRole('option');

export class SelectDriver extends ComponentDriver<SelectScenePart> implements IInputDriver<string | null> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
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

    await this.openDropdown();
    await this.enforcePartExistence('dropdown');
    const optionSelector = byAttribute('data-value', value!);
    const optionLocator = locatorUtil.append(this.parts.dropdown.locator, optionSelector);
    const optionExists = await this.interactor.exists(optionLocator);

    if (optionExists) {
      await this.interactor.click(optionLocator);
      success = true;
    }

    return success;
  }

  /**
   * Select menu item by its label, if it exists
   * Limitation, this method will not work if the dropdown is a native select.
   * @param label
   * @returns
   */
  async getMenuItemByLabel(label: string, option?: MenuItemGetOption): Promise<MenuItemDriver | null> {
    if (!option?.skipDropdownCheck) {
      await this.openDropdown();
    }

    // TODO: Add native select support

    for await (const item of listHelper.getListItemIterator(this, optionLocator, MenuItemDriver)) {
      const itemLabel = await item.label();
      if (itemLabel === label) {
        return item;
      }
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
    const item = await this.getMenuItemByLabel(label, { skipDropdownCheck: true });

    if (item) {
      await item.click();
    } else {
      throw new MenuItemNotFoundError(label, this);
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

  /**
   * Check if the dropdown is open, or if it is a native select, it is always open because there is no known way check its open state
   * @returns For native dropdown it is always true. For custom dropdown, it is true if the dropdown is open.
   */
  async isDropdownOpen(): Promise<boolean> {
    const isNative = await this.isNative();
    if (isNative) {
      return true;
    } else {
      return this.parts.dropdown.exists();
    }
  }

  async openDropdown(): Promise<void> {
    const isOpen = await this.isDropdownOpen();
    if (isOpen) {
      return;
    }
    await this.parts.trigger.click();
  }

  async closeDropdown(): Promise<void> {
    const isOpen = await this.isDropdownOpen();
    if (!isOpen) {
      return;
    }
    await this.parts.trigger.click();
  }

  async isDisabled(): Promise<boolean> {
    const isNative = await this.isNative();
    if (isNative) {
      return this.parts.nativeSelect.isDisabled();
    } else {
      await this.enforcePartExistence('trigger');
      const isDisabled = await this.interactor.getAttribute(this.parts.trigger.locator, 'aria-disabled');
      return isDisabled === 'true';
    }
  }

  async isReadonly(): Promise<boolean> {
    const isNative = await this.isNative();
    if (isNative) {
      return this.parts.nativeSelect.isReadonly();
    } else {
      // Cannot determine readonly state of a select input.
      return false;
    }
  }

  get driverName(): string {
    return 'MuiV7SelectDriver';
  }
}
