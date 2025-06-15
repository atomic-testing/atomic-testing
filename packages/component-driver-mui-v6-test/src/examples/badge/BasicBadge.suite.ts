import { BadgeDriver } from '@atomic-testing/component-driver-mui-v6';
import { TestEngine, byDataTestId, ScenePart, IExampleUnit } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';

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
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual }) => {
    let testEngine: TestEngine<typeof basicBadgeExample.scene>;

    // Use the following beforeEach to work around the issue of Playwright's page being undefined
    // @ts-ignore
    beforeEach(function ({ page }) {
      // @ts-ignore
      testEngine = getTestEngine(basicBadgeExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        arguments[0]();
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
      assertEqual(exists, true);
    });
  },
};
