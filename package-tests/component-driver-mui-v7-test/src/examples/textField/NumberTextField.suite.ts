import { JSX } from 'react';

import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { TextFieldDriver } from '@atomic-testing/component-driver-mui-v7';
import { byDataTestId, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestFixture, TestSuiteInfo } from '@atomic-testing/internal-test-runner';

import { numberTextFieldUIExample } from './NumberTextField.examples';

export const numberTextFieldExampleScenePart = {
  number: {
    locator: byDataTestId('number'),
    driver: TextFieldDriver,
  },
  display: {
    locator: byDataTestId('display'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

/**
 * Number TextField example from MUI's website
 * @see https://mui.com/material-ui/react-text-field/
 */
export const numberTextFieldExample: IExampleUnit<typeof numberTextFieldExampleScenePart, JSX.Element> = {
  ...numberTextFieldUIExample,
  scene: numberTextFieldExampleScenePart,
};

export const numberTextFieldTestSuite: TestSuiteInfo<typeof numberTextFieldExampleScenePart> = {
  title: 'Number TextField',
  url: '/textfield',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual, assertTrue }) => {
    let testEngine: TestEngine<typeof numberTextFieldExample.scene>;
    beforeEach(function ({ page }: TestFixture) {
      testEngine = getTestEngine(numberTextFieldExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        (arguments[0] as () => void)();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });

    test('it should have a number text field', async () => {
      assertTrue(await testEngine.parts.number.exists());
    });

    test('it should have the correct label', async () => {
      const label = await testEngine.parts.number.getLabel();
      assertEqual(label, 'Number');
    });

    test('it should have the correct helper text', async () => {
      const helperText = await testEngine.parts.number.getHelperText();
      assertEqual(helperText, 'Enter number here');
    });

    test('it should be able to set and get value', async () => {
      await testEngine.parts.number.setValue('3');
      const value = await testEngine.parts.number.getValue();
      assertEqual(value, '3');

      const displayText = await testEngine.parts.display.getText();
      assertEqual(displayText, '3');
    });
  },
};
