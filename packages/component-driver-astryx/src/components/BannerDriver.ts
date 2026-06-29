import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { byAriaLabel, byCssSelector, ComponentDriver, listHelper, locatorUtil, Optional } from '@atomic-testing/core';

/**
 * Driver for the Astryx Banner (`@astryxdesign/core/Banner`).
 *
 * Banner forwards `data-testid` onto its root, whose `role` is CONDITIONAL —
 * `"alert"` for error/warning, `"status"` for info/success — while the stable
 * severity lives in `data-status` on the inner header. The header shows the title
 * and optional description as consecutive `<p>`s; a dismiss button
 * (`aria-label="Dismiss"`) and, when the banner has collapsible content, an
 * expand toggle (`aria-expanded`) appear in the header end.
 */
export class BannerDriver extends ComponentDriver<{}> {
  /** The banner's title (the first header paragraph). */
  async getTitle(): Promise<Optional<string>> {
    return this.headerParagraph(0);
  }

  /** The banner's description (the second header paragraph), if any. */
  async getDescription(): Promise<Optional<string>> {
    return this.headerParagraph(1);
  }

  /**
   * The severity bucket (`data-status`): `'info'`, `'success'`, `'warning'`, or
   * `'error'`.
   *
   * Both the header and its decorative icon carry `data-status`; the icon is
   * `aria-hidden`, so exclude it to land on the single semantic header (Playwright
   * rejects a multi-match).
   */
  async getStatus(): Promise<Optional<string>> {
    const header = locatorUtil.append(this.locator, byCssSelector('[data-status]:not([aria-hidden="true"])'));
    return this.interactor.getAttribute(header, 'data-status');
  }

  /** Whether the collapsible content is expanded (`aria-expanded` on the toggle). */
  async isExpanded(): Promise<boolean> {
    const toggle = this.expandToggleLocator();
    if (!(await this.interactor.exists(toggle))) {
      return false;
    }
    return (await this.interactor.getAttribute(toggle, 'aria-expanded')) === 'true';
  }

  /** Toggle the collapsible content open/closed (no-op when the banner has no content). */
  async toggleExpand(): Promise<void> {
    const toggle = this.expandToggleLocator();
    if (await this.interactor.exists(toggle)) {
      await this.interactor.click(toggle);
    }
  }

  /** Dismiss the banner via its close button (requires `isDismissable`). */
  async dismiss(): Promise<void> {
    await this.interactor.click(locatorUtil.append(this.locator, byAriaLabel('Dismiss')));
  }

  /** Whether the banner has been dismissed — Astryx unmounts it, so the root is gone. */
  async isDismissed(): Promise<boolean> {
    return !(await this.exists());
  }

  private expandToggleLocator() {
    return locatorUtil.append(this.locator, byCssSelector('button[aria-expanded]'));
  }

  private async headerParagraph(index: number): Promise<Optional<string>> {
    const paragraphs = locatorUtil.append(this.locator, byCssSelector('[data-status] p'));
    const item = await listHelper.getListItemByIndex(this, paragraphs, index, HTMLElementDriver);
    if (item == null) {
      return undefined;
    }
    return (await item.getText()) ?? undefined;
  }

  get driverName(): string {
    return 'AstryxBannerDriver';
  }
}
