import { JSX } from 'react';

import { ButtonDriver, SnackbarDriver } from '@atomic-testing/component-driver-mui-v6';
import { IExampleUnit, ScenePart, TestEngine, byDataTestId } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';

import { basicSnackbarUIExample } from './BasicSnackbar.examples';

export const basicSnackbarExampleScenePart = {
  basicSnackbar: {
    locator: byDataTestId('basic-snackbar'),
    driver: SnackbarDriver,
  },
  snackOpener: {
    locator: byDataTestId('snack-opener'),
    driver: ButtonDriver,
  },
} satisfies ScenePart;

/**
 * Basic Snackbar example from MUI's website
 * @see https://mui.com/material-ui/react-snackbar#description
 */
export const basicSnackbarExample: IExampleUnit<typeof basicSnackbarExampleScenePart, JSX.Element> = {
  ...basicSnackbarUIExample,
  scene: basicSnackbarExampleScenePart,
};

export const basicSnackbarTestSuite: TestSuiteInfo<typeof basicSnackbarExampleScenePart> = {
  title: 'Basic Snackbar',
  url: '/snackbar',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual }) => {
    let testEngine: TestEngine<typeof basicSnackbarExample.scene>;

    // Use the following beforeEach to work around the issue of Playwright's page being undefined
    // @ts-ignore
    beforeEach(function ({ page }) {
      // @ts-ignore
      testEngine = getTestEngine(basicSnackbarExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        arguments[0]();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });

    test('it should have a button to open snackbar', async () => {
      assertEqual(await testEngine.parts.snackOpener.exists(), true);
    });

    test('it should initially not show the snackbar', async () => {
      assertEqual(await testEngine.parts.basicSnackbar.isVisible(), false);
    });

    test('it should show snackbar when button is clicked', async () => {
      await testEngine.parts.snackOpener.click();
      assertEqual(await testEngine.parts.basicSnackbar.isVisible(), true);
    });

    test('it should display the correct message', async () => {
      await testEngine.parts.snackOpener.click();
      const message = await testEngine.parts.basicSnackbar.getLabel();
      assertEqual(message, 'Note archived');
    });
  },
};
