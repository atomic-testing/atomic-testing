import { JSX } from 'react';

import { TextFieldDriver } from '@atomic-testing/component-driver-mui-v6';
import { byDataTestId, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestFixture, TestSuiteInfo } from '@atomic-testing/internal-test-runner';

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
    let testEngine: TestEngine<typeof multilineTextFieldExample.scene>;
    beforeEach(function ({ page }: TestFixture) {
      testEngine = getTestEngine(multilineTextFieldExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        (arguments[0] as () => void)();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });

    test('it should have the correct label', async () => {
      const label = await testEngine.parts.multiline.getLabel();
      assertEqual(label, 'Multiline');
    });

    test('it should have no helper text', async () => {
      const helperText = await testEngine.parts.multiline.getHelperText();
      assertEqual(helperText, undefined);
    });

    test('it should have default value', async () => {
      const value = await testEngine.parts.multiline.getValue();
      assertEqual(value, 'Default Value');
    });

    test('it should be able to change value', async () => {
      await testEngine.parts.multiline.setValue('Hello World');
      const value = await testEngine.parts.multiline.getValue();
      assertEqual(value, 'Hello World');
    });
  },
};
