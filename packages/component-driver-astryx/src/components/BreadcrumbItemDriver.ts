import { byCssSelector, ComponentDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

import { BreadcrumbMenuDriver } from './BreadcrumbMenuDriver';

/**
 * Driver for a single Astryx breadcrumb (`<li class="astryx-breadcrumb-item">`).
 *
 * A crumb's `<li>` holds a **leading separator** `<span aria-hidden="true">/</span>`
 * followed by its content, which is one of five shapes: an `<a href>` (linked), a
 * `<button>` (action-only), a menu-trigger `<button aria-haspopup="menu">` (Astryx
 * 0.1.9's `menu` prop — see {@link hasMenu}/{@link menu}), a `<span aria-current="page">`
 * (explicit current), or a bare `<span>` (plain). The current crumb is marked either
 * by `aria-current="page"` on that inner content (explicit `isCurrent`) **or** on
 * the `<li>` itself (Astryx's auto-detection of the last crumb). The label is read
 * from the content element (the non-separator child) so the decorative `/` is
 * excluded across every shape.
 */
export class BreadcrumbItemDriver extends ComponentDriver {
  /** The crumb's content element — the child that is not the `aria-hidden` separator. */
  private get content(): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector('> :not([aria-hidden="true"])'));
  }

  /** The crumb's visible label, read from its content element (separator excluded). */
  async getLabel(): Promise<Optional<string>> {
    return (await this.interactor.getText(this.content))?.trim() || undefined;
  }

  /** The crumb's `href` when it is a link, otherwise `undefined`. */
  async getHref(): Promise<Optional<string>> {
    const link = locatorUtil.append(this.locator, byCssSelector('a'));
    if (!(await this.interactor.exists(link))) {
      return undefined;
    }
    return this.interactor.getAttribute(link, 'href');
  }

  /**
   * Whether this is the current crumb — `aria-current="page"` on the `<li>` itself
   * (Astryx's auto-current last crumb) or on its inner content (explicit `isCurrent`).
   */
  async isCurrent(): Promise<boolean> {
    if ((await this.interactor.getAttribute(this.locator, 'aria-current')) === 'page') {
      return true;
    }
    return this.interactor.exists(locatorUtil.append(this.locator, byCssSelector('[aria-current="page"]')));
  }

  /** Whether this crumb renders as a menu trigger (Astryx 0.1.9's `menu` prop was set). */
  async hasMenu(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.content, 'aria-haspopup')) === 'menu';
  }

  /**
   * The item-level API for this crumb's menu — present only when {@link hasMenu}
   * is `true`. See {@link BreadcrumbMenuDriver} for its `isOpen` limitation.
   */
  menu(): BreadcrumbMenuDriver {
    return new BreadcrumbMenuDriver(this.content, this.interactor, this.commutableOption);
  }

  override get driverName(): string {
    return 'AstryxBreadcrumbItemDriver';
  }
}
