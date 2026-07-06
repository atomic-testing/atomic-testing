import {
  ComponentDriver,
  IDisableableDriver,
  IFormFieldDriver,
  IRequirableDriver,
  IToggleDriver,
  Optional,
} from '@atomic-testing/core';

import { resolveLinkedLabelText } from '../internal/linkedLocators';

/**
 * Driver for the Radix Checkbox primitive (`Checkbox.Root` from `radix-ui`).
 *
 * Unlike a native checkbox, Radix renders a `<button role="checkbox">` (no
 * `<input>` in the DOM) carrying `aria-checked` (`true`/`false`/`mixed`),
 * mirrored by `data-state` (`checked`/`unchecked`/`indeterminate`) — the
 * portable read, consistent with `SeparatorDriver`'s precedent of reading
 * Radix's always-present `data-*` state attribute. Because there is no native
 * input, `Interactor.isChecked` (native-input only) does not apply, and there
 * is no `readOnly` concept to report (Radix's Checkbox has no such prop), so
 * this driver does not implement `IReadonlyableDriver`.
 *
 * Clicking an indeterminate checkbox always lands on `checked` (Radix treats
 * `indeterminate` as the "off" side of its internal toggle), so driving to
 * `unchecked` from indeterminate needs two clicks — the same two-step dance
 * `CheckboxDriver` in `component-driver-mui-v7` uses.
 */
export class CheckboxDriver
  extends ComponentDriver<{}>
  implements IFormFieldDriver<string | null>, IToggleDriver, IDisableableDriver, IRequirableDriver
{
  async isSelected(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'data-state')) === 'checked';
  }

  /** Whether the checkbox is in the tri-state `indeterminate` state. */
  async isIndeterminate(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'data-state')) === 'indeterminate';
  }

  async setSelected(selected: boolean): Promise<void> {
    if ((await this.isIndeterminate()) && !selected) {
      // indeterminate -> checked is Radix's only click outcome from indeterminate;
      // reaching unchecked needs a second click from there.
      await this.interactor.click(this.locator);
    }
    if ((await this.isSelected()) !== selected) {
      await this.interactor.click(this.locator);
    }
  }

  /** The `value` attribute (Radix defaults it to `"on"`, mirroring a native checkbox). */
  async getValue(): Promise<string | null> {
    return (await this.interactor.getAttribute(this.locator, 'value')) ?? null;
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
    return 'RadixV1CheckboxDriver';
  }
}
