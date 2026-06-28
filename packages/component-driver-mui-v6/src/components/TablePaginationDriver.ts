import { byAttribute, byCssSelector, ComponentDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

import { SelectDriver } from './SelectDriver';

const previousButtonLocator = byAttribute('aria-label', 'Go to previous page');
const nextButtonLocator = byAttribute('aria-label', 'Go to next page');
const displayedRowsLocator = byCssSelector('.MuiTablePagination-displayedRows');

/**
 * Driver for the Material UI v7 TablePagination component.
 *
 * TablePagination is a composite: a "rows per page" MUI Select (a portal-backed
 * `role="combobox"`), an aria-labelled previous/next pair that disables at the
 * bounds, and a `.MuiTablePagination-displayedRows` label ("1–5 of 13"). The
 * rows-per-page control is delegated to {@link SelectDriver} rather than
 * reimplemented — the driver's own root contains exactly one combobox/input, so
 * SelectDriver scoped to that root resolves it unambiguously.
 * @see https://mui.com/material-ui/react-pagination/#table-pagination
 */
export class TablePaginationDriver extends ComponentDriver {
  // The driver root contains exactly one combobox/input, so a SelectDriver scoped
  // to it resolves the rows-per-page control unambiguously. Constructed on demand
  // (stateless) to avoid overriding the base constructor.
  private get rowsPerPageSelect(): SelectDriver {
    return new SelectDriver(this.locator, this.interactor);
  }

  /**
   * The current rows-per-page value, read from the select's hidden input, or
   * `undefined` when it cannot be read/parsed. MUI's "All" option is not a parse
   * failure — it has the real value `-1` and is returned verbatim, so the
   * not-readable sentinel must not reuse `-1`.
   */
  async getRowsPerPage(): Promise<Optional<number>> {
    const value = await this.rowsPerPageSelect.getValue();
    const parsed = Number.parseInt(value ?? '', 10);
    return Number.isNaN(parsed) ? undefined : parsed;
  }

  /**
   * Choose a rows-per-page value by opening the select and picking the option.
   * @returns `false` when no such option exists.
   */
  async setRowsPerPage(rowsPerPage: number): Promise<boolean> {
    return this.rowsPerPageSelect.setValue(String(rowsPerPage));
  }

  /**
   * The raw "displayed rows" label (e.g. "1–5 of 13"), or `undefined` when absent.
   * Returned verbatim because its exact format (separator, "of") is locale-defined.
   */
  async getDisplayedRowsText(): Promise<Optional<string>> {
    const locator = locatorUtil.append(this.locator, displayedRowsLocator);
    if (!(await this.interactor.exists(locator))) {
      return undefined;
    }
    return (await this.interactor.getText(locator))?.trim();
  }

  /** Whether the previous-page control is disabled (i.e. on the first page). */
  async isPreviousDisabled(): Promise<boolean> {
    return this.isNavDisabled(previousButtonLocator);
  }

  /** Whether the next-page control is disabled (i.e. on the last page). */
  async isNextDisabled(): Promise<boolean> {
    return this.isNavDisabled(nextButtonLocator);
  }

  /**
   * An absent control counts as disabled — both to stay consistent with
   * {@link clickNavButton} (which reports a no-op for a missing control) and
   * because Playwright's `isDisabled` throws on a zero-match locator rather than
   * returning false the way jsdom does.
   */
  private async isNavDisabled(navLocator: PartLocator): Promise<boolean> {
    const locator = locatorUtil.append(this.locator, navLocator);
    if (!(await this.interactor.exists(locator))) {
      return true;
    }
    return this.interactor.isDisabled(locator);
  }

  /**
   * Advance to the next page unless the control is disabled (last page).
   * @returns whether the click was performed.
   */
  async nextPage(): Promise<boolean> {
    return this.clickNavButton(nextButtonLocator);
  }

  /**
   * Go back to the previous page unless the control is disabled (first page).
   * @returns whether the click was performed.
   */
  async previousPage(): Promise<boolean> {
    return this.clickNavButton(previousButtonLocator);
  }

  private async clickNavButton(navLocator: PartLocator): Promise<boolean> {
    // Clicking an absent or disabled control is a no-op; isNavDisabled already
    // treats a missing control as disabled, so reuse it instead of repeating the
    // exists/isDisabled checks.
    if (await this.isNavDisabled(navLocator)) {
      return false;
    }
    await this.interactor.click(locatorUtil.append(this.locator, navLocator));
    return true;
  }

  override get driverName(): string {
    return 'MuiV6TablePaginationDriver';
  }
}
