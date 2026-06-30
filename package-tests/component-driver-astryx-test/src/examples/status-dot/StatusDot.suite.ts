import { StatusDotDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { statusDotUIExample } from './StatusDot.examples';

export const statusDotExampleScenePart = {
  online: {
    locator: byDataTestId('status-dot-1'),
    driver: StatusDotDriver,
  },
  offline: {
    locator: byDataTestId('status-dot-2'),
    driver: StatusDotDriver,
  },
} satisfies ScenePart;

export const statusDotExample: IExampleUnit<typeof statusDotExampleScenePart, JSX.Element> = {
  ...statusDotUIExample,
  scene: statusDotExampleScenePart,
};

export const statusDotExampleTestSuite: TestSuiteInfo<typeof statusDotExample.scene> = {
  title: 'Astryx StatusDot',
  url: '/status-dot',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue }) => {
    describe(`${statusDotExample.title}`, () => {
      const engine = useTestEngine(statusDotExample.scene, getTestEngine, { beforeEach, afterEach });

      // getLabel reads the aria-label; getVariant the data-variant.
      test(`getLabel and getVariant read the dot`, async () => {
        assertEqual(await engine().parts.online.getLabel(), 'Online');
        assertEqual(await engine().parts.online.getVariant(), 'success');
      });

      // Two instances disambiguate by testid.
      test(`reads each dot independently`, async () => {
        assertEqual(await engine().parts.offline.getLabel(), 'Offline');
        assertEqual(await engine().parts.offline.getVariant(), 'error');
      });

      // isPresent is true for a rendered dot.
      test(`isPresent reports a rendered dot`, async () => {
        assertTrue(await engine().parts.online.isPresent());
      });
    });
  },
};
