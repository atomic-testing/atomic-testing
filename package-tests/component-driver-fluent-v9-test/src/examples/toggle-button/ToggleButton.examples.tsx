import { IExampleUIUnit } from '@atomic-testing/core';
import { FluentProvider, ToggleButton, webLightTheme } from '@fluentui/react-components';
import React, { JSX } from 'react';

export const ToggleButtonExample = () => (
  <FluentProvider theme={webLightTheme}>
    <ToggleButton data-testid='toggle-button-off'>Off</ToggleButton>
    <ToggleButton data-testid='toggle-button-on' defaultChecked>
      On
    </ToggleButton>
  </FluentProvider>
);

export const toggleButtonUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent ToggleButton',
  ui: <ToggleButtonExample />,
};
