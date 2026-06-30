import { FileInputDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { fileInputUIExample } from './FileInput.examples';

export const fileInputExampleScenePart = {
  fiBasic: {
    locator: byDataTestId('fi-basic'),
    driver: FileInputDriver,
  },
  fiMulti: {
    locator: byDataTestId('fi-multi'),
    driver: FileInputDriver,
  },
  fiError: {
    locator: byDataTestId('fi-error'),
    driver: FileInputDriver,
  },
} satisfies ScenePart;

export const fileInputExample: IExampleUnit<typeof fileInputExampleScenePart, JSX.Element> = {
  ...fileInputUIExample,
  scene: fileInputExampleScenePart,
};

export const fileInputExampleTestSuite: TestSuiteInfo<typeof fileInputExample.scene> = {
  title: 'Astryx FileInput',
  url: '/file-input',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${fileInputExample.title}`, () => {
      const engine = useTestEngine(fileInputExample.scene, getTestEngine, { beforeEach, afterEach });

      // accept + label read off the native input and its for/id-linked <label>.
      test(`getAccept and getLabel read the basic field`, async () => {
        assertEqual(await engine().parts.fiBasic.getAccept(), '.pdf,.doc');
        assertEqual(await engine().parts.fiBasic.getLabel(), 'Resume');
      });

      // isMultiple/isRequired reflect the multi-file dropzone's input attributes.
      test(`isMultiple and isRequired read the multi field`, async () => {
        assertTrue(await engine().parts.fiMulti.isMultiple());
        assertTrue(await engine().parts.fiMulti.isRequired());
      });

      // isDisabled/isInvalid + the aria-describedby status link read the error field.
      test(`isDisabled, isInvalid and getStatusMessage read the error field`, async () => {
        assertTrue(await engine().parts.fiError.isDisabled());
        assertTrue(await engine().parts.fiError.isInvalid());
        assertEqual(await engine().parts.fiError.getStatusMessage(), 'File too large');
      });

      // A field with no status carries no aria-describedby → undefined.
      test(`getStatusMessage is undefined without a status`, async () => {
        assertEqual(await engine().parts.fiBasic.getStatusMessage(), undefined);
      });

      // The basic field is neither multiple nor required nor disabled.
      test(`basic field is single, optional and enabled`, async () => {
        assertFalse(await engine().parts.fiBasic.isMultiple());
        assertFalse(await engine().parts.fiBasic.isRequired());
        assertFalse(await engine().parts.fiBasic.isDisabled());
      });
    });
  },
};
