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
 * Driver for the Reka UI Switch primitive (`SwitchRoot` from `reka-ui`).
 *
 * DOM audit (reka-ui@2.10.1, SSR-rendered): byte-for-byte the same contract as
 * `component-driver-radix-v1`'s `SwitchDriver` — `<button role="switch"
 * type="button" value="on" aria-checked aria-required data-state="checked"/
 * "unchecked" data-disabled disabled>` (no native `<input>` in the DOM; a
 * hidden `VisuallyHiddenInput` mirrors state for native form submission only
 * when `name` is set, verified NOT to change the root's own attributes). No
 * tri-state, so `IReadonlyableDriver` is intentionally not implemented,
 * mirroring the Radix/MUI precedent this class doc's exemplar records.
 */
export class SwitchDriver
  extends ComponentDriver<{}>
  implements IFormFieldDriver<string | null>, IToggleDriver, IDisableableDriver, IRequirableDriver
{
  async isSelected(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'data-state')) === 'checked';
  }

  /**
   * No-ops on a disabled switch rather than clicking it regardless: under
   * jsdom, `userEvent.click` already silently skips a disabled native
   * `<button>`, but `PlaywrightInteractor.click`'s actionability check instead
   * retries "is enabled" until the click's own timeout — indistinguishable
   * from a hang for a control that can never become enabled. Checking
   * {@link isDisabled} first keeps the no-op behavior identical across every
   * `Interactor`.
   */
  async setSelected(selected: boolean): Promise<void> {
    if ((await this.isSelected()) === selected) {
      return;
    }
    if (await this.isDisabled()) {
      return;
    }
    await this.interactor.click(this.locator);
  }

  /** The `value` attribute (Reka defaults it to `"on"`, verified rendered on this control's own root — unlike its Checkbox sibling). */
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
   * The text of the `<label for>` linked to this switch via its `id`, or
   * `undefined` when the switch has no id / no matching label.
   */
  async getLabel(): Promise<Optional<string>> {
    return resolveLinkedLabelText(this.interactor, this.locator);
  }

  get driverName(): string {
    return 'RekaUiV2SwitchDriver';
  }
}
