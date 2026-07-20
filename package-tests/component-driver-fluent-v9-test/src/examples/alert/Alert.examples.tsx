import { IExampleUIUnit } from '@atomic-testing/core';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { Alert } from '@fluentui/react-components/unstable';
import React, { JSX } from 'react';

export const AlertExample = () => (
  <FluentProvider theme={webLightTheme}>
    <Alert data-testid='alert-plain' intent='success'>
      Saved successfully
    </Alert>
    <Alert data-testid='alert-with-action' intent='error' action={{ children: 'Retry' }}>
      Something went wrong
    </Alert>
  </FluentProvider>
);

export const alertUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent Alert',
  ui: <AlertExample />,
};
