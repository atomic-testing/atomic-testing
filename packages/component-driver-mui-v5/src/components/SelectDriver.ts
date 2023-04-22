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
  ScenePart,
  ScenePartDriver,
  byAttribute,
  byRole,
  byTagName,
  listHelper,
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
      selector: '[role=presentation] [role=listbox]',
      relative: LocatorRelativePosition.Root,
    },
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
const optionLocator = byRole('option');

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
    const optionSelector = byAttribute('data-value', value!);
    const optionLocator = locatorUtil.append(this.parts.dropdown.locator, optionSelector);
    const optionExists = await this.interactor.exists(optionLocator);

    if (optionExists) {
      await this.interactor.click(optionLocator);
      success = true;
    }

    return success;
  }

  async getMenuItemByLabel(label: string): Promise<MenuItemDriver | null> {
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
    const item = await this.getMenuItemByLabel(label);

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
    return 'MuiV5SelectDriver';
  }
}
