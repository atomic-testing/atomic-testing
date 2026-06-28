import { RatingDriver } from '@atomic-testing/component-driver-mui-v6';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
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
  readonlyCustomLabel: {
    locator: byDataTestId('readonly-custom-label'),
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
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
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

    test('Can set a fractional rating value', async () => {
      await engine().parts.basic.setValue(3.5);
      const value = await engine().parts.basic.getValue();
      assertEqual(value, 3.5);
    });

    test('Can clear the rating to null', async () => {
      await engine().parts.basic.setValue(null);
      const value = await engine().parts.basic.getValue();
      assertEqual(value, null);
    });

    test('Readonly rating should exist', async () => {
      const exists = await engine().parts.readonly.exists();
      assertTrue(exists);
    });

    test('Readonly rating value is read from the accessible aria-label', async () => {
      const value = await engine().parts.readonly.getValue();
      assertEqual(value, 2.5);
    });

    test('Readonly rating with a custom label falls back to counting filled stars', async () => {
      const value = await engine().parts.readonlyCustomLabel.getValue();
      assertEqual(value, 3);
    });

    test('Disabled rating should exist', async () => {
      const exists = await engine().parts.disabled.exists();
      assertTrue(exists);
    });

    test('isDisabled reflects the disabled state', async () => {
      assertTrue(await engine().parts.disabled.isDisabled());
      assertFalse(await engine().parts.basic.isDisabled());
    });

    test('Initially empty rating should start empty', async () => {
      const value = await engine().parts.initiallyEmpty.getValue();
      assertEqual(value, null);
    });
  },
};
