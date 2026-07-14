import { IExampleUIUnit } from '@atomic-testing/core';
import { FluentProvider, Switch, webLightTheme } from '@fluentui/react-components';
import React, { JSX } from 'react';

export const SwitchExample = () => (
  <FluentProvider theme={webLightTheme}>
    <Switch data-testid='switch-labeled' label='Enable notifications' defaultChecked={false} />
    <Switch data-testid='switch-unlabeled' defaultChecked={false} />
    <Switch data-testid='switch-disabled' label='Disabled' disabled />
    <Switch data-testid='switch-required' label='Required' required />
  </FluentProvider>
);

export const switchUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent Switch',
  ui: <SwitchExample />,
};
