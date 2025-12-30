import { JSX } from 'react';
import { RatingDriver } from '@atomic-testing/component-driver-mui-v7';
import { byDataTestId, IExampleUnit, ScenePart} from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

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
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual, assertTrue }) => {
    const engine = useTestEngine(basicRatingExample.scene, getTestEngine, { beforeEach, afterEach });

    test('Basic rating should exist', async () => {
      const exists = await engine().parts.basic.exists();
      assertTrue(exists);
    });

    test('Basic rating should have initial value', async () => {
      const value = await engine().parts.basic.getValue();
      assertEqual(value, 2);
    });

    test('Can change rating value', async () => {
      await engine().parts.basic.setValue(4);
      const value = await engine().parts.basic.getValue();
      assertEqual(value, 4);
    });

    test('Readonly rating should exist', async () => {
      const exists = await engine().parts.readonly.exists();
      assertTrue(exists);
    });

    test('Disabled rating should exist', async () => {
      const exists = await engine().parts.disabled.exists();
      assertTrue(exists);
    });

    test('Initially empty rating should start empty', async () => {
      const value = await engine().parts.initiallyEmpty.getValue();
      assertEqual(value || 0, 0);
    });
  },
};
