import { byCssSelector, ComponentDriver, locatorUtil, Optional } from '@atomic-testing/core';

const dismissButton = byCssSelector('[aria-label="Dismiss notification"]');

/**
 * Driver for the Astryx Toast (`@astryxdesign/core/Toast`).
 *
 * Toast does not forward `data-testid`, and its `role` is conditional —
 * `role="alert"` (with `aria-live="assertive"`) for an error, `role="status"`
 * (`aria-live="polite"`) otherwise — so neither makes a stable anchor. The stable,
 * role-independent type signal is `data-type` on the root, which also carries the
 * `astryx-toast` semantic class the scene anchors on. `getType` therefore reads
 * `data-type` rather than inferring from the role.
 *
 * In jsdom the toast is always mounted, so structure and these attributes read
 * faithfully; the surrounding `ToastViewport` is a native popover whose true
 * top-layer visibility and auto-hide timing are only meaningful in the E2E run.
 */
export class ToastDriver extends ComponentDriver {
  /** The toast's type (`data-type`), e.g. `'info'`/`'success'`/`'warning'`/`'error'`. */
  async getType(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'data-type');
  }

  /** Whether the toast is an error toast (`data-type="error"`, rendered with `role="alert"`). */
  async isError(): Promise<boolean> {
    return (await this.getType()) === 'error';
  }

  /** The toast's ARIA role — `'alert'` for errors, else `'status'`. */
  async getRole(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'role');
  }

  /** The toast's body text. The dismiss button is icon-only, so the root text is the message. */
  async getMessage(): Promise<Optional<string>> {
    return (await this.getText()) ?? undefined;
  }

  /**
   * Click the dismiss button (`aria-label="Dismiss notification"`), firing the
   * toast's `onDismiss`. The toast unmounts only if the consumer removes it in
   * response, so the caller observes that, not the driver.
   */
  async dismiss(): Promise<void> {
    await this.interactor.click(locatorUtil.append(this.locator, dismissButton));
  }

  override get driverName(): string {
    return 'AstryxToastDriver';
  }
}
