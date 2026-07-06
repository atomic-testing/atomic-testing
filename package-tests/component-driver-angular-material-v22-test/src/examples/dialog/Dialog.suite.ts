import { ButtonDriver, DialogDriver } from '@atomic-testing/component-driver-angular-material-v22';
import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { byAttribute, byDataTestId, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

const dialogContentPart = {
  cancel: {
    locator: byDataTestId('cancel-button'),
    driver: ButtonDriver,
  },
  archive: {
    locator: byDataTestId('archive-button'),
    driver: ButtonDriver,
  },
} satisfies ScenePart;

export const dialogScenePart = {
  openTrigger: {
    locator: byDataTestId('dialog-open-trigger'),
    driver: ButtonDriver,
  },
  // The dialog is located by the MatDialogConfig `id` the example opens it
  // with — the driver re-roots the lookup into the CDK overlay container.
  dialog: {
    locator: byAttribute('id', 'archive-dialog'),
    driver: DialogDriver<typeof dialogContentPart>,
    option: {
      content: dialogContentPart,
    },
  },
  result: {
    locator: byDataTestId('dialog-result'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

export const dialogTestSuite: TestSuiteInfo<typeof dialogScenePart> = {
  title: 'Angular Material v22 Dialog',
  url: '/dialog',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe('MatDialog', () => {
      const engine = useTestEngine(dialogScenePart, getTestEngine, { beforeEach, afterEach });

      async function waitForResult(expected: string): Promise<string | undefined> {
        // afterClosed() emits once the exit transition settles; probe rather
        // than assert immediately.
        return engine().parts.dialog.waitUntil({
          probeFn: async () => (await engine().parts.result.getText())?.trim(),
          terminateCondition: expected,
          timeoutMs: 5000,
        });
      }

      test('is not open initially', async () => {
        assertFalse(await engine().parts.dialog.isOpen());
      });

      test('opens from the trigger', async () => {
        await engine().parts.openTrigger.click();
        assertTrue(await engine().parts.dialog.waitForOpen());
        assertTrue(await engine().parts.dialog.isOpen());
      });

      test('resolves the title through the aria-labelledby link', async () => {
        await engine().parts.openTrigger.click();
        await engine().parts.dialog.waitForOpen();
        assertEqual(await engine().parts.dialog.getTitle(), 'Archive note');
      });

      test('closes from a content action button', async () => {
        await engine().parts.openTrigger.click();
        await engine().parts.dialog.waitForOpen();
        await engine().parts.dialog.content.archive.click();
        assertTrue(await engine().parts.dialog.waitForClose());
        assertEqual(await waitForResult('archived'), 'archived');
      });

      test('closes from the cancel button with the dismissed result', async () => {
        await engine().parts.openTrigger.click();
        await engine().parts.dialog.waitForOpen();
        await engine().parts.dialog.content.cancel.click();
        assertTrue(await engine().parts.dialog.waitForClose());
        assertEqual(await waitForResult('dismissed'), 'dismissed');
      });

      test('closes on backdrop click', async () => {
        await engine().parts.openTrigger.click();
        await engine().parts.dialog.waitForOpen();
        assertTrue(await engine().parts.dialog.closeByBackdropClick());
        assertFalse(await engine().parts.dialog.isOpen());
        assertEqual(await waitForResult('dismissed'), 'dismissed');
      });

      test('closes on Escape', async () => {
        await engine().parts.openTrigger.click();
        await engine().parts.dialog.waitForOpen();
        assertTrue(await engine().parts.dialog.closeByEscape());
        assertFalse(await engine().parts.dialog.isOpen());
        assertEqual(await waitForResult('dismissed'), 'dismissed');
      });
    });
  },
};
