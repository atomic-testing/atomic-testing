import { ButtonDriver, NavDrawerDriver, NavDriver } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { navUIExample } from './Nav.examples';

export const navExampleScenePart = {
  navA: { locator: byDataTestId('nav-a'), driver: NavDriver },
  navB: { locator: byDataTestId('nav-b'), driver: NavDriver },
  navDrawerTrigger: { locator: byDataTestId('nav-drawer-trigger'), driver: ButtonDriver },
  navDrawer: { locator: byDataTestId('nav-drawer'), driver: NavDrawerDriver },
} satisfies ScenePart;

export const navExample: IExampleUnit<typeof navExampleScenePart, JSX.Element> = {
  ...navUIExample,
  scene: navExampleScenePart,
};

export const navExampleTestSuite: TestSuiteInfo<typeof navExample.scene> = {
  title: 'Fluent Nav',
  url: '/nav',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${navExample.title}`, () => {
      const engine = useTestEngine(navExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('counts items per instance (disambiguation), flattened across categories', async () => {
        // nav-a: Home, Reports (category trigger), Daily, Weekly, Settings = 5
        assertEqual(await engine().parts.navA.getItemCount(), 5);
        // nav-b: Alpha, Beta = 2
        assertEqual(await engine().parts.navB.getItemCount(), 2);
      });

      test('getItemByLabel resolves a leaf item, or null when absent', async () => {
        const home = await engine().parts.navA.getItemByLabel('Home');
        assertTrue(await home!.isSelected());

        assertEqual(await engine().parts.navA.getItemByLabel('Nonexistent'), null);
        assertEqual(await engine().parts.navB.getItemByLabel('Home'), null);
      });

      test('getSelectedLabel reads the selected item per instance', async () => {
        assertEqual(await engine().parts.navA.getSelectedLabel(), 'Home');
        assertEqual(await engine().parts.navB.getSelectedLabel(), 'Alpha');
      });

      test('getCategoryByLabel resolves the expand/collapse-capable driver, defaulted open', async () => {
        const reports = await engine().parts.navA.getCategoryByLabel('Reports');
        assertTrue(reports != null);
        assertTrue(await reports!.isExpanded());
        assertEqual(await reports!.getSubItemCount(), 2);

        assertEqual(await engine().parts.navB.getCategoryByLabel('Reports'), null);
      });

      test('NavCategoryItemDriver.collapse()/expand() toggle the category and its sub-items reachability', async () => {
        const reports = await engine().parts.navA.getCategoryByLabel('Reports');
        await reports!.collapse();
        assertFalse(await reports!.isExpanded());

        await reports!.expand();
        assertTrue(await reports!.isExpanded());

        const daily = await reports!.getSubItemByLabel('Daily');
        assertEqual(await daily?.getLabel(), 'Daily');
        assertEqual(await reports!.getSubItemByLabel('Nonexistent'), null);
      });

      test('selectByLabel clicks the matching item without throwing, scoped to its own Nav', async () => {
        await engine().parts.navA.selectByLabel('Settings');
        await engine().parts.navB.selectByLabel('Beta');
      });

      test('nav drawer is not open initially', async () => {
        assertFalse(await engine().parts.navDrawer.isOpen());
      });

      test('nav drawer opens via its trigger and reads its own items, independent of the plain Navs', async () => {
        await engine().parts.navDrawerTrigger.click();
        assertTrue(await engine().parts.navDrawer.waitForOpen());

        assertEqual(await engine().parts.navDrawer.getItemCount(), 2);
        assertEqual(await engine().parts.navDrawer.getSelectedLabel(), 'Drawer Home');

        // The plain Navs are unaffected by the drawer's open state.
        assertEqual(await engine().parts.navA.getSelectedLabel(), 'Home');
      });

      test('nav drawer closes via Escape', async () => {
        await engine().parts.navDrawerTrigger.click();
        await engine().parts.navDrawer.waitForOpen();
        assertTrue(await engine().parts.navDrawer.closeByEscape());
        assertFalse(await engine().parts.navDrawer.isOpen());
      });
    });
  },
};
