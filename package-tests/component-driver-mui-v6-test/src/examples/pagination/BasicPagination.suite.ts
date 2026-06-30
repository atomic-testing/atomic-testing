import { PaginationDriver } from '@atomic-testing/component-driver-mui-v6';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { IExampleUnit, TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

import { basicPaginationUIExample } from './BasicPagination.example';

export const basicPaginationExampleScenePart = {
  alpha: {
    locator: byDataTestId('alpha-pagination'),
    driver: PaginationDriver,
  },
  beta: {
    locator: byDataTestId('beta-pagination'),
    driver: PaginationDriver,
  },
} satisfies ScenePart;

export const basicPaginationExample: IExampleUnit<typeof basicPaginationExampleScenePart, JSX.Element> = {
  ...basicPaginationUIExample,
  scene: basicPaginationExampleScenePart,
};

export const basicPaginationTestSuite: TestSuiteInfo<typeof basicPaginationExampleScenePart> = {
  title: 'Basic Pagination',
  url: '/pagination',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    const engine = useTestEngine(basicPaginationExample.scene, getTestEngine, { beforeEach, afterEach });

    test('reports the selected page independently per instance', async () => {
      assertEqual(await engine().parts.alpha.getSelectedPage(), 2);
      assertEqual(await engine().parts.beta.getSelectedPage(), 1);
    });

    test('reports the page count independently per instance', async () => {
      assertEqual(await engine().parts.alpha.getPageCount(), 5);
      assertEqual(await engine().parts.beta.getPageCount(), 3);
    });

    test('goes to a page by number', async () => {
      assertTrue(await engine().parts.alpha.goToPage(4));
      assertEqual(await engine().parts.alpha.getSelectedPage(), 4);
    });

    test('returns false for an unavailable page', async () => {
      assertFalse(await engine().parts.alpha.goToPage(99));
      assertEqual(await engine().parts.alpha.getSelectedPage(), 2);
    });

    test('steps next and previous', async () => {
      assertTrue(await engine().parts.alpha.next());
      assertEqual(await engine().parts.alpha.getSelectedPage(), 3);
      assertTrue(await engine().parts.alpha.previous());
      assertEqual(await engine().parts.alpha.getSelectedPage(), 2);
    });

    test('jumps to first and last', async () => {
      assertTrue(await engine().parts.alpha.last());
      assertEqual(await engine().parts.alpha.getSelectedPage(), 5);
      assertTrue(await engine().parts.alpha.first());
      assertEqual(await engine().parts.alpha.getSelectedPage(), 1);
    });

    test('navigation controls report false at the bounds', async () => {
      // beta starts on page 1 of 3, so previous/first are disabled.
      assertFalse(await engine().parts.beta.previous());
      assertFalse(await engine().parts.beta.first());
      assertEqual(await engine().parts.beta.getSelectedPage(), 1);
      assertTrue(await engine().parts.beta.next());
      assertEqual(await engine().parts.beta.getSelectedPage(), 2);
    });
  },
};
