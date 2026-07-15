import { ButtonDriver, DialogDriver } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { dialogUIExample } from './Dialog.examples';

const modalDialogContentPart = {
  close: { locator: byDataTestId('dialog-modal-close'), driver: ButtonDriver },
  confirm: { locator: byDataTestId('dialog-modal-confirm'), driver: ButtonDriver },
} satisfies ScenePart;

export const dialogExampleScenePart = {
  modalTrigger: { locator: byDataTestId('dialog-modal-trigger'), driver: ButtonDriver },
  modalDialog: {
    locator: byDataTestId('dialog-modal'),
    driver: DialogDriver<typeof modalDialogContentPart>,
    option: { content: modalDialogContentPart },
  },
  aTrigger: { locator: byDataTestId('dialog-a-trigger'), driver: ButtonDriver },
  dialogA: { locator: byDataTestId('dialog-a'), driver: DialogDriver },
  bTrigger: { locator: byDataTestId('dialog-b-trigger'), driver: ButtonDriver },
  dialogB: { locator: byDataTestId('dialog-b'), driver: DialogDriver },
  noTitleTrigger: { locator: byDataTestId('dialog-no-title-trigger'), driver: ButtonDriver },
  dialogNoTitle: { locator: byDataTestId('dialog-no-title'), driver: DialogDriver },
} satisfies ScenePart;

export const dialogExample: IExampleUnit<typeof dialogExampleScenePart, JSX.Element> = {
  ...dialogUIExample,
  scene: dialogExampleScenePart,
};

export const dialogExampleTestSuite: TestSuiteInfo<typeof dialogExample.scene> = {
  title: 'Fluent Dialog',
  url: '/dialog',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe('Fluent Dialog', () => {
      const engine = useTestEngine(dialogExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('modal dialog is not open initially', async () => {
        assertFalse(await engine().parts.modalDialog.isOpen());
      });

      test('opens the modal dialog and reads its title', async () => {
        await engine().parts.modalTrigger.click();
        assertTrue(await engine().parts.modalDialog.waitForOpen());
        assertEqual(await engine().parts.modalDialog.getTitle(), 'Modal dialog title');
        assertTrue(await engine().parts.modalDialog.isModal());
      });

      test('closes the modal dialog via its own close button', async () => {
        await engine().parts.modalTrigger.click();
        await engine().parts.modalDialog.waitForOpen();
        await engine().parts.modalDialog.content.close.click();
        assertTrue(await engine().parts.modalDialog.waitForClose());
        assertFalse(await engine().parts.modalDialog.isOpen());
      });

      test('non-modal dialog reports isModal() as false', async () => {
        await engine().parts.aTrigger.click();
        await engine().parts.dialogA.waitForOpen();
        assertFalse(await engine().parts.dialogA.isModal());
      });

      test('two simultaneously open non-modal dialogs disambiguate correctly', async () => {
        await engine().parts.aTrigger.click();
        await engine().parts.dialogA.waitForOpen();
        await engine().parts.bTrigger.click();
        await engine().parts.dialogB.waitForOpen();

        assertTrue(await engine().parts.dialogA.isOpen());
        assertTrue(await engine().parts.dialogB.isOpen());
        assertEqual(await engine().parts.dialogA.getTitle(), 'Dialog A');
        assertEqual(await engine().parts.dialogB.getTitle(), 'Dialog B');
      });

      test('closing one of two open dialogs leaves the other open', async () => {
        await engine().parts.aTrigger.click();
        await engine().parts.dialogA.waitForOpen();
        await engine().parts.bTrigger.click();
        await engine().parts.dialogB.waitForOpen();

        // Escape dismisses the topmost stacked dialog (the last one opened) —
        // see DialogDriver.closeByEscape's class doc.
        assertTrue(await engine().parts.dialogB.closeByEscape());
        assertFalse(await engine().parts.dialogB.isOpen());
        assertTrue(await engine().parts.dialogA.isOpen());
        assertEqual(await engine().parts.dialogA.getTitle(), 'Dialog A');
      });

      test('getTitle returns null when DialogTitle is absent', async () => {
        await engine().parts.noTitleTrigger.click();
        await engine().parts.dialogNoTitle.waitForOpen();
        assertEqual(await engine().parts.dialogNoTitle.getTitle(), null);
      });
    });
  },
};
