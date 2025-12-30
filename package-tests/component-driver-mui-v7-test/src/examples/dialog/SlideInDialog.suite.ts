import { ButtonDriver, DialogDriver } from '@atomic-testing/component-driver-mui-v7';
import { byDataTestId, ScenePart, IExampleUnit } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

import { slideInDialogUIExample } from './SlideInDialog.examples';

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

export const slideInExampleScenePart = {
  openTrigger: {
    locator: byDataTestId('slidein-open-trigger'),
    driver: ButtonDriver,
  },
  dialog: {
    locator: byDataTestId('slidein-dialog'),
    driver: DialogDriver<typeof dialogContentPart>,
    option: {
      content: dialogContentPart,
    },
  },
} satisfies ScenePart;

export const slideInDialogExample: IExampleUnit<typeof slideInExampleScenePart, JSX.Element> = {
  ...slideInDialogUIExample,
  scene: slideInExampleScenePart,
};

export const slideinDialogTestSuite: TestSuiteInfo<typeof slideInDialogExample.scene> = {
  title: 'SlideIn dialog',
  url: '/dialog',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    const engine = useTestEngine(slideInDialogExample.scene, getTestEngine, { beforeEach, afterEach });

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
      await engine().parts.dialog.content.agree.click();
      await engine().parts.dialog.waitForClose();
      const isOpen = await engine().parts.dialog.isOpen();
      assertFalse(isOpen);
    });

    test('Dialog title should be correct', async () => {
      await engine().parts.openTrigger.click();
      const title = await engine().parts.dialog.getTitle();
      assertEqual(title, "Use Google's location service?");
    });
  },
};
