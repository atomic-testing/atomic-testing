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
      let threw = false;
      try {
        await engine().parts.grid.expandRowDetail(noDetailRowIndex, 500);
      } catch {
        threw = true;
      }
      assertTrue(threw);
      assertFalse(await engine().parts.grid.isRowDetailExpanded(noDetailRowIndex));
    });
  },
};
