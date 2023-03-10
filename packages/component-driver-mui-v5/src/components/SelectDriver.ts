import {
  HTMLButtonDriver,
  HTMLElementDriver,
  HTMLSelectDriver,
  HTMLTextInputDriver,
} from '@atomic-testing/component-driver-html';
import {
  byCssClass,
  ComponentDriver,
  IComponentDriverOption,
  IInputDriver,
  IInteractor,
  LocatorChain,
  LocatorRelativePosition,
  LocatorType,
  Nullable,
  ScenePart,
  ScenePartDriver,
} from '@atomic-testing/core';

export const selectPart = {
  trigger: {
    locator: '[role=button]',
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
    locator: 'input.MuiSelect-nativeInput',
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
  constructor(locator: LocatorChain, interactor: IInteractor, option?: Partial<IComponentDriverOption>) {
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

  async exists(): Promise<boolean> {
    const triggerExists = await this.interactor.exists(this.parts.trigger.locator);
    if (triggerExists) {
      return true;
    }

    const nativeExists = await this.interactor.exists(this.parts.nativeSelect.locator);
    return nativeExists;
  }

  get driverName(): string {
    return 'MuiV5SelectDriver';
  }
}
