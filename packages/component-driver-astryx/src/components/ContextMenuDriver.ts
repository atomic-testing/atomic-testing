import { byCssSelector, ComponentDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

/** The menu items rendered in the layer (re-rooted at the document — see class docs). */
const menuItem = byCssSelector('[role="menu"] [role="menuitem"]', 'Root');

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
 * - {@link getItemLabels} reads the menu items, which Astryx keeps mounted in the
 *   DOM even while closed, by re-rooting at the document (`'Root'`).
 * - **`isOpen` is intentionally absent**: the trigger exposes no open-state ARIA
 *   and the menu element is always present in the DOM, so open/closed is
 *   indistinguishable in jsdom (the native Popover API is a no-op there). Open-state
 *   verification is **E2E-only** — blocking dependency: a stable open-state anchor
 *   on the trigger or layer (filed upstream / tracked in the coverage matrix).
 *
 * Single-instance best-effort: the document-rooted item read does not scope to a
 * specific trigger, so a page with multiple ContextMenus would need a scoped
 * variant. Documented as a v1 limitation.
 */
export class ContextMenuDriver extends ComponentDriver<{}> {
  /** Open the menu by dispatching a right-click on the trigger. */
  async open(): Promise<void> {
    return this.interactor.contextMenu(this.locator);
  }

  private itemLocator(index: number): PartLocator {
    return locatorUtil.append(menuItem, byCssSelector(`:nth-of-type(${index})`, 'Same'));
  }

  /** Every menu item's label, in DOM order (readable while closed — the layer stays mounted). */
  async getItemLabels(): Promise<readonly string[]> {
    const labels: string[] = [];
    for (let i = 1; await this.interactor.exists(this.itemLocator(i)); i++) {
      const label = (await this.interactor.getText(this.itemLocator(i)))?.trim();
      if (label) {
        labels.push(label);
      }
    }
    return labels;
  }

  /** Number of menu items. */
  async getItemCount(): Promise<number> {
    return (await this.getItemLabels()).length;
  }

  /** Activate the menu item whose label matches, or `undefined`/no-op when absent. */
  async selectItem(label: string): Promise<void> {
    for (let i = 1; await this.interactor.exists(this.itemLocator(i)); i++) {
      if ((await this.interactor.getText(this.itemLocator(i)))?.trim() === label) {
        await this.interactor.click(this.itemLocator(i));
        return;
      }
    }
  }

  /** The trigger's popup type (`aria-haspopup`, always `"menu"`). */
  async getHasPopup(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'aria-haspopup');
  }

  get driverName(): string {
    return 'AstryxContextMenuDriver';
  }
}
