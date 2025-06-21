import { JSX } from 'react';

import { TextFieldDriver } from '@atomic-testing/component-driver-mui-v6';
import { byDataTestId, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';

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
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual }) => {
    let testEngine: TestEngine<typeof basicTextFieldExample.scene>;

    // Use the following beforeEach to work around the issue of Playwright's page being undefined
    // @ts-ignore
    beforeEach(function ({ page }) {
      // @ts-ignore
      testEngine = getTestEngine(basicTextFieldExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        arguments[0]();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });

    test('it should have a basic text field', async () => {
      assertEqual(await testEngine.parts.basic.exists(), true);
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
