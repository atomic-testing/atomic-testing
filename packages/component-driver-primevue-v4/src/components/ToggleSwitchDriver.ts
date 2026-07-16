import {
  byInputType,
  ComponentDriver,
  IDisableableDriver,
  IToggleDriver,
  locatorUtil,
  PartLocator,
} from '@atomic-testing/core';

/**
 * Driver for the PrimeVue `ToggleSwitch` component (the v4 rename of
 * `InputSwitch`).
 *
 * DOM audit (primevue@4.5.5): the root is a styled
 * `<div data-pc-name="toggleswitch" data-p-checked>` wrapping a REAL (visually
 * hidden) native `<input type="checkbox" role="switch" aria-checked>`. Of the
 * two candidate reads — the wrapper's `data-p-checked` mirror vs the native
 * input — the native input's live `checked` property (`Interactor.isChecked`)
 * is the more portable choice: it is the form-submission ground truth the
 * `aria-checked`/`data-p-checked` mirrors are derived from, and it is the same
 * read every native-input-backed driver in this package uses (Checkbox,
 * RadioButton), so one convention covers all three. Clicks land on the input,
 * the element PrimeVue sizes over the styled slider as the real hit target.
 */
export class ToggleSwitchDriver extends ComponentDriver<{}> implements IToggleDriver, IDisableableDriver {
  private get inputLocator(): PartLocator {
    return locatorUtil.append(this.locator, byInputType('checkbox'));
  }

  /** Whether the switch is on (native input `checked` property). */
  isSelected(): Promise<boolean> {
    return this.interactor.isChecked(this.inputLocator);
  }

  /**
   * No-ops on a disabled switch rather than clicking it regardless: under
   * jsdom, `userEvent.click` already silently skips a disabled native
   * `<input>`, but `PlaywrightInteractor.click`'s actionability check instead
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
    await this.interactor.click(this.inputLocator);
  }

  /** Whether the switch is disabled (native `disabled` attribute on the input). */
  isDisabled(): Promise<boolean> {
    return this.interactor.isDisabled(this.inputLocator);
  }

  get driverName(): string {
    return 'PrimeVueV4ToggleSwitchDriver';
  }
}
