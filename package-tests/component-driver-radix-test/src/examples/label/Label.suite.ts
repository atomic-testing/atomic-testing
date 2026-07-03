import { LabelDriver } from '@atomic-testing/component-driver-radix-v1';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { labelUIExample } from './Label.examples';

export const labelExampleScenePart = {
  firstName: {
    locator: byDataTestId('label-first-name'),
    driver: LabelDriver,
  },
  lastName: {
    locator: byDataTestId('label-last-name'),
    driver: LabelDriver,
  },
} satisfies ScenePart;

export const labelExample: IExampleUnit<typeof labelExampleScenePart, JSX.Element> = {
  ...labelUIExample,
  scene: labelExampleScenePart,
};

export const labelExampleTestSuite: TestSuiteInfo<typeof labelExample.scene> = {
  title: 'Radix Label',
  url: '/label',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${labelExample.title}`, () => {
      const engine = useTestEngine(labelExample.scene, getTestEngine, { beforeEach, afterEach });

      test('reads text and linked control id per instance', async () => {
        assertEqual(await engine().parts.firstName.getText(), 'First name');
        assertEqual(await engine().parts.firstName.getFor(), 'first-name');

        assertEqual(await engine().parts.lastName.getText(), 'Last name');
        assertEqual(await engine().parts.lastName.getFor(), 'last-name');
      });
    });
  },
};
