import { OneTimePasswordFieldDriver } from '@atomic-testing/component-driver-radix-v1';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { oneTimePasswordFieldUIExample } from './OneTimePasswordField.examples';

export const oneTimePasswordFieldExampleScenePart = {
  otp: {
    locator: byDataTestId('otp'),
    driver: OneTimePasswordFieldDriver,
  },
  disabledOtp: {
    locator: byDataTestId('otp-disabled'),
    driver: OneTimePasswordFieldDriver,
  },
} satisfies ScenePart;

export const oneTimePasswordFieldExample: IExampleUnit<typeof oneTimePasswordFieldExampleScenePart, JSX.Element> = {
  ...oneTimePasswordFieldUIExample,
  scene: oneTimePasswordFieldExampleScenePart,
};

export const oneTimePasswordFieldExampleTestSuite: TestSuiteInfo<typeof oneTimePasswordFieldExample.scene> = {
  title: 'Radix OneTimePasswordField',
  url: '/one-time-password-field',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${oneTimePasswordFieldExample.title}`, () => {
      const engine = useTestEngine(oneTimePasswordFieldExample.scene, getTestEngine, { beforeEach, afterEach });

      test(`reports the number of rendered boxes`, async () => {
        assertEqual(await engine().parts.otp.getLength(), 6);
      });

      test(`starts empty`, async () => {
        assertEqual(await engine().parts.otp.getValue(), '');
      });

      test(`setValue types one character per box and getValue reassembles the code`, async () => {
        assertTrue(await engine().parts.otp.setValue('123456'));
        assertEqual(await engine().parts.otp.getValue(), '123456');
      });

      test(`setValue can fill fewer boxes than are rendered`, async () => {
        assertTrue(await engine().parts.otp.setValue('123'));
        assertEqual(await engine().parts.otp.getValue(), '123');
      });

      // A code longer than the rendered boxes is rejected outright rather than
      // silently truncated or spilled into a paste-style autocomplete path.
      test(`setValue rejects a code longer than the box count`, async () => {
        assertFalse(await engine().parts.otp.setValue('1234567'));
        assertEqual(await engine().parts.otp.getValue(), '');
      });

      test(`isDisabled distinguishes the two scene instances`, async () => {
        assertFalse(await engine().parts.otp.isDisabled());
        assertTrue(await engine().parts.disabledOtp.isDisabled());
      });
    });
  },
};
