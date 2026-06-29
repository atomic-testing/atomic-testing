import { PartLocator } from '@atomic-testing/core';

import { AstryxMenuDriver } from './AstryxMenuDriver';

/**
 * Driver for the Astryx NavMenu (`@astryxdesign/core/NavMenu`, whose public
 * component is `NavHeadingMenu`).
 *
 * NavHeadingMenu renders an inline `<div role="menu">` that forwards
 * `data-testid`; each `NavHeadingMenuItem` is a `role="menuitem"` element (an
 * `<a>` when it has an `href`, otherwise a `<div>`). It has no open/close or
 * selected state — it is a flat list of navigation links/actions — so the driver
 * is the menu itself: {@link resolveMenuLocator} returns its own root. All item
 * operations (labels, count, click-by-label, disabled, href) come from
 * {@link AstryxMenuDriver}, which iterates `role="menuitem"` children positionally
 * and so copes with the mixed `<a>`/`<div>` rendering.
 */
export class NavMenuDriver extends AstryxMenuDriver {
  protected override async resolveMenuLocator(): Promise<PartLocator> {
    return this.locator;
  }

  /**
   * Click the item whose visible text matches `label`. Alias of
   * {@link AstryxMenuDriver.selectByLabel} that reads as navigation intent.
   * @returns `false` when no such item exists.
   */
  async clickItem(label: string): Promise<boolean> {
    return this.selectByLabel(label);
  }

  override get driverName(): string {
    return 'AstryxNavMenuDriver';
  }
}
