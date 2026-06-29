import { NavMenuDriver } from '@atomic-testing/component-driver-astryx';
import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { navMenuUIExample } from './NavMenu.examples';

export const navMenuExampleScenePart = {
  menu: {
    locator: byDataTestId('nav-menu'),
    driver: NavMenuDriver,
  },
  secondary: {
    locator: byDataTestId('nav-menu-secondary'),
    driver: NavMenuDriver,
  },
  picked: {
    locator: byDataTestId('nav-picked'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

export const navMenuExample: IExampleUnit<typeof navMenuExampleScenePart, JSX.Element> = {
  ...navMenuUIExample,
  scene: navMenuExampleScenePart,
};

export const navMenuExampleTestSuite: TestSuiteInfo<typeof navMenuExample.scene> = {
  title: 'Astryx NavMenu',
  url: '/nav-menu',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertFalse, assertTrue }) => {
    describe(`${navMenuExample.title}`, () => {
      const engine = useTestEngine(navMenuExample.scene, getTestEngine, { beforeEach, afterEach });

      // getItemLabels returns each item's visible label in DOM order.
      test(`getItemLabels lists the menu items`, async () => {
        assertEqual(await engine().parts.menu.getItemLabels(), ['Dashboard', 'Analytics', 'Settings', 'Archived']);
      });

      // getItemCount is scoped to the driver's own menu, not the sibling menu.
      test(`getItemCount counts only this menu's items`, async () => {
        assertEqual(await engine().parts.menu.getItemCount(), 4);
        assertEqual(await engine().parts.secondary.getItemCount(), 2);
      });

      // getItemHref reads the link target; non-link items return undefined.
      test(`getItemHref reads hrefs and returns undefined for action items`, async () => {
        assertEqual(await engine().parts.menu.getItemHref('Dashboard'), '/dashboard');
        assertEqual(await engine().parts.menu.getItemHref('Settings'), undefined);
      });

      // isItemDisabled reflects aria-disabled.
      test(`isItemDisabled reflects the disabled item`, async () => {
        assertTrue(await engine().parts.menu.isItemDisabled('Archived'));
        assertFalse(await engine().parts.menu.isItemDisabled('Dashboard'));
      });

      // clickItem activates the matched item; unknown labels return false.
      test(`clickItem activates the named item`, async () => {
        assertTrue(await engine().parts.menu.clickItem('Settings'));
        const picked = await engine().parts.picked.waitUntil({
          probeFn: () => engine().parts.picked.getText(),
          terminateCondition: 'Settings',
          timeoutMs: 2000,
        });
        assertEqual(picked, 'Settings');
      });

      test(`clickItem returns false for an unknown item`, async () => {
        assertFalse(await engine().parts.menu.clickItem('Nope'));
      });
    });
  },
};
