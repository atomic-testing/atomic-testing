import { ComponentDriver, Optional } from '@atomic-testing/core';

/**
 * Driver for the Astryx StatusDot (`@astryxdesign/core/StatusDot`) — a small
 * presence/severity indicator.
 *
 * StatusDot renders a single leaf `<span role="img">`; the `label` prop becomes
 * the verbatim `aria-label` (its accessible name) and the severity lives in
 * `data-variant`. It forwards `data-testid` onto that root, so the scene anchors
 * there and reads both relationships directly off the element. The hover tooltip
 * is presentational and E2E-only.
 */
export class StatusDotDriver extends ComponentDriver<{}> {
  /** The accessible label — the verbatim `aria-label` (from the `label` prop). */
  async getLabel(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'aria-label');
  }

  /** The severity (`data-variant`): `'success'`, `'warning'`, `'error'`, … */
  async getVariant(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'data-variant');
  }

  /** Whether the dot is rendered. */
  async isPresent(): Promise<boolean> {
    return this.exists();
  }

  get driverName(): string {
    return 'AstryxStatusDotDriver';
  }
}
