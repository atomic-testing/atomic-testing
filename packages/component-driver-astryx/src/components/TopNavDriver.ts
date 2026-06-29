import { byCssSelector, ComponentDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

/**
 * Driver for the Astryx TopNav (`@astryxdesign/core/TopNav`).
 *
 * TopNav is the application header landmark: a `<nav role="navigation">` that
 * forwards `data-testid` onto its root and carries the accessible name in
 * `aria-label`. Navigation links live in the `startContent` slot and render as
 * `<a class="astryx-top-nav-item">`; the heading link sits in a separate slot, so
 * the item count enumerates those class-tagged anchors with the iterate-with-`exists`
 * idiom (TopNav exposes no per-item testid — the class is the semantic anchor).
 *
 * Everything this driver reads (label, item count, structure) is React-state-driven
 * and so faithful in jsdom. The hover-triggered overflow menus and the mobile-bar
 * toggle are native-popover / layout behaviours exercised only by the E2E run.
 */
export class TopNavDriver extends ComponentDriver<{}> {
  private item(index: number): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector(`a.astryx-top-nav-item:nth-of-type(${index})`));
  }

  /** The navigation landmark's accessible name (`aria-label`), or `undefined` when unset. */
  async getLabel(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'aria-label');
  }

  /** Number of `TopNavItem` links rendered in the bar (descendant `a.astryx-top-nav-item`). */
  async getItemCount(): Promise<number> {
    let count = 0;
    for (let i = 1; await this.interactor.exists(this.item(i)); i++) {
      count++;
    }
    return count;
  }

  get driverName(): string {
    return 'AstryxTopNavDriver';
  }
}
