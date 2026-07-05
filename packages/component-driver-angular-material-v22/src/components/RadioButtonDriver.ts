import {
  byInputType,
  ComponentDriver,
  IDisableableDriver,
  IFormFieldDriver,
  IRequirableDriver,
  locatorUtil,
  Optional,
  PartLocator,
} from '@atomic-testing/core';

import { resolveLinkedLabelText } from '../internal/linkedLocators';

/**
 * Driver for a single Angular Material radio button (`MatRadioButton`).
 *
 * Locate it by the `<mat-radio-button>` host element; the driver reaches the
 * native `<input type="radio">` inside it (the element with the implicit
 * `radio` role), which carries the checked/disabled/required state and the
 * `value` attribute.
 *
 * Intentionally not an `IToggleDriver`: a radio button cannot be toggled off —
 * selecting a sibling deselects it — so only `isSelected`/`select` are exposed.
 * For value-level selection use {@link RadioGroupDriver} on the enclosing
 * `<mat-radio-group>`.
 *
 * @see https://material.angular.dev/components/radio
 */
export class RadioButtonDriver
  extends ComponentDriver<{}>
  implements IFormFieldDriver<string | null>, IDisableableDriver, IRequirableDriver
{
  private get inputLocator(): PartLocator {
    return locatorUtil.append(this.locator, byInputType('radio'));
  }

  /**
   * Whether this radio button is the selected one in its group.
   */
  isSelected(): Promise<boolean> {
    return this.interactor.isChecked(this.inputLocator);
  }

  /**
   * Select this radio button by clicking its native input. A selected radio
   * button cannot be toggled off, so this is a no-op when already selected.
   */
  async select(): Promise<void> {
    if (!(await this.isSelected())) {
      await this.interactor.click(this.inputLocator);
    }
  }

  /**
   * The radio button's `value` attribute (Material forwards its `value` input
   * to the native control), or `null` when none is set.
   */
  async getValue(): Promise<string | null> {
    return (await this.interactor.getAttribute(this.inputLocator, 'value')) ?? null;
  }

  /**
   * Whether the radio button is disabled. A plain disabled radio carries the
   * native `disabled` attribute; with `disabledInteractive` the input stays
   * focusable and signals its state via `aria-disabled="true"` instead. Treat
   * either as disabled.
   */
  async isDisabled(): Promise<boolean> {
    if (await this.interactor.isDisabled(this.inputLocator)) {
      return true;
    }
    return (await this.interactor.getAttribute(this.inputLocator, 'aria-disabled')) === 'true';
  }

  /**
   * Whether the radio button is required (Material reflects the group's
   * `required` state onto each native control).
   */
  isRequired(): Promise<boolean> {
    return this.interactor.isRequired(this.inputLocator);
  }

  /**
   * The text of the radio button's label, or `undefined` when it has no label
   * content. Material associates the label with the native input via
   * `<label for>`↔`id`, so the driver resolves that link rather than assuming
   * a DOM shape.
   */
  getLabel(): Promise<Optional<string>> {
    return resolveLinkedLabelText(this.interactor, this.inputLocator);
  }

  get driverName(): string {
    return 'AngularMaterialV22RadioButtonDriver';
  }
}
