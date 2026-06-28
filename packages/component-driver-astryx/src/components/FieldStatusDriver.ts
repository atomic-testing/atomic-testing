import { ComponentDriver, Optional } from '@atomic-testing/core';

/**
 * Driver for the Astryx FieldStatus (`@astryxdesign/core/FieldStatus`) — the
 * standalone validation-message element.
 *
 * FieldStatus renders a single `<div>` whose `role` is CONDITIONAL — `"alert"`
 * (assertive) for `type="error"`, `"status"` (polite) otherwise — while the
 * stable severity always lives in `data-type`. It forwards `data-testid` onto the
 * root, so the scene anchors there and reads severity from `data-type` rather
 * than the shifting role.
 */
export class FieldStatusDriver extends ComponentDriver<{}> {
  /** The severity (`data-type`): `'error'`, `'warning'`, or `'success'`. */
  async getStatus(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'data-type');
  }

  /** The message text. */
  async getMessage(): Promise<Optional<string>> {
    return (await this.getText()) ?? undefined;
  }

  /** Whether the status is an error (`data-type="error"`, rendered with `role="alert"`). */
  async isError(): Promise<boolean> {
    return (await this.getStatus()) === 'error';
  }

  get driverName(): string {
    return 'AstryxFieldStatusDriver';
  }
}
