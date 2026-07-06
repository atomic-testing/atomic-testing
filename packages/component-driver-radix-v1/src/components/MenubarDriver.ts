import { childListHelper, ComponentDriver, Optional } from '@atomic-testing/core';

/**
 * CSS for a menubar menu trigger. Radix renders each `Menubar.Trigger` as a
 * `<button role="menuitem">` DIRECT child of the `role="menubar"` bar
 * (verified against rendered `radix-ui@1.6.1` DOM) — the ARIA role, never a
 * utility class.
 */
const menubarTriggerSelector = '[role="menuitem"]';

/**
 * Driver for the Radix `Menubar` bar itself (`Menubar.Root` from `radix-ui`) —
 * an ordinary IN-TREE `role="menubar"` element, no portal involved.
 *
 * This driver covers the bar-level reads (orientation, trigger enumeration);
 * each individual menu (trigger + portalled content) is driven by
 * `MenubarMenuDriver`, declared as its own scene part anchored at that menu's
 * trigger — see its class doc for why the menus cannot be statically re-rooted
 * the way a single `DropdownMenu` can.
 */
export class MenubarDriver extends ComponentDriver<{}> {
  /** The bar's orientation (`data-orientation`), `horizontal` by default. */
  async getOrientation(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'data-orientation');
  }

  /**
   * The number of menu triggers in the bar. Uses `childListHelper`'s
   * `:nth-child` walk (not a `getAttribute` count, which is not portable
   * across interactors — see `childListHelper`'s doc).
   */
  async getTriggerCount(): Promise<number> {
    return childListHelper.countMatchingChildren(this.interactor, this.locator, menubarTriggerSelector);
  }

  get driverName(): string {
    return 'RadixV1MenubarDriver';
  }
}
