import {
  byRole,
  IComponentDriverOption,
  Interactor,
  type LocatorRelativePosition,
  Optional,
  PartLocator,
} from '@atomic-testing/core';

import { MenuContentDriverBase } from './MenuContentDriverBase';

const menuRootLocator: PartLocator = byRole('menu', 'Root');

/**
 * Driver for a Reka `DropdownMenu` (`DropdownMenuRoot`/`DropdownMenuContent` from `reka-ui`).
 *
 * DOM audit (reka-ui@2.10.1, SSR-rendered): trigger is `<button aria-haspopup="menu"
 * aria-expanded="false"/"true" data-state="closed"/"open" aria-controls="<content id>">`.
 * `DropdownMenuContent` renders `role="menu"` inside a
 * `div[data-reka-popper-content-wrapper]`, itself a direct child of `document.body` —
 * NOT nested inside the app root, exactly like `component-driver-radix-v1`'s documented
 * portal behavior. The **same** portal re-root recipe applies unchanged: the static
 * hooks re-root this driver at the document root, compounding the scene's declared
 * locator (e.g. a `data-testid` forwarded onto `DropdownMenuContent`) onto the SAME
 * `[role="menu"]` element.
 *
 * Extends `MenuContentDriverBase` (a `ComponentDriver`, not a plain `ComponentDriver`)
 * for the same reason radix-v1's counterpart does: Reka menus can mix plain items with
 * richer content, so callers can reach a custom interior with `within(parts)`. The item operations
 * (`getMenuItemByLabel`/`selectByLabel`/`getMenuItemCount`/`getMenuItemByIndex`) live on
 * the base.
 */
export class DropdownMenuDriver extends MenuContentDriverBase {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption<{}>>) {
    super(locator, interactor, {
      ...option,
      parts: {},
    });
  }

  static override overriddenParentLocator(): Optional<PartLocator> {
    return menuRootLocator;
  }

  static override overrideLocatorRelativePosition(): Optional<LocatorRelativePosition> {
    return 'Same';
  }

  /**
   * Whether the menu is open. Reka mounts `DropdownMenuContent` only while open
   * (`forceMount` off by default), so existence is the open signal.
   */
  async isOpen(): Promise<boolean> {
    return this.exists();
  }

  get driverName(): string {
    return 'RekaUiV2DropdownMenuDriver';
  }
}
