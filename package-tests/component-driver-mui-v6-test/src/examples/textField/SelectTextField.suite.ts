import { JSX } from 'react';

import { TextFieldDriver } from '@atomic-testing/component-driver-mui-v6';
import { byDataTestId, IExampleUnit, ScenePart} from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

import { selectTextFieldUIExample } from './SelectTextField.examples';

export const selectTextFieldExampleScenePart = {
  select: {
    locator: byDataTestId('select'),
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
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual }) => {
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
  },
};
