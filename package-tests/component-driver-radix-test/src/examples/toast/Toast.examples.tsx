import { IExampleUIUnit } from '@atomic-testing/core';
import { Toast } from 'radix-ui';
import React, { JSX, useState } from 'react';

/**
 * Radix Toast scene (Wave 3, #1005). The toast renders IN-TREE inside
 * `Toast.Viewport` (an `<ol>` wrapped in a hotkey-labelled landmark), not a
 * `document.body` portal. Open state is controlled by the trigger button so
 * tests drive it deterministically; `duration` is effectively infinite so the
 * auto-dismiss timer never races an assertion.
 */
export const ToastExample = () => {
  const [open, setOpen] = useState(false);
  return (
    <Toast.Provider swipeDirection='right'>
      <button data-testid='toast-trigger' onClick={() => setOpen(true)}>
        Save changes
      </button>
      <Toast.Root
        data-testid='toast-root'
        open={open}
        onOpenChange={setOpen}
        duration={600000}
        style={{ backgroundColor: 'white', border: '1px solid #888', padding: 8 }}>
        <Toast.Title data-testid='toast-title'>Changes saved</Toast.Title>
        <Toast.Description data-testid='toast-description'>Your changes have been saved.</Toast.Description>
        <Toast.Action altText='Undo the save' data-testid='toast-action'>
          Undo
        </Toast.Action>
        <Toast.Close data-testid='toast-close'>Dismiss</Toast.Close>
      </Toast.Root>
      <Toast.Viewport
        data-testid='toast-viewport'
        style={{ position: 'fixed', bottom: 0, right: 0, listStyle: 'none', margin: 0, padding: 8 }}
      />
    </Toast.Provider>
  );
};

export const toastUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Radix Toast',
  ui: <ToastExample />,
};
