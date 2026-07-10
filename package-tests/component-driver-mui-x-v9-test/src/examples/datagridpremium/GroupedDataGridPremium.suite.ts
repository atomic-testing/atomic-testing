import { DataGridPremiumDriver } from '@atomic-testing/component-driver-mui-x-v9';
import { IExampleUnit, ScenePart, byDataTestId } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { groupedDataGridPremiumUIExample, groupedGridRows } from './GroupedDataGridPremium.examples';

export const groupedDataGridPremiumExampleScenePart = {
  grid: {
    locator: byDataTestId('grouped-grid-premium'),
    driver: DataGridPremiumDriver,
  },
} satisfies ScenePart;

export const groupedDataGridPremiumExample: IExampleUnit<typeof groupedDataGridPremiumExampleScenePart, JSX.Element> = {
  ...groupedDataGridPremiumUIExample,
  scene: groupedDataGridPremiumExampleScenePart,
};

// Expected values are derived from the shared static fixture, so the assertions stay correct if
// the fixture data ever changes: one group per distinct status, and the sum aggregation over
// every row's quantity.
const expectedGroupCount = new Set(groupedGridRows.map(row => row.status)).size;
const expectedQuantitySum = groupedGridRows.reduce((sum, row) => sum + Number(row.quantity), 0);

/** Parse a grid-formatted number (thousands separators etc.) back to a plain number. */
const parseGridNumber = (text: string | null): number => Number((text ?? '').replace(/[^\d.-]/g, ''));

export const groupedDataGridPremiumTestSuite: TestSuiteInfo<typeof groupedDataGridPremiumExampleScenePart> = {
  title: 'Grouped DataGridPremium',
  url: '/datagridgrouped',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    const engine = useTestEngine(groupedDataGridPremiumExample.scene, getTestEngine, { beforeEach, afterEach });

    test('renders one group header per distinct status, all collapsed', async () => {
      await engine().parts.grid.waitForLoad();
      assertEqual(await engine().parts.grid.getGroupRowCount(), expectedGroupCount);
      assertFalse(await engine().parts.grid.isGroupExpanded(0));
    });

    // Rendered row count is compared as a delta rather than an absolute: the grand-total footer
    // and virtualization make the absolute count environment-dependent, but expanding a group
    // reveals its child rows in both jsdom and a real browser (the small dataset and tall grid
    // keep every revealed row within the viewport, so nothing is virtualized away here).
    test('expandGroup reveals child rows, collapseGroup hides them again', async () => {
      await engine().parts.grid.waitForLoad();
      const collapsedRowCount = await engine().parts.grid.getRowCount();

      await engine().parts.grid.expandGroup(0);
      assertTrue(await engine().parts.grid.isGroupExpanded(0));
      assertTrue((await engine().parts.grid.getRowCount()) > collapsedRowCount);

      await engine().parts.grid.collapseGroup(0);
      assertFalse(await engine().parts.grid.isGroupExpanded(0));
      assertEqual(await engine().parts.grid.getRowCount(), collapsedRowCount);
    });

    test('getAggregationValue reports the sum of the quantity column', async () => {
      await engine().parts.grid.waitForLoad();
      assertEqual(parseGridNumber(await engine().parts.grid.getAggregationValue('quantity')), expectedQuantitySum);
    });
  },
};
