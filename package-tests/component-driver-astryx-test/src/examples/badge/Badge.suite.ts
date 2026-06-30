import { BadgeDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { badgeUIExample } from './Badge.examples';

export const badgeExampleScenePart = {
  success: {
    locator: byDataTestId('badge-success'),
    driver: BadgeDriver,
  },
  purple: {
    locator: byDataTestId('badge-purple'),
    driver: BadgeDriver,
  },
} satisfies ScenePart;

export const badgeExample: IExampleUnit<typeof badgeExampleScenePart, JSX.Element> = {
  ...badgeUIExample,
  scene: badgeExampleScenePart,
};

export const badgeExampleTestSuite: TestSuiteInfo<typeof badgeExample.scene> = {
  title: 'Astryx Badge',
  url: '/badge',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${badgeExample.title}`, () => {
      const engine = useTestEngine(badgeExample.scene, getTestEngine, { beforeEach, afterEach });

      // getText reads the label; getVariant the stable data-variant.
      test(`reads label and variant`, async () => {
        assertEqual(await engine().parts.success.getText(), 'Active');
        assertEqual(await engine().parts.success.getVariant(), 'success');
      });

      // Two instances are disambiguated by their distinct testids/variants.
      test(`disambiguates two instances`, async () => {
        assertEqual(await engine().parts.purple.getText(), 'Engineering');
        assertEqual(await engine().parts.purple.getVariant(), 'purple');
      });
    });
  },
};
