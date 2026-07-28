import { byCssSelector, PartLocator } from '@atomic-testing/core';

import { AstryxMenuDriver } from './AstryxMenuDriver';

/**
 * Driver for a breadcrumb crumb's menu (Astryx 0.1.9's `BreadcrumbItem.menu`
 * prop), returned by {@link BreadcrumbItemDriver.menu}.
 *
 * The crumb's trigger `<button>` carries `aria-haspopup="menu"` and
 * `aria-controls` linking to a sibling `role="menu"` panel — the same
 * aria-controls contract the DropdownMenu driver reads — so item enumeration
 * and `selectByLabel` come from {@link AstryxMenuDriver} unchanged. Unlike
 * DropdownMenu, this trigger carries **no `aria-expanded`** (Astryx omits it
 * here), so there is no reliable `isOpen` read; {@link open} unconditionally
 * clicks the trigger, and verifying the panel actually opened is E2E-only.
 */
export class BreadcrumbMenuDriver extends AstryxMenuDriver {
  protected override async resolveMenuLocator(): Promise<PartLocator | null> {
    const menuId = await this.interactor.getAttribute(this.locator, 'aria-controls');
    if (!menuId) {
      return null;
    }
    return byCssSelector(`[id="${menuId}"]`, 'Root');
  }

  /** Open the menu by clicking the trigger. Unconditional — see the class note on `isOpen`. */
  async open(): Promise<void> {
    await this.click();
  }

  override get driverName(): string {
    return 'AstryxBreadcrumbMenuDriver';
  }
}
