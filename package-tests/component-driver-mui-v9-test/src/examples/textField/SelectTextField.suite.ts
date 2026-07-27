import { TextFieldDriver } from '@atomic-testing/component-driver-mui-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { selectTextFieldUIExample } from './SelectTextField.examples';

export const selectTextFieldExampleScenePart = {
  select: {
    locator: byDataTestId('select'),
    driver: TextFieldDriver,
  },
  requiredErrorSelect: {
    locator: byDataTestId('required-error-select'),
    driver: TextFieldDriver,
  },
} satisfies ScenePart;

export const selectTextFieldExample: IExampleUnit<typeof selectTextFieldExampleScenePart, JSX.Element> = {
  ...selectTextFieldUIExample,
  scene: selectTextFieldExampleScenePart,
};

export const selectTextFieldTestSuite: TestSuiteInfo<typeof selectTextFieldExampleScenePart> = {
  title: 'Select TextField',
  url: '/textfield',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    const engine = useTestEngine(selectTextFieldExample.scene, getTestEngine, { beforeEach, afterEach });

    test('it should have the correct label', async () => {
      const label = await engine().parts.select.getLabel();
      assertEqual(label, 'Number');
    });

    test('it should have default value of 30', async () => {
      const value = await engine().parts.select.getValue();
      assertEqual(value, '30');
    });

    test('it should be able to change value', async () => {
      await engine().parts.select.setValue('60');
      const value = await engine().parts.select.getValue();
      assertEqual(value, '60');
    });

    test('a required, error select-variant field reports both', async () => {
      assertTrue(await engine().parts.requiredErrorSelect.isRequired());
      assertTrue(await engine().parts.requiredErrorSelect.isError());
    });

    test('a plain select-variant field reports not required and no error', async () => {
      assertFalse(await engine().parts.select.isRequired());
      assertFalse(await engine().parts.select.isError());
    });
  },
};
