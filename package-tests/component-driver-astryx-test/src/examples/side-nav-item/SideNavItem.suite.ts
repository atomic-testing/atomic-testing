import { SideNavItemDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { sideNavItemUIExample } from './SideNavItem.examples';

export const sideNavItemExampleScenePart = {
  leaf: {
    locator: byDataTestId('sni-leaf'),
    driver: SideNavItemDriver,
  },
  collapsible: {
    locator: byDataTestId('sni-collapsible'),
    driver: SideNavItemDriver,
  },
} satisfies ScenePart;

export const sideNavItemExample: IExampleUnit<typeof sideNavItemExampleScenePart, JSX.Element> = {
  ...sideNavItemUIExample,
  scene: sideNavItemExampleScenePart,
};

export const sideNavItemExampleTestSuite: TestSuiteInfo<typeof sideNavItemExample.scene> = {
  title: 'Astryx SideNavItem',
  url: '/side-nav-item',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${sideNavItemExample.title}`, () => {
      const engine = useTestEngine(sideNavItemExample.scene, getTestEngine, { beforeEach, afterEach });

      // The leaf root is the anchor; the collapsible root is a <div> wrapping an <a>.
      test(`getLabel and getHref read both item shapes`, async () => {
        assertEqual(await engine().parts.leaf.getLabel(), 'Dashboard');
        assertEqual(await engine().parts.leaf.getHref(), '/dashboard');
        assertEqual(await engine().parts.collapsible.getLabel(), 'Settings');
        assertEqual(await engine().parts.collapsible.getHref(), '/settings');
      });

      // isSelected reads aria-current="page" off the root or its anchor.
      test(`isSelected distinguishes the current leaf`, async () => {
        assertTrue(await engine().parts.leaf.isSelected());
        assertFalse(await engine().parts.collapsible.isSelected());
      });

      // isExpanded reads the toggle's aria-expanded; a leaf has no toggle (undefined).
      // A collapsible item starts expanded by default.
      test(`isExpanded reflects the toggle, undefined for a leaf`, async () => {
        assertEqual(await engine().parts.leaf.isExpanded(), undefined);
        assertTrue(await engine().parts.collapsible.isExpanded());
      });
    });
  },
};
