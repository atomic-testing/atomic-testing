import { TextFieldDriver } from '@atomic-testing/component-driver-mui-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { basicTextFieldUIExample } from './BasicTextField.examples';

export const basicTextFieldExampleScenePart = {
  basic: {
    locator: byDataTestId('basic'),
    driver: TextFieldDriver,
  },
  requiredError: {
    locator: byDataTestId('required-error'),
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
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    const engine = useTestEngine(basicTextFieldExample.scene, getTestEngine, { beforeEach, afterEach });

    test('it should have a basic text field', async () => {
      assertTrue(await engine().parts.basic.exists());
    });

    test('it should have the correct label', async () => {
      const label = await engine().parts.basic.getLabel();
      assertEqual(label, 'Basic Field');
    });

    test('it should have the correct helper text', async () => {
      const helperText = await engine().parts.basic.getHelperText();
      assertEqual(helperText, 'Enter text here');
    });

    test('it should be able to set and get value', async () => {
      await engine().parts.basic.setValue('Hello World');
      const value = await engine().parts.basic.getValue();
      assertEqual(value, 'Hello World');
    });

    test('a required, error field reports both', async () => {
      assertTrue(await engine().parts.requiredError.isRequired());
      assertTrue(await engine().parts.requiredError.isError());
    });

    test('a plain field reports not required and no error', async () => {
      assertFalse(await engine().parts.basic.isRequired());
      assertFalse(await engine().parts.basic.isError());
    });
  },
};
