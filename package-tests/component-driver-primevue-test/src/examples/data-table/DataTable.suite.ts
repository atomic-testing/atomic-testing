import { DataTableDriver } from '@atomic-testing/component-driver-primevue-v4';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

export const dataTableScenePart = {
  table: {
    locator: byDataTestId('product-table'),
    driver: DataTableDriver,
  },
} satisfies ScenePart;

export const dataTableTestSuite: TestSuiteInfo<typeof dataTableScenePart> = {
  title: 'PrimeVue DataTable',
  url: '/data-table',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
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
    });
  },
};
