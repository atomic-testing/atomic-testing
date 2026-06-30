import { TimeInputDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, byInputType, locatorUtil, ScenePart } from '@atomic-testing/core';
import { IExampleUnit, TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { timeInputUIExample } from './TimeInput.examples';

export const timeInputExampleScenePart = {
  // TimeInput doesn't forward data-testid, so scope to the inner text input.
  timeInput: {
    locator: locatorUtil.append(byDataTestId('time-wrap'), byInputType('text')),
    driver: TimeInputDriver,
  },
} satisfies ScenePart;

export const timeInputExample: IExampleUnit<typeof timeInputExampleScenePart, JSX.Element> = {
  ...timeInputUIExample,
  scene: timeInputExampleScenePart,
};

export const timeInputExampleTestSuite: TestSuiteInfo<typeof timeInputExample.scene> = {
  title: 'Astryx TimeInput',
  url: '/time-input',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${timeInputExample.title}`, () => {
      const engine = useTestEngine(timeInputExample.scene, getTestEngine, { beforeEach, afterEach });

      // getLabel resolves the linked <label for>.
      test(`getLabel returns the field label`, async () => {
        assertEqual(await engine().parts.timeInput.getLabel(), 'Start time');
      });

      // getValue returns the formatted display string (12h by default), not ISO.
      test(`getValue returns the display string`, async () => {
        assertEqual(await engine().parts.timeInput.getValue(), '9:30 AM');
      });
    });
  },
};
