import { JSX } from 'react';

import { TextFieldDriver } from '@atomic-testing/component-driver-mui-v5';
import { byDataTestId, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestFixture, TestSuiteInfo } from '@atomic-testing/internal-test-runner';

import { basicTextFieldUIExample } from './BasicTextField.examples';

export const basicTextFieldExampleScenePart = {
  basic: {
    locator: byDataTestId('basic'),
    driver: TextFieldDriver,
  },
} satisfies ScenePart;

/**
 * Basic TextField example from MUI's website
 * @see https://mui.com/material-ui/react-text-field/#basic-textfield
 */
export const basicTextFieldExample: IExampleUnit<typeof basicTextFieldExampleScenePart, JSX.Element> = {
  ...basicTextFieldUIExample,
  scene: basicTextFieldExampleScenePart,
};

export const basicTextFieldTestSuite: TestSuiteInfo<typeof basicTextFieldExampleScenePart> = {
  title: 'Basic TextField',
  url: '/textfield',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual, assertTrue }) => {
    let testEngine: TestEngine<typeof basicTextFieldExample.scene>;

    beforeEach(function ({ page }: TestFixture) {
      testEngine = getTestEngine(basicTextFieldExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        (arguments[0] as () => void)();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });

    test('it should have a basic text field', async () => {
      assertTrue(await testEngine.parts.basic.exists());
    });

    test('it should have the correct label', async () => {
      const label = await testEngine.parts.basic.getLabel();
      assertEqual(label, 'Basic Field');
    });

    test('it should have the correct helper text', async () => {
      const helperText = await testEngine.parts.basic.getHelperText();
      assertEqual(helperText, 'Enter text here');
    });

    test('it should be able to set and get value', async () => {
      await testEngine.parts.basic.setValue('Hello World');
      const value = await testEngine.parts.basic.getValue();
      assertEqual(value, 'Hello World');
    });
  },
};
