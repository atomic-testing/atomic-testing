import { ComponentDriver, Optional } from '@atomic-testing/core';

/**
 * Driver for a single Astryx menu item (`role="menuitem"`), shared by the
 * menu-family drivers (NavMenu, DropdownMenu, MoreMenu).
 *
 * Astryx renders an item as `<a role="menuitem">` when it has an `href` and as
 * `<div role="menuitem">` otherwise; the visible label is its text content and a
 * disabled item carries `aria-disabled="true"` (never the native `disabled`
 * attribute, since the element is not a form control). The driver therefore reads
 * state from ARIA, never from StyleX-hashed classes.
 */
export class MenuItemDriver extends ComponentDriver {
  /** The item's visible label (text content), or `undefined` when empty. */
  async getLabel(): Promise<Optional<string>> {
    return (await this.getText()) ?? undefined;
  }

  /** Whether the item is disabled — Astryx marks this with `aria-disabled="true"`. */
  async isDisabled(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-disabled')) === 'true';
  }

  /** The item's `href` when it renders as a link (`<a>`), otherwise `undefined`. */
  async getHref(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'href');
  }

  override get driverName(): string {
    return 'AstryxMenuItemDriver';
  }
}
