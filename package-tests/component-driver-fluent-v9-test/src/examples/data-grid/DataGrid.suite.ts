import { DataGridDriver } from '@atomic-testing/component-driver-fluent-v9';
import { HTMLButtonDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { dataGridUIExample } from './DataGrid.examples';

export const dataGridExampleScenePart = {
  gridA: { locator: byDataTestId('data-grid-a'), driver: DataGridDriver },
  gridB: { locator: byDataTestId('data-grid-b'), driver: DataGridDriver },
  // Stands in for whatever entry point a real app wires to
  // `enableKeyboardMode` — see `DataGrid.examples.tsx`'s `KeyboardResizeTrigger`.
  kbResizeTriggerName: { locator: byDataTestId('kb-resize-trigger-name'), driver: HTMLButtonDriver },
} satisfies ScenePart;

export const dataGridExample: IExampleUnit<typeof dataGridExampleScenePart, JSX.Element> = {
  ...dataGridUIExample,
  scene: dataGridExampleScenePart,
};

export const dataGridExampleTestSuite: TestSuiteInfo<typeof dataGridExample.scene> = {
  title: 'Fluent DataGrid',
  url: '/data-grid',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${dataGridExample.title}`, () => {
      const engine = useTestEngine(dataGridExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('reads row/column counts and header texts per instance (disambiguation)', async () => {
        assertEqual(await engine().parts.gridA.getRowCount(), 3);
        assertEqual(await engine().parts.gridA.getColumnCount(), 3);
        assertEqual(await engine().parts.gridA.getHeaderTexts(), ['Name', 'Age', 'City']);

        assertEqual(await engine().parts.gridB.getRowCount(), 2);
        assertEqual(await engine().parts.gridB.getColumnCount(), 2);
        assertEqual(await engine().parts.gridB.getHeaderTexts(), ['Product', 'Price']);
      });

      test('reads cell text by row/column in initial (unsorted) DOM order', async () => {
        assertEqual(await engine().parts.gridA.getCellText(0, 0), 'Carol');
        assertEqual(await engine().parts.gridA.getCellText(0, 1), '35');
        assertEqual(await engine().parts.gridA.getCellText(1, 0), 'Alice');
        assertEqual(await engine().parts.gridA.getCellText(2, 2), 'Los Angeles');

        assertEqual(await engine().parts.gridA.getCellText(99, 0), undefined);
        assertEqual(await engine().parts.gridA.getCellText(0, 99), undefined);

        assertEqual(await engine().parts.gridB.getCellText(0, 0), 'Widget');
        assertEqual(await engine().parts.gridB.getCellText(1, 1), '$20');
      });

      test('a column with no `compare` is not sortable and rejects sortByColumn', async () => {
        assertEqual(await engine().parts.gridA.getSortDirection(2), undefined);
        assertFalse(await engine().parts.gridA.sortByColumn(2));
      });

      test('sortByColumn drives a real sort, toggling direction and reordering rows', async () => {
        assertEqual(await engine().parts.gridA.getSortDirection(0), undefined);

        assertTrue(await engine().parts.gridA.sortByColumn(0, 'ascending'));
        assertEqual(await engine().parts.gridA.getSortDirection(0), 'ascending');
        assertEqual(await engine().parts.gridA.getCellText(0, 0), 'Alice');
        assertEqual(await engine().parts.gridA.getCellText(1, 0), 'Bob');
        assertEqual(await engine().parts.gridA.getCellText(2, 0), 'Carol');

        assertTrue(await engine().parts.gridA.sortByColumn(0, 'descending'));
        assertEqual(await engine().parts.gridA.getSortDirection(0), 'descending');
        assertEqual(await engine().parts.gridA.getCellText(0, 0), 'Carol');
        assertEqual(await engine().parts.gridA.getCellText(2, 0), 'Alice');
      });

      test('sorting by a different column resets to ascending and uses the numeric `compare`', async () => {
        await engine().parts.gridA.sortByColumn(0, 'descending');

        assertTrue(await engine().parts.gridA.sortByColumn(1));
        assertEqual(await engine().parts.gridA.getSortDirection(1), 'ascending');
        assertEqual(await engine().parts.gridA.getCellText(0, 1), '25');
        assertEqual(await engine().parts.gridA.getCellText(2, 1), '35');

        // The other grid instance stays untouched (disambiguation).
        assertEqual(await engine().parts.gridB.getSortDirection(0), undefined);
      });

      test('multiselect: selectRow/deselectRow/getSelectedRowCount/selectAllRows/deselectAllRows', async () => {
        assertFalse(await engine().parts.gridA.isRowSelected(0));
        assertEqual(await engine().parts.gridA.getSelectedRowCount(), 0);

        assertTrue(await engine().parts.gridA.selectRow(0));
        assertTrue(await engine().parts.gridA.isRowSelected(0));
        assertEqual(await engine().parts.gridA.getSelectedRowCount(), 1);

        assertTrue(await engine().parts.gridA.selectRow(1));
        assertEqual(await engine().parts.gridA.getSelectedRowCount(), 2);
        assertFalse(await engine().parts.gridA.isAllRowsSelected());

        assertTrue(await engine().parts.gridA.selectAllRows());
        assertTrue(await engine().parts.gridA.isAllRowsSelected());
        assertEqual(await engine().parts.gridA.getSelectedRowCount(), 3);

        assertTrue(await engine().parts.gridA.deselectAllRows());
        assertEqual(await engine().parts.gridA.getSelectedRowCount(), 0);

        assertFalse(await engine().parts.gridA.deselectRow(99));
        assertFalse(await engine().parts.gridA.selectRow(99));

        // The other grid instance stays untouched (disambiguation).
        assertEqual(await engine().parts.gridB.getSelectedRowCount(), 0);
      });

      test('single-select: selecting a row deselects the previous one; no "select all"', async () => {
        assertTrue(await engine().parts.gridB.selectRow(0));
        assertTrue(await engine().parts.gridB.isRowSelected(0));

        assertTrue(await engine().parts.gridB.selectRow(1));
        assertTrue(await engine().parts.gridB.isRowSelected(1));
        assertFalse(await engine().parts.gridB.isRowSelected(0));

        // Rejected: single-select has no click path back to "nothing selected".
        assertTrue(await engine().parts.gridB.deselectRow(1));
        assertTrue(await engine().parts.gridB.isRowSelected(1));

        assertFalse(await engine().parts.gridB.selectAllRows());
        assertFalse(await engine().parts.gridB.isAllRowsSelected());
      });

      test('resizableColumns: resizeColumn/getColumnWidth on grid A, no-op on non-resizable grid B', async () => {
        const initialWidth = await engine().parts.gridA.getColumnWidth(0);
        assertTrue(initialWidth !== undefined);

        assertTrue(await engine().parts.gridA.resizeColumn(0, 40));
        // The LAST column has no resize handle by default (`autoFitColumns`).
        assertFalse(await engine().parts.gridA.resizeColumn(2, 40));

        assertFalse(await engine().parts.gridB.resizeColumn(0, 40));
        assertEqual(await engine().parts.gridB.getColumnWidth(0), undefined);
      });

      test('getRow/getHeaderRow return null and out-of-range reads degrade gracefully', async () => {
        assertEqual(await engine().parts.gridA.getRow(99), null);

        const headerRow = await engine().parts.gridA.getHeaderRow();
        assertTrue(headerRow != null);
        assertEqual(await headerRow!.getCellCount(), 3);
        assertEqual(await headerRow!.getCell(99), null);
      });

      test('keyboard-accessible resize: entering via the app-wired trigger enables arrow-key adjust and Escape exit', async () => {
        assertFalse(await engine().parts.gridA.isColumnInKeyboardResizeMode(0));

        await engine().parts.kbResizeTriggerName.click();
        assertTrue(await engine().parts.gridA.isColumnInKeyboardResizeMode(0));

        assertTrue(await engine().parts.gridA.pressColumnResizeKey(0, 'ArrowRight'));

        assertTrue(await engine().parts.gridA.pressColumnResizeKey(0, 'Escape'));
        assertFalse(await engine().parts.gridA.isColumnInKeyboardResizeMode(0));
      });

      test('keyboard-accessible resize is a no-op without a resize handle (last column, non-resizable grid)', async () => {
        // The LAST column has no resize handle at all (same `autoFitColumns` caveat as the mouse-drag test above).
        assertFalse(await engine().parts.gridA.isColumnInKeyboardResizeMode(2));
        assertFalse(await engine().parts.gridA.pressColumnResizeKey(2, 'ArrowRight'));

        assertFalse(await engine().parts.gridB.isColumnInKeyboardResizeMode(0));
        assertFalse(await engine().parts.gridB.pressColumnResizeKey(0, 'ArrowRight'));
      });

      test('TableCellActions: present but hidden until the row is hovered; absent where none is wired', async () => {
        const row = await engine().parts.gridA.getRow(0);
        assertTrue(row != null);
        const cell = await row!.getCell(0);
        assertTrue(cell != null);

        assertFalse(await cell!.isActionsVisible());
        assertEqual((await cell!.getActionButtons()).length, 1);

        await row!.hover();
        assertTrue(await cell!.isActionsVisible());

        // Grid B wires no `TableCellActions` anywhere.
        const otherRow = await engine().parts.gridB.getRow(0);
        const otherCell = await otherRow!.getCell(0);
        assertFalse(await otherCell!.isActionsVisible());
        assertEqual((await otherCell!.getActionButtons()).length, 0);
      });
    });
  },
};
