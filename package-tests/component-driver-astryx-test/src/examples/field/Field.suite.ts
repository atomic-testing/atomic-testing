import { FieldDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { fieldUIExample } from './Field.examples';

export const fieldExampleScenePart = {
  emailField: {
    locator: byDataTestId('email-field'),
    driver: FieldDriver,
  },
  phoneField: {
    locator: byDataTestId('phone-field'),
    driver: FieldDriver,
  },
} satisfies ScenePart;

export const fieldExample: IExampleUnit<typeof fieldExampleScenePart, JSX.Element> = {
  ...fieldUIExample,
  scene: fieldExampleScenePart,
};

export const fieldExampleTestSuite: TestSuiteInfo<typeof fieldExample.scene> = {
  title: 'Astryx Field',
  url: '/field',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${fieldExample.title}`, () => {
      const engine = useTestEngine(fieldExample.scene, getTestEngine, { beforeEach, afterEach });

      // getLabel/getDescription read the field chrome (plain field, no marker).
      test(`getLabel and getDescription read the field chrome`, async () => {
        assertEqual(await engine().parts.emailField.getLabel(), 'Email');
        assertEqual(await engine().parts.emailField.getDescription(), 'We never share it');
      });

      // A plain field is neither required nor optional and has no status message.
      test(`plain field reports no required/optional/status`, async () => {
        assertFalse(await engine().parts.emailField.isRequired());
        assertFalse(await engine().parts.emailField.isOptional());
        assertEqual(await engine().parts.emailField.getStatusMessage(), undefined);
      });

      // The required field reports isRequired and surfaces its status message.
      test(`required field reports isRequired and its status message`, async () => {
        assertTrue(await engine().parts.phoneField.isRequired());
        assertEqual(await engine().parts.phoneField.getStatusMessage(), 'Phone is required');
      });
    });
  },
};
