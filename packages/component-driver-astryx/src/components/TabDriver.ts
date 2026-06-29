import { byCssSelector, ComponentDriver, locatorUtil, Optional } from '@atomic-testing/core';

/**
 * The visible tab label. Astryx renders the label twice inside the tab — once
 * visibly and once in an `aria-hidden` "sizer" span used to reserve width for the
 * bold selected state — so reading the tab's whole text content yields the label
 * doubled. This selector targets only the non-hidden inner label span.
 */
const labelSpan = byCssSelector('span:not([aria-hidden="true"]) > span:not([aria-hidden="true"])');

/**
 * Driver for a single Astryx Tab (`@astryxdesign/core/TabList`'s `Tab`).
 *
 * A tab renders as a `<button>` (or `<a>` when it has an `href`); the active tab
 * is marked with `aria-current="page"` (Astryx does not use `role="tab"` /
 * `aria-selected`). Selection is read from that ARIA attribute, never a
 * StyleX-hashed class.
 */
export class TabDriver extends ComponentDriver {
  /** The tab's visible label (de-duplicated from the hidden width sizer). */
  async getLabel(): Promise<Optional<string>> {
    return (await this.interactor.getText(locatorUtil.append(this.locator, labelSpan))) ?? undefined;
  }

  /** Whether this tab is the active one (`aria-current="page"`). */
  async isActive(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-current')) === 'page';
  }

  /** The tab's `href` when it renders as a link (`<a>`), otherwise `undefined`. */
  async getHref(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'href');
  }

  override get driverName(): string {
    return 'AstryxTabDriver';
  }
}
