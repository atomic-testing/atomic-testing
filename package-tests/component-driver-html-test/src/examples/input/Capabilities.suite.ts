import { HTMLTextInputDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { IExampleUnit, TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { textInputCapabilitiesUIExample } from './Capabilities.examples';

export const textInputCapabilitiesExampleScenePart = {
  plain: { locator: byDataTestId('capability-plain-input'), driver: HTMLTextInputDriver },
  disabled: { locator: byDataTestId('capability-disabled-input'), driver: HTMLTextInputDriver },
  readonly: { locator: byDataTestId('capability-readonly-input'), driver: HTMLTextInputDriver },
  required: { locator: byDataTestId('capability-required-input'), driver: HTMLTextInputDriver },
  invalid: { locator: byDataTestId('capability-invalid-input'), driver: HTMLTextInputDriver },
} satisfies ScenePart;

export const textInputCapabilitiesExample: IExampleUnit<typeof textInputCapabilitiesExampleScenePart, JSX.Element> = {
  ...textInputCapabilitiesUIExample,
  scene: textInputCapabilitiesExampleScenePart,
};

export const textInputCapabilitiesExampleTestSuite: TestSuiteInfo<typeof textInputCapabilitiesExample.scene> = {
  title: 'TextInputCapabilities',
  url: '/input',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertFalse, assertTrue }) => {
    describe(`${textInputCapabilitiesExample.title}`, () => {
      const engine = useTestEngine(textInputCapabilitiesExample.scene, getTestEngine, { beforeEach, afterEach });

      test('isDisabled reflects the disabled attribute', async () => {
        assertFalse(await engine().parts.plain.isDisabled());
        assertTrue(await engine().parts.disabled.isDisabled());
      });

      test('isReadonly reflects the readonly attribute', async () => {
        assertFalse(await engine().parts.plain.isReadonly());
        assertTrue(await engine().parts.readonly.isReadonly());
      });

      test('isRequired reflects the required attribute', async () => {
        assertFalse(await engine().parts.plain.isRequired());
        assertTrue(await engine().parts.required.isRequired());
      });

      test('isError reflects aria-invalid', async () => {
        assertFalse(await engine().parts.plain.isError());
        assertTrue(await engine().parts.invalid.isError());
      });
    });
  },
};
