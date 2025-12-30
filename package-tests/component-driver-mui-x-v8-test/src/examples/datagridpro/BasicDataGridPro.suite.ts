import { JSX } from 'react';

import { DataGridProDriver } from '@atomic-testing/component-driver-mui-x-v8';
import { IExampleUnit, ScenePart,  byDataTestId } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

import { basicDataGridProUIExample } from './BasicDataGridPro.examples';

export const basicDataGridProExampleScenePart = {
  basicGrid: {
    locator: byDataTestId('basic-grid-pro'),
    driver: DataGridProDriver,
  },
} satisfies ScenePart;

/**
 * Basic DataGridPro example from MUI's website
 * @see https://mui.com/material-ui/react-datagridpro#description
 */
export const basicDataGridProExample: IExampleUnit<typeof basicDataGridProExampleScenePart, JSX.Element> = {
  ...basicDataGridProUIExample,
  scene: basicDataGridProExampleScenePart,
};
//#endregion

export const basicDataGridProTestSuite: TestSuiteInfo<typeof basicDataGridProExampleScenePart> = {
  title: 'Basic DataGridPro',
  url: '/datagridpro',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertTrue }) => {
    const engine = useTestEngine(basicDataGridProExample.scene, getTestEngine, { beforeEach, afterEach });

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
