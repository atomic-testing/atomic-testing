import { TopNavItemDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { topNavItemUIExample } from './TopNavItem.examples';

export const topNavItemExampleScenePart = {
  selected: {
    locator: byDataTestId('tni-selected'),
    driver: TopNavItemDriver,
  },
  normal: {
    locator: byDataTestId('tni-normal'),
    driver: TopNavItemDriver,
  },
  disabled: {
    locator: byDataTestId('tni-disabled'),
    driver: TopNavItemDriver,
  },
} satisfies ScenePart;

export const topNavItemExample: IExampleUnit<typeof topNavItemExampleScenePart, JSX.Element> = {
  ...topNavItemUIExample,
  scene: topNavItemExampleScenePart,
};

export const topNavItemExampleTestSuite: TestSuiteInfo<typeof topNavItemExample.scene> = {
  title: 'Astryx TopNavItem',
  url: '/top-nav-item',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${topNavItemExample.title}`, () => {
      const engine = useTestEngine(topNavItemExample.scene, getTestEngine, { beforeEach, afterEach });

      test(`getLabel and getHref read the item`, async () => {
        assertEqual(await engine().parts.normal.getLabel(), 'Products');
        assertEqual(await engine().parts.normal.getHref(), '/products');
      });

      // isSelected reads aria-current="page"; only the selected item carries it.
      test(`isSelected distinguishes the current page`, async () => {
        assertTrue(await engine().parts.selected.isSelected());
        assertFalse(await engine().parts.normal.isSelected());
      });

      // isDisabled reads aria-disabled (the item stays an <a>, never native disabled).
      test(`isDisabled distinguishes the disabled item`, async () => {
        assertTrue(await engine().parts.disabled.isDisabled());
        assertFalse(await engine().parts.normal.isDisabled());
      });
    });
  },
};
