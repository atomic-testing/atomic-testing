import { ButtonDriver, DialogDriver } from '@atomic-testing/component-driver-mui-v7';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { IExampleUnit, TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

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

export const alertExampleScenePart = {
  openTrigger: {
    locator: byDataTestId('alert-open-trigger'),
    driver: ButtonDriver,
  },
  dialog: {
    locator: byDataTestId('alert-dialog'),
    driver: DialogDriver<typeof dialogContentPart>,
    option: {
      content: dialogContentPart,
    },
  },
} satisfies ScenePart;

export const alertDialogExample: IExampleUnit<typeof alertExampleScenePart, JSX.Element> = {
  ...alertDialogUIExample,
  scene: alertExampleScenePart,
};

export const alertDialogTestSuite: TestSuiteInfo<typeof alertDialogExample.scene> = {
  title: 'Alert dialog',
  url: '/dialog',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertTrue, assertFalse }) => {
    const engine = useTestEngine(alertDialogExample.scene, getTestEngine, { beforeEach, afterEach });

    test('Dialog should not be open initially', async () => {
      const isOpen = await engine().parts.dialog.isOpen();
      assertFalse(isOpen);
    });

    test('Clicking open trigger should open dialog', async () => {
      await engine().parts.openTrigger.click();
      // Wait out the open transition before asserting; isOpen() reads the
      // container's visibility, which is mid-animation right after the click.
      await engine().parts.dialog.waitForOpen();
      const isOpen = await engine().parts.dialog.isOpen();
      assertTrue(isOpen);
    });

    test('Clicking agree button should close dialog', async () => {
      await engine().parts.openTrigger.click();
      await engine().parts.dialog.waitForOpen();
      await engine().parts.dialog.content.agree.click();
      await engine().parts.dialog.waitForClose();
      const isOpen = await engine().parts.dialog.isOpen();
      assertFalse(isOpen);
    });

    test('Clicking disagree button should close dialog', async () => {
      await engine().parts.openTrigger.click();
      await engine().parts.dialog.waitForOpen();
      await engine().parts.dialog.content.disagree.click();
      await engine().parts.dialog.waitForClose();
      const isOpen = await engine().parts.dialog.isOpen();
      assertFalse(isOpen);
    });

    test('Clicking the backdrop should close the dialog', async () => {
      await engine().parts.openTrigger.click();
      await engine().parts.dialog.waitForOpen();

      const closed = await engine().parts.dialog.closeByBackdropClick();
      assertTrue(closed);
      assertFalse(await engine().parts.dialog.isOpen());
    });

    test('Pressing Escape should close the dialog', async () => {
      await engine().parts.openTrigger.click();
      await engine().parts.dialog.waitForOpen();

      const closed = await engine().parts.dialog.closeByEscape();
      assertTrue(closed);
      assertFalse(await engine().parts.dialog.isOpen());
    });
  },
};
