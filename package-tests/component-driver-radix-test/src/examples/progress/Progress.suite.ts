import { ProgressDriver } from '@atomic-testing/component-driver-radix-v1';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { progressUIExample } from './Progress.examples';

export const progressExampleScenePart = {
  determinate: {
    locator: byDataTestId('progress-determinate'),
    driver: ProgressDriver,
  },
  indeterminate: {
    locator: byDataTestId('progress-indeterminate'),
    driver: ProgressDriver,
  },
} satisfies ScenePart;

export const progressExample: IExampleUnit<typeof progressExampleScenePart, JSX.Element> = {
  ...progressUIExample,
  scene: progressExampleScenePart,
};

export const progressExampleTestSuite: TestSuiteInfo<typeof progressExample.scene> = {
  title: 'Radix Progress',
  url: '/progress',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${progressExample.title}`, () => {
      const engine = useTestEngine(progressExample.scene, getTestEngine, { beforeEach, afterEach });

      test('reads the determinate value and max', async () => {
        assertEqual(await engine().parts.determinate.getValue(), 40);
        assertEqual(await engine().parts.determinate.getMax(), 100);
        assertFalse(await engine().parts.determinate.isIndeterminate());
      });

      test('reads null value when indeterminate', async () => {
        assertEqual(await engine().parts.indeterminate.getValue(), null);
        assertTrue(await engine().parts.indeterminate.isIndeterminate());
      });
    });
  },
};
