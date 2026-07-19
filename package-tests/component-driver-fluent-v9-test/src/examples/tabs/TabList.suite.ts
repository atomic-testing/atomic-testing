import { TabListDriver } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { tabListUIExample } from './TabList.examples';

export const tabListExampleScenePart = {
  listA: { locator: byDataTestId('tab-list-a'), driver: TabListDriver },
  listB: { locator: byDataTestId('tab-list-b'), driver: TabListDriver },
} satisfies ScenePart;

export const tabListExample: IExampleUnit<typeof tabListExampleScenePart, JSX.Element> = {
  ...tabListUIExample,
  scene: tabListExampleScenePart,
};

export const tabListExampleTestSuite: TestSuiteInfo<typeof tabListExample.scene> = {
  title: 'Fluent TabList',
  url: '/tabs',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${tabListExample.title}`, () => {
      const engine = useTestEngine(tabListExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('reads tab labels, count, and orientation per instance (disambiguation)', async () => {
        assertEqual(await engine().parts.listA.getTabLabels(), ['Home', 'Profile', 'Settings']);
        assertEqual(await engine().parts.listA.getTabCount(), 3);
        assertEqual(await engine().parts.listA.getOrientation(), 'horizontal');

        assertEqual(await engine().parts.listB.getTabLabels(), ['Overview', 'Details']);
        assertEqual(await engine().parts.listB.getTabCount(), 2);
        assertEqual(await engine().parts.listB.getOrientation(), 'vertical');
      });

      test('reads the default-selected tab', async () => {
        assertEqual(await engine().parts.listA.getSelectedIndex(), 0);
        assertEqual(await engine().parts.listA.getSelectedLabel(), 'Home');
        assertEqual(await engine().parts.listA.getSelectedValue(), 'home');
      });

      test('selectByIndex selects a different tab, leaving the other list untouched', async () => {
        assertTrue(await engine().parts.listA.selectByIndex(1));
        assertEqual(await engine().parts.listA.getSelectedLabel(), 'Profile');

        assertEqual(await engine().parts.listB.getSelectedLabel(), 'Overview');
        assertFalse(await engine().parts.listA.selectByIndex(99));
      });

      test('selectByLabel and selectByValue select the matching tab', async () => {
        assertTrue(await engine().parts.listB.selectByLabel('Details'));
        assertEqual(await engine().parts.listB.getSelectedValue(), 'details');

        assertTrue(await engine().parts.listA.selectByValue('profile'));
        assertEqual(await engine().parts.listA.getSelectedLabel(), 'Profile');

        assertFalse(await engine().parts.listA.selectByLabel('Nonexistent'));
        assertFalse(await engine().parts.listB.selectByValue('nonexistent'));
      });

      test('isTabDisabled reflects the disabled tab only', async () => {
        assertFalse(await engine().parts.listA.isTabDisabled(0));
        assertTrue(await engine().parts.listA.isTabDisabled(2));
        assertFalse(await engine().parts.listA.isTabDisabled(99));
      });

      test('a disabled tab has no aria-selected attribute and reads as unselected', async () => {
        const settingsTab = await engine().parts.listA.getItemByIndex(2);
        assertTrue(settingsTab != null);
        assertFalse(await settingsTab!.isSelected());
        assertEqual(await settingsTab!.getValue(), 'settings');
      });
    });
  },
};
