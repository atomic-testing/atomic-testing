import { InputDriver } from '@atomic-testing/component-driver-mui-v7';
import { byDataTestId, ScenePart, IExampleUnit } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

import { basicInputUIExample } from './BasicInput.examples';

export const basicInputExampleScenePart = {
  basic: {
    locator: byDataTestId('basic'),
    driver: InputDriver,
  },
  multiline: {
    locator: byDataTestId('multiline'),
    driver: InputDriver,
  },
  readonly: {
    locator: byDataTestId('readonly'),
    driver: InputDriver,
  },
  disabled: {
    locator: byDataTestId('disabled'),
    driver: InputDriver,
  },
} satisfies ScenePart;

export const basicInputExample: IExampleUnit<typeof basicInputExampleScenePart, JSX.Element> = {
  ...basicInputUIExample,
  scene: basicInputExampleScenePart,
};

export const basicInputTestSuite: TestSuiteInfo<typeof basicInputExample.scene> = {
  title: 'Basic Input',
  url: '/input',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual, assertTrue }) => {
    const engine = useTestEngine(basicInputExample.scene, getTestEngine, { beforeEach, afterEach });

    test('Basic input should exist', async () => {
      const exists = await engine().parts.basic.exists();
      assertTrue(exists);
    });

    test('Basic input can be typed into', async () => {
      await engine().parts.basic.setValue('test value');
      const value = await engine().parts.basic.getValue();
      assertEqual(value, 'test value');
    });

    test('Readonly input should be readonly', async () => {
      const isReadonly = await engine().parts.readonly.isReadonly();
      assertTrue(isReadonly);
    });

    test('Disabled input should be disabled', async () => {
      const isDisabled = await engine().parts.disabled.isDisabled();
      assertTrue(isDisabled);
    });

    test('Multiline input can handle multiple lines', async () => {
      await engine().parts.multiline.setValue('Line 1\nLine 2');
      const value = await engine().parts.multiline.getValue();
      assertEqual(value, 'Line 1\nLine 2');
    });
  },
};
