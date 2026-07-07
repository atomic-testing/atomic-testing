import { byAttribute, byCssSelector, ComponentDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

/** `data-column-key` of the synthetic checkbox column Astryx inserts when row selection is enabled. */
const SELECTION_COLUMN_KEY = '__xds_selection';

export type TableSortDirection = 'ascending' | 'descending';

/**
 * Driver for the Astryx Table (`@astryxdesign/core/Table`).
 *
 * Astryx's `Table` does **not** forward `data-testid` to the `<table>`, so the
 * scene anchors this driver on a wrapping element carrying the testid and the
 * driver reaches the native `<table>` (and its `<thead>`/`<tbody>`) as descendants.
 * It reads structure from table semantics and ARIA: column identity from
 * `th[data-column-key]`, sort state from `aria-sort` (present **only** on the
 * actively-sorted header), row selection from `tr[aria-selected]`, and the
 * checkbox column from the synthetic `data-column-key="__xds_selection"` — never
 * from StyleX-hashed classes.
 *
 * `@astryxdesign/core` renders the **full** table (no virtualization), so every
 * row reads faithfully in jsdom as well as the browser; row indices below are
 * zero-based and exclude the header.
 */
export class TableDriver extends ComponentDriver {
  private header(key: string): PartLocator {
    return locatorUtil.append(this.locator, byAttribute('data-column-key', key));
  }

  private row(index: number): PartLocator {
    // Data rows only. Astryx renders an empty-state placeholder row — a single
    // `<td colSpan>` — but **only** when there are no data rows, so excluding any row
    // that contains a `colspan` cell makes getRowCount return 0 for an empty table
    // and keeps row indices aligned to real data. `:has()`/`:not()` resolve
    // identically in jsdom's nwsapi and all three Playwright engines.
    return locatorUtil.append(this.locator, byCssSelector(`tbody tr:not(:has(> td[colspan])):nth-child(${index + 1})`));
  }

  private get selectAllCheckbox(): PartLocator {
    return locatorUtil.append(
      this.locator,
      byAttribute('data-column-key', SELECTION_COLUMN_KEY),
      byCssSelector('input[type="checkbox"]')
    );
  }

  /** The data column headers' visible text, in DOM order (the selection checkbox column is excluded). */
  async getColumnHeaders(): Promise<readonly string[]> {
    const headers: string[] = [];
    for (let k = 1; ; k++) {
      const cell = this.headerCell(k);
      if (!(await this.interactor.exists(cell))) {
        break;
      }
      if ((await this.interactor.getAttribute(cell, 'data-column-key')) === SELECTION_COLUMN_KEY) {
        continue;
      }
      const text = (await this.interactor.getText(cell))?.trim();
      if (text != null) {
        headers.push(text);
      }
    }
    return headers;
  }

  private headerCell(position: number): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector(`thead tr th:nth-child(${position})`));
  }

  /** Number of body rows. */
  async getRowCount(): Promise<number> {
    let count = 0;
    for (let i = 0; await this.interactor.exists(this.row(i)); i++) {
      count++;
    }
    return count;
  }

  /**
   * The sort direction of the column with the given `data-column-key`, read from
   * `aria-sort`. `undefined` when the column is not the active sort (Astryx only
   * sets `aria-sort` on the sorted header).
   */
  async getSortDirection(columnKey: string): Promise<Optional<TableSortDirection>> {
    const sort = await this.interactor.getAttribute(this.header(columnKey), 'aria-sort');
    return sort === 'ascending' || sort === 'descending' ? sort : undefined;
  }

  /**
   * Toggle sorting on the column with the given `data-column-key` by clicking its
   * header button.
   * @returns `false` when no such (sortable) column exists.
   */
  async sortByColumn(columnKey: string): Promise<boolean> {
    const button = locatorUtil.append(this.header(columnKey), byCssSelector('button'));
    if (!(await this.interactor.exists(button))) {
      return false;
    }
    await this.interactor.click(button);
    return true;
  }

  /** Whether the row at the given index is selected — Astryx marks this `aria-selected="true"` on the `<tr>`. */
  async isRowSelected(index: number): Promise<boolean> {
    return (await this.interactor.getAttribute(this.row(index), 'aria-selected')) === 'true';
  }

  /** Toggle the selection checkbox of the row at the given index. */
  async toggleRow(index: number): Promise<void> {
    await this.interactor.click(locatorUtil.append(this.row(index), byCssSelector('input[type="checkbox"]')));
  }

  /** Whether every selectable row is selected — the header checkbox is checked (and not indeterminate). */
  async isAllSelected(): Promise<boolean> {
    return (await this.interactor.isChecked(this.selectAllCheckbox)) && !(await this.isSelectionIndeterminate());
  }

  /**
   * Whether the selection is partial — the header checkbox matches
   * `:indeterminate`. Astryx 0.1.3 dropped the redundant `aria-checked="mixed"` it
   * used to set alongside the native `.indeterminate` DOM property (which isn't
   * reflected as an HTML attribute), so this reads the CSS pseudo-class instead.
   */
  async isSelectionIndeterminate(): Promise<boolean> {
    return this.interactor.exists(locatorUtil.append(this.selectAllCheckbox, byCssSelector(':indeterminate', 'Same')));
  }

  /** Toggle the select-all checkbox in the header. */
  async toggleSelectAll(): Promise<void> {
    await this.interactor.click(this.selectAllCheckbox);
  }

  /** The data cell texts of the row at the given index, in column order (the checkbox cell is excluded). */
  async getRowCellTexts(index: number): Promise<readonly string[]> {
    const texts: string[] = [];
    for (let k = 1; ; k++) {
      const cell = this.bodyCell(index, k);
      if (!(await this.interactor.exists(cell))) {
        break;
      }
      const checkbox = locatorUtil.append(cell, byCssSelector('input[type="checkbox"]'));
      if (await this.interactor.exists(checkbox)) {
        continue;
      }
      const text = (await this.interactor.getText(cell))?.trim();
      texts.push(text ?? '');
    }
    return texts;
  }

  private bodyCell(rowIndex: number, position: number): PartLocator {
    return locatorUtil.append(this.row(rowIndex), byCssSelector(`td:nth-child(${position})`));
  }

  override get driverName(): string {
    return 'AstryxTableDriver';
  }
}
