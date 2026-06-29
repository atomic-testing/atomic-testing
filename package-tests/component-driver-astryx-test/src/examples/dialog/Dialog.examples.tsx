import { Dialog, DialogHeader } from '@astryxdesign/core/Dialog';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX, useState } from 'react';

/**
 * Astryx Dialog scene.
 *
 * Dialog is controlled and renders a native `<dialog>` (opened via `showModal()`),
 * so the scene wires an explicit "Open" trigger and `onOpenChange`. The
 * `DialogHeader` supplies the `<h2>` title the driver reads; the default `info`
 * purpose allows Escape and backdrop dismissal.
 */
export const DialogExample = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button type='button' data-testid='open-dialog' onClick={() => setOpen(true)}>
        Open dialog
      </button>
      <Dialog isOpen={open} onOpenChange={setOpen} data-testid='dialog'>
        <DialogHeader title='Confirm action' onOpenChange={setOpen} />
        <div>Are you sure you want to continue?</div>
      </Dialog>
    </div>
  );
};

export const dialogUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx Dialog',
  ui: <DialogExample />,
};
