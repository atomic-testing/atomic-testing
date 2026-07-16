import { IExampleUIUnit } from '@atomic-testing/core';
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  FluentProvider,
  webLightTheme,
} from '@fluentui/react-components';
import React, { JSX } from 'react';

export const DialogExample = () => (
  <FluentProvider theme={webLightTheme}>
    <Dialog modalType='modal'>
      <DialogTrigger disableButtonEnhancement>
        <Button data-testid='dialog-modal-trigger'>Open modal dialog</Button>
      </DialogTrigger>
      <DialogSurface data-testid='dialog-modal'>
        <DialogBody>
          <DialogTitle>Modal dialog title</DialogTitle>
          <DialogContent>Modal dialog content</DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance='secondary' data-testid='dialog-modal-close'>
                Close
              </Button>
            </DialogTrigger>
            <Button appearance='primary' data-testid='dialog-modal-confirm'>
              Confirm
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>

    <Dialog modalType='non-modal'>
      <DialogTrigger disableButtonEnhancement>
        <Button data-testid='dialog-a-trigger'>Open dialog A</Button>
      </DialogTrigger>
      <DialogSurface data-testid='dialog-a'>
        <DialogBody>
          <DialogTitle>Dialog A</DialogTitle>
          <DialogContent>Content A</DialogContent>
        </DialogBody>
      </DialogSurface>
    </Dialog>

    <Dialog modalType='non-modal'>
      <DialogTrigger disableButtonEnhancement>
        <Button data-testid='dialog-b-trigger'>Open dialog B</Button>
      </DialogTrigger>
      <DialogSurface data-testid='dialog-b'>
        <DialogBody>
          <DialogTitle>Dialog B</DialogTitle>
          <DialogContent>Content B</DialogContent>
        </DialogBody>
      </DialogSurface>
    </Dialog>

    <Dialog modalType='non-modal'>
      <DialogTrigger disableButtonEnhancement>
        <Button data-testid='dialog-no-title-trigger'>Open untitled dialog</Button>
      </DialogTrigger>
      <DialogSurface data-testid='dialog-no-title'>
        <DialogBody>
          <DialogContent>No title here</DialogContent>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  </FluentProvider>
);

export const dialogUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent Dialog',
  ui: <DialogExample />,
};
