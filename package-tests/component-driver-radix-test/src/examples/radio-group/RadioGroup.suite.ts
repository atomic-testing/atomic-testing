import { RadioGroupDriver } from '@atomic-testing/component-driver-radix-v1';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { radioGroupUIExample } from './RadioGroup.examples';

export const radioGroupExampleScenePart = {
  groupOne: {
    locator: byDataTestId('radio-group-one'),
    driver: RadioGroupDriver,
  },
  groupTwo: {
    locator: byDataTestId('radio-group-two'),
    driver: RadioGroupDriver,
  },
} satisfies ScenePart;

export const radioGroupExample: IExampleUnit<typeof radioGroupExampleScenePart, JSX.Element> = {
  ...radioGroupUIExample,
  scene: radioGroupExampleScenePart,
};

export const radioGroupExampleTestSuite: TestSuiteInfo<typeof radioGroupExample.scene> = {
  title: 'Radix RadioGroup',
  url: '/radio-group',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${radioGroupExample.title}`, () => {
      const engine = useTestEngine(radioGroupExample.scene, getTestEngine, { beforeEach, afterEach });

      test('reads the default selection independently per group', async () => {
        assertEqual(await engine().parts.groupOne.getValue(), 'a');
        assertEqual(await engine().parts.groupTwo.getValue(), null);
      });

      test('selects an item by value without disturbing the other group', async () => {
        const selected = await engine().parts.groupOne.setValue('b');
        assertTrue(selected);
        assertEqual(await engine().parts.groupOne.getValue(), 'b');
        assertEqual(await engine().parts.groupTwo.getValue(), null);

        await engine().parts.groupTwo.setValue('y');
        assertEqual(await engine().parts.groupTwo.getValue(), 'y');
        assertEqual(await engine().parts.groupOne.getValue(), 'b');
      });

      test('refuses to select a disabled item', async () => {
        const selected = await engine().parts.groupOne.setValue('c');
        assertFalse(selected);
        assertEqual(await engine().parts.groupOne.getValue(), 'a');
      });

      test('refuses to select a missing value', async () => {
        const selected = await engine().parts.groupOne.setValue('does-not-exist');
        assertFalse(selected);
      });

      test('reads item count and per-item disabled state', async () => {
        assertEqual(await engine().parts.groupOne.getItemCount(), 3);
        const disabledItem = await engine().parts.groupOne.getItemByValue('c');
        assertTrue(disabledItem != null && (await disabledItem.isDisabled()));
      });
    });
  },
};
