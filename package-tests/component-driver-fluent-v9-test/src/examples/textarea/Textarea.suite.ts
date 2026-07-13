import { TextareaDriver } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { textareaUIExample } from './Textarea.examples';

export const textareaExampleScenePart = {
  one: { locator: byDataTestId('textarea-one'), driver: TextareaDriver },
  two: { locator: byDataTestId('textarea-two'), driver: TextareaDriver },
  disabled: { locator: byDataTestId('textarea-disabled'), driver: TextareaDriver },
} satisfies ScenePart;

export const textareaExample: IExampleUnit<typeof textareaExampleScenePart, JSX.Element> = {
  ...textareaUIExample,
  scene: textareaExampleScenePart,
};

export const textareaExampleTestSuite: TestSuiteInfo<typeof textareaExample.scene> = {
  title: 'Fluent Textarea',
  url: '/textarea',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertFalse, assertTrue }) => {
    describe(`${textareaExample.title}`, () => {
      const engine = useTestEngine(textareaExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('reads and writes its own value per instance', async () => {
        assertEqual(await engine().parts.one.getValue(), 'one');
        assertEqual(await engine().parts.two.getValue(), 'two');

        await engine().parts.one.setValue('changed');
        assertEqual(await engine().parts.one.getValue(), 'changed');
        assertEqual(await engine().parts.two.getValue(), 'two');
      });

      test('reads disabled state per instance', async () => {
        assertFalse(await engine().parts.one.isDisabled());
        assertTrue(await engine().parts.disabled.isDisabled());
      });
    });
  },
};
