import { BadgeDriver } from '@atomic-testing/component-driver-mui-v5';
import { TestEngine, byDataTestId, ScenePart, IExampleUnit } from '@atomic-testing/core';
import { TestFixture, TestSuiteInfo } from '@atomic-testing/internal-test-runner';

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
    let testEngine: TestEngine<typeof basicBadgeExample.scene>;

    beforeEach(function ({ page }: TestFixture) {
      testEngine = getTestEngine(basicBadgeExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        (arguments[0] as () => void)();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });

    test('Badge should display correct content', async () => {
      const content = await testEngine.parts.basicBadge.getContent();
      assertEqual(content, '12');
    });

    test('Badge should exist', async () => {
      const exists = await testEngine.parts.basicBadge.exists();
      assertTrue(exists);
    });
  },
};
