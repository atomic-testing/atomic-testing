import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { MenuDriver } from '@atomic-testing/component-driver-mui-v9';
import { DataGridDataRowDriver, DataGridPremiumDriver } from '@atomic-testing/component-driver-mui-x-v9';
import {
  byCssSelector,
  byDataTestId,
  ComponentDriver,
  IComponentDriverOption,
  Interactor,
  locatorUtil,
  Optional,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

import { TicketGridDataTestId } from './TicketGridDataTestId';

const parts = {
  // The DataGrid root is the shipped driver's target; the example's `data-testid` sits on the
  // wrapping element (this driver's own locator).
  grid: { locator: byCssSelector('.MuiDataGrid-root'), driver: DataGridPremiumDriver },
  count: { locator: byDataTestId(TicketGridDataTestId.count), driver: HTMLElementDriver },
  // The row-action menu portals to <body>, so it is addressed from the document Root.
  rowMenu: { locator: byDataTestId(TicketGridDataTestId.rowMenu, 'Root'), driver: MenuDriver },
} satisfies ScenePart;

function rowCellButtonLocator(rowIndex: number, field: string): PartLocator {
  return byCssSelector(`[role=row][data-rowindex="${rowIndex}"] [data-field="${field}"] button`);
}

// Page-object driver over the ticket grid. Wraps the shipped community-grid driver
// (DataGridPremiumDriver drives the community DataGrid — identical row/cell DOM) plus the per-row
// action menu, behind ticket-oriented method names.
export class TicketGridDriver extends ComponentDriver<typeof parts> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, { ...option, parts });
  }

  /** Wait for the grid to finish its initial render/load before reading rows. */
  async waitForLoad(timeoutMs: number = 10000): Promise<void> {
    await this.parts.grid.waitForLoad(timeoutMs);
  }

  async getRowCount(): Promise<number> {
    return this.parts.grid.getRowCount();
  }

  /** The "{n} tickets" summary text shown above the grid. */
  async getRowCountText(): Promise<Optional<string>> {
    return this.parts.count.getText();
  }

  /** The Title column text of every visible row, in display order. */
  async getVisibleTitles(): Promise<string[]> {
    const count = await this.getRowCount();
    const titles: string[] = [];
    for (let rowIndex = 0; rowIndex < count; rowIndex++) {
      titles.push(await this.parts.grid.getCellText({ rowIndex, columnField: 'title' }));
    }
    return titles;
  }

  /** The Assignee column text of a row (the grid shows `—` for unassigned). */
  async getAssignee(rowIndex: number): Promise<string> {
    return this.parts.grid.getCellText({ rowIndex, columnField: 'assignee' });
  }

  /** Open the editor for a row by clicking its title. */
  async openRow(rowIndex: number): Promise<void> {
    await this.interactor.click(locatorUtil.append(this.locator, rowCellButtonLocator(rowIndex, 'title')));
  }

  /** Open the per-row action menu (Edit / Assign to me / Close ticket). */
  async openRowMenu(rowIndex: number): Promise<void> {
    await this.interactor.click(locatorUtil.append(this.locator, rowCellButtonLocator(rowIndex, 'actions')));
  }

  /** Open a row's action menu and choose an item by its label. */
  async chooseRowAction(rowIndex: number, actionLabel: string): Promise<void> {
    await this.openRowMenu(rowIndex);
    await this.parts.rowMenu.selectByLabel(actionLabel);
  }

  /** The data-row driver for the first row whose Title matches, or `null`. */
  async getRowByTitle(title: string): Promise<DataGridDataRowDriver | null> {
    const titles = await this.getVisibleTitles();
    const index = titles.indexOf(title);
    return index >= 0 ? this.parts.grid.getRow(index) : null;
  }

  override get driverName(): string {
    return 'TicketGridDriver';
  }
}
