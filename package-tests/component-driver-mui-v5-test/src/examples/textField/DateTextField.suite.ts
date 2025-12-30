import { JSX } from 'react';

import { TextFieldDriver } from '@atomic-testing/component-driver-mui-v5';
import { byDataTestId, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestFixture, TestSuiteInfo } from '@atomic-testing/internal-test-runner';

import { dateTextFieldUIExample } from './DateTextField.examples';

export const dateTextFieldExampleScenePart = {
  date: {
    locator: byDataTestId('date'),
    driver: TextFieldDriver,
  },
} satisfies ScenePart;

/**
 * Date TextField example from MUI's website
 * @see https://mui.com/material-ui/react-text-field/#date-textfield
 */
export const dateTextFieldExample: IExampleUnit<typeof dateTextFieldExampleScenePart, JSX.Element> = {
  ...dateTextFieldUIExample,
  scene: dateTextFieldExampleScenePart,
};

export const dateTextFieldTestSuite: TestSuiteInfo<typeof dateTextFieldExampleScenePart> = {
  title: 'Date TextField',
  url: '/textfield',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual }) => {
    let testEngine: TestEngine<typeof dateTextFieldExample.scene>;

    beforeEach(function ({ page }: TestFixture) {
      testEngine = getTestEngine(dateTextFieldExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        (arguments[0] as () => void)();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });

    test('it should have the correct label', async () => {
      const label = await testEngine.parts.date.getLabel();
      assertEqual(label, 'Date Field');
    });

    test('it should have the correct helper text', async () => {
      const helperText = await testEngine.parts.date.getHelperText();
      assertEqual(helperText, 'Enter a date here');
    });

    test('it should have empty value initially', async () => {
      const value = await testEngine.parts.date.getValue();
      assertEqual(value, '');
    });

    test('it should be able to set and get date value', async () => {
      await testEngine.parts.date.setValue('2015-12-22');
      const value = await testEngine.parts.date.getValue();
      assertEqual(value, '2015-12-22');
    });
  },
};
