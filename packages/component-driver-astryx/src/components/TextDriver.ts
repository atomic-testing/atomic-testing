import { ComponentDriver, Optional } from '@atomic-testing/core';

/**
 * Driver for the Astryx Text (`@astryxdesign/core/Text`) — the semantic typography
 * primitive.
 *
 * Text renders a single element (a `<span>` by default, or whatever `as` selects)
 * with NO role. The semantic `type` is reflected as `data-type`, and the color is
 * reflected as the RESOLVED `data-color` — i.e. the theme-resolved value, not the
 * authored prop. So `type='supporting'` (whose default color is `secondary`)
 * surfaces `data-color="secondary"` even when no `color` prop is passed.
 * The scene anchors on the forwarded `data-testid`.
 */
export class TextDriver extends ComponentDriver<{}> {
  /** The semantic text type (`data-type`): `'body'`, `'supporting'`, `'label'`, etc. */
  async getType(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'data-type');
  }

  /** The RESOLVED text color (`data-color`) — theme-resolved, not the authored `color` prop. */
  async getColor(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'data-color');
  }

  override get driverName(): string {
    return 'AstryxTextDriver';
  }
}
