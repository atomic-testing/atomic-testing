import { BottomNavigationDriver } from '@atomic-testing/component-driver-mui-v7';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { IExampleUnit, TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

import { basicBottomNavigationUIExample } from './BasicBottomNavigation.example';

export const basicBottomNavigationExampleScenePart = {
  nav: {
    locator: byDataTestId('bottom-nav'),
    driver: BottomNavigationDriver,
  },
  other: {
    locator: byDataTestId('other-bottom-nav'),
    driver: BottomNavigationDriver,
  },
} satisfies ScenePart;

export const basicBottomNavigationExample: IExampleUnit<typeof basicBottomNavigationExampleScenePart, JSX.Element> = {
  ...basicBottomNavigationUIExample,
  scene: basicBottomNavigationExampleScenePart,
};

export const basicBottomNavigationTestSuite: TestSuiteInfo<typeof basicBottomNavigationExampleScenePart> = {
  title: 'Basic BottomNavigation',
  url: '/bottom-navigation',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    const engine = useTestEngine(basicBottomNavigationExample.scene, getTestEngine, { beforeEach, afterEach });

    test('reports each action with label and selected state per instance', async () => {
      assertEqual(await engine().parts.nav.getActions(), [
        { label: 'Recents', selected: false },
        { label: 'Favorites', selected: true },
        { label: 'Nearby', selected: false },
      ]);
      assertEqual(await engine().parts.other.getActions(), [
        { label: 'Home', selected: true },
        { label: 'Profile', selected: false },
      ]);
    });

    test('reports the selected index independently per instance', async () => {
      assertEqual(await engine().parts.nav.getSelectedIndex(), 1);
      assertEqual(await engine().parts.other.getSelectedIndex(), 0);
    });

    test('reports the selected label independently per instance', async () => {
      assertEqual(await engine().parts.nav.getSelectedLabel(), 'Favorites');
      assertEqual(await engine().parts.other.getSelectedLabel(), 'Home');
    });

    test('selects an action by index', async () => {
      assertTrue(await engine().parts.nav.selectByIndex(2));
      assertEqual(await engine().parts.nav.getSelectedIndex(), 2);
    });

    test('selects an action by label', async () => {
      assertTrue(await engine().parts.nav.selectByLabel('Recents'));
      assertEqual(await engine().parts.nav.getSelectedIndex(), 0);
    });

    test('returns false for out-of-range / unknown selection', async () => {
      assertFalse(await engine().parts.nav.selectByIndex(99));
      assertFalse(await engine().parts.nav.selectByLabel('Missing'));
    });

    test('exposes per-action item drivers', async () => {
      const favorites = await engine().parts.nav.getItemByLabel('Favorites');
      assertTrue(favorites != null);
      assertTrue(await favorites!.isSelected());
    });
  },
};
