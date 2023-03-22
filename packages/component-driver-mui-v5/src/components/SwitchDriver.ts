import { HTMLCheckboxDriver } from '@atomic-testing/component-driver-html';
import {
  byCssClass,
  ComponentDriver,
  IComponentDriverOption,
  IFormFieldDriver,
  IInteractor,
  IToggleDriver,
  LocatorChain,
  ScenePart,
} from '@atomic-testing/core';

export const parts = {
  input: {
    locator: byCssClass('MuiSwitch-input'),
    driver: HTMLCheckboxDriver,
  },
} satisfies ScenePart;

export class SwitchDriver
  extends ComponentDriver<typeof parts>
  implements IFormFieldDriver<string | null>, IToggleDriver
{
  constructor(locator: LocatorChain, interactor: IInteractor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts,
    });
  }

  override async exists(): Promise<boolean> {
    return this.interactor.exists(this.parts.input.locator);
  }

  async isSelected(): Promise<boolean> {
    await this.enforcePartExistence('input');
    return this.parts.input.isSelected();
  }
  async setSelected(selected: boolean): Promise<void> {
    await this.enforcePartExistence('input');
    await this.parts.input.setSelected(selected);
  }

  async getValue(): Promise<string | null> {
    await this.enforcePartExistence('input');
    return this.parts.input.getValue();
  }

  async isDisabled(): Promise<boolean> {
    await this.enforcePartExistence('input');
    return this.parts.input.isDisabled();
  }

  async isReadonly(): Promise<boolean> {
    // MUI v5 does not have a readonly state for the switch
    return Promise.resolve(false);
  }

  get driverName(): string {
    return 'MuiV5SwitchDriver';
  }
}
