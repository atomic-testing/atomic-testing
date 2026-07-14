import { InputDriver } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { inputUIExample } from './Input.examples';

export const inputExampleScenePart = {
  one: { locator: byDataTestId('input-one'), driver: InputDriver },
  two: { locator: byDataTestId('input-two'), driver: InputDriver },
  disabled: { locator: byDataTestId('input-disabled'), driver: InputDriver },
  required: { locator: byDataTestId('input-required'), driver: InputDriver },
  invalid: { locator: byDataTestId('input-invalid'), driver: InputDriver },
} satisfies ScenePart;

export const inputExample: IExampleUnit<typeof inputExampleScenePart, JSX.Element> = {
  ...inputUIExample,
  scene: inputExampleScenePart,
};

export const inputExampleTestSuite: TestSuiteInfo<typeof inputExample.scene> = {
  title: 'Fluent Input',
  url: '/input',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertFalse, assertTrue }) => {
    describe(`${inputExample.title}`, () => {
      const engine = useTestEngine(inputExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('reads and writes its own value per instance', async () => {
        assertEqual(await engine().parts.one.getValue(), 'one');
        assertEqual(await engine().parts.two.getValue(), 'two');

        await engine().parts.one.setValue('changed');
        assertEqual(await engine().parts.one.getValue(), 'changed');
        assertEqual(await engine().parts.two.getValue(), 'two');
      });

      test('reads disabled/required/error state', async () => {
        assertFalse(await engine().parts.one.isDisabled());
        assertTrue(await engine().parts.disabled.isDisabled());
        assertTrue(await engine().parts.required.isRequired());
        assertTrue(await engine().parts.invalid.isError());
      });
    });
  },
};
