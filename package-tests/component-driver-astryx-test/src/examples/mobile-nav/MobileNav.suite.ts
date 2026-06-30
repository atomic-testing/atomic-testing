import { MobileNavDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { mobileNavUIExample } from './MobileNav.examples';

export const mobileNavExampleScenePart = {
  mobileNav: {
    locator: byDataTestId('mobile-nav'),
    driver: MobileNavDriver,
  },
} satisfies ScenePart;

export const mobileNavExample: IExampleUnit<typeof mobileNavExampleScenePart, JSX.Element> = {
  ...mobileNavUIExample,
  scene: mobileNavExampleScenePart,
};

export const mobileNavExampleTestSuite: TestSuiteInfo<typeof mobileNavExample.scene> = {
  title: 'Astryx MobileNav',
  url: '/mobile-nav',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${mobileNavExample.title}`, () => {
      const engine = useTestEngine(mobileNavExample.scene, getTestEngine, { beforeEach, afterEach });

      test(`getLabel and getSide read the drawer chrome`, async () => {
        assertEqual(await engine().parts.mobileNav.getLabel(), 'Mobile navigation');
        assertEqual(await engine().parts.mobileNav.getSide(), 'start');
      });

      test(`hasCloseButton detects the close affordance`, async () => {
        assertTrue(await engine().parts.mobileNav.hasCloseButton());
      });

      // Closed-state read only: showModal() is a no-op in jsdom, so isOpen() is false
      // regardless of the isOpen prop (its true case is E2E-only — never asserted here).
      test(`isOpen reports the closed state`, async () => {
        assertFalse(await engine().parts.mobileNav.isOpen());
      });
    });
  },
};
