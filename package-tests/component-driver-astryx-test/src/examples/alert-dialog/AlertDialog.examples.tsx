import { AlertDialog } from '@astryxdesign/core/AlertDialog';
import { IExampleUIUnit } from '@atomic-testing/internal-test-runner';
import React, { JSX, useState } from 'react';

/**
 * Astryx AlertDialog scene.
 *
 * AlertDialog is controlled and builds its own title/description/buttons inside a
 * native `<dialog role="alertdialog">`. The scene wires an "Open" trigger and a
 * marker that records whether the action fired (AlertDialog does not auto-close on
 * action).
 */
export const AlertDialogExample = () => {
  const [open, setOpen] = useState(false);
  const [actioned, setActioned] = useState(false);
  return (
    <div>
      <button type='button' data-testid='open-alert' onClick={() => setOpen(true)}>
        Open alert
      </button>
      <AlertDialog
        isOpen={open}
        onOpenChange={setOpen}
        title='Delete item?'
        description='This action cannot be undone.'
        actionLabel='Delete'
        cancelLabel='Cancel'
        onAction={() => setActioned(true)}
        data-testid='alert-dialog'
      />
      <div data-testid='alert-actioned'>{actioned ? 'yes' : 'no'}</div>
    </div>
  );
};

export const alertDialogUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx AlertDialog',
  ui: <AlertDialogExample />,
};
