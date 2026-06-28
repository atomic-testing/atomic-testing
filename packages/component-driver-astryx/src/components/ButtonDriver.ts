import { HTMLButtonDriver } from '@atomic-testing/component-driver-html';
import { Optional } from '@atomic-testing/core';

/**
 * Driver for the Astryx Button (`@astryxdesign/core`).
 *
 * Astryx renders Button as a native `<button>` (an `<a>` only when `href` is
 * set), so the stable DOM anchor is the element's `data-testid` (Astryx
 * forwards unknown props onto the root) or its `role` + accessible name — never
 * the StyleX-hashed class names. The scene supplies the locator; this driver is
 * locator-agnostic and inherits `click` from {@link HTMLButtonDriver}.
 *
 * @see https://github.com/facebook/astryx (package: `@astryxdesign/core`)
 */
export class ButtonDriver extends HTMLButtonDriver {
  /**
   * The button's accessible name.
   *
   * Astryx shows `label` as visible text by default and only emits an explicit
   * `aria-label` for the icon-only / loading / `children`-differ-from-`label`
   * cases. This returns the verbatim `aria-label` when present, otherwise the
   * visible text. It is a deliberate stopgap — NOT the full accessible-name
   * algorithm (`aria-labelledby` / associated `<label>` resolution is the
   * deferred name-aware `findByRole`, per #909).
   */
  async getLabel(): Promise<Optional<string>> {
    const ariaLabel = await this.interactor.getAttribute(this.locator, 'aria-label');
    return ariaLabel ?? this.getText();
  }

  /**
   * Whether the button is disabled.
   *
   * Astryx disables via the native `disabled` attribute, except when a `tooltip`
   * is set — then it keeps the button focusable and signals state with
   * `aria-disabled="true"` instead. Treat either as disabled.
   */
  override async isDisabled(): Promise<boolean> {
    if (await super.isDisabled()) {
      return true;
    }
    const ariaDisabled = await this.interactor.getAttribute(this.locator, 'aria-disabled');
    return ariaDisabled === 'true';
  }

  override get driverName(): string {
    return 'AstryxButtonDriver';
  }
}
