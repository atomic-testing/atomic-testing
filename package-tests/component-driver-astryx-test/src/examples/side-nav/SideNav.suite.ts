import { SideNavDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { sideNavUIExample } from './SideNav.examples';

export const sideNavExampleScenePart = {
  sideNav: {
    locator: byDataTestId('side-nav'),
    driver: SideNavDriver,
  },
} satisfies ScenePart;

export const sideNavExample: IExampleUnit<typeof sideNavExampleScenePart, JSX.Element> = {
  ...sideNavUIExample,
  scene: sideNavExampleScenePart,
};

export const sideNavExampleTestSuite: TestSuiteInfo<typeof sideNavExample.scene> = {
  title: 'Astryx SideNav',
  url: '/side-nav',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue }) => {
    describe(`${sideNavExample.title}`, () => {
      const engine = useTestEngine(sideNavExample.scene, getTestEngine, { beforeEach, afterEach });

      // getLabel reads the hardcoded aria-label (there is no label prop).
      test(`getLabel reads the hardcoded landmark name`, async () => {
        assertEqual(await engine().parts.sideNav.getLabel(), 'Side navigation');
      });

      test(`getSectionCount counts the SideNavSection groups`, async () => {
        assertEqual(await engine().parts.sideNav.getSectionCount(), 2);
      });

      // The example is collapsible, so a collapse toggle is rendered.
      test(`hasCollapseButton detects the collapse toggle`, async () => {
        assertTrue(await engine().parts.sideNav.hasCollapseButton());
      });
    });
  },
};
