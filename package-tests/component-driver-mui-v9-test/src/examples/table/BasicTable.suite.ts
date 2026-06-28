import { TableDriver } from '@atomic-testing/component-driver-mui-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

import { basicTableUIExample } from './BasicTable.example';

export const basicTableExampleScenePart = {
  table: {
    locator: byDataTestId('dessert-table'),
    driver: TableDriver,
  },
} satisfies ScenePart;

export const basicTableExample: IExampleUnit<typeof basicTableExampleScenePart, JSX.Element> = {
  ...basicTableUIExample,
  scene: basicTableExampleScenePart,
};

export const basicTableTestSuite: TestSuiteInfo<typeof basicTableExampleScenePart> = {
  title: 'Basic Table',
  url: '/table',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    const engine = useTestEngine(basicTableExample.scene, getTestEngine, { beforeEach, afterEach });

    test('reports the row count', async () => {
      assertEqual(await engine().parts.table.getRowCount(), 3);
    });

    test('reports the column count', async () => {
      assertEqual(await engine().parts.table.getColumnCount(), 3);
    });

    test('reports the header texts', async () => {
      assertEqual(await engine().parts.table.getHeaderTexts(), ['Dessert', 'Calories', 'Fat (g)']);
    });

    test('reads a cell by row and column (initially ascending by Dessert)', async () => {
      // Ascending name order: Eclair, Frozen yoghurt, Ice cream sandwich.
      assertEqual(await engine().parts.table.getCellText(0, 0), 'Eclair');
      assertEqual(await engine().parts.table.getCellText(0, 1), '262');
    });

    test('reads a whole row', async () => {
      const row = await engine().parts.table.getRow(0);
      assertEqual(await row!.getCellTexts(), ['Eclair', '262', '16']);
    });

    test('reports the sorted column direction', async () => {
      assertEqual(await engine().parts.table.getSortDirection(0), 'ascending');
      assertEqual(await engine().parts.table.getSortDirection(1), undefined);
    });

    test('sorts a column by clicking its sort label', async () => {
      assertTrue(await engine().parts.table.sortByColumn(0));
      assertEqual(await engine().parts.table.getSortDirection(0), 'descending');
      // Descending name order: Ice cream sandwich, Frozen yoghurt, Eclair.
      assertEqual(await engine().parts.table.getCellText(0, 0), 'Ice cream sandwich');
    });

    test('returns undefined for an out-of-range cell', async () => {
      assertEqual(await engine().parts.table.getCellText(99, 0), undefined);
    });

    test('returns false when sorting a column with no sort control', async () => {
      assertFalse(await engine().parts.table.sortByColumn(1));
    });
  },
};
