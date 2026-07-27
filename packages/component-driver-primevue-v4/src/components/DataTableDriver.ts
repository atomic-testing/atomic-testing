import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import {
  byCssSelector,
  childListHelper,
  ComponentDriver,
  locatorUtil,
  Optional,
  PartLocator,
} from '@atomic-testing/core';

import { byAriaIdReference } from '../internal/ariaLinkedLocators';
import { DataTableRowDriver } from './DataTableRowDriver';

/** CSS for a table row — the ARIA role PrimeVue stamps on every `<tr>`. */
const rowSelector = '[role="row"]';
/** CSS for a header cell — the ARIA role PrimeVue stamps on every `<th>`. */
const columnHeaderSelector = '[role="columnheader"]';
/** ARIA sort state a sortable `<th>` reports; the initial/non-sortable state is `'none'`. */
export type SortDirection = 'ascending' | 'descending' | 'none';
// A ceiling, not a sleep: waitUntil returns as soon as the probe flips. The filter overlay's
// enter/leave transition is the same PrimeVue anchored-overlay mechanism Select/Menu use (see
// their drivers' identical constant), so it shares their 1000ms ceiling.
const defaultFilterTransitionMs = 1000;
/**
 * Rough row-height estimate used to size virtual-scroll steps in {@link DataTableDriver.scrollRowIntoView}
 * when the caller doesn't know their table's `virtualScrollerOptions.itemSize` — override with the real
 * value for precise stepping. Mirrors the MUI `DataGridPremiumDriver`'s identical estimate/caveat.
 */
const estimatedVirtualScrollRowHeightPx = 46;

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
 * starting state. Header cells are matched by the whole `role="columnheader"`
 * `<th>`'s trimmed visible text, same identity {@link getColumnLabels} already
 * uses.
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
 * **Filtering (#1034), scoped to `filterDisplay="menu"`.** DOM audit
 * (primevue@4.5.5): a filterable column's `<th>` carries a
 * `.p-datatable-column-filter-button` trigger with `aria-expanded` and an
 * `aria-controls` id-link to the filter panel — the SAME `byAriaIdReference`
 * overlay recipe {@link SelectDriver}'s `dropdown` part already uses, reused
 * here rather than a fresh mechanism. The panel (`role="dialog"`, teleported
 * to `document.body`) holds the match-mode picker, the filter's `#filter`-slot
 * value control (CONSUMER-authored — verified empirically that PrimeVue
 * renders nothing for `filter: true` alone; {@link setColumnFilter} assumes it
 * renders a plain `<input>`, the same assumption MUI's `DataGridPremiumDriver`
 * makes for its filter panel), and PrimeVue-owned Apply/Clear buttons
 * (`data-pc-name="pcfilterapplybutton"`/`"pcfilterclearbutton"` — locale-independent,
 * like this driver's `pcheadercheckbox`). Apply/Clear both commit AND close the
 * panel (verified: `aria-expanded` flips to `false` immediately; the panel's
 * own DOM removal lags behind by its leave transition, which
 * {@link openFilterMenu}/{@link closeFilterMenu}'s `waitUntil` absorbs).
 *
 * **Focus-trap race (same class as {@link DialogDriver}'s documented one).**
 * The overlay is focus-trapped and grabs initial focus a frame after mount —
 * verified to occasionally swallow every keystroke a caller types immediately
 * after opening (a truncated-to-EMPTY value, not merely truncated text, since
 * the whole type happened before the trap's grab). {@link openFilterMenu}
 * absorbs this itself (a `:focus-within` wait mirroring
 * {@link DialogDriver.waitForOpen}) before returning, so {@link setColumnFilter}
 * and every other caller of it types/reads/clicks safely without its own workaround.
 * **`filterDisplay="row"` (the inline per-column filter row) is a DIFFERENT
 * DOM shape — its own "Show Filter Menu" popup is match-mode-only, with the
 * value input inline in the header instead — and is NOT covered here**; it
 * needs its own follow-up, the same "specific control" scoping this class doc
 * has recorded since #1034's first wave.
 *
 * **Virtual scroll (#1034): audited, minimal E2E-only support.** DOM audit
 * (primevue@4.5.5, `virtualScrollerOptions`): jsdom's zero layout is a harder
 * failure mode here than MUI's DataGrid (which at least renders its whole
 * unwindowed page in jsdom) — PrimeVue's `VirtualScroller` computes how many
 * rows FIT from the container's `clientHeight`, which jsdom always reports as
 * `0`, so it renders **zero or one** row regardless of dataset size. No jsdom
 * assertion on row count/content is meaningful for a virtual-scroll table —
 * asserting one would be exactly the vacuously-green failure class the root
 * CLAUDE.md warns about. What DOES still work in jsdom: scrolling the
 * `.p-virtualscroller` container recomputes which row(s) are rendered from
 * `scrollTop`, so {@link scrollRowIntoView} at least exercises its code path
 * everywhere; its actual "bring a specific row into a multi-row rendered
 * window" behavior is E2E-only, mirroring the MUI driver's identical
 * `scrollRowIntoView` and its identical caveat.
 *
 * **Cell editing (#1034): see {@link DataTableRowDriver}.** #903 (the keystroke
 * `Interactor` primitive) unblocked it; DOM audit found `editMode="cell"`
 * needs no keystroke to ENTER edit (a plain click suffices — PrimeVue marks a
 * column editable purely by the presence of an `#editor` slot, no `editable`
 * prop), only to commit (`Enter`) or cancel (`Escape`) — the opposite split
 * from MUI's DataGrid, which needs a keystroke to enter. The editor control is
 * consumer-authored (`#editor` slot), so {@link DataTableRowDriver.setCellValue}
 * makes the same plain-`<input>` assumption as the filter's value control.
 *
 * **Deferred (audited, not implemented): `filterDisplay="row"` inline
 * filtering, frozen columns.** Both need their own control-specific follow-up
 * — see the notes above.
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

  /**
   * The row whose `data-p-index` equals `dataIndex` — PrimeVue's own per-row data index, stamped
   * on every body row (verified present outside virtual scroll too) and stable regardless of
   * scroll position, unlike {@link getRowByIndex}'s DOM-position addressing (which shifts once
   * virtual scroll windows the rendered rows — see {@link scrollRowIntoView}).
   * @returns `null` when that row isn't currently rendered.
   */
  async getRowByDataIndex(dataIndex: number): Promise<DataTableRowDriver | null> {
    const locator = locatorUtil.append(this.tbodyLocator, byCssSelector(`[data-p-index="${dataIndex}"]`));
    if (!(await this.interactor.exists(locator))) {
      return null;
    }
    return new DataTableRowDriver(locator, this.interactor, this.commutableOption);
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
    for (let clicks = 0; clicks < 2; clicks++) {
      if ((await header.getAttribute('aria-sort')) === direction) {
        return true;
      }
      await header.click();
    }
    return (await header.getAttribute('aria-sort')) === direction;
  }

  /** The sort state of the column labelled `columnLabel`, or `undefined` when no column has that label. */
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

  /** Whether the column labelled `columnLabel` has a filter (a `filterDisplay="menu"` trigger). */
  async hasColumnFilter(columnLabel: string): Promise<boolean> {
    return (await this.resolveFilterElements(columnLabel)) != null;
  }

  /** Whether the column's filter overlay is currently open. `undefined` when no such column/filter. */
  async isFilterMenuOpen(columnLabel: string): Promise<Optional<boolean>> {
    const resolved = await this.resolveFilterElements(columnLabel);
    if (resolved == null) {
      return undefined;
    }
    return (await this.interactor.getAttribute(resolved.trigger, 'aria-expanded')) === 'true';
  }

  /** Open the column's filter overlay (no-op if already open). @returns `false` when no such column/filter. */
  async openFilterMenu(columnLabel: string, timeoutMs: number = defaultFilterTransitionMs): Promise<boolean> {
    const resolved = await this.resolveFilterElements(columnLabel);
    if (resolved == null) {
      return false;
    }
    return this.openResolvedFilterMenu(resolved, timeoutMs);
  }

  private async openResolvedFilterMenu(
    resolved: { header: PartLocator; trigger: PartLocator },
    timeoutMs: number
  ): Promise<boolean> {
    if ((await this.interactor.getAttribute(resolved.trigger, 'aria-expanded')) === 'true') {
      return true;
    }
    await this.interactor.click(resolved.trigger);
    const opened = await this.waitForFilterTriggerExpanded(resolved.trigger, true, timeoutMs);
    if (opened) {
      await this.waitForFilterOverlayFocusSettled(resolved.header, timeoutMs);
    }
    return opened;
  }

  /**
   * PrimeVue's filter overlay is focus-trapped and grabs initial focus a frame after mount — the
   * same class of race {@link DialogDriver}'s `waitForOpen` documents ("an interaction issued in
   * that window can lose focus mid-gesture"), verified here to occasionally swallow every
   * keystroke {@link setColumnFilter} types. Best-effort (`:focus-within`, tolerated to fail): a
   * caller-typed value is confirmed by the caller regardless.
   */
  private async waitForFilterOverlayFocusSettled(headerLocator: PartLocator, timeoutMs: number): Promise<void> {
    const focusedLocator = locatorUtil.append(
      this.filterOverlayLocator(headerLocator),
      byCssSelector(':focus-within', 'Same')
    );
    await this.interactor.waitUntil({
      probeFn: () => this.interactor.exists(focusedLocator),
      terminateCondition: true,
      timeoutMs,
    });
  }

  /** Close the column's filter overlay (no-op if already closed). @returns `false` when no such column/filter. */
  async closeFilterMenu(columnLabel: string, timeoutMs: number = defaultFilterTransitionMs): Promise<boolean> {
    const resolved = await this.resolveFilterElements(columnLabel);
    if (resolved == null) {
      return false;
    }
    if ((await this.interactor.getAttribute(resolved.trigger, 'aria-expanded')) !== 'true') {
      return true;
    }
    await this.interactor.click(resolved.trigger);
    return this.waitForFilterTriggerExpanded(resolved.trigger, false, timeoutMs);
  }

  /**
   * Type `value` into the column's filter overlay (opening it first if needed) and commit with
   * Apply — see the class doc's "Filtering" note for why the value control is assumed to be a
   * plain `<input>`.
   * @returns `false` when no such column/filter, or the filter's value control isn't a plain input.
   */
  async setColumnFilter(
    columnLabel: string,
    value: string,
    timeoutMs: number = defaultFilterTransitionMs
  ): Promise<boolean> {
    const resolved = await this.resolveFilterElements(columnLabel);
    if (resolved == null || !(await this.openResolvedFilterMenu(resolved, timeoutMs))) {
      return false;
    }
    const overlay = this.filterOverlayLocator(resolved.header);
    const input = locatorUtil.append(overlay, byCssSelector('.p-datatable-filter-rule-list input'));
    if (!(await this.interactor.exists(input))) {
      return false;
    }
    await this.interactor.enterText(input, value);
    await this.interactor.click(locatorUtil.append(overlay, byCssSelector('[data-pc-name="pcfilterapplybutton"]')));
    await this.waitForFilterTriggerExpanded(resolved.trigger, false, timeoutMs);
    return true;
  }

  /**
   * Read the column filter's current value — opens the overlay first if needed (left open
   * afterward), reading it back from the value input.
   * @returns `undefined` when no such column/filter, or the filter's value control isn't a plain input.
   */
  async getColumnFilterValue(
    columnLabel: string,
    timeoutMs: number = defaultFilterTransitionMs
  ): Promise<Optional<string>> {
    const resolved = await this.resolveFilterElements(columnLabel);
    if (resolved == null || !(await this.openResolvedFilterMenu(resolved, timeoutMs))) {
      return undefined;
    }
    const overlay = this.filterOverlayLocator(resolved.header);
    const input = locatorUtil.append(overlay, byCssSelector('.p-datatable-filter-rule-list input'));
    if (!(await this.interactor.exists(input))) {
      return undefined;
    }
    return (await this.interactor.getInputValue(input)) ?? '';
  }

  /**
   * Click the filter overlay's Clear button (opening it first if needed), resetting the column's
   * filter. @returns `false` when no such column/filter.
   */
  async clearColumnFilter(columnLabel: string, timeoutMs: number = defaultFilterTransitionMs): Promise<boolean> {
    const resolved = await this.resolveFilterElements(columnLabel);
    if (resolved == null || !(await this.openResolvedFilterMenu(resolved, timeoutMs))) {
      return false;
    }
    const overlay = this.filterOverlayLocator(resolved.header);
    const clearButton = locatorUtil.append(overlay, byCssSelector('[data-pc-name="pcfilterclearbutton"]'));
    if (!(await this.interactor.exists(clearButton))) {
      return false;
    }
    await this.interactor.click(clearButton);
    await this.waitForFilterTriggerExpanded(resolved.trigger, false, timeoutMs);
    return true;
  }

  private filterTriggerLocator(headerLocator: PartLocator): PartLocator {
    return locatorUtil.append(headerLocator, byCssSelector('.p-datatable-column-filter-button'));
  }

  /**
   * `'Root'`-relative locator for the filter overlay teleported to `document.body` — the same
   * `byAriaIdReference` recipe {@link SelectDriver}'s `dropdown` part uses, keyed off the
   * trigger's own `aria-controls`.
   */
  private filterOverlayLocator(headerLocator: PartLocator): PartLocator {
    return locatorUtil.append(
      headerLocator,
      byAriaIdReference(byCssSelector('.p-datatable-column-filter-button'), 'aria-controls')
    );
  }

  private async resolveFilterElements(
    columnLabel: string
  ): Promise<{ header: PartLocator; trigger: PartLocator } | null> {
    const header = await this.getHeaderCellByLabel(columnLabel);
    if (header == null) {
      return null;
    }
    const trigger = this.filterTriggerLocator(header.locator);
    if (!(await this.interactor.exists(trigger))) {
      return null;
    }
    return { header: header.locator, trigger };
  }

  private async waitForFilterTriggerExpanded(
    trigger: PartLocator,
    expanded: boolean,
    timeoutMs: number
  ): Promise<boolean> {
    const target = expanded ? 'true' : 'false';
    const state = await this.interactor.waitUntil({
      probeFn: () => this.interactor.getAttribute(trigger, 'aria-expanded'),
      terminateCondition: target,
      timeoutMs,
    });
    return state === target;
  }

  /**
   * Bring a virtualized row into the rendered window by paging the `.p-virtualscroller`
   * container toward it, then scroll it into the viewport. See the class doc's "Virtual scroll"
   * note: this is E2E-only — jsdom renders zero or one row regardless, so this can exercise the
   * code path there but never actually verify the windowing behavior.
   * @param rowIndex The row's absolute data index (`data-p-index`, stable across scroll position).
   * @param rowHeightPx Row-height estimate for sizing scroll steps; pass the table's actual
   * `virtualScrollerOptions.itemSize` for precise stepping (see {@link estimatedVirtualScrollRowHeightPx}).
   */
  async scrollRowIntoView(
    rowIndex: number,
    timeoutMs: number = 10000,
    rowHeightPx: number = estimatedVirtualScrollRowHeightPx
  ): Promise<boolean> {
    const row = locatorUtil.append(this.tbodyLocator, byCssSelector(`[data-p-index="${rowIndex}"]`));
    const scroller = locatorUtil.append(this.locator, byCssSelector('.p-virtualscroller'));
    if (!(await this.interactor.exists(scroller))) {
      return false;
    }
    const found = await this.waitUntil({
      probeFn: async () => {
        if (await this.interactor.exists(row)) {
          return true;
        }
        const renderedIndexes = (
          await this.interactor.getAttribute(
            locatorUtil.append(this.tbodyLocator, byCssSelector('[data-p-index]')),
            'data-p-index',
            true
          )
        ).map(Number);
        if (renderedIndexes.length > 0) {
          const nearestRendered =
            rowIndex > Math.max(...renderedIndexes) ? Math.max(...renderedIndexes) : Math.min(...renderedIndexes);
          await this.interactor.scrollBy(scroller, { x: 0, y: (rowIndex - nearestRendered) * rowHeightPx });
        }
        return this.interactor.exists(row);
      },
      terminateCondition: true,
      timeoutMs,
    });
    if (found) {
      await this.interactor.scrollIntoView(row);
    }
    return found === true;
  }

  get driverName(): string {
    return 'PrimeVueV4DataTableDriver';
  }
}
