import { HTMLButtonDriver } from '@atomic-testing/component-driver-html';
import { DialogDriver } from '@atomic-testing/component-driver-radix-v1';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { dialogUIExample } from './Dialog.examples';

const dialogContentPart = {
  close: {
    locator: byDataTestId('dialog-close'),
    driver: HTMLButtonDriver,
  },
} satisfies ScenePart;

export const dialogExampleScenePart = {
  trigger: {
    locator: byDataTestId('dialog-trigger'),
    driver: HTMLButtonDriver,
  },
  dialog: {
    locator: byDataTestId('dialog-content'),
    driver: DialogDriver<typeof dialogContentPart>,
    option: {
      content: dialogContentPart,
    },
  },
} satisfies ScenePart;

export const dialogExample: IExampleUnit<typeof dialogExampleScenePart, JSX.Element> = {
  ...dialogUIExample,
  scene: dialogExampleScenePart,
};

export const dialogExampleTestSuite: TestSuiteInfo<typeof dialogExample.scene> = {
  title: 'Radix Dialog',
  url: '/dialog',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${dialogExample.title}`, () => {
      const engine = useTestEngine(dialogExample.scene, getTestEngine, { beforeEach, afterEach });

      test('is not open initially', async () => {
        assertFalse(await engine().parts.dialog.isOpen());
      });

      test('clicking the trigger opens the dialog', async () => {
        await engine().parts.trigger.click();
        await engine().parts.dialog.waitForOpen();
        assertTrue(await engine().parts.dialog.isOpen());
      });

      // Reads Dialog.Title's text via the `title` part scoped inside the
      // re-rooted content (see DialogDriver's doc comment for the re-root recipe).
      test('reads the dialog title', async () => {
        await engine().parts.trigger.click();
        await engine().parts.dialog.waitForOpen();
        assertEqual(await engine().parts.dialog.getTitle(), 'Audit dialog');
      });

      test('clicking the close button closes the dialog', async () => {
        await engine().parts.trigger.click();
        await engine().parts.dialog.waitForOpen();
        await engine().parts.dialog.content.close.click();
        await engine().parts.dialog.waitForClose();
        assertFalse(await engine().parts.dialog.isOpen());
      });

      // Escape is Radix's DismissableLayer dismissal path — see the
      // hasPointerCapture-adjacent doc comment on DialogDriver.closeByEscape for
      // why this (not a backdrop click) is the portable dismissal proven here.
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
