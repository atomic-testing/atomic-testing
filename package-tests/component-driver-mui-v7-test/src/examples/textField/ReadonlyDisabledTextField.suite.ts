import { JSX } from 'react';

import { TextFieldDriver } from '@atomic-testing/component-driver-mui-v7';
import { byDataTestId, IExampleUnit, ScenePart} from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

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
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual, assertTrue }) => {
    const engine = useTestEngine(readonlyAndDisabledTextFieldExample.scene, getTestEngine, { beforeEach, afterEach });

    test('readonly text field should be readonly', async () => {
      const isReadOnly = await engine().parts.textReadonly.isReadonly();
      assertTrue(isReadOnly);
    });

    test('readonly text field should have correct value', async () => {
      const value = await engine().parts.textReadonly.getValue();
      assertEqual(value, 'Hello World');
    });

    test('disabled text field should be disabled', async () => {
      const isDisabled = await engine().parts.textDisabled.isDisabled();
      assertTrue(isDisabled);
    });

    test('disabled text field should have correct value', async () => {
      const value = await engine().parts.textDisabled.getValue();
      assertEqual(value, 'Hello World');
    });

    test('readonly multiline should be readonly', async () => {
      const isReadOnly = await engine().parts.multilineReadonly.isReadonly();
      assertTrue(isReadOnly);
    });

    test('disabled multiline should be disabled', async () => {
      const isDisabled = await engine().parts.multilineDisabled.isDisabled();
      assertTrue(isDisabled);
    });

    test('readonly select should be readonly', async () => {
      const isReadOnly = await engine().parts.selectReadonly.isReadonly();
      assertTrue(isReadOnly);
    });

    test('disabled select should be disabled', async () => {
      const isDisabled = await engine().parts.selectDisabled.isDisabled();
      assertTrue(isDisabled);
    });
  },
};
