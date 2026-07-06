import { IExampleUIUnit } from '@atomic-testing/core';
import { AlertDialog } from 'radix-ui';
import React, { JSX } from 'react';

/**
 * Radix AlertDialog scene (Wave 3, #1005). Overlay and content are each
 * portalled to `document.body` as siblings, mirroring Dialog; the content
 * renders `role="alertdialog"`.
 */
export const AlertDialogExample = () => (
  <AlertDialog.Root>
    <AlertDialog.Trigger data-testid='alert-dialog-trigger'>Delete account</AlertDialog.Trigger>
    <AlertDialog.Portal>
      <AlertDialog.Overlay
        data-testid='alert-dialog-overlay'
        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
      />
      <AlertDialog.Content
        data-testid='alert-dialog-content'
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: 16,
        }}>
        <AlertDialog.Title data-testid='alert-dialog-title'>Are you absolutely sure?</AlertDialog.Title>
        <AlertDialog.Description data-testid='alert-dialog-description'>
          This action cannot be undone.
        </AlertDialog.Description>
        <AlertDialog.Cancel data-testid='alert-dialog-cancel'>Cancel</AlertDialog.Cancel>
        <AlertDialog.Action data-testid='alert-dialog-action'>Yes, delete account</AlertDialog.Action>
      </AlertDialog.Content>
    </AlertDialog.Portal>
  </AlertDialog.Root>
);

export const alertDialogUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Radix AlertDialog',
  ui: <AlertDialogExample />,
};
