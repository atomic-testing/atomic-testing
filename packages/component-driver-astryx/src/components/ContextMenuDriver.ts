import { byCssSelector, Optional, PartLocator } from '@atomic-testing/core';

import { AstryxMenuDriver } from './AstryxMenuDriver';

/**
 * Driver for the Astryx ContextMenu (`@astryxdesign/core/ContextMenu`).
 *
 * The scene anchors this driver on the **trigger** `<div>`, which carries only
 * `aria-haspopup="menu"` (Astryx forwards `data-testid` here). Unlike Popover, the
 * trigger has **no `aria-expanded` and no `aria-controls`** — the only way to open
 * the menu is a `contextmenu`/right-click event, and the `role="menu"` layer is a
 * `popover` rendered as a sibling at the document root with no id link back to the
 * trigger. So:
 *
 * - {@link open} uses the `contextMenu` interactor primitive (the dedicated
 *   right-click event — the menu has no controlled-open prop to flip).
 * - the item reads come from {@link AstryxMenuDriver}: it enumerates the
 *   `role="menuitem"` children of the document-rooted `role="menu"` via
 *   `childListHelper`'s portable `:nth-child` walk, so interleaved `role="separator"`
 *   dividers and `role="group"` sections (both first-class `ContextMenuOption`s, and
 *   both `<div>`s like the items) are handled — not silently truncated. Astryx keeps
 *   the layer mounted even while closed, so labels/count read in jsdom.
 * - **`isOpen` is intentionally absent**: the trigger exposes no open-state ARIA
 *   and the menu element is always present in the DOM, so open/closed is
 *   indistinguishable in jsdom (the native Popover API is a no-op there). Open-state
 *   verification is **E2E-only** — blocking dependency: a stable open-state anchor
 *   on the trigger or layer (filed upstream / tracked in the coverage matrix).
 *
 * Single-instance best-effort: the document-rooted menu read does not scope to a
 * specific trigger, so a page with multiple ContextMenus would need a scoped
 * variant. Documented as a v1 limitation.
 */
export class ContextMenuDriver extends AstryxMenuDriver {
  /** Open the menu by dispatching a right-click on the trigger. */
  async open(): Promise<void> {
    return this.interactor.contextMenu(this.locator);
  }

  /**
   * The `role="menu"` layer, re-rooted at the document. Astryx renders it as a
   * body-level popover with no id link back to the trigger, so this is best-effort
   * for a single ContextMenu per scene (documented v1 limit).
   */
  protected override resolveMenuLocator(): Promise<PartLocator | null> {
    return Promise.resolve(byCssSelector('[role="menu"]', 'Root'));
  }

  /** The trigger's popup type (`aria-haspopup`, always `"menu"`). */
  async getHasPopup(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'aria-haspopup');
  }

  override get driverName(): string {
    return 'AstryxContextMenuDriver';
  }
}
