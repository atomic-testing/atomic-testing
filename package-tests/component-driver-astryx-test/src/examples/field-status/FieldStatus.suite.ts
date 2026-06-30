import { FieldStatusDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { IExampleUnit, TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { fieldStatusUIExample } from './FieldStatus.examples';

export const fieldStatusExampleScenePart = {
  errorStatus: {
    locator: byDataTestId('error-status'),
    driver: FieldStatusDriver,
  },
  warningStatus: {
    locator: byDataTestId('warning-status'),
    driver: FieldStatusDriver,
  },
} satisfies ScenePart;

export const fieldStatusExample: IExampleUnit<typeof fieldStatusExampleScenePart, JSX.Element> = {
  ...fieldStatusUIExample,
  scene: fieldStatusExampleScenePart,
};

export const fieldStatusExampleTestSuite: TestSuiteInfo<typeof fieldStatusExample.scene> = {
  title: 'Astryx FieldStatus',
  url: '/field-status',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${fieldStatusExample.title}`, () => {
      const engine = useTestEngine(fieldStatusExample.scene, getTestEngine, { beforeEach, afterEach });

      // getStatus reads the stable data-type; getMessage the text.
      test(`getStatus and getMessage read the status`, async () => {
        assertEqual(await engine().parts.errorStatus.getStatus(), 'error');
        assertEqual(await engine().parts.errorStatus.getMessage(), 'This field is required');
        assertEqual(await engine().parts.warningStatus.getStatus(), 'warning');
      });

      // isError is true only for the error severity (which renders role="alert").
      test(`isError distinguishes the error severity`, async () => {
        assertTrue(await engine().parts.errorStatus.isError());
        assertFalse(await engine().parts.warningStatus.isError());
      });
    });
  },
};
