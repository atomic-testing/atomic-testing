import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { ButtonDriver, DialogDriver } from '@atomic-testing/component-driver-mui-v9';
import { byCssSelector, byDataTestId, ScenePart, IExampleUnit } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

import { alertDialogUIExample } from './AlertDialog.examples';

const dialogContentPart = {
  disagree: {
    locator: byDataTestId('disagree-button'),
    driver: ButtonDriver,
  },
  agree: {
    locator: byDataTestId('agree-button'),
    driver: ButtonDriver,
  },
} satisfies ScenePart;

/**
 * A deliberately anchor-sensitive interior: the FIRST DIRECT CHILD of whatever
 * `within` resolves against. Anchored on the dialog surface it is the caller's
 * `DialogTitle`; anchored on the Modal root it would be `.MuiBackdrop-root`.
 */
const firstInteriorChildPart = {
  firstChild: {
    locator: byCssSelector('*', 'Child'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

export const alertExampleScenePart = {
  openTrigger: {
    locator: byDataTestId('alert-open-trigger'),
    driver: ButtonDriver,
  },
  dialog: {
    locator: byDataTestId('alert-dialog'),
    driver: DialogDriver,
  },
} satisfies ScenePart;

export const alertDialogExample: IExampleUnit<typeof alertExampleScenePart, JSX.Element> = {
  ...alertDialogUIExample,
  scene: alertExampleScenePart,
};

export const alertDialogTestSuite: TestSuiteInfo<typeof alertDialogExample.scene> = {
  title: 'Alert dialog',
  url: '/dialog',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    const engine = useTestEngine(alertDialogExample.scene, getTestEngine, { beforeEach, afterEach });

    test('Dialog should not be open initially', async () => {
      const isOpen = await engine().parts.dialog.isOpen();
      assertFalse(isOpen);
    });

    test('Clicking open trigger should open dialog', async () => {
      await engine().parts.openTrigger.click();
      const isOpen = await engine().parts.dialog.isOpen();
      assertTrue(isOpen);
    });

    test('Clicking agree button should close dialog', async () => {
      await engine().parts.openTrigger.click();
      await engine().parts.dialog.within(dialogContentPart).agree.click();
      // Settle the close transition before sampling, so isOpen() isn't read mid-fade.
      await engine().parts.dialog.waitForClose();
      const isOpen = await engine().parts.dialog.isOpen();
      assertFalse(isOpen);
    });

    test('Clicking disagree button should close dialog', async () => {
      await engine().parts.openTrigger.click();
      await engine().parts.dialog.within(dialogContentPart).disagree.click();
      // Settle the close transition before sampling, so isOpen() isn't read mid-fade.
      await engine().parts.dialog.waitForClose();
      const isOpen = await engine().parts.dialog.isOpen();
      assertFalse(isOpen);
    });

    // Regression for the interior anchor (ADR-019): MUI's dialog locator is the
    // portal-rendered Modal root, whose own children are the backdrop and two
    // focus-trap sentinels. `within` must resolve against the surface instead, or
    // every relative interior part silently addresses MUI chrome.
    test('Interior parts anchor on the dialog surface, not the modal root', async () => {
      await engine().parts.openTrigger.click();
      await engine().parts.dialog.waitForOpen();
      const firstChild = engine().parts.dialog.within(firstInteriorChildPart).firstChild;
      assertEqual(await firstChild.getText(), "Use Google's location service?");
    });

    test('Clicking the backdrop should close the dialog', async () => {
      await engine().parts.openTrigger.click();
      await engine().parts.dialog.waitForOpen();

      const closed = await engine().parts.dialog.closeByBackdropClick();
      assertTrue(closed);
      assertFalse(await engine().parts.dialog.isOpen());
    });
  },
};
