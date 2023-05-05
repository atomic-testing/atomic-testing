import { DataGridProDriver } from '@atomic-testing/component-driver-mui-v5';
import { IExampleUnit, ScenePart, TestEngine, byDataTestId } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';
import { Box } from '@mui/material';
import { DataGridPro } from '@mui/x-data-grid-pro';
import React from 'react';
import { basicGridColumnConfig, initialState } from './gridConfig';
import { gridData } from './gridData';

export const BasicDataGridPro: React.FunctionComponent = () => {
  // Giving minWidth so in DOM test the grid will not be too small
  return (
    <Box data-testid="basic-grid-pro" sx={{ height: 520, minWidth: 1200, width: '100%' }}>
      <DataGridPro
        columns={basicGridColumnConfig}
        rows={gridData}
        initialState={initialState}
        loading={gridData.length === 0}
        rowHeight={38}
        checkboxSelection
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
      />
    </Box>
  );
};

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
  title: 'Basic DataGridPro',
  scene: basicDataGridProExampleScenePart,
  ui: <BasicDataGridPro />,
};
//#endregion

export const basicDataGridProTestSuite: TestSuiteInfo<typeof basicDataGridProExampleScenePart> = {
  title: 'Basic DataGridPro',
  url: '/datagridpro',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    let testEngine: TestEngine<typeof basicDataGridProExample.scene>;

    // Use the following beforeEach to work around the issue of Playwright's page being undefined
    // @ts-ignore
    beforeEach(function ({ page }) {
      // @ts-ignore
      testEngine = getTestEngine(basicDataGridProExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        arguments[0]();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });

    test('it should display at least 2 columns', async () => {
      const count = await testEngine.parts.basicGrid.getColumnCount();
      assertEqual(count >= 2, true);
    });

    test('it should display at least 2 rows', async () => {
      const count = await testEngine.parts.basicGrid.getRowCount();
      assertEqual(count >= 2, true);
    });

    test('Get cell should return cell with some text', async () => {
      const text = await testEngine.parts.basicGrid.getCellText({ rowIndex: 1, columnIndex: 1 });
      assertEqual((text ?? '').length > 1, true);
    });

    test('Header Row should contain columns desk, commodity, trader name ...', async () => {
      const columnText = await testEngine.parts.basicGrid.getHeaderText();
      const expectedColumns = ['Desk', 'Commodity'];
      const columnTextSet = new Set(columnText);
      const columnExists = expectedColumns.every((column) => columnTextSet.has(column));
      assertEqual(columnExists, true);
    });

    test('Data Row 1 should have content in all cells except the first one because it is a checkbox', async () => {
      const rowText = await testEngine.parts.basicGrid.getRowText(1);
      const textCorrect = rowText.every((column, index) => {
        if (index === 0) {
          return column === '';
        }
        return column.length > 1;
      });
      assertEqual(textCorrect, true);
    });
  },
};
