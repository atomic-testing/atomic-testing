import {
  byChecked,
  byInputType,
  byValue,
  ComponentDriver,
  IInputDriver,
  locatorUtil,
  Optional,
  PartLocator,
} from '@atomic-testing/core';

import { resolveLinkedLabelText } from '../internal/linkedLocators';

/**
 * Driver for the Angular Material radio group (`MatRadioGroup`).
 *
 * Locate it by the `<mat-radio-group>` host element (the element carrying
 * `role="radiogroup"`). The group's value is read from and written through the
 * native `<input type="radio">` controls Material renders inside each
 * `<mat-radio-button>` — the group host itself carries no value attribute.
 *
 * For per-button state (label, disabled, selected) use
 * {@link RadioButtonDriver} on the individual `<mat-radio-button>` hosts.
 *
 * @see https://material.angular.dev/components/radio
 */
export class RadioGroupDriver extends ComponentDriver<{}> implements IInputDriver<string | null> {
  private get checkedInputLocator(): PartLocator {
    return locatorUtil.append(this.locator, byInputType('radio'), byChecked(true));
  }

  /**
   * The `value` attribute of the currently selected radio button, or `null`
   * when no button is selected.
   */
  async getValue(): Promise<string | null> {
    if (!(await this.interactor.exists(this.checkedInputLocator))) {
      return null;
    }
    return (await this.interactor.getAttribute(this.checkedInputLocator, 'value')) ?? null;
  }

  /**
   * Select the radio button whose `value` attribute equals `value` by clicking
   * its native input (Material forwards each button's `value` input to the
   * native control).
   *
   * @param value Value of the radio button to select.
   */
  async setValue(value: string | null): Promise<boolean> {
    if (value == null) {
      throw new Error('Cannot deselect a radio group - use setValue with a valid value instead');
    }
    const targetLocator = locatorUtil.append(this.locator, byInputType('radio'), byValue(value, 'Same'));
    await this.interactor.click(targetLocator);
    return true;
  }

  /**
   * The label text of the currently selected radio button, or `undefined` when
   * no button is selected (or the selected one has no label). Resolved through
   * the native `<label for>`↔`id` association.
   */
  async getSelectedLabel(): Promise<Optional<string>> {
    if (!(await this.interactor.exists(this.checkedInputLocator))) {
      return undefined;
    }
    return resolveLinkedLabelText(this.interactor, this.checkedInputLocator);
  }

  get driverName(): string {
    return 'AngularMaterialV21RadioGroupDriver';
  }
}
