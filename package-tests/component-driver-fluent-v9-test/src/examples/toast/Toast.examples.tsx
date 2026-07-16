import { IExampleUIUnit } from '@atomic-testing/core';
import {
  Button,
  FluentProvider,
  Toast,
  ToastBody,
  Toaster,
  ToastTitle,
  useId,
  useToastController,
  webLightTheme,
} from '@fluentui/react-components';
import React, { JSX } from 'react';

const ToastHarness = () => {
  const toasterId = useId('toaster');
  const { dispatchToast } = useToastController(toasterId);

  return (
    <>
      <Button
        data-testid='dispatch-first-toast'
        onClick={() =>
          dispatchToast(
            <Toast>
              <ToastTitle>First toast</ToastTitle>
              <ToastBody>First toast body</ToastBody>
            </Toast>,
            { intent: 'success' }
          )
        }>
        Dispatch first toast
      </Button>
      <Button
        data-testid='dispatch-second-toast'
        onClick={() =>
          dispatchToast(
            <Toast>
              <ToastTitle>Second toast</ToastTitle>
              <ToastBody>Second toast body</ToastBody>
            </Toast>,
            { intent: 'info' }
          )
        }>
        Dispatch second toast
      </Button>
      <Toaster toasterId={toasterId} data-testid='toaster' />
    </>
  );
};

export const ToastExample = () => (
  <FluentProvider theme={webLightTheme}>
    <ToastHarness />
  </FluentProvider>
);

export const toastUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent Toast',
  ui: <ToastExample />,
};
