import { IExampleUIUnit } from '@atomic-testing/core';
import { FluentProvider, Spinner, webLightTheme } from '@fluentui/react-components';
import React, { JSX } from 'react';

export const SpinnerExample = () => (
  <FluentProvider theme={webLightTheme}>
    <Spinner data-testid='spinner-labeled' label='Loading...' />
    <Spinner data-testid='spinner-unlabeled' />
  </FluentProvider>
);

export const spinnerUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent Spinner',
  ui: <SpinnerExample />,
};
