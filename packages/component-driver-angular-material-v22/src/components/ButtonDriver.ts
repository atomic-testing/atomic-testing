import { HTMLButtonDriver } from '@atomic-testing/component-driver-html';

/**
 * Driver for the Angular Material button (`MatButton`).
 *
 * Material's button directives (`matButton` and the legacy `mat-*-button`
 * selectors) attach to a native `<button>`/`<a>` host element, so this driver
 * inherits `click`, `getText` and the rest of its surface from
 * {@link HTMLButtonDriver}. It deliberately anchors nothing on the
 * `.mat-mdc-*` classes, which Angular documents as unstable implementation
 * details.
 *
 * @see https://material.angular.dev/components/button
 */
export class ButtonDriver extends HTMLButtonDriver {
  /**
   * Whether the button is disabled. A plain disabled Material button carries
   * the native `disabled` attribute; with `disabledInteractive` the button
   * stays focusable and signals its state via `aria-disabled="true"` instead.
   * Treat either as disabled.
   */
  override async isDisabled(): Promise<boolean> {
    if (await super.isDisabled()) {
      return true;
    }
    const ariaDisabled = await this.interactor.getAttribute(this.locator, 'aria-disabled');
    return ariaDisabled === 'true';
  }

  override get driverName(): string {
    return 'AngularMaterialV22ButtonDriver';
  }
}
