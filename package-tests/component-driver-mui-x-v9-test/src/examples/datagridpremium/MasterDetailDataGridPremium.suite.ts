import { DataGridPremiumDriver } from '@atomic-testing/component-driver-mui-x-v9';
import { IExampleUnit, ScenePart, byDataTestId } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import {
  masterDetailDataGridPremiumUIExample,
  masterDetailGridRows,
  noDetailRowIndex,
} from './MasterDetailDataGridPremium.examples';

export const masterDetailDataGridPremiumExampleScenePart = {
  grid: {
    locator: byDataTestId('master-detail-grid-premium'),
    driver: DataGridPremiumDriver,
  },
} satisfies ScenePart;

export const masterDetailDataGridPremiumExample: IExampleUnit<
  typeof masterDetailDataGridPremiumExampleScenePart,
  JSX.Element
> = {
  ...masterDetailDataGridPremiumUIExample,
  scene: masterDetailDataGridPremiumExampleScenePart,
};

const detailedRowIndex = 0;
const detailedRowTraderEmail = masterDetailGridRows[detailedRowIndex].traderEmail;

export const masterDetailDataGridPremiumTestSuite: TestSuiteInfo<typeof masterDetailDataGridPremiumExampleScenePart> = {
  title: 'Master-Detail DataGridPremium',
  url: '/datagridmasterdetail',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    const engine = useTestEngine(masterDetailDataGridPremiumExample.scene, getTestEngine, { beforeEach, afterEach });

    test('rows start collapsed', async () => {
      await engine().parts.grid.waitForLoad();
      assertFalse(await engine().parts.grid.isRowDetailExpanded(detailedRowIndex));
    });

    test('expandRowDetail reveals the panel content, collapseRowDetail hides it again', async () => {
      await engine().parts.grid.waitForLoad();

      await engine().parts.grid.expandRowDetail(detailedRowIndex);
      assertTrue(await engine().parts.grid.isRowDetailExpanded(detailedRowIndex));
      assertEqual(
        await engine().parts.grid.getRowDetailText(detailedRowIndex),
        `Trader email: ${detailedRowTraderEmail}`
      );

      await engine().parts.grid.collapseRowDetail(detailedRowIndex);
      assertFalse(await engine().parts.grid.isRowDetailExpanded(detailedRowIndex));
      assertEqual(await engine().parts.grid.getRowDetailText(detailedRowIndex), null);
    });

    test('getRowDetailPanel returns null before expansion and a driver over the panel content after', async () => {
      await engine().parts.grid.waitForLoad();
      assertEqual(await engine().parts.grid.getRowDetailPanel(detailedRowIndex), null);

      await engine().parts.grid.expandRowDetail(detailedRowIndex);
      const panel = await engine().parts.grid.getRowDetailPanel(detailedRowIndex);
      assertTrue(panel !== null);
      assertEqual(await panel!.getText(), `Trader email: ${detailedRowTraderEmail}`);
    });

    test('expandRowDetail throws for a row with no detail-panel content', async () => {
      await engine().parts.grid.waitForLoad();
      let message = '';
      try {
        await engine().parts.grid.expandRowDetail(noDetailRowIndex);
      } catch (error) {
        message = (error as Error).message;
      }
      // Pins the specific disabled-toggle throw, not just "it threw" — a regression that made the
      // driver fall through to the slower "never became expanded" timeout path instead would
      // still throw, but with a different message, and should fail this test.
      assertTrue(message.includes('has no detail-panel content to expand'));
      assertFalse(await engine().parts.grid.isRowDetailExpanded(noDetailRowIndex));
    });

    test('collapseRowDetail is a no-op on a row that is already collapsed', async () => {
      await engine().parts.grid.waitForLoad();
      assertFalse(await engine().parts.grid.isRowDetailExpanded(detailedRowIndex));
      await engine().parts.grid.collapseRowDetail(detailedRowIndex);
      assertFalse(await engine().parts.grid.isRowDetailExpanded(detailedRowIndex));
    });

    test('isRowDetailExpanded/getRowDetailPanel/getRowDetailText throw for a row that does not exist', async () => {
      await engine().parts.grid.waitForLoad();
      const outOfRangeIndex = masterDetailGridRows.length + 10;

      let isExpandedThrew = false;
      try {
        await engine().parts.grid.isRowDetailExpanded(outOfRangeIndex);
      } catch {
        isExpandedThrew = true;
      }
      assertTrue(isExpandedThrew);

      let getPanelThrew = false;
      try {
        await engine().parts.grid.getRowDetailPanel(outOfRangeIndex);
      } catch {
        getPanelThrew = true;
      }
      assertTrue(getPanelThrew);

      let getTextThrew = false;
      try {
        await engine().parts.grid.getRowDetailText(outOfRangeIndex);
      } catch {
        getTextThrew = true;
      }
      assertTrue(getTextThrew);
    });
  },
};
