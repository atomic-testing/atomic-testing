import { byCssSelector, ComponentDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

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
  private section(index: number): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector(`[role="group"]:nth-of-type(${index})`));
  }

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

  /** Number of `SideNavSection` groups (`[role="group"]`) in the content area. */
  async getSectionCount(): Promise<number> {
    let count = 0;
    for (let i = 1; await this.interactor.exists(this.section(i)); i++) {
      count++;
    }
    return count;
  }

  get driverName(): string {
    return 'AstryxSideNavDriver';
  }
}
