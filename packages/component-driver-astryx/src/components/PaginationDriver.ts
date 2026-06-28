import { byAriaLabel, byCssSelector, ComponentDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

const currentPageLocator = byCssSelector('[aria-current]');
const previousButtonLocator = byAriaLabel('Go to previous page');
const nextButtonLocator = byAriaLabel('Go to next page');
// The "count"/"compact" variants render their summary as a body-typed text span.
const countTextLocator = byCssSelector('[data-type="body"]');

/**
 * Driver for the Astryx Pagination (`@astryxdesign/core/Pagination`).
 *
 * Pagination self-emits `data-testid` on a `<nav>` and addresses controls by
 * their stable accessible names: page buttons are `aria-label="Go to page N"`
 * (the selected one also carries `aria-current="page"`), and prev/next are
 * `aria-label="Go to previous/next page"`, becoming `disabled` at the bounds —
 * mirrors the MUI `PaginationDriver`. The visible variant decides what sits
 * between prev/next (page buttons vs. a count/compact text summary).
 */
export class PaginationDriver extends ComponentDriver<{}> {
  /** The selected page number, or `-1` when none is marked current (e.g. non-`pages` variants). */
  async getCurrentPage(): Promise<number> {
    const locator = locatorUtil.append(this.locator, currentPageLocator);
    if (!(await this.interactor.exists(locator))) {
      return -1;
    }
    const text = await this.interactor.getText(locator);
    const page = Number.parseInt(text?.trim() ?? '', 10);
    return Number.isNaN(page) ? -1 : page;
  }

  /**
   * Click the numbered control for `page`. No-op (returns `true`) when already
   * selected; `false` when that control is absent (collapsed behind an ellipsis)
   * or disabled.
   */
  async goToPage(page: number): Promise<boolean> {
    if ((await this.getCurrentPage()) === page) {
      return true;
    }
    return this.clickNav(byAriaLabel(`Go to page ${page}`));
  }

  /** Go to the next page. `false` on the last page or when the control is hidden. */
  async next(): Promise<boolean> {
    return this.clickNav(nextButtonLocator);
  }

  /** Go to the previous page. `false` on the first page or when the control is hidden. */
  async previous(): Promise<boolean> {
    return this.clickNav(previousButtonLocator);
  }

  /** Whether the next-page control is at its bound (`disabled`). */
  async isNextDisabled(): Promise<boolean> {
    return this.isNavDisabled(nextButtonLocator);
  }

  /** Whether the previous-page control is at its bound (`disabled`). */
  async isPrevDisabled(): Promise<boolean> {
    return this.isNavDisabled(previousButtonLocator);
  }

  /** The summary text for the `count`/`compact` variants (e.g. `"21–40 of 200"`), if present. */
  async getCountText(): Promise<Optional<string>> {
    const locator = locatorUtil.append(this.locator, countTextLocator);
    if (!(await this.interactor.exists(locator))) {
      return undefined;
    }
    return (await this.interactor.getText(locator)) ?? undefined;
  }

  private async clickNav(navLocator: PartLocator): Promise<boolean> {
    const locator = locatorUtil.append(this.locator, navLocator);
    if (!(await this.interactor.exists(locator)) || (await this.interactor.isDisabled(locator))) {
      return false;
    }
    await this.interactor.click(locator);
    return true;
  }

  private async isNavDisabled(navLocator: PartLocator): Promise<boolean> {
    const locator = locatorUtil.append(this.locator, navLocator);
    return (await this.interactor.exists(locator)) && (await this.interactor.isDisabled(locator));
  }

  get driverName(): string {
    return 'AstryxPaginationDriver';
  }
}
