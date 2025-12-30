import { JSX } from 'react';
import { BadgeDriver } from '@atomic-testing/component-driver-mui-v5';
import { byDataTestId, ScenePart, IExampleUnit } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

import { basicBadgeUIExample } from './BasicBadge.examples';

export const basicBadgeExampleScenePart = {
  basicBadge: {
    locator: byDataTestId('basic-badge'),
    driver: BadgeDriver,
  },
} satisfies ScenePart;

export const basicBadgeExample: IExampleUnit<typeof basicBadgeExampleScenePart, JSX.Element> = {
  ...basicBadgeUIExample,
  scene: basicBadgeExampleScenePart,
};

export const basicBadgeTestSuite: TestSuiteInfo<typeof basicBadgeExample.scene> = {
  title: 'Basic Badge',
  url: '/badge',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual, assertTrue }) => {
    const engine = useTestEngine(basicBadgeExample.scene, getTestEngine, { beforeEach, afterEach });

    test('Badge should display correct content', async () => {
      const content = await engine().parts.basicBadge.getContent();
      assertEqual(content, '12');
    });

    test('Badge should exist', async () => {
      const exists = await engine().parts.basicBadge.exists();
      assertTrue(exists);
    });
  },
};
