import { HTMLCheckboxDriver } from '@atomic-testing/component-driver-html';
import {
  byTagName,
  ComponentDriver,
  IComponentDriverOption,
  IFormFieldDriver,
  Interactor,
  IToggleDriver,
  PartLocator,
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
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts: checkboxPart,
    });
  }
  /**
   * Check whether the checkbox is currently selected.
   */
  isSelected(): Promise<boolean> {
    return this.parts.checkbox.isSelected();
  }
  /**
   * Change the selected state of the checkbox, handling the
   * indeterminate state when necessary.
   */
  async setSelected(selected: boolean): Promise<void> {
    const isIndeterminate = await this.isIndeterminate();
    if (isIndeterminate && selected === false) {
      // if the checkbox is indeterminate and we want to set it to false, we need to click it twice
      // this is done through setting it to true first, then to false
      await this.parts.checkbox.setSelected(true);
    }

    await this.parts.checkbox.setSelected(selected);
  }

  /**
   * Retrieve the value attribute from the underlying input.
   */
  getValue(): Promise<string | null> {
    return this.parts.checkbox.getValue();
  }

  /**
   * Check if the checkbox is in the indeterminate state.
   */
  async isIndeterminate(): Promise<boolean> {
    const indeterminate = await this.interactor.getAttribute(this.parts.checkbox.locator, 'data-indeterminate');
    return indeterminate === 'true';
  }

  /**
   * Determine whether the checkbox is disabled.
   */
  isDisabled(): Promise<boolean> {
    return this.parts.checkbox.isDisabled();
  }

  /**
   * Determine whether the checkbox is read only.
   */
  isReadonly(): Promise<boolean> {
    return this.parts.checkbox.isReadonly();
  }

  /**
   * Identifier for this driver.
   */
  get driverName(): string {
    return 'MuiV5SelectDriver';
  }
}
