import {
  HTMLButtonDriver,
  HTMLElementDriver,
  HTMLSelectDriver,
  HTMLTextInputDriver,
} from '@atomic-testing/component-driver-html';
import {
  byCssClass,
  byRole,
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
