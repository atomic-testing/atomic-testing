import { IExampleUIUnit } from '@atomic-testing/core';
import { Dialog } from 'radix-ui';
import React, { JSX } from 'react';

/**
 * Radix Dialog audit scene (Wave 0 portal-recipe audit; no driver yet).
 * Content and overlay are portalled to `document.body`; the title/description
 * ids feed the trigger-less accname chain the #923 evaluation inspects.
 */
export const DialogExample = () => (
  <Dialog.Root>
    <Dialog.Trigger data-testid='dialog-trigger'>Open dialog</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay
        data-testid='dialog-overlay'
        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
      />
      <Dialog.Content
        data-testid='dialog-content'
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: 16,
        }}>
        <Dialog.Title data-testid='dialog-title'>Audit dialog</Dialog.Title>
        <Dialog.Description data-testid='dialog-description'>Dialog description for the audit.</Dialog.Description>
        <Dialog.Close data-testid='dialog-close'>Close</Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export const dialogUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Radix Dialog',
  ui: <DialogExample />,
};
