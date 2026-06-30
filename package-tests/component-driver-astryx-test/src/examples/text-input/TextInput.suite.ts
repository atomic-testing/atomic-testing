import { TextInputDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { IExampleUnit, TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { textInputUIExample } from './TextInput.examples';

export const textInputExampleScenePart = {
  // Astryx forwards data-testid onto the inner <input>, so anchor it there.
  nameInput: {
    locator: byDataTestId('name-input'),
    driver: TextInputDriver,
  },
  emailInput: {
    locator: byDataTestId('email-input'),
    driver: TextInputDriver,
  },
} satisfies ScenePart;

export const textInputExample: IExampleUnit<typeof textInputExampleScenePart, JSX.Element> = {
  ...textInputUIExample,
  scene: textInputExampleScenePart,
};

export const textInputExampleTestSuite: TestSuiteInfo<typeof textInputExample.scene> = {
  title: 'Astryx TextInput',
  url: '/text-input',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${textInputExample.title}`, () => {
      const engine = useTestEngine(textInputExample.scene, getTestEngine, { beforeEach, afterEach });

      // getLabel resolves the <label for> linked to the input's id.
      test(`getLabel returns the field's visible label`, async () => {
        assertEqual(await engine().parts.nameInput.getLabel(), 'Name');
      });

      // setValue/getValue round-trips through Astryx's controlled onChange.
      test(`setValue then getValue round-trips`, async () => {
        await engine().parts.nameInput.setValue('Ada Lovelace');
        assertEqual(await engine().parts.nameInput.getValue(), 'Ada Lovelace');
      });

      // clear empties the value.
      test(`clear empties the value`, async () => {
        await engine().parts.nameInput.setValue('temp');
        await engine().parts.nameInput.clear();
        assertEqual(await engine().parts.nameInput.getValue(), '');
      });

      // Two inputs each resolve to their OWN element (locator not too broad).
      test(`two inputs disambiguate by testid`, async () => {
        await engine().parts.nameInput.setValue('alice');
        await engine().parts.emailInput.setValue('alice@example.com');
        assertEqual(await engine().parts.nameInput.getValue(), 'alice');
        assertEqual(await engine().parts.emailInput.getValue(), 'alice@example.com');
      });

      // isRequired reads aria-required; only the email field is required.
      test(`isRequired reflects the required state`, async () => {
        assertTrue(await engine().parts.emailInput.isRequired());
        assertFalse(await engine().parts.nameInput.isRequired());
      });

      // isInvalid reads aria-invalid; the email field has an error status.
      test(`isInvalid reflects the error state`, async () => {
        assertTrue(await engine().parts.emailInput.isInvalid());
        assertFalse(await engine().parts.nameInput.isInvalid());
      });

      // getStatusMessage resolves the aria-describedby status element.
      test(`getStatusMessage returns the validation message, undefined when none`, async () => {
        assertEqual(await engine().parts.emailInput.getStatusMessage(), 'Email is required');
        assertEqual(await engine().parts.nameInput.getStatusMessage(), undefined);
      });
    });
  },
};
