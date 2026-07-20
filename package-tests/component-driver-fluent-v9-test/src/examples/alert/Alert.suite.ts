import { AlertDriver } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { alertUIExample } from './Alert.examples';

export const alertExampleScenePart = {
  plain: { locator: byDataTestId('alert-plain'), driver: AlertDriver },
  withAction: { locator: byDataTestId('alert-with-action'), driver: AlertDriver },
} satisfies ScenePart;

export const alertExample: IExampleUnit<typeof alertExampleScenePart, JSX.Element> = {
  ...alertUIExample,
  scene: alertExampleScenePart,
};

export const alertExampleTestSuite: TestSuiteInfo<typeof alertExample.scene> = {
  title: 'Fluent Alert',
  url: '/alert',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${alertExample.title}`, () => {
      const engine = useTestEngine(alertExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('reads its own message text per instance', async () => {
        assertEqual(await engine().parts.plain.getText(), 'Saved successfully');
      });

      test('an alert with an action includes the action text in its whole-root text (known gap)', async () => {
        assertEqual(await engine().parts.withAction.getText(), 'Something went wrongRetry');
      });
    });
  },
};
