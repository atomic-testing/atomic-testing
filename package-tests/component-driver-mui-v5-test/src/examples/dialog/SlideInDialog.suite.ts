import { ButtonDriver, DialogDriver } from '@atomic-testing/component-driver-mui-v5';
import { TestEngine, byDataTestId, ScenePart, IExampleUnit } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/internal-test-runner';

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
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual }) => {
    let testEngine: TestEngine<typeof slideInDialogExample.scene>;

    // Use the following beforeEach to work around the issue of Playwright's page being undefined
    // @ts-ignore
    beforeEach(function ({ page }) {
      // @ts-ignore
      testEngine = getTestEngine(slideInDialogExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        arguments[0]();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });

    test('Dialog should not be open initially', async () => {
      const isOpen = await testEngine.parts.dialog.isOpen();
      assertEqual(isOpen, false);
    });

    test('Clicking open trigger should open dialog', async () => {
      await testEngine.parts.openTrigger.click();
      const isOpen = await testEngine.parts.dialog.isOpen();
      assertEqual(isOpen, true);
    });

    test('Clicking agree button should close dialog', async () => {
      await testEngine.parts.openTrigger.click();
      await testEngine.parts.dialog.content.agree.click();
      await testEngine.parts.dialog.waitForClose();
      const isOpen = await testEngine.parts.dialog.isOpen();
      assertEqual(isOpen, false);
    });

    test('Dialog title should be correct', async () => {
      await testEngine.parts.openTrigger.click();
      const title = await testEngine.parts.dialog.getTitle();
      assertEqual(title, "Use Google's location service?");
    });
  },
};
