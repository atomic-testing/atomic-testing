import { JSX } from 'react';

import { TextFieldDriver } from '@atomic-testing/component-driver-mui-v7';
import { byDataTestId, IExampleUnit, ScenePart} from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

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
    const engine = useTestEngine(dateTextFieldExample.scene, getTestEngine, { beforeEach, afterEach });

    test('it should have the correct label', async () => {
      const label = await engine().parts.date.getLabel();
      assertEqual(label, 'Date Field');
    });

    test('it should have the correct helper text', async () => {
      const helperText = await engine().parts.date.getHelperText();
      assertEqual(helperText, 'Enter a date here');
    });

    test('it should have empty value initially', async () => {
      const value = await engine().parts.date.getValue();
      assertEqual(value, '');
    });

    test('it should be able to set and get date value', async () => {
      await engine().parts.date.setValue('2015-12-22');
      const value = await engine().parts.date.getValue();
      assertEqual(value, '2015-12-22');
    });
  },
};
