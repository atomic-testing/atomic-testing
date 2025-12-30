import { JSX } from 'react';

import { HTMLTextInputDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

import { controlledTextInputUIExample } from './Controlled.examples';

export const controlledTextInputExampleScenePart = {
  input: {
    locator: byDataTestId('controlled-text-input'),
    driver: HTMLTextInputDriver,
  },
} satisfies ScenePart;

export const controlledTextInputExample: IExampleUnit<typeof controlledTextInputExampleScenePart, JSX.Element> = {
  ...controlledTextInputUIExample,
  scene: controlledTextInputExampleScenePart,
};

export const controlledTextInputExampleTestSuite: TestSuiteInfo<typeof controlledTextInputExample.scene> = {
  title: 'ControlledTextInput',
  url: '/input',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${controlledTextInputExample.title}`, () => {
      const engine = useTestEngine(controlledTextInputExample.scene, getTestEngine, { beforeEach, afterEach });

      test(`set text value`, async () => {
        const targetValue = 'abc';
        await engine().parts.input.setValue(targetValue);
        const val = await engine().parts.input.getValue();
        assertEqual(val, targetValue);
      });
    });
  },
};
