import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import {
  byAttribute,
  byCssClass,
  byCssSelector,
  byRole,
  ComponentDriver,
  ComponentDriverCtor,
  IComponentDriverOption,
  Interactor,
  listHelper,
  locatorUtil,
  Optional,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

import { DataGridCellQuery } from './DataGridCellQuery';
import { DataGridDataRowDriver } from './DataGridDataRowDriver';
import { DataGridFooterDriver } from './DataGridFooterDriver';
import { DataGridHeaderRowDriver } from './DataGridHeaderRowDriver';

const parts = {
  headerRow: {
    locator: byCssClass('MuiDataGrid-columnHeaders').chain(byCssSelector('[role=row]:first-of-type')),
    driver: DataGridHeaderRowDriver,
  },
  loading: {
    locator: byRole('progressbar'),
    driver: HTMLElementDriver,
  },
  skeletonOverlay: {
    locator: byCssClass('MuiDataGrid-main--hasSkeletonLoadingOverlay'),
    driver: HTMLElementDriver,
  },
  footer: {
    locator: byCssClass('MuiDataGrid-footerContainer'),
    driver: DataGridFooterDriver,
  },
} satisfies ScenePart;

const dataRowLocator = byCssSelector('[role=row][data-rowindex]');

// Toolbar controls are identified by their icon's `data-testid` (`:has()` is supported by both
// jsdom's selector engine and every Playwright browser) — the buttons' aria-labels interpolate
// localized text, so the icon is the stable, locale-independent handle.
const quickFilterTriggerLocator = byCssSelector('.MuiDataGrid-toolbar button:has([data-testid="SearchIcon"])');
const quickFilterInputLocator = byCssSelector('input[role="searchbox"]');
const filterPanelTriggerLocator = byCssSelector('.MuiDataGrid-toolbar button:has([data-testid="FilterListIcon"])');

// The filter panel, select dropdowns, and column menu are portaled to <body>, so they are
// addressed from the document Root. Only one of each is open at a time.
const filterPanelLocator = byCssSelector('.MuiDataGrid-panel', 'Root');
const filterPanelColumnComboboxLocator = byCssSelector(
  '.MuiDataGrid-panel .MuiDataGrid-filterFormColumnInput [role="combobox"]',
  'Root'
);
const filterPanelOperatorComboboxLocator = byCssSelector(
  '.MuiDataGrid-panel .MuiDataGrid-filterFormOperatorInput [role="combobox"]',
  'Root'
);
const filterPanelValueInputLocator = byCssSelector(
  '.MuiDataGrid-panel .MuiDataGrid-filterFormValueInput input',
  'Root'
);
const selectListboxLocator = byCssSelector('[role="listbox"]', 'Root');
const columnMenuLocator = byCssSelector('[role="menu"]', 'Root');
const hideColumnMenuItemLocator = byCssSelector('[role="menu"] li:has([data-testid="VisibilityOffIcon"])', 'Root');

// Both the page-size select's input-base wrapper and its inner combobox carry
// `MuiTablePagination-select`; the role pins the combobox element itself.
const pageSizeComboboxLocator = byCssSelector('.MuiTablePagination-select[role="combobox"]');

const selectedRowCountLocator = byCssClass('MuiDataGrid-selectedRowCount');
const headerCheckboxLocator = byCssSelector('[role=columnheader][data-field="__check__"] input[type="checkbox"]');
const virtualScrollerLocator = byCssClass('MuiDataGrid-virtualScroller');
const overlayWrapperLocator = byCssClass('MuiDataGrid-overlayWrapper');

/** `aria-sort` attribute values mapped to the driver's sort-direction vocabulary. */
const ariaSortToDirection: Record<string, 'asc' | 'desc' | null> = {
  ascending: 'asc',
  descending: 'desc',
  none: null,
};

/** Rough row-height estimate used to size virtualization scroll steps. */
const estimatedRowHeightPx = 40;

/**
 * Driver for the Material UI v9 DataGridPremium component.
 *
 * Premium is a superset of Pro and the community DataGrid; all three render the
 * same grid DOM (`.MuiDataGrid-*` classes, `role="row"`/`"gridcell"`/`"columnheader"`,
 * `data-rowindex`/`data-colindex`/`data-field`), so this driver also works against
 * DataGridPro and the community DataGrid.
 *
 * The grid root does not carry `data-testid`; to locate the component by test id,
 * place the `data-testid` on the parent element wrapping the grid.
 * @see https://mui.com/x/react-data-grid/
 */
export class DataGridPremiumDriver extends ComponentDriver<typeof parts> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts,
    });
  }

  /**
   * Checks if the data grid is currently loading.
   * @returns A promise that resolves to a boolean indicating if the data grid is loading.
   */
  async isLoading(): Promise<boolean> {
    const result = await Promise.all([this.parts.skeletonOverlay.isVisible(), this.parts.loading.isVisible()]);
    return result.some(v => v);
  }

  /**
   * Waits for the data grid to exit the loading state.
   * @param timeoutMs The maximum time to wait for the load to complete, in milliseconds.
   */
  async waitForLoad(timeoutMs: number = 10000): Promise<void> {
    await this.parts.headerRow.waitUntilComponentState();
    await this.waitUntil({ probeFn: () => this.isLoading(), terminateCondition: false, timeoutMs });
  }

  /**
   * The number of columns currently displayed in the data grid, note that the data grid
   * uses virtualized rendering, therefore the column count heavily depends on the viewport size
   * @returns The number of columns currently displayed in the data grid
   */
  async getColumnCount(): Promise<number> {
    return this.parts.headerRow.getColumnCount();
  }

  /**
   * The array text of the header row, note that columns not shown in the viewport may not be included because of virtualized rendering
   * @returns The array of text of the header row
   */
  async getHeaderText(): Promise<string[]> {
    return this.parts.headerRow.getRowText();
  }

  /**
   * The number of rows currently displayed in the data grid, note that the data grid
   * uses virtualized rendering, therefore the row count heavily depends on the viewport size
   * @returns The number of columns currently displayed in the data grid
   */
  async getRowCount(): Promise<number> {
    const gridRowLocator = locatorUtil.append(this.locator, dataRowLocator);
    return listHelper.getListItemCount(this, gridRowLocator);
  }

  /**
   * Return the data-row driver for the row at the specified index, or null if it does not exist.
   * Data rows expose body cells (`role="cell"`), so this returns a {@link DataGridDataRowDriver}
   * — not a header-row driver, which would look for `role="columnheader"` and find nothing in a
   * body row.
   * @param rowIndex
   * @returns
   */
  async getRow(rowIndex: number): Promise<DataGridDataRowDriver | null> {
    const rowLocator = locatorUtil.append(this.locator, byCssSelector(`[role=row][data-rowindex="${rowIndex}"]`));
    const rowExists = await this.interactor.exists(rowLocator);
    if (rowExists) {
      return new DataGridDataRowDriver(rowLocator, this.interactor, this.commutableOption);
    }

    return null;
  }

  /**
   * The array text of the specified row, note that columns not shown in the viewport may not be included because of virtualized rendering
   * @param rowIndex The index of the row
   * @returns The array of text of the specified row
   */
  async getRowText(rowIndex: number): Promise<string[]> {
    const row = await this.getRow(rowIndex);
    if (row != null) {
      return row.getRowText();
    }
    throw new Error(`Row ${rowIndex} does not exist`);
  }

  /**
   * Get the cell driver for the cell, if the cell does not exist, return null
   * The cell driver is default to HTMLElementDriver, you can specify a different driver class
   * @param query The query to locate the cell
   * @param driverClass Optional, the driver class to use for the cell, default to HTMLElementDriver
   * @returns
   */
  async getCell<DriverT extends ComponentDriver>(
    query: DataGridCellQuery,
    driverClass: ComponentDriverCtor<DriverT> = HTMLElementDriver as ComponentDriverCtor<DriverT>
  ): Promise<DriverT | null> {
    const rowDriver = await this.getRow(query.rowIndex);

    if (rowDriver === null) {
      return null;
    }

    if ('columnIndex' in query) {
      return rowDriver.getCell(query.columnIndex, driverClass);
    }

    return rowDriver.getCell(query.columnField, driverClass);
  }

  /**
   * Get the text content of the cell, if the cell does not exist, throw an error
   * @param query The query to locate the cell
   * @returns
   */
  async getCellText(query: DataGridCellQuery): Promise<string> {
    const cell = await this.getCell(query);
    if (cell != null) {
      const text = await cell.getText();
      return text!;
    }

    const columnIdentifier = 'columnIndex' in query ? query.columnIndex : query.columnField;
    throw new Error(`Cell at row:${query.rowIndex} column:${columnIdentifier} does not exist`);
  }

  //#region Locator helpers
  private rowLocator(rowIndex: number): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector(`[role=row][data-rowindex="${rowIndex}"]`));
  }

  private columnHeaderLocator(field: string): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector(`[role=columnheader][data-field="${field}"]`));
  }

  private cellLocator(query: DataGridCellQuery): PartLocator {
    const cellSelector =
      'columnIndex' in query
        ? byAttribute('data-colindex', String(query.columnIndex))
        : byAttribute('data-field', query.columnField);
    return locatorUtil.append(this.rowLocator(query.rowIndex), cellSelector);
  }

  private describeCell(query: DataGridCellQuery): string {
    const columnIdentifier = 'columnIndex' in query ? query.columnIndex : query.columnField;
    return `row:${query.rowIndex} column:${columnIdentifier}`;
  }

  /**
   * Open a MUI Select dropdown and choose the option carrying the given `data-value`. The
   * dropdown portals its listbox to <body>; waiting for it to close keeps the portal from
   * overlaying whatever the caller interacts with next.
   */
  private async selectFromMuiSelect(comboboxLocator: PartLocator, value: string, timeoutMs: number): Promise<void> {
    await this.interactor.click(comboboxLocator);
    await this.waitUntil({
      probeFn: () => this.interactor.exists(selectListboxLocator),
      terminateCondition: true,
      timeoutMs,
    });
    await this.interactor.click(
      byCssSelector(`[role="listbox"] [role="option"][data-value="${value}"]`, 'Root') as PartLocator
    );
    await this.waitUntil({
      probeFn: () => this.interactor.exists(selectListboxLocator),
      terminateCondition: false,
      timeoutMs,
    });
  }
  //#endregion Locator helpers

  //#region Sorting
  /**
   * The current sort direction of a column, read from its header's `aria-sort`:
   * `'asc'`, `'desc'`, or `null` when the column is unsorted.
   */
  async getSortDirection(field: string): Promise<'asc' | 'desc' | null> {
    const ariaSort = await this.interactor.getAttribute(this.columnHeaderLocator(field), 'aria-sort');
    if (ariaSort == null) {
      throw new Error(`${this.driverName}: column "${field}" is not currently rendered`);
    }
    return ariaSortToDirection[ariaSort] ?? null;
  }

  /**
   * Sort by the given column by clicking its header until the requested direction is active.
   * The default sorting order cycles unsorted → asc → desc, so at most three clicks are needed;
   * a direction the grid never reaches (e.g. removed via a custom `sortingOrder`) throws.
   *
   * @param field The column's field name.
   * @param direction The direction to reach; `null` returns the column to unsorted.
   */
  async sortByColumn(field: string, direction: 'asc' | 'desc' | null = 'asc'): Promise<void> {
    const titleLocator = locatorUtil.append(
      this.locator,
      byCssSelector(`[role=columnheader][data-field="${field}"] .MuiDataGrid-columnHeaderTitleContainer`)
    );
    for (let click = 0; click < 3; click++) {
      if ((await this.getSortDirection(field)) === direction) {
        return;
      }
      await this.interactor.click(titleLocator);
    }
    if ((await this.getSortDirection(field)) === direction) {
      return;
    }
    throw new Error(
      `${this.driverName}: sorting column "${field}" never reached direction ${JSON.stringify(direction)}`
    );
  }
  //#endregion Sorting

  //#region Filtering
  /**
   * Type into the toolbar's quick filter (expanding it first — v9 collapses the search input
   * behind its toolbar trigger). Requires the grid's `showToolbar`. Filtering applies after the
   * grid's input debounce; pair with {@link waitForRowCount} for deterministic assertions.
   */
  async setQuickFilter(text: string): Promise<void> {
    const input = locatorUtil.append(this.locator, quickFilterInputLocator);
    const trigger = locatorUtil.append(this.locator, quickFilterTriggerLocator);
    if (await this.interactor.exists(trigger)) {
      await this.interactor.click(trigger);
    }
    await this.waitUntil({
      probeFn: () => this.interactor.exists(input),
      terminateCondition: true,
      timeoutMs: 10000,
    });
    await this.interactor.enterText(input, text);
  }

  /**
   * Wait until the number of rendered data rows equals `expected` — the deterministic follow-up
   * to debounced operations such as {@link setQuickFilter} and {@link setColumnFilter}.
   */
  async waitForRowCount(expected: number, timeoutMs: number = 10000): Promise<void> {
    const count = await this.waitUntil({
      probeFn: () => this.getRowCount(),
      terminateCondition: expected,
      timeoutMs,
    });
    if (count !== expected) {
      throw new Error(`${this.driverName}: expected ${expected} rows but found ${count} after ${timeoutMs}ms`);
    }
  }

  /**
   * Open the toolbar's filter panel (no-op when already open). Requires `showToolbar`.
   */
  async openFilterPanel(timeoutMs: number = 10000): Promise<void> {
    if (await this.interactor.exists(filterPanelLocator)) {
      return;
    }
    await this.interactor.click(locatorUtil.append(this.locator, filterPanelTriggerLocator));
    await this.waitUntil({
      probeFn: () => this.interactor.exists(filterPanelLocator),
      terminateCondition: true,
      timeoutMs,
    });
  }

  /**
   * Dismiss the filter panel (no-op when closed). The applied filter stays active.
   */
  async closeFilterPanel(timeoutMs: number = 10000): Promise<void> {
    if (!(await this.interactor.exists(filterPanelLocator))) {
      return;
    }
    await this.interactor.pressKey(filterPanelLocator, 'Escape');
    await this.waitUntil({
      probeFn: () => this.interactor.exists(filterPanelLocator),
      terminateCondition: false,
      timeoutMs,
    });
  }

  /**
   * Apply a single-column filter through the filter panel: pick the column (the panel defaults
   * to the grid's first column, which may even be hidden), optionally pick the operator, and
   * type the filter value. The panel is left open, mirroring the user flow; filtering applies
   * after the grid's input debounce — pair with {@link waitForRowCount}.
   *
   * @param field The column's field name.
   * @param value The filter value to type.
   * @param operator Optional operator `data-value` (e.g. `'contains'`, `'equals'`, `'>'`).
   */
  async setColumnFilter(field: string, value: string, operator?: string, timeoutMs: number = 10000): Promise<void> {
    await this.openFilterPanel(timeoutMs);
    await this.selectFromMuiSelect(filterPanelColumnComboboxLocator, field, timeoutMs);
    if (operator != null) {
      await this.selectFromMuiSelect(filterPanelOperatorComboboxLocator, operator, timeoutMs);
    }
    await this.interactor.enterText(filterPanelValueInputLocator, value);
  }
  //#endregion Filtering

  //#region Row selection
  /**
   * Whether the row at the given index is selected (`aria-selected` on the row element).
   */
  async isRowSelected(rowIndex: number): Promise<boolean> {
    const ariaSelected = await this.interactor.getAttribute(this.rowLocator(rowIndex), 'aria-selected');
    return ariaSelected === 'true';
  }

  /**
   * Select the row at the given index via its selection checkbox (no-op when already selected).
   * Requires the grid's `checkboxSelection`.
   */
  async selectRow(rowIndex: number): Promise<void> {
    if (!(await this.isRowSelected(rowIndex))) {
      await this.toggleRowCheckbox(rowIndex);
    }
  }

  /**
   * Deselect the row at the given index via its selection checkbox (no-op when not selected).
   */
  async deselectRow(rowIndex: number): Promise<void> {
    if (await this.isRowSelected(rowIndex)) {
      await this.toggleRowCheckbox(rowIndex);
    }
  }

  private async toggleRowCheckbox(rowIndex: number): Promise<void> {
    await this.interactor.click(locatorUtil.append(this.rowLocator(rowIndex), byCssSelector('input[type="checkbox"]')));
  }

  /**
   * Select every row via the header checkbox (no-op when all are already selected).
   */
  async selectAllRows(): Promise<void> {
    const headerCheckbox = locatorUtil.append(this.locator, headerCheckboxLocator);
    if (!(await this.interactor.isChecked(headerCheckbox))) {
      await this.interactor.click(headerCheckbox);
    }
  }

  /**
   * Deselect every row via the header checkbox. From the indeterminate state (some rows
   * selected) the first click selects all, so up to two clicks may be needed.
   */
  async deselectAllRows(): Promise<void> {
    const headerCheckbox = locatorUtil.append(this.locator, headerCheckboxLocator);
    for (let click = 0; click < 2 && (await this.getSelectedRowCount()) > 0; click++) {
      await this.interactor.click(headerCheckbox);
    }
  }

  /**
   * The number of selected rows, parsed from the footer's "n rows selected" summary (which the
   * grid only renders while at least one row is selected — its absence means 0). Unlike counting
   * `aria-selected` rows, the summary also covers selected rows that virtualization has not
   * rendered.
   */
  async getSelectedRowCount(): Promise<number> {
    const summaryLocator = locatorUtil.append(this.locator, selectedRowCountLocator);
    if (!(await this.interactor.exists(summaryLocator))) {
      return 0;
    }
    const text = (await this.interactor.getText(summaryLocator)) ?? '';
    const match = /([\d,]+)/.exec(text);
    return match == null ? 0 : Number(match[1].replace(/,/g, ''));
  }
  //#endregion Row selection

  //#region Cell editing
  /**
   * Put the cell into edit mode: click it (moving the grid's focus there) and press Enter — the
   * grid's keyboard path into editing. The column must be `editable`.
   */
  async startCellEdit(query: DataGridCellQuery, timeoutMs: number = 10000): Promise<void> {
    const cell = this.cellLocator(query);
    if (!(await this.interactor.exists(cell))) {
      throw new Error(`${this.driverName}: cell at ${this.describeCell(query)} does not exist`);
    }
    await this.interactor.click(cell);
    await this.interactor.pressKey(cell, 'Enter');
    const editing = await this.waitUntil({
      probeFn: () => this.isCellEditing(query),
      terminateCondition: true,
      timeoutMs,
    });
    if (!editing) {
      throw new Error(
        `${this.driverName}: cell at ${this.describeCell(query)} never entered edit mode — is the column marked editable?`
      );
    }
  }

  /**
   * Whether the cell is currently in edit mode.
   */
  async isCellEditing(query: DataGridCellQuery): Promise<boolean> {
    return this.interactor.hasCssClass(this.cellLocator(query), 'MuiDataGrid-cell--editing');
  }

  /**
   * Replace the value in the cell's editor, entering edit mode first if needed. The value is not
   * committed until {@link commitCellEdit} (or discarded by {@link cancelCellEdit}).
   */
  async setCellValue(query: DataGridCellQuery, value: string, timeoutMs: number = 10000): Promise<void> {
    if (!(await this.isCellEditing(query))) {
      await this.startCellEdit(query, timeoutMs);
    }
    await this.interactor.enterText(this.editingInputLocator(query), value);
  }

  /**
   * Commit the pending cell edit with Enter and wait for edit mode to end.
   */
  async commitCellEdit(query: DataGridCellQuery, timeoutMs: number = 10000): Promise<void> {
    await this.interactor.pressKey(this.editingInputLocator(query), 'Enter');
    await this.waitUntil({
      probeFn: () => this.isCellEditing(query),
      terminateCondition: false,
      timeoutMs,
    });
  }

  /**
   * Discard the pending cell edit with Escape and wait for edit mode to end.
   */
  async cancelCellEdit(query: DataGridCellQuery, timeoutMs: number = 10000): Promise<void> {
    await this.interactor.pressKey(this.editingInputLocator(query), 'Escape');
    await this.waitUntil({
      probeFn: () => this.isCellEditing(query),
      terminateCondition: false,
      timeoutMs,
    });
  }

  private editingInputLocator(query: DataGridCellQuery): PartLocator {
    return locatorUtil.append(this.cellLocator(query), byCssSelector('input'));
  }
  //#endregion Cell editing

  //#region Column management
  /**
   * Open the column's menu. The menu trigger only shows on header hover, so the header is
   * hovered first.
   */
  async openColumnMenu(field: string, timeoutMs: number = 10000): Promise<void> {
    const header = this.columnHeaderLocator(field);
    await this.interactor.hover(header);
    await this.interactor.click(locatorUtil.append(header, byCssSelector('.MuiDataGrid-menuIcon button')));
    await this.waitUntil({
      probeFn: () => this.interactor.exists(columnMenuLocator),
      terminateCondition: true,
      timeoutMs,
    });
  }

  /**
   * Hide the column through its column menu ("Hide column" — identified by its icon, so the
   * entry stays locale-independent) and wait for the header to leave the DOM. Re-showing a
   * hidden column goes through the "Manage columns" panel, which this driver does not cover.
   */
  async hideColumn(field: string, timeoutMs: number = 10000): Promise<void> {
    await this.openColumnMenu(field, timeoutMs);
    await this.interactor.click(hideColumnMenuItemLocator);
    await this.waitUntil({
      probeFn: () => this.interactor.exists(this.columnHeaderLocator(field)),
      terminateCondition: false,
      timeoutMs,
    });
  }
  //#endregion Column management

  //#region Page size and overlays
  /**
   * The rows-per-page currently selected in the footer's page-size select.
   */
  async getPageSize(): Promise<number> {
    const text = await this.interactor.getText(locatorUtil.append(this.locator, pageSizeComboboxLocator));
    return Number(text);
  }

  /**
   * Change the rows-per-page through the footer's page-size select. The size must be one of the
   * grid's `pageSizeOptions`.
   */
  async setPageSize(size: number, timeoutMs: number = 10000): Promise<void> {
    await this.selectFromMuiSelect(locatorUtil.append(this.locator, pageSizeComboboxLocator), String(size), timeoutMs);
    const applied = await this.waitUntil({
      probeFn: () => this.getPageSize(),
      terminateCondition: size,
      timeoutMs,
    });
    if (applied !== size) {
      throw new Error(`${this.driverName}: page size never became ${size} (still ${applied})`);
    }
  }

  /**
   * Whether the grid is showing an empty-state overlay (e.g. "No rows") — an overlay wrapper is
   * mounted and the grid is not merely loading.
   */
  async isEmpty(): Promise<boolean> {
    const overlayExists = await this.interactor.exists(locatorUtil.append(this.locator, overlayWrapperLocator));
    if (!overlayExists) {
      return false;
    }
    return !(await this.isLoading());
  }
  //#endregion Page size and overlays

  //#region Virtualization
  /**
   * Bring a virtualized row into the rendered window by paging the grid's virtual scroller
   * toward it, then scroll it into the viewport. Rows outside the current page cannot be
   * reached — change pages instead. jsdom has no layout engine, so there the grid renders the
   * whole page and this resolves immediately; genuine scrolling behavior is E2E-only.
   */
  async scrollRowIntoView(rowIndex: number, timeoutMs: number = 10000): Promise<void> {
    const row = this.rowLocator(rowIndex);
    const scroller = locatorUtil.append(this.locator, virtualScrollerLocator);
    const gridRowLocator = locatorUtil.append(this.locator, dataRowLocator);
    const found = await this.waitUntil({
      probeFn: async () => {
        if (await this.interactor.exists(row)) {
          return true;
        }
        // Step the scroller toward the target, sized by how far the rendered window is from it.
        const renderedIndexes = (await this.interactor.getAttribute(gridRowLocator, 'data-rowindex', true)).map(Number);
        if (renderedIndexes.length > 0) {
          const nearestRendered =
            rowIndex > Math.max(...renderedIndexes) ? Math.max(...renderedIndexes) : Math.min(...renderedIndexes);
          const stepPx = (rowIndex - nearestRendered) * estimatedRowHeightPx;
          await this.interactor.scrollBy(scroller, { x: 0, y: stepPx });
        }
        return this.interactor.exists(row);
      },
      terminateCondition: true,
      timeoutMs,
    });
    if (!found) {
      throw new Error(
        `${this.driverName}: row ${rowIndex} never rendered — it may be outside the current page or filtered out`
      );
    }
    await this.interactor.scrollIntoView(row);
  }
  //#endregion Virtualization

  //#region Footer
  /**
   * Determine if the pagination footer is currently visible.
   */
  isFooterVisible(): Promise<boolean> {
    return this.parts.footer.isVisible();
  }

  /**
   * Check whether the "previous page" control is enabled.
   */
  async isPreviousPageEnabled(): Promise<boolean> {
    await this.enforcePartExistence('footer');
    return this.parts.footer.isPreviousPageEnabled();
  }

  /**
   * Navigate to the previous page using the grid footer control.
   */
  async gotoPreviousPage(): Promise<void> {
    await this.enforcePartExistence('footer');
    await this.parts.footer.gotoPreviousPage();
  }

  /**
   * Check whether the "next page" control is enabled.
   */
  async isNextPageEnabled(): Promise<boolean> {
    await this.enforcePartExistence('footer');
    return this.parts.footer.isNextPageEnabled();
  }

  /**
   * Navigate to the next page using the grid footer control.
   */
  async gotoNextPage(): Promise<void> {
    await this.enforcePartExistence('footer');
    await this.parts.footer.gotoNextPage();
  }

  /**
   * Read the textual description of the current pagination state (e.g. "1–10 of 100").
   */
  async getPaginationDescription(): Promise<Optional<string>> {
    await this.enforcePartExistence('footer');
    return this.parts.footer.getPaginationDescription();
  }
  //#endregion Footer

  override get driverName(): string {
    return 'MuiV9DataGridPremiumDriver';
  }
}
