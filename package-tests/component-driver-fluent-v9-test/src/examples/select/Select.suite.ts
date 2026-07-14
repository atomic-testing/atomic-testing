import { SelectDriver } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { selectUIExample } from './Select.examples';

export const selectExampleScenePart = {
  one: { locator: byDataTestId('select-one'), driver: SelectDriver },
  two: { locator: byDataTestId('select-two'), driver: SelectDriver },
  disabled: { locator: byDataTestId('select-disabled'), driver: SelectDriver },
} satisfies ScenePart;

export const selectExample: IExampleUnit<typeof selectExampleScenePart, JSX.Element> = {
  ...selectUIExample,
  scene: selectExampleScenePart,
};

export const selectExampleTestSuite: TestSuiteInfo<typeof selectExample.scene> = {
  title: 'Fluent Select',
  url: '/select',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertFalse, assertTrue }) => {
    describe(`${selectExample.title}`, () => {
      const engine = useTestEngine(selectExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('reads and writes its own value per instance', async () => {
        assertEqual(await engine().parts.one.getValue(), 'a');
        assertEqual(await engine().parts.two.getValue(), 'x');

        await engine().parts.one.setValue('b');
        assertEqual(await engine().parts.one.getValue(), 'b');
        assertEqual(await engine().parts.two.getValue(), 'x');
      });

      test('reads disabled state per instance', async () => {
        assertFalse(await engine().parts.one.isDisabled());
        assertTrue(await engine().parts.disabled.isDisabled());
      });
    });
  },
};
