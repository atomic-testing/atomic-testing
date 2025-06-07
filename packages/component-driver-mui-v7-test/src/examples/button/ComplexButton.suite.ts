import { ButtonDriver } from '@atomic-testing/component-driver-mui-v7';
import { TestEngine, byDataTestId, ScenePart, IExampleUnit } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';

import { complexButtonUIExample } from './ComplexButton.example';

export const complexButtonExampleScenePart = {
  contained: {
    locator: byDataTestId('contained'),
    driver: ButtonDriver,
  },
  outlined: {
    locator: byDataTestId('outlined'),
    driver: ButtonDriver,
  },
  text: {
    locator: byDataTestId('text'),
    driver: ButtonDriver,
  },
} satisfies ScenePart;

export const complexButtonExample: IExampleUnit<typeof complexButtonExampleScenePart, JSX.Element> = {
  ...complexButtonUIExample,
  scene: complexButtonExampleScenePart,
};

export const complexButtonTestSuite: TestSuiteInfo<typeof complexButtonExample.scene> = {
  title: 'Complex Button',
  url: '/button',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${complexButtonExample.title}`, () => {
      let testEngine: TestEngine<typeof complexButtonExample.scene>;

      // Use the following beforeEach to work around the issue of Playwright's page being undefined
      // @ts-ignore
      beforeEach(function ({ page }) {
        // @ts-ignore
        testEngine = getTestEngine(complexButtonExample.scene, { page });
        if (typeof arguments[0] === 'function') {
          arguments[0]();
        }
      });

      afterEach(async () => {
        await testEngine.cleanUp();
      });

      test('Contained button should exist and be clickable', async () => {
        const exists = await testEngine.parts.contained.exists();
        assertEqual(exists, true);
        await testEngine.parts.contained.click();
      });

      test('Outlined button should exist and be clickable', async () => {
        const exists = await testEngine.parts.outlined.exists();
        assertEqual(exists, true);
        await testEngine.parts.outlined.click();
      });

      test('Text button should exist and be clickable', async () => {
        const exists = await testEngine.parts.text.exists();
        assertEqual(exists, true);
        await testEngine.parts.text.click();
      });
    });
  },
};
