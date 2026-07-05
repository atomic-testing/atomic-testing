import { TableDriver } from '@atomic-testing/component-driver-angular-material-v20';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

export const tableScenePart = {
  // Native <table mat-table> variant.
  elements: {
    locator: byDataTestId('element-table'),
    driver: TableDriver,
  },
  // Flex <mat-table> variant.
  fruits: {
    locator: byDataTestId('fruit-table'),
    driver: TableDriver,
  },
} satisfies ScenePart;

export const tableTestSuite: TestSuiteInfo<typeof tableScenePart> = {
  title: 'Angular Material v20 Table',
  url: '/table',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe('MatTable', () => {
      const engine = useTestEngine(tableScenePart, getTestEngine, { beforeEach, afterEach });

      // Every test reads both fixtures: the native-table and flex variants
      // must behave identically through the driver, and differing data
      // proves per-instance reads never leak across tables.
      test('reads the column headers', async () => {
        assertEqual(await engine().parts.elements.getColumnHeaders(), ['No.', 'Name', 'Symbol']);
        assertEqual(await engine().parts.fruits.getColumnHeaders(), ['Fruit', 'Color']);
      });

      test('counts the data rows, excluding the header row', async () => {
        assertEqual(await engine().parts.elements.getRowCount(), 4);
        assertEqual(await engine().parts.fruits.getRowCount(), 3);
      });

      test('reads a row by index', async () => {
        const helium = await engine().parts.elements.getRowByIndex(1);
        assertEqual(await helium!.getCellTexts(), ['2', 'Helium', 'He']);
        assertEqual(await helium!.getCellCount(), 3);

        const banana = await engine().parts.fruits.getRowByIndex(1);
        assertEqual(await banana!.getCellTexts(), ['Banana', 'Yellow']);
      });

      test('returns null for an out-of-range row', async () => {
        assertEqual(await engine().parts.elements.getRowByIndex(4), null);
        assertEqual(await engine().parts.fruits.getRowByIndex(99), null);
      });

      test('reads cell text by column header and by column index', async () => {
        assertEqual(await engine().parts.elements.getCellText(0, 'Symbol'), 'H');
        assertEqual(await engine().parts.elements.getCellText(0, 2), 'H');
        assertEqual(await engine().parts.elements.getCellText(3, 'Name'), 'Beryllium');
        assertEqual(await engine().parts.fruits.getCellText(2, 'Color'), 'Dark Red');
        assertEqual(await engine().parts.fruits.getCellText(2, 0), 'Cherry');
      });

      test('reads a cell within a row by index', async () => {
        const lithium = await engine().parts.elements.getRowByIndex(2);
        assertEqual(await lithium!.getCellText(1), 'Lithium');
        assertEqual(await lithium!.getCellText(3), null);
      });

      test('returns null for an unknown column or row', async () => {
        assertEqual(await engine().parts.elements.getCellText(0, 'Weight'), null);
        assertEqual(await engine().parts.elements.getCellText(9, 'Name'), null);
        assertEqual(await engine().parts.fruits.getColumnIndex('Weight'), -1);
      });

      test('resolves column indexes from header text', async () => {
        assertEqual(await engine().parts.elements.getColumnIndex('No.'), 0);
        assertEqual(await engine().parts.fruits.getColumnIndex('Color'), 1);
      });
    });
  },
};
