import {
  byCssSelector,
  byRole,
  childListHelper,
  ComponentDriver,
  type LocatorRelativePosition,
  locatorUtil,
  Optional,
  PartLocator,
} from '@atomic-testing/core';

import { MenuItemNotFoundError } from '../errors/MenuItemNotFoundError';
import { MenuItemDriver } from './MenuItemDriver';

/** CSS for a PrimeVue menu item — the ARIA role, never a theme class. */
const menuItemSelector = '[role="menuitem"]';

/**
 * `role="menu"` lives on the inner `<ul>`, not the teleported root the scene's
 * locator (forwarded `data-testid`) lands on — so the portal re-root anchors on
 * PrimeVue's own `data-pc-name="menu"` root marker instead of the role (unlike
 * the Radix menu drivers, whose `role="menu"` element IS the portalled root).
 */
const menuRootLocator: PartLocator = byCssSelector('[data-pc-name="menu"]', 'Root');
// A ceiling, not a sleep: waitUntil returns as soon as the probe flips. PrimeVue's
// leave transition plus mask teardown lands around 250-350ms in real browsers,
// so the MUI-era 250ms ceiling was borderline; 1000ms absorbs slow engines.
const defaultTransitionDuration = 1000;

/**
 * Driver for the PrimeVue `Menu` component in popup mode.
 *
 * DOM audit (primevue@4.5.5): in popup mode the whole `.p-menu` root
 * teleports (default `appendTo`) under `document.body` and unmounts while
 * closed — existence is the open signal, and the static portal hooks re-root
 * the scene's declared locator at the document root ('Same' onto the
 * `data-pc-name="menu"` element, per the MUI portal recipe). Opening is the
 * consumer's trigger (a button calling `menu.toggle(event)`), so the driver
 * covers the popup surface only. An inline (non-popup) Menu renders the same
 * item DOM in place and the item operations work there too; `isOpen` is then
 * trivially `true`.
 *
 * **Item iteration uses `childListHelper`, not `listHelper`**: PrimeVue
 * renders separators as `<li role="separator">` — the same tag as the
 * `<li role="menuitem">` items — so a plain `:nth-of-type` walk would require
 * the Nth `<li>` to also be a menuitem and silently truncate the list at the
 * first separator (the exact `childListHelper` failure class the root
 * CLAUDE.md records). Activation clicks land on the item's inner
 * `data-pc-section="itemlink"` anchor — see {@link MenuItemDriver}.
 *
 * No `MenuContentDriverBase`-style shared base (the Radix split): Menu is the
 * only menu-family driver in this package's v1 set, so a base class would be
 * speculative; extract one when a second menu surface (Menubar, ContextMenu,
 * TieredMenu) lands.
 */
export class MenuDriver extends ComponentDriver<{}> {
  static override overriddenParentLocator(): Optional<PartLocator> {
    return menuRootLocator;
  }

  static override overrideLocatorRelativePosition(): Optional<LocatorRelativePosition> {
    return 'Same';
  }

  private get listLocator(): PartLocator {
    return locatorUtil.append(this.locator, byRole('menu'));
  }

  /** Whether the popup menu is open — PrimeVue mounts it only while open. */
  async isOpen(): Promise<boolean> {
    return this.exists();
  }

  /** Wait for the popup to open (mount). */
  async waitForOpen(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: true,
      timeoutMs,
    });
    return isOpened === true;
  }

  /** Wait for the popup to close (unmount). */
  async waitForClose(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: false,
      timeoutMs,
    });
    return isOpened === false;
  }

  /** The item whose visible label matches `label`, or `null` when absent. */
  async getMenuItemByLabel(label: string): Promise<MenuItemDriver | null> {
    for await (const item of childListHelper.iterateMatchingChildren(
      this,
      this.listLocator,
      menuItemSelector,
      MenuItemDriver
    )) {
      if ((await item.getLabel()) === label) {
        return item;
      }
    }
    return null;
  }

  /** Click the item whose visible label matches `label`. @throws {MenuItemNotFoundError} when absent. */
  async selectByLabel(label: string): Promise<void> {
    const item = await this.getMenuItemByLabel(label);
    if (item) {
      await item.click();
    } else {
      throw new MenuItemNotFoundError(label, this);
    }
  }

  /** The number of items (`role="menuitem"`) in the open menu, separators excluded. */
  async getMenuItemCount(): Promise<number> {
    return childListHelper.countMatchingChildren(this.interactor, this.listLocator, menuItemSelector);
  }

  /** The item at the given zero-based index (separators excluded), or `null` if out of range. */
  async getMenuItemByIndex(index: number): Promise<MenuItemDriver | null> {
    let position = 0;
    for await (const item of childListHelper.iterateMatchingChildren(
      this,
      this.listLocator,
      menuItemSelector,
      MenuItemDriver
    )) {
      if (position === index) {
        return item;
      }
      position++;
    }
    return null;
  }

  get driverName(): string {
    return 'PrimeVueV4MenuDriver';
  }
}
