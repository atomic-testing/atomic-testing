import { TableDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { IExampleUnit, TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { tableUIExample } from './Table.examples';

export const tableExampleScenePart = {
  users: {
    locator: byDataTestId('users'),
    driver: TableDriver,
  },
  products: {
    locator: byDataTestId('products'),
    driver: TableDriver,
  },
} satisfies ScenePart;

export const tableExample: IExampleUnit<typeof tableExampleScenePart, JSX.Element> = {
  ...tableUIExample,
  scene: tableExampleScenePart,
};

export const tableExampleTestSuite: TestSuiteInfo<typeof tableExample.scene> = {
  title: 'Astryx Table',
  url: '/table',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${tableExample.title}`, () => {
      const engine = useTestEngine(tableExample.scene, getTestEngine, { beforeEach, afterEach });

      // getColumnHeaders excludes the selection checkbox column; getRowCount counts body rows.
      test(`reads headers and row count`, async () => {
        assertEqual(await engine().parts.users.getColumnHeaders(), ['Name', 'Role']);
        assertEqual(await engine().parts.users.getRowCount(), 3);
        assertEqual(await engine().parts.products.getColumnHeaders(), ['SKU', 'Price']);
        assertEqual(await engine().parts.products.getRowCount(), 2);
      });

      // Data cells read in column order, excluding the checkbox cell. Default sort is name ascending.
      test(`reads row cells in sorted order`, async () => {
        assertEqual(await engine().parts.users.getRowCellTexts(0), ['Alice', 'Admin']);
        assertEqual(await engine().parts.products.getRowCellTexts(1), ['B-2', '$20.00']);
      });

      // aria-sort is present only on the active sort column.
      test(`reads and changes sort direction`, async () => {
        assertEqual(await engine().parts.users.getSortDirection('name'), 'ascending');
        assertEqual(await engine().parts.users.getSortDirection('role'), undefined);

        assertTrue(await engine().parts.users.sortByColumn('role'));
        assertEqual(await engine().parts.users.getSortDirection('role'), 'ascending');
        assertEqual(await engine().parts.users.getSortDirection('name'), undefined);
      });

      // Row selection is read from aria-selected; the partial select-all is indeterminate.
      test(`reads selection state`, async () => {
        assertFalse(await engine().parts.users.isRowSelected(0));
        assertTrue(await engine().parts.users.isRowSelected(1));
        assertFalse(await engine().parts.users.isAllSelected());
        assertTrue(await engine().parts.users.isSelectionIndeterminate());
      });

      // Toggling a row updates its selection.
      test(`toggleRow selects a row`, async () => {
        await engine().parts.users.toggleRow(0);
        assertTrue(await engine().parts.users.isRowSelected(0));
      });

      // Select-all checks every row and clears the indeterminate state.
      test(`toggleSelectAll selects every row`, async () => {
        await engine().parts.users.toggleSelectAll();
        assertTrue(await engine().parts.users.isAllSelected());
        assertFalse(await engine().parts.users.isSelectionIndeterminate());
      });
    });
  },
};
