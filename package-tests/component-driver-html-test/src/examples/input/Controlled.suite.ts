import { JSX } from 'react';

import { HTMLTextInputDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestFixture, TestSuiteInfo } from '@atomic-testing/internal-test-runner';

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
      let testEngine: TestEngine<typeof controlledTextInputExample.scene>;

      beforeEach(function ({ page }: TestFixture) {
        testEngine = getTestEngine(controlledTextInputExample.scene, { page });
        if (typeof arguments[0] === 'function') {
          (arguments[0] as () => void)();
        }
      });

      afterEach(async () => {
        await testEngine.cleanUp();
      });

      test(`set text value`, async () => {
        const targetValue = 'abc';
        await testEngine.parts.input.setValue(targetValue);
        const val = await testEngine.parts.input.getValue();
        assertEqual(val, targetValue);
      });
    });
  },
};
