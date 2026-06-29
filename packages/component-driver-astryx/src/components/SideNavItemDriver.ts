import { byCssSelector, ComponentDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

/**
 * Driver for the Astryx SideNavItem (`@astryxdesign/core/SideNav`, `SideNavItem`).
 *
 * SideNavItem renders one of two shapes, both forwarding `data-testid` onto the
 * root: a **leaf** link is an `<a class="astryx-side-nav-item">` (the root *is* the
 * anchor), while a **collapsible-with-children** item is a `<div>` wrapping an
 * `<a href>` plus a `<button aria-expanded aria-controls>` toggle and a sibling
 * `[role="group"]` panel. To cope with both, the readers prefer the root and fall
 * back to a descendant `<a>` — so the same driver works whether the testid lands on
 * the anchor or its `<div>` wrapper.
 *
 * Selected state is `aria-current="page"`; expansion is the toggle's `aria-expanded`
 * (absent — hence `undefined` — for a leaf). All are React-state-driven and faithful
 * in jsdom; only the collapse *animation* is E2E-only.
 */
export class SideNavItemDriver extends ComponentDriver<{}> {
  /** The item's anchor: the root itself for a leaf, else a descendant `<a>`. */
  private get anchor(): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector('a'));
  }

  /** The expand/collapse toggle, present only for a collapsible item with children. */
  private get toggle(): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector('button[aria-expanded]'));
  }

  /** Reads an attribute from the root, falling back to the descendant `<a>` (collapsible shape). */
  private async readLinkAttribute(name: string): Promise<Optional<string>> {
    const own = await this.interactor.getAttribute(this.locator, name);
    if (own != null) {
      return own;
    }
    if (await this.interactor.exists(this.anchor)) {
      return this.interactor.getAttribute(this.anchor, name);
    }
    return undefined;
  }

  /**
   * The item's visible label. For a collapsible item the root `<div>` also contains
   * the (icon-only) toggle, so the label is read from the inner `<a>` when present;
   * a leaf has no descendant `<a>`, so its own text is used.
   */
  async getLabel(): Promise<Optional<string>> {
    if (await this.interactor.exists(this.anchor)) {
      const linkText = (await this.interactor.getText(this.anchor))?.trim();
      if (linkText) {
        return linkText;
      }
    }
    return (await this.getText())?.trim() || undefined;
  }

  /** Whether this is the current page — `aria-current="page"` on the root or its anchor. */
  async isSelected(): Promise<boolean> {
    return (await this.readLinkAttribute('aria-current')) === 'page';
  }

  /** The navigation target — `href` on the root (leaf) or the descendant `<a>` (collapsible). */
  async getHref(): Promise<Optional<string>> {
    return this.readLinkAttribute('href');
  }

  /**
   * Whether a collapsible item is expanded (its toggle's `aria-expanded === 'true'`),
   * or `undefined` for a leaf item that has no toggle.
   */
  async isExpanded(): Promise<Optional<boolean>> {
    if (!(await this.interactor.exists(this.toggle))) {
      return undefined;
    }
    return (await this.interactor.getAttribute(this.toggle, 'aria-expanded')) === 'true';
  }

  get driverName(): string {
    return 'AstryxSideNavItemDriver';
  }
}
