import { HTMLButtonDriver } from '@atomic-testing/component-driver-html';
import { ButtonDriver, SnackbarDriver } from '@atomic-testing/component-driver-mui-v7';
import { IExampleUnit, ScenePart, byDataTestId } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { basicSnackbarUIExample } from './BasicSnackbar.examples';

/**
 * Content the scene passes to Snackbar's `action` prop. Reached by anchoring an
 * ordinary ScenePart inside the driver's `actionArea` chrome part — the general
 * replacement for the removed bespoke `getActionComponent` accessor.
 */
const snackbarActionPart = {
  close: {
    locator: byDataTestId('close-button'),
    driver: HTMLButtonDriver,
  },
} satisfies ScenePart;

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
    const engine = useTestEngine(basicSnackbarExample.scene, getTestEngine, { beforeEach, afterEach });

    test('it should have a button to open snackbar', async () => {
      assertTrue(await engine().parts.snackOpener.exists());
    });

    test('it should initially not show the snackbar', async () => {
      assertFalse(await engine().parts.basicSnackbar.isVisible());
    });

    test('it should show snackbar when button is clicked', async () => {
      await engine().parts.snackOpener.click();
      assertTrue(await engine().parts.basicSnackbar.isVisible());
    });

    test('it should display the correct message', async () => {
      await engine().parts.snackOpener.click();
      const message = await engine().parts.basicSnackbar.getLabel();
      assertEqual(message, 'Note archived');
    });

    test('it should expose action-area content through within', async () => {
      await engine().parts.snackOpener.click();
      const action = engine().parts.basicSnackbar.parts.actionArea.within(snackbarActionPart);
      assertTrue(await action.close.exists());
      assertEqual(await action.close.getAttribute('aria-label'), 'close');
    });
  },
};
