import { TopNavMenuDriver } from '@atomic-testing/component-driver-astryx';
import { byCssSelector, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { topNavMenuUIExample } from './TopNavMenu.examples';

export const topNavMenuExampleScenePart = {
  // TopNavMenu does not forward data-testid onto its trigger button, so the scene
  // anchors on the semantic class (the only stable handle for the trigger).
  menu: {
    locator: byCssSelector('button.astryx-top-nav-menu'),
    driver: TopNavMenuDriver,
  },
} satisfies ScenePart;

export const topNavMenuExample: IExampleUnit<typeof topNavMenuExampleScenePart, JSX.Element> = {
  ...topNavMenuUIExample,
  scene: topNavMenuExampleScenePart,
};

export const topNavMenuExampleTestSuite: TestSuiteInfo<typeof topNavMenuExample.scene> = {
  title: 'Astryx TopNavMenu',
  url: '/top-nav-menu',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${topNavMenuExample.title}`, () => {
      const engine = useTestEngine(topNavMenuExample.scene, getTestEngine, { beforeEach, afterEach });

      test(`getLabel reads the trigger label`, async () => {
        assertEqual(await engine().parts.menu.getLabel(), 'Products');
      });

      // The panel is always mounted, so its items read even while the menu is closed.
      // The menuitem text bundles title + description, so assert count and that each
      // entry carries its title (substring) rather than an exact, layout-coupled string.
      test(`getItemTitles reads the panel items while closed`, async () => {
        const titles = await engine().parts.menu.getItemTitles();
        assertEqual(titles.length, 2);
        assertTrue(titles[0].includes('Analytics'));
        assertTrue(titles[1].includes('Messaging'));
      });

      // Closed-state read only: opening is native-popover-driven and a no-op in jsdom,
      // so isOpen() is false here (its true case is E2E-only — never asserted in the shared suite).
      test(`isOpen reports the closed state`, async () => {
        assertFalse(await engine().parts.menu.isOpen());
      });
    });
  },
};
