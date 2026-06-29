import { ComponentDriver, Optional } from '@atomic-testing/core';

/**
 * Driver for the Astryx Badge (`@astryxdesign/core/Badge`) — the inline status
 * pill.
 *
 * Badge renders a single `<span>` with NO role; the chosen `variant` is reflected
 * onto the root as `data-variant`, and the `label` is the element's text content
 * (inherited {@link getText}). The scene anchors on the forwarded `data-testid`,
 * reading the variant from the stable `data-variant` rather than the StyleX-hashed
 * class list.
 */
export class BadgeDriver extends ComponentDriver<{}> {
  /** The visual variant (`data-variant`): `'neutral'`, `'success'`, `'purple'`, etc. */
  async getVariant(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'data-variant');
  }

  override get driverName(): string {
    return 'AstryxBadgeDriver';
  }
}
