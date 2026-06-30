import { TopNavDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { topNavUIExample } from './TopNav.examples';

export const topNavExampleScenePart = {
  topNav: {
    locator: byDataTestId('top-nav'),
    driver: TopNavDriver,
  },
} satisfies ScenePart;

export const topNavExample: IExampleUnit<typeof topNavExampleScenePart, JSX.Element> = {
  ...topNavUIExample,
  scene: topNavExampleScenePart,
};

export const topNavExampleTestSuite: TestSuiteInfo<typeof topNavExample.scene> = {
  title: 'Astryx TopNav',
  url: '/top-nav',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${topNavExample.title}`, () => {
      const engine = useTestEngine(topNavExample.scene, getTestEngine, { beforeEach, afterEach });

      test(`getLabel reads the navigation landmark name`, async () => {
        assertEqual(await engine().parts.topNav.getLabel(), 'Main navigation');
      });

      test(`getItemCount counts the TopNavItem links`, async () => {
        assertEqual(await engine().parts.topNav.getItemCount(), 3);
      });
    });
  },
};
