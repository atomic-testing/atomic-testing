import { ButtonDriver, DialogDriver } from '@atomic-testing/component-driver-mui-v6';
import { TestEngine, byDataTestId, ScenePart, IExampleUnit } from '@atomic-testing/core';
import { TestFixture, TestSuiteInfo } from '@atomic-testing/internal-test-runner';

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
    let testEngine: TestEngine<typeof alertDialogExample.scene>;

    beforeEach(function ({ page }: TestFixture) {
      testEngine = getTestEngine(alertDialogExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        (arguments[0] as () => void)();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });

    test('Dialog should not be open initially', async () => {
      const isOpen = await testEngine.parts.dialog.isOpen();
      assertFalse(isOpen);
    });

    test('Clicking open trigger should open dialog', async () => {
      await testEngine.parts.openTrigger.click();
      const isOpen = await testEngine.parts.dialog.isOpen();
      assertTrue(isOpen);
    });

    test('Clicking agree button should close dialog', async () => {
      await testEngine.parts.openTrigger.click();
      await testEngine.parts.dialog.content.agree.click();
      const isOpen = await testEngine.parts.dialog.isOpen();
      assertFalse(isOpen);
    });

    test('Clicking disagree button should close dialog', async () => {
      await testEngine.parts.openTrigger.click();
      await testEngine.parts.dialog.content.disagree.click();
      const isOpen = await testEngine.parts.dialog.isOpen();
      assertFalse(isOpen);
    });
  },
};
