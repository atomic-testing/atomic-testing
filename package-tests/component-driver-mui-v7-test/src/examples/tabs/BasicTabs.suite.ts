import { TabsDriver } from '@atomic-testing/component-driver-mui-v7';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

import { basicTabsUIExample } from './BasicTabs.example';

export const basicTabsExampleScenePart = {
  fruit: {
    locator: byDataTestId('fruit-tabs'),
    driver: TabsDriver,
  },
  color: {
    locator: byDataTestId('color-tabs'),
    driver: TabsDriver,
  },
  empty: {
    locator: byDataTestId('empty-tabs'),
    driver: TabsDriver,
  },
} satisfies ScenePart;

export const basicTabsExample: IExampleUnit<typeof basicTabsExampleScenePart, JSX.Element> = {
  ...basicTabsUIExample,
  scene: basicTabsExampleScenePart,
};

export const basicTabsTestSuite: TestSuiteInfo<typeof basicTabsExampleScenePart> = {
  title: 'Basic Tabs',
  url: '/tabs',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    const engine = useTestEngine(basicTabsExample.scene, getTestEngine, { beforeEach, afterEach });

    test('reports each group its own tab labels', async () => {
      assertEqual(await engine().parts.fruit.getTabLabels(), ['Apple', 'Banana', 'Cherry']);
      assertEqual(await engine().parts.color.getTabLabels(), ['Red', 'Green', 'Blue']);
    });

    test('reports the tab count', async () => {
      assertEqual(await engine().parts.fruit.getTabCount(), 3);
      assertEqual(await engine().parts.empty.getTabCount(), 2);
    });

    test('reports the selected index independently per group', async () => {
      assertEqual(await engine().parts.fruit.getSelectedIndex(), 0);
      assertEqual(await engine().parts.color.getSelectedIndex(), 2);
    });

    test('reports the selected label', async () => {
      assertEqual(await engine().parts.fruit.getSelectedLabel(), 'Apple');
      assertEqual(await engine().parts.color.getSelectedLabel(), 'Blue');
    });

    test('reports no selection when value is false', async () => {
      assertEqual(await engine().parts.empty.getSelectedIndex(), -1);
      assertEqual(await engine().parts.empty.getSelectedLabel(), null);
    });

    test('selects a tab by index', async () => {
      assertTrue(await engine().parts.fruit.selectByIndex(1));
      assertEqual(await engine().parts.fruit.getSelectedIndex(), 1);
      assertEqual(await engine().parts.fruit.getSelectedLabel(), 'Banana');
    });

    test('selects a tab by label', async () => {
      assertTrue(await engine().parts.fruit.selectByLabel('Banana'));
      assertEqual(await engine().parts.fruit.getSelectedIndex(), 1);
    });

    test('returns false for out-of-range / unknown selection', async () => {
      assertFalse(await engine().parts.fruit.selectByIndex(99));
      assertFalse(await engine().parts.fruit.selectByLabel('Durian'));
    });

    test('reports disabled tabs per group', async () => {
      assertTrue(await engine().parts.fruit.isTabDisabled(2));
      assertFalse(await engine().parts.fruit.isTabDisabled(0));
      assertFalse(await engine().parts.color.isTabDisabled(2));
    });

    test('exposes per-tab item drivers', async () => {
      const apple = await engine().parts.fruit.getItemByLabel('Apple');
      assertTrue(apple != null);
      assertTrue(await apple!.isSelected());

      const banana = await engine().parts.fruit.getItemByIndex(1);
      assertTrue(banana != null);
      assertFalse(await banana!.isSelected());

      const cherry = await engine().parts.fruit.getItemByIndex(2);
      assertTrue(await cherry!.isDisabled());
    });
  },
};
