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
 *
 * **`description` and `endContent` are not separable.** Astryx 0.4.0 added both to
 * the data-driven `items` API, but `Item` renders the label, the description and
 * the end content as unmarked sibling `<span>`s distinguished only by
 * StyleX-hashed classes — no role, no `data-*`, no stable class. Telling them apart
 * would take a positional selector over a slot layout that is explicitly private,
 * which is the coupling this package exists to avoid, so {@link getLabel} returns
 * the row's whole text (label *and* description *and* end content) and there is no
 * `getDescription`. `variant` is the exception and is readable — Astryx reflects it
 * on the row as `data-variant`, so see {@link isDestructive}.
 */
export class MenuItemDriver extends ComponentDriver {
  /**
   * The item's visible label (trimmed text content), or `undefined` when empty.
   *
   * On a row that also sets `description` or `endContent` this is their
   * concatenation, not the label alone — see the class note on why the three are
   * not separable.
   */
  async getLabel(): Promise<Optional<string>> {
    return (await this.getText())?.trim() ?? undefined;
  }

  /**
   * Whether the row is a destructive action (`variant="destructive"`, Astryx
   * 0.4.0) — the "Delete"-style row rendered in the error color. Astryx reflects
   * the variant on the row as `data-variant`, the same theming hook a theme
   * targets, so this needs no structural guesswork.
   */
  async isDestructive(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'data-variant')) === 'destructive';
  }

  /**
   * Whether this row opens a submenu (`aria-haspopup="menu"`) — a
   * `DropdownMenuSubMenu` / `ContextMenuSubMenu` / `BreadcrumbMenuSubMenu`, or a
   * data-mode row with a nested `items` array.
   *
   * There is deliberately no `subMenu()` accessor here. A submenu driver is a
   * menu driver, and every menu driver already depends on *this* class for its
   * items — reaching one from here would close that import cycle. It is also
   * unnecessary: Astryx forwards `data-testid` onto the submenu's trigger row, so
   * a scene names the flyout the same way it names any other overlay, by
   * anchoring `SubMenuDriver` on that trigger.
   */
  async hasSubMenu(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-haspopup')) === 'menu';
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
