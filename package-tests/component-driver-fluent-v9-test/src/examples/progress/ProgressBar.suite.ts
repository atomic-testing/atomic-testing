import { ProgressBarDriver } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { progressBarUIExample } from './ProgressBar.examples';

export const progressBarExampleScenePart = {
  determinate: { locator: byDataTestId('progress-determinate'), driver: ProgressBarDriver },
  indeterminate: { locator: byDataTestId('progress-indeterminate'), driver: ProgressBarDriver },
} satisfies ScenePart;

export const progressBarExample: IExampleUnit<typeof progressBarExampleScenePart, JSX.Element> = {
  ...progressBarUIExample,
  scene: progressBarExampleScenePart,
};

export const progressBarExampleTestSuite: TestSuiteInfo<typeof progressBarExample.scene> = {
  title: 'Fluent ProgressBar',
  url: '/progress',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${progressBarExample.title}`, () => {
      const engine = useTestEngine(progressBarExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('reads value/min/max and is not indeterminate when a value is supplied', async () => {
        assertEqual(await engine().parts.determinate.getValue(), 0.3);
        assertEqual(await engine().parts.determinate.getMin(), 0);
        assertEqual(await engine().parts.determinate.getMax(), 1);
        assertFalse(await engine().parts.determinate.isIndeterminate());
      });

      test('has no value when indeterminate', async () => {
        assertEqual(await engine().parts.indeterminate.getValue(), undefined);
        assertTrue(await engine().parts.indeterminate.isIndeterminate());
      });
    });
  },
};
