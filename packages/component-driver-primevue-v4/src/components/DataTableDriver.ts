import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { byCssSelector, childListHelper, ComponentDriver, locatorUtil, PartLocator } from '@atomic-testing/core';

import { DataTableRowDriver } from './DataTableRowDriver';

/** CSS for a table row — the ARIA role PrimeVue stamps on every `<tr>`. */
const rowSelector = '[role="row"]';
/** CSS for a header cell — the ARIA role PrimeVue stamps on every `<th>`. */
const columnHeaderSelector = '[role="columnheader"]';

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
 * **v1 scope: static, read-only tables.** Sorting, filtering, selection,
 * pagination, virtual scroll, frozen columns and cell editing are explicitly
 * out — PrimeVue changes the rendered DOM under those modes (extra wrapper
 * sections, cloned tables), so each needs its own audit before the driver can
 * promise anything about it.
 */
export class DataTableDriver extends ComponentDriver<{}> {
  private get tbodyLocator(): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector('[data-pc-section="tbody"]'));
  }

  private get headerRowLocator(): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector('[data-pc-section="thead"]'), byCssSelector(rowSelector));
  }

  /** The number of body rows. */
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

  /** Trimmed header label of every column, in DOM order. */
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

  /** The number of columns (header cells). */
  async getColumnCount(): Promise<number> {
    return childListHelper.countMatchingChildren(this.interactor, this.headerRowLocator, columnHeaderSelector);
  }

  get driverName(): string {
    return 'PrimeVueV4DataTableDriver';
  }
}
