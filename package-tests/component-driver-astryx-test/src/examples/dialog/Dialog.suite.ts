import { DialogDriver } from '@atomic-testing/component-driver-astryx';
import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { skipInteractionOnWebkit, useBrowserName } from '../../webkitGate';
import { dialogUIExample } from './Dialog.examples';

export const dialogExampleScenePart = {
  openButton: {
    locator: byDataTestId('open-dialog'),
    driver: HTMLElementDriver,
  },
  dialog: {
    locator: byDataTestId('dialog'),
    driver: DialogDriver,
  },
} satisfies ScenePart;

export const dialogExample: IExampleUnit<typeof dialogExampleScenePart, JSX.Element> = {
  ...dialogUIExample,
  scene: dialogExampleScenePart,
};

export const dialogExampleTestSuite: TestSuiteInfo<typeof dialogExample.scene> = {
  title: 'Astryx Dialog',
  url: '/dialog',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertFalse, assertTrue }) => {
    describe(`${dialogExample.title}`, () => {
      const engine = useTestEngine(dialogExample.scene, getTestEngine, { beforeEach, afterEach });
      const browser = useBrowserName(beforeEach);

      // The dialog is closed until the trigger opens it (showModal sets `open`).
      test(`opens via the trigger and reports isOpen`, async () => {
        assertFalse(await engine().parts.dialog.isOpen());
        await engine().parts.openButton.click();
        assertTrue(await engine().parts.dialog.waitForOpen(2000));
      });

      // isModal is always true; getRole is undefined for the default info purpose.
      test(`reports modal state and (absent) role`, async () => {
        await engine().parts.openButton.click();
        await engine().parts.dialog.waitForOpen(2000);
        assertTrue(await engine().parts.dialog.isModal());
        assertEqual(await engine().parts.dialog.getRole(), undefined);
      });

      // getTitle reads the DialogHeader <h2>.
      test(`getTitle reads the header title`, async () => {
        await engine().parts.openButton.click();
        await engine().parts.dialog.waitForOpen(2000);
        assertEqual(await engine().parts.dialog.getTitle(), 'Confirm action');
      });

      // Escape dismisses an info dialog. WebKit can't press Escape on the animating
      // modal <dialog> reliably (see skipInteractionOnWebkit); chromium/firefox/jsdom do.
      test(`closeByEscape dismisses the dialog`, async () => {
        if (skipInteractionOnWebkit(test, browser())) return;
        await engine().parts.openButton.click();
        await engine().parts.dialog.waitForOpen(2000);
        assertTrue(await engine().parts.dialog.closeByEscape(2000));
        assertFalse(await engine().parts.dialog.isOpen());
      });
    });
  },
};
