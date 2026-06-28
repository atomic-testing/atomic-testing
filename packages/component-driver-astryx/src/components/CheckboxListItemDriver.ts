import { byInputType, byTagName, ComponentDriver, locatorUtil, Optional } from '@atomic-testing/core';

/**
 * Driver for a single Astryx CheckboxList row (`<li>`).
 *
 * Each row is a `<li aria-checked>` containing the native `<input type="checkbox">`
 * and a `<button>` whose text is the row's visible label. The item's identity is
 * NOT emitted as a DOM value (it is a React key), so rows are addressed by label
 * text or index — this driver exposes both the label and the checked state.
 */
export class CheckboxListItemDriver extends ComponentDriver<{}> {
  /** The row's visible label (the row button's text). */
  async getLabel(): Promise<Optional<string>> {
    const button = locatorUtil.append(this.locator, byTagName('button'));
    if (await this.interactor.exists(button)) {
      return (await this.interactor.getText(button)) ?? undefined;
    }
    return (await this.getText()) ?? undefined;
  }

  /** Whether the row is checked (`aria-checked="true"` on the `<li>`). */
  async isChecked(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-checked')) === 'true';
  }

  /** Toggle the row by clicking its checkbox. */
  async toggle(): Promise<void> {
    await this.interactor.click(locatorUtil.append(this.locator, byInputType('checkbox')));
  }

  get driverName(): string {
    return 'AstryxCheckboxListItemDriver';
  }
}
