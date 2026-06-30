import { DataGridPremiumDriver } from '@atomic-testing/component-driver-mui-x-v9';
import { ScenePart, byDataTestId } from '@atomic-testing/core';
import { IExampleUnit, TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { basicDataGridPremiumUIExample } from './BasicDataGridPremium.examples';

export const basicDataGridPremiumExampleScenePart = {
  basicGrid: {
    locator: byDataTestId('basic-grid-premium'),
    driver: DataGridPremiumDriver,
  },
} satisfies ScenePart;

/**
 * Basic DataGridPremium example from MUI's website
 * @see https://mui.com/x/react-data-grid/
 */
export const basicDataGridPremiumExample: IExampleUnit<typeof basicDataGridPremiumExampleScenePart, JSX.Element> = {
  ...basicDataGridPremiumUIExample,
  scene: basicDataGridPremiumExampleScenePart,
};
//#endregion

export const basicDataGridPremiumTestSuite: TestSuiteInfo<typeof basicDataGridPremiumExampleScenePart> = {
  title: 'Basic DataGridPremium',
  url: '/datagridpremium',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertTrue }) => {
    const engine = useTestEngine(basicDataGridPremiumExample.scene, getTestEngine, { beforeEach, afterEach });

    test('it should display at least 2 columns', async () => {
      const count = await engine().parts.basicGrid.getColumnCount();
      assertTrue(count >= 2);
    });

    test('it should display at least 2 rows', async () => {
      const count = await engine().parts.basicGrid.getRowCount();
      assertTrue(count >= 2);
    });

    test('Get cell should return cell with some text', async () => {
      const text = await engine().parts.basicGrid.getCellText({ rowIndex: 1, columnIndex: 1 });
      assertTrue((text ?? '').length > 1);
    });

    test('Header Row should contain columns desk, commodity ...', async () => {
      const columnText = await engine().parts.basicGrid.getHeaderText();
      const expectedColumns = ['Desk', 'Commodity'];
      const columnTextSet = new Set(columnText);
      const columnExists = expectedColumns.every(column => columnTextSet.has(column));
      assertTrue(columnExists);
    });

    test('Data Row 1 should have content in all cells except the first one because it is a checkbox', async () => {
      const rowText = await engine().parts.basicGrid.getRowText(1);
      // Guard against a vacuous pass: an empty row would make `.every` trivially true.
      assertTrue(rowText.length > 1);
      const textCorrect = rowText.every((column, index) => {
        if (index === 0) {
          return column === '';
        }
        return column.length > 1;
      });
      assertTrue(textCorrect);
    });
  },
};
