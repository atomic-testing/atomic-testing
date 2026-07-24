import { HTMLButtonDriver } from '@atomic-testing/component-driver-html';
import { DialogDriver } from '@atomic-testing/component-driver-reka-ui-v2';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

const dialogContentPart = {
  close: {
    locator: byDataTestId('dialog-close'),
    driver: HTMLButtonDriver,
  },
} satisfies ScenePart;

export const dialogScenePart = {
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

export const dialogTestSuite: TestSuiteInfo<typeof dialogScenePart> = {
  title: 'Reka UI Dialog',
  url: '/dialog',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe('Reka UI Dialog', () => {
      const engine = useTestEngine(dialogScenePart, getTestEngine, { beforeEach, afterEach });

      const openDialog = async () => {
        await engine().parts.trigger.click();
        await engine().parts.dialog.waitForOpen();
      };

      test('is not open initially', async () => {
        assertFalse(await engine().parts.dialog.isOpen());
      });

      test('clicking the trigger opens the dialog', async () => {
        await openDialog();
        assertTrue(await engine().parts.dialog.isOpen());
      });

      test('reads the dialog title', async () => {
        await openDialog();
        assertEqual(await engine().parts.dialog.getTitle(), 'Audit dialog');
      });

      test('clicking the close button closes the dialog', async () => {
        await openDialog();
        await engine().parts.dialog.content.close.click();
        await engine().parts.dialog.waitForClose();
        assertFalse(await engine().parts.dialog.isOpen());
      });

      test('pressing Escape closes the dialog', async () => {
        await openDialog();
        const closed = await engine().parts.dialog.closeByEscape();
        assertTrue(closed);
        assertFalse(await engine().parts.dialog.isOpen());
      });
    });
  },
};
