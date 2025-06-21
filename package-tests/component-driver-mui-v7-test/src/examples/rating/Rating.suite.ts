import { RatingDriver } from '@atomic-testing/component-driver-mui-v7';
import { byDataTestId, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';

import { basicRatingUIExample } from './Rating.examples';

export const basicRatingExampleScenePart = {
  basic: {
    locator: byDataTestId('basic'),
    driver: RatingDriver,
  },
  readonly: {
    locator: byDataTestId('readonly'),
    driver: RatingDriver,
  },
  disabled: {
    locator: byDataTestId('disabled'),
    driver: RatingDriver,
  },
  initiallyEmpty: {
    locator: byDataTestId('empty'),
    driver: RatingDriver,
  },
} satisfies ScenePart;

export const basicRatingExample: IExampleUnit<typeof basicRatingExampleScenePart, JSX.Element> = {
  ...basicRatingUIExample,
  scene: basicRatingExampleScenePart,
};

export const basicRatingTestSuite: TestSuiteInfo<typeof basicRatingExample.scene> = {
  title: 'Basic Rating',
  url: '/rating',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual }) => {
    let testEngine: TestEngine<typeof basicRatingExample.scene>;

    // Use the following beforeEach to work around the issue of Playwright's page being undefined
    // @ts-ignore
    beforeEach(function ({ page }) {
      // @ts-ignore
      testEngine = getTestEngine(basicRatingExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        arguments[0]();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });

    test('Basic rating should exist', async () => {
      const exists = await testEngine.parts.basic.exists();
      assertEqual(exists, true);
    });

    test('Basic rating should have initial value', async () => {
      const value = await testEngine.parts.basic.getValue();
      assertEqual(value, 2);
    });

    test('Can change rating value', async () => {
      await testEngine.parts.basic.setValue(4);
      const value = await testEngine.parts.basic.getValue();
      assertEqual(value, 4);
    });

    test('Readonly rating should exist', async () => {
      const exists = await testEngine.parts.readonly.exists();
      assertEqual(exists, true);
    });

    test('Disabled rating should exist', async () => {
      const exists = await testEngine.parts.disabled.exists();
      assertEqual(exists, true);
    });

    test('Initially empty rating should start empty', async () => {
      const value = await testEngine.parts.initiallyEmpty.getValue();
      assertEqual(value || 0, 0);
    });
  },
};
