import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import {
  byCssSelector,
  childListHelper,
  ComponentDriver,
  locatorUtil,
  Optional,
  PartLocator,
} from '@atomic-testing/core';

import { DataTableRowDriver } from './DataTableRowDriver';

/** CSS for a table row — the ARIA role PrimeVue stamps on every `<tr>`. */
const rowSelector = '[role="row"]';
/** CSS for a header cell — the ARIA role PrimeVue stamps on every `<th>`. */
const columnHeaderSelector = '[role="columnheader"]';
/** ARIA sort state a sortable `<th>` reports; the initial/non-sortable state is `'none'`. */
export type SortDirection = 'ascending' | 'descending' | 'none';

/**
 * Driver for the PrimeVue `DataTable` component (with `Column` children).
 *
 * DOM audit (primevue@4.5.5): the root `<div data-pc-name="datatable">` wraps
 * a REAL `<table role="table">` whose `<tr>`/`<th>`/`<td>` carry
 * `role="row"`/`"columnheader"`/`"cell"` — native table semantics, which the
 * row/cell reads anchor on. The `<thead>` and `<tbody>` both render
 * `role="rowgroup"`, so the role cannot distinguish them; the two section
 * anchors use PrimeVue's own `data-pc-section="thead"/"tbody"` markers
 * instead (the documented tier-2 fallback).
 *
 * Row/cell iteration uses `childListHelper` (`:nth-child` position walk with
 * a per-position selector check) — the guard against the truncated-enumeration
 * bug class the root CLAUDE.md records — so interleaved non-row children a
 * future PrimeVue version might render can never silently shorten counts.
 *
 * **Sorting (#1034).** DOM audit (primevue@4.5.5): a sortable column's `<th>`
 * carries `aria-sort` (`'ascending'`/`'descending'`, absent — read as `'none'`
 * — otherwise) and toggles on a plain click of the header cell; PrimeVue's
 * single-sort mode never returns to `'none'` once a column has been clicked
 * (verified empirically), it only flips between the two sorted states.
 * {@link sortBy} clicks up to twice to reach a target direction from any
 * starting state. Header cells are matched by their trimmed label text (the
 * `data-pc-section="columntitle"` span), same identity {@link getColumnLabels}
 * already uses.
 *
 * **Row selection (#1034).** DOM audit (primevue@4.5.5): with the DataTable's
 * `selectionMode` set, each body `<tr>` gets `aria-selected` — the read
 * {@link DataTableRowDriver.isSelected} uses. Writing selects through whichever
 * affordance the scene renders: a checkbox-column cell
 * (`data-p-selection-column="true"`, a REAL native checkbox — ground truth via
 * `Interactor.isChecked`) if present, else a plain click on the row itself
 * (row-click selection). The header select-all checkbox
 * (`data-pc-name="pcheadercheckbox"`) is a real native checkbox too, read the
 * same way. A checkbox-selection column has no header label
 * (`getColumnLabels`/`getColumnCount` still count it — it reports `''`).
 *
 * **Pagination (#1034).** DOM audit (primevue@4.5.5): PrimeVue's `Paginator`
 * renders as a `<nav>` DIRECT descendant of the table root (a sibling of the
 * table container, outside `<thead>`/`<tbody>` — {@link getRowCount} and
 * friends become page-scoped once paginated, not a change to those methods).
 * Prev/next/first/last are `data-pc-section="prev"/"next"/"first"/"last"`
 * `<button>`s with a native `disabled` attribute at a bound; page-number
 * buttons are `data-pc-section="page"` with `data-p-active="true"` on the
 * current one and an `aria-label="Page N"` that is LOCALIZED — {@link goToPage}
 * therefore matches on the button's visible text (just the digits, locale-independent)
 * rather than that label, the same identity {@link getCurrentPage} already reads.
 * {@link getPageCount} counts
 * currently-rendered page buttons — PrimeVue slides a window of page links
 * (default size 5) for large datasets, so it undercounts total pages beyond
 * that window; exact for small datasets, a known bound for large ones.
 *
 * **Deferred (audited, not implemented): filtering, virtual scroll, frozen
 * columns, cell editing.** Filtering's rendered control is CONSUMER-authored
 * (`<Column>`'s `#filter` template slot — verified empirically that PrimeVue
 * renders nothing for `filter: true` alone, only the slot's own content, e.g.
 * an `InputText`), so there is no single PrimeVue-owned filter-input contract
 * for a generic `setColumnFilter` to drive; filter menus (`showFilterMenu`)
 * additionally teleport, reusing the overlay recipe from this package's
 * `SelectDriver`/`MenuDriver`. Both need a follow-up scoped around a specific
 * filter control, not a blanket API. Virtual scroll has no layout in jsdom (per
 * CLAUDE.md's E2E-only precedent) and needs its own scene audit. Cell editing
 * was blocked on #903 (the keystroke `Interactor` primitive); #903 has since
 * landed, so it is unblocked, but — mirroring the filter finding — PrimeVue's
 * cell editor is also consumer-authored via `<Column>`'s `#editor` slot, so it
 * needs the same kind of control-specific follow-up rather than a generic API.
 */
export class DataTableDriver extends ComponentDriver<{}> {
  private get tbodyLocator(): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector('[data-pc-section="tbody"]'));
  }

  private get headerRowLocator(): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector('[data-pc-section="thead"]'), byCssSelector(rowSelector));
  }

  private get selectAllCheckboxLocator(): PartLocator {
    return locatorUtil.append(
      this.headerRowLocator,
      byCssSelector('[data-pc-name="pcheadercheckbox"] input[type="checkbox"]')
    );
  }

  /** The number of body rows (page-scoped once a paginator is active — see the class doc). */
  async getRowCount(): Promise<number> {
    return childListHelper.countMatchingChildren(this.interactor, this.tbodyLocator, rowSelector);
  }

  /** The body row at the given zero-based index, or `null` if out of range. */
  async getRowByIndex(index: number): Promise<DataTableRowDriver | null> {
    let position = 0;
    for await (const row of childListHelper.iterateMatchingChildren(
      this,
      this.tbodyLocator,
      rowSelector,
      DataTableRowDriver
    )) {
      if (position === index) {
        return row;
      }
      position++;
    }
    return null;
  }

  /** Trimmed header label of every column, in DOM order (a selection-checkbox column reports `''`). */
  async getColumnLabels(): Promise<string[]> {
    const labels: string[] = [];
    for await (const header of childListHelper.iterateMatchingChildren(
      this,
      this.headerRowLocator,
      columnHeaderSelector,
      HTMLElementDriver
    )) {
      labels.push((await header.getText())?.trim() ?? '');
    }
    return labels;
  }

  /** The number of columns (header cells), including any checkbox-selection column. */
  async getColumnCount(): Promise<number> {
    return childListHelper.countMatchingChildren(this.interactor, this.headerRowLocator, columnHeaderSelector);
  }

  /**
   * Click the column labelled `columnLabel` until its `aria-sort` reaches
   * `direction`, up to two clicks (see the class doc's "Sorting" note).
   * @returns `false` when no column has that label; otherwise whether `direction` was reached
   */
  async sortBy(columnLabel: string, direction: 'ascending' | 'descending'): Promise<boolean> {
    const header = await this.getHeaderCellByLabel(columnLabel);
    if (header == null) {
      return false;
    }
    for (let attempt = 0; attempt < 3; attempt++) {
      if ((await header.getAttribute('aria-sort')) === direction) {
        return true;
      }
      await header.click();
    }
    return (await header.getAttribute('aria-sort')) === direction;
  }

  /** The sort state of the column labelled `columnLabel`, or `null` when no column has that label. */
  async getSortDirection(columnLabel: string): Promise<Optional<SortDirection>> {
    const header = await this.getHeaderCellByLabel(columnLabel);
    if (header == null) {
      return undefined;
    }
    const raw = await header.getAttribute('aria-sort');
    return (raw as Optional<SortDirection>) ?? 'none';
  }

  private async getHeaderCellByLabel(columnLabel: string): Promise<HTMLElementDriver | null> {
    for await (const header of childListHelper.iterateMatchingChildren(
      this,
      this.headerRowLocator,
      columnHeaderSelector,
      HTMLElementDriver
    )) {
      if (((await header.getText())?.trim() ?? '') === columnLabel) {
        return header;
      }
    }
    return null;
  }

  /** Select the row at `index` via its checkbox column, or a row click if there is none. @returns `false` if out of range */
  async selectRow(index: number): Promise<boolean> {
    const row = await this.getRowByIndex(index);
    if (row == null) {
      return false;
    }
    await row.select();
    return true;
  }

  /** Deselect the row at `index`. @returns `false` if out of range */
  async deselectRow(index: number): Promise<boolean> {
    const row = await this.getRowByIndex(index);
    if (row == null) {
      return false;
    }
    await row.deselect();
    return true;
  }

  /** Whether the row at `index` is selected (`aria-selected`), or `undefined` if out of range. */
  async isRowSelected(index: number): Promise<Optional<boolean>> {
    const row = await this.getRowByIndex(index);
    return row == null ? undefined : row.isSelected();
  }

  /** Whether the header select-all checkbox exists (a checkbox-selection column with `selectionMode="multiple"`). */
  async hasSelectAllCheckbox(): Promise<boolean> {
    return this.interactor.exists(this.selectAllCheckboxLocator);
  }

  /** The header select-all checkbox's checked state (native `checked` property). */
  async isAllRowsSelected(): Promise<boolean> {
    return this.interactor.isChecked(this.selectAllCheckboxLocator);
  }

  /** Check the header select-all checkbox, if not already checked. @returns `false` if there is no such checkbox */
  async selectAllRows(): Promise<boolean> {
    if (!(await this.hasSelectAllCheckbox())) {
      return false;
    }
    if (!(await this.isAllRowsSelected())) {
      await this.interactor.click(this.selectAllCheckboxLocator);
    }
    return true;
  }

  /** Uncheck the header select-all checkbox, if checked. @returns `false` if there is no such checkbox */
  async deselectAllRows(): Promise<boolean> {
    if (!(await this.hasSelectAllCheckbox())) {
      return false;
    }
    if (await this.isAllRowsSelected()) {
      await this.interactor.click(this.selectAllCheckboxLocator);
    }
    return true;
  }

  /** Whether a `Paginator` is rendered for this table. */
  async hasPaginator(): Promise<boolean> {
    return this.interactor.exists(this.paginatorLocator);
  }

  /** Navigate to the page whose visible number is `pageNumber`. @returns `false` when that page link isn't rendered */
  async goToPage(pageNumber: number): Promise<boolean> {
    const button = await this.getPageButtonByNumber(pageNumber);
    if (button == null) {
      return false;
    }
    await button.click();
    return true;
  }

  /** Advance to the next page. @returns `false` when there is no paginator or already on the last page */
  async nextPage(): Promise<boolean> {
    return this.clickPaginatorButton('next');
  }

  /** Go back to the previous page. @returns `false` when there is no paginator or already on the first page */
  async previousPage(): Promise<boolean> {
    return this.clickPaginatorButton('prev');
  }

  /** The currently active page number, or `undefined` when there is no paginator. */
  async getCurrentPage(): Promise<Optional<number>> {
    const locator = locatorUtil.append(
      this.paginatorLocator,
      byCssSelector('[data-pc-section="page"][data-p-active="true"]')
    );
    if (!(await this.interactor.exists(locator))) {
      return undefined;
    }
    const text = await this.interactor.getText(locator);
    const parsed = text ? Number.parseInt(text.trim(), 10) : Number.NaN;
    return Number.isNaN(parsed) ? undefined : parsed;
  }

  /**
   * The number of CURRENTLY RENDERED page-number buttons — see the class
   * doc's "Pagination" note on the sliding-window bound for large datasets.
   */
  async getPageCount(): Promise<number> {
    return childListHelper.countMatchingChildren(this.interactor, this.pagesLocator, '[data-pc-section="page"]');
  }

  private get paginatorLocator(): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector('[data-pc-name="pcpaginator"]'));
  }

  private get pagesLocator(): PartLocator {
    return locatorUtil.append(this.paginatorLocator, byCssSelector('[data-pc-section="pages"]'));
  }

  /** The page-number button whose visible text is `pageNumber`, or `null` if not rendered. */
  private async getPageButtonByNumber(pageNumber: number): Promise<HTMLElementDriver | null> {
    const target = String(pageNumber);
    for await (const button of childListHelper.iterateMatchingChildren(
      this,
      this.pagesLocator,
      '[data-pc-section="page"]',
      HTMLElementDriver
    )) {
      if (((await button.getText())?.trim() ?? '') === target) {
        return button;
      }
    }
    return null;
  }

  private async clickPaginatorButton(section: 'next' | 'prev'): Promise<boolean> {
    const locator = locatorUtil.append(this.paginatorLocator, byCssSelector(`[data-pc-section="${section}"]`));
    if (!(await this.interactor.exists(locator)) || (await this.interactor.isDisabled(locator))) {
      return false;
    }
    await this.interactor.click(locator);
    return true;
  }

  get driverName(): string {
    return 'PrimeVueV4DataTableDriver';
  }
}
