import { Optional } from '@atomic-testing/core';

import { BadgeDriver } from './BadgeDriver';

/**
 * Driver for the Fluent v9 `CounterBadge` component.
 *
 * DOM audit (@fluentui/react-components@9.74.3): renders the identical
 * `<div class="fui-Badge fui-CounterBadge">` shape as a plain `Badge` (just
 * with the extra un-hashed marker class), so this driver extends
 * {@link BadgeDriver} wholesale. The displayed count — including Fluent's own
 * `overflowCount` clamping (e.g. `count={150}` with the default
 * `overflowCount={99}` renders literal text `"99+"`) — is exactly the root's
 * text content, so {@link getDisplayedCount} is a thin, honest alias for the
 * inherited `getText()` rather than a `count`-prop passthrough.
 */
export class CounterBadgeDriver extends BadgeDriver {
  /** The rendered count text, already clamped by `overflowCount` if applicable (e.g. `"99+"`). */
  async getDisplayedCount(): Promise<Optional<string>> {
    return this.getText();
  }

  override get driverName(): string {
    return 'FluentV9CounterBadgeDriver';
  }
}
