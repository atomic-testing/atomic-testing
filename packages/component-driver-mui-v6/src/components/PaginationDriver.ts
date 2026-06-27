import { byAttribute, byCssSelector, ComponentDriver, locatorUtil, PartLocator } from '@atomic-testing/core';

// Numbered page controls are the only ones that carry the `MuiPaginationItem-page`
// state class; matching on it selects every page button regardless of selection.
const pageItemLocator = byCssSelector('.MuiPaginationItem-page');
// MUI marks exactly the selected page with an `aria-current` attribute (value
// "page"); matching on its presence is version-agnostic.
const selectedPageLocator = byCssSelector('[aria-current]');
const firstButtonLocator = byAttribute('aria-label', 'Go to first page');
const previousButtonLocator = byAttribute('aria-label', 'Go to previous page');
const nextButtonLocator = byAttribute('aria-label', 'Go to next page');
const lastButtonLocator = byAttribute('aria-label', 'Go to last page');

/**
 * Driver for the Material UI v7 Pagination component.
 *
 * Pagination renders a `<nav>` whose `MuiPaginationItem` buttons are each wrapped
 * in their own `<li>` (so they are not siblings — positional `:nth-of-type`
 * iteration does not apply). Page controls are read by their accessible name
 * instead: every page button's aria-label ends in its page number ("Go to page N",
 * or "page N" once selected), and first/previous/next/last carry stable
 * aria-labels and become `disabled` at the bounds.
 * @see https://mui.com/material-ui/react-pagination/
 */
export class PaginationDriver extends ComponentDriver {
  private get pageItemsLocator(): PartLocator {
    return locatorUtil.append(this.locator, pageItemLocator);
  }

  /**
   * The selected page number, or `-1` when no page is marked current.
   */
  async getSelectedPage(): Promise<number> {
    const locator = locatorUtil.append(this.locator, selectedPageLocator);
    if (!(await this.interactor.exists(locator))) {
      return -1;
    }
    const text = await this.interactor.getText(locator);
    const page = Number.parseInt(text?.trim() ?? '', 10);
    return Number.isNaN(page) ? -1 : page;
  }

  /**
   * Total number of pages, taken from the highest numbered page control. MUI
   * always renders the upper boundary page (boundaryCount >= 1), so this is exact
   * even when middle pages collapse into an ellipsis.
   */
  async getPageCount(): Promise<number> {
    const labels = await this.interactor.getAttribute(this.pageItemsLocator, 'aria-label', true);
    let max = 0;
    for (const label of labels) {
      const match = label?.match(/(\d+)\s*$/);
      if (match != null) {
        const page = Number.parseInt(match[1], 10);
        if (page > max) {
          max = page;
        }
      }
    }
    return max;
  }

  /**
   * Click the numbered control for `page`. A no-op (returns `true`) when `page` is
   * already selected.
   * @returns `false` when that page is not currently rendered (e.g. hidden behind
   * an ellipsis) or is disabled.
   */
  async goToPage(page: number): Promise<boolean> {
    if ((await this.getSelectedPage()) === page) {
      return true;
    }
    const locator = locatorUtil.append(this.locator, byAttribute('aria-label', `Go to page ${page}`));
    if (!(await this.interactor.exists(locator)) || (await this.interactor.isDisabled(locator))) {
      return false;
    }
    await this.interactor.click(locator);
    return true;
  }

  /**
   * Click a navigation control unless it is absent or disabled (at a bound).
   * @returns whether the click was performed.
   */
  private async clickNavButton(navLocator: PartLocator): Promise<boolean> {
    const locator = locatorUtil.append(this.locator, navLocator);
    if (!(await this.interactor.exists(locator)) || (await this.interactor.isDisabled(locator))) {
      return false;
    }
    await this.interactor.click(locator);
    return true;
  }

  /** Go to the next page. Returns `false` when on the last page or the control is hidden. */
  async next(): Promise<boolean> {
    return this.clickNavButton(nextButtonLocator);
  }

  /** Go to the previous page. Returns `false` when on the first page or the control is hidden. */
  async previous(): Promise<boolean> {
    return this.clickNavButton(previousButtonLocator);
  }

  /** Jump to the first page. Returns `false` when already there or the control is hidden (needs `showFirstButton`). */
  async first(): Promise<boolean> {
    return this.clickNavButton(firstButtonLocator);
  }

  /** Jump to the last page. Returns `false` when already there or the control is hidden (needs `showLastButton`). */
  async last(): Promise<boolean> {
    return this.clickNavButton(lastButtonLocator);
  }

  override get driverName(): string {
    return 'MuiV6PaginationDriver';
  }
}
