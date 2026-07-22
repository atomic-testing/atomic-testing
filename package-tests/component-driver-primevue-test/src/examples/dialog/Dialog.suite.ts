import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { ButtonDriver, DialogDriver, InputTextDriver } from '@atomic-testing/component-driver-primevue-v4';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

const dialogContentPart = {
  nameInput: {
    locator: byDataTestId('profile-name'),
    driver: InputTextDriver,
  },
  saveButton: {
    locator: byDataTestId('profile-save'),
    driver: ButtonDriver,
  },
} satisfies ScenePart;

export const dialogScenePart = {
  trigger: {
    locator: byDataTestId('open-dialog'),
    driver: ButtonDriver,
  },
  savedName: {
    locator: byDataTestId('saved-name'),
    driver: HTMLElementDriver,
  },
  dialog: {
    locator: byDataTestId('profile-dialog'),
    driver: DialogDriver<typeof dialogContentPart>,
    option: {
      content: dialogContentPart,
    },
  },
  selfAnchoredTrigger: {
    locator: byDataTestId('open-self-anchored-dialog'),
    driver: ButtonDriver,
  },
  selfAnchoredDialog: {
    locator: byDataTestId('self-anchored-dialog'),
    driver: DialogDriver<{}>,
    option: {
      selfAnchored: true,
      content: {},
    },
  },
} satisfies ScenePart;

export const dialogTestSuite: TestSuiteInfo<typeof dialogScenePart> = {
  title: 'PrimeVue Dialog',
  url: '/dialog',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe('PrimeVue Dialog', () => {
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

      test('reads the title through the aria-labelledby link', async () => {
        await openDialog();
        assertEqual(await engine().parts.dialog.getTitle(), 'Edit Profile');
      });

      test('drives the content scene through the teleported dialog', async () => {
        await openDialog();
        await engine().parts.dialog.content.nameInput.setValue('Ada Lovelace');
        await engine().parts.dialog.content.saveButton.click();
        assertTrue(await engine().parts.dialog.waitForClose());
        assertEqual(await engine().parts.savedName.getText(), 'Ada Lovelace');
      });

      test('closes via the header close button', async () => {
        await openDialog();
        assertTrue(await engine().parts.dialog.close());
        assertFalse(await engine().parts.dialog.isOpen());
      });

      test('closes on Escape', async () => {
        await openDialog();
        assertTrue(await engine().parts.dialog.closeByEscape());
        assertFalse(await engine().parts.dialog.isOpen());
      });

      test('supports a full open/close/reopen cycle', async () => {
        await openDialog();
        assertTrue(await engine().parts.dialog.close());
        await openDialog();
        assertTrue(await engine().parts.dialog.isOpen());
      });

      test('appendTo="self" dialog resolves and opens/closes in-tree (#1033)', async () => {
        assertFalse(await engine().parts.selfAnchoredDialog.isOpen());
        await engine().parts.selfAnchoredTrigger.click();
        assertTrue(await engine().parts.selfAnchoredDialog.waitForOpen());
        assertEqual(await engine().parts.selfAnchoredDialog.getTitle(), 'Self-anchored dialog');
        assertTrue(await engine().parts.selfAnchoredDialog.closeByEscape());
        assertFalse(await engine().parts.selfAnchoredDialog.isOpen());
      });
    });
  },
};
