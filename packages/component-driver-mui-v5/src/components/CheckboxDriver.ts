import { HTMLCheckboxDriver } from '@atomic-testing/component-driver-html';
import {
  ComponentDriver,
  defaultStep,
  IComponentDriverOption,
  IFormFieldDriver,
  IInteractor,
  IToggleDriver,
  LocatorChain,
  LocatorType,
  ScenePart,
  ScenePartDriver,
} from '@atomic-testing/core';

export const checkboxPart = {
  checkbox: {
    locator: {
      type: LocatorType.Css,
      selector: 'input',
    },
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
  setSelected(selected: boolean): Promise<void> {
    return this.parts.checkbox.setSelected(selected);
  }

  getValue(): Promise<string | null> {
    return this.parts.checkbox.getValue();
  }

  async isIndeterminate(): Promise<boolean> {
    const indeterminate = await this.interactor.getAttribute(this.parts.checkbox.locator, 'data-indeterminate');
    return indeterminate === 'true';
  }

  get driverName(): string {
    return 'MuiV5SelectDriver';
  }
}
