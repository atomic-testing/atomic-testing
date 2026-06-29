import { AlertDialogDriver } from '@atomic-testing/component-driver-astryx';
import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { alertDialogUIExample } from './AlertDialog.examples';

export const alertDialogExampleScenePart = {
  openButton: {
    locator: byDataTestId('open-alert'),
    driver: HTMLElementDriver,
  },
  alert: {
    locator: byDataTestId('alert-dialog'),
    driver: AlertDialogDriver,
  },
  actioned: {
    locator: byDataTestId('alert-actioned'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

export const alertDialogExample: IExampleUnit<typeof alertDialogExampleScenePart, JSX.Element> = {
  ...alertDialogUIExample,
  scene: alertDialogExampleScenePart,
};

export const alertDialogExampleTestSuite: TestSuiteInfo<typeof alertDialogExample.scene> = {
  title: 'Astryx AlertDialog',
  url: '/alert-dialog',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertFalse, assertTrue }) => {
    describe(`${alertDialogExample.title}`, () => {
      const engine = useTestEngine(alertDialogExample.scene, getTestEngine, { beforeEach, afterEach });

      const open = async () => {
        await engine().parts.openButton.click();
        await engine().parts.alert.waitUntil({
          probeFn: () => engine().parts.alert.isOpen(),
          terminateCondition: true,
          timeoutMs: 2000,
        });
      };

      // getRole is always alertdialog; title/description resolve via aria links.
      test(`reads role, title and description`, async () => {
        await open();
        assertEqual(await engine().parts.alert.getRole(), 'alertdialog');
        assertEqual(await engine().parts.alert.getTitle(), 'Delete item?');
        assertEqual(await engine().parts.alert.getDescription(), 'This action cannot be undone.');
      });

      // getActionLabel/getCancelLabel read the two buttons.
      test(`reads the action and cancel labels`, async () => {
        await open();
        assertEqual(await engine().parts.alert.getActionLabel(), 'Delete');
        assertEqual(await engine().parts.alert.getCancelLabel(), 'Cancel');
      });

      // clickAction fires onAction without closing the dialog.
      test(`clickAction fires the action and keeps the dialog open`, async () => {
        await open();
        await engine().parts.alert.clickAction();
        const actioned = await engine().parts.actioned.waitUntil({
          probeFn: () => engine().parts.actioned.getText(),
          terminateCondition: 'yes',
          timeoutMs: 2000,
        });
        assertEqual(actioned, 'yes');
        assertTrue(await engine().parts.alert.isOpen());
      });

      // clickCancel dismisses the dialog.
      test(`clickCancel dismisses the dialog`, async () => {
        await open();
        await engine().parts.alert.clickCancel();
        assertTrue(await engine().parts.alert.waitForClose(2000));
        assertFalse(await engine().parts.alert.isOpen());
      });
    });
  },
};
