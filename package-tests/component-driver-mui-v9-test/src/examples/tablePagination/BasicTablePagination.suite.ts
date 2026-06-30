import { TablePaginationDriver } from '@atomic-testing/component-driver-mui-v9';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { IExampleUnit, TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

import { basicTablePaginationUIExample } from './BasicTablePagination.example';

export const basicTablePaginationExampleScenePart = {
  alpha: {
    locator: byDataTestId('alpha-table-pagination'),
    driver: TablePaginationDriver,
  },
  beta: {
    locator: byDataTestId('beta-table-pagination'),
    driver: TablePaginationDriver,
  },
} satisfies ScenePart;

export const basicTablePaginationExample: IExampleUnit<typeof basicTablePaginationExampleScenePart, JSX.Element> = {
  ...basicTablePaginationUIExample,
  scene: basicTablePaginationExampleScenePart,
};

export const basicTablePaginationTestSuite: TestSuiteInfo<typeof basicTablePaginationExampleScenePart> = {
  title: 'Basic TablePagination',
  url: '/table-pagination',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    const engine = useTestEngine(basicTablePaginationExample.scene, getTestEngine, { beforeEach, afterEach });

    test('reports rows per page independently per instance', async () => {
      assertEqual(await engine().parts.alpha.getRowsPerPage(), 5);
      assertEqual(await engine().parts.beta.getRowsPerPage(), 10);
    });

    test('reports the displayed rows label independently per instance', async () => {
      assertEqual(await engine().parts.alpha.getDisplayedRowsText(), '1–5 of 13');
      assertEqual(await engine().parts.beta.getDisplayedRowsText(), '11–20 of 42');
    });

    test('reports nav disabled state at the bounds', async () => {
      // alpha is on page 1 (0-indexed 0): previous disabled, next enabled.
      assertTrue(await engine().parts.alpha.isPreviousDisabled());
      assertFalse(await engine().parts.alpha.isNextDisabled());
      // beta is mid-range: both enabled.
      assertFalse(await engine().parts.beta.isPreviousDisabled());
      assertFalse(await engine().parts.beta.isNextDisabled());
    });

    test('changes rows per page via the select', async () => {
      assertTrue(await engine().parts.alpha.setRowsPerPage(10));
      assertEqual(await engine().parts.alpha.getRowsPerPage(), 10);
      assertEqual(await engine().parts.alpha.getDisplayedRowsText(), '1–10 of 13');
    });

    test('returns false for an unavailable rows-per-page option', async () => {
      assertFalse(await engine().parts.alpha.setRowsPerPage(7));
      assertEqual(await engine().parts.alpha.getRowsPerPage(), 5);
    });

    test('steps to the next and previous page', async () => {
      assertTrue(await engine().parts.alpha.nextPage());
      assertEqual(await engine().parts.alpha.getDisplayedRowsText(), '6–10 of 13');
      assertTrue(await engine().parts.alpha.previousPage());
      assertEqual(await engine().parts.alpha.getDisplayedRowsText(), '1–5 of 13');
    });

    test('previousPage returns false on the first page', async () => {
      assertFalse(await engine().parts.alpha.previousPage());
      assertEqual(await engine().parts.alpha.getDisplayedRowsText(), '1–5 of 13');
    });
  },
};
