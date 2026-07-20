import { IExampleUIUnit } from '@atomic-testing/core';
import { FluentProvider, ProgressBar, webLightTheme } from '@fluentui/react-components';
import React, { JSX } from 'react';

export const ProgressBarExample = () => (
  <FluentProvider theme={webLightTheme}>
    <ProgressBar data-testid='progress-determinate' value={0.3} max={1} />
    <ProgressBar data-testid='progress-indeterminate' />
  </FluentProvider>
);

export const progressBarUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent ProgressBar',
  ui: <ProgressBarExample />,
};
