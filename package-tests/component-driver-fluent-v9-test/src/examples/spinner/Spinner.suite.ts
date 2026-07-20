import { SpinnerDriver } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { spinnerUIExample } from './Spinner.examples';

export const spinnerExampleScenePart = {
  labeled: { locator: byDataTestId('spinner-labeled'), driver: SpinnerDriver },
  unlabeled: { locator: byDataTestId('spinner-unlabeled'), driver: SpinnerDriver },
} satisfies ScenePart;

export const spinnerExample: IExampleUnit<typeof spinnerExampleScenePart, JSX.Element> = {
  ...spinnerUIExample,
  scene: spinnerExampleScenePart,
};

export const spinnerExampleTestSuite: TestSuiteInfo<typeof spinnerExample.scene> = {
  title: 'Fluent Spinner',
  url: '/spinner',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${spinnerExample.title}`, () => {
      const engine = useTestEngine(spinnerExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('reads its own label per instance, undefined when unset', async () => {
        assertEqual(await engine().parts.labeled.getLabel(), 'Loading...');
        assertEqual(await engine().parts.unlabeled.getLabel(), undefined);
      });
    });
  },
};
