import { NavIconDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { navIconUIExample } from './NavIcon.examples';

export const navIconExampleScenePart = {
  basic: {
    locator: byDataTestId('navicon-basic'),
    driver: NavIconDriver,
  },
} satisfies ScenePart;

export const navIconExample: IExampleUnit<typeof navIconExampleScenePart, JSX.Element> = {
  ...navIconUIExample,
  scene: navIconExampleScenePart,
};

export const navIconExampleTestSuite: TestSuiteInfo<typeof navIconExample.scene> = {
  title: 'Astryx NavIcon',
  url: '/nav-icon',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertTrue }) => {
    describe(`${navIconExample.title}`, () => {
      const engine = useTestEngine(navIconExample.scene, getTestEngine, { beforeEach, afterEach });

      // NavIcon is display-only: it exists and renders the supplied icon markup.
      test(`renders the icon and is present`, async () => {
        assertTrue(await engine().parts.basic.exists());
        assertTrue((await engine().parts.basic.innerHTML()).includes('★'));
      });
    });
  },
};
