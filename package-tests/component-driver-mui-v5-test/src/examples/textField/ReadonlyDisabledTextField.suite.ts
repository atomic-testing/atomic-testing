import { JSX } from 'react';

import { TextFieldDriver } from '@atomic-testing/component-driver-mui-v5';
import { byDataTestId, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/internal-test-runner';

import { readonlyAndDisabledTextFieldUIExample } from './ReadonlyDisabledTextField.examples';

export const readonlyAndDisabledTextFieldExampleScenePart = {
  textDisabled: {
    locator: byDataTestId('text-disabled'),
    driver: TextFieldDriver,
  },
  textReadonly: {
    locator: byDataTestId('text-readonly'),
    driver: TextFieldDriver,
  },
  multilineDisabled: {
    locator: byDataTestId('multiline-disabled'),
    driver: TextFieldDriver,
  },
  multilineReadonly: {
    locator: byDataTestId('multiline-readonly'),
    driver: TextFieldDriver,
  },
  selectDisabled: {
    locator: byDataTestId('select-disabled'),
    driver: TextFieldDriver,
  },
  selectReadonly: {
    locator: byDataTestId('select-readonly'),
    driver: TextFieldDriver,
  },
  nativeSelectDisabled: {
    locator: byDataTestId('native-select-disabled'),
    driver: TextFieldDriver,
  },
  nativeSelectReadonly: {
    locator: byDataTestId('native-select-readonly'),
    driver: TextFieldDriver,
  },
} satisfies ScenePart;

export const readonlyAndDisabledTextFieldExample: IExampleUnit<
  typeof readonlyAndDisabledTextFieldExampleScenePart,
  JSX.Element
> = {
  ...readonlyAndDisabledTextFieldUIExample,
  scene: readonlyAndDisabledTextFieldExampleScenePart,
};

export const readonlyAndDisabledTextFieldTestSuite: TestSuiteInfo<typeof readonlyAndDisabledTextFieldExample.scene> = {
  title: 'Readonly & Disabled TextField',
  url: '/textfield',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual }) => {
    let testEngine: TestEngine<typeof readonlyAndDisabledTextFieldExample.scene>;

    // Use the following beforeEach to work around the issue of Playwright's page being undefined
    // @ts-ignore
    beforeEach(function ({ page }) {
      // @ts-ignore
      testEngine = getTestEngine(readonlyAndDisabledTextFieldExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        arguments[0]();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });

    test('readonly text field should be readonly', async () => {
      const isReadOnly = await testEngine.parts.textReadonly.isReadonly();
      assertEqual(isReadOnly, true);
    });

    test('readonly text field should have correct value', async () => {
      const value = await testEngine.parts.textReadonly.getValue();
      assertEqual(value, 'Hello World');
    });

    test('disabled text field should be disabled', async () => {
      const isDisabled = await testEngine.parts.textDisabled.isDisabled();
      assertEqual(isDisabled, true);
    });

    test('disabled text field should have correct value', async () => {
      const value = await testEngine.parts.textDisabled.getValue();
      assertEqual(value, 'Hello World');
    });

    test('readonly multiline should be readonly', async () => {
      const isReadOnly = await testEngine.parts.multilineReadonly.isReadonly();
      assertEqual(isReadOnly, true);
    });

    test('disabled multiline should be disabled', async () => {
      const isDisabled = await testEngine.parts.multilineDisabled.isDisabled();
      assertEqual(isDisabled, true);
    });

    test('readonly select should be readonly', async () => {
      const isReadOnly = await testEngine.parts.selectReadonly.isReadonly();
      assertEqual(isReadOnly, true);
    });

    test('disabled select should be disabled', async () => {
      const isDisabled = await testEngine.parts.selectDisabled.isDisabled();
      assertEqual(isDisabled, true);
    });
  },
};
