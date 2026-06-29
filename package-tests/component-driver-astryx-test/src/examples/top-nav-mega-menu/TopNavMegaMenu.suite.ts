import { TopNavMegaMenuDriver } from '@atomic-testing/component-driver-astryx';
import { byCssSelector, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { topNavMegaMenuUIExample } from './TopNavMegaMenu.examples';

export const topNavMegaMenuExampleScenePart = {
  // TopNavMegaMenu does not forward data-testid onto its trigger button, so the
  // scene anchors on the semantic class (the only stable handle for the trigger).
  megaMenu: {
    locator: byCssSelector('button.astryx-top-nav-mega-menu'),
    driver: TopNavMegaMenuDriver,
  },
} satisfies ScenePart;

export const topNavMegaMenuExample: IExampleUnit<typeof topNavMegaMenuExampleScenePart, JSX.Element> = {
  ...topNavMegaMenuUIExample,
  scene: topNavMegaMenuExampleScenePart,
};

export const topNavMegaMenuExampleTestSuite: TestSuiteInfo<typeof topNavMegaMenuExample.scene> = {
  title: 'Astryx TopNavMegaMenu',
  url: '/top-nav-mega-menu',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${topNavMegaMenuExample.title}`, () => {
      const engine = useTestEngine(topNavMegaMenuExample.scene, getTestEngine, { beforeEach, afterEach });

      test(`getLabel reads the trigger label`, async () => {
        assertEqual(await engine().parts.megaMenu.getLabel(), 'Products');
      });

      // The panel is always mounted, so its entries read even while the menu is closed.
      // Entry text bundles title + description, so assert count and per-entry title (substring).
      test(`getItemTitles reads the panel entries while closed`, async () => {
        const titles = await engine().parts.megaMenu.getItemTitles();
        assertEqual(titles.length, 2);
        assertTrue(titles[0].includes('Analytics'));
        assertTrue(titles[1].includes('Messaging'));
      });

      // Closed-state read only: expansion uses the native Popover API (no-op in jsdom),
      // so isExpanded() is false here (its true case is E2E-only — never asserted in the shared suite).
      test(`isExpanded reports the closed state`, async () => {
        assertFalse(await engine().parts.megaMenu.isExpanded());
      });
    });
  },
};
