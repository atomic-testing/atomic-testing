import {
  byCssSelector,
  childListHelper,
  ComponentDriver,
  locatorUtil,
  Optional,
  PartLocator,
} from '@atomic-testing/core';

/**
 * Driver for the Astryx SideNav (`@astryxdesign/core/SideNav`).
 *
 * SideNav is a `<nav role="navigation" aria-label="Side navigation">` that forwards
 * `data-testid` onto its root; the accessible name is hardcoded (there is no
 * `label` prop), so {@link getLabel} always reports "Side navigation". Its
 * `children` render as `[role="group"]` sections, and `collapsible` adds a footer
 * `<button aria-label="Collapse …">` — both are structural and read faithfully in
 * jsdom.
 *
 * The collapsed (icon-only) state has no attribute in the initial DOM; it is driven
 * by interaction + layout, so {@link isCollapsed} is **E2E-only** and intentionally
 * omitted here — the shared suite asserts only the structural reads below.
 */
export class SideNavDriver extends ComponentDriver<{}> {
  /** The collapse toggle, present only when SideNav is `collapsible`. */
  private get collapseButton(): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector('button[aria-label^="Collapse"]'));
  }

  /** The landmark's accessible name — always "Side navigation" (Astryx hardcodes it). */
  async getLabel(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'aria-label');
  }

  /** Whether a collapse toggle is rendered (i.e. SideNav was made `collapsible`). */
  async hasCollapseButton(): Promise<boolean> {
    return this.interactor.exists(this.collapseButton);
  }

  /**
   * Number of `SideNavSection` groups (`[role="group"]`) in the content area.
   *
   * The sections are not the only same-tag (`<div>`) children of their container — a
   * top-level `SideNavItem` (e.g. a "Home" link) renders a roleless `<div>` among
   * them — so a tag-based `:nth-of-type` walk mis-indexes them. The count uses
   * `childListHelper`'s `:nth-child` walk with a `'*'` group selector, which descends
   * through the layout wrappers and tallies only the `role="group"` sections; because
   * a matched section is not recursed into, a collapsible item's own nested
   * `role="group"` panel inside a section is not double-counted.
   */
  async getSectionCount(): Promise<number> {
    return childListHelper.countMatchingChildren(this.interactor, this.locator, '[role="group"]', '*');
  }

  get driverName(): string {
    return 'AstryxSideNavDriver';
  }
}
