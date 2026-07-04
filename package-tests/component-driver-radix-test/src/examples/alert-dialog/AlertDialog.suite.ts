import { HTMLButtonDriver } from '@atomic-testing/component-driver-html';
import { AlertDialogDriver } from '@atomic-testing/component-driver-radix-v1';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { alertDialogUIExample } from './AlertDialog.examples';

// Cancel/Action render as plain, order-free <button>s with no distinguishing
// DOM attribute (see AlertDialogDriver's class doc) — they are consumer
// content parts by design, anchored by forwarded data-testids.
const alertDialogContentPart = {
  cancel: {
    locator: byDataTestId('alert-dialog-cancel'),
    driver: HTMLButtonDriver,
  },
  action: {
    locator: byDataTestId('alert-dialog-action'),
    driver: HTMLButtonDriver,
  },
} satisfies ScenePart;

export const alertDialogExampleScenePart = {
  trigger: {
    locator: byDataTestId('alert-dialog-trigger'),
    driver: HTMLButtonDriver,
  },
  dialog: {
    locator: byDataTestId('alert-dialog-content'),
    driver: AlertDialogDriver<typeof alertDialogContentPart>,
    option: {
      content: alertDialogContentPart,
    },
  },
} satisfies ScenePart;

export const alertDialogExample: IExampleUnit<typeof alertDialogExampleScenePart, JSX.Element> = {
  ...alertDialogUIExample,
  scene: alertDialogExampleScenePart,
};

export const alertDialogExampleTestSuite: TestSuiteInfo<typeof alertDialogExample.scene> = {
  title: 'Radix AlertDialog',
  url: '/alert-dialog',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${alertDialogExample.title}`, () => {
      const engine = useTestEngine(alertDialogExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('is not open initially', async () => {
        assertFalse(await engine().parts.dialog.isOpen());
      });

      test('clicking the trigger opens the dialog', async () => {
        await engine().parts.trigger.click();
        await engine().parts.dialog.waitForOpen();
        assertTrue(await engine().parts.dialog.isOpen());
      });

      test('reads the title and description', async () => {
        await engine().parts.trigger.click();
        await engine().parts.dialog.waitForOpen();
        assertEqual(await engine().parts.dialog.getTitle(), 'Are you absolutely sure?');
        assertEqual(await engine().parts.dialog.getDescription(), 'This action cannot be undone.');
      });

      test('the cancel content part closes the dialog', async () => {
        await engine().parts.trigger.click();
        await engine().parts.dialog.waitForOpen();
        await engine().parts.dialog.content.cancel.click();
        await engine().parts.dialog.waitForClose();
        assertFalse(await engine().parts.dialog.isOpen());
      });

      test('the action content part closes the dialog', async () => {
        await engine().parts.trigger.click();
        await engine().parts.dialog.waitForOpen();
        await engine().parts.dialog.content.action.click();
        await engine().parts.dialog.waitForClose();
        assertFalse(await engine().parts.dialog.isOpen());
      });

      // Radix blocks AlertDialog's outside-pointer dismissal but Escape still
      // flows through DismissableLayer — this pins that behavioural contract.
      test('pressing Escape closes the dialog', async () => {
        await engine().parts.trigger.click();
        await engine().parts.dialog.waitForOpen();
        const closed = await engine().parts.dialog.closeByEscape();
        assertTrue(closed);
        assertFalse(await engine().parts.dialog.isOpen());
      });
    });
  },
};
