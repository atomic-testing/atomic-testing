import { JSX } from 'react';

import { TextFieldDriver } from '@atomic-testing/component-driver-mui-v7';
import { byDataTestId, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';

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
    let testEngine: TestEngine<typeof selectTextFieldExample.scene>;

    // Use the following beforeEach to work around the issue of Playwright's page being undefined
    // @ts-ignore
    beforeEach(function ({ page }) {
      // @ts-ignore
      testEngine = getTestEngine(selectTextFieldExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        arguments[0]();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });

    test('it should have the correct label', async () => {
      const label = await testEngine.parts.select.getLabel();
      assertEqual(label, 'Number');
    });

    test('it should have default value of 30', async () => {
      const value = await testEngine.parts.select.getValue();
      assertEqual(value, '30');
    });

    test('it should be able to change value', async () => {
      await testEngine.parts.select.setValue('60');
      const value = await testEngine.parts.select.getValue();
      assertEqual(value, '60');
    });
  },
};
