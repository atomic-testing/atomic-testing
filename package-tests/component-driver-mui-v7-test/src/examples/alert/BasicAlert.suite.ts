import { AlertDriver } from '@atomic-testing/component-driver-mui-v7';
import { TestEngine, byDataTestId, ScenePart, IExampleUnit } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/internal-test-runner';

import { basicAlertUIExample } from './BasicAlert.examples';

export const basicAlertExampleScenePart = {
  error: {
    locator: byDataTestId('error'),
    driver: AlertDriver,
  },
  warning: {
    locator: byDataTestId('warning'),
    driver: AlertDriver,
  },
  info: {
    locator: byDataTestId('info'),
    driver: AlertDriver,
  },
  success: {
    locator: byDataTestId('success'),
    driver: AlertDriver,
  },
} satisfies ScenePart;

export const basicAlertExample: IExampleUnit<typeof basicAlertExampleScenePart, JSX.Element> = {
  ...basicAlertUIExample,
  scene: basicAlertExampleScenePart,
};

export const basicAlertTestSuite: TestSuiteInfo<typeof basicAlertExample.scene> = {
  title: 'Basic Alert',
  url: '/alert',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual }) => {
    let testEngine: TestEngine<typeof basicAlertExample.scene>;

    // Use the following beforeEach to work around the issue of Playwright's page being undefined
    // @ts-ignore
    beforeEach(function ({ page }) {
      // @ts-ignore
      testEngine = getTestEngine(basicAlertExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        arguments[0]();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });

    test('Error alert\'s code should be "code: red"', async () => {
      const message = await testEngine.parts.error.getMessage();
      assertEqual((message ?? '').includes('code: red'), true);
    });

    test("Error alert's severity should be error", async () => {
      const severity = await testEngine.parts.error.getSeverity();
      assertEqual(severity, 'error');
    });

    test("Error alert's title should be Error", async () => {
      const title = await testEngine.parts.error.getTitle();
      assertEqual(title, 'Error');
    });

    test("Error alert's message should contain the correct text", async () => {
      const message = await testEngine.parts.error.getMessage();
      assertEqual((message ?? '').includes('This is an error alert'), true);
    });

    test('Warning alert\'s code should be "code: yellow"', async () => {
      const message = await testEngine.parts.warning.getMessage();
      assertEqual((message ?? '').includes('code: yellow'), true);
    });

    test("Warning alert's severity should be warning", async () => {
      const severity = await testEngine.parts.warning.getSeverity();
      assertEqual(severity, 'warning');
    });

    test("Warning alert's title should be Warning", async () => {
      const title = await testEngine.parts.warning.getTitle();
      assertEqual(title, 'Warning');
    });

    test("Warning alert's message should contain the correct text", async () => {
      const message = await testEngine.parts.warning.getMessage();
      assertEqual((message ?? '').includes('This is a warning alert'), true);
    });

    test("Info alert's severity should be info", async () => {
      const severity = await testEngine.parts.info.getSeverity();
      assertEqual(severity, 'info');
    });

    test("Success alert's severity should be success", async () => {
      const severity = await testEngine.parts.success.getSeverity();
      assertEqual(severity, 'success');
    });
  },
};
