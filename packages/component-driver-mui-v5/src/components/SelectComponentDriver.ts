import {
  ComponentDriver,
  defaultStep,
  IComponentDriverOption,
  IInputDriver,
  IInteractor,
  LocatorChain,
  LocatorRelativePosition,
  LocatorType,
  ScenePart,
  ScenePartDriver,
} from '@testzilla/core';

export const selectComponentPart: ScenePart = {
  trigger: {
    locator: '[role=button]',
    driver: ComponentDriver,
  },
  dropdown: {
    locator: {
      type: LocatorType.css,
      selector: '[role=presentation].MuiPopover-root [role=listbox].MuiList-root',
      relative: LocatorRelativePosition.documentRoot,
    },
    driver: ComponentDriver,
  },
  input: {
    locator: 'input.MuiSelect-nativeInput',
    driver: ComponentDriver,
  },
};

export type SelectComponentScenePart = typeof selectComponentPart;
export type SelectComponentScenePartDriver = ScenePartDriver<SelectComponentScenePart>;

export class SelectComponentDriver
  extends ComponentDriver<SelectComponentScenePart>
  implements IInputDriver<string | null>
{
  constructor(locator: LocatorChain, interactor: IInteractor, option?: IComponentDriverOption) {
    super(locator, interactor, {
      perform: defaultStep,
      ...option,
      parts: selectComponentPart,
    });
  }

  async getValue(): Promise<string | null> {
    await this.enforcePartExistence('input');
    const value = await this.interactor.getAttribute(this.parts.input.locator, 'value');
    return value ?? null;
  }

  async setValue(value: string | null): Promise<boolean> {
    let success = false;

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

    return Promise.resolve(success);
  }

  get driverName(): string {
    return 'MuiV5Select';
  }
}
