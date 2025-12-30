import { JSX } from 'react';

import { TextFieldDriver } from '@atomic-testing/component-driver-mui-v7';
import { byDataTestId, IExampleUnit, ScenePart} from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

import { multilineTextFieldUIExample } from './MultilineTextField.examples';

export const multilineTextFieldExampleScenePart = {
  multiline: {
    locator: byDataTestId('multiline'),
    driver: TextFieldDriver,
  },
} satisfies ScenePart;

/**
 * Multiline TextField example from MUI's website
 * @see https://mui.com/material-ui/react-text-field/#multiline
 */
export const multilineTextFieldExample: IExampleUnit<typeof multilineTextFieldExampleScenePart, JSX.Element> = {
  ...multilineTextFieldUIExample,
  scene: multilineTextFieldExampleScenePart,
};

export const multilineTextFieldTestSuite: TestSuiteInfo<typeof multilineTextFieldExampleScenePart> = {
  title: 'Multiline TextField',
  url: '/textfield',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual }) => {
    const engine = useTestEngine(multilineTextFieldExample.scene, getTestEngine, { beforeEach, afterEach });

    test('it should have the correct label', async () => {
      const label = await engine().parts.multiline.getLabel();
      assertEqual(label, 'Multiline');
    });

    test('it should have no helper text', async () => {
      const helperText = await engine().parts.multiline.getHelperText();
      assertEqual(helperText, undefined);
    });

    test('it should have default value', async () => {
      const value = await engine().parts.multiline.getValue();
      assertEqual(value, 'Default Value');
    });

    test('it should be able to change value', async () => {
      await engine().parts.multiline.setValue('Hello World');
      const value = await engine().parts.multiline.getValue();
      assertEqual(value, 'Hello World');
    });
  },
};
