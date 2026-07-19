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
 * Driver for the Radix Switch primitive (`Switch.Root` from `radix-ui`).
 *
 * Renders `<button role="switch">` (no native `<input>`) carrying
 * `aria-checked`/`data-state` (`checked`/`unchecked`) — same DOM shape and
 * read strategy as `CheckboxDriver`, minus the indeterminate state (Switch has
 * no tri-state). No `readOnly` concept exists on Radix's Switch either, so
 * `IReadonlyableDriver` is intentionally not implemented (mirrors the MUI v7
 * `SwitchDriver` comment on the same gap).
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

  /** The `value` attribute (Radix defaults it to `"on"`). */
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
    return 'RadixV1SwitchDriver';
  }
}
