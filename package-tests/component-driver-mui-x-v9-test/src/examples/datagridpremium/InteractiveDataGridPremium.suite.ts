import { DataGridPremiumDriver } from '@atomic-testing/component-driver-mui-x-v9';
import { IExampleUnit, ScenePart, byDataTestId } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { interactiveDataGridPremiumUIExample, interactiveGridRows } from './InteractiveDataGridPremium.examples';

export const interactiveDataGridPremiumExampleScenePart = {
  grid: {
    locator: byDataTestId('interactive-grid-premium'),
    driver: DataGridPremiumDriver,
  },
  emptyGrid: {
    locator: byDataTestId('empty-grid-premium'),
    driver: DataGridPremiumDriver,
  },
} satisfies ScenePart;

export const interactiveDataGridPremiumExample: IExampleUnit<
  typeof interactiveDataGridPremiumExampleScenePart,
  JSX.Element
> = {
  ...interactiveDataGridPremiumUIExample,
  scene: interactiveDataGridPremiumExampleScenePart,
};

// Expected values are computed from the shared static fixture, so the assertions stay correct
// if the fixture data ever changes.
const quickFilterText = 'Frozen Concentrated';
const quickFilterMatchCount = interactiveGridRows.filter(row => String(row.commodity).includes(quickFilterText)).length;
const filterDesk = String(interactiveGridRows[0].desk);
const deskFilterMatchCount = interactiveGridRows.filter(row => String(row.desk).includes(filterDesk)).length;

export const interactiveDataGridPremiumTestSuite: TestSuiteInfo<typeof interactiveDataGridPremiumExampleScenePart> = {
  title: 'Interactive DataGridPremium',
  url: '/datagridinteractive',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    const engine = useTestEngine(interactiveDataGridPremiumExample.scene, getTestEngine, { beforeEach, afterEach });

    //#region Sorting
    test('columns start unsorted', async () => {
      await engine().parts.grid.waitForLoad();
      assertEqual(await engine().parts.grid.getSortDirection('desk'), null);
    });

    test('sortByColumn asc orders the rows ascending', async () => {
      await engine().parts.grid.waitForLoad();
      await engine().parts.grid.sortByColumn('desk', 'asc');
      assertEqual(await engine().parts.grid.getSortDirection('desk'), 'asc');
      const first = await engine().parts.grid.getCellText({ rowIndex: 0, columnField: 'desk' });
      const second = await engine().parts.grid.getCellText({ rowIndex: 1, columnField: 'desk' });
      assertTrue(first <= second);
    });

    test('sortByColumn desc orders the rows descending', async () => {
      await engine().parts.grid.waitForLoad();
      await engine().parts.grid.sortByColumn('desk', 'desc');
      assertEqual(await engine().parts.grid.getSortDirection('desk'), 'desc');
      const first = await engine().parts.grid.getCellText({ rowIndex: 0, columnField: 'desk' });
      const second = await engine().parts.grid.getCellText({ rowIndex: 1, columnField: 'desk' });
      assertTrue(first >= second);
    });

    test('sortByColumn null returns the column to unsorted', async () => {
      await engine().parts.grid.waitForLoad();
      await engine().parts.grid.sortByColumn('desk', 'asc');
      await engine().parts.grid.sortByColumn('desk', null);
      assertEqual(await engine().parts.grid.getSortDirection('desk'), null);
    });
    //#endregion

    //#region Filtering
    test('setQuickFilter narrows the rows to the matching commodity', async () => {
      await engine().parts.grid.waitForLoad();
      await engine().parts.grid.setQuickFilter(quickFilterText);
      await engine().parts.grid.waitForRowCount(quickFilterMatchCount);
      const text = await engine().parts.grid.getCellText({ rowIndex: 0, columnField: 'commodity' });
      assertTrue(text.includes(quickFilterText));
    });

    test('setColumnFilter filters by the chosen column', async () => {
      await engine().parts.grid.waitForLoad();
      await engine().parts.grid.setColumnFilter('desk', filterDesk);
      await engine().parts.grid.waitForRowCount(deskFilterMatchCount);
      assertEqual(await engine().parts.grid.getCellText({ rowIndex: 0, columnField: 'desk' }), filterDesk);
      await engine().parts.grid.closeFilterPanel();
    });
    //#endregion

    //#region Selection
    test('selectRow selects a single row', async () => {
      await engine().parts.grid.waitForLoad();
      assertFalse(await engine().parts.grid.isRowSelected(1));
      assertEqual(await engine().parts.grid.getSelectedRowCount(), 0);
      await engine().parts.grid.selectRow(1);
      assertTrue(await engine().parts.grid.isRowSelected(1));
      assertEqual(await engine().parts.grid.getSelectedRowCount(), 1);
    });

    test('deselectRow removes a row from the selection', async () => {
      await engine().parts.grid.waitForLoad();
      await engine().parts.grid.selectRow(1);
      await engine().parts.grid.selectRow(2);
      assertEqual(await engine().parts.grid.getSelectedRowCount(), 2);
      await engine().parts.grid.deselectRow(1);
      assertFalse(await engine().parts.grid.isRowSelected(1));
      assertEqual(await engine().parts.grid.getSelectedRowCount(), 1);
    });

    test('selectAllRows and deselectAllRows toggle the whole dataset', async () => {
      await engine().parts.grid.waitForLoad();
      await engine().parts.grid.selectAllRows();
      assertEqual(await engine().parts.grid.getSelectedRowCount(), interactiveGridRows.length);
      await engine().parts.grid.deselectAllRows();
      assertEqual(await engine().parts.grid.getSelectedRowCount(), 0);
    });
    //#endregion

    //#region Editing
    test('setCellValue and commitCellEdit persist a new cell value', async () => {
      await engine().parts.grid.waitForLoad();
      const cell = { rowIndex: 0, columnField: 'commodity' } as const;
      await engine().parts.grid.setCellValue(cell, 'Gold');
      await engine().parts.grid.commitCellEdit(cell);
      assertEqual(await engine().parts.grid.getCellText(cell), 'Gold');
    });

    test('cancelCellEdit discards the pending value', async () => {
      await engine().parts.grid.waitForLoad();
      const cell = { rowIndex: 0, columnField: 'commodity' } as const;
      const original = await engine().parts.grid.getCellText(cell);
      await engine().parts.grid.setCellValue(cell, 'Discarded');
      await engine().parts.grid.cancelCellEdit(cell);
      assertEqual(await engine().parts.grid.getCellText(cell), original);
    });
    //#endregion

    //#region Column management
    test('hideColumn removes the column through its menu', async () => {
      await engine().parts.grid.waitForLoad();
      const before = await engine().parts.grid.getHeaderText();
      assertTrue(before.includes('Trader Name'));
      await engine().parts.grid.hideColumn('traderName');
      const after = await engine().parts.grid.getHeaderText();
      assertFalse(after.includes('Trader Name'));
    });
    //#endregion

    //#region Page size and overlays
    // The page size is asserted through the pagination state, not the rendered row count: a
    // real browser virtualizes to the viewport (~11 rows here) while jsdom renders the whole
    // page, so a rendered-count assertion cannot hold in both environments.
    test('setPageSize changes the rows per page', async () => {
      await engine().parts.grid.waitForLoad();
      assertEqual(await engine().parts.grid.getPageSize(), 10);
      await engine().parts.grid.setPageSize(25);
      assertEqual(await engine().parts.grid.getPageSize(), 25);
      assertEqual(await engine().parts.grid.getPaginationDescription(), '1–25 of 30');
    });

    test('isEmpty reflects the no-rows overlay', async () => {
      await engine().parts.grid.waitForLoad();
      assertFalse(await engine().parts.grid.isEmpty());
      assertTrue(await engine().parts.emptyGrid.isEmpty());
    });
    //#endregion

    //#region Virtualization
    test('scrollRowIntoView reaches a row outside the initial viewport', async () => {
      await engine().parts.grid.waitForLoad();
      await engine().parts.grid.setPageSize(25);
      await engine().parts.grid.scrollRowIntoView(20);
      assertEqual(
        await engine().parts.grid.getCellText({ rowIndex: 20, columnField: 'desk' }),
        String(interactiveGridRows[20].desk)
      );
    });
    //#endregion
  },
};
