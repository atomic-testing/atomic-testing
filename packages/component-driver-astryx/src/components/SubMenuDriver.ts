import { byCssSelector, Optional, PartLocator } from '@atomic-testing/core';

import { DropdownMenuDriver } from './DropdownMenuDriver';

/**
 * Driver for an Astryx menu **submenu** — the flyout a `DropdownMenuSubMenu` row
 * opens (aliased as `ContextMenuSubMenu` and `BreadcrumbMenuSubMenu`, and reachable
 * from data mode as a nested `items` array). Added in Astryx 0.2.0; hover-opening
 * was consolidated onto the shared `useMenuHover` machine in 0.4.2.
 *
 * The DOM contract is DropdownMenu's, one level in: the submenu **trigger** is a
 * `role="menuitem"` row inside the parent `role="menu"` carrying
 * `aria-haspopup="menu"`, `aria-expanded` and `aria-controls`, and the flyout it
 * points at is a `role="menu"` linked by that `aria-controls`. That is exactly
 * {@link DropdownMenuDriver}'s shape, so open/close, panel resolution and the whole
 * item surface are inherited rather than restated — the two differ only in what the
 * trigger is (a menu row, not a standalone button) and therefore in how it names
 * itself.
 *
 * Anchor it on the submenu's **trigger row**, the way a scene names any other
 * overlay: Astryx forwards `data-testid` onto that row. There is deliberately no
 * accessor for it on `MenuItemDriver` — a submenu driver is a menu driver, and
 * every menu driver already depends on `MenuItemDriver` for its items, so reaching
 * one from there would close an import cycle. `MenuItemDriver.hasSubMenu` tells you
 * whether a given row has a flyout to anchor on.
 *
 * The one contract that differs is which link reaches the flyout, and it is the
 * reason {@link resolveMenuLocator} is overridden rather than inherited: Astryx
 * emits `aria-controls` on a submenu trigger **only while it is open**, so
 * following it would make every read of a closed submenu come back empty. The
 * flyout points *back* at its trigger with `aria-labelledby={triggerId}`
 * unconditionally, and its items stay mounted, so resolving in that direction reads
 * labels and counts in either state — the same ergonomics DropdownMenu has. As
 * there, {@link DropdownMenuDriver.open} is still required before *selecting*: a
 * closed flyout is not interactable in a real browser.
 */
export class SubMenuDriver extends DropdownMenuDriver {
  protected override async resolveMenuLocator(): Promise<Optional<PartLocator>> {
    const triggerId = await this.interactor.getAttribute(this.locator, 'id');
    if (!triggerId) {
      return undefined;
    }
    return byCssSelector(`[role="menu"][aria-labelledby="${triggerId}"]`, 'Root');
  }

  /**
   * The trigger row's own label.
   *
   * Reads the trigger's text like DropdownMenu's, but note the row is an `Item`:
   * with a `description` set, its text content carries both. See
   * {@link MenuItemDriver.getLabel} for the same caveat on plain rows.
   */
  override async getTriggerLabel(): Promise<Optional<string>> {
    return (await this.getText())?.trim() || undefined;
  }

  override get driverName(): string {
    return 'AstryxSubMenuDriver';
  }
}
