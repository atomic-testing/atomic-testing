import { PasswordToggleFieldDriver } from '@atomic-testing/component-driver-radix-v1';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { passwordToggleFieldUIExample } from './PasswordToggleField.examples';

export const passwordToggleFieldExampleScenePart = {
  field: {
    locator: byDataTestId('password-toggle-field'),
    driver: PasswordToggleFieldDriver,
  },
  disabledField: {
    locator: byDataTestId('password-toggle-field-disabled'),
    driver: PasswordToggleFieldDriver,
  },
} satisfies ScenePart;

export const passwordToggleFieldExample: IExampleUnit<typeof passwordToggleFieldExampleScenePart, JSX.Element> = {
  ...passwordToggleFieldUIExample,
  scene: passwordToggleFieldExampleScenePart,
};

export const passwordToggleFieldExampleTestSuite: TestSuiteInfo<typeof passwordToggleFieldExample.scene> = {
  title: 'Radix PasswordToggleField',
  url: '/password-toggle-field',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${passwordToggleFieldExample.title}`, () => {
      const engine = useTestEngine(passwordToggleFieldExample.scene, getTestEngine, { beforeEach, afterEach });

      test(`sets and reads the password value`, async () => {
        assertTrue(await engine().parts.field.setValue('secret123'));
        assertEqual(await engine().parts.field.getValue(), 'secret123');
      });

      // type="password" is the only portable visibility signal — Radix does not
      // set data-state on this primitive.
      test(`starts masked and flips to plain text on toggle`, async () => {
        assertFalse(await engine().parts.field.isPasswordVisible());
        await engine().parts.field.toggleVisibility();
        assertTrue(await engine().parts.field.isPasswordVisible());
      });

      test(`toggling preserves the typed value`, async () => {
        await engine().parts.field.setValue('secret123');
        await engine().parts.field.toggleVisibility();
        assertEqual(await engine().parts.field.getValue(), 'secret123');
      });

      // Radix computes the toggle's default aria-label from current visibility
      // when the consumer supplies neither an explicit label nor visible content.
      test(`the toggle's accessible label reflects visibility`, async () => {
        assertEqual(await engine().parts.field.getToggleLabel(), 'Show password');
        await engine().parts.field.toggleVisibility();
        assertEqual(await engine().parts.field.getToggleLabel(), 'Hide password');
      });

      test(`isDisabled distinguishes the two scene instances`, async () => {
        assertFalse(await engine().parts.field.isDisabled());
        assertTrue(await engine().parts.disabledField.isDisabled());
      });
    });
  },
};
