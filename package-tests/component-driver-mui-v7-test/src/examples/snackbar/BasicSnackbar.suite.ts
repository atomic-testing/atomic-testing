import { JSX } from 'react';

import { ButtonDriver, SnackbarDriver } from '@atomic-testing/component-driver-mui-v7';
import { IExampleUnit, ScenePart, TestEngine, byDataTestId } from '@atomic-testing/core';
import { TestFixture, TestSuiteInfo } from '@atomic-testing/internal-test-runner';

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
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    let testEngine: TestEngine<typeof basicSnackbarExample.scene>;
    beforeEach(function ({ page }: TestFixture) {
      testEngine = getTestEngine(basicSnackbarExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        (arguments[0] as () => void)();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });

    test('it should have a button to open snackbar', async () => {
      assertTrue(await testEngine.parts.snackOpener.exists());
    });

    test('it should initially not show the snackbar', async () => {
      assertFalse(await testEngine.parts.basicSnackbar.isVisible());
    });

    test('it should show snackbar when button is clicked', async () => {
      await testEngine.parts.snackOpener.click();
      assertTrue(await testEngine.parts.basicSnackbar.isVisible());
    });

    test('it should display the correct message', async () => {
      await testEngine.parts.snackOpener.click();
      const message = await testEngine.parts.basicSnackbar.getLabel();
      assertEqual(message, 'Note archived');
    });
  },
};
