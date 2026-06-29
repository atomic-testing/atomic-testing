import { TabListDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { tabListUIExample } from './TabList.examples';

export const tabListExampleScenePart = {
  tabs: {
    locator: byDataTestId('tabs'),
    driver: TabListDriver,
  },
} satisfies ScenePart;

export const tabListExample: IExampleUnit<typeof tabListExampleScenePart, JSX.Element> = {
  ...tabListUIExample,
  scene: tabListExampleScenePart,
};

export const tabListExampleTestSuite: TestSuiteInfo<typeof tabListExample.scene> = {
  title: 'Astryx TabList',
  url: '/tab-list',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertFalse, assertTrue }) => {
    describe(`${tabListExample.title}`, () => {
      const engine = useTestEngine(tabListExample.scene, getTestEngine, { beforeEach, afterEach });

      // getItemLabels lists the tabs and excludes the overflow ("More") trigger.
      test(`getItemLabels lists the tabs without the overflow trigger`, async () => {
        assertEqual(await engine().parts.tabs.getItemLabels(), ['Home', 'Profile', 'Settings']);
        assertEqual(await engine().parts.tabs.getItemCount(), 3);
      });

      // getActiveLabel reads the aria-current="page" tab.
      test(`getActiveLabel reads the active tab`, async () => {
        assertEqual(await engine().parts.tabs.getActiveLabel(), 'Settings');
      });

      // getTabHref reads the link target; button tabs return undefined.
      test(`getTabHref reads hrefs and returns undefined for button tabs`, async () => {
        assertEqual(await engine().parts.tabs.getTabHref('Profile'), '/profile');
        assertEqual(await engine().parts.tabs.getTabHref('Home'), undefined);
      });

      // selectTab activates the named tab, moving aria-current.
      test(`selectTab activates the named tab`, async () => {
        assertTrue(await engine().parts.tabs.selectTab('Home'));
        const active = await engine().parts.tabs.waitUntil({
          probeFn: () => engine().parts.tabs.getActiveLabel(),
          terminateCondition: 'Home',
          timeoutMs: 2000,
        });
        assertEqual(active, 'Home');
        assertTrue(await engine().parts.tabs.isActive('Home'));
      });

      test(`selectTab returns false for an unknown tab`, async () => {
        assertFalse(await engine().parts.tabs.selectTab('Nope'));
      });
    });
  },
};
