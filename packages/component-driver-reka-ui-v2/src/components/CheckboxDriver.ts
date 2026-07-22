import { ComponentDriver, IDisableableDriver, IRequirableDriver, IToggleDriver, Optional } from '@atomic-testing/core';

import { resolveLinkedLabelText } from '../internal/linkedLocators';

/**
 * Driver for the Reka UI Checkbox primitive (`CheckboxRoot` from `reka-ui`).
 *
 * DOM audit (reka-ui@2.10.1, SSR-rendered): `<button role="checkbox"
 * type="button" aria-checked="true"/"false"/"mixed" aria-required
 * data-state="checked"/"unchecked"/"indeterminate">` (no native `<input>`) —
 * matches `component-driver-radix-v1`'s `CheckboxDriver` contract for every
 * attribute EXCEPT ONE confirmed delta: Reka's `CheckboxRoot` does NOT forward
 * a `value` attribute onto its root element at all (Radix's does, per that
 * driver's `getValue`) — verified by rendering both `checked`/`unchecked` and
 * comparing the emitted attribute list. This driver therefore does not
 * implement `IFormFieldDriver`/expose `getValue`; there is no DOM-portable
 * value to read. (Reka's `SwitchDriver` sibling DOES get a `value` — that
 * primitive's root explicitly forwards it — so this is a genuine per-component
 * difference, not a package-wide one.)
 *
 * Clicking an indeterminate checkbox always lands on `checked` (same
 * two-click dance from indeterminate to unchecked that Radix's driver
 * documents; Reka's `handleClick` treats `'indeterminate'` as `modelValue`
 * identically).
 */
export class CheckboxDriver
  extends ComponentDriver<{}>
  implements IToggleDriver, IDisableableDriver, IRequirableDriver
{
  async isSelected(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'data-state')) === 'checked';
  }

  /** Whether the checkbox is in the tri-state `indeterminate` state. */
  async isIndeterminate(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'data-state')) === 'indeterminate';
  }

  /**
   * No-ops entirely on a disabled checkbox rather than clicking it regardless
   * — see `SwitchDriver.setSelected` for why.
   */
  async setSelected(selected: boolean): Promise<void> {
    if (await this.isDisabled()) {
      return;
    }
    if ((await this.isIndeterminate()) && !selected) {
      // indeterminate -> checked is Reka's only click outcome from indeterminate;
      // reaching unchecked needs a second click from there.
      await this.interactor.click(this.locator);
    }
    if ((await this.isSelected()) !== selected) {
      await this.interactor.click(this.locator);
    }
  }

  isDisabled(): Promise<boolean> {
    return this.interactor.isDisabled(this.locator);
  }

  async isRequired(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-required')) === 'true';
  }

  /**
   * The text of the `<label for>` linked to this checkbox via its `id`, or
   * `undefined` when the checkbox has no id / no matching label.
   */
  async getLabel(): Promise<Optional<string>> {
    return resolveLinkedLabelText(this.interactor, this.locator);
  }

  get driverName(): string {
    return 'RekaUiV2CheckboxDriver';
  }
}
