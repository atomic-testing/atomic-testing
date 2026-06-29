import { PaginationDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { paginationUIExample } from './Pagination.examples';

export const paginationExampleScenePart = {
  pager: {
    locator: byDataTestId('pager'),
    driver: PaginationDriver,
  },
  countPager: {
    locator: byDataTestId('count-pager'),
    driver: PaginationDriver,
  },
} satisfies ScenePart;

export const paginationExample: IExampleUnit<typeof paginationExampleScenePart, JSX.Element> = {
  ...paginationUIExample,
  scene: paginationExampleScenePart,
};

export const paginationExampleTestSuite: TestSuiteInfo<typeof paginationExample.scene> = {
  title: 'Astryx Pagination',
  url: '/pagination',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${paginationExample.title}`, () => {
      const engine = useTestEngine(paginationExample.scene, getTestEngine, { beforeEach, afterEach });

      // getCurrentPage reads the aria-current page button.
      test(`getCurrentPage reads the selected page`, async () => {
        assertEqual(await engine().parts.pager.getCurrentPage(), 2);
      });

      // goToPage clicks a numbered control; next/previous step the page.
      test(`goToPage/next/previous navigate`, async () => {
        assertTrue(await engine().parts.pager.goToPage(3));
        assertEqual(await engine().parts.pager.getCurrentPage(), 3);
        assertTrue(await engine().parts.pager.next());
        assertEqual(await engine().parts.pager.getCurrentPage(), 4);
        assertTrue(await engine().parts.pager.previous());
        assertEqual(await engine().parts.pager.getCurrentPage(), 3);
      });

      // At page 2+ the previous control is enabled.
      test(`isPrevDisabled is false away from the first page`, async () => {
        assertFalse(await engine().parts.pager.isPrevDisabled());
      });

      // The count variant exposes its summary text.
      test(`getCountText returns the count summary`, async () => {
        assertEqual(await engine().parts.countPager.getCountText(), '21–40 of 200');
      });
    });
  },
};
