import { JSX } from 'react';

import { ProgressDriver } from '@atomic-testing/component-driver-mui-v5';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

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
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    const engine = useTestEngine(basicProgressExample.scene, getTestEngine, { beforeEach, afterEach });

    test('circular progress should have correct type', async () => {
      const type = await engine().parts.circular.getType();
      assertEqual(type, 'circular');
    });

    test('circular progress should have value 25', async () => {
      const value = await engine().parts.circular.getValue();
      assertEqual(value, 25);
    });

    test('circular progress should be determinate', async () => {
      const determinate = await engine().parts.circular.isDeterminate();
      assertTrue(determinate);
    });

    test('circular indeterminate should have correct type', async () => {
      const type = await engine().parts.circularIndeterminate.getType();
      assertEqual(type, 'circular');
    });

    test('circular indeterminate should have null value', async () => {
      const value = await engine().parts.circularIndeterminate.getValue();
      assertEqual(value, null);
    });

    test('circular indeterminate should not be determinate', async () => {
      const determinate = await engine().parts.circularIndeterminate.isDeterminate();
      assertFalse(determinate);
    });

    test('linear progress should have correct type', async () => {
      const type = await engine().parts.linear.getType();
      assertEqual(type, 'linear');
    });

    test('linear progress should have value 50', async () => {
      const value = await engine().parts.linear.getValue();
      assertEqual(value, 50);
    });

    test('linear progress should be determinate', async () => {
      const determinate = await engine().parts.linear.isDeterminate();
      assertTrue(determinate);
    });

    test('linear indeterminate should have correct type', async () => {
      const type = await engine().parts.linearIndeterminate.getType();
      assertEqual(type, 'linear');
    });

    test('linear indeterminate should have null value', async () => {
      const value = await engine().parts.linearIndeterminate.getValue();
      assertEqual(value, null);
    });

    test('linear indeterminate should not be determinate', async () => {
      const determinate = await engine().parts.linearIndeterminate.isDeterminate();
      assertFalse(determinate);
    });

    test('linear buffer should have correct type', async () => {
      const type = await engine().parts.linearBuffer.getType();
      assertEqual(type, 'linear');
    });

    test('linear buffer should have value 70', async () => {
      const value = await engine().parts.linearBuffer.getValue();
      assertEqual(value, 70);
    });

    test('linear buffer should be determinate', async () => {
      const determinate = await engine().parts.linearBuffer.isDeterminate();
      assertTrue(determinate);
    });
  },
};
