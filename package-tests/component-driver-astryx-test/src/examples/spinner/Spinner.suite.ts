import { SpinnerDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { spinnerUIExample } from './Spinner.examples';

export const spinnerExampleScenePart = {
  unlabeled: {
    locator: byDataTestId('spinner-unlabeled'),
    driver: SpinnerDriver,
  },
  labeled: {
    locator: byDataTestId('spinner-labeled'),
    driver: SpinnerDriver,
  },
} satisfies ScenePart;

export const spinnerExample: IExampleUnit<typeof spinnerExampleScenePart, JSX.Element> = {
  ...spinnerUIExample,
  scene: spinnerExampleScenePart,
};

export const spinnerExampleTestSuite: TestSuiteInfo<typeof spinnerExample.scene> = {
  title: 'Astryx Spinner',
  url: '/spinner',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertNotEqual }) => {
    describe(`${spinnerExample.title}`, () => {
      const engine = useTestEngine(spinnerExample.scene, getTestEngine, { beforeEach, afterEach });

      // Unlabeled: the root itself is the role="status" region with the default name.
      test(`unlabeled spinner exposes the default accessible name and no visible label`, async () => {
        assertEqual(await engine().parts.unlabeled.getAccessibleName(), 'Loading');
        assertEqual(await engine().parts.unlabeled.getLabelText(), undefined);
      });

      // Labeled: the visible astryx-text label is present and the descendant status
      // span still provides an accessible name.
      test(`labeled spinner exposes the visible label`, async () => {
        assertEqual(await engine().parts.labeled.getLabelText(), 'Loading...');
        assertNotEqual(await engine().parts.labeled.getAccessibleName(), undefined);
      });
    });
  },
};
