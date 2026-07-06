import { TabsDriver } from '@atomic-testing/component-driver-radix-v1';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { tabsUIExample } from './Tabs.examples';

export const tabsExampleScenePart = {
  tabs: {
    locator: byDataTestId('tabs-list'),
    driver: TabsDriver,
  },
} satisfies ScenePart;

export const tabsExample: IExampleUnit<typeof tabsExampleScenePart, JSX.Element> = {
  ...tabsUIExample,
  scene: tabsExampleScenePart,
};

export const tabsExampleTestSuite: TestSuiteInfo<typeof tabsExample.scene> = {
  title: 'Radix Tabs',
  url: '/tabs',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${tabsExample.title}`, () => {
      const engine = useTestEngine(tabsExample.scene, getTestEngine, { beforeEach, afterEach });

      test('reads tab labels, count and default selection', async () => {
        assertEqual(await engine().parts.tabs.getTabLabels(), ['One', 'Two', 'Three']);
        assertEqual(await engine().parts.tabs.getTabCount(), 3);
        assertEqual(await engine().parts.tabs.getSelectedIndex(), 0);
        assertEqual(await engine().parts.tabs.getSelectedLabel(), 'One');
      });

      test('selects a tab by label and by index', async () => {
        assertTrue(await engine().parts.tabs.selectByLabel('Two'));
        assertEqual(await engine().parts.tabs.getSelectedLabel(), 'Two');

        assertTrue(await engine().parts.tabs.selectByIndex(0));
        assertEqual(await engine().parts.tabs.getSelectedLabel(), 'One');
      });

      test('reports failure selecting an unknown label or out-of-range index', async () => {
        assertFalse(await engine().parts.tabs.selectByLabel('Does not exist'));
        assertFalse(await engine().parts.tabs.selectByIndex(99));
      });

      test('reads the disabled tab', async () => {
        assertFalse(await engine().parts.tabs.isTabDisabled(0));
        assertTrue(await engine().parts.tabs.isTabDisabled(2));
      });

      test('reads the linked panel text via aria-controls, tracking selection', async () => {
        assertEqual(await engine().parts.tabs.getPanelText(0), 'First panel');

        await engine().parts.tabs.selectByIndex(1);
        assertEqual(await engine().parts.tabs.getPanelText(1), 'Second panel');
      });
    });
  },
};
