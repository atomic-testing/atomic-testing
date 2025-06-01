import { ProgressDriver } from '@atomic-testing/component-driver-mui-v6';
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
//#endregion

export const progressTestSuite: TestSuiteInfo<typeof basicProgressExampleScenePart> = {
  title: 'Basic Progress',
  url: '/progress',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
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

    describe('Circular', () => {
      test(`Type is circular`, async () => {
        const type = await testEngine.parts.circular.getType();
        assertEqual(type, 'circular');
      });

      test(`Value is 25`, async () => {
        const value = await testEngine.parts.circular.getValue();
        assertEqual(value, 25);
      });

      test(`Determinate is true`, async () => {
        const determinate = await testEngine.parts.circular.isDeterminate();
        assertEqual(determinate, true);
      });
    });

    describe('Circular Indeterminate', () => {
      test(`Type is circular`, async () => {
        const type = await testEngine.parts.circularIndeterminate.getType();
        assertEqual(type, 'circular');
      });

      test(`Value is null`, async () => {
        const value = await testEngine.parts.circularIndeterminate.getValue();
        assertEqual(value, null);
      });

      test(`Determinate is false`, async () => {
        const determinate = await testEngine.parts.circularIndeterminate.isDeterminate();
        assertEqual(determinate, false);
      });
    });

    describe('Linear', () => {
      test(`Type is linear`, async () => {
        const type = await testEngine.parts.linear.getType();
        assertEqual(type, 'linear');
      });

      test(`Value is 50`, async () => {
        const value = await testEngine.parts.linear.getValue();
        assertEqual(value, 50);
      });

      test(`Determinate is true`, async () => {
        const determinate = await testEngine.parts.linear.isDeterminate();
        assertEqual(determinate, true);
      });
    });

    describe('Linear Indeterminate', () => {
      test(`Type is linear`, async () => {
        const type = await testEngine.parts.linearIndeterminate.getType();
        assertEqual(type, 'linear');
      });

      test(`Value is null`, async () => {
        const value = await testEngine.parts.linearIndeterminate.getValue();
        assertEqual(value, null);
      });

      test(`Determinate is false`, async () => {
        const determinate = await testEngine.parts.linearIndeterminate.isDeterminate();
        assertEqual(determinate, false);
      });
    });

    describe('Linear buffer', () => {
      test(`Type is linear`, async () => {
        const type = await testEngine.parts.linearBuffer.getType();
        assertEqual(type, 'linear');
      });

      test(`Value is null`, async () => {
        const value = await testEngine.parts.linearBuffer.getValue();
        assertEqual(value, 70);
      });

      test(`Determinate is true`, async () => {
        const determinate = await testEngine.parts.linearBuffer.isDeterminate();
        assertEqual(determinate, true);
      });

      // There is no buffer value extraction
    });
  },
};
