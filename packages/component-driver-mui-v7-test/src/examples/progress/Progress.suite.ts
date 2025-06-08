import { JSX } from 'react';

import { ProgressDriver } from '@atomic-testing/component-driver-mui-v7';
import { byDataTestId, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';

import { basicProgressUIExample } from './Progress.examples';

export const basicProgressExampleScenePart = {
  circular: {
    locator: byDataTestId('circular'),
    driver: ProgressDriver,
  },
  circularIndeterminate: {
    locator: byDataTestId('circular-indeterminate'),
    driver: ProgressDriver,
  },
  linear: {
    locator: byDataTestId('linear-determinate'),
    driver: ProgressDriver,
  },
  linearIndeterminate: {
    locator: byDataTestId('linear-indeterminate'),
    driver: ProgressDriver,
  },
  linearBuffer: {
    locator: byDataTestId('linear-buffer'),
    driver: ProgressDriver,
  },
} satisfies ScenePart;

/**
 * Basic Progress example from MUI's website
 * @see https://mui.com/material-ui/react-progress
 */
export const basicProgressExample: IExampleUnit<typeof basicProgressExampleScenePart, JSX.Element> = {
  ...basicProgressUIExample,
  scene: basicProgressExampleScenePart,
};

export const progressTestSuite: TestSuiteInfo<typeof basicProgressExampleScenePart> = {
  title: 'Basic Progress',
  url: '/progress',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual }) => {
    let testEngine: TestEngine<typeof basicProgressExample.scene>;

    // Use the following beforeEach to work around the issue of Playwright's page being undefined
    // @ts-ignore
    beforeEach(function ({ page }) {
      // @ts-ignore
      testEngine = getTestEngine(basicProgressExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        arguments[0]();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });

    test('circular progress should have correct type', async () => {
      const type = await testEngine.parts.circular.getType();
      assertEqual(type, 'circular');
    });

    test('circular progress should have value 25', async () => {
      const value = await testEngine.parts.circular.getValue();
      assertEqual(value, 25);
    });

    test('circular progress should be determinate', async () => {
      const determinate = await testEngine.parts.circular.isDeterminate();
      assertEqual(determinate, true);
    });

    test('circular indeterminate should have correct type', async () => {
      const type = await testEngine.parts.circularIndeterminate.getType();
      assertEqual(type, 'circular');
    });

    test('circular indeterminate should have null value', async () => {
      const value = await testEngine.parts.circularIndeterminate.getValue();
      assertEqual(value, null);
    });

    test('circular indeterminate should not be determinate', async () => {
      const determinate = await testEngine.parts.circularIndeterminate.isDeterminate();
      assertEqual(determinate, false);
    });

    test('linear progress should have correct type', async () => {
      const type = await testEngine.parts.linear.getType();
      assertEqual(type, 'linear');
    });

    test('linear progress should have value 50', async () => {
      const value = await testEngine.parts.linear.getValue();
      assertEqual(value, 50);
    });

    test('linear progress should be determinate', async () => {
      const determinate = await testEngine.parts.linear.isDeterminate();
      assertEqual(determinate, true);
    });

    test('linear indeterminate should have correct type', async () => {
      const type = await testEngine.parts.linearIndeterminate.getType();
      assertEqual(type, 'linear');
    });

    test('linear indeterminate should have null value', async () => {
      const value = await testEngine.parts.linearIndeterminate.getValue();
      assertEqual(value, null);
    });

    test('linear indeterminate should not be determinate', async () => {
      const determinate = await testEngine.parts.linearIndeterminate.isDeterminate();
      assertEqual(determinate, false);
    });

    test('linear buffer should have correct type', async () => {
      const type = await testEngine.parts.linearBuffer.getType();
      assertEqual(type, 'linear');
    });

    test('linear buffer should have value 70', async () => {
      const value = await testEngine.parts.linearBuffer.getValue();
      assertEqual(value, 70);
    });

    test('linear buffer should be determinate', async () => {
      const determinate = await testEngine.parts.linearBuffer.isDeterminate();
      assertEqual(determinate, true);
    });
  },
};
