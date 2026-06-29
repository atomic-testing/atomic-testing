import { HTMLAnchorDriver } from '@atomic-testing/component-driver-html';
import { Optional } from '@atomic-testing/core';

/**
 * Driver for the Astryx TopNavItem (`@astryxdesign/core/TopNav`, `TopNavItem`).
 *
 * TopNavItem always renders an `<a class="astryx-top-nav-item">` and forwards
 * `data-testid` onto it, so the scene anchors there and {@link HTMLAnchorDriver}
 * supplies `getHref`/`getTarget`/`click`. Astryx expresses item state with ARIA
 * rather than native attributes: the selected item carries `aria-current="page"`
 * and a disabled item carries `aria-disabled="true"` + `tabindex="-1"` while
 * staying an `<a>` (there is no native `disabled` on anchors). All of this is
 * React-state-driven, so every read is faithful in jsdom.
 */
export class TopNavItemDriver extends HTMLAnchorDriver {
  /** The item's visible label. */
  async getLabel(): Promise<Optional<string>> {
    return (await this.getText()) ?? undefined;
  }

  /** Whether this is the current page — Astryx marks it with `aria-current="page"`. */
  async isSelected(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-current')) === 'page';
  }

  /**
   * Whether the item is disabled. Astryx keeps the `<a>` and signals disablement
   * with `aria-disabled="true"` (plus `tabindex="-1"`), not the native attribute.
   */
  async isDisabled(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-disabled')) === 'true';
  }

  override get driverName(): string {
    return 'AstryxTopNavItemDriver';
  }
}
