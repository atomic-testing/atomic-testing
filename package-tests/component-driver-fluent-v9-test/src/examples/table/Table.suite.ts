import { TableDriver } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { tableUIExample } from './Table.examples';

export const tableExampleScenePart = {
  tableA: { locator: byDataTestId('table-a'), driver: TableDriver },
  tableB: { locator: byDataTestId('table-b'), driver: TableDriver },
} satisfies ScenePart;

export const tableExample: IExampleUnit<typeof tableExampleScenePart, JSX.Element> = {
  ...tableUIExample,
  scene: tableExampleScenePart,
};

export const tableExampleTestSuite: TestSuiteInfo<typeof tableExample.scene> = {
  title: 'Fluent Table',
  url: '/table',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${tableExample.title}`, () => {
      const engine = useTestEngine(tableExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('reads row/column counts and header texts per instance (disambiguation)', async () => {
        assertEqual(await engine().parts.tableA.getRowCount(), 3);
        assertEqual(await engine().parts.tableA.getColumnCount(), 3);
        assertEqual(await engine().parts.tableA.getHeaderTexts(), ['Name', 'Age', 'City']);

        assertEqual(await engine().parts.tableB.getRowCount(), 2);
        assertEqual(await engine().parts.tableB.getColumnCount(), 2);
        assertEqual(await engine().parts.tableB.getHeaderTexts(), ['Product', 'Price']);
      });

      test('reads cell text by row/column in initial (unsorted) DOM order', async () => {
        assertEqual(await engine().parts.tableA.getCellText(0, 0), 'Carol');
        assertEqual(await engine().parts.tableA.getCellText(0, 1), '35');
        assertEqual(await engine().parts.tableA.getCellText(1, 0), 'Alice');
        assertEqual(await engine().parts.tableA.getCellText(2, 2), 'Los Angeles');

        assertEqual(await engine().parts.tableA.getCellText(99, 0), undefined);
        assertEqual(await engine().parts.tableA.getCellText(0, 99), undefined);

        assertEqual(await engine().parts.tableB.getCellText(0, 0), 'Widget');
        assertEqual(await engine().parts.tableB.getCellText(1, 1), '$20');
      });

      test('a column with no sort configured reports undefined and rejects sortByColumn', async () => {
        // Table B has no `sortable` anywhere.
        assertEqual(await engine().parts.tableB.getSortDirection(0), undefined);
        assertFalse(await engine().parts.tableB.sortByColumn(0));

        // Table A's City column explicitly opts out via `sortable={false}`.
        assertEqual(await engine().parts.tableA.getSortDirection(2), undefined);
        assertFalse(await engine().parts.tableA.sortByColumn(2));
      });

      test('sortByColumn drives a real sort, toggling direction and reordering rows', async () => {
        assertEqual(await engine().parts.tableA.getSortDirection(0), undefined);

        assertTrue(await engine().parts.tableA.sortByColumn(0));
        assertEqual(await engine().parts.tableA.getSortDirection(0), 'ascending');
        assertEqual(await engine().parts.tableA.getCellText(0, 0), 'Alice');
        assertEqual(await engine().parts.tableA.getCellText(1, 0), 'Bob');
        assertEqual(await engine().parts.tableA.getCellText(2, 0), 'Carol');

        assertTrue(await engine().parts.tableA.sortByColumn(0));
        assertEqual(await engine().parts.tableA.getSortDirection(0), 'descending');
        assertEqual(await engine().parts.tableA.getCellText(0, 0), 'Carol');
        assertEqual(await engine().parts.tableA.getCellText(2, 0), 'Alice');

        // The other table instance stays untouched (disambiguation).
        assertEqual(await engine().parts.tableB.getSortDirection(0), undefined);
      });

      test('sorting by a different column resets to ascending', async () => {
        await engine().parts.tableA.sortByColumn(0);
        await engine().parts.tableA.sortByColumn(0);
        assertEqual(await engine().parts.tableA.getSortDirection(0), 'descending');

        assertTrue(await engine().parts.tableA.sortByColumn(1));
        assertEqual(await engine().parts.tableA.getSortDirection(1), 'ascending');
        assertEqual(await engine().parts.tableA.getCellText(0, 1), '25');
      });

      test('getRow/getHeaderRow return null and out-of-range reads degrade gracefully', async () => {
        assertEqual(await engine().parts.tableA.getRow(99), null);

        const headerRow = await engine().parts.tableA.getHeaderRow();
        assertTrue(headerRow != null);
        assertEqual(await headerRow!.getCellCount(), 3);
        assertEqual(await headerRow!.getCell(99), null);
      });

      test('TableCellActions: present but hidden until the row is hovered; absent where none is wired', async () => {
        const row = await engine().parts.tableA.getRow(0);
        assertTrue(row != null);
        const cell = await row!.getCell(0);
        assertTrue(cell != null);

        assertFalse(await cell!.isActionsVisible());
        assertEqual((await cell!.getActionButtons()).length, 1);

        await row!.hover();
        assertTrue(await cell!.isActionsVisible());

        // Table B wires no `TableCellActions` anywhere.
        const otherRow = await engine().parts.tableB.getRow(0);
        const otherCell = await otherRow!.getCell(0);
        assertFalse(await otherCell!.isActionsVisible());
        assertEqual((await otherCell!.getActionButtons()).length, 0);
      });
    });
  },
};
