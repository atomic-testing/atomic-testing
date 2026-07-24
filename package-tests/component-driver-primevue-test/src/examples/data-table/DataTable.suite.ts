import { DataTableDriver } from '@atomic-testing/component-driver-primevue-v4';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

export const dataTableScenePart = {
  table: {
    locator: byDataTestId('product-table'),
    driver: DataTableDriver,
  },
  interactive: {
    locator: byDataTestId('interactive-table'),
    driver: DataTableDriver,
  },
  filterable: {
    locator: byDataTestId('filterable-table'),
    driver: DataTableDriver,
  },
  virtualScroll: {
    locator: byDataTestId('virtual-scroll-table'),
    driver: DataTableDriver,
  },
} satisfies ScenePart;

export const dataTableTestSuite: TestSuiteInfo<typeof dataTableScenePart> = {
  title: 'PrimeVue DataTable',
  url: '/data-table',
  tests: (
    getTestEngine,
    { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse, hasLayout }
  ) => {
    describe('PrimeVue DataTable', () => {
      const engine = useTestEngine(dataTableScenePart, getTestEngine, { beforeEach, afterEach });

      test('reads the header labels', async () => {
        assertEqual(await engine().parts.table.getColumnLabels(), ['Name', 'Code', 'Qty']);
        assertEqual(await engine().parts.table.getColumnCount(), 3);
      });

      test('counts every row — full-count iteration, no truncation', async () => {
        assertEqual(await engine().parts.table.getRowCount(), 5);
      });

      test('reads cells by row and column index', async () => {
        const firstRow = await engine().parts.table.getRowByIndex(0);
        assertEqual(await firstRow?.getCellText(0), 'Widget');
        assertEqual(await firstRow?.getCellText(2), '3');

        const lastRow = await engine().parts.table.getRowByIndex(4);
        assertEqual(await lastRow?.getCellTexts(), ['Sprocket', 'S-500', '5']);
        assertEqual(await lastRow?.getCellCount(), 3);
      });

      test('out-of-range reads resolve empty, not throwing', async () => {
        assertEqual(await engine().parts.table.getRowByIndex(99), null);
        const firstRow = await engine().parts.table.getRowByIndex(0);
        assertEqual(await firstRow?.getCellText(99), undefined);
      });

      test('sorts by column and paginates the sorted result (#1034)', async () => {
        assertEqual(await engine().parts.interactive.getSortDirection('Name'), 'none');

        assertTrue(await engine().parts.interactive.sortBy('Name', 'ascending'));
        assertEqual(await engine().parts.interactive.getSortDirection('Name'), 'ascending');
        const first = await engine().parts.interactive.getRowByIndex(0);
        assertEqual(await first?.getCellText(1), 'Doohickey');

        assertTrue(await engine().parts.interactive.sortBy('Name', 'descending'));
        assertEqual(await engine().parts.interactive.getSortDirection('Name'), 'descending');
        const firstDesc = await engine().parts.interactive.getRowByIndex(0);
        assertEqual(await firstDesc?.getCellText(1), 'Widget');
      });

      test('sortBy reports false for an unknown column', async () => {
        assertFalse(await engine().parts.interactive.sortBy('Nonexistent', 'ascending'));
      });

      test('selects and deselects a row via its checkbox column, reading aria-selected (#1034)', async () => {
        assertFalse(await engine().parts.interactive.isRowSelected(0));
        assertTrue(await engine().parts.interactive.selectRow(0));
        assertTrue(await engine().parts.interactive.isRowSelected(0));
        assertTrue(await engine().parts.interactive.deselectRow(0));
        assertFalse(await engine().parts.interactive.isRowSelected(0));
      });

      test('select-all / deselect-all through the header checkbox (#1034)', async () => {
        assertTrue(await engine().parts.interactive.hasSelectAllCheckbox());
        assertFalse(await engine().parts.interactive.isAllRowsSelected());

        assertTrue(await engine().parts.interactive.selectAllRows());
        assertTrue(await engine().parts.interactive.isRowSelected(0));
        assertTrue(await engine().parts.interactive.isRowSelected(1));

        assertTrue(await engine().parts.interactive.deselectAllRows());
        assertFalse(await engine().parts.interactive.isRowSelected(0));
      });

      test('paginates through pages (#1034)', async () => {
        assertTrue(await engine().parts.interactive.hasPaginator());
        assertEqual(await engine().parts.interactive.getCurrentPage(), 1);
        assertEqual(await engine().parts.interactive.getPageCount(), 3);
        assertEqual(await engine().parts.interactive.getRowCount(), 2);

        assertTrue(await engine().parts.interactive.nextPage());
        assertEqual(await engine().parts.interactive.getCurrentPage(), 2);
        const secondPageFirstRow = await engine().parts.interactive.getRowByIndex(0);
        assertEqual(await secondPageFirstRow?.getCellText(1), 'Doohickey');

        assertTrue(await engine().parts.interactive.goToPage(3));
        assertEqual(await engine().parts.interactive.getCurrentPage(), 3);
        assertEqual(await engine().parts.interactive.getRowCount(), 1);
        const lastPageRow = await engine().parts.interactive.getRowByIndex(0);
        assertEqual(await lastPageRow?.getCellText(1), 'Sprocket');

        assertFalse(await engine().parts.interactive.nextPage());

        assertTrue(await engine().parts.interactive.previousPage());
        assertEqual(await engine().parts.interactive.getCurrentPage(), 2);
      });

      test('no paginator/select-all on the static table', async () => {
        assertFalse(await engine().parts.table.hasPaginator());
        assertFalse(await engine().parts.table.hasSelectAllCheckbox());
        assertEqual(await engine().parts.table.getCurrentPage(), undefined);
      });

      test('column filter (menu display, #1034): set/read/clear reduces and restores the row set', async () => {
        assertTrue(await engine().parts.filterable.hasColumnFilter('Name'));
        assertFalse(await engine().parts.filterable.hasColumnFilter('Code'));
        assertEqual(await engine().parts.filterable.getRowCount(), 5);

        assertTrue(await engine().parts.filterable.setColumnFilter('Name', 'Gadget'));
        assertEqual(await engine().parts.filterable.getRowCount(), 1);
        const filteredRow = await engine().parts.filterable.getRowByIndex(0);
        assertEqual(await filteredRow?.getCellText(0), 'Gadget');
        assertEqual(await engine().parts.filterable.getColumnFilterValue('Name'), 'Gadget');

        assertTrue(await engine().parts.filterable.clearColumnFilter('Name'));
        assertEqual(await engine().parts.filterable.getRowCount(), 5);
      });

      test('column filter menu open/close state', async () => {
        assertFalse(await engine().parts.filterable.isFilterMenuOpen('Name'));
        assertTrue(await engine().parts.filterable.openFilterMenu('Name'));
        assertTrue(await engine().parts.filterable.isFilterMenuOpen('Name'));
        assertTrue(await engine().parts.filterable.closeFilterMenu('Name'));
        assertFalse(await engine().parts.filterable.isFilterMenuOpen('Name'));
      });

      test('column filter reports false/undefined for a non-filterable or unknown column', async () => {
        assertFalse(await engine().parts.filterable.hasColumnFilter('Nonexistent'));
        assertEqual(await engine().parts.filterable.isFilterMenuOpen('Code'), undefined);
        assertFalse(await engine().parts.filterable.setColumnFilter('Code', 'x'));
        assertFalse(await engine().parts.filterable.clearColumnFilter('Code'));
      });

      test('cell editing (editMode="cell", #1034): commit writes back, cancel discards', async () => {
        const row = await engine().parts.filterable.getRowByIndex(0);
        assertFalse(await row?.isCellEditing(2));

        assertTrue(await row?.startCellEdit(2));
        assertTrue(await row?.isCellEditing(2));
        assertTrue(await row?.setCellValue(2, '99'));
        assertTrue(await row?.commitCellEdit(2));
        assertFalse(await row?.isCellEditing(2));
        assertEqual(await row?.getCellText(2), '99');

        assertTrue(await row?.startCellEdit(2));
        assertTrue(await row?.setCellValue(2, '123'));
        assertTrue(await row?.cancelCellEdit(2));
        assertFalse(await row?.isCellEditing(2));
        assertEqual(await row?.getCellText(2), '99');
      });

      test('cell editing reports false for a non-editable column or out-of-range cell', async () => {
        const row = await engine().parts.filterable.getRowByIndex(0);
        assertFalse(await row?.startCellEdit(1));
        assertEqual(await row?.isCellEditing(99), undefined);
      });

      test('virtual scroll (#1034): scrollRowIntoView resolves without throwing', async () => {
        const found = await engine().parts.virtualScroll.scrollRowIntoView(10, 200);
        assertEqual(typeof found, 'boolean');
      });

      // E2E-only: jsdom renders zero or one row for a virtual-scroll table regardless of scroll
      // position (see DataTableDriver's class doc "Virtual scroll" note) — asserting the target
      // row is actually reached is only meaningful with a real layout engine.
      if (hasLayout) {
        test('virtual scroll (#1034): scrollRowIntoView reaches a row outside the initial viewport', async () => {
          assertTrue(await engine().parts.virtualScroll.scrollRowIntoView(50));
          const row = await engine().parts.virtualScroll.getRowByDataIndex(50);
          assertEqual(await row?.getCellText(0), 'Item 50');
        });
      }
    });
  },
};
