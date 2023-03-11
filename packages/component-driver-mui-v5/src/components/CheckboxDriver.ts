import { HTMLCheckboxDriver } from '@atomic-testing/component-driver-html';
import {
  byTagName,
  ComponentDriver,
  defaultStep,
  IComponentDriverOption,
  IFormFieldDriver,
  IInteractor,
  IToggleDriver,
  LocatorChain,
  ScenePart,
  ScenePartDriver,
} from '@atomic-testing/core';

export const checkboxPart = {
  checkbox: {
    locator: byTagName('input'),
    driver: HTMLCheckboxDriver,
  },
} satisfies ScenePart;

export type CheckboxScenePart = typeof checkboxPart;
export type CheckboxScenePartDriver = ScenePartDriver<CheckboxScenePart>;

export class CheckboxDriver
  extends ComponentDriver<CheckboxScenePart>
  implements IFormFieldDriver<string | null>, IToggleDriver
{
  constructor(locator: LocatorChain, interactor: IInteractor, option?: IComponentDriverOption) {
    super(locator, interactor, {
      perform: defaultStep,
      ...option,
      parts: checkboxPart,
    });
  }
  isSelected(): Promise<boolean> {
    return this.parts.checkbox.isSelected();
  }
  async setSelected(selected: boolean): Promise<void> {
    const isIndeterminate = await this.isIndeterminate();
    if (isIndeterminate && selected === false) {
      // if the checkbox is indeterminate and we want to set it to false, we need to click it twice
      // this is done through setting it to true first, then to false
      await this.parts.checkbox.setSelected(true);
    }

    await this.parts.checkbox.setSelected(selected);
  }

  getValue(): Promise<string | null> {
    return this.parts.checkbox.getValue();
  }

  async isIndeterminate(): Promise<boolean> {
    const indeterminate = await this.interactor.getAttribute(this.parts.checkbox.locator, 'data-indeterminate');
    return indeterminate === 'true';
  }

  isDisabled(): Promise<boolean> {
    return this.parts.checkbox.isDisabled();
  }

  isReadonly(): Promise<boolean> {
    return this.parts.checkbox.isReadonly();
  }

  get driverName(): string {
    return 'MuiV5SelectDriver';
  }
}
