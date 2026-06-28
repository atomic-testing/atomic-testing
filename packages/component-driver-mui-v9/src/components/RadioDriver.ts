import { byCssSelector, ComponentDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

// The radio `<input>` carries checked/value/disabled; located as a descendant of
// this option's FormControlLabel root.
const inputLocator: PartLocator = byCssSelector('input');
const checkedInputLocator: PartLocator = byCssSelector('input:checked');

/**
 * Driver for a single Material UI v9 Radio option (a `FormControlLabel` wrapping a
 * `Radio`). Its label text is the `FormControlLabel`'s text; selected/value/disabled
 * state is read from the underlying radio `<input>`.
 *
 * Used as the item driver of {@link RadioGroupDriver}, but also usable on its own
 * when a single radio option is addressed directly. It declares no parts (so it
 * composes as a list item) and reads the input via descendant locators.
 * @see https://mui.com/material-ui/react-radio-button/
 */
export class RadioDriver extends ComponentDriver {
  private get input(): PartLocator {
    return locatorUtil.append(this.locator, inputLocator);
  }

  /**
   * The option's visible label, or `undefined` when it renders without text.
   */
  async getLabel(): Promise<Optional<string>> {
    const text = await this.getText();
    return text?.trim() || undefined;
  }

  /**
   * The option's `value` attribute.
   */
  async getValue(): Promise<string | null> {
    const value = await this.interactor.getAttribute(this.input, 'value');
    return value ?? null;
  }

  /**
   * Whether this option is the selected one in its group.
   */
  isSelected(): Promise<boolean> {
    return this.interactor.exists(locatorUtil.append(this.locator, checkedInputLocator));
  }

  /**
   * Whether this option is disabled.
   */
  isDisabled(): Promise<boolean> {
    return this.interactor.isDisabled(this.input);
  }

  /**
   * Select this option by clicking its radio input. No-op effect when already selected.
   */
  async select(): Promise<void> {
    await this.interactor.click(this.input);
  }

  get driverName(): string {
    return 'MuiV9RadioDriver';
  }
}
