import {
  byCssSelector,
  ComponentDriver,
  IClickableDriver,
  IDisableableDriver,
  locatorUtil,
  Optional,
} from '@atomic-testing/core';

/**
 * Driver for the PrimeVue `Button` component.
 *
 * DOM audit (primevue@4.5.5): renders a native `<button data-pc-name="button">`
 * carrying the real `disabled` attribute when disabled, so `isDisabled`/`click`
 * ride the native semantics. The visible label is a child
 * `<span data-pc-section="label">`; add-ons such as a badge render as sibling
 * spans inside the same button, so a whole-root `getText()` would concatenate
 * them (`"Hello2"` for a badge of `2`) — {@link getLabel} therefore reads only
 * the label section, PrimeVue's own structural marker for it.
 */
export class ButtonDriver extends ComponentDriver<{}> implements IClickableDriver, IDisableableDriver {
  /**
   * The button's visible label (the `data-pc-section="label"` span), excluding
   * add-ons such as a badge, or `undefined` when the button renders no label
   * (icon-only buttons).
   */
  async getLabel(): Promise<Optional<string>> {
    const labelLocator = locatorUtil.append(this.locator, byCssSelector('[data-pc-section="label"]'));
    if (!(await this.interactor.exists(labelLocator))) {
      return undefined;
    }
    return (await this.interactor.getText(labelLocator))?.trim();
  }

  /** Whether the button is disabled (native `disabled` attribute). */
  isDisabled(): Promise<boolean> {
    return this.interactor.isDisabled(this.locator);
  }

  get driverName(): string {
    return 'PrimeVueV4ButtonDriver';
  }
}
