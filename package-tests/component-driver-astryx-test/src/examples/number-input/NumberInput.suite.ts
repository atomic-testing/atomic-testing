import { NumberInputDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { numberInputUIExample } from './NumberInput.examples';

export const numberInputExampleScenePart = {
  qtyInput: {
    locator: byDataTestId('qty-input'),
    driver: NumberInputDriver,
  },
} satisfies ScenePart;

export const numberInputExample: IExampleUnit<typeof numberInputExampleScenePart, JSX.Element> = {
  ...numberInputUIExample,
  scene: numberInputExampleScenePart,
};

export const numberInputExampleTestSuite: TestSuiteInfo<typeof numberInputExample.scene> = {
  title: 'Astryx NumberInput',
  url: '/number-input',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${numberInputExample.title}`, () => {
      const engine = useTestEngine(numberInputExample.scene, getTestEngine, { beforeEach, afterEach });

      // getLabel resolves the linked <label for>.
      test(`getLabel returns the field label`, async () => {
        assertEqual(await engine().parts.qtyInput.getLabel(), 'Quantity');
      });

      // getValue reads the input's string value.
      test(`getValue reads the current value`, async () => {
        assertEqual(await engine().parts.qtyInput.getValue(), '5');
      });

      // min/max/step come straight off the native attributes.
      test(`getMin/getMax/getStep read the numeric constraints`, async () => {
        assertEqual(await engine().parts.qtyInput.getMin(), 0);
        assertEqual(await engine().parts.qtyInput.getMax(), 10);
        assertEqual(await engine().parts.qtyInput.getStep(), 2);
      });

      // getUnits resolves the trailing units span (sibling of the input).
      test(`getUnits returns the units label`, async () => {
        assertEqual(await engine().parts.qtyInput.getUnits(), 'kg');
      });

      // setValue round-trips through the controlled onChange.
      test(`setValue round-trips`, async () => {
        await engine().parts.qtyInput.setValue('8');
        assertEqual(await engine().parts.qtyInput.getValue(), '8');
      });
    });
  },
};
