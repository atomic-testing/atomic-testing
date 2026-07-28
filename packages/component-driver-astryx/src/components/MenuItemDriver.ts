import { ComponentDriver, Optional } from '@atomic-testing/core';

/** A menu item's ARIA role — plain, or one of the two selectable variants (0.1.8+). */
export type MenuItemRole = 'menuitem' | 'menuitemcheckbox' | 'menuitemradio';

/**
 * Driver for a single Astryx menu item — `role="menuitem"`,
 * `role="menuitemcheckbox"`, or `role="menuitemradio"` (the selectable variants
 * added in Astryx 0.1.8 via `DropdownMenuCheckboxItem`/`DropdownMenuRadioItem`) —
 * shared by the menu-family drivers (NavMenu, DropdownMenu, MoreMenu, ContextMenu).
 *
 * Astryx renders a plain item as `<a role="menuitem">` when it has an `href` and as
 * `<div role="menuitem">` otherwise; a checkbox/radio item is always a `<div>` (its
 * own `<Item>` wrapper) carrying `aria-checked`. The visible label is the item's
 * text content and a disabled item carries `aria-disabled="true"` (never the
 * native `disabled` attribute, since the element is not a form control). The
 * driver therefore reads state from ARIA, never from StyleX-hashed classes.
 */
export class MenuItemDriver extends ComponentDriver {
  /** The item's visible label (trimmed text content), or `undefined` when empty. */
  async getLabel(): Promise<Optional<string>> {
    return (await this.getText())?.trim() ?? undefined;
  }

  /** Whether the item is disabled — Astryx marks this with `aria-disabled="true"`. */
  async isDisabled(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-disabled')) === 'true';
  }

  /** The item's `href` when it renders as a link (`<a>`), otherwise `undefined`. */
  async getHref(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'href');
  }

  /** The item's ARIA role — `'menuitem'`, `'menuitemcheckbox'`, or `'menuitemradio'`. */
  async getRole(): Promise<MenuItemRole> {
    return ((await this.interactor.getAttribute(this.locator, 'role')) as MenuItemRole | null) ?? 'menuitem';
  }

  /**
   * Whether a checkbox/radio item is checked (`aria-checked="true"`). Always
   * `false` for a plain `menuitem`, which carries no `aria-checked`.
   */
  async isChecked(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-checked')) === 'true';
  }

  override get driverName(): string {
    return 'AstryxMenuItemDriver';
  }
}
